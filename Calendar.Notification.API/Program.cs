
using Calendar.Notification.API.Configuration;
using Calendar.Notification.API.Services;
using Calendar.Shared.Email;
using Calendar.Shared.MessageBus.PubSub;
using Calendar.Shared.MessageBus.RequestReply;
using Serilog;
using System.Net;

namespace Calendar.Notification.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console()
                .WriteTo.File("Logs/notification_service.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.Configure<HostOptions>(hostOptions => 
                                        hostOptions.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore);

            builder.Host.UseSerilog();

            builder.Services.AddOptions<EmailConfiguration>().BindConfiguration("EmailConfiguration")
                                                             .ValidateDataAnnotations()
                                                             .ValidateOnStart();
            builder.Services.AddOptions<MessageBusSettings>().BindConfiguration("MessageBusSettings")
                                                             .ValidateDataAnnotations()
                                                             .ValidateOnStart();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddHostedService<MessageBusService>();
            builder.Services.AddScoped<IEmailSender, EmailSender>();
            builder.Services.AddScoped<IMessageBus, MessageBus>();
            builder.Services.AddScoped<IResponseMessageBus, ResponseMessageBus>();
            builder.Services.AddScoped<INotificationService, NotificationService>();


            //add curstom certificates to kestrel
            if (builder.Environment.IsDevelopment())
            {
                builder.WebHost.UseKestrel(options =>
                {
                    var certificatePath = builder.Configuration["Certificates:Path"];
                    var certificatePassword = builder.Configuration["Certificates:Password"]; //secret key entry

                    options.Listen(IPAddress.Any, 7144, listenOptions =>
                    {
                        listenOptions.UseHttps(certificatePath, certificatePassword);
                    });
                });
            }


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
