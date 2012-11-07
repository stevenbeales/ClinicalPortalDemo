$(function () {
    //Globalize.culture("ar-SA");

    //Setup form button styling for the sample buttons
    //detect language from the url string - works in workspace..
    var locale = infor.companyon.client.getValueQuerystring("inforCurrentLanguage");
    if (locale != undefined)
        Globalize.culture(locale);

    //get rid of banner if not in workspace or could use any parameter we want here we send to shut if off...
    var inWs = infor.companyon.client.getValueQuerystring("infor10WorkspaceShell");
    if (inWs != undefined && inWs == 1) {
        //we are in workspace
        $(".inforTopBanner").remove();
        $(".inforBottomFooter").remove();
    }

    $('#inforTabContainer').inforTabset({
        draggable: false,
        closable: false,
        editable: false,
        chevron: true,
        addButton: false,
        rename: function (obj, value, settings) {
            alert('Tab Renamed to :' + value);
        },
        add: function (obj, ui, value, settings) {
            alert('New Tab Added :' + ui);
        },
        close: function (obj, value, settings) {
            alert('Tab Closed :' + value);
        },
        sort: function (obj, value, settings) {
            alert('Tab Sorted :' + value);
        },
        hiddenTabs: {}
    });

    var userName = cp.getUser();
    $("#userName").text(userName);

    $("#signOut").bind("click", cp.logOut);

});