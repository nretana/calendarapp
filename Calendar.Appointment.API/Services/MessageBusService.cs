
using Calendar.Appointment.API.Configuration;
using Calendar.Shared.MessageBus.RequestReply;
using Microsoft.Extensions.Options;
using RabbitMQ.Client.Events;

namespace Calendar.Appointment.API.Services
{
    public class MessageBusService: BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IOptions<MessageBusConfiguration> _messageBusConfiguration;
        private const string ReplyQueueName = "calendar_reply_rpc_queue";


        public MessageBusService(IServiceScopeFactory serviceScopeFactory, IOptions<MessageBusConfiguration> messageBusConfiguration)
        {
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _messageBusConfiguration = messageBusConfiguration ?? throw new ArgumentNullException(nameof(_messageBusConfiguration));

        }

        protected override Task ExecuteAsync(CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var requesMessageBus = scope.ServiceProvider.GetRequiredService<IRequestMessageBus>();

                requesMessageBus.Open(_messageBusConfiguration.Value.Uri);
                requesMessageBus.CreateReplyQueue(ReplyQueueName);

                var replyToQueueName = requesMessageBus.BasicProperties.ReplyTo;

                requesMessageBus.SubscribeToReply<Context.Entities.Event, BasicDeliverEventArgs>(_messageBusConfiguration.Value.Uri, 
                                                                                                 string.Empty,
                                                                                                 replyToQueueName, 
                                                                                                 replyToQueueName).GetAwaiter();
            }

            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using(var scope = _serviceScopeFactory.CreateScope())
            {
                var requesMessageBus = scope.ServiceProvider.GetRequiredService<IRequestMessageBus>();
                requesMessageBus.Close();
            }

            return Task.CompletedTask;
        }
    }
}
