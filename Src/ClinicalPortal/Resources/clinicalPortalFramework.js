(function (window, $) {

    var cpSetting = {
        contentCtrlId: "content",
        enableHistory: true
    };

    var parseUrl = function (url, method) {
        return url + "/" + method;
    };

    var getControlId = function (controlId) {
        return "#" + controlId;
    };

    // just temp check
    function checkUrl(url) {
        if (url && typeof url === "string") {
            if (url.indexOf(".html") >= 0) {
                return true;
            }
            if (url.indexOf(".htm") >= 0) {
                return true;
            }
            if (url.indexOf(".aspx") >= 0) {
                return true;
            }
        }
        return false;
    }

    var urlReg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

    var getLocalhostUrlHash = function (url) {
        //http://localhost:64235/Home.html
        var localhostIndex = url.indexOf("localhost");
        var startIndex = -1;
        if (localhostIndex >= 0) {
            startIndex = url.indexOf("/", localhostIndex);
            if (startIndex >= 0) {
                return url.slice(startIndex + 1);
            }
        }
        return "";
    };

    var createHash = function (url) {
        var matched = urlReg.exec(url);
        var hash = (matched && matched[0]) || getLocalhostUrlHash(url);
        if (hash && (typeof hash === "string")) {
            if (hash.slice(0, 1) !== "#") {
                return "#" + hash;
            }
        }
    };

    var setHistory = function (url, controlId, storeInHistory) {
        if (cpSetting.enableHistory && storeInHistory !== false) {
            cp.historyMark.sethash(createHash(url), url, controlId);
        }
    };

    var getContentCtrlId = function (controlId) {
        return controlId || cpSetting.contentCtrlId;
    };

    var xhr = (function () {
        try {
            if (window.ActiveXObject) {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            return new window.XMLHttpRequest();
        }
        catch (e) { }
        return undefined;
    });

    var cp = {
        init: function (setting) {
            $.extend(cpSetting, setting);
            if (cpSetting.enableHistory) {
                setInterval(cp.historyMark.checkhash, 400);
            }
        },

        checkUser: function () {
            var userId = $.cookie("inforSignInDialog:userId");
            if (userId == null) {
                return false;
            }
            $(getControlId("userId")).html(userId);
            return true;
        },

        ajaxJson: function (requestType, url, method, data, successFn, async) {
            var defaultSettings = {
                "type": requestType,
                "url": parseUrl(url, method),
                "contentType": "application/json; charset=utf-8",
                "datatype": "json",
                "data": data,
                "async": (async === undefined) || async,
                "success": function (responseData, textStatus, jqXHR) {
                    if (successFn) {
                        successFn($.parseJSON(responseData.d));
                    }
                }
            };
            $.ajax(defaultSettings);
        },

        showIndicator: function () {

        },

        hideIndicator: function () {

        },

        createElement: function (tagName) {
            return $("<" + tagName + "/>");
        },

        loadPageAsyn: function (url, controlId, storeInHistory, successFn) {
            var thisObj = this;
            controlId = getContentCtrlId(controlId);
            if (checkUrl(url)) {
                $.ajax(
                { "type": "GET",
                    "url": url,
                    "beforeSend": function () {
                        thisObj.showIndicator();
                    },
                    "success": function (msg) {
                        setHistory(url, controlId, storeInHistory);
                        if (successFn) {
                            successFn(msg);
                        }
                        $("#" + controlId).html(msg);
                    },
                    "complete": function () {
                        thisObj.hideIndicator();
                    }
                });
            }
        },

        ready: function (callbackFn) {
            if (callbackFn) {
                $.ready(callbackFn);
            }
        }
    };

    // history
    (function (window) {

        var lasthash = '';
        var isie = false;
        var iecount = 0;
        var ieVersion = 0;
        var historyMarked = [];

        var isValidHash = function (hash) {
            return typeof hash === "string";
        };

        var supportHistory = function () {
            return cpSetting.enableHistory && true;
        };

        var historyMark = {
            initialize: function () {
                var quirks = document.compatMode;
                if (document.all) {
                    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { ieVersion = new Number(RegExp.$1); }
                    if (ieVersion >= 8 && quirks == 'BackCompat' || ieVersion < 8) {
                        this.iframe();
                        isie = true;
                    }
                }
                //setInterval(cp.historyMark.checkhash, 400);
            },
            sethash: function (hash, url, controlId) {
                if (supportHistory() && isValidHash(hash)) {
                    if (isie) { iecount++; }
                    var str = hash + ',' + url + ',' + controlId + ',' + iecount;
                    var num = '';
                    var partof = false;
                    lasthash = hash;
                    window.location.href = hash;
                    for (var i = 0; i < historyMarked.length; i++) {
                        var bookmarkInfo = historyMarked[i].split(",");
                        if (bookmarkInfo[0] == hash) {
                            partof = true;
                            num = bookmarkInfo[3];
                        }
                    }
                    if (isie) {
                        if (!partof) {
                            this.setiframe(hash, iecount);
                        } else {
                            this.setiframe(hash, num);
                        }
                    }
                    if (!partof) {
                        historyMarked.push(str);
                    }
                }
            },
            checkhash: function () {
                if (supportHistory()) {
                    var currentHash = window.location.hash;
                    var historyUrl, historyCtrlId, historyHash;
                    if (currentHash !== lasthash) {
                        if (lasthash !== undefined) {
                            for (var i = 0; i < historyMarked.length; i++) {
                                var bookmarkInfo = historyMarked[i].split(",");
                                if (bookmarkInfo[0] === currentHash) {
                                    historyHash = bookmarkInfo[0]; historyUrl = bookmarkInfo[1]; historyCtrlId = bookmarkInfo[2];
                                    break;
                                }
                            }
                            if (historyHash && historyUrl && historyCtrlId) {
                                lasthash = historyHash;
                                cp.loadPageAsyn(historyUrl, historyCtrlId);
                            }
                        }
                    }

                }
            },
            iframe: function () {
                var hiddenFrame = document.createElement("iframe");
                hiddenFrame.id = 'hiddenFrame';
                hiddenFrame.style.width = '100px';
                hiddenFrame.style.height = '100px';
                hiddenFrame.style.display = 'none';
                document.body.appendChild(hiddenFrame);
            },
            setiframe: function (hash, num) {
                document.getElementById('hiddenFrame').src = 'default.html?' + num + hash;
            },
            fixiframe: function (hash) {
                var currentHash = window.location.hash;
                if (hash) {
                    if (hash !== currentHash) {
                        window.location.href = hash;
                    }
                }
            }
        };

        historyMark.initialize();
        cp.historyMark = historyMark;

    })(window);

    // create js object mirror to the web service class
    (function (cp) {

        var serviceUrl;

        // get web service class operations
        var serviceResolver = (function (cp) {

            var serviceMethods;

            var setMethods = function (methodsArray) {
                serviceMethods = methodsArray;
            };

            return {
                "getMethods": function (webServiceUrl) {
                    cp.ajaxJson("POST", webServiceUrl, "GetMethodList", undefined, setMethods, false);
                    return serviceMethods;
                }
            };

        })(cp);

        var createMethod = function (methodItem) {
            // encapsulate args to jsonData
            var getParasJson = function (parasArray) {
                parasArray = parasArray || [];
                var parasJson = "{";
                var methodParas = methodItem.parameters;
                for (var i = 0; i < methodParas.length; i++) {
                    if (i > 0) {
                        parasJson += ",";
                    }
                    parasJson += "\"" + methodParas[i].paraName + "\":\'" + (parasArray[i] || "") + "\'";
                }
                parasJson += "}";
                return parasJson;
            };

            return (function () {
                var parasJson = getParasJson(arguments);
                cp.ajaxJson("POST", serviceUrl, methodItem.methodName, parasJson, function (jsonData) {
                    alert(JSON.stringify(jsonData));
                });
            });
        };

        var serviceProxy = {
            "getService": function (webServiceUrl) {
                serviceUrl = webServiceUrl;
                var serviceMethods = serviceResolver.getMethods(serviceUrl);
                var methodItem;
                var serviceObj = {};
                for (var i = 0; i < serviceMethods.length; i++) {
                    methodItem = serviceMethods[i];
                    serviceObj[methodItem.methodName] = createMethod(methodItem);
                }
                return serviceObj;
            }
        };

        cp.serviceProxy = serviceProxy;

    })(cp);

    // js loader
    (function (cp) {

        var resourceUrls = [];

        var isSameResource = function (url1, url2) {
            if (url1.toLowerCase() === url2.toLowerCase()) {
                return true;
            }
            return false;
        };

        var isExist = function (resourceUrl) {
            if (resourceUrl) {
                for (var i = 0; i < resourceUrls.length; i++) {
                    if (isSameResource(resourceUrls[i], resourceUrl)) {
                        return true;
                    }
                }
            }
            return false;
        };

        var addResourceUrl = function (url) {
            if (url && typeof url === "string") {
                if (!isExist(url)) {
                    resourceUrls.push(url);
                }
            }
        };

        var httpRequest = (function () {

            var createStandard = function () {
                try {
                    return new window.XMLHttpRequest();
                }
                catch (e) { }
            };

            var createActive = function () {
                try {
                    return new window.ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { }
            };

            return createStandard() || createActive();
        } ());

        var jsCssLoader = {

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

            loadCss: function (url, alwaysServer) {
                if (alwaysServer || !isExist(url)) {
                    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
                }
            }
        };

        cp.jsCssLoader = jsCssLoader;

    })(cp);

    window.cp = cp;

})(window, jQuery);