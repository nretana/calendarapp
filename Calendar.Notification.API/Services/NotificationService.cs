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
        private readonly IOptions<MessageBusSettings> _messageBusSettings;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IMessageBus messageBus,
                                   IOptions<MessageBusSettings> messageBusSettings,
                                   ILogger<NotificationService> logger)
        {
            _messageBus = messageBus ?? throw new ArgumentNullException(nameof(messageBus));
            _messageBusSettings = messageBusSettings ?? throw new ArgumentNullException(nameof(messageBusSettings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }


        public async Task AddNotification()
        {
            try
            {
                _logger.LogInformation($"Running background service");
                _logger.LogInformation($"Subscribe to exchange: [{_messageBusSettings.Value.ExchangeNames["CalendarExchange"]}]," +
                                                    $"message queue: [{_messageBusSettings.Value.QueueNames["CalendarNotificationQueue"]}]");
                await _messageBus.Subscribe<EventNotification<EventDto>, BasicDeliverEventArgs>(_messageBusSettings.Value.Uri,
                                                                                        _messageBusSettings.Value.ExchangeNames["CalendarExchange"],
                                                                                        _messageBusSettings.Value.QueueNames["CalendarNotificationQueue"],
                                                                                        _messageBusSettings.Value.QueueNames["CalendarNotificationQueue"],
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


            try
            {
                _logger.LogInformation($"Consume data from message queue bound to exchange [{args.Exchange}]");
                var bytesResult = args.Body.ToArray();
                var eventNotification = JsonConvert.DeserializeObject<EventNotification<EventDto>>(Encoding.UTF8.GetString(bytesResult));
                
                var message = CreateEmailMessage(eventNotification);
                var _emailservice = scope.ServiceProvider.GetRequiredService<IEmailSender>();
                _emailservice.SendEmailAsync(message).GetAwaiter();

                currentChannel.BasicAck(args.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                //rejects the message
                currentChannel.BasicReject(args.DeliveryTag, false);
                
                _logger.LogError($"Error proccessing dta from message queue bound to exchange [{args.Exchange}]: {ex}");
                throw;
            }
            return Task.CompletedTask;
        }

        private static EmailMessage CreateEmailMessage(EventNotification<EventDto> eventNotification)
        {
            var htmlTemplateStr = EmailHelper.BuildEmailTemplate("Utilities/Templates", "NotificationTemplate.html");

            var htmlMessage = string.Format(GetMessageByEventOperationType(eventNotification.EventOperationType), 
                                                                                eventNotification.CurrentData?.Title,
                                                                                eventNotification.CurrentData?.EventDate.ToString("dddd, dd MMMM yyyy"),
                                                                                eventNotification.CurrentData?.StartTime.ToString("hh:mm tt"));
            
            var emailBody = htmlTemplateStr.Replace("[UserName]", "username")
                                           .Replace("[EventNotificationMessage]", htmlMessage)
                                           .Replace("[UserEmail]", "username@gmail.com")
                                           .Replace("[AppName]", "Chronos");

            /*List<EmailAttachment> emailAttachList = new() {
                    EmailHelper.GetEmailAttachment("Utilities/Templates/Imgs", "email.png")
                };*/

            var linkedResources = new Dictionary<string, string>() { { "[BrandImgSrc]", "Utilities/Templates/Imgs/brand_logo.png" } };

            var message = new EmailMessage(new string[] { "username@gmail.com" },
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
