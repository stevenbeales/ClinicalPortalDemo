using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    internal class Menu
    {
        private IList<MenuItem> _menuItems;

        [JsonProperty("data")]
        public IList<MenuItem> MenuItems
        {
            get { return _menuItems; }
            set { _menuItems = value; }
        }

        public Menu()
        {
            _menuItems = new List<MenuItem>();
        }

        internal void BuildMenu(string[] roles)
        {
            //Home Page
            MenuItem homeMenu = new MenuItem();
            homeMenu.Title = "Home Page";
            homeMenu.Icon = "leaf";
            homeMenu.AppendAttr("id", "homePage");
            homeMenu.AppendAttr("href", "Home.html");
            MenuItems.Add(homeMenu);

            //Message Center
            MenuItem msgMenu = new MenuItem();
            msgMenu.Title = "Message Center";
            msgMenu.Icon = "leaf";
            msgMenu.AppendAttr("id", "messageCenter");
            msgMenu.AppendAttr("href", "MessageCenter.html");
            MenuItems.Add(msgMenu);

            //Patient Data
            MenuItem patientMenu = new MenuItem();
            patientMenu.Title = "Patient Data";
            patientMenu.Icon = "folder";
            patientMenu.AppendAttr("id", "patientData");
            MenuItems.Add(patientMenu);

            MenuItem patientSearchMenu = new MenuItem();
            patientSearchMenu.Title = "Patient Search";
            patientSearchMenu.Icon = "leaf";
            patientSearchMenu.AppendAttr("id", "patientSearch");
            patientSearchMenu.AppendAttr("href", "PatientSearch.html");
            patientMenu.AppendChildMenu(patientSearchMenu);

            MenuItem patientSummaryMenu = new MenuItem();
            patientSummaryMenu.Title = "Patient Summary";
            patientSummaryMenu.Icon = "leaf";
            patientSummaryMenu.AppendAttr("id", "patientSummary");
            patientSummaryMenu.AppendAttr("href", "PatientSummary.html");
            patientMenu.AppendChildMenu(patientSummaryMenu);
            //Tools
            if (HasRole("admin", roles))
            {
                MenuItem toolsMenu = new MenuItem();
                toolsMenu.Title = "Tools";
                toolsMenu.Icon = "folder";
                toolsMenu.AppendAttr("id", "tools");
                toolsMenu.AppendAttr("href", "Tools.html");
                MenuItems.Add(toolsMenu);
            }
        }

        //public string ToJson()
        //{
        //    StringBuilder json = new StringBuilder();
        //    json.Append("{");
        //    JsonHelper.QuotationString(json, "data");
        //    json.Append(":");
        //    json.Append("[");
        //    for (int i = 0; i < MenuItems.Count; i++)
        //    {
        //        if (i >= 1)
        //        {
        //            json.Append(",");
        //        }
        //        json.Append(MenuItems[i].ToJson());
        //    }
        //    json.Append("]");
        //    json.Append("}");

        //    return json.ToString();
        //}

        private bool HasRole(string role, string[] roles)
        {
            foreach (string roleItem in roles)
            {
                if (string.Compare(role, roleItem, true) == 0)
                {
                    return true;
                }
            }
            return false;
        }

    }
}