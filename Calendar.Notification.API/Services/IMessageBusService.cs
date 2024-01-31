using RabbitMQ.Client.Events;

namespace Calendar.Notification.API.Services
{
    public interface IMessageBusService
    {
        Task ConsumerReceiverHandler<T>(object? sender, BasicAckEventArgs e, T entity);
    }
}
