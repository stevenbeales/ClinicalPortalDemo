if (typeof infor == "undefined") {
    infor = {};
}

if (typeof infor.companyon == "undefined") {
    infor.companyon = {};
}

infor.companyon.client = {};
infor.companyon.client.initialized = false;
infor.companyon.client.listeningMessageTypes = {};
infor.companyon.client.drillbackSelector = "a.companyon-drillbacklink";
infor.companyon.client.favoritesSelector = "a.companyon-favoritelink";
/**
* Send bread crumb to Sharepoint
* @package infor.companyon.client
* @method sendBreadCrumb 
* @param Array nodes The array of nodes that need to be displayed as breadcrumb. Node objects "linkText" attribute will be used as display text of the node.
* @param String sharepointUrl The url of the sharepoint page to which the message needs to be sent
* @param String appUrl The url of the application to which information needs to be sent back ( not needed for this iteration as breadcrumb passing is only one way for now )
* @param String callbackFunctionName The name of the javascript function to which the message should be sent from sharepoint to the application (( not needed for this iteration as breadcrumb passing is only one way for now )
*/
infor.companyon.client.sendBreadCrumb = function (nodes, sharepointUrl, appUrl, callbackFunctionName) {
    var message = {};
    if (appUrl == undefined) {
        appUrl = window.location.href;
    }
    message.messageType = "breadcrumb";
    message.appUrl = appUrl;
    message.callbackFunctionName = "";
    message.nodes = nodes;
    infor.companyon.client.sendMessageToSharePoint(sharepointUrl, message);
}

/**
* Send message to Sharepoint
* @package infor.companyon.client
* @method sendMessageToSharePoint 
* @param String url The url of the sharepoint page to which the message needs to be sent
* @param JSONObject message The message that needs to be sent to the sharepoint.
*/
infor.companyon.client.sendMessageToSharePoint = function (url, message) {
    var encodedMessage = $.toJSON(message);
    parent.location = url + "#" + encodedMessage;
}

$(function () {

    //dont do anything if an app iframe is already present
    if (infor.companyon.iframeId != null) {
        return;
    }

    if (window.postMessage != null) {

        if (window.attachEvent) {
            window.attachEvent("onmessage", infor.companyon.client.messageReceiver)
        } else if (window.addEventListener) {
            window.addEventListener("message", infor.companyon.client.messageReceiver, false);
        }
    }

    //drillback click handler
    $(infor.companyon.client.drillbackSelector).live("click", function (event) {
        var href = $(this).attr("href");
        infor.companyon.client.sendPrepareDrillbackMessage(href);
        event.preventDefault();

    });

    $(infor.companyon.client.favoritesSelector).live("click", function (event) {
        var href = $(this).attr("href");
        infor.companyon.client.sendPrepareFavoritesMessage(href);
        event.preventDefault();
    });

    //no need to send initclient when in a popup
    if (window.opener == null) {
        infor.companyon.client.sendMessage("initClient", {});
    }

});

infor.companyon.client.messageReceiver = function (e) {
    infor.companyon.client.executeMessage(e.data);
}

infor.companyon.client.executeMessage = function (msg) {

    if (msg == null) {
        return;
    }
    msg = $.evalJSON(msg);
    var type = msg.type;
    var data = msg.data;


    if (type == null) { return; }

    var registeredHandlers = infor.companyon.client.listeningMessageTypes[type] || [];
    $.each(registeredHandlers, function (index, elem) {
        var registeredHandler = elem.handler;
        try {
            registeredHandler(data);
        } catch (e) {
            //ignore any errors during the execution of the handler and continue to the next handler
        }
    });
}

/**
*  send a message to the infor app container.
*
*/
infor.companyon.client.sendMessage = function (type, data) {

    var message = {
        type: type,
        data: data
    }
    var encodedMessage = $.toJSON(message);


    if (infor.companyon.containerWindow === true) {

        //client is part of the main window, so use the current window to send the message
        //if ie7, use the companyon function to send the message

        if (window.postMessage != null) {
            window.postMessage(encodedMessage, "*");
        } else {

            //workaround for ie7, might be able to call the messagereceiver directly in all cases!
            if (typeof infor.companyon.messageReceiver == "function") {
                infor.companyon.messageReceiver({ data: encodedMessage });
            }

        }

    } else {

        if (window.opener != null) {
            //cannot call postMessage on opener directly, call a JS function
            //http://blogs.msdn.com/b/ieinternals/archive/2009/09/16/bugs-in-ie8-support-for-html5-postmessage-sessionstorage-and-localstorage.aspx

            try {
                window.opener.infor.companyon.client.sendMessageProxy(encodedMessage);
                window.opener.focus();
                window.opener.document.focus();
            }
            catch (e) {
                //ignore errors;
            }
            return;
        }

        if (window.postMessage != null) {
            var proxyMessage = {
                type: "workspaceProxyMessage",
                data: message
            }
            var encodedProxyMessage = $.toJSON(proxyMessage);
            if (window.top != window) {
                window.top.postMessage(encodedProxyMessage, "*");
            }
            //window.parent.postMessage(encodedMessage, "*");
        } else {

            //workaround - if the frame is not there, wait until it is created in the parentpage (usually happens during initValues message)

            function testFrameAndSend() {

                var frame = window.parent.frames["inforCommFrame"];
                if (frame != null) {
                    frame.sendMessage(encodedMessage, infor.companyon.client.sharePointUrl);
                } else {
                    setTimeout(testFrameAndSend, 100);
                }
            }
            testFrameAndSend();
        }
    }
}

