using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Shared.Email
{
    public class EmailAttachment
    {
        public string FileName { get; set; }

        public byte[] FileContent { get; set; }

        public string ContentType { get; set; }
    }
}
