using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using ClinicalPortal.Service;
using Newtonsoft.Json;
using System.Reflection;

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
        private MessageCenter _messageCenter = new MessageCenter();
        private UserInfoDB _userDB = new UserInfoDB();

        [WebMethod]
        public string GetMethodList()
        {
            WebServiceInfo serviceInfo = new WebServiceInfo(this.GetType());

            return JsonConvert.SerializeObject(serviceInfo.WebMethods);
            //StringBuilder methodsJson = new StringBuilder();
            //methodsJson.Append("[");
            //MethodInfo[] methods = this.GetType().GetMethods();
            //int number = 0;
            //foreach (MethodInfo method in methods)
            //{
            //    if (method.IsPublic && method.GetCustomAttributes(typeof(WebMethodAttribute), false).Length > 0)
            //    {
            //        if (number > 0)
            //        {
            //            methodsJson.Append(",");
            //        }
            //        methodsJson.Append(GetMethodJson(method));
            //        number += 1;
            //    }
            //}
            //methodsJson.Append("]");
            //return methodsJson.ToString();
        }

        //private string GetMethodJson(MethodInfo webMethod)
        //{
        //    if (webMethod != null)
        //    {
        //        StringBuilder sb = new StringBuilder();
        //        sb.Append("{")
        //          .Append("\"methodName\":").Append("\"" + webMethod.Name + "\"")
        //          .Append(",").Append("\"returnType\":").Append("\"" + webMethod.ReturnType.Name + "\"");

        //        // parameters
        //        sb.Append(",").Append("\"parameters\":")
        //          .Append("[");
        //        ParameterInfo[] paras = webMethod.GetParameters();
        //        for (int i = 0; i < paras.Length; i++)
        //        {
        //            if (i > 0)
        //            {
        //                sb.Append(",");
        //            }
        //            sb.Append("{").Append("\"paraName\":").Append("\"" + paras[i].Name + "\"")
        //              .Append(",")
        //              .Append("\"paraType\":").Append("\"" + paras[i].ParameterType.Name + "\"")
        //              .Append("}");
        //        }
        //        sb.Append("]");
        //        // end parameters
        //        sb.Append("}");
        //        return sb.ToString();
        //    }
        //    return null;
        //}

        [WebMethod]
        public string GetMessageList()
        {
            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.ContractResolver = new MessageItemPropertyResolver();
            return JsonConvert.SerializeObject(_messageCenter.GetMessages(), settings);

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

        [WebMethod]
        public string GetMessageItem(string msgId)
        {
            MessageItem msgItem = _messageCenter.GetMessage(msgId);
            return JsonConvert.SerializeObject(msgItem);
        }

        [WebMethod]
        public string GetMessageCount()
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
            //return "{\"data\": [{ \"data\":{\"title\": \"Home Page\",\"attr\": { \"id\": \"homePage\" },\"icon\": \"leaf\"},\"metadata\": { \"href\": \"Home.html\" }},{ \"data\":{\"title\": \"Message Center\",\"attr\": { \"id\": \"messageCenter\" },\"icon\": \"leaf\"},\"metadata\": {\"href\": \"#\"}},{ \"data\":{\"title\": \"Patient Data\",\"attr\": { \"id\": \"patientData\" },\"icon\": \"folder\"},\"children\":[{ \"data\": { \"title\": \"Patient Search\", \"icon\": \"leaf\"} },{ \"data\": { \"title\": \"Patient Summary\", \"icon\": \"leaf\"} }]},{ \"data\":{\"title\": \"Tools\",\"attr\": { \"id\": \"tools\" },\"icon\": \"folder\"},\"children\": []}};";
        }

        [WebMethod]
        public string ChangeMenuCase(string menuJson)
        {
            Menu menu = JsonConvert.DeserializeObject<Menu>(menuJson);
            if (menu != null)
            {
                foreach (MenuItem menuItem in menu.MenuItems)
                {
                    ChangeMenuNameOppositeCase(menuItem);
                }
                return JsonConvert.SerializeObject(menu);
            }
            return menuJson;
        }

        private void ChangeMenuNameOppositeCase(MenuItem menuItem)
        {
            if (menuItem != null)
            {
                string nameCase = string.Empty;
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
            if (userIdCookie != null && (string.Compare(userIdCookie.Value, "admin", StringComparison.OrdinalIgnoreCase) == 0))
            {
                roles.Add("admin");
            }
            return roles.ToArray();
        }

        [WebMethod]
        public string GetUser(string userName)
        {
            UserInfo user = _userDB.GetUser(userName);
            return JsonConvert.SerializeObject(user);
        }

        [WebMethod]
        public string NewUser(string userInfoJson)
        {
            UserInfo userInfo = JsonConvert.DeserializeObject<UserInfo>(userInfoJson);
            if (_userDB.IsExist(userInfo.Name))
            {
                return "user already exist!";
            }
            userInfo = _userDB.AddUser(userInfo);
            if (userInfo == null)
            {
                return "failed to add new user";
            }
            return "success!";
        }

        [WebMethod]
        public string CheckUser(string userName,string password)
        {
            UserInfo user = _userDB.GetUser(userName);
            if(user.Password==password)
            {
                return "true";
            }
            return "false";
        }

        public string JsonUser(UserInfo userInfo)
        {
            return JsonConvert.SerializeObject(userInfo);
        }

        [WebMethod]
        public string SayHello()
        {
            return "Hello, world";
        }

        [WebMethod]
        public string SayHello2(string name)
        {
            return "{Hello: " + name + "}";
        }

    }
}