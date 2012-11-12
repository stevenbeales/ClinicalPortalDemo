using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    public class MenuItemCoreData
    {
        private string _icon;
        private string _title;
        private IDictionary<string, string> _attr;

        public MenuItemCoreData()
        {
            _attr = new Dictionary<string, string>();
        }

        [JsonProperty("title")]
        public string Title
        {
            get { return _title; }
            set { _title = value; }
        }

        [JsonProperty("attr")]
        public IDictionary<string, string> Attr
        {
            get { return _attr; }
            set { _attr = value; }
        }

        [JsonProperty("icon")]
        public string Icon
        {
            get { return _icon; }
            set { _icon = value; }
        }

    }
}