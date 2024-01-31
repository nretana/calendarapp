using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calendar.Appointment.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReminderDbSetWithRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Events",
                newName: "EventId");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Events",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(7)",
                oldMaxLength: 7,
                oldDefaultValue: "#7743DB");

            migrationBuilder.CreateTable(
                name: "Reminders",
                columns: table => new
                {
                    ReminderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReminderDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    AtTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminders", x => x.ReminderId);
                });

            migrationBuilder.CreateTable(
                name: "EventReminder",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReminderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventReminder", x => new { x.EventId, x.ReminderId });
                    table.ForeignKey(
                        name: "FK_EventReminder_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventReminder_Reminders_ReminderId",
                        column: x => x.ReminderId,
                        principalTable: "Reminders",
                        principalColumn: "ReminderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventReminder_ReminderId",
                table: "EventReminder",
                column: "ReminderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventReminder");

            migrationBuilder.DropTable(
                name: "Reminders");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "Events",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Events",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#7743DB",
                oldClrType: typeof(string),
                oldType: "nvarchar(7)",
                oldMaxLength: 7);
        }
    }
}
