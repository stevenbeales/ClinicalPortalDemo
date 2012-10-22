
var cp = (function () {

    var cpObj = {
        requestJson: function (url, method, successFn) {
            $.ajax({
                "type": "POST",
                "url": url,
                "contentType": "application/json; charset=utf-8",
                "datatype": "json",
                "success": successFn
            });
        }
    };
});