namespace Calendar.Appointment.API.Models
{
    public class EventUpdateDto
    {
        public string Title { get; set; }
        
        public string? Notes { get; set; }

        public string Color { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public DateTimeOffset EventDate { get; set; }

        public DateTimeOffset CreatedDate { get; set; }

        public DateTimeOffset ModifiedDate { get; set; }
    }
}
