using System.Timers;

namespace Calendar.Notification.API.Services
{
    public class MessageBusService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private static ILogger<MessageBusService> _logger;

        public MessageBusService(IServiceScopeFactory serviceScopeFactory,
                                 ILogger<MessageBusService> logger) : base()
        {

            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }


        protected override Task ExecuteAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Running background service");
            cancellationToken.ThrowIfCancellationRequested();
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var _notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                _notificationService.AddNotification();
            }

            return Task.CompletedTask;
        }
    }
}
