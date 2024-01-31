using Calendar.Appointment.API.Context.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Calendar.Appointment.API.Context.Configuration
{
    public class EventConfiguration: IEntityTypeConfiguration<Event>
    {

        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.HasKey(e => e.EventId);
            builder.HasMany(e => e.Reminders)
                   .WithMany(r => r.Events)
                   .UsingEntity<EventReminder>(//jointable setup explicitly (this is not necessary but it's more descriptive)
                        e => e.HasOne<Reminder>().WithMany().HasForeignKey(er => er.ReminderId),
                        r => r.HasOne<Event>().WithMany().HasForeignKey(er => er.EventId));
        }
    }
}