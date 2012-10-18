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

        public static void AppendBracket(StringBuilder json)
        {
            json.Insert(0, "{");
            json.Append("}");
        }

        //public void ArrayLiteral(StringBuilder json,)

        public static string ObjectLiteral(string objName, IDictionary<string, string> properties)
        {
            StringBuilder objJson = new StringBuilder();
            if (!string.IsNullOrEmpty(objName))
            {
                QuotationString(objJson, objName);
                objJson.Append(":");
            }
            objJson.Append("{");

            int i = 0;
            foreach (KeyValuePair<string, string> item in properties)
            {
                if (i >= 1)
                {
                    objJson.Append(",");
                }
                KeyValueToJson(objJson, item.Key, item.Value);
                i++;
            }

            objJson.Append("}");
            return objJson.ToString();
        }

    }
}