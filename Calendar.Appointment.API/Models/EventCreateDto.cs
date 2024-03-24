using System.ComponentModel.DataAnnotations;

namespace Calendar.Appointment.API.Models
{
    public class EventCreateDto
    {
        public string Title { get; set; }

        public string? Notes { get; set; }

        public string Color { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public DateTimeOffset EventDate { get; set; }
    }
}
