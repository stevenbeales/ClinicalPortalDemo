// Type: System.Web.Services.WebMethodAttribute
// Assembly: System.Web.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a
// Assembly location: C:\Windows\Microsoft.NET\Framework\v4.0.30319\System.Web.Services.dll

using System;
using System.EnterpriseServices;
using System.Runtime;

namespace System.Web.Services
{
    /// <summary>
    /// Adding this attribute to a method within an XML Web service created using ASP.NET makes the method callable from remote Web clients. This class cannot be inherited.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class WebMethodAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Web.Services.WebMethodAttribute"/> class.
        /// </summary>
        public WebMethodAttribute();

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Web.Services.WebMethodAttribute"/> class.
        /// </summary>
        /// <param name="enableSession">Initializes whether session state is enabled for the XML Web service method. </param>
        public WebMethodAttribute(bool enableSession);

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Web.Services.WebMethodAttribute"/> class.
        /// </summary>
        /// <param name="enableSession">Initializes whether session state is enabled for the XML Web service method. </param><param name="transactionOption">Initializes the transaction support of an XML Web service method. </param>
        public WebMethodAttribute(bool enableSession, TransactionOption transactionOption);

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Web.Services.WebMethodAttribute"/> class.
        /// </summary>
        /// <param name="enableSession">Initializes whether session state is enabled for the XML Web service method. </param><param name="transactionOption">Initializes the transaction support of an XML Web service method. </param><param name="cacheDuration">Initializes the number of seconds the response is cached. </param>
        public WebMethodAttribute(bool enableSession, TransactionOption transactionOption, int cacheDuration);

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Web.Services.WebMethodAttribute"/> class.
        /// </summary>
        /// <param name="enableSession">Initializes whether session state is enabled for the XML Web service method. </param><param name="transactionOption">Initializes the transaction support of an XML Web service method. </param><param name="cacheDuration">Initializes the number of seconds the response is cached. </param><param name="bufferResponse">Initializes whether the response for this request is buffered. </param>
        public WebMethodAttribute(bool enableSession, TransactionOption transactionOption, int cacheDuration, bool bufferResponse);

        /// <summary>
        /// A descriptive message describing the XML Web service method.
        /// </summary>
        /// 
        /// <returns>
        /// A descriptive message describing the XML Web service method. The default value is <see cref="F:System.String.Empty"/>.
        /// </returns>
        public string Description { get; set; }

        /// <summary>
        /// Indicates whether session state is enabled for an XML Web service method.
        /// </summary>
        /// 
        /// <returns>
        /// true if session state is enabled for an XML Web service method. The default is false.
        /// </returns>
        public bool EnableSession { [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
        get; set; }

        /// <summary>
        /// Gets or sets the number of seconds the response should be held in the cache.
        /// </summary>
        /// 
        /// <returns>
        /// The number of seconds the response should be held in the cache. The default is 0, which means the response is not cached.
        /// </returns>
        public int CacheDuration { [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
        get; set; }

        /// <summary>
        /// Gets or sets whether the response for this request is buffered.
        /// </summary>
        /// 
        /// <returns>
        /// true if the response for this request is buffered; otherwise, false. The default is true.
        /// </returns>
        public bool BufferResponse { [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
        get; set; }

        /// <summary>
        /// Indicates the transaction support of an XML Web service method.
        /// </summary>
        /// 
        /// <returns>
        /// The transaction support of an XML Web service method. The default is <see cref="F:System.EnterpriseServices.TransactionOption.Disabled"/>.
        /// </returns>
        public TransactionOption TransactionOption { [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
        get; set; }

        /// <summary>
        /// The name used for the XML Web service method in the data passed to and returned from an XML Web service method.
        /// </summary>
        /// 
        /// <returns>
        /// The name used for the XML Web service method in the data passed to and from an XML Web service method. The default is the name of the XML Web service method.
        /// </returns>
        public string MessageName { get; set; }
    }
}
