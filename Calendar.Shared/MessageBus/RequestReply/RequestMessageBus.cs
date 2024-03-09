using Calendar.Shared.Enum;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Collections.Concurrent;
using System.Text;

namespace Calendar.Shared.MessageBus.RequestReply
{
    public class RequestMessageBus : IRequestMessageBus
    {
        private ConnectionFactory _connectionFactory;
        private IConnection _connection;
        private IModel _channel;
        private IBasicProperties _basicProperties;
        private readonly ILogger<RequestMessageBus> _logger;
        private string _replayQueueName = string.Empty;
        private string _correlationId = string.Empty;
        private ManualResetEvent _responseReceived;
        private readonly ConcurrentDictionary<string, TaskCompletionSource<object>> _activeTaskQueue = new();

        public RequestMessageBus()
        {

        }

        public IModel Channel => _channel;


        public IBasicProperties BasicProperties => _basicProperties;


        public void Open(string Uri)
        {
            _connectionFactory = new ConnectionFactory() { DispatchConsumersAsync = true };
            _connectionFactory.Uri = new Uri(Uri);
            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();
        }


        public void CreateReplyQueue(string queueName, string contentType = "application/json")
        {
            _channel.QueueDeclare(queueName, false, false, false, null);
            _correlationId = Guid.NewGuid().ToString();

            _basicProperties = _channel.CreateBasicProperties();
            _basicProperties.ContentType = contentType;
            _basicProperties.CorrelationId = _correlationId;
            _basicProperties.ReplyTo = queueName;
        }


        public void CreateQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey,
                                        Dictionary<string, object> arguments = null)
        {
            _channel.ExchangeDeclare(exchangeName, exchangeType.ToString().ToLower(), false, false, null);
            _channel.QueueDeclare(queueName, false, false, false, null);
            _channel.QueueBind(queueName, exchangeName, routingKey, null);
        }


        public Task<object> Publish<T>(T message, string uri, string exchangeName, string queueName, string routingKey,
                                        Dictionary<string, object> arguments, CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<object>();
            try
            {

                CreateQueue(exchangeName, Exchange.Direct, queueName, routingKey, null);

                var json = JsonConvert.SerializeObject(message);
                var bytesArr = Encoding.UTF8.GetBytes(json);


                _activeTaskQueue.TryAdd(_correlationId, taskCompletionSource);

                _channel?.BasicPublish(exchangeName, routingKey, _basicProperties, bytesArr);

                //wait event handler execution
                _responseReceived.WaitOne();

                cancellationToken.Register(() => _activeTaskQueue.TryRemove(_correlationId, out _));
            }
            catch (Exception ex)
            {
                throw;
            }
            return taskCompletionSource.Task;
        }

        public async Task SubscribeToReply<T, TEVentArgs>(string uri, string exchangeName, string queueName, string routingKey,
                                                    Dictionary<string, object> arguments = null)
        {
            try
            {
                if (_channel.IsClosed)
                {
                    Open(uri);
                }

                _responseReceived = new ManualResetEvent(false);
                _channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
                _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.Received += ConsumeReplyEventHandler<T>;
                var consumerTag = _channel.BasicConsume(queueName, autoAck: true, consumer);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public Task ConsumeReplyEventHandler<T>(object? sender, BasicDeliverEventArgs args)
        {
            Console.WriteLine("Consuming response!!!");
            if (sender is null)
            {
                throw new ArgumentNullException(nameof(sender));
            }

            var currentChannel = ((AsyncEventingBasicConsumer)sender).Model;

            try
            {
                var correlationId = args.BasicProperties.CorrelationId;

                if (!_activeTaskQueue.TryRemove(correlationId, out var taskSource))
                {
                    return Task.CompletedTask;
                }

                var body = args.Body.ToArray();
                var result = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(body));

                currentChannel.BasicAck(args.DeliveryTag, false);

                taskSource?.TrySetResult(result);
                _responseReceived.Set();
            }
            catch (Exception ex)
            {
                throw;
            }
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }

        public void Close()
        {
            _channel?.Close();
            _connection?.Close();
        }
    }
}
