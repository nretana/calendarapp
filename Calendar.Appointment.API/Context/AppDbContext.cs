using Calendar.Appointment.API.Context.Conventions;
using Calendar.Appointment.API.Context.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TimeOnlyConverter = Calendar.Appointment.API.Context.Conventions.TimeOnlyConverter;

namespace Calendar.Appointment.API.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {

        }

        public virtual DbSet<Event> Events { get; set; } = null!;

        public virtual DbSet<Reminder> Reminders { get; set; } = null!;


        /// <summary>
        /// On creating the model
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());


            base.OnModelCreating(modelBuilder);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            base.ConfigureConventions(configurationBuilder);

            configurationBuilder.Properties<TimeOnly>()
                .HaveConversion<TimeOnlyConverter, TimeOnlyComparer>();
        }

        /// <summary>
        /// On SaveChanges called
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = this.ChangeTracker.Entries<Event>().Where(e => e.State == EntityState.Added 
                                                        || e.State == EntityState.Modified);

            foreach(var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Property(e => e.CreatedDate).CurrentValue = DateTimeOffset.Now;
                    entry.Property(e => e.CreatedDate).IsModified = true;
                }

                entry.Property(e => e.ModifiedDate).CurrentValue = DateTimeOffset.Now;
                entry.Property(e => e.ModifiedDate).IsModified = true;
            }

            return base.SaveChangesAsync(cancellationToken);
        }

    }
}
