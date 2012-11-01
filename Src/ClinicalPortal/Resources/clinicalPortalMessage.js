(function ($, cp) {

    var showMessage = function (msgJson) {
        if (msgJson) {
            var tempContainer = $("<div></div>");
            for (var propName in msgJson) {
                if (msgJson.hasOwnProperty(propName)) {
                    tempContainer.append($("<div>" + propName + ":" + "</div>"));
                    tempContainer.append($("<div>" + msgJson[propName] + "</div>"));
                    tempContainer.append($("<br />"));
                }
            }
            $("#" + "msgDetail").append(tempContainer);
        }
    };

    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    cp.message = {
        "loadMessage": function () {
            var msgIdPara = getParameterByName("msgId");
            msgIdPara = msgIdPara || "5";
            if (msgIdPara) {
                cp.ajaxJson("POST", "Service/Service1.asmx", "GetMessageItem", "{msgId:'" + msgIdPara + "'}", showMessage);
            }
        }
    };

})(jQuery, cp)