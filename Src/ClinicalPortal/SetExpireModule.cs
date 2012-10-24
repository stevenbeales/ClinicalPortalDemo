using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicalPortal
{
    public class SetExpireModule : IHttpModule
    {
        public String ModuleName
        {
            get { return "SetExpireModule"; }
        }

        #region IHttpModule Members

        public void Init(HttpApplication context)
        {
            context.BeginRequest += (new EventHandler(this.Application_BeginRequest));
        }

        // Your BeginRequest event handler.
        private void Application_BeginRequest(Object source, EventArgs e)
        {
            HttpApplication application = (HttpApplication)source;
            HttpContext context = application.Context;
            if (context.Request.Url.AbsolutePath.EndsWith(".js"))
            {
                context.Response.CacheControl = System.Web.HttpCacheability.Public.ToString();
                context.Response.Cache.SetExpires(DateTime.Now.AddHours(1));
            }
        }

        public void Dispose()
        {

        }

        #endregion
    }
}