using Calendar.Appointment.API.Configuration;
using Calendar.Appointment.API.Services;
using Calendar.Appointment.API.Utilities.JsonConverters;
using Calendar.Shared.MessageBus.PubSub;
using Calendar.Shared.MessageBus.RequestReply;
using Calendar.Appointment.API.Context;
using Calendar.Appointment.API.Services;
using Microsoft.EntityFrameworkCore;
using System.Net;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => 
            options.UseSqlServer(builder.Configuration["ConnectionString:CalendarDb"]));

builder.Services.AddOptions<MessageBusConfiguration>().BindConfiguration("MessageBusConfiguration")
                                                      .ValidateDataAnnotations()
                                                      .ValidateOnStart();

// Add services to the container.

builder.Services.AddControllers()
.AddNewtonsoftJson(options => 
                    options.SerializerSettings.Converters.Add(new TimeOnlyJsonConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddMiniProfiler(options =>
{
options.RouteBasePath = "/profiler";
options.ColorScheme = StackExchange.Profiling.ColorScheme.Dark;
}).AddEntityFramework();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
//builder.Services.AddHostedService<MessageBusService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IMessageBus, MessageBus>();
builder.Services.AddScoped<IRequestMessageBus, RequestMessageBus>();

builder.Services.AddMessageBroker();


if (builder.Environment.IsDevelopment())
{
    builder.WebHost.UseKestrel(options =>
    {
        var certificatePath = builder.Configuration["Certificates:Path"];
        var certificatePassword = builder.Configuration["Certificates:Password"]; 

        options.Listen(IPAddress.Any, 7246, listenOptions =>
        {
            listenOptions.UseHttps(certificatePath, certificatePassword);
        });
    });
}

var app = builder.Build();

app.UseCors(c => c.AllowAnyOrigin()
  .AllowAnyHeader()
  .AllowAnyMethod()
  .WithExposedHeaders("Location"));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiniProfiler();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
