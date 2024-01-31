using Calendar.Notification.API.Enum;

namespace Calendar.Notification.API.Models
{
    public class EventNotification<T>
    {
        public T CurrentData { get; set; }

        public EventOperationType EventOperationType { get; set; }
    }
}
