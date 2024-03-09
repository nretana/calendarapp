using Calendar.Appointment.API.Configuration;
using Calendar.Appointment.API.Context.Entities;
using Calendar.Appointment.API.Models.Filters;
using Calendar.Shared.MessageBus.RequestReply;
using Calendar.Appointment.API.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;

namespace Calendar.Appointment.API.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        private readonly IRequestMessageBus _requestMessageBus;
        private readonly IOptions<MessageBusConfiguration> _messageBusConfiguration;
        private const string _replyQueueName = "calendar_reply_rpc_queue";

        public EventService(AppDbContext context, IRequestMessageBus requestMessageBus, 
                                    IOptions<MessageBusConfiguration> messageBusConfiguration) {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _requestMessageBus = requestMessageBus ?? throw new ArgumentNullException(nameof(requestMessageBus));
            _messageBusConfiguration = messageBusConfiguration ?? throw new ArgumentNullException(nameof(messageBusConfiguration));
        }


        public async Task<IEnumerable<Event>> GetAllEventsAsync(EventFilter eventFilter)
        { 
            if(eventFilter == null){
                throw new ArgumentNullException(nameof(eventFilter));
            }

            var eventCollection = _context.Events as IQueryable<Event>;

            if (!string.IsNullOrEmpty(eventFilter.SelectedDate?.ToString().Trim()) 
                || eventFilter.SelectedDate > DateTimeOffset.MinValue)
            {
                eventCollection = eventCollection.Where(e => e.EventDate.Date == eventFilter.SelectedDate.Value.Date);
            }

            if ((!string.IsNullOrEmpty(eventFilter.StartDate?.ToString().Trim()) || eventFilter.StartDate > DateTimeOffset.MinValue) && 
                (!string.IsNullOrEmpty(eventFilter.EndDate?.ToString().Trim()) || eventFilter.EndDate > DateTimeOffset.MinValue))
            {
                eventCollection = eventCollection.Where(e => e.EventDate.Date >= eventFilter.StartDate.Value.Date && 
                                                                    e.EventDate.Date <= eventFilter.EndDate.Value.Date);
            }

            return await eventCollection.ToListAsync();
        }


        public async Task<IEnumerable<Event>> GetEventsByDateAsync(DateTimeOffset selectedDate)
        {
            if(selectedDate == DateTimeOffset.MinValue)
            {
                throw new ArgumentNullException(nameof(selectedDate));
            }

            var eventCollection = _context.Events as IQueryable<Event>;
            eventCollection = eventCollection.Where(e => e.EventDate.Date == selectedDate.Date);

            return await eventCollection.ToListAsync();
        }


        public async Task<Event?> GetEventAsync(Guid eventId)
        {
            if(eventId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(eventId));
            }

            var eventFound = await _context.Events.Where(e => e.EventId == eventId).FirstOrDefaultAsync();
            return eventFound;
        }


        public async Task<bool> IsEventExistsAsync(Guid eventId)
        {
            if(eventId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(eventId));
            }

            return await _context.Events.AnyAsync(e => e.EventId == eventId);
        }


        public void AddEvent(Event newEvent)
        {
            if(newEvent == null)
            {
                throw new ArgumentNullException(nameof(newEvent));
            }

            newEvent.EventId = Guid.NewGuid();
            _context.Events.Add(newEvent);
        }


        public void RemoveEvent(Event @event)
        {
            _context.Events.Remove(@event);
        } 


        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }


        public async Task<Event?> ProcessNotification(Event @event, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _requestMessageBus.Publish(@event, _messageBusConfiguration.Value.Uri,
                                                                      _messageBusConfiguration.Value.ExchangeNames["CalendarRpcExchange"],
                                                                      _messageBusConfiguration.Value.QueueNames["CalendarRpcQueue"],
                                                                      _messageBusConfiguration.Value.QueueNames["CalendarRpcQueue"], null, cancellationToken);

                return result as Event;
            }
            catch
            {
                throw;
            }
        }


        public async Task ReplyToSubscriber()
        {
            _requestMessageBus.Open(_messageBusConfiguration.Value.Uri);
            _requestMessageBus.CreateReplyQueue(_replyQueueName);
            await _requestMessageBus.SubscribeToReply<Event, BasicDeliverEventArgs>(_messageBusConfiguration.Value.Uri, string.Empty,
                                                            _replyQueueName, _replyQueueName);
        }
    }
}
