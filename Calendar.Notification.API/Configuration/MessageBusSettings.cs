﻿namespace Calendar.Notification.API.Configuration
{
    public class MessageBusSettings
    {
        public string Uri { get; set; }

        public Dictionary<string, string> ExchangeNames { get; set; }

        public Dictionary<string, string> QueueNames { get; set; }
    }
}
