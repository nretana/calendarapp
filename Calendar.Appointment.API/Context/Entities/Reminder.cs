using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Calendar.Appointment.API.Context.Entities
{
    public class Reminder
    {
        [Key]
        public Guid ReminderId {  get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset ReminderDate { get; set; }

        [Required]
        public TimeOnly AtTime { get; set; }

        [Required]
        public DateTimeOffset CreatedDate { get; set; }

        [Required]
        public DateTimeOffset ModifiedDate { get; set; }

        //RELATIONSHIP
        public ICollection<Event> Events { get; set; } = new HashSet<Event>();
    }
}
