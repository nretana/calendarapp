using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Shared.Enum
{
    public enum Exchange
    {
        Direct,
        Fanout,
        Headers,
        Topic
    }
}
