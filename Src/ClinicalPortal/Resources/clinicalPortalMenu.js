
(function ($, cp) {
    var menuCtrlId;
    var menuJsonData;

    var buildMenu = function (menuData) {
        $("#" + menuCtrlId).unbind("click");
        $("#" + menuCtrlId).inforTree({ "json_data": menuData })
                    .bind("click", function (e, data) {
                        cp.loadPageAsyn(e.target.href);
                    });
    };

    cp.menu = {
        "init": function (menuContainerId) {
            menuCtrlId = menuContainerId;

            $(".inforSplitter").inforSplitter();
            $(".inforSplitBarVertical").remove();
        },
        "load": function () {
            var service1Obj = cp.getService("Service/Service1.asmx");
            var menuData = service1Obj.GetMenu();
            this.buildMenuTree(cp.parseJSON(menuData));
        },
        "buildMenuTree": function (menuData) {
            menuJsonData = menuData;
            buildMenu(menuJsonData);
        },
        "getMenuData": function () {
            return menuJsonData;
        }
    };

})(jQuery, cp);