using Calendar.Appointment.API.Enums;

namespace Calendar.Appointment.API.Models
{
    public class EventNotification<T>
    {
        public T CurrentData { get; set; }

        public EventOperationType EventOperationType { get; set; }
    }
}
