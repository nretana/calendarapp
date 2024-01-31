using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace Calendar.Appointment.API.Utilities.JsonConverters
{
    public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
    {
        public override TimeOnly ReadJson(JsonReader reader, Type objectType, TimeOnly existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, TimeOnly value, JsonSerializer options)
        {
            var timeStr = value.ToString("HH:mm");
            writer.WriteValue(timeStr);
        }

        public override bool CanRead => false;
    }
}
