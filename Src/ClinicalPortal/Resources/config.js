$(function () {

    var msgGrid;

    var handleSubMenuClick = function (e, target) {
        var grid = target.grid;
        var subMenuItem = grid.getDataItem(target.row);
        if (subMenuItem.href) {
            cp.loadPageAsyn(subMenuItem.href, "configContent");
        }
    };

    var getMenuStackData = function () {
        var data = [];
        data.push({ id: 1, title: "User", href: "User.html" });
        data.push({ id: 2, title: "Sources", href: "Sources.html" });
        data.push({ id: 3, title: "Interfaces" });
        data.push({ id: 4, title: "Codification" });
        data.push({ id: 5, title: "User Security" });
        data.push({ id: 6, title: "System" });
        return data;
    };

    //Card Stack
    var data = getMenuStackData();

    //Create Columns including a template for the header values
    var columns = [
				{ id: "sub-menu", name: "", field: "title", formatter: CellTemplateFormatter, cellTemplate: "menu_template" }
			  ];

    var options = {
        rowHeight: 40,
        dataset: data,
        idProperty: "id",
        columns: columns,
        editable: false,
        enableCellNavigation: false,
        enableColumnReorder: false,
        showFilter: false,
        showGridSettings: false,
        showDrillDown: false,
        showCheckboxes: false,
        showFooter: false,
        forceFitColumns: true,
        showStatusIndicators: false,
        pagingMode: PagingModes.PagerClientSide,
        pageSize: 10,
        savePersonalization: false,
        showHeaderContextMenu: false,
        showColumnHeaders: false
    };

    msgGrid = $("#inforCardStack").inforDataGrid(options);
    msgGrid.onClick.subscribe(handleSubMenuClick);

});