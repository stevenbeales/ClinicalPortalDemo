using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace ClinicalPortal.Service
{
    public static class JsonHelper
    {
        public static void QuotationString(StringBuilder json, string value)
        {
            json.Append("\"").Append(value).Append("\"");
        }

        public static void KeyValueToJson(StringBuilder json, string key, string value)
        {
            QuotationString(json, key);
            json.Append(":");
            QuotationString(json, value);
        }
    }
}