/**
* to be called from popup windows, opened from the same domain
*/
infor.companyon.client.sendMessageProxy = function (encodedMessage) {
    var messageObject = $.evalJSON(encodedMessage);
    infor.companyon.client.sendMessage(messageObject.type, messageObject.data);

}

infor.companyon.client.sendPrepareDrillbackMessage = function (href) {
    var data = {
        link: href
    }
    infor.companyon.client.sendMessage("prepareApplicationDrillback", data);
}

infor.companyon.client.sendPrepareFavoritesMessage = function (href) {
    var data = {
        link: href
    }
    infor.companyon.client.sendMessage("prepareFavoriteContext", data);
}

//to be called from Silverlight
function inforCompanyOnPrepareFavorites(href) {
    infor.companyon.client.sendPrepareFavoritesMessage(href);
}

infor.companyon.client.getValueQuerystring = function (key) {
    var key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);

    var value = null;
    if (qs != null) {
        value = qs[1];
    }
    return value;
}

//ie7
infor.companyon.client.initSessionStorage = function () {
    if (window.sessionStorage == null) {
        var storageDiv = $("<div style='behavior: url(#default#userdata);display: none' id='inforSessionStorageElement'></div>");
        $(document.body).append(storageDiv);
        $("#inforSessionStorageElement").get(0).load("infor.companyon");
    }
}

infor.companyon.client.getParentUrlFromStorage = function () {

    var url = null;

    if (window.sessionStorage != null) {
        return window.sessionStorage["infor.sharePointUrl"]
    } else {

        return $("#inforSessionStorageElement").get(0).getAttribute("infor.sharePointUrl");
    }

    return url;

}


infor.companyon.client.setParentUrlInStorage = function (parentUrl) {

    if (window.sessionStorage != null) {
        window.sessionStorage["infor.sharePointUrl"] = parentUrl;
    } else {

        $("#inforSessionStorageElement").get(0).setAttribute("infor.sharePointUrl", parentUrl);
        $("#inforSessionStorageElement").get(0).save("infor.companyon");
    }
}

infor.companyon.client.registerMessageHandler = function (messageType, handler, namespace) {
    if (messageType == null || handler == null) {
        return;
    }

    var handlers = infor.companyon.client.listeningMessageTypes[messageType] || [];

    handlers.push({
        handler: handler,
        namespace: namespace
    });

    infor.companyon.client.listeningMessageTypes[messageType] = handlers;

    //inform the parent about this message type
    infor.companyon.client.sendMessage("workspaceClientSubscribe", {
        messageType: messageType
    });
}
infor.companyon.client.unRegisterMessageHandler = function (messageType, namespace) {
    if (messageType == null) {
        return;
    }

    var handlers = infor.companyon.client.listeningMessageTypes[messageType] || [];
    var newHandlers = [];
    $.each(handlers, function (index, elem) {
        if (elem.namespace != namespace) {
            newHandlers.push(elem);
        }
    });

    infor.companyon.client.listeningMessageTypes[messageType] = newHandlers;
}

infor.companyon.client.bind = infor.companyon.client.registerMessageHandler;
infor.companyon.client.unbind = infor.companyon.client.unRegisterMessageHandler;

/**
* If an array is send from other frames, the jquery-json library was not recognizing it as arrays and was treating it as regular
* objects instead. This happens if the browser doesnt support JSON serialization function(JSON.stringify) natively. In such cases, override
* the toJSON function and fix the array issue. This happens only in IE7 since all the other browsers supported by Workspace has JSON.stringify builtin
* 
*/
if (typeof (JSON) == 'object' && JSON.stringify) {

} else {
    $.toJSON = function (o) {
        if (typeof (JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);

        var type = typeof (o);

        if (o === null)
            return "null";

        if (type == "undefined")
            return undefined;

        if (type == "number" || type == "boolean")
            return o + "";

        if (type == "string")
            return $.quoteString(o);

        if (type == 'object') {
            if (typeof o.toJSON == "function")
                return $.toJSON(o.toJSON());

            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();

                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;

                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;

                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;

                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds +
                             '.' + milli + 'Z"';
            }

            //changed from "o.Constructor == Array", since arrays send from other frames may not match
            if ($.isArray(o)) {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push($.toJSON(o[i]) || "null");

                return "[" + ret.join(",") + "]";
            }

            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys

                if (typeof o[k] == "function")
                    continue;  //skip pairs where the value is a function.

                var val = $.toJSON(o[k]);

                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };
}