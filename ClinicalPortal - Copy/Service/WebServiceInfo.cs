using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Reflection;

namespace ClinicalPortal.Service
{
    public class WebServiceInfo
    {
        private Type _serviceType;
        private WebMethodInfo[] _methods;

        public WebServiceInfo(Type serviceType)
        {
            _serviceType = serviceType;
        }

        public Type ServiceType
        {
            get { return _serviceType; }
        }

        public WebMethodInfo[] WebMethods
        {
            get
            {
                if (_methods == null)
                {
                    List<WebMethodInfo> webMethods = new List<WebMethodInfo>();
                    foreach (MethodInfo method in _serviceType.GetMethods())
                    {
                        if (method.IsPublic && method.GetCustomAttributes(typeof(WebMethodAttribute), true).Length > 0)
                        {
                            webMethods.Add(new WebMethodInfo(method));
                        }
                    }
                    _methods = webMethods.ToArray();
                }
                return _methods;
            }
        }
    }
}