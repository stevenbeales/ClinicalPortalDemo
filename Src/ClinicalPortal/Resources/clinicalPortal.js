
function checkUser() {
    var userId = $.cookie("inforSignInDialog:userId");
    if (userId == null) {
        return false;
    }
    $("#userId").html(userId);
    return true;
}

function loadPage(controlId, url) {
    if (checkUrl(url)) {
        $("#" + controlId).load(url);
    }
}

function loadPageAsyn(controlId, url) {
    if (checkUrl(url)) {
        $.ajax(
        { "type": "GET",
            "url": url,
            "beforeSend": function () {
                showIndicator();
            },
            "success": function (msg) {
                $("#" + controlId).html(msg);
            },
            "complete": function () {
                hideIndicator();
            }
        })
    }
}

// just temp check
function checkUrl(url) {
    if (url != null && url.match(/\.htm[l]$/)) {
        return true;
    }
    return false;
}

function requestJson(url, successFn) {
    $.ajax({
        "type": "POST",
        "url": url,
        "contentType": "application/json; charset=utf-8",
        "datatype": "json",
        "success": successFn
    });
}

function requestMenuJson() {
    requestJson("Service/Service1.asmx/GetMenu", buildMenuTree);
}

function buildMenuTree(data) {
    $("#menu").inforTree({ "json_data": $.parseJSON(data.d) })
                    .bind("click", function (e, data) {
                        loadPageAsyn("content", e.target.href);
                    });
    //    $("#menu").inforTree({ "json_data": $.parseJSON(data.d) })
    //                    .bind("select_node.jstree", function (e, data) {
    //                        var pageUrl = $.data(data.rslt.obj[0], "href");
    //                        loadPageAsyn("content", pageUrl);
    //                    });
}

function showIndicator() {
    //$("#loadIndicator").inforLoadingIndicator({ "delay": 100 });
}

function hideIndicator() {
    //$("#loadIndicator").inforLoadingIndicator("close");
}


function CallHelloWorld() {
    $.ajax({
        "type": "POST",
        "url": "Service/Service1.asmx/HelloWorld",
        "contentType": "application/json; charset=utf-8",
        //"data": {},
        "datatype": "json",
        "success": function (msg) {
            //alert(msg);
            $("#content").html(msg.d);
        }
    });
}