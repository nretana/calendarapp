
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Net;
using System.Security.Cryptography.X509Certificates;

namespace Calendar.Gateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            if(builder.Environment.IsProduction())
            {
                builder.Configuration.AddJsonFile("ocelot.Production.json", optional: false, reloadOnChange: true);
            }
            else {
                builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
            }

            builder.Services.AddOcelot(builder.Configuration);

            //add curstom certificates to kestrel
            if (builder.Environment.IsDevelopment())
            {
                builder.WebHost.UseKestrel(options =>
                {
                    var certificatePath = builder.Configuration["Certificates:Path"];
                    var certificatePassword = builder.Configuration["Certificates:Password"]; //secret key entry

                    options.Listen(IPAddress.Any, 7074, listenOptions =>
                    {
                        listenOptions.UseHttps(certificatePath, certificatePassword);
                    });
                });
            }

            var app = builder.Build();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseOcelot().GetAwaiter().GetResult();


            app.Run();
        }
    }
}
