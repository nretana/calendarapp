using MimeKit;

namespace Calendar.Shared.Email
{
    public class EmailMessage
    {
        public List<MailboxAddress> To { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public Dictionary<string, string>? LinkedResources { get; set; }

        public ICollection<EmailAttachment>? Attachments { get; set; }

        public EmailMessage(IEnumerable<string> emailAddressList, string subject, string body, Dictionary<string, string> linkedResources = null, ICollection<EmailAttachment>? attachments = null)
        {
            To = new List<MailboxAddress>();
            To.AddRange(emailAddressList.Select(to => new MailboxAddress("", to)));
            Subject = subject;
            Body = body;
            LinkedResources = linkedResources;
            Attachments = attachments;
        }
    }
}
