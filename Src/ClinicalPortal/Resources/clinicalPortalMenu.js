
(function ($, cp) {
    var menuCtrlId;
    var contentCtrlId;

    var buildMenu = function (menuData, menuCtrlId, contentCtrlId) {
        $("#" + menuCtrlId).inforTree({ "json_data": menuData })
                    .bind("click", function (e, data) {
                        cp.loadPageAsyn(contentCtrlId, e.target.href);
                    });
    }

    cp.menu = {
        "init": function (menuContainerId, contentContainerId) {
            menuCtrlId = menuContainerId;
            contentCtrlId = contentContainerId;

            $(".inforSplitter").inforSplitter();
            $(".inforSplitBarVertical").remove();
        },
        "load": function () {
            cp.ajaxJson("POST", "Service/Service1.asmx", "GetMenu", null, this.buildMenuTree);
        },
        "buildMenuTree": function (menuData) {
            buildMenu(menuData, menuCtrlId, contentCtrlId);
        }
    };

} (jQuery, cp));