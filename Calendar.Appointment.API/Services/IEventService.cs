using Calendar.Appointment.API.Context.Entities;
using Calendar.Appointment.API.Models.Filters;

namespace Calendar.Appointment.API.Services
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync(EventFilter eventFilter);

        Task<IEnumerable<Event>> GetEventsByDateAsync(DateTimeOffset date);

        Task<Event?> GetEventAsync(Guid eventId);

        Task<bool> IsEventExistsAsync(Guid eventId);

        void AddEvent(Event newEvent);

        void RemoveEvent(Event @event);

        Task SaveChangesAsync();

        Task<Event> ProcessNotification(Event @event, CancellationToken cancellationToken);
    }
}
