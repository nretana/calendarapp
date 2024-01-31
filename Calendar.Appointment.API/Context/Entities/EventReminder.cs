namespace Calendar.Appointment.API.Context.Entities
{
    public class EventReminder
    {
        public Guid EventId { get; set; }

        public Guid ReminderId { get; set; }
    }
}
