(function ($, cp) {

    var searchUser = function () {
        var service1Obj = cp.getService("Service/Service1.asmx");
        var userInfo = service1Obj.GetUser($("#userNameSearch").val());
        if (userInfo === "null" || userInfo === "undefined") {
            $("#userInfoSearch").text("not found!");
        }
        else {
            $("#userInfoSearch").text(userInfo);
        }
    };

    var newUser = function () {
        //{"name":"user1","password":"111"}
        var formDataJson = cp.serializeForm("newUserForm");
        var userInfo = JSON.stringify(formDataJson);
        var service1Obj = cp.getService("Service/Service1.asmx");
        var msg = service1Obj.NewUser(userInfo);
        alert(msg);
    };

    var userObj = {
        "newUser": newUser,
        "searchUser": searchUser
    };

    cp.user = userObj;

} (jQuery, cp));