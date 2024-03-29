using AutoMapper;
using Calendar.Notification.API.Configuration;
using Calendar.Notification.API.Models;
using Calendar.Notification.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Calendar.Notification.API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService) {
            _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
        }

        [HttpGet]
        public async Task<IActionResult> GetNotification()
        {
            await _notificationService.AddNotification();

            return Ok();
        }
    }
}
