
(function ($, cp) {
    var menuCtrlId;
    var menuJsonData;

    var buildMenu = function (menuData) {
        $("#" + menuCtrlId).unbind("click");
        $("#" + menuCtrlId).inforTree({ "json_data": menuData })
                    .bind("click", function (e, data) {
                        cp.loadPageAsyn(e.target.href);
                    });
    }

    cp.menu = {
        "init": function (menuContainerId) {
            menuCtrlId = menuContainerId;

            $(".inforSplitter").inforSplitter();
            $(".inforSplitBarVertical").remove();
        },
        "load": function () {
            cp.ajaxJson("POST", "Service/Service1.asmx", "GetMenu", undefined, this.buildMenuTree);
        },
        "buildMenuTree": function (menuData) {
            menuJsonData = menuData;
            buildMenu(menuData);
        },
        "getMenuData": function () {
            return menuJsonData;
        }
    };

})(jQuery, cp);