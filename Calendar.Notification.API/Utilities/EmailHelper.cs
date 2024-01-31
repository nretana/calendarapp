using Calendar.Shared.Email;
using MimeKit;
using System.Text;
using System.Web;

namespace Calendar.Notification.API.Utilities
{
    public class EmailHelper
    {
        public static string BuildEmailTemplate (string fullPath, string templateName)
        {
            var currentFilePath = Path.Combine(fullPath, templateName);

            if(!File.Exists(currentFilePath))
            {
                throw new FileNotFoundException();
            }

            StreamReader emailTemplateReader = new (currentFilePath, Encoding.Default);
            string  emailText = emailTemplateReader.ReadToEnd();
            emailTemplateReader.Close();
            return emailText;
        }

        public static EmailAttachment GetEmailAttachment(string filePath, string fileName)
        {
            var currentFilePath = Path.Combine(filePath, fileName);

            if (!File.Exists(currentFilePath))
            {
                throw new FileNotFoundException();
            }

            var contenType = MimeTypes.GetMimeType(currentFilePath);
            return new EmailAttachment()
            {
                FileName = fileName,
                FileContent = File.ReadAllBytes(currentFilePath),
                ContentType = contenType
            };
        }
    }
}
