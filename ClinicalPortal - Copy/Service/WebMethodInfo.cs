using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using Newtonsoft.Json;

namespace ClinicalPortal.Service
{
    /*
    [   {"methodName":"GetMethodList","returnType":"String","parameters":[]},
        {"methodName":"GetMessageList","returnType":"String","parameters":[]},
        {"methodName":"GetMessageItem","returnType":"String","parameters":[{"paraName":"msgId","paraType":"String"}]},
        {"methodName":"GetMessageCount","returnType":"String","parameters":[]},
        {"methodName":"GetMenu","returnType":"String","parameters":[]},
        {"methodName":"ChangeMenuCase","returnType":"String","parameters":[{"paraName":"menuJson","paraType":"String"}]}
    ]

*/
    public class WebMethodInfo
    {
        private MethodInfo _methodInfo;
        private WebMethodParameterInfo[] _paras;

        public WebMethodInfo(MethodInfo methodInfo)
        {
            _methodInfo = methodInfo;
        }

        [JsonProperty("methodName")]
        public string Name
        {
            get
            {
                return _methodInfo.Name;
            }
        }

        [JsonProperty("returnType")]
        public string ReturnType
        {
            get
            {
                return _methodInfo.ReturnType.Name;
            }
        }

        [JsonProperty("parameters")]
        public WebMethodParameterInfo[] Parameters
        {
            get
            {
                if (_paras == null)
                {
                    List<WebMethodParameterInfo> paras = new List<WebMethodParameterInfo>();
                    foreach (ParameterInfo para in _methodInfo.GetParameters())
                    {
                        paras.Add(new WebMethodParameterInfo(para));
                    }
                    _paras = paras.ToArray();
                }
                return _paras;
            }
        }

        [JsonIgnore()]
        public MethodInfo MethodInfo
        {
            get { return _methodInfo; }
        }
    }

    public class WebMethodParameterInfo
    {
        private ParameterInfo _para;

        public WebMethodParameterInfo(ParameterInfo para)
        {
            _para = para;
        }

        [JsonProperty("paraName")]
        public string Name
        {
            get
            {
                return _para.Name;
            }
        }

        [JsonProperty("paraType")]
        public string ParaType
        {
            get
            {
                return _para.ParameterType.Name;
            }
        }

        [JsonIgnore()]
        public ParameterInfo ParaInfo
        {
            get
            {
                return _para;
            }
        }
    }
}