using Calendar.Shared.Enum;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Shared.MessageBus.RequestReply
{
    public interface IResponseMessageBus
    {
        IModel Channel { get; }

        void Open(string Uri, string contentType = "application/json");

        void CreateQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey, Dictionary<string, object> arguments = null);

        Task Subscribe<T, TEVentArgs>(string uri, string exchangeName, string queueName, string routingKey,
                                                    Dictionary<string, object> arguments = null);

        Task ConsumerRequestHandler<T>(object? sender, BasicDeliverEventArgs args);

        Task PublishReplay<T>(T message, string exchangeName = "", string routingKey = "");

        void Dispose();

        void Close();
    }
}
