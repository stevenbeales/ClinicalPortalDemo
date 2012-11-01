
// get web service class operations
(function (cp) {

    var serviceMethods;

    var waitUtil = function (checkIntervalms, checkFn) {
        while (!checkFn()) {
            var timeOutId = setTimeout(function () { }, checkIntervalms);
        }
    };

    var checkComplete = function () {
        if (serviceMethods) {
            return true;
        }
        return false;
    };

    var setMethods = function (methodsArray) {
        serviceMethods = methodsArray;
    };

    var serviceResolver = {
        "getMethods": function (serviceUrl) {
            cp.ajaxJson("POST", serviceUrl, "GetMethodList", undefined, setMethods, false);
            //waitUtil(1000, checkComplete);
            return serviceMethods;
        }
    };

    cp.serviceResolver = serviceResolver;

})(cp);