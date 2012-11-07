using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    public class UserInfo
    {
        private string _name;
        private string _password;

        public UserInfo()
        {
            
        }

        [JsonProperty("name")]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        [JsonProperty("password")]
        public string Password
        {
            get { return _password; }
            set { _password = value; }
        }
    }
}