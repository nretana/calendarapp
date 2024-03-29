using AutoMapper;
using Calendar.Appointment.API.Configuration;
using Calendar.Appointment.API.Context.Entities;
using Calendar.Appointment.API.Enums;
using Calendar.Appointment.API.Models;
using Calendar.Appointment.API.Models.Filters;
using Calendar.Appointment.API.Services;
using Calendar.Shared.MessageBus.PubSub;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Calendar.Appointment.API.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventCalendar;
        private readonly IMapper _mapper;
        private readonly IMessageBus _messageBus;
        private readonly IOptions<MessageBusConfiguration> _messageBusConfiguration;

        public EventController(IEventService eventCalendar, IMapper mapper, IMessageBus messageBus, 
                                           IOptions<MessageBusConfiguration> messageBusConfiguration)
        {
            _eventCalendar = eventCalendar ?? throw new ArgumentNullException(nameof(eventCalendar));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _messageBus = messageBus ?? throw new ArgumentNullException(nameof(messageBus));
            _messageBusConfiguration = messageBusConfiguration ?? throw new ArgumentNullException(nameof(MessageBusConfiguration));
        }

        [HttpGet(Name = "GetEvents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents([FromQuery] EventFilter eventFilter)
        {
            var eventList = await _eventCalendar.GetAllEventsAsync(eventFilter);
            var events = _mapper.Map<IEnumerable<EventDto>>(eventList);
            return Ok(events);
        }

        [HttpGet("{eventId}", Name = "GetEvent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<EventDto>> GetEventAsync(Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                return BadRequest();
            }

            var eventCalendar = await _eventCalendar.GetEventAsync(eventId);

            if (eventCalendar == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<EventDto>(eventCalendar));
        }

        [HttpPost(Name = "AddEvent")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<EventDto>> AddEvent(EventCreateDto newEvent)
        {
            if (newEvent == null)
            {
                return BadRequest();
            }

            _messageBus.Open(_messageBusConfiguration.Value.Uri, _messageBusConfiguration.Value.SslServerName);
            if (!_messageBus.Channel.IsOpen)
            {
                return BadRequest();
            }

            var eventMapped = _mapper.Map<Event>(newEvent);
            _eventCalendar.AddEvent(eventMapped);
            await _eventCalendar.SaveChangesAsync();

            var eventAdded = _mapper.Map<EventDto>(eventMapped);

            var eventNotification = new EventNotification<EventDto>() { CurrentData = eventAdded, 
                                                                        EventOperationType = EventOperationType.Add };
            _messageBus.Publish(eventNotification, _messageBusConfiguration.Value.Uri, 
                                                   _messageBusConfiguration.Value.ExchangeNames["CalendarExchange"], 
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"], 
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                   durable: true);

            return CreatedAtRoute("GetEvent", new { EventId = eventAdded.EventId }, eventAdded);
        }

        [HttpPatch("{eventId}", Name = "UpdateEvent")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateEvent(Guid eventId, JsonPatchDocument<EventUpdateDto> eventPatchDocument)
        {
            var eventFound = await _eventCalendar.GetEventAsync(eventId);
            if(eventFound == null)
            {
                return NotFound();
            }

            _messageBus.Open(_messageBusConfiguration.Value.Uri, _messageBusConfiguration.Value.SslServerName);
            if (!_messageBus.Channel.IsOpen)
            {
                return BadRequest();
            }

            var eventToPatch = _mapper.Map<EventUpdateDto>(eventFound);
            eventPatchDocument.ApplyTo(eventToPatch, ModelState);

            if (!TryValidateModel(eventToPatch))
            {
                return ValidationProblem(ModelState);
            }

            _mapper.Map(eventToPatch, eventFound);
            await _eventCalendar.SaveChangesAsync();

            var eventNotification = new EventNotification<EventDto>()
            {
                CurrentData = _mapper.Map<EventDto>(eventFound),
                EventOperationType = EventOperationType.Update
            };
            _messageBus.Publish(eventNotification, _messageBusConfiguration.Value.Uri,
                                                   _messageBusConfiguration.Value.ExchangeNames["CalendarExchange"],
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                   durable: true);

            return NoContent();
        }

        [HttpDelete("{eventId}", Name = "RemoveEvent")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> RemoveEvent(Guid eventId)
        {
            if (!await _eventCalendar.IsEventExistsAsync(eventId))
            {
                return NotFound();
            }

            _messageBus.Open(_messageBusConfiguration.Value.Uri, _messageBusConfiguration.Value.SslServerName);
            if (!_messageBus.Channel.IsOpen)
            {
                return BadRequest();
            }

            var eventFound = await _eventCalendar.GetEventAsync(eventId);

            if(eventFound == null)
            {
                return NotFound();
            }

            _eventCalendar.RemoveEvent(eventFound);
            await _eventCalendar.SaveChangesAsync();

            var eventNotification = new EventNotification<EventDto>()
            {
                CurrentData = _mapper.Map<EventDto>(eventFound),
                EventOperationType = EventOperationType.Delete
            };

            _messageBus.Publish(eventNotification, _messageBusConfiguration.Value.Uri,
                                                   _messageBusConfiguration.Value.ExchangeNames["CalendarExchange"],
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                   _messageBusConfiguration.Value.QueueNames["CalendarNotificationQueue"],
                                                   durable: true);

            return NoContent();
        }

        [HttpOptions]
        [HttpOptions("{eventId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetEventOptions()
        {
            Response.Headers.Add("Allow", "GET, POST, PATCH, DELETE, OPTIONS");
            return Ok();
        }

    }
}
