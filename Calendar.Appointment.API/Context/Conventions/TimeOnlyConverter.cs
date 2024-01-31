using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Calendar.Appointment.API.Context.Conventions
{
    public class TimeOnlyConverter : ValueConverter<TimeOnly, TimeSpan>
    {
        public TimeOnlyConverter() : base(
                timeOnly => timeOnly.ToTimeSpan(),
                timeSpan => TimeOnly.FromTimeSpan(timeSpan)
            ) { }
    }
}
