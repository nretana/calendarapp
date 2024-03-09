using Calendar.Shared.Enum;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Calendar.Shared.MessageBus.RequestReply
{
    public interface IRequestMessageBus
    {
        IModel Channel { get; }

        IBasicProperties BasicProperties { get; }

        void Open(string Uri);

        void CreateReplyQueue(string queueName, string contentType = "application/json");

        void CreateQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey,
                                        Dictionary<string, object> arguments = null);

        Task<object> Publish<T>(T message, string uri, string exchangeName, string queueName, string routingKey,
                                        Dictionary<string, object> arguments, CancellationToken cancellationToken);

        Task SubscribeToReply<T, TEVentArgs>(string uri, string exchangeName, string queueName, string routingKey,
                                        Dictionary<string, object> arguments = null);

        Task ConsumeReplyEventHandler<T>(object? sender, BasicDeliverEventArgs args);

        void Dispose();

        void Close();
    }
}
