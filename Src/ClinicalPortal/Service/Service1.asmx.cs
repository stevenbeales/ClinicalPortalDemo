using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using ClinicalPortal.Service;

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
        public string GetMenu()
        {
            string[] roles = GetUserRoles();
            Menu menu = new Menu();
            menu.BuildMenu(roles);
            return menu.ToJson();
            //return "{\"data\": [{ \"data\":{\"title\": \"Home Page\",\"attr\": { \"id\": \"homePage\" },\"icon\": \"leaf\"},\"metadata\": { \"href\": \"Home.html\" }},{ \"data\":{\"title\": \"Message Center\",\"attr\": { \"id\": \"messageCenter\" },\"icon\": \"leaf\"},\"metadata\": {\"href\": \"#\"}},{ \"data\":{\"title\": \"Patient Data\",\"attr\": { \"id\": \"patientData\" },\"icon\": \"folder\"},\"children\":[{ \"data\": { \"title\": \"Patient Search\", \"icon\": \"leaf\"} },{ \"data\": { \"title\": \"Patient Summary\", \"icon\": \"leaf\"} }]},{ \"data\":{\"title\": \"Tools\",\"attr\": { \"id\": \"tools\" },\"icon\": \"folder\"},\"children\": []}};";
        }

        private string[] GetUserRoles()
        {
            List<string> roles = new List<string>();
            string userId = this.Context.Request.Cookies["inforSignInDialog:userId"].Value;
            if (string.Compare(userId, "admin", true) == 0)
            {
                roles.Add("admin");
            }
            return roles.ToArray();
        }
    }
}