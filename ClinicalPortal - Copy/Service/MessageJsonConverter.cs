using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ClinicalPortal.Service
{
    public class MessageJsonConverter: CustomCreationConverter<MessageItem>
    {
        public override MessageItem Create(Type objectType)
        {
            return new MessageItem();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            base.WriteJson(writer, value, serializer);
        }
    }
}