using AutoMapper;
using Calendar.Appointment.API.Context.Entities;
using Calendar.Appointment.API.Models;

namespace Calendar.Appointment.API.Profiles
{
    public class EventProfile : Profile
    {
        public EventProfile() {

            CreateMap<Event, EventDto>().ReverseMap();
            CreateMap<EventCreateDto, Event>();
            CreateMap<EventUpdateDto, Event>().ReverseMap();
            
        }
    }
}