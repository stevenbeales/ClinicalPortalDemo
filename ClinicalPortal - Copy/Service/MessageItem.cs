using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    public class MessageItem
    {
        private string _id;
        private string _topic;
        private string _content;

        private string _sent;
        private string _from;
        private string _patient;

        public MessageItem()
        {

        }

        [JsonProperty("sent")]
        public string Sent
        {
            get { return _sent; }
            set { _sent = value; }
        }

        [JsonProperty("from")]
        public string From
        {
            get { return _from; }
            set { _from = value; }
        }

        [JsonProperty("patient")]
        public string Patient
        {
            get { return _patient; }
            set { _patient = value; }
        }

        [JsonProperty("msgId")]
        public string Id
        {
            get { return _id; }
            set { _id = value; }
        }

        [JsonProperty("topic")]
        public string Topic
        {
            get { return _topic; }
            set { _topic = value; }
        }

        [JsonProperty("content")]
        public string Content
        {
            get { return _content; }
            set { _content = value; }
        }
    }
}