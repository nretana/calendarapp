using Calendar.Shared.Enum;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Calendar.Shared.MessageBus.PubSub
{

    public class MessageBus : IMessageBus
    {
        private static ConnectionFactory? _connectionFactory;
        private static IConnection? _connection;
        private static IModel? _channel;
        private readonly ILogger<MessageBus> _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public MessageBus(ILogger<MessageBus> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
        }

        public IModel Channel => _channel;


        /// <summary>
        /// Open a connection to the message broker
        /// </summary>
        /// <param name="Uri"></param>
        public void Open(string Uri, string sslServerName)
        {
            if (_connection is not null && _connection.IsOpen)
            {
                return;
            }

            _connectionFactory = new ConnectionFactory() { DispatchConsumersAsync = true };
            _connectionFactory.Uri = new Uri(Uri);
            _connectionFactory.Ssl.Enabled = true;
            _connectionFactory.Ssl.ServerName = sslServerName;

            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.CallbackException += (channel, args) =>
            {
                _logger.LogError($"Channel connection failed {channel}");
            };
        }


        /// <summary>
        /// create a message queue. If the message queue already exists, it will not be created
        /// </summary>
        /// <param name="exchangeName"></param>
        /// <param name="exchangeType"></param>
        /// <param name="queueName"></param>
        /// <param name="routingKey"></param>
        public void CreateMessageQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey, bool durable = false, IDictionary<string, object>? arguments = null)
        {
            _channel?.ExchangeDeclare(exchangeName, exchangeType.ToString().ToLower(), false, false, null);
            _channel?.QueueDeclare(queueName, durable, false, false, arguments);
            _channel?.QueueBind(queueName, exchangeName, routingKey: routingKey);
        }


        /// <summary>
        /// Send a message to the queue specified by the arguments
        /// </summary>
        /// <param name="message"></param>
        /// <param name="Uri"></param>
        /// <param name="exchangeName"></param>
        /// <param name="queueName"></param>
        /// <param name="routingKey"></param>
        /// <returns></returns>
        public void Publish<T>(T message, string Uri, string exchangeName, string queueName, string routingKey, bool durable = false, bool deadLetterExchange = false)
        {
            try
            {
                _logger.LogInformation($"send data to exchange: [{exchangeName}] and message queue: [{queueName}]");
                var arguments = new Dictionary<string, object>() { { "x-max-length", 1000 } };

                //create dead letter queue
                if (deadLetterExchange)
                {
                    CreateMessageQueue("direct_calendar_dead_letter_exchange", Exchange.Direct, "calendar_dead_letter_queue", "calendar_dead_letter_queue", durable: true, arguments);
                    arguments.Add("x-dead-letter-exchange", "direct_calendar_dead_letter_exchange");
                    arguments.Add("x-dead-letter-routing-key", "calendar_dead_letter_queue");
                }

                CreateMessageQueue(exchangeName, Exchange.Direct, queueName, routingKey, durable, arguments);

                var jsonObj = JsonConvert.SerializeObject(message);
                byte[] messageBody = Encoding.UTF8.GetBytes(jsonObj);
                var channelProps = _channel?.CreateBasicProperties();
                channelProps.Persistent = true;
                _channel?.BasicPublish(exchangeName, routingKey, channelProps, messageBody);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error trying to send message to exchange: [{exchangeName}] and message queue: [{queueName}], {ex}");
                throw;
            }
        }


        /// <summary>
        /// subscribe to a message queue
        /// </summary>
        /// <returns></returns>
        public Task Subscribe<T>(string Uri, string exchangeName, string queueName, string routingKey, bool durable = false)
        {
            var arguments = new Dictionary<string, object>() { { "x-max-length", 1000 } };
            CreateMessageQueue(exchangeName, Exchange.Direct, queueName, routingKey, durable, arguments);
            _channel?.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += ConsumerReceived<T>;
            string consumerTag = _channel.BasicConsume(queue: queueName, autoAck: false, consumer);

            return Task.CompletedTask;
        }


        /// <summary>
        /// Generic method to subscribe and consume messages from message queue. 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TEventArgs"></typeparam>
        /// <param name="Uri"></param>
        /// <param name="exchangeName"></param>
        /// <param name="queueName"></param>
        /// <param name="routingKey"></param>
        /// <param name="eventHandler"></param>
        /// <param name="durable"></param>
        /// <param name="deadLetterExchange"></param>
        /// <returns></returns>
        public async Task Subscribe<T, TEventArgs>(string Uri, string exchangeName, string queueName, string routingKey,
                                                       Func<object, TEventArgs, IServiceScopeFactory, Task> eventHandler, bool durable = false, bool deadLetterExchange = false)
        {
            try
            {
                _logger.LogInformation($"Subscribe to exchange: [{exchangeName}] and message queue: [{queueName}]");
                var arguments = new Dictionary<string, object>() { { "x-max-length", 1000 } };

                //create dead letter queue
                if (deadLetterExchange)
                {
                    CreateMessageQueue("direct_calendar_dead_letter_exchange", Exchange.Direct, "calendar_dead_letter_queue", "calendar_dead_letter_queue", durable: true, arguments);
                    arguments.Add("x-dead-letter-exchange", "direct_calendar_dead_letter_exchange");
                    arguments.Add("x-dead-letter-routing-key", "calendar_dead_letter_queue");
                }

                CreateMessageQueue(exchangeName, Exchange.Direct, queueName, routingKey, durable, arguments);

                var count = _channel?.MessageCount(queueName) ?? 0;
                _channel?.BasicQos(prefetchSize: 0, prefetchCount: (ushort)count, global: false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                var events = consumer.GetType().GetEvents();
                var eventFound = events.Where(@event => @event.EventHandlerType.GenericTypeArguments.Contains(typeof(TEventArgs))).FirstOrDefault();

                //subscribe event handlers
                if (eventFound != null)
                {
                    var eventDelegate = Delegate.CreateDelegate(eventHandler.GetType(), null, eventHandler.GetMethodInfo());
                    var senderParam = Expression.Parameter(typeof(object), "sender");
                    var eventArgsParam = Expression.Parameter(typeof(TEventArgs), "args");
                    var invokeDelegate = Expression.Invoke(Expression.Constant(eventDelegate), senderParam, eventArgsParam, Expression.Constant(_serviceScopeFactory));
                    var bodyEventHandler = Expression.Block(invokeDelegate);
                    //asyncEventHandler type dynamically
                    Type eventHandlerType = typeof(AsyncEventHandler<>).MakeGenericType(typeof(TEventArgs)); //var consumerDelegate = Expression.Lambda<AsyncEventHandler<BasicDeliverEventArgs>>(body, senderParam, argsParam);

                    var consumerDelegate = Expression.Lambda(eventHandlerType, bodyEventHandler, senderParam, eventArgsParam);
                    eventFound.AddEventHandler(consumer, consumerDelegate.Compile());
                }

                string consumerTag = _channel.BasicConsume(queue: queueName, autoAck: false, consumer);
            }
            catch(Exception ex)
            {
                _logger.LogError($"Error trying to subscribe to exchange: [{exchangeName}] and message queue: [{queueName}], {ex}");
                throw;
            }
        }

        /// <summary>
        /// Acknowledge a message was received
        /// </summary>
        /// <param name="deliveryTag"></param>
        /// <param name="isMultiple"></param>
        public void BasicAcknowledge(ulong deliveryTag, bool isMultiple)
        {
            _channel?.BasicAck(deliveryTag, multiple: isMultiple);
        }


        /// <summary>
        /// event handler for retrieveing the message from the queue
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual Task ConsumerReceived<T>(object sender, BasicDeliverEventArgs args)
        {
            try
            {
                var bytesResult = args.Body.ToArray();
                var calendarEvent = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(bytesResult));
                //HandleMessage(message).GetAwaiter().GetResult();

                _channel?.BasicAck(args.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                _channel?.BasicReject(args.DeliveryTag, false);
                _logger.LogError($"Error proccessing message: {ex}");
                throw;
            }
            return Task.CompletedTask;
        }


        /// <summary>
        /// Handler to process the message to perform other operations
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public virtual async Task<T> HandleMessage<T>(T message)
        {
            _logger.LogInformation($"Message consumed!");
            return message;
        }


        /// <summary>
        /// close current connection to the message broker
        /// </summary>
        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }


        /// <summary>
        /// close current connection to the message broker
        /// </summary>
        public void Close()
        {
            _channel?.Close();
            _connection?.Close();
        }
    }
}
