using MailKit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Calendar.Shared.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailConfiguration> _emailConfiguration;
        private readonly ILogger _logger;
        public EmailSender(ILogger<EmailSender> logger, IOptions<EmailConfiguration> emailConfiguration) {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _emailConfiguration = emailConfiguration ?? throw new ArgumentNullException(nameof(emailConfiguration));
        }


        public async Task SendEmailAsync(EmailMessage message)
        {
            var messageTemplate = await CreateEmailMessage(message);
            await SendToServerAsync(messageTemplate);
        }


        private async Task<MimeMessage> CreateEmailMessage(EmailMessage message)
        {
            MimeMessage mimeMessage = new();
            mimeMessage.From.Add(new MailboxAddress("email", _emailConfiguration.Value.From));
            mimeMessage.To.AddRange(message.To);
            mimeMessage.Subject = message.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = message.Body;


            if (message.LinkedResources != null && message.LinkedResources.Count > 0)
            {
                foreach (var resource in message.LinkedResources)
                {
                    var image = bodyBuilder.LinkedResources.Add(resource.Value);
                    image.ContentId = Guid.NewGuid().ToString();
                    bodyBuilder.HtmlBody = bodyBuilder.HtmlBody.Replace(resource.Key, image.ContentId);
                }
            }

            if (message.Attachments != null && message.Attachments.Count > 0)
            {
                foreach (var file in message.Attachments)
                {
                    bodyBuilder.Attachments.Add(fileName: file.FileName, file.FileContent, MimeKit.ContentType.Parse(file.ContentType));
                }
            }
            
            mimeMessage.Body = bodyBuilder.ToMessageBody();
            return mimeMessage;
        }


        private async Task SendToServerAsync(MimeMessage mimeMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.CheckCertificateRevocation = false;
                    await client.ConnectAsync(_emailConfiguration.Value.SmtpServer, _emailConfiguration.Value.Port, MailKit.Security.SecureSocketOptions.StartTls);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    await client.AuthenticateAsync(_emailConfiguration.Value.Username, _emailConfiguration.Value.Password);
                    client.MessageSent += OnMessageSent;        
                    await client.SendAsync(mimeMessage);
               }
                catch (Exception ex) {
                    throw;
                }
                finally {
                    await client.DisconnectAsync(true);
                }
            }
        }


        private void OnMessageSent(object? sender, MessageSentEventArgs args)
        {
            _logger.LogDebug("Event notification has been sent.");
        }
    }
}
