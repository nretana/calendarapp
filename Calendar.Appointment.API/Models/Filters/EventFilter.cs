namespace Calendar.Appointment.API.Models.Filters
{
    public class EventFilter
    {
        public DateTimeOffset? SelectedDate { get; set; }

        public DateTimeOffset? StartDate { get; set; }

        public DateTimeOffset? EndDate { get; set; }
    }
}
