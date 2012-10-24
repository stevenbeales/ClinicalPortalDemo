
var cp = (function () {

    var resourceUrls = [];

    // to do
    var isSameResource = function (url1, url2) {
        if (url1.toLowerCase() === url2.toLowerCase()) {
            return true;
        }
        return false;
    }

    var isExist = function (resourceUrl) {
        var i = 0;
        if (resourceUrl) {
            for (i; i < resourceUrls.length; i++) {
                if (isSameResource(resourceUrls[i], resourceUrl)) {
                    return true;
                }
            }
        }
        return false;
    }

    var addResourceUrl = function (url) {
        if (!isExist(url)) {
            resourceUrls.push(url);
        }
    }

    var parseUrl = function (url, method) {
        return url + "/" + method;
    }

    var getControlID = function (controlId) {
        return "#" + controlId;
    }

    // just temp check
    function checkUrl(url) {
        if (url != null && url.match(/\.htm[l]$/)) {
            return true;
        }
        return false;
    }

    var cpObj = {
        checkUser: function () {
            var userId = $.cookie("inforSignInDialog:userId");
            if (userId == null) {
                return false;
            }
            $(getControlID("userId")).html(userId);
            return true;
        },

        ajaxJson: function (requestType, url, method, data, successFn, completeStatusFn) {
            var responseResult = {};
            $.ajax({
                "type": requestType,
                "url": parseUrl(url, method),
                "contentType": "application/json; charset=utf-8",
                "datatype": "json",
                "data": data,
                "success": function (data, textStatus, jqXHR) {
                    if (successFn) {
                        successFn($.parseJSON(data.d));
                    }
                },
                "error": function (jqXHR, textStatus, errorThrown) {
                    responseResult.error = { "textStatus": textStatus, "errorThrown": errorThrown };
                },
                "complete": function (jqXHR, textStatus) {
                    if (completeStatusFn) {
                        completeStatusFn(responseResult);
                    }
                }
            });
        },

        showIndicator: function () {

        },

        hideIndicator: function () {

        },

        loadPage: function (controlId, url) {
            if (checkUrl(url)) {
                $(getControlID(controlId)).load(url);
            }
        },

        loadPageAsyn: function (controlId, url) {
            var thisObj = this;
            if (checkUrl(url)) {
                $.ajax(
                { "type": "GET",
                    "url": url,
                    "beforeSend": function () {
                        thisObj.showIndicator();
                    },
                    "success": function (msg) {
                        $("#" + controlId).html(msg);
                    },
                    "complete": function () {
                        thisObj.hideIndicator();
                    }
                });
            }
        },

        loadJS: function (url, alwaysServer) {
            if (alwaysServer || !isExist(url)) {
                $.ajax(
                {
                    "type": "GET",
                    "url": url,
                    "datatype": "script",
                    "async": false,
                    "cache": !alwaysServer,
                    "success": function () {
                        addResourceUrl(url);
                    }
                });
            }
        },
        // bad method
        loadCss: function (url, alwaysServer) {
            if (alwaysServer || !isExist(url)) {
                $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
//                $.ajax(
//                {
//                    "type": "GET",
//                    "url": url,
//                    "datatype": "text/css",
//                    "async": false,
//                    "cache": !alwaysServer,
//                    "success": function () {
//                        addResourceUrl(url);
//                    }
//                });
            }
        }
    };

    return cpObj;
} ());