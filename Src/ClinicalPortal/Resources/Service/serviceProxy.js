
/*
[   {"methodName":"GetMethodList","returnType":"String","parameters":[]},
{"methodName":"GetMessageList","returnType":"String","parameters":[]},
{"methodName":"GetMessageItem","returnType":"String","parameters":[{"paraName":"msgId","paraType":"String"}]},
{"methodName":"GetMessageCount","returnType":"String","parameters":[]},
{"methodName":"GetMenu","returnType":"String","parameters":[]},
{"methodName":"ChangeMenuCase","returnType":"String","parameters":[{"paraName":"menuJson","paraType":"String"}]}
]

*/

// create js object mirror to the web service class
(function (cp) {

    var serviceUrl;
    var serviceResolver = cp.serviceResolver;

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