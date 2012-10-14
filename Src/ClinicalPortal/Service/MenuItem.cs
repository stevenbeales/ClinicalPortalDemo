using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace ClinicalPortal.Service
{
    internal class MenuItem
    {
        private string _icon;
        private string _title;
        private IDictionary<string, string> _metaData;
        private IDictionary<string, string> _attr;
        private IList<MenuItem> _children;

        public MenuItem()
        {
            _attr = new Dictionary<string, string>();
            _metaData = new Dictionary<string, string>();
            _children = new List<MenuItem>();
        }

        public IList<MenuItem> Children
        {
            get { return _children; }
            set { _children = value; }
        }

        public string Title
        {
            get { return _title; }
            set { _title = value; }
        }

        public IDictionary<string, string> Attr
        {
            get { return _attr; }
            set { _attr = value; }
        }

        public string Icon
        {
            get { return _icon; }
            set { _icon = value; }
        }

        public IDictionary<string, string> MetaData
        {
            get { return _metaData; }
            set { _metaData = value; }
        }

        public void AppendChildMenu(MenuItem child)
        {
            this.Children.Add(child);
        }

        public void AppendAttr(string name, string value)
        {
            this.Attr[name] = value;
        }

        public void AppendMetaData(string name, string value)
        {
            this.MetaData[name] = value;
        }

        private void QuotationString(StringBuilder json,string value){
            json.Append("\"").Append(value).Append("\"");
        }

        private void KeyValueToJson(StringBuilder json, string key, string value)
        {
            QuotationString(json,key);
            json.Append(":");
            QuotationString(json,value);
        }



        private void AppendBracket(StringBuilder json)
        {
            json.Insert(0, "{");
            json.Append("}");
        }

        private string ObjectLiteral(string objName,IDictionary<string,string> properties)
        {
            StringBuilder objJson = new StringBuilder();
            QuotationString(objJson,objName);
            objJson.Append(":").Append("{");
            
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

        public string ToJson()
        {
            StringBuilder json = new StringBuilder();
            json.Append("{");

            // data
            QuotationString(json, "data");
            json.Append(":").Append("{");
            
            KeyValueToJson(json, "title", Title);
            json.Append(",");
            KeyValueToJson(json, "icon", Icon);
            
            // attr
            if (this.Attr.Count > 0)
            {
                json.Append(",");
                json.Append(ObjectLiteral("attr", Attr));
            }
            json.Append("}");
            // end data

            // metadata
            if (this.MetaData.Count > 0)
            {   
                json.Append(",");
                json.Append(ObjectLiteral("metadata", MetaData));
            }
            //children
            if (this.Children.Count > 0)
            {
                json.Append(",");
                QuotationString(json,"children");
                json.Append(":").Append("[");
                for (int i = 0; i < Children.Count; i++)
                {
                    if (i >= 1)
                    {
                        json.Append(",");
                    }
                    json.Append(Children[i].ToJson());
                }
                json.Append("]");
            }
            // end children
            json.Append("}");
            
            return json.ToString();
            /*
             {
        "data": [
                    { "data":
                        {
                            "title": "Home Page",
                            "attr": { "id": "homePage" },
                            "icon": "leaf"
                        },
                        "metadata": { "href": "Home.html" }
                    },
                    { "data":
                        {
                            "title": "Message Center",
                            "attr": { "id": "messageCenter" },
                            "icon": "leaf"
                        },
                        "metadata": {"href": "#"}
                    },
                    { "data":
                        {
                            "title": "Patient Data",
                            "attr": { "id": "patientData" },
                            "icon": "folder"
                        },
                        "children":
                        [
                            { "data": { "title": "Patient Search", "icon": "leaf"} },
                            { "data": { "title": "Patient Summary", "icon": "leaf"} }
                        ]
                    },
                    { "data":
                        {
                            "title": "Tools",
                            "attr": { "id": "tools" },
                            "icon": "folder"
                        },
                        "children": []
                    }
                ]
    };
             */
        }

    }
}