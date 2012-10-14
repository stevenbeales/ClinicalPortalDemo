/*
* Infor Sign in Dialog.
*/
(function ($, undefined) {
    $.widget("ui.inforSignInDialog", {
        options: {
            login: null, // callback that fires when a login occurs.
            cancel: null, // callback that fires when a cancel
            success: null, // callback that fires when a login success
            title: null,
            buttons: null
        },
        elementId: null,
        _create: function () {
            var self = this;

            if (self.options.buttons == null) {
                self.options.buttons = [{
                    text: Globalize.localize("SignIn"),
                    click: function () { self.login(); },
                    isDefault: true
                }];
            }

            if (self.options.title == null)
                self.options.title = Globalize.localize("SignIn");

            //Add signIn Dialog elements to the page
            var $dialog = $('#inforSignInDialog').inforDialog({
                title: self.options.title,
                dialogType: "General",
                buttons: self.options.buttons,
                minHeight: 353,
                minWidth: 482,
                maxHeight: 353,
                maxWidth: 482,
                height: 353,
                width: 482,
                modal: true,
                draggable: false,
                resizable: false,
                position: {
                    my: 'center',
                    at: 'center',
                    collision: 'none'
                }
            });

            //remove elements from the message dialog that are not needed.
            var root = $dialog.closest(".inforDialog");

            root.hide();

            root.find(".dialogTop").remove();
            root.addClass("inforSignInDialog");
            root.removeClass("inforDialog");
            root.find(".dialogButtonBar").removeClass("dialogButtonBar").addClass("inforSignInButtonSet");

            //adjust width
            root.css({ "width": "", "height": "" });
            root.find(".inforCheckbox").inforCheckbox();
            root.find(".inforFormButton:first").addClass("default");
            root.find("table").css("height", "inherit");
            $(".inforOverlay").remove();

            this._restoreSavedInfo();

            //translate the text with built in translations
            $("[data-localizedText]").each(function () {
                var $this = $(this);
                var key = $this.attr("data-localizedText");
                $this.html(Globalize.localize(key));
            });

            var controlArea = $(".inforSignInControls");
            var maxWidth = controlArea.find(".inforLabel:first").width();

            if (maxWidth > 50 && maxWidth < 60)
                controlArea.css((Globalize.culture().isRTL ? "margin-right" : "margin-left"), (Globalize.culture().isRTL ? "21%" : "23%"));

            if (maxWidth > 60 && maxWidth < 70)
                controlArea.css((Globalize.culture().isRTL ? "margin-right" : "margin-left"), (Globalize.culture().isRTL ? "19%" : "21%"));

            root.show();
            controlArea.find(".inforLabel").autoWidth();
            //Set Focus to password field...
            setTimeout(function () {
                var userId = $.cookie("inforSignInDialog:userId");
                if (userId != undefined)
                    root.find("#password").focus().select();
                else
                    root.find("#userId").focus().select();
            }, 500);

        },
        destroy: function () {
            $('#inforSignInDialog').remove();
        },
        _restoreSavedInfo: function (userId, password) {
            //Note: There is no way to securely encrypt the data while still having 
            //access to it from your Javascript since in order to do so, the (publicly visible) Javascript would have to contain both the decoding algorithm and any secret key used to encrypt the data!
            var userId = $.cookie("inforSignInDialog:userId");
            if (userId != undefined) {
                this.element.find("#userId").val(userId);
                this.element.find("#password").focus();
                this.element.find("#rememberPassword").setValue(true);
            }
        },
        _saveInfo: function (userId, password) {
            $.cookie("inforSignInDialog:userId", userId);
        },
        _clearInfo: function (userId, password) {
            $.cookie("inforSignInDialog:userId", null);
            this.element.find("#userId").val(""); //clears the value in the browser 
        },
        login: function () {
            if (this.options.login != undefined) {
                var idField = this.element.find("#userId")
                var userId = idField.val();
                var password = this.element.find("#password").val();
                var rememberPassword = this.element.find("#rememberPassword").getValue();
                var result = this.options.login(userId, password);

                if (result) {
                    $(".inforSignInDialog").hide();
                    //Save In a Cookie.
                    if (rememberPassword) {
                        this._saveInfo(userId, password);
                    }
                    else {
                        this._clearInfo();
                    }
                    if (this.options.success != undefined) {
                        this.options.success(userId);
                    }
                } else
                    setTimeout(function () {
                        var userId = $.cookie("inforSignInDialog:userId");
                        if (userId != undefined)
                            password.focus().select();
                        else
                            idField.focus().select();
                    }, 700);
            }
        },
        cancel: function () {
            if (this.options.cancel != undefined)
                this.options.cancel();

            $(".inforSignInDialog").hide();
        },
        showError: function (errorMessage) {
            this.clearError();
            $(".inforSignInControls").append("<br><div id='signInErrorText'><span class='severityImage error'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>" + errorMessage + "</div>");
        },
        clearError: function () {
            //remove the br
            $("#signInErrorText").prev().remove();
            $("#signInErrorText").remove();
        }
    });
})(jQuery);