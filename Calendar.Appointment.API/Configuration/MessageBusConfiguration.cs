namespace Calendar.Appointment.API.Configuration
{
    public class MessageBusConfiguration
    {
        public string Uri { get; set; }

        public string SslServerName { get; set; }

        public Dictionary<string, string> ExchangeNames { get; set; }

        public Dictionary<string, string> QueueNames { get; set; }
    }
}
