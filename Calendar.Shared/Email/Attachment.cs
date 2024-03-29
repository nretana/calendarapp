
namespace Calendar.Shared.Email
{
    public class EmailAttachment
    {
        public string FileName { get; set; }

        public byte[] FileContent { get; set; }

        public string ContentType { get; set; }
    }
}
