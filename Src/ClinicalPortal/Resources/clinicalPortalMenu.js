
(function ($) {
    var cp = {

        "initPage": function () {
            $(".inforSplitter").inforSplitter();
            $(".inforSplitBarVertical").remove();

            $("#menu").inforTree({ "json_data": getMenuJson() })
                      .bind("select_node.jstree", function (e, data) {
                          var pageUrl = $.data(data.rslt.obj[0], "href");
                          this.loadPage(pageUrl);
                      });
        },

        "loadPage": function (url) {
            $("#content").load(url);
        },

        "loadPageAsyn": function (url) {
            $.ajax(
                { "type": "GET",
                    "url": url,
                    "success": function (msg) {
                        $("#content").html(msg);
                    }
                })
        },
        "callHelloWorld": function () {
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
    };

    return cp;

})(jQuery).initPage();


//$.cp = {

//    "initPage": function () {
//        $(".inforSplitter").inforSplitter();
//        $(".inforSplitBarVertical").remove();

//        $("#menu").inforTree({ "json_data": getMenuJson() })
//                      .bind("select_node.jstree", function (e, data) {
//                          var pageUrl = $.data(data.rslt.obj[0], "href");
//                          this.loadPage(pageUrl);
//                      });
//    },

//    "loadPage": function (url) {
//        $("#content").load(url);
//    },

//    "loadPageAsyn": function (url) {
//        $.ajax(
//                { "type": "GET",
//                    "url": url,
//                    "success": function (msg) {
//                        $("#content").html(msg);
//                    }
//                })
//    },
//    "callHelloWorld": function () {
//        $.ajax({
//            "type": "POST",
//            "url": "Service/Service1.asmx/HelloWorld",
//            "contentType": "application/json; charset=utf-8",
//            //"data": {},
//            "datatype": "json",
//            "success": function (msg) {
//                //alert(msg);
//                $("#content").html(msg.d);
//            }
//        });
//    }
//};