$(function () {

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

    var userName = cp.getUser() || "Anonymous";
    $("#userName").text(userName);

    $("#signOut").bind("click", cp.logOut);

});