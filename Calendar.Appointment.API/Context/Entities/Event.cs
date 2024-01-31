using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Calendar.Appointment.API.Context.Entities
{
    public class Event
    {
        [Key]
        public Guid EventId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Notes { get; set; } = string.Empty;

        [Required]
        [MaxLength(7, ErrorMessage = "color should be a valid hexadecimal color")]
        public string Color { get; set; }

        [Required]
        public TimeOnly StartTime { get; set; }

        [Required]
        public TimeOnly EndTime { get; set; }

        [Required]
        public DateTimeOffset EventDate { get; set; }

        /*public bool? IsRecurring { get; set; }

        public DateTimeOffset? RecurringEndDate {  get; set; }*/

        [Required]
        public DateTimeOffset CreatedDate { get; set; }

        [Required]
        public DateTimeOffset ModifiedDate { get; set; }


        //RELATIONSHIP
        public ICollection<Reminder> Reminders { get; set; } = new HashSet<Reminder>();
    }
}
