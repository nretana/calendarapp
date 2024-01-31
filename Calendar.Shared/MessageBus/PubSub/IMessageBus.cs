using Calendar.Shared.Enum;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Calendar.Shared.MessageBus.PubSub
{
    public interface IMessageBus
    {
        IModel Channel { get; }

        void Open(string Uri);

        void CreateMessageQueue(string exchangeName, Exchange exchangeType, string queueName, string routingKey, bool durable = false, IDictionary<string, object>? arguments = null);

        void Publish<T>(T message, string Uri, string exchangeName, string queueName, string routingKey, bool durable = false, bool deadLetterExchange = false);

        Task Subscribe<T>(string Uri, string exchangeName, string queueName, string routingKey, bool durable = false);

        Task Subscribe<T, TEventArgs>(string Uri, string exchangeName, string queueName, string routingKey,
                                                       Func<object?, TEventArgs, IServiceScopeFactory, Task> eventHandler, bool durable = false, bool deadLetterExchange = false);

        Task<T> HandleMessage<T>(T message);

        void Dispose();

        void Close();

        void BasicAcknowledge(ulong deliveryTag, bool isMultiple);
    }
}
