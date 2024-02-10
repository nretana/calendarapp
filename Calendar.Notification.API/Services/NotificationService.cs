using Calendar.Notification.API.Configuration;
using Calendar.Notification.API.Enum;
using Calendar.Notification.API.Models;
using Calendar.Notification.API.Utilities;
using Calendar.Shared.Email;
using Calendar.Shared.MessageBus.PubSub;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using System.Text;
using System.Resources;
using System.Reflection;
using Calendar.Notification.API.Utilities.Resources;

namespace Calendar.Notification.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IMessageBus _messageBus;
        private readonly IOptions<MessageBusConfiguration> _messageBusConfiguration;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IMessageBus messageBus,
                                   IOptions<MessageBusConfiguration> messageBusConfiguration,
                                   ILogger<NotificationService> logger)
        {
            _messageBus = messageBus ?? throw new ArgumentNullException(nameof(messageBus));
            _messageBusConfiguration = messageBusConfiguration ?? throw new ArgumentNullException(nameof(messageBusConfiguration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }


        public async Task AddNotification()
        {
            try
            {
                _logger.LogInformation($"Running background service");
                _logger.LogInformation($"Subscribe to exchange: [{_messageBusConfiguration.Value.ExchangeNames["CalendarExchange"]}]," +
                                                    $"message queue: [{_messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"]}]");
                await _messageBus.Subscribe<EventNotification<EventDto>, BasicDeliverEventArgs>(_messageBusConfiguration.Value.Uri,
                                                                                        _messageBusConfiguration.Value.ExchangeNames["CalendarExchange"],
                                                                                        _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                                                        _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                                                        ConsumerReceiverHandler, durable: false, deadLetterExchange: false);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// event handler for consumer in pub/sub pattern
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public Task ConsumerReceiverHandler(object? sender, BasicDeliverEventArgs args, IServiceScopeFactory serviceScopeFactory)
        {
            if (sender is null)
            {
                throw new ArgumentNullException(nameof(sender));
            }

            if(serviceScopeFactory is null)
            {
                throw new ArgumentNullException(nameof(serviceScopeFactory));
            }

            var currentChannel = ((AsyncEventingBasicConsumer)sender).Model;
            using var scope = serviceScopeFactory.CreateScope();
            var _logger = scope.ServiceProvider.GetRequiredService<ILogger<NotificationService>>();
            var _userEmailConfig = scope.ServiceProvider.GetRequiredService<IOptions<UserEmailConfiguration>>().Value;

            try
            {
                _logger.LogInformation($"Consume data from message queue bound to exchange [{args.Exchange}]");
                var bytesResult = args.Body.ToArray();
                var eventNotification = JsonConvert.DeserializeObject<EventNotification<EventDto>>(Encoding.UTF8.GetString(bytesResult));
                
                var message = CreateEmailMessage(eventNotification, _userEmailConfig);
                var _emailservice = scope.ServiceProvider.GetRequiredService<IEmailSender>();
                _emailservice.SendEmailAsync(message).GetAwaiter();

                currentChannel.BasicAck(args.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                //rejects the message
                currentChannel.BasicReject(args.DeliveryTag, false);
                
                _logger.LogError($"Error proccessing data from message queue bound to exchange [{args.Exchange}]: {ex}");
                throw;
            }
            return Task.CompletedTask;
        }


        /// <summary>
        /// TODO: user data is comming from configuration file. 
        /// It will be replaced by the integration of Identity Web API
        /// </summary>
        /// <param name="eventNotification"></param>
        /// <returns></returns>
        private static EmailMessage CreateEmailMessage(EventNotification<EventDto> eventNotification, UserEmailConfiguration userEmail)
        {
            ArgumentException.ThrowIfNullOrEmpty(userEmail.UserName);
            ArgumentException.ThrowIfNullOrEmpty(userEmail.UserEmail);

            var htmlTemplateStr = EmailHelper.BuildEmailTemplate("Utilities/Templates", "NotificationTemplate.html");

            var htmlMessage = string.Format(GetMessageByEventOperationType(eventNotification.EventOperationType), 
                                                                                eventNotification.CurrentData?.Title,
                                                                                eventNotification.CurrentData?.EventDate.ToString("dddd, dd MMMM yyyy"),
                                                                                eventNotification.CurrentData?.StartTime.ToString("hh:mm tt"));
            
            var emailBody = htmlTemplateStr.Replace("[UserName]", userEmail?.UserName)
                                           .Replace("[EventNotificationMessage]", htmlMessage)
                                           .Replace("[UserEmail]", userEmail?.UserEmail)
                                           .Replace("[AppName]", "Chronos");

            /*List<EmailAttachment> emailAttachList = new() {
                    EmailHelper.GetEmailAttachment("Utilities/Templates/Imgs", "email.png")
                };*/

            var linkedResources = new Dictionary<string, string>() { { "[BrandImgSrc]", "Utilities/Templates/Imgs/brand_logo.png" } };

            var message = new EmailMessage(new string[] { userEmail.UserEmail },
                                                          subject: "Event Notification",
                                                          body: emailBody,
                                                          linkedResources: linkedResources);
            return message;
        }

        public static string GetMessageByEventOperationType(EventOperationType eventOperationType) => eventOperationType
            switch {
                EventOperationType.Add => Common.Event_Notification_Added,
                EventOperationType.Update => Common.Event_Notification_Updated,
                EventOperationType.Delete => Common.Event_Notification_Removed,
                _ => Common.Event_Notification_Default
            };
    }
}
