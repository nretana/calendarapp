using Calendar.Shared.Enum;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Shared.MessageBus.RequestReply
{
    public class ResponseMessageBus : IResponseMessageBus
    {
        private ConnectionFactory _connectionFactory;
        private IConnection _connection;
        private IModel _channel;
        private IBasicProperties _basicProperties;
        private readonly ILogger<ResponseMessageBus> _logger;

        public ResponseMessageBus()
        {

        }

        public IModel Channel => _channel;

        public void Open(string Uri, string contentType = "application/json")
        {
            _connectionFactory = new ConnectionFactory() { DispatchConsumersAsync = true };
            _connectionFactory.Uri = new Uri(Uri);
            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();
        }


        public void CreateQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey, Dictionary<string, object> arguments = null)
        {
            _channel.ExchangeDeclare(exchangeName, exchangeType.ToString().ToLower(), false, false, null);
            _channel.QueueDeclare(queueName, false, false, false, null);
            _channel.QueueBind(queueName, exchangeName, routingKey, null);
        }

        public async Task Subscribe<T, TEVentArgs>(string uri, string exchangeName, string queueName, string routingKey,
                                                    Dictionary<string, object> arguments = null)
        {
            try
            {
                Open(uri);
                CreateQueue(exchangeName, Exchange.Direct, queueName, routingKey, null);

                _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.Received += ConsumerRequestHandler<T>;
                var consumerTag = _channel.BasicConsume(queueName, autoAck: false, consumer);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public Task ConsumerRequestHandler<T>(object? sender, BasicDeliverEventArgs args)
        {
            if (sender is null) throw new ArgumentNullException(nameof(sender));
            var currentChannel = ((AsyncEventingBasicConsumer)sender).Model;

            try
            {
                var body = args.Body.ToArray();

                //deserialize and process data
                var result = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(body));


                //serialize
                var json = JsonConvert.SerializeObject(result);
                byte[] message = Encoding.UTF8.GetBytes(json);

                var replyProperties = _channel.CreateBasicProperties();
                var routingKey = args.BasicProperties.ReplyTo;
                replyProperties.CorrelationId = args.BasicProperties.CorrelationId;
                replyProperties.ReplyTo = args.BasicProperties.ReplyTo;

                currentChannel.BasicPublish(string.Empty, routingKey, replyProperties, message);
                currentChannel.BasicAck(args.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                currentChannel.BasicReject(args.DeliveryTag, false);
                throw;
            }

            return Task.CompletedTask;
        }

        public async Task PublishReplay<T>(T message, string exchangeName = "", string routingKey = "")
        {
            var json = JsonConvert.SerializeObject(message);

            var body = Encoding.UTF8.GetBytes(json);

            _channel.BasicPublish(exchangeName, routingKey, _basicProperties, body);
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
