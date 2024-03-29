using Calendar.Appointment.API.Configuration;
using Calendar.Shared.MessageBus.PubSub;
using Microsoft.Extensions.Options;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MessageBrokerServiceExtension
    {

        public static IServiceCollection AddMessageBroker(this IServiceCollection services)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            var serviceProvider = services.BuildServiceProvider();
            var messageBusService = serviceProvider.GetRequiredService<IMessageBus>();
            var messageBusConfiguration = serviceProvider.GetRequiredService<IOptions<MessageBusConfiguration>>();
            
            messageBusService.Open(messageBusConfiguration.Value.Uri, messageBusConfiguration.Value.SslServerName);

            return services;
        }

    }
}
