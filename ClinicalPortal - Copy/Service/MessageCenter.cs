using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    public class MessageCenter
    {
        private IList<MessageItem> _messages;

        public MessageCenter()
        {
            _messages = new List<MessageItem>();
            BuildMessages();
        }

        private void BuildMessages()
        {
            _messages.Add(CreateMessage("3", "Greensboro", "6538227668", "", "78 Rocky Second St.", "content1111"));

            _messages.Add(CreateMessage("4", "Greensboro", "845-9216316", "452 East Milton Way", "452 East Milton Way", "content222222"));

            _messages.Add(CreateMessage("5", "Memphis", "8678333362", "364 East White Hague Boulevard", "706 Green Old Parkway", "content3333"));

            _messages.Add(CreateMessage("6", "Memphis", "406-4415713", "64 White Old Parkway", "91 Cowley St.", "content44444"));

            _messages.Add(CreateMessage("7", "Memphis", "527-962-1875", "132 Clarendon St.", "44 Rocky Fabien Parkway", "content555555"));

            _messages.Add(CreateMessage("8", "Memphis", "9265837916", "897 Green Hague Road", "98 Old Street", "content666666"));
        }

        public IEnumerable<MessageItem> GetMessages()
        {
            return _messages;
        }

        public MessageItem GetMessage(string msgId)
        {
            foreach (MessageItem item in _messages)
            {
                if (item.Id == msgId)
                {
                    return item;
                }
            }
            return null;
        }

        private MessageItem CreateMessage(string msgId, string sent, string from, string patient, string topic, string content)
        {
            MessageItem message = new MessageItem();
            message.Id = msgId;
            message.Sent = sent;
            message.From = from;
            message.Patient = patient;
            message.Topic = topic;
            message.Content = content;
            return message;
        }
    }
}