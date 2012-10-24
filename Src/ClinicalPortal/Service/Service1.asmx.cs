using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using ClinicalPortal.Service;
using System.Text;
using System.Collections;
using Newtonsoft.Json;

namespace ClinicalPortalService
{
    /// <summary>
    /// Summary description for Service1
    /// </summary>
    [WebService(Namespace = "http://www.clinicalportal.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Service1 : System.Web.Services.WebService
    {
        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod]
        public string GetMessageList()
        {
            StringBuilder json = new StringBuilder();
            json.Append("[");

            json.Append(GetMessageJson("3", "Greensboro", "6538227668", "", "78 Rocky Second St."));
            json.Append(",");
            json.Append(GetMessageJson("4", "Greensboro", "845-9216316", "452 East Milton Way", "452 East Milton Way"));
            json.Append(",");
            json.Append(GetMessageJson("5", "Memphis", "8678333362", "364 East White Hague Boulevard", "706 Green Old Parkway"));
            json.Append(",");
            json.Append(GetMessageJson("6", "Memphis", "406-4415713", "64 White Old Parkway", "91 Cowley St."));
            json.Append(",");
            json.Append(GetMessageJson("7", "Memphis", "527-962-1875", "132 Clarendon St.", "44 Rocky Fabien Parkway"));
            json.Append(",");
            json.Append(GetMessageJson("8", "Memphis", "9265837916", "897 Green Hague Road", "98 Old Street"));

            json.Append("]");

            return json.ToString();
            /*
             var data = [];
             data.push({ msgId: 3, sent: "Greensboro", from: "6538227668", patient: "", topic: "78 Rocky Second St."});
    data.push({ msgId: 4, sent: "Greensboro", from: "845-9216316", patient: "452 East Milton Way", topic: "452 East Milton Way"});
    data.push({ msgId: 5, sent: "Memphis", from: "8678333362", patient: "364 East White Hague Boulevard", topic: "706 Green Old Parkway"});
    data.push({ msgId: 6, sent: "Memphis", from: "406-4415713", patient: "64 White Old Parkway", topic: "91 Cowley St."});
    data.push({ msgId: 7, sent: "Memphis", from: "527-962-1875", patient: "132 Clarendon St.", topic: "44 Rocky Fabien Parkway"});
    data.push({ msgId: 8, sent: "Memphis", from: "9265837916", patient: "897 Green Hague Road", topic: "98 Old Street"});
             */
        }

        private string GetMessageJson(string msgId, string sent, string from, string patient, string topic)
        {
            IDictionary<string, string> message = new Dictionary<string, string>();
            message["msgId"] = msgId;
            message["sent"] = sent;
            message["from"] = from;
            message["patient"] = patient;
            message["topic"] = topic;
            return JsonHelper.ObjectLiteral(string.Empty, message);
        }

        [WebMethod]
        public string GetMessageNumber()
        {
            StringBuilder json = new StringBuilder();
            json.Append("{");
            /*
              Text Messages (59)	 Transcriptions (1)	 Office Tasks (36)	 Prescription Renewals (17)
 Appointment Requests (24)	 Ask The Office (11)	 Ask The Nurse (29)	 e-Consultations (20)
 Ask The Doctor (33)	 Ask The Dietitian (16)	 Notifications (41)
             */

            JsonHelper.KeyValueToJson(json, "Text Messages", "59");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Transcriptions", "1");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Office Tasks", "36");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Prescription Renewals", "17");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Appointment Requests", "24");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Ask The Office", "6");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Ask The Nurse", "41");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "e-Consultations", "23");
            json.Append(",");
            JsonHelper.KeyValueToJson(json, "Notifications", "42");

            json.Append("}");
            return json.ToString();
        }

        [WebMethod]
        public string GetMenu()
        {
            string[] roles = GetUserRoles();
            Menu menu = new Menu();
            menu.BuildMenu(roles);
            return JsonConvert.SerializeObject(menu);
            //return menu.ToJson();
            //return "{\"data\": [{ \"data\":{\"title\": \"Home Page\",\"attr\": { \"id\": \"homePage\" },\"icon\": \"leaf\"},\"metadata\": { \"href\": \"Home.html\" }},{ \"data\":{\"title\": \"Message Center\",\"attr\": { \"id\": \"messageCenter\" },\"icon\": \"leaf\"},\"metadata\": {\"href\": \"#\"}},{ \"data\":{\"title\": \"Patient Data\",\"attr\": { \"id\": \"patientData\" },\"icon\": \"folder\"},\"children\":[{ \"data\": { \"title\": \"Patient Search\", \"icon\": \"leaf\"} },{ \"data\": { \"title\": \"Patient Summary\", \"icon\": \"leaf\"} }]},{ \"data\":{\"title\": \"Tools\",\"attr\": { \"id\": \"tools\" },\"icon\": \"folder\"},\"children\": []}};";
        }

        [WebMethod]
        public string ChangeMenuCase(string menuJson)
        {
            Menu menu = JsonConvert.DeserializeObject<Menu>(menuJson);
            foreach (MenuItem menuItem in menu.MenuItems)
            {
                ChangeMenuNameOppositeCase(menuItem);
            }
            return JsonConvert.SerializeObject(menu);
        }

        private void ChangeMenuNameOppositeCase(MenuItem menuItem)
        {
            if (menuItem != null)
            {
                string nameCase = "lower";
                menuItem.MetaData.TryGetValue("nameCase", out nameCase);
                nameCase = nameCase == "lower" ? "upper" : "lower";

                menuItem.Title = nameCase == "lower" ? menuItem.Title.ToLower() : menuItem.Title.ToUpper();
                menuItem.AppendMetaData("nameCase", nameCase);

                foreach (MenuItem subMenuItem in menuItem.Children)
                {
                    ChangeMenuNameOppositeCase(subMenuItem);
                }
            }
        }

        private string[] GetUserRoles()
        {
            List<string> roles = new List<string>();
            HttpCookie userIdCookie = this.Context.Request.Cookies["inforSignInDialog:userId"];
            if (userIdCookie != null && (string.Compare(userIdCookie.Value, "admin", true) == 0))
            {
                roles.Add("admin");
            }
            return roles.ToArray();
        }
    }
}