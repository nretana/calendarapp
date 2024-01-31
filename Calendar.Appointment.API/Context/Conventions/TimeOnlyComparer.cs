using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Calendar.Appointment.API.Context.Conventions
{
    public class TimeOnlyComparer : ValueComparer<TimeOnly>
    {
        public TimeOnlyComparer() : base( (x, y) => x.Ticks == y.Ticks,
                                          timeOnly => timeOnly.GetHashCode()) { }
    }
}
