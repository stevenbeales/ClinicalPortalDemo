using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    public class MessageItemPropertyResolver : DefaultContractResolver
    {
        private Type _typeForResolver = typeof(MessageItem);
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty property = base.CreateProperty(member, memberSerialization);
            if (property.DeclaringType == _typeForResolver && property.UnderlyingName == "Content")
            {
                property.Ignored = true;
            }
            return property;
        }
    }
}