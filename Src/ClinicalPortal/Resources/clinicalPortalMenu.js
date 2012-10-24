
(function ($, cp) {
    var menuCtrlId;
    var contentCtrlId;
    var menuJsonData;

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
            cp.ajaxJson("POST", "Service/Service1.asmx", "GetMenu", undefined, this.buildMenuTree);
        },
        "buildMenuTree": function (menuData) {
            menuJsonData = menuData;
            buildMenu(menuData, menuCtrlId, contentCtrlId);
        },
        "getMenuData": function () {
            return menuJsonData;
        }
    };

} (jQuery, cp));