/*!
 * Infor Html Controls v1.3.1326
 * Date: 6/28/2012 12:53:45 PM
 * Rev: 1948
 */
/*
* Infor Validation Plugin.
* A smaller and more focused to infor standards version of jquery.validation.
* For an explanation of the starts of this code see: http://bit.ly/d1YLBM
*/
(function($) {
    /* Validation Singleton 
		TODO: Add some of the rules from: http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.js
	*/
    var Validation = function() {
        var rules = {
            email : {
               check: function(value) {
                   if(value)
                       return testPattern(value,"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])");
                   return true;
				   },
               msg : "Enter a valid e-mail address."
            },
            url : {
               check : function(value) {
                   if(value)
                       return testPattern(value,"^https?://(.+\.)+.{2,4}(/.*)?$");
                   return true;
               },
               msg : "Enter a valid URL."
            },
            required : {
              check: function(value) {
                   if(value)
                       return true;
					else
					return false;
               },
               msg : "This field is required."	//TODO: Localize these...
            }
        }
        var testPattern = function(value, pattern) {
            var regExp = new RegExp(pattern,"");
            return regExp.test(value);
        }
        return {
            addRule : function(name, rule, async) {
                rules[name] = rule;

				if (async) {
					rules[name].async = true;
				}

			},
            getRule : function(name) {
                return rules[name];
            },
			removeMessage : function(selector) {
				selector.each(function(){ 
					var $field = $(this);
					$field.removeClass("error");
					$("#inforToolTip").hide();
					
					if ($field.hasClass("inforDualListExchange")) {
						var $selected = $field.find("#selected");
						$selected.css("border","1px solid #999999");
						$selected.closest("tr").find(".inforErrorIcon").parent().remove();
					}
					
					if ($field.hasClass("inforCheckbox")) {
						var $checkbox = $field.closest("div.inforCheckbox");
						$checkbox.removeClass("error").next(".inforErrorIcon").remove();
						$checkbox.prev(".inforErrorIcon").remove();
					} 
					
					if ($field.hasClass("inforListBox")) {
						$field.next("a.inforListBox").removeClass("error").next(".inforErrorIcon").remove();
					}
					
					if ($field.hasClass("inforFieldSet")) {
						$field.find(".inforErrorIcon").remove();
					}
					
					if ($field.hasClass("inforDropDownList")) {
						var $next = $field.siblings(".inforTriggerField");
						$next.find('.inforTriggerButton').removeClass("error").next(".inforErrorIcon").remove();
						$field = $next.find('input');
						$field.removeClass("error");
					}
					
					if ($field.hasClasses(['inforLookupField', 'inforDateField', 'inforUrlField', 'inforSpinner', 'inforSearchField', 'inforEmailField', 'inforCalculatorField'])){
						$field.closest("tr").find('.inforTriggerButton').removeClass("error").next(".inforErrorIcon").remove();
						
						if ($field.hasClass("inforFileField"))
							$field.next().removeClass("error");	
							
					}
					
					//textbox and textarea fall through
					if (Globalize.culture().isRTL && $field.next().hasClass("inforDirtyIndicator"))
						$field.next().next(".inforErrorIcon").remove();
					else
						$field.next(".inforErrorIcon").remove();
						
					
					//if we are on a tab remove it as long as there are no more errors.
					var tabPanel = $field.closest(".ui-tabs-panel");
					if (tabPanel.length>0) {
						var tabid = tabPanel.attr("id");
						var anchor = $('a[href="#'+tabid+'"]');
						if (anchor.next().hasClass("inforErrorIcon") && tabPanel.find(".inforErrorIcon").length==0)
							anchor.next().remove();
					}
					
				});
			},
			showMessage : function(selector, messages, showTooltip) {
				selector.each(function(){ 
					var $field = $(this);
					//add the div to the page.
					var icon = $("<div class='inforErrorIcon'></div>");
					icon.attr("title", messages).css("display","inline-block");
					
					//attach the tooltip and positioning - make sure the width is not too much bigger than the field. It will wrap.
					var maxW = $field.width()+20
					if ($field.hasClass("inforCheckbox")) {
						maxW = $field.closest("div").next().width()+20;	//use the label width as the control width
						if (maxW<200)
							maxW= 200;
					}
					
					var maxAttr = $field.attr("data-tooltip-maxwidth")
					if (maxAttr)
						maxW = maxAttr;
						
					icon.inforToolTip({maxWidth: maxW});
					
					//remove the previous error if any...
					$field.validationMessage('remove');
					
					if ($field.hasClass("inforDualListExchange")) {
					    var $selected = $field.find("#selected");
							
						$selected.css("border","1px solid red");
						$selected.closest("tr").append($("<td></td>").append(icon));
						icon.css({ "position": "relative", "top": -($selected.height()/2)-8, "left": "-37px" });
					} else if ($field.hasClass("inforCheckbox")) {
						var $checkbox = $field.closest("div.inforCheckbox");
						if ($checkbox.next().is(".inforCheckboxLabel"))
							$checkbox.addClass("error").before(icon.css({"margin-left":"-12px","margin-top":"-2px"}));	//label is on the left
						else
							$checkbox.addClass("error").after(icon.css("margin-top","-2px"));
							
					} else if ($field.hasClass("inforListBox")) {
						$field.next("a.inforListBox").addClass("error").after(icon);
						icon.css({"position":"relative","top":"-"+($field.height()-8)+"px"});
					} else if ($field.hasClass("inforFieldSet")) {
					    var fs = $field.find(".inforFieldSetLabel");
						fs.prepend(icon);
						icon.css({"position":"relative","left":"-2px", "top":"-1px"});
					} else if ($field.hasClass("inforDropDownList")) {
						$field.next().find("input").addClass("error");
						$field.next().find('.inforTriggerButton').addClass("error").after(icon);
					} else if ($field.hasClass("inforFileField")) {
						$field.addClass("error");
						$field.closest("tr").find('.inforTriggerButton').addClass("error").after(icon);
						$field.next().addClass("error");
					}else if ($field.hasClass("inforSpinner")) {
						$field.addClass("error");
						$field.closest("tr").find('.inforTriggerButton').addClass("error");
						$field.closest("tr").find('.inforTriggerButton:last').after(icon);
						icon.css("margin-left","-10px");
					} else if ($field.hasClasses(['inforLookupField', 'inforDateField', 'inforUrlField', 'inforSearchField', 'inforEmailField', 'inforFileField', 'inforCalculatorField'])) {
						$field.addClass("error");
						$field.closest("tr").find('.inforTriggerButton').addClass("error").after(icon);
					}
					else {
						$field.after(icon);
						$field.addClass("error");
					}
					
					//make sure the width is no bigger than the field.
					if ($field.hasClass("inforTextArea"))
						icon.css({"position":"relative","top":"-"+($field.height()-8)+"px"});
					
					//if we are on a tab add it
					var tabPanel =$field.closest(".ui-tabs-panel")
					if (tabPanel.length>0) {
						var tabid = tabPanel.attr("id");
						var anchor = $('a[href="#'+tabid+'"]');
						if (!anchor.next().hasClass("inforErrorIcon"))
							anchor.after('<div class="inforErrorIcon" style="display: inline-block; float: '+(Globalize.culture().isRTL ? 'right': 'left')+'; margin: '+(Globalize.culture().isRTL ? '2px 2px 0px -5px': '3px 4px 0 -2px')+';"></div>');
					}
					
					//Immediately show the tooltip.
					if (showTooltip) {
						//do this on a timeout so the last click doesnt catch and close it immediately.
						function bindClick () {
							$(document).unbind("click.tooltip");
							$(document).bind("click.tooltip",function(event) {
								icon.inforToolTip("close");
								$("#inforTooltip").hide();
								$(document).unbind("click.tooltip");
							});
						}
						setTimeout(bindClick,200);
						if (icon.is(":visible"))
							icon.inforToolTip("open");
					}
				});
			}
        }
    }
    
    /* Form factory  */
    var Form = function(form) {
        var fields = [];
      form.find("[data-validation]").each(function() {
            var field = $(this);
            if(field.attr('data-validation') !== undefined) {
                fields.push(new Field(field));
            }
        });
        this.fields = fields;
    }
    Form.prototype = {
        validate : function() {
			for (var field = 0; field < this.fields.length; field = field+1) {
                this.fields[field].validate();
            }
        },
		/* 
			Every method we call and are pushing on to deferreds returns in either synchronous
			or async fashion.  If it's synchronous, it acts like a normal sync call would, resolving or rejecting
			the jQuery deferred object before its promise is even returned.  If it's async, the method
			exits and leaves us with a promise, jQuery waits until it is resolved or
			rejected, which we handle based on the state of the validation. 
        */
        validateAsync: function (callback) {
            var deferreds = [];
			for (var field = 0; field < this.fields.length; field++) {
            	var dfds = this.fields[field].validate();
				for (var i = 0; i < dfds.length; i++) {
					deferreds.push(dfds[i]);
				}
            }

            $.when.apply($, deferreds).then(function () {
                callback(true);
            }, function () {
                callback(false);
            });
        },
        isValid : function() {
			for (var field = 0; field < this.fields.length; field++) {
                if(!this.fields[field].valid) {
                    this.fields[field].field.focus();
                    return false;
                }
            }
            return true;
        }
    }
    /* Field factory */
    var Field = function(field) {
        this.field = field;
        this.valid = false;
		
		var validationEvents = this.field.attr("data-validation-events");
		if (validationEvents==undefined)
			validationEvents = "change blur";	//could do keyup
		
		if (validationEvents=="none")
			return;
			
		var events = validationEvents.split(" ");
		
		for (var i = 0; i < events.length; i++) { 
			this.attach(events[i]);
		}
    }
    Field.prototype = {
        attach : function(event) {
			var obj = this;
			
            if(event == "change") {
                obj.field.unbind("change.validation");
				obj.field.bind("change.validation",function(event) {
                    return obj.validate(event);
                });
            }
            if(event == "keyup") {
                obj.field.unbind("keyup.validation");
				obj.field.bind("keyup.validation",function(e) {
                    return obj.validate(event);
                });
            }
			if(event == "blur") {
                obj.field.unbind("blur.validation");
				obj.field.bind("blur.validation",function(e) {
                    return obj.validate(event);
                });
            }
        },
		/* Test the Field and Add the validation Messages */
       addError : function (obj, errors, errorlist, event) {
			if(errors.length) {
				//Add the error message
				 for (var error = 0; error < errors.length; error++) {
            		errorlist = errorlist + "<li>"+ errors[error] +"</li>";        
				 }
				
				 var hasErrorBeenShown = obj.field.data("hasErrorBeenShown");
				 var showTip = false;
				 if (hasErrorBeenShown==undefined && event=="blur")
					   showTip=true;
				
				 obj.field.validationMessage("show",errorlist,showTip);
				 obj.field.data("errorlist",errorlist);
				 obj.field.data("hasErrorBeenShown",true);
				 obj.valid = false;
			} else {
				obj.field.validationMessage("remove");
				obj.valid = true;
			}
	   },
	   validate : function(event) {
            var obj = this,
                field = obj.field,
                errorlist = "",
                types = field.attr("data-validation").split(" "),
                container = field.parent(),
                errors = [],
				dfds = [],
				manageResult = function (result) {
					if (!result) {
						container.addClass("error");
						errors.push(rule.msg);
						obj.addError(obj, errors, errorlist);
						dfd.reject();
					} else {
						obj.addError(obj, errors, errorlist);
						dfd.resolve();
					}
				};

            field.next(".errorlist").remove();
			
            for (var i = 0; i < types.length; i = i+1) {
                var rule = $.Validation.getRule(types[i]),
					value = field.val(),
					dfd = $.Deferred();
				
				if (field.hasClass("inforDropDownList"))
					value = field.next().find("input").val();
				
				if (rule==undefined)
					continue;
					
                if (rule.async) {
					rule.check(value, manageResult);
                } else {
                    manageResult(rule.check(value, field));
                }     
				dfds.push(dfd);
            }
			
			obj.addError(obj, errors, errorlist);
			return dfds;
	   }
    }
    /* Validation extends jQuery prototype */
    $.extend($.fn, {
		/*set up async type validation using deferred.*/  
		setupValidation: function (callback) {
			var validator = new Form($(this));
			$.data($(this)[0], 'validator', validator);

			$(this).unbind("submit.validation");
			$(this).bind("submit.validation", function (e) {
				e.preventDefault();
				validator.validateAsync(function (valid) {
					if (!valid) {
					
						/*TODO: Could show a page level message or add Slide in Panel Here
						$('body').inforPageLevelMessage({
							messageType: 'Alert',
							messageTitle: 'Save failed',
							errorMessage: 'Fix the errors in this page and try again.',
							showClose: true,
							autoDismiss: true
						});*/
					
						//show the first invalid tooltip
						var firstField = null;
						for (var i = 0; i < validator.fields.length; i++) {
							var fObj = validator.fields[i];
							if (!fObj.valid) {
								firstField = fObj.field;
								break;
							}
						}
						if (firstField != null) {
							firstField.validationMessage("show", firstField.data("errorlist"), true);
						}
					}

					callback(valid);
				});
			});

			return validator;
		},
		isValid: function() {
			if ($(this).is("form")) {
				var validator = $.data($(this)[0], 'validator')
				return validator.isValid();
			} else {
				//allow this on fields?
				return false;
			}
		},
		validate : function() {
            var validator = $.data($(this)[0], 'validator');
            validator.validate();
            return validator.isValid();
        },
		resetForm : function() {
			var formFields = $(this).find('input, select, textarea');
			//clear errors.
			formFields.validationMessage("remove");
			
			//clear dirty flag.
			$(this).find(".inforDirtyIndicator").remove();
			formFields.data("isDirty",false);
			
			//clear valid flags
			var validator = $.data($(this)[0], 'validator');
			if (validator) {
				for (var field = 0; field < validator.fields; field++) {
            		validator.fields[field].valid = true;
				}
			}
			//reset form data
			if ($(this).is("form"))
				$(this)[0].reset();
		},
		validationMessage :function (hideOrShow, messages, showTooltip) {
			if (hideOrShow=="show") {
				$.Validation.showMessage(this, messages, showTooltip);
			}
			if (hideOrShow=="remove") {
				$.Validation.removeMessage(this, messages, showTooltip);
			}
		}
    });
    $.Validation = new Validation();
})(jQuery);
/*
 * Infor Trigger Field - Handles the base functionality of DropDown/DatePicker and Other Trigger Fields.
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $(document).ready(function() {
 * 			$(".inforTriggerField").inforTriggerField();
 * 		});
 * Deps: TextBox css.
 * Date: 17/11/2011
 */
(function ($) {
    $.fn.inforTriggerField = function (options) {
        var settings = {
            click: null
        };
        settings = $.extend(settings, options || {});

        return this.each(function () {
            $input = $(this);
            //var isIE8 = ($.browser.msie && $.browser.version == 8);
            //TODO: Removed this temporarily - will circle back later - error styling is messed up
            var isIE8 = false;
			
            if ($input.data("initialized") != undefined)	//is wrapped
                return;

            $input.data("initialized", true);

            //Add the correct classes for this type of button.			
            var lookupClass = "";
            if ($input.hasClass("inforLookupField"))
			lookupClass = "inforLookupButton";
            if ($input.hasClass("inforDropDownList"))
                lookupClass = "inforDropDownListButton";
            if ($input.hasClass("inforDateField"))
                lookupClass = "inforDatePickerButton";
            if ($input.hasClass("inforUrlField"))
                lookupClass = "inforUrlButton";
            if ($input.hasClass("inforEmailField"))
                lookupClass = "inforEmailButton";
            if ($input.hasClass("inforSearchField"))
                lookupClass = "inforSearchButton";
            if ($input.hasClass("inforFileField"))
                lookupClass = "inforFileButton";
			if ($input.hasClass("inforCalculatorField"))
                lookupClass = "inforCalculatorButton";
			if ($input.hasClass("inforSpinner"))
                lookupClass = "inforSpinnerButtonUp";
				
            //wrap it in the correct html using a div and a table.
            $input.wrap('<div class="inforTriggerField"><table class="inforTriggerFieldTable"><tbody><tr><td></td></tr></tbody></table></div>');
            var $triggerButton = $('<button class="inforTriggerButton ' + lookupClass + '" type="button"></button>').attr("tabIndex","-1");
			var $tr = $input.closest("tr")
            $tr.append($('<td></td>'));
            $tr.find('td').eq(1).append($triggerButton);

            //attach click event
            if (settings.click != undefined) {
				if (!$input.hasClass("fileInputField")) {	//bound inside the file field control.
					$input.bind("keydown",function(event) {
						if (event.keyCode==13) {
							$triggerButton.trigger("click");
							event.stopPropagation();
							event.preventDefault();
							return false;
						}
					});
				}
                $triggerButton.click(function (e) {
                    settings.click(e);
                });
            }

            //setup focus functionality...Need to also change state of the button.
            $input
				.addClass("inforTextbox")
				.focusin(function (e) {
				    var $this = $(this);
				    $this.closest("tbody").find(".inforTriggerButton").addClass("focus");

				    if (isIE8) {
				        $this.closest("tbody").find(".inforTextBoxLeftSlice").addClass("focus");
				        $this.addClass("IE8Focus");
				    }
				}).focusout(function (e) {
				    var $this = $(this);
				    $this.closest("tbody").find(".inforTriggerButton").removeClass("focus");

				    if (isIE8) {
				        $this.closest("tbody").find(".inforTextBoxLeftSlice").removeClass("focus");
				        $this.removeClass("IE8Focus");
				    }
				});
			
            var root = $input.closest(".inforTriggerField");

            //setup disabled and readonly functionality
            var isEnabled = true;

            if ($input.attr("readonly") == "readonly") {
                root.addClass("readonly");
                isEnabled = false;
            }

            if ($input.is(":disabled")) {
                root.addClass("disabled");
				isEnabled = false;
            }
			
			//add tooltip
			var tooltip=$input.attr("title");
			if (tooltip!=undefined) {
				$triggerButton.attr("title",tooltip);
			}
            //add rounded styling for ie8
            if (isIE8 && isEnabled) {
                //add rounded left slice.
                var $leftSlice = $('<td><div class="inforTextBoxLeftSlice"/></td>');
                $leftSlice.prependTo($input.closest("tr"));
                $input.css("border-left", "none");
                //TODO: add alternate disabled styling to get rid of embossed look.
            }

            //handle absolute positioning.
            if ($input.css("position") == "absolute" && !Globalize.culture().isRTL) {
                root.css({ position: "absolute", left: $input.css("left"), top: $input.css("top") });
                $input.css({ position: "", left: "", top: "" });
            }
            else if ($input.css("position") == "absolute") {
                root.css({ position: "absolute", right: $input.css("right"), top: $input.css("top") });
                $input.css({ position: "", left: "", top: "" });
            }


            //another ie hack
            if ($.browser.msie) {
                $input.closest('.inforTriggerFieldTable').css("display", "block");
                $input.closest('.inforTriggerField').css("margin-bottom", "2px");
            }
			
			//we are in a 3 column layout use percentages...Messy but works..
			if ($input.closest(".infor3ColumnLayout").length>0)	{
				$input.closest(".inforTriggerField").css("width","60%");
				$input.closest("tbody").css("width","100%");
				$input.closest(".inforTriggerFieldTable").css("width","100%");
				$input.closest("tr").css("width","100%");
				$input.closest("tr").find("td").eq(0).css("width","92%");
				$input.closest("tr").find("td").eq(1).css("width","8%");
				$input.closest("tr").find(".inforTriggerButton").css("margin-left",($.browser.msie ? "4px" : "1px"));
				
				$input.css("width","100%");
			}
        });
    }
	
	$.fn.inforSearchField = function (options) {
        var settings = {
			 click: null,
			 cancel: null	//fires when cancel is clicked.
        };
		settings = $.extend(settings, options || {});

		return this.each(function () {
			var $input = $(this);
			
			//make sure its not initialized twice.
            if ($input.data("isInitialized"))
				return;
				
            //add trigger button styling
			$input.data("isInitialized",true)
					.addClass("noTrackDirty")
					.inforTriggerField({click: settings.click})
					.keyup(function(event){
						var term = $(this).val();
						_displayCancelButton($(this),"Cancel");
						
						if (term=="")
							_displayCancelButton($(this),"Search");
					})
					.blur(function(event){
						if ($(this).val()=="") 
							_displayCancelButton($(this),"Search");
					});
		});
		
		function _displayCancelButton(field, icon){
			var triggerButton = field.closest(".inforTriggerField").find(".inforTriggerButton"),
				cancelButton = triggerButton.prev();
					
			if (!cancelButton.hasClass("inforCloseButtonDark")) {
				cancelButton = $("<div class='inforCloseButtonDark inforTreeSearchCancel'></div>");
				triggerButton.before(cancelButton);
				
				cancelButton.attr("title",Globalize.localize("Cancel"));
				cancelButton.click(function(event) {
					$(this).hide().closest(".inforTriggerField").find("input").val("");
					$("#inforTooltip").hide();
					if (settings.cancel)
						settings.cancel(event);
				});
			}
			
			if (icon=="Search")
				cancelButton.hide();
			else 
				cancelButton.show();
		}
	}
	
	$.fn.inforFileField = function (options) {
        //no options yet...
        return this.each(function () {
            var $input = $(this);
			
			//make sure its not initialized twice.
            if ($input.data("isInitialized"))
				return;
				
            //add trigger button styling
			$input.data("isInitialized",true).inforTriggerField();
			
			//add another visable and styled textbox
			var $fileInput = $("<input type='text' class='inforTextbox fileInputField'/></input>");
			$input.after($fileInput);
		    
			//position the file input underneath the button and opace.
			$input.attr("tabindex","-1").css({"position":"absolute" ,"opacity": "0", "z-index":"9999"})
			
			var $button = $input.closest("tr").find(".inforTriggerButton");
			
			//ensure it is correctly positioned. it may have been invisible originally.
			$button.mouseenter(function () {
				buttonPosition = $fileInput.position().left;
				$input.css("left", buttonPosition + 50 + "px");
				$button.addClass("hover");
			});
			
			//need to do this after absolute is set as this effects the position
			var buttonPosition = $fileInput.position().left;
			$input.css("left",  buttonPosition + 50 + "px");
		
			//attach visual events.
			$input.mousedown(function() {
					$button.addClass("active");
				}).mouseup(function() {
					$button.removeClass("active");
				})
				.mouseenter(function () {
					$button.addClass("hover");
				})
				.mouseleave(function () {
					$button.removeClass("hover");
				})
				.change(function (event) {
					$fileInput.val($(this).val());
				});
				
			
			//handle readonly and disabled styling.
			if ($input.is(":disabled")) {
                $fileInput.addClass("disabled");
				$fileInput.attr("disabled","");
			}
			
			if (!$input.isReadOnly()) {
                $fileInput.attr("readonly","").addClass("selectOnly");
			}
          
        });
    }
} (jQuery));

/*
 * Infor Tree Control.
 * 
 * Modified and Trimmed version of jsTree 1.0-rc3
 * http://jstree.com/
 *
 * Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 */

 /* 
 * jsTree core
 */
(function ($) {
	// Common functions not related to jsTree 
	// decided to move them to a `vakata` "namespace"
	$.vakata = {};
	// CSS related functions
	$.vakata.css = {
		get_css : function(rule_name, delete_flag, sheet) {
			rule_name = rule_name.toLowerCase();
			var css_rules = sheet.cssRules || sheet.rules,
				j = 0;
			do {
				if(css_rules.length && j > css_rules.length + 5) { return false; }
				if(css_rules[j].selectorText && css_rules[j].selectorText.toLowerCase() == rule_name) {
					if(delete_flag === true) {
						if(sheet.removeRule) { sheet.removeRule(j); }
						if(sheet.deleteRule) { sheet.deleteRule(j); }
						return true;
					}
					else { return css_rules[j]; }
				}
				}
			while (css_rules[++j]);
			return false;
		},
		add_css : function(rule_name, sheet) {
			if($.jstree.css.get_css(rule_name, false, sheet)) { return false; }
			if(sheet.insertRule) { sheet.insertRule(rule_name + ' { }', 0); } else { sheet.addRule(rule_name, null, 0); }
			return $.vakata.css.get_css(rule_name);
		},
		remove_css : function(rule_name, sheet) { 
			return $.vakata.css.get_css(rule_name, true, sheet); 
		}
		/*,
		add_sheet : function(opts) {
			return;
		}*/
	};

	// private variables 
	var instances = [],			// instance array (used by $.jstree.reference/create/focused)
		focused_instance = -1,	// the index in the instance array of the currently focused instance
		plugins = {},			// list of included plugins
		prepared_move = {};		// for the move_node function

	// jQuery plugin wrapper (thanks to jquery UI widget function)
	$.fn.inforTree = function (settings) {
		var isMethodCall = (typeof settings == 'string'), // is this a method call like $().jstree("open_node")
		args = Array.prototype.slice.call(arguments, 1), 
			returnValue = this;
		
		// if a method call execute the method on all selected instances
		if(isMethodCall) {
			if(settings.substring(0, 1) == '_') { return returnValue; }
			this.each(function() {
				var instance = instances[$.data(this, "jstree_instance_id")],
					methodValue = (instance && $.isFunction(instance[settings])) ? instance[settings].apply(instance, args) : instance;
					if(typeof methodValue !== "undefined" && (settings.indexOf("is_") === 0 || (methodValue !== true && methodValue !== false))) { returnValue = methodValue; return false; }
			});
		}
		else {
			this.each(function() {
				// extend settings and allow for multiple hashes and $.data
				var instance_id = $.data(this, "jstree_instance_id"),
					a = [],
					b = settings ? $.extend({}, true, settings) : {},
					c = $(this), 
					s = false, 
					t = [];
				a = a.concat(args);
				if(c.data("jstree")) { a.push(c.data("jstree")); }
				b = a.length ? $.extend.apply(null, [true, b].concat(a)) : b;

				// if an instance already exists, destroy it first
				if(typeof instance_id !== "undefined" && instances[instance_id]) { instances[instance_id].destroy(); }
				// push a new empty object to the instances array
				instance_id = parseInt(instances.push({}),10) - 1;
				// store the jstree instance id to the container element
				$.data(this, "jstree_instance_id", instance_id);
				// clean up all plugins
				b.plugins = $.isArray(b.plugins) ? b.plugins : $.jstree.defaults.plugins.slice();
				b.plugins.unshift("core");
				// only unique plugins
				b.plugins = b.plugins.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");

				// extend defaults with passed data
				s = $.extend(true, {}, $.jstree.defaults, b);
				s.plugins = b.plugins;
				$.each(plugins, function (i, val) { 
					if($.inArray(i, s.plugins) === -1) { s[i] = null; delete s[i]; } 
					else { t.push(i); }
				});
				s.plugins = t;

				// push the new object to the instances array (at the same time set the default classes to the container) and init
				instances[instance_id] = new $.jstree._instance(instance_id, $(this).addClass("jstree jstree-" + instance_id), s); 
				// init all activated plugins for this instance
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { instances[instance_id].data[val] = {}; });
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { if(plugins[val]) { plugins[val].__init.apply(instances[instance_id]); } });
				// initialize the instance
				setTimeout(function() { if(instances[instance_id]) { instances[instance_id].init(); } }, 0);
			});
		}
		
		//Add Infor Search functionality
		
		// return the jquery selection (or if it was a method call that returned a value - the returned value)
		return returnValue;
	};
	// object to store exposed functions and objects
	$.jstree = {
		defaults : {
			plugins : []
		},
		_focused : function () { return instances[focused_instance] || null; },
		_reference : function (needle) { 
			// get by instance id
			if(instances[needle]) { return instances[needle]; }
			// get by DOM (if still no luck - return null
			var o = $(needle); 
			if(!o.length && typeof needle === "string") { o = $("#" + needle); }
			if(!o.length) { return null; }
			return instances[o.closest(".jstree").data("jstree_instance_id")] || null; 
		},
		_instance : function (index, container, settings) { 
			// for plugins to store data in
			this.data = { core : {} };
			this.get_settings	= function () { return $.extend(true, {}, settings); };
			this._get_settings	= function () { return settings; };
			this.get_index		= function () { return index; };
			this.get_container	= function () { return container; };
			this.get_container_ul = function () { return container.children("ul:eq(0)"); };
			this._set_settings	= function (s) { 
				settings = $.extend(true, {}, settings, s);
			};
		},
		_fn : { },
		plugin : function (pname, pdata) {
			pdata = $.extend({}, {
				__init		: $.noop, 
				__destroy	: $.noop,
				_fn			: {},
				defaults	: false
			}, pdata);
			plugins[pname] = pdata;

			$.jstree.defaults[pname] = pdata.defaults;
			$.each(pdata._fn, function (i, val) {
				val.plugin		= pname;
				val.old			= $.jstree._fn[i];
				$.jstree._fn[i] = function () {
					var rslt,
						func = val,
						args = Array.prototype.slice.call(arguments),
						evnt = new $.Event("before.jstree"),
						rlbk = false;

					if(this.data.core.locked === true && i !== "unlock" && i !== "is_locked") { return; }

					// Check if function belongs to the included plugins of this instance
					do {
						if(func && func.plugin && $.inArray(func.plugin, this._get_settings().plugins) !== -1) { break; }
						func = func.old;
					} while(func);
					if(!func) { return; }

					// context and function to trigger events, then finally call the function
					if(i.indexOf("_") === 0) {
						rslt = func.apply(this, args);
					}
					else {
						rslt = this.get_container().triggerHandler(evnt, { "func" : i, "inst" : this, "args" : args, "plugin" : func.plugin });
						if(rslt === false) { return; }
						if(typeof rslt !== "undefined") { args = rslt; }

						rslt = func.apply(
							$.extend({}, this, { 
								__callback : function (data) { 
									this.get_container().triggerHandler( i + '.jstree', { "inst" : this, "args" : args, "rslt" : data, "rlbk" : rlbk });
								},
								__rollback : function () { 
									rlbk = this.get_rollback();
									return rlbk;
								},
								__call_old : function (replace_arguments) {
									return func.old.apply(this, (replace_arguments ? Array.prototype.slice.call(arguments, 1) : args ) );
								}
							}), args);
					}

					// return the result
					return rslt;
				};
				$.jstree._fn[i].old = val.old;
				$.jstree._fn[i].plugin = pname;
			});
		},
		rollback : function (rb) {
			if(rb) {
				if(!$.isArray(rb)) { rb = [ rb ]; }
				$.each(rb, function (i, val) {
					instances[val.i].set_rollback(val.h, val.d);
				});
			}
		}
	};
	// set the prototype for all instances
	$.jstree._fn = $.jstree._instance.prototype = {};

	// core functions (open, close, create, update, delete)
	$.jstree.plugin("core", {
		__init : function () {
			this.data.core.locked = false;
			this.data.core.to_open = this.get_settings().core.initially_open;
			this.data.core.to_load = this.get_settings().core.initially_load;
		},
		defaults : { 
			html_titles	: false,
			animation	: 500,
			initially_open : [],
			initially_load : [],
			open_parents : true,
			notify_plugins : true,
			rtl			: false,
			load_open	: false,
			strings		: {
				loading		: "Loading ...",
				new_node	: "New node",
				multiple_selection : "Multiple selection"
			}
		},
		_fn : { 
			init	: function () { 
				this.set_focus(); 
				if(this._get_settings().core.rtl) {
					this.get_container().addClass("jstree-rtl").css("direction", "rtl");
				}
				this.get_container().html("<ul><li class='jstree-last jstree-leaf'><ins>&#160;</ins><a class='jstree-loading' href='#'><ins class='jstree-icon'>&#160;</ins>" + this._get_string("loading") + "</a></li></ul>");
				this.data.core.li_height = this.get_container_ul().find("li.jstree-closed, li.jstree-leaf").eq(0).height() || 18;

				this.get_container()
					.delegate("li > ins", "click.jstree", $.proxy(function (event) {
							var trgt = $(event.target);
							// if(trgt.is("ins") && event.pageY - trgt.offset().top < this.data.core.li_height) { this.toggle_node(trgt); }
							this.toggle_node(trgt);
						}, this))
					.bind("mousedown.jstree", $.proxy(function () { 
							this.set_focus(); // This used to be setTimeout(set_focus,0) - why?
						}, this))
					.bind("dblclick.jstree", function (event) { 
						var sel;
						if(document.selection && document.selection.empty) { document.selection.empty(); }
						else {
							if(window.getSelection) {
								sel = window.getSelection();
								try { 
									sel.removeAllRanges();
									sel.collapse();
								} catch (err) { }
							}
						}
					});
				if(this._get_settings().core.notify_plugins) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li").each(function () {
									var th = $(this);
									if(th.data("jstree")) {
										$.each(th.data("jstree"), function (plugin, values) {
											if(t.data[plugin] && $.isFunction(t["_" + plugin + "_notify"])) {
												t["_" + plugin + "_notify"].call(t, th, values);
											}
										});
									}
								});
							}, this));
				}
				if(this._get_settings().core.load_open) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li.jstree-open:not(:has(ul))").each(function () {
									t.load_node(this, $.noop, $.noop);
								});
							}, this));
				}
				this.__callback();
				this.load_node(-1, function () { this.loaded(); this.reload_nodes(); });
			},
			destroy	: function () { 
				var i,
					n = this.get_index(),
					s = this._get_settings(),
					_this = this;

				$.each(s.plugins, function (i, val) {
					try { plugins[val].__destroy.apply(_this); } catch(err) { }
				});
				this.__callback();
				// set focus to another instance if this one is focused
				if(this.is_focused()) { 
					for(i in instances) { 
						if(instances.hasOwnProperty(i) && i != n) { 
							instances[i].set_focus(); 
							break; 
						} 
					}
				}
				// if no other instance found
				if(n === focused_instance) { focused_instance = -1; }
				// remove all traces of jstree in the DOM (only the ones set using jstree*) and cleans all events
				this.get_container()
					.unbind(".jstree")
					.undelegate(".jstree")
					.removeData("jstree_instance_id")
					.find("[class^='jstree']")
						.andSelf()
						.attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
				$(document)
					.unbind(".jstree-" + n)
					.undelegate(".jstree-" + n);
				// remove the actual data
				instances[n] = null;
				delete instances[n];
			},

			_core_notify : function (n, data) {
				if(data.opened) {
					this.open_node(n, false, true);
				}
			},

			lock : function () {
				this.data.core.locked = true;
				this.get_container().children("ul").addClass("jstree-locked").css("opacity","0.7");
				this.__callback({});
			},
			unlock : function () {
				this.data.core.locked = false;
				this.get_container().children("ul").removeClass("jstree-locked").css("opacity","1");
				this.__callback({});
			},
			is_locked : function () { return this.data.core.locked; },
			save_opened : function () {
				var _this = this;
				this.data.core.to_open = [];
				this.get_container_ul().find("li.jstree-open").each(function () { 
					if(this.id) { _this.data.core.to_open.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); }
				});
				this.__callback(_this.data.core.to_open);
			},
			save_loaded : function () { },
			reload_nodes : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(!is_callback) { 
					this.data.core.reopen = false; 
					this.data.core.refreshing = true; 
					this.data.core.to_open = $.map($.makeArray(this.data.core.to_open), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.data.core.to_load = $.map($.makeArray(this.data.core.to_load), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					if(this.data.core.to_open.length) {
						this.data.core.to_load = this.data.core.to_load.concat(this.data.core.to_open);
					}
				}
				if(this.data.core.to_load.length) {
					$.each(this.data.core.to_load, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.core.to_load = remaining;
						$.each(current, function (i, val) { 
							if(!_this._is_loaded(val)) {
								_this.load_node(val, function () { _this.reload_nodes(true); }, function () { _this.reload_nodes(true); });
								done = false;
							}
						});
					}
				}
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				if(done) { 
					// TODO: find a more elegant approach to syncronizing returning requests
					if(this.data.core.reopen) { clearTimeout(this.data.core.reopen); }
					this.data.core.reopen = setTimeout(function () { _this.__callback({}, _this); }, 50);
					this.data.core.refreshing = false;
					this.reopen();
				}
			},
			reopen : function () {
				var _this = this;
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				this.__callback({});
			},
			refresh : function (obj) {
				var _this = this;
				this.save_opened();
				if(!obj) { obj = -1; }
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				if(obj !== -1) { obj.children("UL").remove(); }
				else { this.get_container_ul().empty(); }
				this.load_node(obj, function () { _this.__callback({ "obj" : obj}); _this.reload_nodes(); });
			},
			// Dummy function to fire after the first load (so that there is a jstree.loaded event)
			loaded	: function () { 
				this.__callback(); 
			},
			// deal with focus
			set_focus	: function () { 
				if(this.is_focused()) { return; }
				var f = $.jstree._focused();
				if(f) { f.unset_focus(); }

				this.get_container().addClass("jstree-focused"); 
				focused_instance = this.get_index(); 
				this.__callback();
			},
			is_focused	: function () { 
				return focused_instance == this.get_index(); 
			},
			unset_focus	: function () {
				if(this.is_focused()) {
					this.get_container().removeClass("jstree-focused"); 
					focused_instance = -1; 
				}
				this.__callback();
			},

			// traverse
			_get_node		: function (obj) { 
				var $obj = $(obj, this.get_container()); 
				if($obj.is(".jstree") || obj == -1) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_get_next		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:first-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.nextAll("li").size() > 0) ? obj.nextAll("li:eq(0)") : false; }

				if(obj.hasClass("jstree-open")) { return obj.find("li:eq(0)"); }
				else if(obj.nextAll("li").size() > 0) { return obj.nextAll("li:eq(0)"); }
				else { return obj.parentsUntil(".jstree","li").next("li").eq(0); }
			},
			_get_prev		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:last-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.prevAll("li").length > 0) ? obj.prevAll("li:eq(0)") : false; }

				if(obj.prev("li").length) {
					obj = obj.prev("li").eq(0);
					while(obj.hasClass("jstree-open")) { obj = obj.children("ul:eq(0)").children("li:last"); }
					return obj;
				}
				else { var o = obj.parentsUntil(".jstree","li:eq(0)"); return o.length ? o : false; }
			},
			_get_parent		: function (obj) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj.length) { return false; }
				var o = obj.parentsUntil(".jstree", "li:eq(0)");
				return o.length ? o : -1;
			},
			_get_children	: function (obj) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().children("ul:eq(0)").children("li"); }
				if(!obj.length) { return false; }
				return obj.children("ul:eq(0)").children("li");
			},
			get_path		: function (obj, id_mode) {
				var p = [],
					_this = this;
				obj = this._get_node(obj);
				if(obj === -1 || !obj || !obj.length) { return false; }
				obj.parentsUntil(".jstree", "li").each(function () {
					p.push( id_mode ? this.id : _this.get_text(this) );
				});
				p.reverse();
				p.push( id_mode ? obj.attr("id") : this.get_text(obj) );
				return p;
			},

			// string functions
			_get_string : function (key) {
				return this._get_settings().core.strings[key] || key;
			},

			is_open		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-open"); },
			is_closed	: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-closed"); },
			is_leaf		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-leaf"); },
			correct_state	: function (obj) {
				obj = this._get_node(obj);
				if(!obj || obj === -1) { return false; }
				obj.removeClass("jstree-closed jstree-open").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// open/close
			open_node	: function (obj, callback, skip_animation) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(!obj.hasClass("jstree-closed")) { if(callback) { callback.call(); } return false; }
				var s = skip_animation  ? 0 : this._get_settings().core.animation,
					t = this;
				if(!this._is_loaded(obj)) {
					obj.children("a").addClass("jstree-loading");
					this.load_node(obj, function () { t.open_node(obj, callback, skip_animation); }, callback);
				}
				else {
					if(this._get_settings().core.open_parents) {
						obj.parentsUntil(".jstree",".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
					if(s) { obj.children("ul").css("display","none"); }
					obj.removeClass("jstree-closed").addClass("jstree-open").children("a").removeClass("jstree-loading");
					if(s) { obj.children("ul").stop(true, true).slideDown(s, function () { this.style.display = ""; t.after_open(obj); }); }
					else { t.after_open(obj); }
					this.__callback({ "obj" : obj });
					if(callback) { callback.call(); }
				}
			},
			after_open	: function (obj) { this.__callback({ "obj" : obj }); },
			close_node	: function (obj, skip_animation) {
				obj = this._get_node(obj);
				var s = skip_animation ? 0 : this._get_settings().core.animation,
					t = this;
				if(!obj.length || !obj.hasClass("jstree-open")) { return false; }
				if(s) { obj.children("ul").attr("style","display:block !important"); }
				obj.removeClass("jstree-open").addClass("jstree-closed");
				if(s) { obj.children("ul").stop(true, true).slideUp(s, function () { this.style.display = ""; t.after_close(obj); }); }
				else { t.after_close(obj); }
				this.__callback({ "obj" : obj });
			},
			after_close	: function (obj) { this.__callback({ "obj" : obj }); },
			toggle_node	: function (obj) {
				obj = this._get_node(obj);
				if(obj.hasClass("jstree-closed")) { return this.open_node(obj); }
				if(obj.hasClass("jstree-open")) { return this.close_node(obj); }
			},
			open_all	: function (obj, do_animation, original_obj) {
				obj = obj ? this._get_node(obj) : -1;
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				if(original_obj) { 
					obj = obj.find("li.jstree-closed");
				}
				else {
					original_obj = obj;
					if(obj.is(".jstree-closed")) { obj = obj.find("li.jstree-closed").andSelf(); }
					else { obj = obj.find("li.jstree-closed"); }
				}
				var _this = this;
				obj.each(function () { 
					var __this = this; 
					if(!_this._is_loaded(this)) { _this.open_node(this, function() { _this.open_all(__this, do_animation, original_obj); }, !do_animation); }
					else { _this.open_node(this, false, !do_animation); }
				});
				// so that callback is fired AFTER all nodes are open
				if(original_obj.find('li.jstree-closed').length === 0) { this.__callback({ "obj" : original_obj }); }
			},
			close_all	: function (obj, do_animation) {
				var _this = this;
				obj = obj ? this._get_node(obj) : this.get_container();
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				obj.find("li.jstree-open").andSelf().each(function () { _this.close_node(this, !do_animation); });
				this.__callback({ "obj" : obj });
			},
			clean_node	: function (obj) {
				obj = obj && obj != -1 ? $(obj) : this.get_container_ul();
				obj = obj.is("li") ? obj.find("li").andSelf() : obj.find("li");
				obj.removeClass("jstree-last")
					.filter("li:last-child").addClass("jstree-last").end()
					.filter(":has(li)")
						.not(".jstree-open").removeClass("jstree-leaf").addClass("jstree-closed");
				obj.not(".jstree-open, .jstree-closed").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// rollback
			get_rollback : function () { 
				this.__callback();
				return { i : this.get_index(), h : this.get_container().children("ul").clone(true), d : this.data }; 
			},
			set_rollback : function (html, data) {
				this.get_container().empty().append(html);
				this.data = data;
				this.__callback();
			},
			// Dummy functions to be overwritten by any datastore plugin included
			load_node	: function (obj, s_call, e_call) { this.__callback({ "obj" : obj }); },
			_is_loaded	: function (obj) { return true; },

			// Basic operations: create
			create_node	: function (obj, position, js, callback, is_loaded) {
				obj = this._get_node(obj);
				position = typeof position === "undefined" ? "last" : position;
				var d = $("<li />"),
					s = this._get_settings().core,
					tmp;

				if(obj !== -1 && !obj.length) { return false; }
				if(!is_loaded && !this._is_loaded(obj)) { this.load_node(obj, function () { this.create_node(obj, position, js, callback, true); }); return false; }

				this.__rollback();

				if(typeof js === "string") { js = { "data" : js }; }
				if(!js) { js = {}; }
				if(js.attr) { d.attr(js.attr); }
				if(js.metadata) { d.data(js.metadata); }
				if(js.state) { d.addClass("jstree-" + js.state); }
				if(!js.data) { js.data = this._get_string("new_node"); }
				if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
				$.each(js.data, function (i, m) {
					tmp = $("<a />");
					if($.isFunction(m)) { m = m.call(this, js); }
					if(typeof m == "string") { tmp.attr('href','#')[ s.html_titles ? "html" : "text" ](m); }
					else {
						if(!m.attr) { m.attr = {}; }
						if(!m.attr.href) { m.attr.href = '#'; }
						tmp.attr(m.attr)[ s.html_titles ? "html" : "text" ](m.title);
						if(m.language) { tmp.addClass(m.language); }
					}
					tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(!m.icon && js.icon) { m.icon = js.icon; }
					if(m.icon) { 
						if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
						else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
					}
					d.append(tmp);
				});
				d.prepend("<ins class='jstree-icon'>&#160;</ins>");
				if(obj === -1) {
					obj = this.get_container();
					if(position === "before") { position = "first"; }
					if(position === "after") { position = "last"; }
				}
				switch(position) {
					case "before": obj.before(d); tmp = this._get_parent(obj); break;
					case "after" : obj.after(d);  tmp = this._get_parent(obj); break;
					case "inside":
					case "first" :
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").prepend(d);
						tmp = obj;
						break;
					case "last":
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").append(d);
						tmp = obj;
						break;
					default:
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						if(!position) { position = 0; }
						tmp = obj.children("ul").children("li").eq(position);
						if(tmp.length) { tmp.before(d); }
						else { obj.children("ul").append(d); }
						tmp = obj;
						break;
				}
				if(tmp === -1 || tmp.get(0) === this.get_container().get(0)) { tmp = -1; }
				this.clean_node(tmp);
				this.__callback({ "obj" : d, "parent" : tmp });
				if(callback) { callback.call(this, d); }
				return d;
			},
			// Basic operations: rename (deal with text)
			get_text	: function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				var s = this._get_settings().core.html_titles;
				obj = obj.children("a:eq(0)");
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text	: function (obj, val) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				obj = obj.children("a:eq(0)");
				if(this._get_settings().core.html_titles) {
					var tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val });
					return (obj.nodeValue = val);
				}
			},
			rename_node : function (obj, val) {
				obj = this._get_node(obj);
				this.__rollback();
				if(obj && obj.length && this.set_text.apply(this, Array.prototype.slice.call(arguments))) { this.__callback({ "obj" : obj, "name" : val }); }
			},
			// Basic operations: deleting nodes
			delete_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				this.__rollback();
				var p = this._get_parent(obj), prev = $([]), t = this;
				obj.each(function () {
					prev = prev.add(t._get_prev(this));
				});
				obj = obj.detach();
				if(p !== -1 && p.find("> ul > li").length === 0) {
					p.removeClass("jstree-open jstree-closed").addClass("jstree-leaf");
				}
				this.clean_node(p);
				this.__callback({ "obj" : obj, "prev" : prev, "parent" : p });
				return obj;
			},
			prepare_move : function (o, r, pos, cb, is_cb) {
				var p = {};

				p.ot = $.jstree._reference(o) || this;
				p.o = p.ot._get_node(o);
				p.r = r === - 1 ? -1 : this._get_node(r);
				p.p = (typeof pos === "undefined" || pos === false) ? "last" : pos; // TODO: move to a setting
				if(!is_cb && prepared_move.o && prepared_move.o[0] === p.o[0] && prepared_move.r[0] === p.r[0] && prepared_move.p === p.p) {
					this.__callback(prepared_move);
					if(cb) { cb.call(this, prepared_move); }
					return;
				}
				p.ot = $.jstree._reference(p.o) || this;
				p.rt = $.jstree._reference(p.r) || this; // r === -1 ? p.ot : $.jstree._reference(p.r) || this
				if(p.r === -1 || !p.r) {
					p.cr = -1;
					switch(p.p) {
						case "first":
						case "before":
						case "inside":
							p.cp = 0; 
							break;
						case "after":
						case "last":
							p.cp = p.rt.get_container().find(" > ul > li").length; 
							break;
						default:
							p.cp = p.p;
							break;
					}
				}
				else {
					if(!/^(before|after)$/.test(p.p) && !this._is_loaded(p.r)) {
						return this.load_node(p.r, function () { this.prepare_move(o, r, pos, cb, true); });
					}
					switch(p.p) {
						case "before":
							p.cp = p.r.index();
							p.cr = p.rt._get_parent(p.r);
							break;
						case "after":
							p.cp = p.r.index() + 1;
							p.cr = p.rt._get_parent(p.r);
							break;
						case "inside":
						case "first":
							p.cp = 0;
							p.cr = p.r;
							break;
						case "last":
							p.cp = p.r.find(" > ul > li").length; 
							p.cr = p.r;
							break;
						default: 
							p.cp = p.p;
							p.cr = p.r;
							break;
					}
				}
				p.np = p.cr == -1 ? p.rt.get_container() : p.cr;
				p.op = p.ot._get_parent(p.o);
				p.cop = p.o.index();
				if(p.op === -1) { p.op = p.ot ? p.ot.get_container() : this.get_container(); }
				if(!/^(before|after)$/.test(p.p) && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp++; }
				//if(p.p === "before" && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp--; }
				p.or = p.np.find(" > ul > li:nth-child(" + (p.cp + 1) + ")");
				prepared_move = p;
				this.__callback(prepared_move);
				if(cb) { cb.call(this, prepared_move); }
			},
			check_move : function () {
				var obj = prepared_move, ret = true, r = obj.r === -1 ? this.get_container() : obj.r;
				if(!obj || !obj.o || obj.or[0] === obj.o[0]) { return false; }
				if(obj.op && obj.np && obj.op[0] === obj.np[0] && obj.cp - 1 === obj.o.index()) { return false; }
				obj.o.each(function () { 
					if(r.parentsUntil(".jstree", "li").andSelf().index(this) !== -1) { ret = false; return false; }
				});
				return ret;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				if(!is_prepared) { 
					return this.prepare_move(obj, ref, position, function (p) {
						this.move_node(p, false, false, is_copy, true, skip_check);
					});
				}
				if(is_copy) { 
					prepared_move.cy = true;
				}
				if(!skip_check && !this.check_move()) { return false; }

				this.__rollback();
				var o = false;
				if(is_copy) {
					o = obj.o.clone(true);
					o.find("*[id]").andSelf().each(function () {
						if(this.id) { this.id = "copy_" + this.id; }
					});
				}
				else { o = obj.o; }

				if(obj.or.length) { obj.or.before(o); }
				else { 
					if(!obj.np.children("ul").length) { $("<ul />").appendTo(obj.np); }
					obj.np.children("ul:eq(0)").append(o); 
				}

				try { 
					obj.ot.clean_node(obj.op);
					obj.rt.clean_node(obj.np);
					if(!obj.op.find("> ul > li").length) {
						obj.op.removeClass("jstree-open jstree-closed").addClass("jstree-leaf").children("ul").remove();
					}
				} catch (e) { }

				if(is_copy) { 
					prepared_move.cy = true;
					prepared_move.oc = o; 
				}
				this.__callback(prepared_move);
				return prepared_move;
			},
			_get_move : function () { return prepared_move; }
		}
	});
})(jQuery);

/* 
 * jsTree ui plugin
 * This plugins handles selecting/deselecting/hovering/dehovering nodes
 */
(function ($) {
	var scrollbar_width, e1, e2;
	$(function() {
		if (/msie/.test(navigator.userAgent.toLowerCase())) {
			e1 = $('<textarea cols="10" rows="2"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			e2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			scrollbar_width = e1.width() - e2.width();
			e1.add(e2).remove();
		} 
		else {
			e1 = $('<div />').css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: 0 })
					.prependTo('body').append('<div />').find('div').css({ width: '100%', height: 200 });
			scrollbar_width = 100 - e1.width();
			e1.parent().remove();
		}
	});
	$.jstree.plugin("ui", {
		__init : function () { 
			this.data.ui.selected = $(); 
			this.data.ui.last_selected = false; 
			this.data.ui.hovered = null;
			this.data.ui.to_select = this.get_settings().ui.initially_select;

			this.get_container()
				.delegate("a", "click.jstree", $.proxy(function (event) {
						event.preventDefault();
						event.currentTarget.blur();
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.select_node(event.currentTarget, true, event);
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.hover_node(event.target);
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.dehover_node(event.target);
						}
					}, this))
				.bind("reopen.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("get_rollback.jstree", $.proxy(function () { 
						this.dehover_node();
						this.save_selected();
					}, this))
				.bind("set_rollback.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("close_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.children("ul").find("a.jstree-clicked") : $(),
							_this = this;
						if(s.selected_parent_close === false || !clk.length) { return; }
						clk.each(function () { 
							_this.deselect_node(this);
							if(s.selected_parent_close === "select_parent") { _this.select_node(obj); }
						});
					}, this))
				.bind("delete_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui.select_prev_on_delete,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.find("a.jstree-clicked") : [],
							_this = this;
						clk.each(function () { _this.deselect_node(this); });
						if(s && clk.length) { 
							data.rslt.prev.each(function () { 
								if(this.parentNode) { _this.select_node(this); return false; /* if return false is removed all prev nodes will be selected */}
							});
						}
					}, this))
				.bind("move_node.jstree", $.proxy(function (event, data) { 
						if(data.rslt.cy) { 
							data.rslt.oc.find("a.jstree-clicked").removeClass("jstree-clicked");
						}
					}, this));
		},
		defaults : {
			select_limit : -1, // 0, 1, 2 ... or -1 for unlimited
			select_multiple_modifier : "ctrl", // on, or ctrl, shift, alt
			select_range_modifier : "shift",
			selected_parent_close : "select_parent", // false, "deselect", "select_parent"
			selected_parent_open : true,
			select_prev_on_delete : true,
			disable_selecting_children : false,
			initially_select : []
		},
		_fn : { 
			_get_node : function (obj, allow_multiple) {
				if(typeof obj === "undefined" || obj === null) { return allow_multiple ? this.data.ui.selected : this.data.ui.last_selected; }
				var $obj = $(obj, this.get_container()); 
				if($obj.is(".jstree") || obj == -1) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_ui_notify : function (n, data) {
				if(data.selected) {
					this.select_node(n, false);
				}
			},
			save_selected : function () {
				var _this = this;
				this.data.ui.to_select = [];
				this.data.ui.selected.each(function () { if(this.id) { _this.data.ui.to_select.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); } });
				this.__callback(this.data.ui.to_select);
			},
			reselect : function () {
				var _this = this,
					s = this.data.ui.to_select;
				s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
				// this.deselect_all(); WHY deselect, breaks plugin state notifier?
				$.each(s, function (i, val) { if(val && val !== "#") { _this.select_node(val); } });
				this.data.ui.selected = this.data.ui.selected.filter(function () { return this.parentNode; });
				this.__callback();
			},
			refresh : function (obj) {
				this.save_selected();
				return this.__call_old();
			},
			hover_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				//if(this.data.ui.hovered && obj.get(0) === this.data.ui.hovered.get(0)) { return; }
				if(!obj.hasClass("jstree-hovered")) { this.dehover_node(); }
				this.data.ui.hovered = obj.children("a").addClass("jstree-hovered").parent();
				this._fix_scroll(obj);
				this.__callback({ "obj" : obj });
			},
			dehover_node : function () {
				var obj = this.data.ui.hovered, p;
				if(!obj || !obj.length) { return false; }
				p = obj.children("a").removeClass("jstree-hovered").parent();
				if(this.data.ui.hovered[0] === p[0]) { this.data.ui.hovered = null; }
				this.__callback({ "obj" : obj });
			},
			select_node : function (obj, check, e) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj || !obj.length) { return false; }
				var s = this._get_settings().ui,
					is_multiple = (s.select_multiple_modifier == "on" || (s.select_multiple_modifier !== false && e && e[s.select_multiple_modifier + "Key"])),
					is_range = (s.select_range_modifier !== false && e && e[s.select_range_modifier + "Key"] && this.data.ui.last_selected && this.data.ui.last_selected[0] !== obj[0] && this.data.ui.last_selected.parent()[0] === obj.parent()[0]),
					is_selected = this.is_selected(obj),
					proceed = true,
					t = this;
				if(check) {
					if(s.disable_selecting_children && is_multiple && 
						(
							(obj.parentsUntil(".jstree","li").children("a.jstree-clicked").length) ||
							(obj.children("ul").find("a.jstree-clicked:eq(0)").length)
						)
					) {
						return false;
					}
					proceed = false;
					switch(!0) {
						case (is_range):
							this.data.ui.last_selected.addClass("jstree-last-selected");
							obj = obj[ obj.index() < this.data.ui.last_selected.index() ? "nextUntil" : "prevUntil" ](".jstree-last-selected").andSelf();
							if(s.select_limit == -1 || obj.length < s.select_limit) {
								this.data.ui.last_selected.removeClass("jstree-last-selected");
								this.data.ui.selected.each(function () {
									if(this !== t.data.ui.last_selected[0]) { t.deselect_node(this); }
								});
								is_selected = false;
								proceed = true;
							}
							else {
								proceed = false;
							}
							break;
						case (is_selected && !is_multiple): 
							this.deselect_all();
							is_selected = false;
							proceed = true;
							break;
						case (!is_selected && !is_multiple): 
							if(s.select_limit == -1 || s.select_limit > 0) {
								this.deselect_all();
								proceed = true;
							}
							break;
						case (is_selected && is_multiple): 
							this.deselect_node(obj);
							break;
						case (!is_selected && is_multiple): 
							if(s.select_limit == -1 || this.data.ui.selected.length + 1 <= s.select_limit) { 
								proceed = true;
							}
							break;
					}
				}
				if(proceed && !is_selected) {
					if(!is_range) { this.data.ui.last_selected = obj; }
					obj.children("a").addClass("jstree-clicked");
					if(s.selected_parent_open) {
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.data.ui.selected = this.data.ui.selected.add(obj);
					this._fix_scroll(obj.eq(0));
					this.__callback({ "obj" : obj, "e" : e });
				}
			},
			_fix_scroll : function (obj) {
				var c = this.get_container()[0], t;
				if(c.scrollHeight > c.offsetHeight) {
					obj = this._get_node(obj);
					if(!obj || obj === -1 || !obj.length || !obj.is(":visible")) { return; }
					t = obj.offset().top - this.get_container().offset().top;
					if(t < 0) { 
						c.scrollTop = c.scrollTop + t - 1; 
					}
					if(t + this.data.core.li_height + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0) > c.offsetHeight) { 
						c.scrollTop = c.scrollTop + (t - c.offsetHeight + this.data.core.li_height + 1 + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0)); 
					}
				}
			},
			deselect_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) {
					obj.children("a").removeClass("jstree-clicked");
					this.data.ui.selected = this.data.ui.selected.not(obj);
					if(this.data.ui.last_selected.get(0) === obj.get(0)) { this.data.ui.last_selected = this.data.ui.selected.eq(0); }
					this.__callback({ "obj" : obj });
				}
			},
			toggle_select : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) { this.deselect_node(obj); }
				else { this.select_node(obj); }
			},
			is_selected : function (obj) { return this.data.ui.selected.index(this._get_node(obj)) >= 0; },
			get_selected : function (context) { 
				return context ? $(context).find("a.jstree-clicked").parent() : this.data.ui.selected; 
			},
			deselect_all : function (context) {
				var ret = context ? $(context).find("a.jstree-clicked").parent() : this.get_container().find("a.jstree-clicked").parent();
				ret.children("a.jstree-clicked").removeClass("jstree-clicked");
				this.data.ui.selected = $([]);
				this.data.ui.last_selected = false;
				this.__callback({ "obj" : ret });
			}
		}
	});
	// include the selection plugin by default
	$.jstree.defaults.plugins.push("ui");
})(jQuery);

/* 
 * jsTree CRRM plugin
 * Handles creating/renaming/removing/moving nodes by user interaction.
 */
(function ($) {
	$.jstree.plugin("crrm", { 
		__init : function () {
			this.get_container()
				.bind("move_node.jstree", $.proxy(function (e, data) {
					if(this._get_settings().crrm.move.open_onmove) {
						var t = this;
						data.rslt.np.parentsUntil(".jstree").andSelf().filter(".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
				}, this));
		},
		defaults : {
			input_width_limit : 200,
			move : {
				always_copy			: false, // false, true or "multitree"
				open_onmove			: true,
				default_position	: "last",
				check_move			: function (m) { return true; }
			}
		},
		_fn : {
			_show_input : function (obj, callback) {
				obj = this._get_node(obj);
				var rtl = this._get_settings().core.rtl,
					w = this._get_settings().crrm.input_width_limit,
					w1 = obj.children("ins").width(),
					w2 = obj.find("> a:visible > ins").width() * obj.find("> a:visible > ins").length,
					t = this.get_text(obj),
					h1 = $("<div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo("body"),
					h2 = obj.css("position","relative").append(
					$("<input />", { 
						"value" : t,
						"class" : "jstree-rename-input",
						// "size" : t.length,
						"css" : {
							"padding" : "0",
							"border" : "1px solid silver",
							"position" : "absolute",
							"left"  : (rtl ? "auto" : (w1 + w2 + 4) + "px"),
							"right" : (rtl ? (w1 + w2 + 4) + "px" : "auto"),
							"top" : "0px",
							"height" : (this.data.core.li_height - 2) + "px",
							"lineHeight" : (this.data.core.li_height - 2) + "px",
							"width" : "150px" // will be set a bit further down
						},
						"blur" : $.proxy(function () {
							var i = obj.children(".jstree-rename-input"),
								v = i.val();
							if(v === "") { v = t; }
							h1.remove();
							i.remove(); // rollback purposes
							this.set_text(obj,t); // rollback purposes
							this.rename_node(obj, v);
							callback.call(this, obj, v, t);
							obj.css("position","");
						}, this),
						"keyup" : function (event) {
							var key = event.keyCode || event.which;
							if(key == 27) { this.value = t; this.blur(); return; }
							else if(key == 13) { this.blur(); return; }
							else {
								h2.width(Math.min(h1.text("pW" + this.value).width(),w));
							}
						},
						"keypress" : function(event) {
							var key = event.keyCode || event.which;
							if(key == 13) { return false; }
						}
					})
				).children(".jstree-rename-input"); 
				this.set_text(obj, "");
				h1.css({
						fontFamily		: h2.css('fontFamily')		|| '',
						fontSize		: h2.css('fontSize')		|| '',
						fontWeight		: h2.css('fontWeight')		|| '',
						fontStyle		: h2.css('fontStyle')		|| '',
						fontStretch		: h2.css('fontStretch')		|| '',
						fontVariant		: h2.css('fontVariant')		|| '',
						letterSpacing	: h2.css('letterSpacing')	|| '',
						wordSpacing		: h2.css('wordSpacing')		|| ''
				});
				h2.width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
			},
			rename : function (obj) {
				obj = this._get_node(obj);
				this.__rollback();
				var f = this.__callback;
				this._show_input(obj, function (obj, new_name, old_name) { 
					f.call(this, { "obj" : obj, "new_name" : new_name, "old_name" : old_name });
				});
			},
			create : function (obj, position, js, callback, skip_rename) {
				var t, _this = this;
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				this.__rollback();
				t = this.create_node(obj, position, js, function (t) {
					var p = this._get_parent(t),
						pos = $(t).index();
					if(callback) { callback.call(this, t); }
					if(p.length && p.hasClass("jstree-closed")) { this.open_node(p, false, true); }
					if(!skip_rename) { 
						this._show_input(t, function (obj, new_name, old_name) { 
							_this.__callback({ "obj" : obj, "name" : new_name, "parent" : p, "position" : pos });
						});
					}
					else { _this.__callback({ "obj" : t, "name" : this.get_text(t), "parent" : p, "position" : pos }); }
				});
				return t;
			},
			remove : function (obj) {
				obj = this._get_node(obj, true);
				var p = this._get_parent(obj), prev = this._get_prev(obj);
				this.__rollback();
				obj = this.delete_node(obj);
				if(obj !== false) { this.__callback({ "obj" : obj, "prev" : prev, "parent" : p }); }
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var s = this._get_settings().crrm.move;
				if(!s.check_move.call(this, this._get_move())) { return false; }
				return true;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				var s = this._get_settings().crrm.move;
				if(!is_prepared) { 
					if(typeof position === "undefined") { position = s.default_position; }
					if(position === "inside" && !s.default_position.match(/^(before|after)$/)) { position = s.default_position; }
					return this.__call_old(true, obj, ref, position, is_copy, false, skip_check);
				}
				// if the move is already prepared
				if(s.always_copy === true || (s.always_copy === "multitree" && obj.rt.get_index() !== obj.ot.get_index() )) {
					is_copy = true;
				}
				this.__call_old(true, obj, ref, position, is_copy, true, skip_check);
			},

			cut : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.cp_nodes = false;
				this.data.crrm.ct_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			copy : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.ct_nodes = false;
				this.data.crrm.cp_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			paste : function (obj) { 
				obj = this._get_node(obj);
				if(!obj || !obj.length) { return false; }
				var nodes = this.data.crrm.ct_nodes ? this.data.crrm.ct_nodes : this.data.crrm.cp_nodes;
				if(!this.data.crrm.ct_nodes && !this.data.crrm.cp_nodes) { return false; }
				if(this.data.crrm.ct_nodes) { this.move_node(this.data.crrm.ct_nodes, obj); this.data.crrm.ct_nodes = false; }
				if(this.data.crrm.cp_nodes) { this.move_node(this.data.crrm.cp_nodes, obj, false, true); }
				this.__callback({ "obj" : obj, "nodes" : nodes });
			}
		}
	});
	// include the crr plugin by default
	// $.jstree.defaults.plugins.push("crrm");
})(jQuery);

/* 
 * jsTree themes plugin
 * Handles loading and setting themes, as well as detecting path to themes, etc.
 */
(function ($) {
	// this variable stores the path to the themes folder - if left as false - it will be autodetected
	$.jstree._themes = false;
	$.jstree.plugin("themes", {
		__init : function () { 
			this.get_container()
				.bind("init.jstree", $.proxy(function () {
						var s = this._get_settings().themes;
						this.data.themes.dots = s.dots; 
						this.data.themes.icons = s.icons; 
						this.set_theme(s.theme, s.url);
					}, this))
				.bind("loaded.jstree", $.proxy(function () {
						// bound here too, as simple HTML tree's won't honor dots & icons otherwise
						if(!this.data.themes.dots) { this.hide_dots(); }
						else { this.show_dots(); }
						if(!this.data.themes.icons) { this.hide_icons(); }
						else { this.show_icons(); }
					}, this));
		},
		defaults : { 
			theme : "default", 
			url : false,
			dots : true,
			icons : true
		},
		_fn : {
			set_theme : function (theme_name, theme_url) {
				if(!theme_name) { return false; }
				if(!theme_url) { theme_url = $.jstree._themes + theme_name + '/style.css'; }
				/*if($.inArray(theme_url, themes_loaded) == -1) {
					$.vakata.css.add_sheet({ "url" : theme_url });
					themes_loaded.push(theme_url);
				}*/
				if(this.data.themes.theme != theme_name) {
					this.get_container().removeClass('jstree-' + this.data.themes.theme);
					this.data.themes.theme = theme_name;
				}
				this.get_container().addClass('jstree-' + theme_name);
				if(!this.data.themes.dots) { this.hide_dots(); }
				else { this.show_dots(); }
				if(!this.data.themes.icons) { this.hide_icons(); }
				else { this.show_icons(); }
				this.__callback();
			},
			get_theme	: function () { return this.data.themes.theme; },

			show_dots	: function () { this.data.themes.dots = true; this.get_container().children("ul").removeClass("jstree-no-dots"); },
			hide_dots	: function () { this.data.themes.dots = false; this.get_container().children("ul").addClass("jstree-no-dots"); },
			toggle_dots	: function () { if(this.data.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },

			show_icons	: function () { this.data.themes.icons = true; this.get_container().children("ul").removeClass("jstree-no-icons"); },
			hide_icons	: function () { this.data.themes.icons = false; this.get_container().children("ul").addClass("jstree-no-icons"); },
			toggle_icons: function () { if(this.data.themes.icons) { this.hide_icons(); } else { this.show_icons(); } }
		}
	});
	// autodetect themes path
	$(function () {
		if($.jstree._themes === false) {
			$("script").each(function () { 
				if(this.src.toString().match(/jquery\.jstree[^\/]*?\.js(\?.*)?$/)) { 
					$.jstree._themes = this.src.toString().replace(/jquery\.jstree[^\/]*?\.js(\?.*)?$/, "") + 'themes/'; 
					return false; 
				}
			});
		}
		if($.jstree._themes === false) { $.jstree._themes = "themes/"; }
	});
	// include the themes plugin by default
	$.jstree.defaults.plugins.push("themes");
})(jQuery);

/*
 * jsTree hotkeys plugin
 * Enables keyboard navigation for all tree instances
 * Depends on the jstree ui & jquery hotkeys plugins
 */
(function ($) {
	var bound = [];
	function exec(i, event) {
		var f = $.jstree._focused(), tmp;
		if(f && f.data && f.data.hotkeys && f.data.hotkeys.enabled) { 
			tmp = f._get_settings().hotkeys[i];
			if(tmp) { return tmp.call(f, event); }
		}
	}
	$.jstree.plugin("hotkeys", {
		__init : function () {
			if(typeof $.hotkeys === "undefined") { throw "jsTree hotkeys: jQuery hotkeys plugin not included."; }
			if(!this.data.ui) { throw "jsTree hotkeys: jsTree UI plugin not included."; }
			$.each(this._get_settings().hotkeys, function (i, v) {
				if(v !== false && $.inArray(i, bound) == -1) {
					$(document).bind("keydown", i, function (event) { return exec(i, event); });
					bound.push(i);
				}
			});
			this.get_container()
				.bind("lock.jstree", $.proxy(function () {
						if(this.data.hotkeys.enabled) { this.data.hotkeys.enabled = false; this.data.hotkeys.revert = true; }
					}, this))
				.bind("unlock.jstree", $.proxy(function () {
						if(this.data.hotkeys.revert) { this.data.hotkeys.enabled = true; }
					}, this));
			this.enable_hotkeys();
		},
		defaults : {
			"up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"ctrl+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"shift+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"ctrl+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"shift+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"ctrl+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"shift+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"ctrl+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"shift+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"space" : function () { 
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").click(); } 
				return false; 
			},
			"ctrl+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"shift+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"f2" : function () { this.rename(this.data.ui.hovered || this.data.ui.last_selected); },
			"del" : function () { this.remove(this.data.ui.hovered || this._get_node(null)); }
		},
		_fn : {
			enable_hotkeys : function () {
				this.data.hotkeys.enabled = true;
			},
			disable_hotkeys : function () {
				this.data.hotkeys.enabled = false;
			}
		}
	});

	// include the hotkeys plugin by default
	$.jstree.defaults.plugins.push("hotkeys");
})(jQuery);

/* 
 * jsTree JSON plugin
 * The JSON data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.jstree.plugin("json_data", {
		__init : function() {
			var s = this._get_settings().json_data;
			if(s.progressive_unload) {
				this.get_container().bind("after_close.jstree", function (e, data) {
					data.rslt.obj.children("ul").remove();
				});
			}
		},
		defaults : { 
			// `data` can be a function:
			//  * accepts two arguments - node being loaded and a callback to pass the result to
			//  * will be executed in the current tree's scope & ajax won't be supported
			data : false, 
			ajax : false,
			correct_state : true,
			progressive_render : false,
			progressive_unload : false
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_json(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				var s = this._get_settings().json_data;
				obj = this._get_node(obj); 
				return obj == -1 || !obj || (!s.ajax && !s.progressive_render && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").length > 0;
			},
			refresh : function (obj) {
				obj = this._get_node(obj);
				var s = this._get_settings().json_data;
				if(obj && obj !== -1 && s.progressive_unload && ($.isFunction(s.data) || !!s.ajax)) {
					obj.removeData("jstree_children");
				}
				return this.__call_old();
			},
			load_node_json : function (obj, s_call, e_call) {
				var s = this.get_settings().json_data, d,
					error_func = function () {},
					success_func = function () {};
				obj = this._get_node(obj);

				if(obj && obj !== -1 && (s.progressive_render || s.progressive_unload) && !obj.is(".jstree-open, .jstree-leaf") && obj.children("ul").children("li").length === 0 && obj.data("jstree_children")) {
					d = this._parse_json(obj.data("jstree_children"), obj);
					if(d) {
						obj.append(d);
						if(!s.progressive_unload) { obj.removeData("jstree_children"); }
					}
					this.clean_node(obj);
					if(s_call) { s_call.call(this); }
					return;
				}

				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
					// function option added here for easier model integration (also supporting async - see callback)
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							d = this._parse_json(d, obj);
							if(!d) { 
								if(obj === -1 || !obj) {
									if(s.correct_state) { this.get_container().children("ul").empty(); }
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { this.correct_state(obj); }
								}
								if(e_call) { e_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
						}, this));
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							d = this._parse_json(s.data, obj);
							if(d) {
								this.get_container().children("ul").empty().append(d.children());
								this.clean_node();
							}
							else { 
								if(s.correct_state) { this.get_container().children("ul").empty(); }
							}
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						error_func = function (x, t, e) {
							var ef = this.get_settings().json_data.ajax.error,
								errortext = "";
								
							if(ef) { errortext = ef.call(this, x, t, e); }
							if(obj != -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(obj == -1) {	//tree completely failed loading show a message
								this.get_container().find(".jstree-last .jstree-loading").removeClass("jstree-loading").html((errortext==undefined ? "" :errortext));	//.remove();
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							var sf = this.get_settings().json_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "") || (!$.isArray(d) && !$.isPlainObject(d))) {
								return error_func.call(this, x, t, "");
							}
							d = this._parse_json(d, obj);
							if(d) {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) {
									if(s.correct_state) { 
										this.get_container().children("ul").empty(); 
										if(s_call) { s_call.call(this); }
									}
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "json"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			},
			_parse_json : function (js, obj, is_callback) {
				var d = false, 
					p = this._get_settings(),
					s = p.json_data,
					t = p.core.html_titles,
					tmp, i, j, ul1, ul2;

				if(!js) { return d; }
				if(s.progressive_unload && obj && obj !== -1) { 
					obj.data("jstree_children", d);
				}
				if($.isArray(js)) {
					d = $();
					if(!js.length) { return false; }
					for(i = 0, j = js.length; i < j; i++) {
						tmp = this._parse_json(js[i], obj, true);
						if(tmp.length) { d = d.add(tmp); }
					}
				}
				else {
					if(typeof js == "string") { js = { data : js }; }
					if(!js.data && js.data !== "") { return d; }
					d = $("<li />");
					if(js.attr) { d.attr(js.attr); }
					if(js.metadata) { d.data(js.metadata); }
					if(js.state) { d.addClass("jstree-" + js.state); }
					if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
					$.each(js.data, function (i, m) {
						tmp = $("<a />");
						if($.isFunction(m)) { m = m.call(this, js); }
						if(typeof m == "string") { tmp.attr('href','#')[ t ? "html" : "text" ](m); }
						else {
							if(!m.attr) { m.attr = {}; }
							if(!m.attr.href) { m.attr.href = '#'; }
							tmp.attr(m.attr)[ t ? "html" : "text" ](m.title);
							if(m.language) { tmp.addClass(m.language); }
						}
						tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
						if(!m.icon && js.icon) { m.icon = js.icon; }
						if(m.icon) { 
							if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
							else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
						}
						d.append(tmp);
					});
					d.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(js.children) { 
						if(s.progressive_render && js.state !== "open") {
							d.addClass("jstree-closed").data("jstree_children", js.children);
						}
						else {
							if(s.progressive_unload) { d.data("jstree_children", js.children); }
							if($.isArray(js.children) && js.children.length) {
								tmp = this._parse_json(js.children, obj, true);
								if(tmp.length) {
									ul2 = $("<ul />");
									ul2.append(tmp);
									d.append(ul2);
								}
							}
						}
					}
				}
				if(!is_callback) {
					ul1 = $("<ul />");
					ul1.append(d);
					d = ul1;
				}
				return d;
			},
			get_json : function (obj, li_attr, a_attr, is_callback) {
				var result = [], 
					s = this._get_settings(), 
					_this = this,
					tmp1, tmp2, li, a, t, lang;
				obj = this._get_node(obj);
				if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
				li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
				if(!is_callback && this.data.types) { li_attr.push(s.types.type_attr); }
				a_attr = $.isArray(a_attr) ? a_attr : [ ];

				obj.each(function () {
					li = $(this);
					tmp1 = { data : [] };
					if(li_attr.length) { tmp1.attr = { }; }
					$.each(li_attr, function (i, v) { 
						tmp2 = li.attr(v); 
						if(tmp2 && tmp2.length && tmp2.replace(/jstree[^ ]*/ig,'').length) {
							tmp1.attr[v] = (" " + tmp2).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""); 
						}
					});
					if(li.hasClass("jstree-open")) { tmp1.state = "open"; }
					if(li.hasClass("jstree-closed")) { tmp1.state = "closed"; }
					if(li.data()) { tmp1.metadata = li.data(); }
					a = li.children("a");
					a.each(function () {
						t = $(this);
						if(
							a_attr.length || 
							$.inArray("languages", s.plugins) !== -1 || 
							t.children("ins").get(0).style.backgroundImage.length || 
							(t.children("ins").get(0).className && t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').length)
						) { 
							lang = false;
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (l, lv) {
									if(t.hasClass(lv)) {
										lang = lv;
										return false;
									}
								});
							}
							tmp2 = { attr : { }, title : _this.get_text(t, lang) }; 
							$.each(a_attr, function (k, z) {
								tmp2.attr[z] = (" " + (t.attr(z) || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							});
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (k, z) {
									if(t.hasClass(z)) { tmp2.language = z; return true; }
								});
							}
							if(t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
								tmp2.icon = t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							}
							if(t.children("ins").get(0).style.backgroundImage.length) {
								tmp2.icon = t.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","");
							}
						}
						else {
							tmp2 = _this.get_text(t);
						}
						if(a.length > 1) { tmp1.data.push(tmp2); }
						else { tmp1.data = tmp2; }
					});
					li = li.find("> ul > li");
					if(li.length) { tmp1.children = _this.get_json(li, li_attr, a_attr, true); }
					result.push(tmp1);
				});
				return result;
			}
		}
	});
})(jQuery);

/* 
 * jsTree languages plugin
 * Adds support for multiple language versions in one tree
 * This basically allows for many titles coexisting in one node, but only one of them being visible at any given time
 * This is useful for maintaining the same structure in many languages (hence the name of the plugin)
 */
(function ($) {
	$.jstree.plugin("languages", {
		__init : function () { this._load_css();  },
		defaults : [],
		_fn : {
			set_lang : function (i) { 
				var langs = this._get_settings().languages,
					st = false,
					selector = ".jstree-" + this.get_index() + ' a';
				if(!$.isArray(langs) || langs.length === 0) { return false; }
				if($.inArray(i,langs) == -1) {
					if(!!langs[i]) { i = langs[i]; }
					else { return false; }
				}
				if(i == this.data.languages.current_language) { return true; }
				st = $.vakata.css.get_css(selector + "." + this.data.languages.current_language, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = "none"; }
				st = $.vakata.css.get_css(selector + "." + i, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = ""; }
				this.data.languages.current_language = i;
				this.__callback(i);
				return true;
			},
			get_lang : function () {
				return this.data.languages.current_language;
			},
			_get_string : function (key, lang) {
				var langs = this._get_settings().languages,
					s = this._get_settings().core.strings;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
				}
				if(s[lang] && s[lang][key]) { return s[lang][key]; }
				if(s[key]) { return s[key]; }
				return key;
			},
			get_text : function (obj, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text : function (obj, val, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles,
					tmp;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return (obj.nodeValue = val);
				}
			},
			_load_css : function () {
				var langs = this._get_settings().languages,
					str = "/* languages css */",
					selector = ".jstree-" + this.get_index() + ' a',
					ln;
				if($.isArray(langs) && langs.length) {
					this.data.languages.current_language = langs[0];
					for(ln = 0; ln < langs.length; ln++) {
						str += selector + "." + langs[ln] + " {";
						if(langs[ln] != this.data.languages.current_language) { str += " display:none; "; }
						str += " } ";
					}
					//this.data.languages.language_css = $.vakata.css.add_sheet({ 'str' : str, 'title' : "jstree-languages" });
				}
			},
			create_node : function (obj, position, js, callback) {
				var t = this.__call_old(true, obj, position, js, function (t) {
					var langs = this._get_settings().languages,
						a = t.children("a"),
						ln;
					if($.isArray(langs) && langs.length) {
						for(ln = 0; ln < langs.length; ln++) {
							if(!a.is("." + langs[ln])) {
								t.append(a.eq(0).clone().removeClass(langs.join(" ")).addClass(langs[ln]));
							}
						}
						a.not("." + langs.join(", .")).remove();
					}
					if(callback) { callback.call(this, t); }
				});
				return t;
			}
		}
	});
})(jQuery);

/*
 * jsTree cookies plugin
 * Stores the currently opened/selected nodes in a cookie and then restores them
 * Depends on the jquery.cookie plugin
 */
(function ($) {
	$.jstree.plugin("cookies", {
		__init : function () {
			if(typeof $.cookie === "undefined") { throw "jsTree cookie: jQuery cookie plugin not included."; }

			var s = this._get_settings().cookies,
				tmp;
			if(!!s.save_loaded) {
				tmp = $.cookie(s.save_loaded);
				if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
			}
			if(!!s.save_opened) {
				tmp = $.cookie(s.save_opened);
				if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
			}
			if(!!s.save_selected) {
				tmp = $.cookie(s.save_selected);
				if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
			}
			this.get_container()
				.one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
					this.get_container()
						.bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) { 
								if(this._get_settings().cookies.auto_save) { this.save_cookie((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
							}, this));
				}, this));
		},
		defaults : {
			save_loaded		: "jstree_load",
			save_opened		: "jstree_open",
			save_selected	: "jstree_select",
			auto_save		: true,
			cookie_options	: {}
		},
		_fn : {
			save_cookie : function (c) {
				if(this.data.core.refreshing) { return; }
				var s = this._get_settings().cookies;
				if(!c) { // if called manually and not by event
					if(s.save_loaded) {
						this.save_loaded();
						$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options);
					}
					if(s.save_opened) {
						this.save_opened();
						$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options);
					}
					if(s.save_selected && this.data.ui) {
						this.save_selected();
						$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options);
					}
					return;
				}
				switch(c) {
					case "open_node":
					case "close_node":
						if(!!s.save_opened) { 
							this.save_opened(); 
							$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options); 
						}
						if(!!s.save_loaded) { 
							this.save_loaded(); 
							$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options); 
						}
						break;
					case "select_node":
					case "deselect_node":
						if(!!s.save_selected && this.data.ui) { 
							this.save_selected(); 
							$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options); 
						}
						break;
				}
			}
		}
	});
	// include cookies by default
	// $.jstree.defaults.plugins.push("cookies");
})(jQuery);

/*
 * jsTree sort plugin
 * Sorts items alphabetically (or using any other function)
 */
(function ($) {
	$.jstree.plugin("sort", {
		__init : function () {
			this.get_container()
				.bind("load_node.jstree", $.proxy(function (e, data) {
						var obj = this._get_node(data.rslt.obj);
						obj = obj === -1 ? this.get_container().children("ul") : obj.children("ul");
						this.sort(obj);
					}, this))
				.bind("rename_node.jstree create_node.jstree create.jstree", $.proxy(function (e, data) {
						this.sort(data.rslt.obj.parent());
					}, this))
				.bind("move_node.jstree", $.proxy(function (e, data) {
						var m = data.rslt.np == -1 ? this.get_container() : data.rslt.np;
						this.sort(m.children("ul"));
					}, this));
		},
		defaults : function (a, b) { return this.get_text(a) > this.get_text(b) ? 1 : -1; },
		_fn : {
			sort : function (obj) {
				var s = this._get_settings().sort,
					t = this;
				obj.append($.makeArray(obj.children("li")).sort($.proxy(s, t)));
				obj.find("> li > ul").each(function() { t.sort($(this)); });
				this.clean_node(obj);
			}
		}
	});
})(jQuery);

/*
 * jsTree DND plugin
 * Drag and drop plugin for moving/copying nodes
 */
(function ($) {
	var o = false,
		r = false,
		m = false,
		ml = false,
		sli = false,
		sti = false,
		dir1 = false,
		dir2 = false,
		last_pos = false;
	$.vakata.dnd = {
		is_down : false,
		is_drag : false,
		helper : false,
		scroll_spd : 10,
		init_x : 0,
		init_y : 0,
		threshold : 5,
		helper_left : 5,
		helper_top : 10,
		user_data : {},

		drag_start : function (e, data, html) { 
			if($.vakata.dnd.is_drag) { 
				//$.vakata.drag_stop({}); 
				this.drag_stop({}); 
			}
			try {
				e.currentTarget.unselectable = "on";
				e.currentTarget.onselectstart = function() { return false; };
				if(e.currentTarget.style) { e.currentTarget.style.MozUserSelect = "none"; }
			} catch(err) { }
			$.vakata.dnd.init_x = e.pageX;
			$.vakata.dnd.init_y = e.pageY;
			$.vakata.dnd.user_data = data;
			$.vakata.dnd.is_down = true;
			$.vakata.dnd.helper = $("<div id='vakata-dragged' />").html(html); //.fadeTo(10,0.25);
			$(document).bind("mousemove", $.vakata.dnd.drag);
			$(document).bind("mouseup", $.vakata.dnd.drag_stop);
			return false;
		},
		drag : function (e) { 
			if(!$.vakata.dnd.is_down) { return; }
			if(!$.vakata.dnd.is_drag) {
				if(Math.abs(e.pageX - $.vakata.dnd.init_x) > 5 || Math.abs(e.pageY - $.vakata.dnd.init_y) > 5) { 
					$.vakata.dnd.helper.appendTo("body");
					$.vakata.dnd.is_drag = true;
					$(document).triggerHandler("drag_start.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
				}
				else { return; }
			}

			// maybe use a scrolling parent element instead of document?
			if(e.type === "mousemove") { // thought of adding scroll in order to move the helper, but mouse poisition is n/a
				var d = $(document), t = d.scrollTop(), l = d.scrollLeft();
				if(e.pageY - t < 20) { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "up"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
				}
				if($(window).height() - (e.pageY - t) < 20) {
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "down"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
				}

				if(e.pageX - l < 20) {
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "left"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
				}
				if($(window).width() - (e.pageX - l) < 20) {
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "right"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
				}
			}

			$.vakata.dnd.helper.css({ left : (e.pageX + $.vakata.dnd.helper_left) + "px", top : (e.pageY + $.vakata.dnd.helper_top) + "px" });
			$(document).triggerHandler("drag.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
		},
		drag_stop : function (e) {
			if(sli) { clearInterval(sli); }
			if(sti) { clearInterval(sti); }
			$(document).unbind("mousemove", $.vakata.dnd.drag);
			$(document).unbind("mouseup", $.vakata.dnd.drag_stop);
			$(document).triggerHandler("drag_stop.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
			$.vakata.dnd.helper.remove();
			$.vakata.dnd.init_x = 0;
			$.vakata.dnd.init_y = 0;
			$.vakata.dnd.user_data = {};
			$.vakata.dnd.is_down = false;
			$.vakata.dnd.is_drag = false;
		}
	};
	/*$(function() {
		var css_string = '#vakata-dragged { display:block; margin:0 0 0 0; padding:4px 4px 4px 24px; position:absolute; top:-2000px; line-height:16px; z-index:10000; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
	});*/

	$.jstree.plugin("dnd", {
		__init : function () {
			this.data.dnd = {
				active : false,
				after : false,
				inside : false,
				before : false,
				off : false,
				prepared : false,
				w : 0,
				to1 : false,
				to2 : false,
				cof : false,
				cw : false,
				ch : false,
				i1 : false,
				i2 : false,
				mto : false
			};
			this.addDragElements();
			this.get_container()
				.bind("mouseenter.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.themes) {
								m.attr("class", "jstree-" + this.data.themes.theme); 
								if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
								$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
							}
							//if($(e.currentTarget).find("> ul > li").length === 0) {
							if(e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
								var tr = $.jstree._reference(e.target), dc;
								if(tr.data.dnd.foreign) {
									dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
									if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
								else {
									tr.prepare_move(o, tr.get_container(), "last");
									if(tr.check_move()) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
							}
						}
					}, this))
				.bind("mouseup.jstree", $.proxy(function (e) {
						//if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && $(e.currentTarget).find("> ul > li").length === 0) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
							var tr = $.jstree._reference(e.currentTarget), dc;
							if(tr.data.dnd.foreign) {
								dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
									tr._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								}
							}
							else {
								tr.move_node(o, tr.get_container(), "last", e[tr._get_settings().dnd.copy_modifier + "Key"]);
							}
						}
					}, this))
				.bind("mouseleave.jstree", $.proxy(function (e) {
						if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
							return false; 
						}
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
							if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
							if($.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}
					}, this))
				.bind("mousemove.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							var cnt = this.get_container()[0];

							// Horizontal scroll
							if(e.pageX + 24 > this.data.dnd.cof.left + this.data.dnd.cw) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageX - 24 < this.data.dnd.cof.left) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							}

							// Vertical scroll
							if(e.pageY + 24 > this.data.dnd.cof.top + this.data.dnd.ch) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageY - 24 < this.data.dnd.cof.top) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							}

						}
					}, this))
				.bind("scroll.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && m && ml) {
							m.hide();
							ml.hide();
						}
					}, this))
				.delegate("a", "mousedown.jstree", $.proxy(function (e) { 
						if(e.which === 1) {
							this.start_drag(e.currentTarget, e);
							return false;
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_enter(e.currentTarget);
						}
					}, this))
				.delegate("a", "mousemove.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(!r || !r.length || r.children("a")[0] !== e.currentTarget) {
								this.dnd_enter(e.currentTarget);
							}
							if(typeof this.data.dnd.off.top === "undefined") { this.data.dnd.off = $(e.target).offset(); }
							this.data.dnd.w = (e.pageY - (this.data.dnd.off.top || 0)) % this.data.core.li_height;
							if(this.data.dnd.w < 0) { this.data.dnd.w += this.data.core.li_height; }
							this.dnd_show();
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
								return false; 
							}
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							/*
							var ec = $(e.currentTarget).closest("li"), 
								er = $(e.relatedTarget).closest("li");
							if(er[0] !== ec.prev()[0] && er[0] !== ec.next()[0]) {
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							}
							*/
							this.data.dnd.mto = setTimeout( 
								(function (t) { return function () { t.dnd_leave(e); }; })(this),
							0);
						}
					}, this))
				.delegate("a", "mouseup.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_finish(e);
						}
					}, this));

			$(document)
				.bind("drag_stop.vakata", $.proxy(function () {
						if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
						if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
						if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
						if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
						this.data.dnd.after		= false;
						this.data.dnd.before	= false;
						this.data.dnd.inside	= false;
						this.data.dnd.off		= false;
						this.data.dnd.prepared	= false;
						this.data.dnd.w			= false;
						this.data.dnd.to1		= false;
						this.data.dnd.to2		= false;
						this.data.dnd.i1		= false;
						this.data.dnd.i2		= false;
						this.data.dnd.active	= false;
						this.data.dnd.foreign	= false;
						if(m) { m.css({ "top" : "-2000px" }); }
						if(ml) { ml.css({ "top" : "-2000px" }); }
					}, this))
				.bind("drag_start.vakata", $.proxy(function (e, data) {
						if(data.data.jstree) { 
							var et = $(data.event.target);
							if(et.closest(".jstree").hasClass("jstree-" + this.get_index())) {
								this.dnd_enter(et);
							}
						}
					}, this));
				/*
				.bind("keydown.jstree-" + this.get_index() + " keyup.jstree-" + this.get_index(), $.proxy(function(e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && !this.data.dnd.foreign) {
							var h = $.vakata.dnd.helper.children("ins");
							if(e[this._get_settings().dnd.copy_modifier + "Key"] && h.hasClass("jstree-ok")) {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, "") + " (Copy)");
							} 
							else {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, ""));
							}
						}
					}, this)); */



			var s = this._get_settings().dnd;
			if(s.drag_target) {
				$(document)
					.delegate(s.drag_target, "mousedown.jstree-" + this.get_index(), $.proxy(function (e) {
						o = e.target;
						$.vakata.dnd.drag_start(e, { jstree : true, obj : e.target }, "<ins class='jstree-icon'></ins>" + $(e.target).text() );
						if(this.data.themes) { 
							if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
							if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
							$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
						}
						$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
						var cnt = this.get_container();
						this.data.dnd.cof = cnt.offset();
						this.data.dnd.cw = parseInt(cnt.width(),10);
						this.data.dnd.ch = parseInt(cnt.height(),10);
						this.data.dnd.foreign = true;
						e.preventDefault();
					}, this));
			}
			if(s.drop_target) {
				$(document)
					.delegate(s.drop_target, "mouseenter.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && this._get_settings().dnd.drop_check.call(this, { "o" : o, "r" : $(e.target), "e" : e })) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
							}
						}, this))
					.delegate(s.drop_target, "mouseleave.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}, this))
					.delegate(s.drop_target, "mouseup.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && $.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								this._get_settings().dnd.drop_finish.call(this, { "o" : o, "r" : $(e.target), "e" : e });
							}
						}, this));
			}
		},
		defaults : {
			copy_modifier	: "ctrl",
			check_timeout	: 100,
			open_timeout	: 500,
			drop_target		: ".jstree-drop",
			drop_check		: function (data) { return true; },
			drop_finish		: $.noop,
			drag_target		: ".jstree-draggable",
			drag_finish		: $.noop,
			drag_check		: function (data) { return { after : false, before : false, inside : true }; }
		},
		_fn : {
			dnd_prepare : function () {
				if(!r || !r.length) { return; }
				this.data.dnd.off = r.offset();
				if(this._get_settings().core.rtl) {
					this.data.dnd.off.right = this.data.dnd.off.left + r.width();
				}
				if(this.data.dnd.foreign) {
					var a = this._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : r });
					this.data.dnd.after = a.after;
					this.data.dnd.before = a.before;
					this.data.dnd.inside = a.inside;
					this.data.dnd.prepared = true;
					return this.dnd_show();
				}
				this.prepare_move(o, r, "before");
				this.data.dnd.before = this.check_move();
				this.prepare_move(o, r, "after");
				this.data.dnd.after = this.check_move();
				if(this._is_loaded(r)) {
					this.prepare_move(o, r, "inside");
					this.data.dnd.inside = this.check_move();
				}
				else {
					this.data.dnd.inside = false;
				}
				this.data.dnd.prepared = true;
				return this.dnd_show();
			},
			dnd_show : function () {
				if(!this.data.dnd.prepared) { return; }
				var o = ["before","inside","after"],
					r = false,
					rtl = this._get_settings().core.rtl,
					pos;
				if(this.data.dnd.w < this.data.core.li_height/3) { o = ["before","inside","after"]; }
				else if(this.data.dnd.w <= this.data.core.li_height*2/3) {
					o = this.data.dnd.w < this.data.core.li_height/2 ? ["inside","before","after"] : ["inside","after","before"];
				}
				else { o = ["after","inside","before"]; }
				$.each(o, $.proxy(function (i, val) { 
					if(this.data.dnd[val]) {
						$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
						r = val;
						return false;
					}
				}, this));
				if(r === false) { $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"); }
				
				pos = rtl ? (this.data.dnd.off.right - 18) : (this.data.dnd.off.left + 10);
				switch(r) {
					case "before":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top - 1) + "px" }).show(); }
						break;
					case "after":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 1) + "px" }).show(); }
						break;
					case "inside":
						m.css({ "left" : pos + ( rtl ? -4 : 4) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height/2 - 5) + "px" }).show();
						if(ml) { ml.hide(); }
						break;
					default:
						m.hide();
						if(ml) { ml.hide(); }
						break;
				}
				last_pos = r;
				return r;
			},
			dnd_open : function () {
				this.data.dnd.to2 = false;
				this.open_node(r, $.proxy(this.dnd_prepare,this), true);
			},
			dnd_finish : function (e) {
				if(this.data.dnd.foreign) {
					if(this.data.dnd.after || this.data.dnd.before || this.data.dnd.inside) {
						this._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : r, "p" : last_pos });
					}
				}
				else {
					this.dnd_prepare();
					this.move_node(o, r, last_pos, e[this._get_settings().dnd.copy_modifier + "Key"]);
				}
				o = false;
				r = false;
				m.hide();
				if(ml) { ml.hide(); }
			},
			dnd_enter : function (obj) {
				if(this.data.dnd.mto) { 
					clearTimeout(this.data.dnd.mto);
					this.data.dnd.mto = false;
				}
				var s = this._get_settings().dnd;
				this.data.dnd.prepared = false;
				r = this._get_node(obj);
				if(s.check_timeout) { 
					// do the calculations after a minimal timeout (users tend to drag quickly to the desired location)
					if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
					this.data.dnd.to1 = setTimeout($.proxy(this.dnd_prepare, this), s.check_timeout); 
				}
				else { 
					this.dnd_prepare(); 
				}
				if(s.open_timeout) { 
					if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
					if(r && r.length && r.hasClass("jstree-closed")) { 
						// if the node is closed - open it, then recalculate
						this.data.dnd.to2 = setTimeout($.proxy(this.dnd_open, this), s.open_timeout);
					}
				}
				else {
					if(r && r.length && r.hasClass("jstree-closed")) { 
						this.dnd_open();
					}
				}
			},
			dnd_leave : function (e) {
				this.data.dnd.after		= false;
				this.data.dnd.before	= false;
				this.data.dnd.inside	= false;
				$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
				m.hide();
				if(ml) { ml.hide(); }
				if(r && r[0] === e.target.parentNode) {
					if(this.data.dnd.to1) {
						clearTimeout(this.data.dnd.to1);
						this.data.dnd.to1 = false;
					}
					if(this.data.dnd.to2) {
						clearTimeout(this.data.dnd.to2);
						this.data.dnd.to2 = false;
					}
				}
			},
			start_drag : function (obj, e) {
				o = this._get_node(obj);
				if(this.data.ui && this.is_selected(o)) { o = this._get_node(null, true); }
				var dt = o.length > 1 ? this._get_string("multiple_selection") : this.get_text(o),
					cnt = this.get_container();
				if(!this._get_settings().core.html_titles) { dt = dt.replace(/</ig,"&lt;").replace(/>/ig,"&gt;"); }
				$.vakata.dnd.drag_start(e, { jstree : true, obj : o }, "<ins class='jstree-icon'></ins>" + dt );
				if(this.data.themes) { 
					if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
					if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
					$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
				}
				this.data.dnd.cof = cnt.offset();
				this.data.dnd.cw = parseInt(cnt.width(),10);
				this.data.dnd.ch = parseInt(cnt.height(),10);
				this.data.dnd.active = true;
			},
			addDragElements : function() {
				m = $("<div />").attr({ id : "jstree-marker" }).hide().html("&raquo;")
					.bind("mouseleave mouseenter", function (e) { 
						m.hide();
						ml.hide();
						e.preventDefault(); 
						e.stopImmediatePropagation(); 
						return false; 
					})
					.appendTo("body");
					ml = $("<div />").attr({ id : "jstree-marker-line" }).hide()
					.bind("mouseup", function (e) { 
						if(r && r.length) { 
							r.children("a").trigger(e); 
							e.preventDefault(); 
							e.stopImmediatePropagation(); 
							return false; 
						} 
					})
					.bind("mouseleave", function (e) { 
						var rt = $(e.relatedTarget);
						if(rt.is(".jstree") || rt.closest(".jstree").length === 0) {
							if(r && r.length) { 
								r.children("a").trigger(e); 
								m.hide();
								ml.hide();
								e.preventDefault(); 
								e.stopImmediatePropagation(); 
								return false; 
							}
						}
					})
					.appendTo("body");
					
				$(document).bind("drag_start.vakata", function (e, data) {
					if(data.data.jstree) { m.show(); if(ml) { ml.show(); } }
				});
				$(document).bind("drag_stop.vakata", function (e, data) {
					if(data.data.jstree) { m.hide(); if(ml) { ml.hide(); } }
				});
			}
		}
	});
})(jQuery);

/*
 * jsTree checkbox plugin
 * Inserts checkboxes in front of every node
 * Depends on the ui plugin
 * DOES NOT WORK NICELY WITH MULTITREE DRAG'N'DROP
 */
(function ($) {
	$.jstree.plugin("checkbox", {
		__init : function () {
			this.data.checkbox.noui = this._get_settings().checkbox.override_ui;
			if(this.data.ui && this.data.checkbox.noui) {
				this.select_node = this.deselect_node = this.deselect_all = $.noop;
				this.get_selected = this.get_checked;
			}

			this.get_container()
				.bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree", $.proxy(function (e, data) { 
						this._prepare_checkboxes(data.rslt.obj);
					}, this))
				.bind("loaded.jstree", $.proxy(function (e) {
						this._prepare_checkboxes();
					}, this))
				.delegate( (this.data.ui && this.data.checkbox.noui ? "a" : "ins.jstree-checkbox") , "click.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(this._get_node(e.target).hasClass("jstree-checked")) { this.uncheck_node(e.target); }
						else { this.check_node(e.target); }
						if(this.data.ui && this.data.checkbox.noui) {
							this.save_selected();
							if(this.data.cookies) { this.save_cookie("select_node"); }
						}
						else {
							e.stopImmediatePropagation();
							return false;
						}
					}, this));
		},
		defaults : {
			override_ui : false,
			two_state : false,
			real_checkboxes : false,
			checked_parent_open : true,
			real_checkboxes_names : function (n) { return [ ("check_" + (n[0].id || Math.ceil(Math.random() * 10000))) , 1]; }
		},
		__destroy : function () {
			this.get_container()
				.find("input.jstree-real-checkbox").removeClass("jstree-real-checkbox").end()
				.find("ins.jstree-checkbox").remove();
		},
		_fn : {
			_checkbox_notify : function (n, data) {
				if(data.checked) {
					this.check_node(n, false);
				}
			},
			_prepare_checkboxes : function (obj) {
				obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
				if(obj === false) { return; } // added for removing root nodes
				var c, _this = this, t, ts = this._get_settings().checkbox.two_state, rc = this._get_settings().checkbox.real_checkboxes, rcn = this._get_settings().checkbox.real_checkboxes_names;
				obj.each(function () {
					t = $(this);
					c = t.is("li") && (t.hasClass("jstree-checked") || (rc && t.children(":checked").length)) ? "jstree-checked" : "jstree-unchecked";
					t.find("li").andSelf().each(function () {
						var $t = $(this), nm;
						$t.children("a" + (_this.data.languages ? "" : ":eq(0)") ).not(":has(.jstree-checkbox)").prepend("<ins class='jstree-checkbox'>&#160;</ins>").parent().not(".jstree-checked, .jstree-unchecked").addClass( ts ? "jstree-unchecked" : c );
						if(rc) {
							if(!$t.children(":checkbox").length) {
								nm = rcn.call(_this, $t);
								$t.prepend("<input type='checkbox' class='jstree-real-checkbox' id='" + nm[0] + "' name='" + nm[0] + "' value='" + nm[1] + "' />");
							}
							else {
								$t.children(":checkbox").addClass("jstree-real-checkbox");
							}
						}
						if(!ts) {
							if(c === "jstree-checked" || $t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.find("li").andSelf().addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
						else {
							if($t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
					});
				});
				if(!ts) {
					obj.find(".jstree-checked").parent().parent().each(function () { _this._repair_state(this); }); 
				}
			},
			change_state : function (obj, state) {
				obj = this._get_node(obj);
				var coll = false, rc = this._get_settings().checkbox.real_checkboxes;
				if(!obj || obj === -1) { return false; }
				state = (state === false || state === true) ? state : obj.hasClass("jstree-checked");
				if(this._get_settings().checkbox.two_state) {
					if(state) { 
						obj.removeClass("jstree-checked").addClass("jstree-unchecked"); 
						if(rc) { obj.children(":checkbox").prop("checked", false); }
					}
					else { 
						obj.removeClass("jstree-unchecked").addClass("jstree-checked"); 
						if(rc) { obj.children(":checkbox").prop("checked", true); }
					}
				}
				else {
					if(state) { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-checked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked"); 
						if(rc) { coll.children(":checkbox").prop("checked", false); }
					}
					else { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-unchecked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked"); 
						if(rc) { coll.children(":checkbox").prop("checked", true); }
						if(this.data.ui) { this.data.ui.last_selected = obj; }
						this.data.checkbox.last_selected = obj;
					}
					obj.parentsUntil(".jstree", "li").each(function () {
						var $this = $(this);
						if(state) {
							if($this.children("ul").children("li.jstree-checked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked");
								if(rc) { $this.children(":checkbox").prop("checked", false); }
							}
						}
						else {
							if($this.children("ul").children("li.jstree-unchecked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked");
								if(rc) { $this.children(":checkbox").prop("checked", true); }
							}
						}
					});
				}
				if(this.data.ui && this.data.checkbox.noui) { this.data.ui.selected = this.get_checked(); }
				this.__callback(obj);
				return true;
			},
			check_node : function (obj) {
				if(this.change_state(obj, false)) { 
					obj = this._get_node(obj);
					if(this._get_settings().checkbox.checked_parent_open) {
						var t = this;
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.__callback({ "obj" : obj }); 
				}
			},
			uncheck_node : function (obj) {
				if(this.change_state(obj, true)) { this.__callback({ "obj" : this._get_node(obj) }); }
			},
			check_all : function () {
				var _this = this, 
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, false);
				});
				this.__callback();
			},
			uncheck_all : function () {
				var _this = this,
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, true);
				});
				this.__callback();
			},

			is_checked : function(obj) {
				obj = this._get_node(obj);
				return obj.length ? obj.is(".jstree-checked") : false;
			},
			get_checked : function (obj, get_all) {
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-checked") : obj.find("> ul > .jstree-checked, .jstree-undetermined > ul > .jstree-checked");
			},
			get_unchecked : function (obj, get_all) { 
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-unchecked") : obj.find("> ul > .jstree-unchecked, .jstree-undetermined > ul > .jstree-unchecked");
			},

			show_checkboxes : function () { this.get_container().children("ul").removeClass("jstree-no-checkboxes"); },
			hide_checkboxes : function () { this.get_container().children("ul").addClass("jstree-no-checkboxes"); },

			_repair_state : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return; }
				if(this._get_settings().checkbox.two_state) {
					obj.find('li').andSelf().not('.jstree-checked').removeClass('jstree-undetermined').addClass('jstree-unchecked').children(':checkbox').prop('checked', true);
					return;
				}
				var rc = this._get_settings().checkbox.real_checkboxes,
					a = obj.find("> ul > .jstree-checked").length,
					b = obj.find("> ul > .jstree-undetermined").length,
					c = obj.find("> ul > li").length;
				if(c === 0) { if(obj.hasClass("jstree-undetermined")) { this.change_state(obj, false); } }
				else if(a === 0 && b === 0) { this.change_state(obj, true); }
				else if(a === c) { this.change_state(obj, false); }
				else { 
					obj.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
					if(rc) { obj.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
				}
			},
			reselect : function () {
				if(this.data.ui && this.data.checkbox.noui) { 
					var _this = this,
						s = this.data.ui.to_select;
					s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.deselect_all();
					$.each(s, function (i, val) { _this.check_node(val); });
					this.__callback();
				}
				else { 
					this.__call_old(); 
				}
			},
			save_loaded : function () {
				var _this = this;
				this.data.core.to_load = [];
				this.get_container_ul().find("li.jstree-closed.jstree-undetermined").each(function () {
					if(this.id) { _this.data.core.to_load.push("#" + this.id); }
				});
			}
		}
	});
	/*$(function() {
		var css_string = '.jstree .jstree-real-checkbox { display:none; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});*/
})(jQuery);

/*
 * jsTree search plugin
 * Enables both sync and async search on the tree
 * DOES NOT WORK WITH JSON PROGRESSIVE RENDER
 */
(function ($) {
	$.expr[':'].jstree_contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.expr[':'].jstree_title_contains = function(a,i,m) {
		return (a.getAttribute("title") || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.jstree.plugin("search", {
		__init : function () {
			
			this.data.search.str = "";
			this.data.search.result = $();
			if(this._get_settings().search.show_only_matches) {
				this.get_container()
					.bind("search.jstree", function (e, data) {
						$(this).children("ul").find("li").hide().removeClass("jstree-last");
						data.rslt.nodes.parentsUntil(".jstree").andSelf().show()
							.filter("ul").each(function () { $(this).children("li:visible").eq(-1).addClass("jstree-last"); });
					})
					.bind("clear_search.jstree", function () {
						$(this).children("ul").find("li").css("display","").end().end().inforTree("clean_node", -1);
					});
			}
			this._setupSearchField();
		},
		defaults : {
			ajax : false,
			search_method : "jstree_contains", // for case insensitive - jstree_contains
			show_only_matches : true,
			case_insensitive: true
		},
		_fn : {
			_setupSearchField : function() {
				var self = this,
					container = self.get_container(),
					searchField = container.siblings(".inforTriggerField").find(".inforSearchField");
				
				if (searchField.length==0) {
					searchField = $('<input class="inforSearchField" type="text">');
					container.before(searchField);
					container.before('<br>');
				}
				
				container.bind("after_open.jstree after_close.jstree" , function(e) {
					self._handleSizeChange();
				});
				
				$("#leftPane").resize(function() {
					self._handleSizeChange();
				});
				
				searchField
					.attr("placeholder",Globalize.localize("SearchTree"))
					.addClass("inforTreeSearchField noTrackDirty")
					.inforTriggerField()
					.placeholder()
					.keyup(function(event){
						var term = $(this).val();
						self._displayCancelButton($(this),"Cancel");
						
						if (term=="")
							self._displayCancelButton($(this),"Search");
							
						if (event.which==13) {
							self.search(term);
							self._handleSizeChange();
						}
					})
					.blur(function(event){
						if ($(this).val()=="") 
							self._displayCancelButton($(this),"Search");
					})
					.closest(".inforTriggerField").css("margin","2px 0 2px 8px").find(".inforTriggerButton").click(function() {
						var term = $(this).closest(".inforTriggerField").find("input").val();
						self.search(term);
					});
					
				this._handleSizeChange();
				searchField.closest(".inforTriggerField").find(".inforTriggerButton")
					.attr("title",Globalize.localize("Search"));
			},
			_displayCancelButton : function(field, icon) {
				var self = this,
				    triggerButton = field.closest(".inforTriggerField").find(".inforTriggerButton"),
				    cancelButton = triggerButton.prev();
						
				if (!cancelButton.hasClass("inforCloseButtonDark")) {
					cancelButton = $("<div class='inforCloseButtonDark inforTreeSearchCancel'></div>");
					triggerButton.before(cancelButton);
					
					cancelButton.attr("title",Globalize.localize("Cancel"));
					cancelButton.click(function() {
					$(this).hide().closest(".inforTriggerField").find("input").val("");
						self.search("");
						self._handleSizeChange();
						$("#inforTooltip").hide();
					});
				}
				
				if (icon=="Search")
					cancelButton.hide();
				else 
					cancelButton.show();
			},
			_handleSizeChange : function() {
				var tree = this.get_container();
				var totalHeight = tree.offset().top+tree.height();
				var extraForScroll=0;
				
				if (totalHeight>$(window).height())
					extraForScroll=15;
				
				var width = $("#leftPane").width()-35-extraForScroll;
				//see if there is a scrollbar
				$(".inforSearchField").width(width);
			},
			search : function (str, skip_async) {
				if($.trim(str) === "") { this.clear_search(); return; }
				var s = this.get_settings().search, 
					t = this,
					error_func = function () { },
					success_func = function () { };
				this.data.search.str = str;

				if(!skip_async && s.ajax !== false && this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length > 0) {
					this.search.supress_callback = true;
					error_func = function () { };
					success_func = function (d, t, x) {
						var sf = this.get_settings().search.ajax.success; 
						if(sf) { d = sf.call(this,d,t,x) || d; }
						this.data.search.to_open = d;
						this._search_open();
					};
					s.ajax.context = this;
					s.ajax.error = error_func;
					s.ajax.success = success_func;
					if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, str); }
					if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, str); }
					if(!s.ajax.data) { s.ajax.data = { "search_string" : str }; }
					if(!s.ajax.dataType || /^json/.exec(s.ajax.dataType)) { s.ajax.dataType = "json"; }
					$.ajax(s.ajax);
					return;
				}
				if(this.data.search.result.length) { this.clear_search(); }
				this.data.search.result = this.get_container().find("a" + (this.data.languages ? "." + this.get_lang() : "" ) + ":" + (s.search_method) + "(" + this.data.search.str + ")");
				this.data.search.result.addClass("jstree-search").parent().parents(".jstree-closed").each(function () {
					t.open_node(this, false, true);
				});
				this.__callback({ nodes : this.data.search.result, str : str });
				
				this._handleSizeChange();
			},
			clear_search : function (str) {
				this.data.search.result.removeClass("jstree-search");
				this.__callback(this.data.search.result);
				this.data.search.result = $();
			},
			_search_open : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(this.data.search.to_open.length) {
					$.each(this.data.search.to_open, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length && $(val).is(".jstree-closed")) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.search.to_open = remaining;
						$.each(current, function (i, val) { 
							_this.open_node(val, function () { _this._search_open(true); }); 
						});
						done = false;
					}
				}
				if(done) { this.search(this.data.search.str, true); }
			}
		}
	});
	
	// include the json_data data plugin by default
	$.jstree.defaults.plugins.push("search");
})(jQuery);

/* 
 * jsTree contextmenu plugin
 */
(function ($) {
	$.vakata.context = {
		hide_on_mouseleave : false,

		cnt		: $("<div id='vakata-contextmenu' />"),
		vis		: false,
		tgt		: false,
		par		: false,
		func	: false,
		data	: false,
		rtl		: false,
		show	: function (s, t, x, y, d, p, rtl) {
			$.vakata.context.rtl = !!rtl;
			var html = $.vakata.context.parse(s), h, w;
			if(!html) { return; }
			$.vakata.context.vis = true;
			$.vakata.context.tgt = t;
			$.vakata.context.par = p || t || null;
			$.vakata.context.data = d || null;
			$.vakata.context.cnt
				.html(html)
				.css({ "visibility" : "hidden", "display" : "block", "left" : 0, "top" : 0 });

			if($.vakata.context.hide_on_mouseleave) {
				$.vakata.context.cnt
					.one("mouseleave", function(e) { $.vakata.context.hide(); });
			}

			h = $.vakata.context.cnt.height();
			w = $.vakata.context.cnt.width();
			if(x + w > $(document).width()) { 
				x = $(document).width() - (w + 5); 
				$.vakata.context.cnt.find("li > ul").addClass("right"); 
			}
			if(y + h > $(document).height()) { 
				y = y - (h + t[0].offsetHeight); 
				$.vakata.context.cnt.find("li > ul").addClass("bottom"); 
			}

			$.vakata.context.cnt
				.css({ "left" : x, "top" : y })
				.find("li:has(ul)")
					.bind("mouseenter", function (e) { 
						var w = $(document).width(),
							h = $(document).height(),
							ul = $(this).children("ul").show(); 
						if(w !== $(document).width()) { ul.toggleClass("right"); }
						if(h !== $(document).height()) { ul.toggleClass("bottom"); }
					})
					.bind("mouseleave", function (e) { 
						$(this).children("ul").hide(); 
					})
					.end()
				.css({ "visibility" : "visible" })
				.show();
			$(document).triggerHandler("context_show.vakata");
		},
		hide	: function () {
			$.vakata.context.vis = false;
			$.vakata.context.cnt.attr("class","").css({ "visibility" : "hidden" });
			$(document).triggerHandler("context_hide.vakata");
		},
		parse	: function (s, is_callback) {
			if(!s) { return false; }
			var str = "",
				tmp = false,
				was_sep = true;
			if(!is_callback) { $.vakata.context.func = {}; }
			str += "<ul>";
			$.each(s, function (i, val) {
				if(!val) { return true; }
				$.vakata.context.func[i] = val.action;
				if(!was_sep && val.separator_before) {
					str += "<li class='vakata-separator vakata-separator-before'></li>";
				}
				was_sep = false;
				str += "<li class='" + (val._class || "") + (val._disabled ? " jstree-contextmenu-disabled " : "") + "'><ins ";
				if(val.icon && val.icon.indexOf("/") === -1) { str += " class='" + val.icon + "' "; }
				if(val.icon && val.icon.indexOf("/") !== -1) { str += " style='background:url(" + val.icon + ") center center no-repeat;' "; }
				str += ">&#160;</ins><a href='#' rel='" + i + "'>";
				if(val.submenu) {
					str += "<span style='float:" + ($.vakata.context.rtl ? "left" : "right") + ";'>&raquo;</span>";
				}
				str += val.label + "</a>";
				if(val.submenu) {
					tmp = $.vakata.context.parse(val.submenu, true);
					if(tmp) { str += tmp; }
				}
				str += "</li>";
				if(val.separator_after) {
					str += "<li class='vakata-separator vakata-separator-after'></li>";
					was_sep = true;
				}
			});
			str = str.replace(/<li class\='vakata-separator vakata-separator-after'\><\/li\>$/,"");
			str += "</ul>";
			$(document).triggerHandler("context_parse.vakata");
			return str.length > 10 ? str : false;
		},
		exec	: function (i) {
			if($.isFunction($.vakata.context.func[i])) {
				// if is string - eval and call it!
				$.vakata.context.func[i].call($.vakata.context.data, $.vakata.context.par);
				return true;
			}
			else { return false; }
		}
	};
	$.jstree.plugin("contextmenu", {
		__init : function () {
			this.get_container()
				.delegate("a", "contextmenu.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(!$(e.currentTarget).hasClass("jstree-loading")) {
							this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
						}
					}, this))
				.delegate("a", "click.jstree", $.proxy(function (e) {
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this))
				.bind("destroy.jstree", $.proxy(function () {
						// TODO: move this to descruct method
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this));
			$(document).bind("context_hide.vakata", $.proxy(function () { this.data.contextmenu = false; }, this));
			/* Added here for now until i get around to styling the context menu..this was appened to the page on script load which i did not like...
				var css_string = '' + 
				'#vakata-contextmenu { display:block; visibility:hidden; left:0; top:-200px; position:absolute; margin:0; padding:0; min-width:180px; background:#ebebeb; border:1px solid silver; z-index:10000; *width:180px; } ' + 
				'#vakata-contextmenu ul { min-width:180px; *width:180px; } ' + 
				'#vakata-contextmenu ul, #vakata-contextmenu li { margin:0; padding:0; list-style-type:none; display:block; } ' + 
				'#vakata-contextmenu li { line-height:20px; min-height:20px; position:relative; padding:0px; } ' + 
				'#vakata-contextmenu li a { padding:1px 6px; line-height:17px; display:block; text-decoration:none; margin:1px 1px 0 1px; } ' + 
				'#vakata-contextmenu li ins { float:left; width:16px; height:16px; text-decoration:none; margin-right:2px; } ' + 
				'#vakata-contextmenu li a:hover, #vakata-contextmenu li.vakata-hover > a { background:gray; color:white; } ' + 
				'#vakata-contextmenu li ul { display:none; position:absolute; top:-2px; left:100%; background:#ebebeb; border:1px solid gray; } ' + 
				'#vakata-contextmenu .right { right:100%; left:auto; } ' + 
				'#vakata-contextmenu .bottom { bottom:-1px; top:auto; } ' + 
				'#vakata-contextmenu li.vakata-separator { min-height:0; height:1px; line-height:1px; font-size:1px; overflow:hidden; margin:0 2px; background:silver; padding:0; } ';
			$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
			$.vakata.context.cnt
				.delegate("a","click", function (e) { e.preventDefault(); })
				.delegate("a","mouseup", function (e) {
					if(!$(this).parent().hasClass("jstree-contextmenu-disabled") && $.vakata.context.exec($(this).attr("rel"))) {
						$.vakata.context.hide();
					}
					else { $(this).blur(); }
				})
				.delegate("a","mouseover", function () {
					$.vakata.context.cnt.find(".vakata-hover").removeClass("vakata-hover");
				})
				.appendTo("body");
			$(document).bind("mousedown", function (e) { if($.vakata.context.vis && !$.contains($.vakata.context.cnt[0], e.target)) { $.vakata.context.hide(); } });
			if(typeof $.hotkeys !== "undefined") {
				$(document)
					.bind("keydown", "up", function (e) { 
						if($.vakata.context.vis) { 
							var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").prevAll("li:not(.vakata-separator)").first();
							if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").last(); }
							o.addClass("vakata-hover");
							e.stopImmediatePropagation(); 
							e.preventDefault();
						} 
					})
					.bind("keydown", "down", function (e) { 
						if($.vakata.context.vis) { 
							var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").nextAll("li:not(.vakata-separator)").first();
							if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").first(); }
							o.addClass("vakata-hover");
							e.stopImmediatePropagation(); 
							e.preventDefault();
						} 
					})
					.bind("keydown", "right", function (e) { 
						if($.vakata.context.vis) { 
							$.vakata.context.cnt.find(".vakata-hover").children("ul").show().children("li:not(.vakata-separator)").removeClass("vakata-hover").first().addClass("vakata-hover");
							e.stopImmediatePropagation(); 
							e.preventDefault();
						} 
					})
					.bind("keydown", "left", function (e) { 
						if($.vakata.context.vis) { 
							$.vakata.context.cnt.find(".vakata-hover").children("ul").hide().children(".vakata-separator").removeClass("vakata-hover");
							e.stopImmediatePropagation(); 
							e.preventDefault();
						} 
					})
					.bind("keydown", "esc", function (e) { 
						$.vakata.context.hide(); 
						e.preventDefault();
					})
					.bind("keydown", "space", function (e) { 
						$.vakata.context.cnt.find(".vakata-hover").last().children("a").click();
						e.preventDefault();
					});
			}
			*/
		},
		defaults : { 
			select_node : false, // requires UI plugin
			show_at_node : true,
			items : { // Could be a function that should return an object like this one
				"create" : {
					"separator_before"	: false,
					"separator_after"	: true,
					"label"				: "Create",
					"action"			: function (obj) { this.create(obj); }
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"label"				: "Rename",
					"action"			: function (obj) { this.rename(obj); }
				},
				"remove" : {
					"separator_before"	: false,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Delete",
					"action"			: function (obj) { if(this.is_selected(obj)) { this.remove(); } else { this.remove(obj); } }
				},
				"ccp" : {
					"separator_before"	: true,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Edit",
					"action"			: false,
					"submenu" : { 
						"cut" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "Cut",
							"action"			: function (obj) { this.cut(obj); }
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Copy",
							"action"			: function (obj) { this.copy(obj); }
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Paste",
							"action"			: function (obj) { this.paste(obj); }
						}
					}
				}
			}
		},
		_fn : {
			show_contextmenu : function (obj, x, y) {
				obj = this._get_node(obj);
				var s = this.get_settings().contextmenu,
					a = obj.children("a:visible:eq(0)"),
					o = false,
					i = false;
				if(s.select_node && this.data.ui && !this.is_selected(obj)) {
					this.deselect_all();
					this.select_node(obj, true);
				}
				if(s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
					o = a.offset();
					x = o.left;
					y = o.top + this.data.core.li_height;
				}
				i = obj.data("jstree") && obj.data("jstree").contextmenu ? obj.data("jstree").contextmenu : s.items;
				if($.isFunction(i)) { i = i.call(this, obj); }
				this.data.contextmenu = true;
				$.vakata.context.show(i, a, x, y, this, obj, this._get_settings().core.rtl);
				if(this.data.themes) { $.vakata.context.cnt.attr("class", "jstree-" + this.data.themes.theme + "-context"); }
			}
		}
	});
})(jQuery);

/* 
 * Include the json_data data plugin by default
 */
(function ($) {
	// include the json_data data plugin by default
	$.jstree.defaults.plugins.push("json_data");
})(jQuery);

/*
 * Infor Tooltips - Based on jQuery UI Tooltip 1.9m2
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tooltip
*/
(function($) {

// role=application on body required for screenreaders to correctly interpret aria attributes
if( !$(document.body).is('[role]') ){
	$(document.body).attr('role','application');
} 

$.widget("ui.inforToolTip", {
	options: {
		tooltipClass: "inforTooltip",
		content: function() {
			return $(this).attr("title");
		},
		position: {
			my: "left top",
			at: "bottom",
			offset: "12 12",
			collision: "fit flip"
		},
		maxWidth: null,
		isErrorTooltip: false
	},
	isRTL: false,
	_init: function() {
		var self = this;
			
		var tooltipText = this.element.attr("title");
		if (tooltipText==undefined)
			return;
			
		//try to translate the tooltip
		var translatedTip = Globalize.localize(tooltipText);
		if (translatedTip!=undefined)
			tooltipText= translatedTip;
		
		if (!this.element.hasClass("inforErrorIcon")) {
			this.element.attr("title",tooltipText);
			return;	//use browser level tooltips and ignore this.
		}
		
		//save the tooltip
		this.element.data("currentTitle",tooltipText);
		this.element.attr("title","");
					
		this.tooltip = $("#inforTooltip");
		this.tooltipContent = this.tooltip.find("div");
		
		if (this.tooltip.length==0)	{ //add it once to the dom.
			this.tooltip = $("<div></div>")
				.attr("id", "inforTooltip")	
				.attr("role", "tooltip")
				.attr("aria-hidden", "true")
				.addClass(this.options.tooltipClass)
				.appendTo(document.body)
				.hide();
				
			this.tooltipContent = $("<div></div>").appendTo(this.tooltip);
		}
		
		this.isRTL = this.tooltip.css("direction")=="rtl";
		
		//handle Behavior from http://wiki.infor.com:8080/confluence/display/COMMONUI/Field+In+Error+Notification
		if (this.element.hasClass("inforErrorIcon")) {
			this.tooltip.addClass("inforErrorTooltip")
			this.options.position = {
				my: ( this.isRTL ? "left top" : "right top") ,
				at: "bottom",
				offset: ( this.isRTL ? "4 2" : "-4 2" )
			};
			this.options.isErrorTooltip = true;
		}
		
		this.opacity = this.tooltip.css("opacity");
		if (!this.options.isErrorTooltip || (this.options.isErrorTooltip &&  this.element.parent().hasClass("status-indicator"))) {
			this.element
				.hoverIntent(function (event) {
					self.open( event );
				}, function (event) {
					self.close( event );
				});
		} else {
			this.element
				.bind("click.tooltip", function(event) {	
					event.stopPropagation();
					
					target = $(event.currentTarget);
					self._show(event, target, target.data("currentTitle"));
					this.current = target;
					
					$(document).bind("click.documentclick",function() {
						self.tooltip.stop().fadeOut();
						$(document).unbind("click.documentclick");
					});
				});
		}
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	
	disable: function() {
		this.options.disabled = true;
	},
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
	},
	
	destroy: function() {
		$.Widget.prototype.destroy.apply(this, arguments);
	},
	
	widget: function() {
		return this.tooltip;
	},
	
	open: function(event) {
		//close any other tooltips that might exist and be open..
		this._hideAll();
		
		var target = this.element;
		// already visible? possible when both focus and mouseover events occur
		if (this.current && this.current[0] == target[0])
			return;
			
		var self = this;
		this.current = target;
		this.currentTitle = target.attr("title");
		
		var content = this.options.content.call(target[0], function(response) {
			// ignore async responses that come in after the tooltip is already hidden
			if (self.current == target)
				self._show(event, target, response);
		});
		
		if (!content)	//use the data for error tooltips.
			content = target.data("currentTitle");
			
		if (content) {
			self._show(event, target, content);
		}
	},
	_hideAll: function() {
		$(".inforTooltip':visible").each(function() {
			var $this = $(this);
			$this.stop().fadeTo("normal", 0, function() {
				$(this).hide().css("opacity", "");
			});
		});
	},
	_show: function(event, target, content) {
		this._hideAll();
		
		if (!content)
			return;
		
		target.attr("title", "");
		
		//position relative to the mouse
		if (this.options.disabled)
			return;
			
		this.tooltipContent.html(content);
		
		if (this.options.isErrorTooltip)
			this.tooltip.addClass("inforErrorTooltip")
		else
			this.tooltip.removeClass("inforErrorTooltip")
		
		if (this.options.maxWidth)
			this.tooltip.css("max-width",this.options.maxWidth);
		
		if (this.element.next().hasClass("inforCheckbox"))	//flow to other side
			this.options.position.my = ( !this.isRTL ? "left top" : "right top");
			
		this.tooltip.css({
			top: 0,
			left: 0
		}).show().position($.extend(this.options.position, {
			of: (this.options.isErrorTooltip ? target : event)	//event for mouse - target for button
		})).hide();
		
		this.tooltip.attr("aria-hidden", "false");
		target.attr("aria-describedby", this.tooltip.attr("id"));
		
		if (this.tooltip.css("left").replace("px","")<0)	
			this.tooltip.css("left", 0);
			
		if (this.tooltip.is(":animated"))
			this.tooltip.stop().show().fadeTo("normal", this.opacity);
		else
			this.tooltip.is(':visible') ? this.tooltip.fadeTo("normal", this.opacity) : this.tooltip.delay(300).fadeIn();

		this._trigger( "open", event );
	},
	close: function(event) {
		if (!this.current)
			return;
		
		var current = this.current.attr("title", this.currentTitle);
		this.current = null;
		if (current==undefined)
			return;
			
		if (this.options.disabled)
			return;
		
		current.removeAttr("aria-describedby");
		this.tooltip.attr("aria-hidden", "true");
		
			if (this.tooltip.is(':animated'))
				this.tooltip.stop().fadeTo("normal", 0, function() {
					$(this).hide().css("opacity", "");
				});
			else
				this.tooltip.stop().fadeOut();
		
		this._trigger( "close", event );
	}
});

})(jQuery);
/*
 * Infor Toggle Button - A Button set for several related text button options
 */
(function ($) {
	$.widget( "ui.inforToggleButton", {
		_create: function() {
			this._init();
		},
		_init: function() {
			this.refresh();
		},
		refresh: function() {
			//move the buttons together and style them...
			var self = this.element;
			
			var buttons = self.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").not(".inforTextButton")
				.addClass("inforTextButton")
				.inforTextButton()
				.click(function() {
					buttons.removeClass("checked");
					$(this).addClass("checked");
				});
			
			this.buttons = buttons;
			
			//remove the middles and add a seperator
			
			if (!Globalize.culture().isRTL)	{
				self.find(".inforTextButton .leftSlice").not(":first").remove();
				self.find(".inforTextButton .rightSlice").not(":last").removeClass("rightSlice").addClass("divider");
				self.find(".inforTextButton .centerSlice").filter(":first").css("padding-left","0px");
				self.find(".inforTextButton .centerSlice").filter(":last").css("padding-right","0px");
			} else {
				self.find(".inforTextButton .leftSlice").not(":last").remove();
				self.find(".inforTextButton .rightSlice").not(":first").removeClass("rightSlice").addClass("divider");
				self.find(".inforTextButton .centerSlice").filter(":last").css("padding-left","0px");
				self.find(".inforTextButton .centerSlice").filter(":first").css("padding-right","0px");
			}
			
			$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
			if ($.browser.safari) {
				self.find(".inforTextButton").css("margin-left","-4px");
				self.css("margin-top","-1px");
			}
		}
	});
} (jQuery));
/*
 * Infor Text Button - A text button For Lighter Modules (Non/WebParts)
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $("inforTextButtonId").inforTextButton();
 * Deps: 
 *	inforFieldStates.js 
 *
 * Date: 8/16/2011
 */
(function($){
	$.fn.inforTextButton = function( options ) {
		return this.each(function() {
			$textButton = $(this);
			var buttonText = $textButton.html();
			var isDisabled = (($textButton.attr("disabled")!=undefined && $textButton.attr("disabled")!='') || $textButton.hasClass("disabled"));
			
			if (!$textButton.find('.leftSlice').hasClass('leftSlice'))
			{	//prevent re-wrapping on multiple calls.
				$textButton.empty();
				
				var leftSlice = $("<span class=\"leftSlice\" />");
				var centerSlice = $("<span class=\"centerSlice\" />");
				var rightSlice = $("<span class=\"rightSlice\" />");
														
				centerSlice.html(buttonText);
				$textButton.append(leftSlice, centerSlice, rightSlice);

				if (isDisabled)
					$textButton.disable();
			}
			
			//hack for non-detection of crome.
			$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
			
			//style fix for WebKit
			if ($.browser.safari) {
				if (isDisabled)
				{
					$textButton.parent().height("20px");
					//$textButton.parent().css("margin-top","1px");
					$textButton.parent().css("margin-bottom","1px");
				}
				else
				{
					if (!$(this).parent().hasClass("alignRight"))
						$textButton.height("22px");
					
					if ($(this).parent().hasClass("inforToolbar"))
						$(this).addClass('safariAdjust');
				}
			}
		});
	};
	
}(jQuery));


/*
 * jQuery UI Tabs 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 */
(function( $, undefined ) {

var tabId = 0,
	listId = 0;

function getNextTabId() {
	return ++tabId;
}

function getNextListId() {
	return ++listId;
}

$.widget( "ui.tabs", {
	options: {
		add: null,
		ajaxOptions: null,
		cache: false,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		collapsible: false,
		disable: null,
		disabled: [],
		enable: null,
		event: "click",
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		idPrefix: "ui-tabs-",
		load: null,
		panelTemplate: "<div></div>",
		remove: null,
		select: null,
		show: null,
		spinner: "<em>Loading&#8230;</em>",
		tabTemplate: "<li><a href='#{href}'>#{label}</a></li>"
	},
	
	_create: function() {
		this._tabify( true );
	},

	_setOption: function( key, value ) {
		if ( key == "selected" ) {
			if (this.options.collapsible && value == this.options.selected ) {
				return;
			}
			this.select( value );
		} else {
			this.options[ key ] = value;
			this._tabify();
		}
	},

	_tabId: function( a ) {
		return a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF-]/g, "" ) ||
			this.options.idPrefix + getNextTabId();
	},

	_sanitizeSelector: function( hash ) {
		// we need this because an id may contain a ":"
		return hash.replace( /:/g, "\\:" );
	},

	_cookie: function() {
		var cookie = this.cookie ||
			( this.cookie = this.options.cookie.name || "ui-tabs-" + getNextListId() );
		return $.cookie.apply( null, [ cookie ].concat( $.makeArray( arguments ) ) );
	},

	_ui: function( tab, panel ) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index( tab )
		};
	},

	_cleanup: function() {
		// restore all former loading tabs labels
		this.lis.filter( ".ui-state-processing" )
			.removeClass( "ui-state-processing" )
			.find( "span:data(label.tabs)" )
				.each(function() {
					var el = $( this );
					el.html( el.data( "label.tabs" ) ).removeData( "label.tabs" );
				});
	},

	_tabify: function( init ) {
		var self = this,
			o = this.options,
			fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

		this.list = this.element.find( "ol,ul" ).eq( 0 );
		this.lis = $( " > li:has(a[href])", this.list );
		
		this.anchors = this.lis.map(function() {
			return $( "a", this )[ 0 ];
		});
		this.panels = $( [] );

		this.anchors.each(function( i, a ) {
			var href = $( a ).attr( "href" );
			// For dynamically created HTML that contains a hash as href IE < 8 expands
			// such href to the full page url with hash and then misinterprets tab as ajax.
			// Same consideration applies for an added tab with a fragment identifier
			// since a[href=#fragment-identifier] does unexpectedly not match.
			// Thus normalize href attribute...
			var hrefBase = href.split( "#" )[ 0 ],
				baseEl;
			if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
					( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
				href = a.hash;
				a.href = href;
			}

			// inline tab
			if ( fragmentId.test( href ) ) {
				self.panels = self.panels.add( self.element.find( self._sanitizeSelector( href ) ) );
			// remote tab
			// prevent loading the page itself if href is just "#"
			} else if ( href && href !== "#" ) {
				// required for restore on destroy
				$.data( a, "href.tabs", href );

				// TODO until #3808 is fixed strip fragment identifier from url
				// (IE fails to load from such url)
				$.data( a, "load.tabs", href.replace( /#.*$/, "" ) );

				var id = self._tabId( a );
				a.href = "#" + id;
				var $panel = self.element.find( "#" + id );
				if ( !$panel.length ) {
					$panel = $( o.panelTemplate )
						.attr( "id", id )
						.addClass( "ui-tabs-panel ui-corner-bottom" )
						.insertAfter( self.panels[ i - 1 ] || self.list );
					$panel.data( "destroy.tabs", true );
				}
				self.panels = self.panels.add( $panel );
			// invalid tab href
			} else {
				o.disabled.push( i );
			}
		});

		// initialization from scratch
		if ( init ) {
			// attach necessary classes for styling
			this.element.addClass( "ui-tabs" );
			this.panels.addClass( "ui-tabs-panel" );

			// Selected tab
			// use "selected" option or try to retrieve:
			// 1. from fragment identifier in url
			// 2. from cookie
			// 3. from selected class attribute on <li>
			if ( o.selected === undefined ) {
				if ( location.hash ) {
					this.anchors.each(function( i, a ) {
						if ( a.hash == location.hash ) {
							o.selected = i;
							return false;
						}
					});
				}
				if ( typeof o.selected !== "number" && o.cookie ) {
					o.selected = parseInt( self._cookie(), 10 );
				}
				if ( typeof o.selected !== "number" && this.lis.filter( ".ui-tabs-selected" ).length ) {
					o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
				}
				o.selected = o.selected || ( this.lis.length ? 0 : -1 );
			} else if ( o.selected === null ) { 
				o.selected = -1;
			}

			// sanity check - default to first tab...
			o.selected = ( ( o.selected >= 0 && this.anchors[ o.selected ] ) || o.selected < 0 )
				? o.selected
				: 0;

			// Take disabling tabs via class attribute from HTML
			// into account and update option properly.
			// A selected tab cannot become disabled.
			o.disabled = $.unique( o.disabled.concat(
				$.map( this.lis.filter( ".ui-state-disabled" ), function( n, i ) {
					return self.lis.index( n );
				})
			) ).sort();

			if ( $.inArray( o.selected, o.disabled ) != -1 ) {
				o.disabled.splice( $.inArray( o.selected, o.disabled ), 1 );
			}

			// highlight selected tab
			this.panels.addClass( "ui-tabs-hide" );
			this.lis.removeClass( "ui-tabs-selected ui-state-active" );
			// check for length avoids error when initializing empty list
			if ( o.selected >= 0 && this.anchors.length ) {
				self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) ).removeClass( "ui-tabs-hide" );
				this.lis.eq( o.selected ).addClass( "ui-tabs-selected ui-state-active" );

				// seems to be expected behavior that the show callback is fired
				self.element.queue( "tabs", function() {
					self._trigger( "show", null,
						self._ui( self.anchors[ o.selected ], self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) )[ 0 ] ) );
				});

				this.load( o.selected );
			}
			// update selected after add/remove
		} else {
			o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
		}

		// update collapsible
		// TODO: use .toggleClass()
		this.element[ o.collapsible ? "addClass" : "removeClass" ]( "ui-tabs-collapsible" );

		// set or update cookie after init and add/remove respectively
		if ( o.cookie ) {
			this._cookie( o.selected, o.cookie );
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.lis[ i ] ); i++ ) {
			$( li )[ $.inArray( i, o.disabled ) != -1 &&
				// TODO: use .toggleClass()
				!$( li ).hasClass( "ui-tabs-selected" ) ? "addClass" : "removeClass" ]( "ui-state-disabled" );
		}

		// reset cache if switching from cached to not cached
		if ( o.cache === false ) {
			this.anchors.removeData( "cache.tabs" );
		}

		// remove all handlers before, tabify may run on existing tabs after add or option change
		this.lis.add( this.anchors ).unbind( ".tabs" );

		if ( o.event !== "mouseover" ) {
			var addState = function( state, el ) {
				if ( el.is( ":not(.ui-state-disabled)" ) ) {
					el.addClass( "ui-state-" + state );
				}
			};
			var removeState = function( state, el ) {
				el.removeClass( "ui-state-" + state );
			};
			this.lis.bind( "mouseover.tabs" , function() {
				addState( "hover", $( this ) );
			});
			this.lis.bind( "mouseout.tabs", function() {
				removeState( "hover", $( this ) );
			});
			this.anchors.bind( "focus.tabs", function() {
				addState( "focus", $( this ).closest( "li" ) );
			});
			this.anchors.bind( "blur.tabs", function() {
				removeState( "focus", $( this ).closest( "li" ) );
			});
		}

		// set up animations
		var hideFx, showFx;
		if ( o.fx ) {
			if ( $.isArray( o.fx ) ) {
				hideFx = o.fx[ 0 ];
				showFx = o.fx[ 1 ];
			} else {
				hideFx = showFx = o.fx;
			}
		}

		// Reset certain styles left over from animation
		// and prevent IE's ClearType bug...
		function resetStyle( $el, fx ) {
			$el.css( "display", "" );
			if ( !$.support.opacity && fx.opacity ) {
				$el[ 0 ].style.removeAttribute( "filter" );
			}
		}

		// Show a tab...
		var showTab = showFx
			? function( clicked, $show ) {
				$( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
				$show.hide().removeClass( "ui-tabs-hide" ) // avoid flicker that way
					.animate( showFx, showFx.duration || "normal", function() {
						resetStyle( $show, showFx );
						self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
						});
			}
			: function( clicked, $show ) {
				$( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
				$show.removeClass( "ui-tabs-hide" );
				self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
			};

		// Hide a tab, $show is optional...
		var hideTab = hideFx
			? function( clicked, $hide ) {
				$hide.animate( hideFx, hideFx.duration || "normal", function() {
					self.lis.removeClass( "ui-tabs-selected ui-state-active" );
					$hide.addClass( "ui-tabs-hide" );
					resetStyle( $hide, hideFx );
					self.element.dequeue( "tabs" );
				});
			}
			: function( clicked, $hide, $show ) {
				self.lis.removeClass( "ui-tabs-selected ui-state-active" );
				$hide.addClass( "ui-tabs-hide" );
				self.element.dequeue( "tabs" );
			};

		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.anchors.bind( o.event + ".tabs", function() {
			var el = this,
				$li = $(el).closest( "li" ),
				$hide = self.panels.filter( ":not(.ui-tabs-hide)" ),
				$show = self.element.find( self._sanitizeSelector( el.hash ) );

			// If tab is already selected and not collapsible or tab disabled or
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			if ( ( $li.hasClass( "ui-tabs-selected" ) && !o.collapsible) ||
				$li.hasClass( "ui-state-disabled" ) ||
				$li.hasClass( "ui-state-processing" ) ||
				self.panels.filter( ":animated" ).length ||
				self._trigger( "select", null, self._ui( this, $show[ 0 ] ) ) === false ) {
				this.blur();
				return false;
			}

			o.selected = self.anchors.index( this );

			self.abort();

			// if tab may be closed
			if ( o.collapsible ) {
				if ( $li.hasClass( "ui-tabs-selected" ) ) {
					o.selected = -1;

					if ( o.cookie ) {
						self._cookie( o.selected, o.cookie );
					}

					self.element.queue( "tabs", function() {
						hideTab( el, $hide );
					}).dequeue( "tabs" );

					this.blur();
					return false;
				} else if ( !$hide.length ) {
					if ( o.cookie ) {
						self._cookie( o.selected, o.cookie );
					}

					self.element.queue( "tabs", function() {
						showTab( el, $show );
					});

					// TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
					self.load( self.anchors.index( this ) );

					this.blur();
					return false;
				}
			}

			if ( o.cookie ) {
				self._cookie( o.selected, o.cookie );
			}

			// show new tab
			if ( $show.length ) {
				if ( $hide.length ) {
					self.element.queue( "tabs", function() {
						hideTab( el, $hide );
					});
				}
				self.element.queue( "tabs", function() {
					showTab( el, $show );
				});

				self.load( self.anchors.index( this ) );
			} else {
				throw "Tabs: Mismatching fragment identifier.";
			}

			// Prevent IE from keeping other link focussed when using the back button
			// and remove dotted border from clicked link. This is controlled via CSS
			// in modern browsers; blur() removes focus from address bar in Firefox
			// which can become a usability and annoying problem with tabs('rotate').
			if ( $.browser.msie ) {
				this.blur();
			}
		});

		// disable click in any case
		this.anchors.bind( "click.tabs", function(){
			return false;
		});
	},
    _getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		// also sanitizes numerical indexes to valid values.
		if ( typeof index == "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$=" + index + "]" ) );
		}

		return index;
	},
	getIndex:function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		// also sanitizes numerical indexes to valid values.
		if ( typeof index == "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$=" + index + "]" ) );
		}

		return index;
	},
	destroy: function() {
		var o = this.options;

		this.abort();

		this.element
			.unbind( ".tabs" )
			.removeClass( "ui-tabs ui-corner-all ui-tabs-collapsible" )
			.removeData( "tabs" );

		this.list.removeClass( "ui-helper-reset ui-helper-clearfix ui-corner-all" );

		this.anchors.each(function() {
			var href = $.data( this, "href.tabs" );
			if ( href ) {
				this.href = href;
			}
			var $this = $( this ).unbind( ".tabs" );
			$.each( [ "href", "load", "cache" ], function( i, prefix ) {
				$this.removeData( prefix + ".tabs" );
			});
		});

		this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
			if ( $.data( this, "destroy.tabs" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeClass([
					"ui-tabs-selected",
					"ui-state-active",
					"ui-state-hover",
					"ui-state-focus",
					"ui-state-disabled",
					"ui-tabs-panel",
					"ui-corner-bottom",
					"ui-tabs-hide"
				].join( " " ) );
			}
		});

		if ( o.cookie ) {
			this._cookie( null, o.cookie );
		}

		return this;
	},

	add: function( url, label, index ) {
		if ( index === undefined ) {
			index = this.anchors.length;
		}

		var self = this,
			o = this.options,
			$li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
			id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );

		$li.data( "destroy.tabs", true );

		// try to find an existing element before creating a new one
		var $panel = self.element.find( "#" + id );
		if ( !$panel.length ) {
			$panel = $( o.panelTemplate )
				.attr( "id", id )
				.data( "destroy.tabs", true );
		}
		$panel.addClass( "ui-tabs-panel ui-tabs-hide" );

		if ( index >= this.lis.length ) {
			$li.appendTo( this.list );
			$panel.appendTo( this.list[ 0 ].parentNode );
		} else {
			$li.insertBefore( this.lis[ index ] );
			$panel.insertBefore( this.panels[ index ] );
		}

		o.disabled = $.map( o.disabled, function( n, i ) {
			return n >= index ? ++n : n;
		});

		this._tabify();

		if ( this.anchors.length == 1 ) {
			o.selected = 0;
			$li.addClass( "ui-tabs-selected ui-state-active" );
			$panel.removeClass( "ui-tabs-hide" );
			this.element.queue( "tabs", function() {
				self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
			});

			this.load( 0 );
		}

		this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		return this;
	},

	remove: function( index ) {
		index = this._getIndex( index );
		var o = this.options,
			$li = this.lis.eq( index ).remove(),
			$panel = this.panels.eq( index ).remove();

		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ( $li.hasClass( "ui-tabs-selected" ) && this.anchors.length > 1) {
			this.select( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
		}

		o.disabled = $.map(
			$.grep( o.disabled, function(n, i) {
				return n != index;
			}),
			function( n, i ) {
				return n >= index ? --n : n;
			});

		this._tabify();

		this._trigger( "remove", null, this._ui( $li.find( "a" )[ 0 ], $panel[ 0 ] ) );
		return this;
	},

	enable: function( index ) {
		index = this._getIndex( index );
		var o = this.options;
		if ( $.inArray( index, o.disabled ) == -1 ) {
			return;
		}

		this.lis.eq( index ).removeClass( "ui-state-disabled" );
		o.disabled = $.grep( o.disabled, function( n, i ) {
			return n != index;
		});

		this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		return this;
	},

	disable: function( index ) {
		index = this._getIndex( index );
		var o = this.options;
		// cannot disable already selected tab
		if ( index != o.selected ) {
			this.lis.eq( index ).addClass( "ui-state-disabled" );

			o.disabled.push( index );
			o.disabled.sort();

			this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		}

		return this;
	},

	select: function( index ) {
		index = this._getIndex( index );
		if ( index == -1 ) {
			if ( this.options.collapsible && this.options.selected != -1 ) {
				index = this.options.selected;
			} else {
				return this;
			}
		}
		this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
		return this;
	},

	load: function( index ) {
		index = this._getIndex( index );
		var self = this,
			o = this.options,
			a = this.anchors.eq( index )[ 0 ],
			url = $.data( a, "load.tabs" );

		this.abort();

		// not remote or from cache
		if ( !url || this.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
			this.element.dequeue( "tabs" );
			return;
		}

		// load remote from here on
		this.lis.eq( index ).addClass( "ui-state-processing" );

		if ( o.spinner ) {
			var span = $( "span", a );
			span.data( "label.tabs", span.html() ).html( o.spinner );
		}

		this.xhr = $.ajax( $.extend( {}, o.ajaxOptions, {
			url: url,
			success: function( r, s ) {
				self.element.find( self._sanitizeSelector( a.hash ) ).html( r );

				// take care of tab labels
				self._cleanup();

				if ( o.cache ) {
					$.data( a, "cache.tabs", true );
				}

				self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
				try {
					o.ajaxOptions.success( r, s );
				}
				catch ( e ) {}
			},
			error: function( xhr, s, e ) {
				// take care of tab labels
				self._cleanup();

				self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
				try {
					// Passing index avoid a race condition when this method is
					// called after the user has selected another tab.
					// Pass the anchor that initiated this request allows
					// loadError to manipulate the tab content panel via $(a.hash)
					o.ajaxOptions.error( xhr, s, index, a );
				}
				catch ( e ) {}
			}
		} ) );

		// last, so that load event is fired before show...
		self.element.dequeue( "tabs" );

		return this;
	},

	abort: function() {
		// stop possibly running animations
		this.element.queue( [] );
		this.panels.stop( false, true );

		// "tabs" queue must not contain more than two elements,
		// which are the callbacks for the latest clicked tab...
		this.element.queue( "tabs", this.element.queue( "tabs" ).splice( -2, 2 ) );

		// terminate pending requests from other tabs
		if ( this.xhr ) {
			this.xhr.abort();
			delete this.xhr;
		}

		// take care of tab labels
		this._cleanup();
		return this;
	},

	url: function( index, url ) {
		this.anchors.eq( index ).removeData( "cache.tabs" ).data( "load.tabs", url );
		return this;
	},

	length: function() {
		return this.anchors.length;
	}
});

})( jQuery );

/*
 * Infor Tabset Control
 */
(function($){
	$.widget("ui.inforTabset", {
		options: {
			editable: false, //Will allow you to double click in the headers to edit
			closable: false,	//Will allow you to close headers
			draggable: false,	//Will allow you to drag headers to sort
			addButton: false,
			chevron: true,
			rename: null,
			add: null,
			close: null,
			sort: null,
			fillToBottom: true, //if true the control will stretch to the bottom of the page in height automatically.
			toolTips: {addButton: null, closeButton: null, chevronButton: null},
			moduleTabs: false	//special styled tabs for application level
		},
		_init: function() {
			var o = this.options, 
				$tabs = $(this.element),
				self = this;
			
			//localize tooltips
			if (o.toolTips.addButton==null)
				o.toolTips.addButton=Globalize.localize("CreateTab");
			
			if (o.toolTips.closeButton==null)
				o.toolTips.closeButton=Globalize.localize("CloseTab");
				
			if (o.toolTips.chevronButton==null)
				o.toolTips.chevronButton=Globalize.localize("ListTabs");
				
			//Add close buttons if required
			if (o.closable) 
				this._addCloseButton($tabs, o);
			
			if (o.editable)
				this._addEditors($tabs,null, false, o);
			
			if (o.addButton)
				this._addAddButton($tabs,o);
			
			$tabs.tabs();	
		
			if ($(this.element).hasClass("inforModuleTabs"))
				this.options.moduleTabs =true;
			
			this._addButtons($tabs, o);
			this._addTabSlices($tabs, o);
		
			//hide any visibile tooltips..
			$tabs.bind('tabsselect', function(event, ui) {
				$("#inforTooltip").hide();
				if (o.editable)
					$("input.inforTabHeaderEditor").trigger("blur");
			});
			
			//Make the Tabs Sortable
			if (o.draggable) {
				$tabs.find(".inforTabset").sortable({
					axis: "x",
					//We can ignore drag on some stuff with
					//items: 'li[id!=dropdownli]',
					stop: function (e, ui) {
						ui.item.css({"position":"" , "left" : "", "top" : "" });
						//post action to save tab index
						if (o.sort)
							o.sort(this, ui, o);
					}
				});
			}
			
			//setup scrolling on the tab control itself.
			if (o.fillToBottom) {
				$tabs.addClass("inforScrollableArea");
				$tabs.inforScrollableArea();
			} else {
				var contH = $tabs.height();
				$tabs.find(".ui-tabs-panel").height(contH-22);
			}
			
			//set autowidth
			$tabs.tabs({show: function (e, ui, newTab) {
				$('.autoLabelWidth').find('.inforLabel').autoWidth();
				self._scrollTabIntoView($tabs, $tabs.find("ul.inforTabset:first"));
			}});
		},
		_addTabSlices: function($tabs, o) {
			if (this.options.moduleTabs) {
				var list = $tabs.find('ol,ul').eq(0),
					lis = $('li:has(a[href])', list);
			
				lis.each(function(){
					var $thisLi = $(this);
					if ($thisLi.find(".leftSlice").length==0) {
						$thisLi.prepend("<span class='leftSlice'></span>");
						$thisLi.append("<span class='rightSlice'></span>");
					}
				});
			}
		},
		_setOption: function( key, value ) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		_addAddButton: function($tabs,o) {
			if (!o.addButton) 
				return;
			
			var $button = $("<button type='button' class=\'inforAddTabButton\' title='"+o.toolTips.addButton+"'><span class='rightSlice'></span></button>");
			//
			$tabs.find('.inforTabset')
				  .append($button);
			
			$('.inforAddTabButton').click(function(){
				//Adding a new tab...
				var newId = "#tab" + $tabs.tabs().children().size();
				$tabs.inforTabset("add", newId, "New Tab", true);
		   });
		},
		_adjustAddNewButton: function($tabs, o) {
			if (!o.addButton) 
				return;
			//moves this html so its always at the end
			var addTab = $tabs.find(".inforAddTabButton");
			addTab.remove();
			
			this._addAddButton($tabs,o);
		},
		_addEditors: function($tabs, ui, isNew, o) {
			var list = $tabs.find('ol,ul').eq(0);
			var lis = $('li:has(a[href])', list);
			var last = null;
			
			lis.each(function(){
				var $thisA = $(this).find('a');
				last = $thisA;
			
				//replaces jeditable plugin in much less lines.
				$thisA.dblclick(function() {
					//add a text box to this elem
					var width = $thisA.width();
					var	$input = $('<input class="inforTextbox inforTabHeaderEditor">').val($thisA.text()).width(width);
					$thisA.css("opacity","0").after($input);
					$input.css({"position":"absolute" ,"font-weight":"bold"});
					
					//Focus and add events
					$input.focus().select().blur(function() {
						var value = $input.val();
						$thisA.css("opacity","").text(value);
						// execute callback
						if (!isNew && o.rename) 
							o.rename(this, value, o);
						
						if (isNew && o.add ) 
							o.add(this, $input ,value, o);
						
						$input.remove()
					});
				});
			 });
			 
			if (isNew)
				last.trigger('dblclick');
		},
		_addMenuToPage: function($tabs, o) {
			var list = $tabs.find('ol,ul').eq(0),
				lis = $('li:has(a[href])', list);
			
			$("#inforTabChevronMenuOptionsContainer").remove();
			
			var html = "<ul id='inforTabChevronMenuOptions' class='inforContextMenu'>";
				var i = 0;
			
			lis.each(function(){
				var $thisA = $(this).find('a');
				if (!$thisA.parent().hasClass("inforHiddenTab")) {
					var text = $thisA.html();
					if ($thisA.data("text"))
						 text = $thisA.data("text");
						 
					var tabHtml  = "<li class='"+i+"'><a href='#"+i+"'>"+text+"</a></li>"
					html = html+tabHtml;
				}
				i++;
		    });
			
			$tabs.after(html+"</ul>");
		},
		closeTab: function(tabLi) {
			//Remove tab using UI method
			var tabIndex = tabLi.children('a').attr('href');
				$tabs = $(this.element),
				o = this.options;

			tabLi.fadeOut(250, function() {
				$tabs.tabs( "remove", tabIndex );
			});
		
			if (o.close)
				o.close($tabs, tabIndex, o);
			
			this._refreshScroll($tabs);
		},
		_addCloseButton: function($tabs, o) {
			var list = $tabs.find('ol,ul').eq(0),
				lis = $('li:has(a[href])', list).not(".notClosable"),
				self = this;
			
			lis.each(function(){
				var $thisLi = $(this);
				if ($thisLi.find(".inforTabCloseButton").length==0) {
					$thisLi.append(
							$('<span/>')
								.addClass('inforTabCloseButton')
								.attr('title',o.toolTips.closeButton)
								.click(function(e){
									self.closeTab($(this).parent());
								})
						);
					
					var menu = $("#tabsCloseMenu");
					if (menu.length==0)
						menu = $('<ul id="tabsCloseMenu" class="inforContextMenu"><li><a href="#close">'+Globalize.localize("CloseTab")+'</a></li><li><a href="#closeOthers">'+Globalize.localize("CloseOtherTabs")+'</a></li></ul>').appendTo("body");
					
					//add right click menu.
					$thisLi.inforContextMenu({
						menu: 'tabsCloseMenu'
					},
					function(action, el, pos) {
						if (action=="close")
							self.closeTab(el);
							
						if (action=="closeOthers") {
							lis.not(el).each(function(e) {
								self.closeTab($(this));
							});
						}
					}); 
				}
				//If width not assigned, the hidden tabs width cannot be calculated properly in _adjustLeftPosition
			});
		},
		remove: function(tabId) {
			var $tabs = $(this.element);
			if ((typeof tabId)=="string")	//lookup the tab id...
			{
				var anchors = $tabs.tabs().data().tabs.anchors;
				index = anchors.index( anchors.filter( "[href$=" + tabId + "]" ) );
				$tabs.tabs('remove', index);
				return;
			}
			
			$tabs.tabs('remove', tabId);
			this._refreshScroll($tabs);
		},
		add: function(tabId, label, enterEditMode, callback) {
			var $tabs = $(this.element),
				o = this.options,
				id = null,
				callbackEvent = null,
				callbackUi = null;
			
			tabId = !tabId.indexOf( "#" ) ? tabId.replace(/ /g,"_").replace(/\./g,' ') : tabId;
				
			$tabs.bind("tabsadd.add", function( event, ui ) {
				id = $(ui.tab).attr("href");
				$tabs.tabs("select", id);
				callbackEvent = event;
				callbackUi = ui;
			});
			
			$tabs.tabs('add', tabId, label);
			$tabs.unbind("tabsadd.add");
			
			//Add extras.
			this._adjustAddNewButton($tabs, o);
			
			if (o.closable)
				this._addCloseButton($tabs, o);
			
			this._addTabSlices($tabs, o);
			
			if (enterEditMode && o.editable)	
				this._addEditors($tabs, this, true, o);
			
			this._refreshScroll($tabs);
			
			if (callback) //execute the callback
				callback(callbackEvent, callbackUi);
		},
		_addButtons: function ($tabs, o) {
			var prevButton = $('<button type="button" class="inforPrevButton"></button>'),
				nextButton = $('<button type="button" class="inforNextButton"></button>'),
				content = $tabs.find("ul.inforTabset:first"),
				self = this;
			
			if (!this.options.moduleTabs) {
				content.after($('<div class="inforTabButton" style="float:left" ></div>').append(prevButton));
				content.after($('<div class="inforTabButton" ></div>').append(nextButton));
			} else {
				content.after($('<div class="inforTabButton" ></div>'));
			}
			
			if (o.chevron) {
				var chevron = $('<button type="button" class="inforTabChevron" title="'+o.toolTips.chevronButton+'"></button>');
				content.next(".inforTabButton").width(32).append(chevron);
				
				chevron.mouseup(function(){self._addMenuToPage($tabs,o);})
					.on("click.tabset", function(e) {
						var $button = $(this);
						$button.inforContextMenu({
							menu: 'inforTabChevronMenuOptions',
							invokeMethod: 'immediate',
							event: e,
							srcElement: $button,
							offsetLeft: (!Globalize.culture().isRTL ? -6: 2),
							offsetTop: -1,
							positionBelowElement: true
						},
						function(action, el, pos, obj) {
							if (obj.hasClass("hiddenTab")) {
								var tabId = obj.attr("id");
								$tabs.inforTabset('add', tabId, obj.html(), false);
							}
							else {	//reopen the tab.
								$tabs.tabs('select', parseInt(action));
								$("#inforTabChevronMenuOptions").remove();
								self._scrollTabIntoView($tabs, content);
							}
						});	
					});
			}
			
			//Add Paging Functionality
			function stepPrev(animate) {
				var pos = content.position().left + 100;
				if (pos >= 0)
				{
					pos = 0;
				}
				content.animate({ left: pos }, (animate ? 100 : 50), function() {
					self._refreshEnabled($tabs, content, prevButton, nextButton);
				});
			}
			
			prevButton.click(function(){
				if (!noClick)
					stepPrev(true);
			});
			
			//long press
			var prevInterval = null, 
				nextInterval = null,
				noClick = false;
				
			prevButton.on('mousedown',function() {
				prevInterval = setInterval(function() { noClick=true; stepPrev(false); }, 300);
			}).on('mouseup mouseup mouseout',function() {
			   clearInterval(prevInterval);  
			   noClick=false;
			})
			
			function stepNext(animate) {
				var width = content.width(),
					pos = content.position().left - 100;
				if (!(width + pos > $tabs.width()))
					pos = $tabs.width()-width-22;
					
				content.animate({ left: pos }, (animate ? 100 : 50), function() {
					self._refreshEnabled($tabs, content, prevButton, nextButton);
				});
			}
			
			nextButton.click(function() {
				if (!noClick)
					stepNext(true);
			});
			
			//long press
			nextButton.on('mousedown',function() {
				nextInterval = setInterval(function() { noClick=true; stepNext(false); }, 300);
			}).on('mouseup mouseup mouseout',function() {
			   clearInterval(nextInterval);  
			   noClick=false;
			});
			
			this._refreshScroll($tabs);
			this._refreshEnabled($tabs, content, prevButton, nextButton);
			$(window).unbind("smartresize.inforTabset");
			$(window).bind("smartresize.inforTabset",function(){
				self._refreshScroll($tabs);
			});
		},
		_refreshEnabled: function($tabs, content, prevButton, nextButton) {
			//set the visibility
			var pos = parseInt(content.css("left"));
			if (pos==0)
				prevButton.trigger("mouseup").attr("disabled","disabled");
			else
				prevButton.removeAttr("disabled");
				
			var width = content.width();
			if (pos === $tabs.width()-width-22)
				nextButton.trigger("mouseup").attr("disabled","disabled");
			else
				nextButton.removeAttr("disabled");
		},
		_scrollTabIntoView: function($tabs,content) {
			//determine if its in view
			var sel = $tabs.find(".ui-tabs-selected"),
				left = $tabs.width()-content.width()-22+(sel.is(":last-child") ? 0 :sel.width()),
				toElemOffset = sel.offset().left+sel.width(),
				totalOffset = $tabs.offset().left+$tabs.width();
				
			if ( toElemOffset > totalOffset)
				content.css("left",left);
			
			if ( toElemOffset < 0 )
				content.css("left",0);
			
			if ( sel.offset().left < 0 ) {
				$tabs.find(".inforPrevButton").trigger("click");
			}
		},
		_refreshScroll : function($tabs) {
			var headerWidth = 32,
				tabsWidth = $tabs.width(),
				content = $tabs.find("ul.inforTabset:first"),
				prevButton = $tabs.find("button.inforPrevButton"),
				nextButton = $tabs.find("button.inforNextButton"),
				maxWidth = content.parent().css("max-width");
			
			//calculate tabs width
			content.find("li").each(function () {
				headerWidth += $(this).width();
			});
			
			if (headerWidth<tabsWidth) {
				prevButton.parent().hide();
				nextButton.hide().parent().width("16px");
				content.css({"width":"auto", "left":"0"});
				if (!this.options.moduleTabs) {
					content.find("li:first").css("margin-left","0");
				} 
				
				if (this.options.moduleTabs) {
					$tabs.find(".inforTabChevron").parent().hide();
					$tabs.find(".inforModuleHeaderRight").css("margin-right","0");
					//set text back
					//change text to ...
					$tabs.find("li a").each(function() {
						var a = $(this),
							text = a.data("text");
							
						a.text(text);
					});
				}
			} else {
				if (!this.options.moduleTabs) {
					prevButton.parent().show();
					nextButton.show().parent().width("32px");
					content.width(headerWidth);
					
					if (maxWidth )
						content.css("max-width",maxWidth);
					content.find("li:first").css("margin-left","16px");	//indent first li
				}
				
				this._scrollTabIntoView($tabs,content);
				
				if (this.options.moduleTabs) {
					$tabs.find(".inforTabChevron").parent().show();
					$tabs.find(".inforModuleHeaderRight").css("margin-right","18px");
					//change text to ...
					$tabs.find("li a").each(function() {
						var a = $(this),
							text = a.text();
							
						a.data("text",text).text(text.substr(0,3)+"...");
					});
				}
			}
		}
});
}(jQuery));
/*
* Infor Status Indicator - A Popup Dialog showing a status bar.
*/
(function( $ ) {
$.widget( "ui.inforStatusIndicator", {
	options: {
		value: 0,
		max: 100,
		title: null,
		showCancel: false,
		showTitleClose: true,
		onCancel: null,
		statusText: null,
		detailText: null,
		indefinite: false
	},
	
	min: 0,
	
	_init: function() {
		 var self = this;
		 var o = self.options;
		
		//translate the prefs..
		if (o.title==undefined)
			o.title=Globalize.localize("StatusIndicator");
		
		if (o.statusText==undefined)
			o.statusText=Globalize.localize("PleaseWait");
		
		if (o.detailText==undefined)
			o.detailText=Globalize.localize("LoadingItem");
		
		 //add the progress bar.
		 this.contentArea = $('<div></div>');
		 $('<h4 class="inforStatusIndicatorStatusText">'+o.statusText+'</h4>').appendTo(this.contentArea);
		 this.detailText = $('<h6 class="inforStatusIndicatorDetailText">'+o.detailText+'</h6>').appendTo(this.contentArea);
		 this.valueDiv = $('<div class="'+(o.indefinite ? "inforStatusIndefiniteValue" : "inforStatusIndicatorValue") +'"></div>').appendTo(this.contentArea);
		 this.valueDiv.wrap('<div class="inforStatusIndicatorBar"></div>');
		 this.contentArea.appendTo(this.element);
		 
		 if (o.indefinite)
			o.value=100;
			
		 //$div.progressbar({ value: o.value });
		 this.dialog = this.contentArea.inforMessageDialog({
					title: o.title,
					dialogType: "General",
					width: 361,
					height: 245,
					showTitleClose: o.showTitleClose
				});
		this.dialog.hide();
		
		this.dialog.closest(".inforDialog").find(".inforCloseButton").click(function(){
			self.destroy();  
		});
		
		if (!o.showCancel)
			this.dialog.closest(".inforDialog").find(".dialogButtonBar").hide();
		
		this._refreshValue();
		this.dialog.show("fadeIn");
	},

	destroy: function() {
		this.valueDiv.remove();
		this.dialog.inforDialog("destroy");  
		this.contentArea.remove();
		
		// call the original destroy method since we overwrote it
		$.Widget.prototype.destroy.call( this );
	},

	value: function( newValue, newDetail ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		switch ( key ) {
			case "max":
				this.options.max = value;
				this._refreshValue();
				break;
			case "value":
				this.options.value = value;
				this._refreshValue();
				this._trigger( "change" );
				break;
			case "detailText":
				this.detailText.html(value);
				break;
		}
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value();
		var percentage = this._percentage();

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}

		this.valueDiv
			.toggle( value > this.min )
			.width( percentage.toFixed(0) + "%" );
			
		if (this.options.closeWhenComplete && value==this.options.max)
			this.destroy();
	}
});

})( jQuery );

/*
* Infor Splitter - An Animated Splitter based on 
*    Kristaps Kukurs (contact@krikus.com) 
* 	 http://krikus.com/js/splitter
* 
* Dual licensed under the MIT and GPL licenses: 
*   http://www.opensource.org/licenses/mit-license.php 
*   http://www.gnu.org/licenses/gpl.html 
*/
(function($){
	
	$.fn.inforSplitter = function(options){
		var settings = {
			splitHorizontal:false, //vertical or horizontal
			splitVertical:true, //vertical or horizontal
			savePosition: true, //Save the split value to a cookie?
			initialSplitPerc: null	//initial split size.
		};
		
		return this.each(function() {
			var $this = $(this);
			
			splitterWindowHeight = $(window).height(), splitterWindowWidth = $(window).width();
			splitterResizeTimer = null;
			
			var	o = $.extend({}, settings, options); //Extend the options if any provided
			var elementId = $this.attr("id");
			resizePerc = .20;
			
			unSavedPos=0;	 // Unsaved/Unclosed splitting position
			var splitPos;	 // current splitting position
			
			// Default opts
			var direction = (o.splitHorizontal? 'h':'v');
			var opts = $.extend({
				minAsize:0, //minimum width/height in PX of the first (A) div.
				maxAsize:0, //maximum width/height  in PX of the first (A) div.
				minBsize:0, //minimum width/height in PX of the second (B) div.
				maxBsize:0, //maximum width/height  in PX of the second (B) div.
				invertClass: 'invert',//class name for invert splitter button
				animSpeed: 100 //animation speed in ms
			},{
			v:{ // Vertical
				moving:"left",sizing: "width", eventPos: "pageX",splitbarClass:"inforSplitBarVertical",buttonClass: "inforSplitButtonVertical", cursor: "e-resize"
			},
			h: { // Horizontal 
				moving:"top",sizing: "height", eventPos: "pageY",splitbarClass:"inforSplitBarHorizontal",buttonClass: "inforSplitButtonHorizontal",  cursor: "n-resize"
			}
			}[direction], o);
			
			if (direction=='v') {
				o.A = $('#leftPane');
				o.B = $('#rightPane');
				if (o.initialSplitPerc) {
					o.A.css("width",o.initialSplitPerc*100+"%");
					o.B.css("width","75%");
				}
			} else {
				o.A =$('#topPane');
				o.B =$('#bottomPane');
				if (o.initialSplitPerc) {
					o.A.css("height",o.initialSplitPerc*100+"%");
					o.B.css("height","75%");
				}
			}
			
			//setup elements
			splitter = $this;
			var mychilds =splitter.children(); //$(">*", splitter[0]);
			var A = o.A;	// left/top frame
			var B = o.B;// right/bottom frame
			var slave=o.slave;//optional, elemt forced to receive resize event
			
			//Create splitbar 
			var C=$('<div><span></span></div>');
			A.after(C);
			C.attr({"class": opts.splitbarClass,unselectable:"on"}).css({"cursor":opts.cursor,"user-select": "none", "-webkit-user-select": "none","-khtml-user-select": "none", "-moz-user-select": "none"})
			.draggable({ iframeFix: true, axis: (direction=='v' ? "x" : "y"), 
					stop: function(event, ui) {
						endDrag(event, ui);
					},
					start: function(event, ui) {
						C.css('z-index','250').css("-webkit-user-select", "none");
						splitter._initPos=C.position();
						splitter._initPos[opts.moving]-=C[opts.sizing]();
					}});
			
			C.hover(function(){	
							if (direction=='v')
								$(this).css("cursor","e-resize");
							else
								$(this).css("cursor","n-resize");
								},
					function(){$(this).css("cursor","default")});
			
			//set up the hover drag
			var Bt=$('<div></div>').attr({"class": opts.buttonClass, unselectable: "on"});
			C.append(Bt);
			
			//reset size to default.			
			setHeight();
			var perc=(((C.position()[opts.moving]-splitter.offset()[opts.moving])/splitter[opts.sizing]())*100).toFixed(1);
			unSavedPos = o.restoreSplitPerc*100;
			
			if ($this.parent().hasClass("ui-tabs-panel")) {
				$this.parent().css("overflow","hidden");
				$this.css({"margin-left" : "-10px", "width": "102%"});
			}
			
			//set size saved in the cookie
			if (o.savePosition) {
				var cookieId = window.location.pathname+'inforSplitter/#'+(elementId==undefined ? "inforSplitter"+direction :elementId),
					cookieVal = $.cookie(cookieId);
				if (cookieVal != null)
				{	
					perc=cookieVal;
				}	
			}
		
			splitTo(perc);
			
			if ($.browser.msie)
				$(window).smartresize(handleResize);
			else
				$(window).resize(handleResize);
			
			function handleResize() {
				if (splitterResizeTimer) clearTimeout(splitterResizeTimer);
				
				if (splitterWindowHeight != $(window).height() || splitterWindowWidth != $(window).width()) {
					setWidth();
					splitterResizeTimer = setTimeout(reinit, 0);
					splitterWindowHeight = $(window).height();
					splitterWindowWidth = $(window).width();
				}
			}
		
			function reinit(){
				splitTo(resizePerc); 
			}
			
			function setWidth() {
				var root = C.closest('.inforSplitter')
				if (direction=='h')
					root = C.closest('.inforHorizontalSplitter');
				
				var w = $(window).width()-A.width()-C.width()-1;
				B.width(w+"px");	//animate({width : "toggle"}, 500)
			}
			
			function setHeight(){
				var root = C.closest('.inforSplitter')
				if (direction=='h')
					root = C.closest('.inforHorizontalSplitter');
						
				root.height($(window).height()-root.position().top+"px");
			}
			
			function endDrag(event, ui){
				if (direction=='v')
					C.css("left","");
				
				var p=ui.offset;
				mychilds.css("-webkit-user-select", "text");// let Safari select text again
				
				var perc=(((p[opts.moving]-splitter.offset()[opts.moving])/splitter[opts.sizing]())*100).toFixed(1);	
				
				splitTo(perc); 
				splitter._initPos=0;
				splitter.css("cursor","default")
			}
				
			//Perform actual splitting and animate it;					
			function splitTo(perc) {
				//prevents dragging off the right side
				if (perc>=100)
					perc = 100;
				
				if (perc<=0)
					perc = 0;
					
				if (Globalize.culture().isRTL) {
					perc = 100-perc;
				}
				
				if(splitPos&&splitPos>10&&splitPos<90)//do not save accidental events
						_splitPos=splitPos;
				
				resizePerc = perc;
				setHeight();
				
				//Adjust the invert class if we drag or not.
				if (opts.closeableto==perc)
					Bt.addClass(opts.invertClass);
				else
					Bt.removeClass(opts.invertClass);
				
				if (o.savePosition) {
					var cookieId = window.location.pathname+'inforSplitter/#'+(elementId==undefined ? "inforSplitter"+direction :elementId);
					$.cookie(cookieId,perc);
				}
				
				var barsize=C[opts.sizing]();
				var splitsize=splitter[opts.sizing]();
				
				if (opts.closeableto!=perc){
					var percpx=Math.max(parseInt((splitsize/100)*perc),opts.minAsize);
					if (opts.maxAsize)
						percpx=Math.min(percpx,opts.maxAsize);
				}else{
					var percpx=parseInt((splitsize/100)*perc,0);
				}
				
				if ((opts.maxBsize) && (splitsize-percpx>opts.maxBsize)) {
						percpx=splitsize-opts.maxBsize;
				}
					
				if ((opts.minBsize) && (splitsize-percpx<opts.minBsize)) {
						percpx=splitsize-opts.minBsize;
				}
				
				var sizeA=Math.max(0,(percpx-barsize));
				var sizeB=Math.max(0,(splitsize-(percpx==0 ? 10 : percpx)));
				
				if (direction=='v')
					splitsize=(splitsize-barsize);
				
				if ($.browser.msie && direction=='v')
					sizeB=sizeB-2;
				
				A.show().css(opts.sizing,sizeA+'px');
				B.show().css(opts.sizing,sizeB-1+'px');
				Bt.show();
				
				if (direction=='h')
					C.css("top","5px");
				
				mychilds.trigger("resize");
				mychilds.find(".inforDataGrid").each(function() {
					var grid = $(this).data("gridInstance");
					if (grid)
						grid.resizeCanvas();
				});
				
				if (slave)
					slave.trigger("resize");
				_ismovingNow=false;	
		}
	});
};
})(jQuery);

/*
 * Infor Split Button - A Button with a Default Click action and Menu for sub actions.
 *
 * Usage: 
 *      $("#inforSplitButtonId").inforSplitButton();
 */
 (function($){
	$.fn.inforSplitButton = function( options ) {
		var settings = {
			menuId : null,	//id on the form of the menu
			callback: null, //function to execute on a menu item click
			click: null  //function to execute on button part click
		};
		
		return this.each(function() {
			var	o = $.extend({}, settings, options), 
			$textButton = $(this);
			var buttonText = $textButton.html();
			var isIconButton = false;
			
			if (!$textButton.find('.leftSlice').hasClass('leftSlice'))	//prevent re-wrapping on multiple calls.
			{	
				$textButton.empty();
				var $leftSlice = $("<span class=\"leftSlice\" />");
				var $centerSlice = $("<span class=\"centerSlice\" />").html(buttonText);
				var $rightButton = $("<button type='button' class=\"inforSplitButtonMenu\" />");
				
				var isDisabled = $textButton.hasClass("disabled");
				var classes=$textButton.attr("class").replace("inforSplitButton","").replace("disabled","");
				
				if (classes=="" || classes==" ") { 	
					$textButton.append($leftSlice, $centerSlice);
					$textButton.removeAttr("class").addClass("inforSplitButtonText");
				}
				else {
					$textButton.removeAttr("class").addClass("inforIconSplitButton");
					//read the icon class and move it
					$textButton.addClass(classes);
					isIconButton = true;
				}
				
				//wrap in a div and add the button on the right.
				var container = $("<div class='inforSplitButton'></div>");
				$textButton.wrap(container);
				$textButton.parent().append($rightButton);
				
				//attach the events.
				$textButton.click(function(e){
					if (o.click!=undefined && !$textButton.parent().hasClass("disabled"))
						o.click(e);
				});
				
				if (o.menuId!==null) {
					$rightButton.inforContextMenu({
						menu: o.menuId,
						invokeMethod: 'toggle',
						positionBelowElement: true,
						offsetLeft: -3,
						offsetTop: -2
					}, (o.callback==undefined ? null : function(action, el, pos, item) {
							if ($textButton.hasClass('disabled'))
								return;
								
							o.callback(action, el, pos, item);
					}));
				}
				
				//set the initial disabled state.
				if (isDisabled)
					$textButton.disable();
				else
					$textButton.enable();
					
				$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
				//style fix for WebKit
				if ($.browser.safari && !isIconButton)
				$textButton.css({"margin-top": "0", "padding": "0", "height": "21px" });
			
				if ($.browser.webkit && !isIconButton && !$.browser.safari && !Globalize.culture().isRTL) {	
					$rightButton.css({"margin-top": "-1px"});
					$textButton.parent().css({"padding-top": "1px"});
				}
			}
		});
	};
	
}(jQuery));
/*
* Infor Spash Screen
*/
(function ($, undefined) {
    $.widget("ui.inforSplashScreen", {
        options: {
			category: "Infor 10 ERP Enterprise (LN)",	//text for category
			productName: "Installation Wizard",	//text for product name
			version: "Version 10.0.0",	//text for version
			copyRight: "Copyright @ 2012. Infor. All rights reserved. www.infor.com", //copyRight text
			extraLine: null,	//fourth line
			redirect: "", //Page to redirect to can be http or relative. 
			delay: 3000	//Time to delay before redirecting...
		},
		_create: function () {
             var self = this;
			 var o = self.options;
			 
			 var $div = $('<div id="inforSplashScreen" style="display:none"></div>');
			 var $category = $('<span class="category">'+o.category+'</span><br>');
			 var $productName = $('<span class="productName">'+o.productName+'</span><br>');
			 var $version = $('<span class="version">'+o.version+'</span><br>');
			 var $logo = $('<div class="inforLogo"></div>');
			 var $copyRight = $('<span class="copyRight">'+o.copyRight+'</span><br>');
			 
			 if (o.extraLine!=undefined) {
				 var $extraLine = $('<span class="extraLine">'+o.extraLine+'</span><br>');
				 $div.append($category,$productName,$version,$logo,$copyRight,$extraLine);
				 $version.css("font-size","18px");
			 } else
				$div.append($category,$productName,$version,$logo,$copyRight);	
			
			$('body').append($div);
		
			//Add signIn Dialog elements to the page
			var $dialog = $div.inforDialog({
				title: "Sign In",
				dialogType: "General",
				minHeight: 420,
				minWidth: 620,
				maxHeight: 420,
				maxWidth: 620,
				height: 420,
				width : 620,
				modal: true,
				draggable:false,
				//show: 'slideToggle',
				resizable: false,
				position: {
					my: 'center',
					at: 'center',
					collision: 'none'
				}
			});
			
			//remove elements from the message dialog that are not needed.
			var root = $dialog.closest(".inforDialog");
			
			//Remove un needed stuff.
			root.find(".dialogTop").remove();
			root.addClass("inforSplashScreen");
			root.removeClass("inforDialog");
			
			//fix padding..
			if (Globalize.culture().isRTL) 
				root.find("#inforSplashScreen").css("padding-left","53px");
			else
				root.find("#inforSplashScreen").css("padding-right","53px");
			
			$(".inforOverlay").remove();
			
			//adjust width
			root.css({"width":"","height":""});
			
			//set the time out and redirect.
			if (o.redirect!="")
			{
				timeout = setTimeout(function(){
					root.fadeOut();
					window.location=o.redirect;
				}, o.delay);
			}
		}
   });
})(jQuery);




/*
 * Infor Spinner  - Numeric Up / Down Editor
 */
(function ($) {
	$.widget("ui.inforSpinner", {
		options: {
			step: 1,	//specifies the legal number intervals
			max: Number.MAX_VALUE,
			min: Number.MIN_VALUE		
		},
		input: null,
		downButton: null,
		upButton: null,
		_init: function() {
			var self = this;
			this.input = $(this.element);
			
			//change attribute or chrome will add its own input
			this.input.get(0).type = 'text';
			
			//copy html5 attributes to settings.
			if (this.input.attr("step"))
				this.options.step=parseInt(this.input.attr("step"));
			if (this.input.attr("max"))
				this.options.max=parseInt(this.input.attr("max"));
			if (this.input.attr("min"))
				this.options.min=parseInt(this.input.attr("min"));
				
			//add trigger button styling
			this.input.numericOnly(false).data("isInitialized",true).inforTriggerField();
			this.upButton = this.input.closest(".inforTriggerField").find(".inforSpinnerButtonUp");
			this.downButton = $('<button class="inforTriggerButton inforSpinnerButtonDown" type="button" tabindex="-1"></button>');
			this.upButton.after(this.downButton);
			
			//add click - long press events
			var upInterval;
			this.upButton.on('mousedown',function() {
				upInterval = setInterval(function() { self.increment(self.options.step, upInterval); }, 200);
			}).on('mouseup mouseup mouseout',function() {
			  clearInterval(upInterval);  
			});
			
			var downInterval;
			this.downButton.on('mousedown',function() {
				downInterval = setInterval(function() { self.increment(-(self.options.step), downInterval); }, 200);
			}).on('mouseup mouseup mouseout',function() {
			  clearInterval(downInterval);  
			});
			
			this.upButton.click(function(e) {
				self.increment(self.options.step);
			});
			this.downButton.click(function(e) {
				self.increment(-(self.options.step));
			});
			
			//add support for mouse wheel - using the mousewheel plugin in shared.
			this.input.bind('mousewheel', function(event, delta) {
				self.increment(delta * self.options.step);
			});
			
			//add keyboard support  - using the hotkeys plugin in shared.
			this.input.bind('keydown', 'up', function() {
			  self.increment(self.options.step);
			});
			this.input.bind('keydown', 'down', function() {
			  self.increment(-(self.options.step));
			});
			this.input.bind('keyup', function() {
			   self.increment(0);
			});
			this.input.bind('focus', function() {
				$(this).select();
			});
			
			//set initial disabled on min and max
			var startVal = parseInt(this.input.val());
			if (startVal>=this.options.max)
				this.upButton.attr("disabled","");
			if (startVal<=this.options.min)
				this.downButton.attr("disabled","");
				
		},
		increment: function (step, interval) {
			var newVal = parseInt(this.input.val());
			if (isNaN(newVal))
				newVal = 0;
			
			//validate based on max/min options and insert..
			newVal+=step;
			
			this.downButton.removeAttr("disabled");
			this.upButton.removeAttr("disabled");
			
			if (newVal>=this.options.max) {
				newVal=this.options.max;
				this.upButton.attr("disabled","");
				clearInterval(interval);  
			}
			if (newVal<=this.options.min) {
				newVal= this.options.min;
				this.downButton.attr("disabled","");
				clearInterval(interval);  
			}
			this.input.val(newVal).trigger("change");	//trigger dirty indicator.
		}
	});
} (jQuery));

/*
* Infor Sign in Dialog.
*/
(function ($, undefined) {
    $.widget("ui.inforSignInDialog", {
        options: {
			login: null, // callback that fires when a login occurs.
			cancel: null, // callback that fires when a cancel
			title: null,
			buttons: null
		},
		elementId: null,
        _create: function () {
             var self = this;
			
			if (self.options.buttons==null)
			{
				self.options.buttons =  [{	
										text: Globalize.localize("SignIn"),
										click: function() { self.login();},
										isDefault: true
									}];
			}
			
			if (self.options.title==null)
				self.options.title=Globalize.localize("SignIn");
			
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
				width : 482,
				modal: true,
				draggable:false,
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
			root.css({"width":"","height":""});
			root.find(".inforCheckbox").inforCheckbox();
			root.find(".inforFormButton:first").addClass("default");
			root.find("table").css("height","inherit");
			$(".inforOverlay").remove();
			
			this._restoreSavedInfo();
			
			//translate the text with built in translations
			$("[data-localizedText]").each(function() {
				var $this = $(this);
				var key = $this.attr("data-localizedText");
				$this.html(Globalize.localize(key));
			});
			
			var controlArea = $(".inforSignInControls");
			var maxWidth = controlArea.find(".inforLabel:first").width();
			
			if (maxWidth>50 && maxWidth<60)
				controlArea.css((Globalize.culture().isRTL ? "margin-right" : "margin-left"),(Globalize.culture().isRTL ? "21%" : "23%"));
			
			if (maxWidth>60 && maxWidth<70)
				controlArea.css((Globalize.culture().isRTL ? "margin-right" : "margin-left"),(Globalize.culture().isRTL ? "19%" : "21%"));
			
			root.show();
			controlArea.find(".inforLabel").autoWidth();
			//Set Focus to password field...
			setTimeout(function(){
				var userId =$.cookie("inforSignInDialog:userId");
				if (userId != undefined) 
					root.find("#password").focus().select();
				else
					root.find("#userId").focus().select();
			}, 500);
			
		},
        destroy: function () {
            $('#inforSignInDialog').remove();
        },
		_restoreSavedInfo: function (userId,password) {
			//Note: There is no way to securely encrypt the data while still having 
			//access to it from your Javascript since in order to do so, the (publicly visible) Javascript would have to contain both the decoding algorithm and any secret key used to encrypt the data!
		  var userId =$.cookie("inforSignInDialog:userId");
		  if (userId != undefined) {
				this.element.find("#userId").val(userId);
				this.element.find("#password").focus();
				this.element.find("#rememberPassword").setValue(true);
		   }
		},
		_saveInfo: function (userId,password) {
           $.cookie("inforSignInDialog:userId",userId);
		},
		_clearInfo: function (userId,password) {
           $.cookie("inforSignInDialog:userId",null);
		   this.element.find("#userId").val("");	//clears the value in the browser 
		},
		login: function () {
        	if (this.options.login!=undefined)
		    {
				var idField = this.element.find("#userId")
				var userId = idField.val();
				var password = this.element.find("#password").val();
				var rememberPassword = this.element.find("#rememberPassword").getValue();
				var result = this.options.login(userId, password);
				
				if (result) {
					$(".inforSignInDialog").hide();
					//Save In a Cookie.
					if (rememberPassword) 
						this._saveInfo(userId,password);
					else
						this._clearInfo();
				} else
					setTimeout(function(){
						var userId =$.cookie("inforSignInDialog:userId");
						if (userId != undefined) 
							password.focus().select();
						else
							idField.focus().select();
					}, 700);
			}
		 },
		cancel: function () {
            if (this.options.cancel!=undefined)
				this.options.cancel();
				
			$(".inforSignInDialog").hide();
		},
		showError: function (errorMessage) {
			this.clearError();
			$(".inforSignInControls").append("<br><div id='signInErrorText'><span class='severityImage error'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>"+errorMessage+"</div>");
		},
		clearError: function () {
		  //remove the br
		   $("#signInErrorText").prev().remove();
           $("#signInErrorText").remove();
		}
   });
})(jQuery);

/*
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1.	 When defining a culture, all fields are required except the ones stated as optional.
// 2.	 Each culture should have a ".calendars" object with at least one calendar named "standard"
//		 which serves as the default calendar in use by that culture.
// 3.	 Each culture should have a ".calendar" object which is the current calendar being used,
//		 it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		NaN: "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {"AdditionalHelp":"Additional Help","AddNewTab":"Add New Tab","Alerts":"Alerts","ApplyFilter":"Apply Filter","Approve":"Approve","Attachments":"Attachments","Back":"Back","Basic":"Basic","Between":"Between","Book":"Book","Cancel":"Cancel","Checked":"Checked","ClearFilter":"Clear Filter","Close":"Close","CloseCancelChanges":"Close and Cancel Changes","CloseSaveChanges":"Close and Save Changes","CloseTab":"Close Tab","ColumnPersonalization":"Column Personalization","Comments":"Comments","Confirmation":"Confirmation","Contains":"Contains","CreateTab":"Create a new Tab","Cut":"Cut","Delete":"Delete","DiscardUndo":"Discard/Undo","DisplayDropDownList":"Display Dropdown list","Displaying":"Displaying: ","DocWord":"Document","DoesNotContain":"Does Not Contain","DoesNotEndWith":"Does Not End With","DoesNotEqual":"Does Not Equal","DoesNotStartWith":"Does not Start With","Download":"Download","Duplicate":"Duplicate","Edit":"Edit","EitherSelectedorNotSelected":"Either Selected or Not Selected","Email":"Email","EndsWith":"Ends With","EqualsStr":"Equals","ExpandCollapse":"Expand/Collapse","ExportFailed":"Export Failed","ExportToExcel":"Export to Excel","FileInUse":"Specified File is In Use","FileInUseDetail":"Close the file in the application where it is in use or specify a different file name.","Filter":"Filter","FilterMenu":"Filter Menu","FilterOptions":"Filter Options","FilterWithinResults":"Filter Within Results","First":"First","FirstView":"First View","Folder":"Folder","ForgotPassword":"Forgot your Password?","Forward":"Forward","GetMoreRows":"Get More Rows","GreaterThan":"Greater Than","GreaterThanOrEquals":"Greater Than or Equals","GridSettings":"Grid Settings","GroupSelection":"Group Selection","Help":"Help","HideColumn":"Hide Column","IsEmpty":"Is Empty","IsNotEmpty":"Is Not Empty","Last":"Last","LastView":"Last View","LaunchActivate":"Launch/Activate","LessThan":"Less Than","LessThanOrEquals":"Less Than or Equals","Links":"Links","ListTabs":"List all Tabs","LoadingItem":"Loading item ","Maintenance":"Maintenance","Menu":"Menu","New":"New","Next":"Next","NextView":"Next View","No":"No","NotChecked":"Not Checked","Notes":"Notes","NotSelected":"Not Selected","Of":" of ","Ok":"OK","Open":"Open","Password":"Password","Paste":"Paste","Phone":"Phone","PleaseWait":"Please Wait","Previous":"Previous","PreviousView":"Previous View","Print":"Print","Queries":"Queries","Redo":"Redo","Refresh":"Refresh","Reject":"Reject","RememberMe":"Remember me on this computer","Reports":"Reports","Reset":"Reset","Review":"Review","RunFilter":"Run Filter","RunJob":"Run Job","Save":"Save","SaveBeforeClosing":"Save Before Closing","SavedFilters":"Saved Filters","SaveSubmit":"Save/Submit","ScreenDesign":"Screen Design","Search":"Search","SelectContents":"Select Contents","SelectDate":"Select a Date","SelectDeselect":"Select / Deselect All","Selected":"Selected: ","ServerName":"Server Name","Settings":"Settings","ShowFilterRow":"Show Filter Row","SignIn":"Sign In","SortAscending":"Sort Ascending","SortDescending":"Sort Descending","Spreadsheet":"Spreadsheet","StartsWith":"Starts With","StatusIndicator":"Status Indicator","Tasks":"Tasks","Today":"Today","Translate":"Translate","UserID":"User ID","Utilities":"Utilities","Yes":"Yes","Page":"Page","Rows":"Rows","ShowingAll":"Showing All","SessionNavigation":"Session Navigation","ListAllMenuItems":"List All Menu Items","NoRecordsFound":"No Records Found","SearchTree":"Search Tree","Clear":"Clear","DrillDown":"Drill Down","Required":"This is a Required Field","Available":"Available:","Add":"Add","MoveDown":"Move Down","MoveUp":"Move Up","Remove":"Remove","LastYear":"Last Year","NextMonth":"Next Month","NextWeek":"Next Week","NextYear":"Next Year","OneMonthAgo":"One Month Ago","OneWeekAgo":"One Week Ago","SixMonthsAgo":"Six Months Ago","Time":"Time","CannotBeSelected":"This row cannot be selected.","ResetToDefault":"Reset to Default Layout","CloseOtherTabs":"Close Other Tabs","String2":"Close Tab"}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures[ "en" ] = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+-]?infinity$/i;
regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function( deep ) {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert;

	if ( !format || !format.length || format === "i" ) {
		var ret;
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0: return date.getFullYear();
			case 1: return date.getMonth();
			case 2: return date.getDate();
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() )
					?
					cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ]
					:
					cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ]
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 )
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					+ ":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( (cal["/"]==undefined ? "/" : cal["/"]) );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
			break;
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1 );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat.NaN;
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				// fall through
			case "C":
				formatInfo = formatInfo || nf.currency;
				// fall through
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\" + (cal["/"]==undefined ? "/" : cal["/"]) + ")";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
					break;
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.	 We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			// fall through
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			// fall through
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			return a.pri < b.pri ? 1 : -1;
		});

		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	// trim leading and trailing whitespace
	value = trim( value );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
		if (Globalize.culture().isRTL) {
			$("html").attr("dir","rtl");
		} else {
			$("html").removeAttr("dir");
		}
		$("html").attr("lang",cultureSelector);
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.culture[ "default" ];
};

}( this ));
/*
 * Collection of Shared Bindings for use in KnockOut
 */
(function($) {
	//only add this if knockout is present..
	if (typeof ko =="undefined")
		return;
	
	/* Provide the ability to translate and change text bindings on buttons.
	 * Note: could also pass in a literal here: translate: 'SearchTreex'
	 */
	ko.bindingHandlers.translate = {
		setText: function(element, valueAccessor){
			var key = ko.utils.unwrapObservable(valueAccessor()), 
				translatedText = Globalize.localize(key),
				text = (translatedText==undefined ? key  : translatedText);
		   
		   if ($(element).find(".centerSlice").length>0)
			   $(element).find(".centerSlice").text(text);
		   else
			   $(element).text(text);
		},
		init: function(element, valueAccessor) {
			ko.bindingHandlers.translate.setText(element, valueAccessor);
		},
		update: function(element, valueAccessor) {
		   ko.bindingHandlers.translate.setText(element, valueAccessor);
		}
	};
	
	/* Provide the ability to bind the code value..
	*/
	ko.bindingHandlers.selectedCode = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		   var value = ko.utils.unwrapObservable(valueAccessor()); 
		   $(element).inforDropDownList("setCode",value);
		},
		 update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var value = ko.utils.unwrapObservable(valueAccessor()); 
		   $(element).inforDropDownList("setCode",value);
		}
	}
	
	/* Util to Copy a Binding from one object to another and optionally remove it*/
	ko.copyBinding = function( fromObject, toObject, binding, remove ) {
		//Get the attributes from the source object
		var attr = fromObject.attr("data-bind"),
			found = false;
			
		if (!attr)
			return;
			
		var seperated = attr.split(",");	//Seperate them
		for (attr in seperated) {
			var attrPair = $.trim(seperated[attr]);
			if (attrPair.indexOf(binding+":")==0) {
				//found copy it
				var old = toObject.attr("data-bind");
				toObject.attr("data-bind",(old == undefined ? attrPair : old+","+attrPair));
				//remove it from the array
				delete seperated[attr];
				found = true;
			}
		}
		
		if (remove && found) {
			var newAttr =seperated.toString();
			if (newAttr.substring(newAttr.length-1)==",")
				newAttr = newAttr.substring(0, newAttr.length-1);
			
			newAttr = newAttr.replace(/,,/gi, ",");
			fromObject.attr("data-bind",newAttr);
		}
	}
	
})(jQuery);
/*
 * Collection of Plugins Shared across multiple plugins....
 */
 
 /*
 * smartresize: debounced resize event for $
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/$.smartresize.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 */
(function($) {

	
	var event = $.event,
		resizeTimeout;
		
	event.special[ "smartresize" ] = {
		setup: function() {
			$( this ).bind( "resize", event.special.smartresize.handler );
		},
		teardown: function() {
			$( this ).unbind( "resize", event.special.smartresize.handler );
		},
		handler: function( event, execAsap ) {
			// Save the context
			var context = this,
				args = arguments;
			
			// set correct event type
			event.type = "smartresize";
			
			if(resizeTimeout)
				clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				$.event.handle.apply( context, args );
			}, execAsap === "execAsap"? 0 : 100);
		}
	}

	$.fn.smartresize = function( fn ) {
		return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
	};

	/*
	 * $.timers - Timer abstractions for $
	 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
	 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
	 * Date: 2009/10/16
	 *
	 * @author Blair Mitchelmore
	 * @version 1.2
	 *
	 **/
	$.fn.extend({everyTime:function(a,b,c,d){return this.each(function(){$.timer.add(this,a,b,c,d)})},oneTime:function(a,b,c){return this.each(function(){$.timer.add(this,a,b,c,1)})},stopTime:function(a,b){return this.each(function(){$.timer.remove(this,a,b)})}});$.extend({timer:{global:[],guid:1,dataKey:"$.timer",regex:/^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,powers:{ms:1,cs:10,ds:100,s:1e3,das:1e4,hs:1e5,ks:1e6},timeParse:function(a){if(a==undefined||a==null)return null;var b=this.regex.exec($.trim(a.toString()));if(b[2]){var c=parseFloat(b[1]);var d=this.powers[b[2]]||1;return c*d}else{return a}},add:function(a,b,c,d,e){var f=0;if($.isFunction(c)){if(!e)e=d;d=c;c=b}b=$.timer.timeParse(b);if(typeof b!="number"||isNaN(b)||b<0)return;if(typeof e!="number"||isNaN(e)||e<0)e=0;e=e||0;var g=$.data(a,this.dataKey)||$.data(a,this.dataKey,{});if(!g[c])g[c]={};d.timerID=d.timerID||this.guid++;var h=function(){if(++f>e&&e!==0||d.call(a,f)===false)$.timer.remove(a,c,d)};h.timerID=d.timerID;if(!g[c][d.timerID])g[c][d.timerID]=window.setInterval(h,b);this.global.push(a)},remove:function(a,b,c){var d=$.data(a,this.dataKey),e;if(d){if(!b){for(b in d)this.remove(a,b,c)}else if(d[b]){if(c){if(c.timerID){window.clearInterval(d[b][c.timerID]);delete d[b][c.timerID]}}else{for(var c in d[b]){window.clearInterval(d[b][c]);delete d[b][c]}}for(e in d[b])break;if(!e){e=null;delete d[b]}}for(e in d)break;if(!e)$.removeData(a,this.dataKey)}}}});$(window).bind("unload",function(){$.each($.timer.global,function(a,b){$.timer.remove(b)})});


	
})($);

/*
* hoverIntent r6 // 2011.02.26 // $ 1.5.1+
* <http://cherne.net/brian/resources/$.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})($);

/*
 * $ Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/
(function($){
	
	$.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && $.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + $.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ $.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	$.each([ "keydown", "keyup", "keypress" ], function() {
		$.event.special[ this ] = { add: keyHandler };
	});

})( $ );


/*
* debouncing function from John Hann
* http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
*/
(function($,sr){

  var debounce = function(func, threshold, execAsap) {
      var timeout;
	  
	  return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };
   
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);
   
          timeout = setTimeout(delayed, threshold || 100); 	
      };
  };
  
  $.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})($,'smartresize');

/*
* hoverIntent r6 // 2011.02.26 // $ 1.5.1+
* <http://cherne.net/brian/resources/$.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})($);

/*
 * $ Extension to focus and place cursor at the end of a field.
 */
(function($)
{
    /* 
	 * Puts the cursor at the end of text in an input field.
 	 */
	$.fn.putCursorAtEnd = function()
    {
		return this.each(function()
		{
			$(this).focus()

			// If this function exists...
			if (this.setSelectionRange)
			{
				// ... then use it
				// (Doesn't work in IE)

				// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
				var len = $(this).val().length * 2;
				this.setSelectionRange(len, len);
			}
			else
			{
				// ... otherwise replace the contents with itself
				// (Doesn't work in Google Chrome)
				$(this).val($(this).val());
			}

			// Scroll to the bottom, in case we're in a tall textarea
			// (Necessary for Firefox and Google Chrome)
			this.scrollTop = 999999;
		});
    };
	
	/* 
	 * Generate an unqiue id for an Element
	 * Usage: $.generateId();
	 */
	$.generateId = function() {
		return arguments.callee.prefix + arguments.callee.count++;
	};

	$.generateId.prefix = 'inforMenu';
	$.generateId.count = 0;

	$.fn.generateId = function() {
		return this.each(function() {
			this.id = $.generateId();
		});
	};

})($);

(function($) {
	/*
	 * Cookie plugin
	 *
	 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
	 * Dual licensed under the MIT and GPL licenses:
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.gnu.org/licenses/gpl.html
	 *
	 */
	$.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1;}
	var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}
	expires='; expires='+date.toUTCString();}
	var path=options.path?'; path='+options.path:'';var domain=options.domain?'; domain='+options.domain:'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
	return cookieValue;}};

	/*
	* Make an Iframe (or anything fx tabset) Fill from the top offset to bottom and handle the resize. Used in App nav for now.
	*/	
	$.fn.fillToBottom = function () {
		return this.each(function ()
        {
			var $iFrame = $(this);
			//set the max height of this area to the bottom of the form and track any resize events...
			handleFrameResize($iFrame);
			$(window).smartresize(function(){  
				handleFrameResize($iFrame);
			});
			
			function handleFrameResize($frame) {
			    var next = $frame.next(),
					maxHeight = $(window).height() - $frame.offset().top - next.height();	//the height of the nav
				
				$frame.css({ "border": "none" });
				if (next.hasClass("inforBottomFooter"))
					maxHeight -= 2;	//subtract 2 for the border
					
				$frame.height(maxHeight);
				$frame.width($(window).width());
			}
			$iFrame.show();
		});
	};
})(jQuery);
 
 
/* Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

/* 
 * jquery.event.drag - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
(function(f){f.fn.drag=function(b,a,d){var e=typeof b=="string"?b:"",k=f.isFunction(b)?b:f.isFunction(a)?a:null;if(e.indexOf("drag")!==0)e="drag"+e;d=(b==k?a:d)||{};return k?this.bind(e,d,k):this.trigger(e)};var i=f.event,h=i.special,c=h.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:false,drop:true,click:false},datakey:"dragdata",livekey:"livedrag",add:function(b){var a=f.data(this,c.datakey),d=b.data||{};a.related+=1;if(!a.live&&b.selector){a.live=true;i.add(this,"draginit."+ c.livekey,c.delegate)}f.each(c.defaults,function(e){if(d[e]!==undefined)a[e]=d[e]})},remove:function(){f.data(this,c.datakey).related-=1},setup:function(){if(!f.data(this,c.datakey)){var b=f.extend({related:0},c.defaults);f.data(this,c.datakey,b);i.add(this,"mousedown",c.init,b);this.attachEvent&&this.attachEvent("ondragstart",c.dontstart)}},teardown:function(){if(!f.data(this,c.datakey).related){f.removeData(this,c.datakey);i.remove(this,"mousedown",c.init);i.remove(this,"draginit",c.delegate);c.textselect(true); this.detachEvent&&this.detachEvent("ondragstart",c.dontstart)}},init:function(b){var a=b.data,d;if(!(a.which>0&&b.which!=a.which))if(!f(b.target).is(a.not))if(!(a.handle&&!f(b.target).closest(a.handle,b.currentTarget).length)){a.propagates=1;a.interactions=[c.interaction(this,a)];a.target=b.target;a.pageX=b.pageX;a.pageY=b.pageY;a.dragging=null;d=c.hijack(b,"draginit",a);if(a.propagates){if((d=c.flatten(d))&&d.length){a.interactions=[];f.each(d,function(){a.interactions.push(c.interaction(this,a))})}a.propagates= a.interactions.length;a.drop!==false&&h.drop&&h.drop.handler(b,a);c.textselect(false);i.add(document,"mousemove mouseup",c.handler,a);return false}}},interaction:function(b,a){return{drag:b,callback:new c.callback,droppable:[],offset:f(b)[a.relative?"position":"offset"]()||{top:0,left:0}}},handler:function(b){var a=b.data;switch(b.type){case !a.dragging&&"mousemove":if(Math.pow(b.pageX-a.pageX,2)+Math.pow(b.pageY-a.pageY,2)<Math.pow(a.distance,2))break;b.target=a.target;c.hijack(b,"dragstart",a); if(a.propagates)a.dragging=true;case "mousemove":if(a.dragging){c.hijack(b,"drag",a);if(a.propagates){a.drop!==false&&h.drop&&h.drop.handler(b,a);break}b.type="mouseup"}case "mouseup":i.remove(document,"mousemove mouseup",c.handler);if(a.dragging){a.drop!==false&&h.drop&&h.drop.handler(b,a);c.hijack(b,"dragend",a)}c.textselect(true);if(a.click===false&&a.dragging){jQuery.event.triggered=true;setTimeout(function(){jQuery.event.triggered=false},20);a.dragging=false}break}},delegate:function(b){var a= [],d,e=f.data(this,"events")||{};f.each(e.live||[],function(k,j){if(j.preType.indexOf("drag")===0)if(d=f(b.target).closest(j.selector,b.currentTarget)[0]){i.add(d,j.origType+"."+c.livekey,j.origHandler,j.data);f.inArray(d,a)<0&&a.push(d)}});if(!a.length)return false;return f(a).bind("dragend."+c.livekey,function(){i.remove(this,"."+c.livekey)})},hijack:function(b,a,d,e,k){if(d){var j={event:b.originalEvent,type:b.type},n=a.indexOf("drop")?"drag":"drop",l,o=e||0,g,m;e=!isNaN(e)?e:d.interactions.length; b.type=a;b.originalEvent=null;d.results=[];do if(g=d.interactions[o])if(!(a!=="dragend"&&g.cancelled)){m=c.properties(b,d,g);g.results=[];f(k||g[n]||d.droppable).each(function(q,p){l=(m.target=p)?i.handle.call(p,b,m):null;if(l===false){if(n=="drag"){g.cancelled=true;d.propagates-=1}if(a=="drop")g[n][q]=null}else if(a=="dropinit")g.droppable.push(c.element(l)||p);if(a=="dragstart")g.proxy=f(c.element(l)||g.drag)[0];g.results.push(l);delete b.result;if(a!=="dropinit")return l});d.results[o]=c.flatten(g.results); if(a=="dropinit")g.droppable=c.flatten(g.droppable);a=="dragstart"&&!g.cancelled&&m.update()}while(++o<e);b.type=j.type;b.originalEvent=j.event;return c.flatten(d.results)}},properties:function(b,a,d){var e=d.callback;e.drag=d.drag;e.proxy=d.proxy||d.drag;e.startX=a.pageX;e.startY=a.pageY;e.deltaX=b.pageX-a.pageX;e.deltaY=b.pageY-a.pageY;e.originalX=d.offset.left;e.originalY=d.offset.top;e.offsetX=b.pageX-(a.pageX-e.originalX);e.offsetY=b.pageY-(a.pageY-e.originalY);e.drop=c.flatten((d.drop||[]).slice()); e.available=c.flatten((d.droppable||[]).slice());return e},element:function(b){if(b&&(b.jquery||b.nodeType==1))return b},flatten:function(b){return f.map(b,function(a){return a&&a.jquery?f.makeArray(a):a&&a.length?c.flatten(a):a})},textselect:function(b){f(document)[b?"unbind":"bind"]("selectstart",c.dontstart).attr("unselectable",b?"off":"on").css("MozUserSelect",b?"":"none")},dontstart:function(){return false},callback:function(){}};c.callback.prototype={update:function(){h.drop&&this.available.length&& f.each(this.available,function(b){h.drop.locate(this,b)})}};h.draginit=h.dragstart=h.dragend=c})(jQuery);

/* 
 * jquery.event.drop - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
(function(f){f.fn.drop=function(c,a,d){var g=typeof c=="string"?c:"",e=f.isFunction(c)?c:f.isFunction(a)?a:null;if(g.indexOf("drop")!==0)g="drop"+g;d=(c==e?a:d)||{};return e?this.bind(g,d,e):this.trigger(g)};f.drop=function(c){c=c||{};b.multi=c.multi===true?Infinity:c.multi===false?1:!isNaN(c.multi)?c.multi:b.multi;b.delay=c.delay||b.delay;b.tolerance=f.isFunction(c.tolerance)?c.tolerance:c.tolerance===null?null:b.tolerance;b.mode=c.mode||b.mode||"intersect"};var l=f.event,i=l.special,b=f.event.special.drop= {multi:1,delay:20,mode:"overlap",targets:[],datakey:"dropdata",livekey:"livedrop",add:function(c){var a=f.data(this,b.datakey);a.related+=1;if(!a.live&&c.selector){a.live=true;l.add(this,"dropinit."+b.livekey,b.delegate)}},remove:function(){f.data(this,b.datakey).related-=1},setup:function(){if(!f.data(this,b.datakey)){f.data(this,b.datakey,{related:0,active:[],anyactive:0,winner:0,location:{}});b.targets.push(this)}},teardown:function(){if(!f.data(this,b.datakey).related){f.removeData(this,b.datakey); l.remove(this,"dropinit",b.delegate);var c=this;b.targets=f.grep(b.targets,function(a){return a!==c})}},handler:function(c,a){var d;if(a)switch(c.type){case "mousedown":d=f(b.targets);if(typeof a.drop=="string")d=d.filter(a.drop);d.each(function(){var g=f.data(this,b.datakey);g.active=[];g.anyactive=0;g.winner=0});a.droppable=d;b.delegates=[];i.drag.hijack(c,"dropinit",a);b.delegates=f.unique(i.drag.flatten(b.delegates));break;case "mousemove":b.event=c;b.timer||b.tolerate(a);break;case "mouseup":b.timer= clearTimeout(b.timer);if(a.propagates){i.drag.hijack(c,"drop",a);i.drag.hijack(c,"dropend",a);f.each(b.delegates||[],function(){l.remove(this,"."+b.livekey)})}break}},delegate:function(c){var a=[],d,g=f.data(this,"events")||{};f.each(g.live||[],function(e,h){if(h.preType.indexOf("drop")===0){d=f(c.currentTarget).find(h.selector);d.length&&d.each(function(){l.add(this,h.origType+"."+b.livekey,h.origHandler,h.data);f.inArray(this,a)<0&&a.push(this)})}});b.delegates.push(a);return a.length?f(a):false}, locate:function(c,a){var d=f.data(c,b.datakey),g=f(c),e=g.offset()||{},h=g.outerHeight();g=g.outerWidth();e={elem:c,width:g,height:h,top:e.top,left:e.left,right:e.left+g,bottom:e.top+h};if(d){d.location=e;d.index=a;d.elem=c}return e},contains:function(c,a){return(a[0]||a.left)>=c.left&&(a[0]||a.right)<=c.right&&(a[1]||a.top)>=c.top&&(a[1]||a.bottom)<=c.bottom},modes:{intersect:function(c,a,d){return this.contains(d,[c.pageX,c.pageY])?1E9:this.modes.overlap.apply(this,arguments)},overlap:function(c, a,d){return Math.max(0,Math.min(d.bottom,a.bottom)-Math.max(d.top,a.top))*Math.max(0,Math.min(d.right,a.right)-Math.max(d.left,a.left))},fit:function(c,a,d){return this.contains(d,a)?1:0},middle:function(c,a,d){return this.contains(d,[a.left+a.width*0.5,a.top+a.height*0.5])?1:0}},sort:function(c,a){return a.winner-c.winner||c.index-a.index},tolerate:function(c){var a,d,g,e,h,m,j=0,k,p=c.interactions.length,n=[b.event.pageX,b.event.pageY],o=b.tolerance||b.modes[b.mode];do if(k=c.interactions[j]){if(!k)return; k.drop=[];h=[];m=k.droppable.length;if(o)g=b.locate(k.proxy);a=0;do if(d=k.droppable[a]){e=f.data(d,b.datakey);if(d=e.location){e.winner=o?o.call(b,b.event,g,d):b.contains(d,n)?1:0;h.push(e)}}while(++a<m);h.sort(b.sort);a=0;do if(e=h[a])if(e.winner&&k.drop.length<b.multi){if(!e.active[j]&&!e.anyactive)if(i.drag.hijack(b.event,"dropstart",c,j,e.elem)[0]!==false){e.active[j]=1;e.anyactive+=1}else e.winner=0;e.winner&&k.drop.push(e.elem)}else if(e.active[j]&&e.anyactive==1){i.drag.hijack(b.event,"dropend", c,j,e.elem);e.active[j]=0;e.anyactive-=1}while(++a<m)}while(++j<p);if(b.last&&n[0]==b.last.pageX&&n[1]==b.last.pageY)delete b.timer;else b.timer=setTimeout(function(){b.tolerate(c)},b.delay);b.last=b.event}};i.dropinit=i.dropstart=i.dropend=b})(jQuery);



/*
 * Globalize Culture ar-SA
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "ar-SA", "default", {
	name: "ar-SA",
	englishName: "Arabic (Saudi Arabia)",
	nativeName: "العربية (المملكة العربية السعودية)",
	language: "ar",
	isRTL: true,
	numberFormat: {
		pattern: ["n-"],
		NaN: "ليس برقم",
		negativeInfinity: "-لا نهاية",
		positiveInfinity: "+لا نهاية",
		currency: {
			pattern: ["$n-","$ n"],
			symbol: "ر.س.‏"
		}
	},
	calendars: {
		standard: {
			name: "UmAlQura",
			firstDay: 6,
			"/": "/",
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""],
				namesAbbr: ["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			eras: [{"name":"بعد الهجرة","start":null,"offset":0}],
			twoDigitYearMax: 1451,
			patterns: {
				d: "dd/MM/yyyy",
				D: "dd/MMMM/yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dd/MMMM/yyyy hh:mm tt",
				F: "dd/MMMM/yyyy hh:mm:ss tt",
				M: "dd MMMM"
			},
			convert: {
                    _yearInfo: [
                        // MonthLengthFlags, Gregorian Date
                        [746, -2198707200000],
                        [1769, -2168121600000],
                        [3794, -2137449600000],
                        [3748, -2106777600000],
                        [3402, -2076192000000],
                        [2710, -2045606400000],
                        [1334, -2015020800000],
                        [2741, -1984435200000],
                        [3498, -1953763200000],
                        [2980, -1923091200000],
                        [2889, -1892505600000],
                        [2707, -1861920000000],
                        [1323, -1831334400000],
                        [2647, -1800748800000],
                        [1206, -1770076800000],
                        [2741, -1739491200000],
                        [1450, -1708819200000],
                        [3413, -1678233600000],
                        [3370, -1647561600000],
                        [2646, -1616976000000],
                        [1198, -1586390400000],
                        [2397, -1555804800000],
                        [748, -1525132800000],
                        [1749, -1494547200000],
                        [1706, -1463875200000],
                        [1365, -1433289600000],
                        [1195, -1402704000000],
                        [2395, -1372118400000],
                        [698, -1341446400000],
                        [1397, -1310860800000],
                        [2994, -1280188800000],
                        [1892, -1249516800000],
                        [1865, -1218931200000],
                        [1621, -1188345600000],
                        [683, -1157760000000],
                        [1371, -1127174400000],
                        [2778, -1096502400000],
                        [1748, -1065830400000],
                        [3785, -1035244800000],
                        [3474, -1004572800000],
                        [3365, -973987200000],
                        [2637, -943401600000],
                        [685, -912816000000],
                        [1389, -882230400000],
                        [2922, -851558400000],
                        [2898, -820886400000],
                        [2725, -790300800000],
                        [2635, -759715200000],
                        [1175, -729129600000],
                        [2359, -698544000000],
                        [694, -667872000000],
                        [1397, -637286400000],
                        [3434, -606614400000],
                        [3410, -575942400000],
                        [2710, -545356800000],
                        [2349, -514771200000],
                        [605, -484185600000],
                        [1245, -453600000000],
                        [2778, -422928000000],
                        [1492, -392256000000],
                        [3497, -361670400000],
                        [3410, -330998400000],
                        [2730, -300412800000],
                        [1238, -269827200000],
                        [2486, -239241600000],
                        [884, -208569600000],
                        [1897, -177984000000],
                        [1874, -147312000000],
                        [1701, -116726400000],
                        [1355, -86140800000],
                        [2731, -55555200000],
                        [1370, -24883200000],
                        [2773, 5702400000],
                        [3538, 36374400000],
                        [3492, 67046400000],
                        [3401, 97632000000],
                        [2709, 128217600000],
                        [1325, 158803200000],
                        [2653, 189388800000],
                        [1370, 220060800000],
                        [2773, 250646400000],
                        [1706, 281318400000],
                        [1685, 311904000000],
                        [1323, 342489600000],
                        [2647, 373075200000],
                        [1198, 403747200000],
                        [2422, 434332800000],
                        [1388, 465004800000],
                        [2901, 495590400000],
                        [2730, 526262400000],
                        [2645, 556848000000],
                        [1197, 587433600000],
                        [2397, 618019200000],
                        [730, 648691200000],
                        [1497, 679276800000],
                        [3506, 709948800000],
                        [2980, 740620800000],
                        [2890, 771206400000],
                        [2645, 801792000000],
                        [693, 832377600000],
                        [1397, 862963200000],
                        [2922, 893635200000],
                        [3026, 924307200000],
                        [3012, 954979200000],
                        [2953, 985564800000],
                        [2709, 1016150400000],
                        [1325, 1046736000000],
                        [1453, 1077321600000],
                        [2922, 1107993600000],
                        [1748, 1138665600000],
                        [3529, 1169251200000],
                        [3474, 1199923200000],
                        [2726, 1230508800000],
                        [2390, 1261094400000],
                        [686, 1291680000000],
                        [1389, 1322265600000],
                        [874, 1352937600000],
                        [2901, 1383523200000],
                        [2730, 1414195200000],
                        [2381, 1444780800000],
                        [1181, 1475366400000],
                        [2397, 1505952000000],
                        [698, 1536624000000],
                        [1461, 1567209600000],
                        [1450, 1597881600000],
                        [3413, 1628467200000],
                        [2714, 1659139200000],
                        [2350, 1689724800000],
                        [622, 1720310400000],
                        [1373, 1750896000000],
                        [2778, 1781568000000],
                        [1748, 1812240000000],
                        [1701, 1842825600000],
                        [0, 1873411200000]
                    ],
                    minDate: -2198707200000,
                    maxDate: 1873411199999,
                    toGregorian: function(hyear, hmonth, hday) {
                        var days = hday - 1,
                            gyear = hyear - 1318;
                        if (gyear < 0 || gyear >= this._yearInfo.length) return null;
                        var info = this._yearInfo[gyear],
                            gdate = new Date(info[1]),
                            monthLength = info[0];
                        // Date's ticks in javascript are always from the GMT time,
                        // but we are interested in the gregorian date in the same timezone,
                        // not what the gregorian date was at GMT time, so we adjust for the offset.
                        gdate.setMinutes(gdate.getMinutes() + gdate.getTimezoneOffset());
                        for (var i = 0; i < hmonth; i++) {
                            days += 29 + (monthLength & 1);
                            monthLength = monthLength >> 1;
                        }
                        gdate.setDate(gdate.getDate() + days);
                        return gdate;
                    },
                    fromGregorian: function(gdate) {
                        // Date's ticks in javascript are always from the GMT time,
                        // but we are interested in the hijri date in the same timezone,
                        // not what the hijri date was at GMT time, so we adjust for the offset.
                        var ticks = gdate - gdate.getTimezoneOffset() * 60000;
                        if (ticks < this.minDate || ticks > this.maxDate) return null;
                        var hyear = 0,
                            hmonth = 1;
                        // find the earliest gregorian date in the array that is greater than or equal to the given date
                        while (ticks > this._yearInfo[++hyear][1]) { }
                        if (ticks !== this._yearInfo[hyear][1]) {
                            hyear--;
                        }
                        var info = this._yearInfo[hyear],
                            // how many days has it been since the date we found in the array?
                            // 86400000 = ticks per day
                            days = Math.floor((ticks - info[1]) / 86400000),
                            monthLength = info[0];
                        hyear += 1318; // the Nth array entry corresponds to hijri year 1318+N
                        // now increment day/month based on the total days, considering
                        // how many days are in each month. We cannot run past the year
                        // mark since we would have found a different array entry in that case.
                        var daysInMonth = 29 + (monthLength & 1);
                        while (days >= daysInMonth) {
                            days -= daysInMonth;
                            monthLength = monthLength >> 1;
                            daysInMonth = 29 + (monthLength & 1);
                            hmonth++;
                        }
                        // remaining days is less than is in one month, thus is the day of the month we landed on
                        // hmonth-1 because in javascript months are zero based, stay consistent with that.
                        return [hyear, hmonth - 1, days + 1];
                    }
			}
		},
		Hijri: {
			name: "Hijri",
			firstDay: 6,
			"/": "/",
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""],
				namesAbbr: ["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			eras: [{"name":"بعد الهجرة","start":null,"offset":0}],
			twoDigitYearMax: 1451,
			patterns: {
				d: "dd/MM/yy",
				D: "dd/MM/yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dd/MM/yyyy hh:mm tt",
				F: "dd/MM/yyyy hh:mm:ss tt",
				M: "dd MMMM"
			},
			convert: {
                    // Adapted to Script from System.Globalization.HijriCalendar
                    ticks1970: 62135596800000,
                    // number of days leading up to each month
                    monthDays: [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 355],
                    minDate: -42521673600000,
                    maxDate: 253402300799999,
                    // The number of days to add or subtract from the calendar to accommodate the variances
                    // in the start and the end of Ramadan and to accommodate the date difference between
                    // countries/regions. May be dynamically adjusted based on user preference, but should
                    // remain in the range of -2 to 2, inclusive.
                    hijriAdjustment: 0,
                    toGregorian: function(hyear, hmonth, hday) {
                        var daysSinceJan0101 = this.daysToYear(hyear) + this.monthDays[hmonth] + hday - 1 - this.hijriAdjustment;
                        // 86400000 = ticks per day
                        var gdate = new Date(daysSinceJan0101 * 86400000 - this.ticks1970);
                        // adjust for timezone, because we are interested in the gregorian date for the same timezone
                        // but ticks in javascript is always from GMT, unlike the server were ticks counts from the base
                        // date in the current timezone.
                        gdate.setMinutes(gdate.getMinutes() + gdate.getTimezoneOffset());
                        return gdate;
                    },
                    fromGregorian: function(gdate) {
                        if ((gdate < this.minDate) || (gdate > this.maxDate)) return null;
                        var ticks = this.ticks1970 + (gdate-0) - gdate.getTimezoneOffset() * 60000,
                            daysSinceJan0101 = Math.floor(ticks / 86400000) + 1 + this.hijriAdjustment;
                        // very particular formula determined by someone smart, adapted from the server-side implementation.
                        // it approximates the hijri year.
                        var hday, hmonth, hyear = Math.floor(((daysSinceJan0101 - 227013) * 30) / 10631) + 1,
                            absDays = this.daysToYear(hyear),
                            daysInYear = this.isLeapYear(hyear) ? 355 : 354;
                        // hyear is just approximate, it may need adjustment up or down by 1.
                        if (daysSinceJan0101 < absDays) {
                            hyear--;
                            absDays -= daysInYear;
                        }
                        else if (daysSinceJan0101 === absDays) {
                            hyear--;
                            absDays = this.daysToYear(hyear);
                        }
                        else {
                            if (daysSinceJan0101 > (absDays + daysInYear)) {
                                absDays += daysInYear;
                                hyear++;
                            }
                        }
                        // determine month by looking at how many days into the hyear we are
                        // monthDays contains the number of days up to each month.
                        hmonth = 0;
                        var daysIntoYear = daysSinceJan0101 - absDays;
                        while (hmonth <= 11 && daysIntoYear > this.monthDays[hmonth]) {
                            hmonth++;
                        }
                        hmonth--;
                        hday = daysIntoYear - this.monthDays[hmonth];
                        return [hyear, hmonth, hday];
                    },
                    daysToYear: function(year) {
                        // calculates how many days since Jan 1, 0001
                        var yearsToYear30 = Math.floor((year - 1) / 30) * 30,
                            yearsInto30 = year - yearsToYear30 - 1,
                            days = Math.floor((yearsToYear30 * 10631) / 30) + 227013;
                        while (yearsInto30 > 0) {
                            days += (this.isLeapYear(yearsInto30) ? 355 : 354);
                            yearsInto30--;
                        }
                        return days;
                    },
                    isLeapYear: function(year) {
                        return ((((year * 11) + 14) % 30) < 11);
                    }
			}
		},
		Gregorian_MiddleEastFrench: {
			name: "Gregorian_MiddleEastFrench",
			firstDay: 6,
			"/": "/",
			days: {
				names: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
				namesAbbr: ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],
				namesShort: ["di","lu","ma","me","je","ve","sa"]
			},
			months: {
				names: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],
				namesAbbr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			eras: [{"name":"ap. J.-C.","start":null,"offset":0}],
			patterns: {
				d: "MM/dd/yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd, MMMM dd, yyyy hh:mm tt",
				F: "dddd, MMMM dd, yyyy hh:mm:ss tt",
				M: "dd MMMM"
			}
		},
		Gregorian_Arabic: {
			name: "Gregorian_Arabic",
			firstDay: 6,
			"/": "/",
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول",""],
				namesAbbr: ["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			eras: [{"name":"م","start":null,"offset":0}],
			patterns: {
				d: "MM/dd/yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd, MMMM dd, yyyy hh:mm tt",
				F: "dddd, MMMM dd, yyyy hh:mm:ss tt"
			}
		},
		Gregorian_Localized: {
			firstDay: 6,
			"/": "/",
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
				namesAbbr: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dd MMMM, yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dd MMMM, yyyy hh:mm tt",
				F: "dd MMMM, yyyy hh:mm:ss tt",
				M: "dd MMMM"
			}
		},
		Gregorian_TransliteratedFrench: {
			name: "Gregorian_TransliteratedFrench",
			firstDay: 6,
			"/": "/",
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],
				namesAbbr: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""]
			},
			AM: ["ص","ص","ص"],
			PM: ["م","م","م"],
			eras: [{"name":"م","start":null,"offset":0}],
			patterns: {
				d: "MM/dd/yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd, MMMM dd, yyyy hh:mm tt",
				F: "dddd, MMMM dd, yyyy hh:mm:ss tt"
			}
		}
	},
	messages : {"AdditionalHelp":"مساعدة إضافية","AddNewTab":"إضافة علامة تبويب جديدة","Alerts":"تنبيهات","Approve":"الموافقة","Attachments":"المرفقات","Back":"ظهر","Basic":"الأساسية","Between":"بين","Book":"كتاب","Both":"على حد سواء","Cancel":"إلغاء","Checked":"فحص","ClearFilter":"تصفية واضحة","Close":"قريب","CloseCancelChanges":"إغلاق وإلغاء التغييرات","CloseSaveChanges":"إغلاق وحفظ التغييرات","CloseTab":"إغلاق تبويب","ColumnPersonalization":"العمود التخصيص","Comments":"تعليقات","Confirmation":"تأكيد","Contains":"يحتوي","CreateTab":"إنشاء علامة تبويب جديدة","Cut":"خفض","Delete":"حذف","DiscardUndo":"تجاهل / تراجع","DisplayDropDownList":"عرض قائمة منسدلة","Displaying":"عرض","DocWord":"الوثيقة / كلمة","DoesNotContain":"لا يحتوي","DoesNotEndWith":"لا تنتهي","DoesNotEqual":"لا تكافؤ","DoesNotStartWith":"لا تبدأ","Download":"تحميل","Duplicate":"مكررة","Edit":"تحرير","EitherSelectedorNotSelected":"مختارة أو غير مختارة","Email":"البريد الإلكتروني","EndsWith":"ينتهي","EqualsStr":"يساوي","ExpandCollapse":"توسيع / ​​طي","ExportFailed":"فشل التصدير","ExportToExcel":"Excel التصدير إلى","FileInUse":"الملف قيد الاستخدام","Filter":"فلتر","FilterMenu":"تصفية القائمة","FilterOptions":"خيارات التصفية","FilterWithinResults":"وفي إطار تصفية النتائج","First":"الأول","FirstView":"أول عرض","Folder":"المجلد","ForgotPassword":"نسيت كلمة المرور","Forward":"إلى الأمام","GetMoreRows":"الحصول على مزيد من الصفوف","GreaterThan":"أكبر من","GreaterThanOrEquals":"أكبر من أو يساوي","GridSettings":"إعدادات الشبكة","GroupSelection":"المجموعة التحديد","Help":"مساعدة","HideColumn":"إخفاء العمود","IsEmpty":"فارغ","IsNotEmpty":"غير فارغ","Last":"آخر","LastView":"مشاهدة مشاركة","LaunchActivate":"إطلاق / تنشيط","LessThan":"أقل من","LessThanOrEquals":"أقل من أو يساوي","Links":"الروابط","ListTabs":"قائمة جميع الألسنة","LoadingItem":"تحميل السلعة","Maintenance":"صيانة","Menu":"القائمة","New":"جديد","Next":"التالي","NextView":"عرض القادم","No":"ليس","NotChecked":"لم يتم تحديد","Notes":"تلاحظ","NotSelected":"لم يتم تحديد","Of":" من","Ok":"موافق","Open":"فتح","Password":"كلمة السر","Paste":"لصق","Phone":"هاتف","PleaseWait":"يرجى الانتظار","Previous":"سابق","PreviousView":"السابق استعرض","Print":"طباعة","Queries":"الاستعلامات","Redo":"إعادة","Refresh":"التحديث","Reject":"رفض","RememberMe":"تذكرني على هذا الكمبيوتر","Reports":"تقارير","Reset":"إعادة تعيين","Review":"استعراض","Run Filter":"تشغيل تصفية","RunJob":"تشغيل وظيفة","Save":"حفظ","SaveBeforeClosing":"حفظ قبل الاغلاق","SavedFilters":"حفظ مرشحات","SaveSubmit":"حفظ / إرسال","ScreenDesign":"تصميم الشاشة","Search":"بحث","SelectContents":"حدد المحتويات","SelectDate":"حدد تاريخ","SelectDeselect":"تحديد / إلغاء جميع","Selected":"المختارة","ServerName":"اسم الخادم","Settings":"إعدادات","ShowFilterRow":"إظهار تصفية صف","SignIn":"وفي علامة","SortAscending":"فرز تصاعدي","SortDescending":"فرز تنازلي","Spreadsheet":"جدول","StartsWith":"يبدأ","StatusIndicator":"وضع المؤشر","Tasks":"المهام","Today":"اليوم","Translate":"ترجمة","UserID":"هوية المستخدم","Utilities":"المرافق","Yes":"نعم","Page":"صفحة","Rows":"الصفوف","ShowingAll":"عرض جميع","RunFilter":"تشغيل تصفية","NoRecordsFound":"لا توجد سجلات","SearchTree":"البحث عن شجرة","Clear":"مسح","DrillDown":"انتقل لأسفل","Required":"هذا حقل مطلوب","Available":"متوفرة:","Add":"إضافة","MoveDown":"تحريك لأسفل","MoveUp":"نقل ما يصل","Remove":"إزالة","LastYear":"آخر السنة","NextMonth":"الشهر المقبل","NextWeek":"الأسبوع المقبل","NextYear":"العام المقبل","OneMonthAgo":"قبل شهر واحد","OneWeekAgo":"قبل أسبوع واحد","SixMonthsAgo":"منذ ستة أشهر","Time":"مرة","CannotBeSelected":"لا يمكن أن يتم اختيار هذا الصف.","ResetToDefault":"لإعادة التخطيط الافتراضي","CloseOtherTabs":"إغلاق علامات التبويب الأخرى"}
});

}( this ));

/*
 * Globalize Culture de-DE
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "de-DE", "default", {
	name: "de-DE",
	englishName: "German (Germany)",
	nativeName: "Deutsch (Deutschland)",
	language: "de",
	numberFormat: {
		",": ".",
		".": ",",
		NaN: "n. def.",
		negativeInfinity: "-unendlich",
		positiveInfinity: "+unendlich",
		percent: {
			pattern: ["-n%","n%"],
			",": ".",
			".": ","
		},
		currency: {
			pattern: ["-n $","n $"],
			",": ".",
			".": ",",
			symbol: "€"
		}
	},
	calendars: {
		standard: {
			"/": ".",
			firstDay: 1,
			days: {
				names: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
				namesAbbr: ["So","Mo","Di","Mi","Do","Fr","Sa"],
				namesShort: ["So","Mo","Di","Mi","Do","Fr","Sa"]
			},
			months: {
				names: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember",""],
				namesAbbr: ["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"n. Chr.","start":null,"offset":0}],
			patterns: {
				d: "dd.MM.yyyy",
				D: "dddd, d. MMMM yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dddd, d. MMMM yyyy HH:mm",
				F: "dddd, d. MMMM yyyy HH:mm:ss",
				M: "dd MMMM",
				Y: "MMMM yyyy"
			}
		}
	},
	messages : {"AdditionalHelp":"Zusätzliche Hilfe","AddNewTab":"Neues Register hinzufügen","Alerts":"Alarmmeldungen","ApplyFilter":"Filter anwenden","Approve":"Genehmigen","Attachments":"Anhänge","Back":"Zurück","Basic":"Einfach","Between":"Zwischen","Book":"Book","Cancel":"Abbrechen","Checked":"Markiert","ClearFilter":"Filter löschen","Close":"Schließen","CloseCancelChanges":"Schließen und Änderungen verwerfen","CloseSaveChanges":"Schließen und Änderungen speichern","CloseTab":"Register schließen","ColumnPersonalization":"Spaltenpersonalisierung","Comments":"Anmerkungen","Confirmation":"Bestätigung","Contains":"Enthält","CreateTab":"Neues Register erstellen","Cut":"Ausschneiden","Delete":"Löschen","DiscardUndo":"Verwerfen/Rückgängig machen","DisplayDropDownList":"Dropdownliste anzeigen","Displaying":"Anzeige:","DocWord":"Dokument","DoesNotContain":"Enthält nicht","DoesNotEndWith":"Endet nicht mit","DoesNotEqual":"Ungleich","DoesNotStartWith":"Beginnt nicht mit","Download":"Herunterladen","Duplicate":"Kopieren","Edit":"Bearbeiten","EitherSelectedorNotSelected":"Ausgewählt/Nicht ausgewählt","Email":"E-Mail","EndsWith":"Endet mit","EqualsStr":"Gleich","ExpandCollapse":"Einblenden/Ausblenden","ExportFailed":"Fehler bei Export","ExportToExcel":"Export nach Excel","FileInUse":"Angegebene Datei wird verwendet","FileInUseDetail":"Schließen Sie die Datei in der Anwendung, in der sie verwendet wird, oder geben Sie einen anderen Dateinamen ein.","Filter":"Filter","FilterMenu":"Filtermenü","FilterOptions":"Filteroptionen","FilterWithinResults":"Ergebnisse filtern","First":"Erster Wert","FirstView":"Erste Ansicht","Folder":"Ordner","ForgotPassword":"Kennwort vergessen?","Forward":"Vorwärts","GetMoreRows":"Weitere Zeilen anzeigen","GreaterThan":"Größer als","GreaterThanOrEquals":"Größer als oder gleich","GridSettings":"Rastereinstellungen","GroupSelection":"Gruppenauswahl","Help":"Hilfe","HideColumn":"Spalte ausblenden","IsEmpty":"Ist leer","IsNotEmpty":"Ist nicht leer","Last":"Letzter Wert","LastView":"Letze Ansicht","LaunchActivate":"Starten/Aktivieren","LessThan":"Kleiner als","LessThanOrEquals":"Kleiner als oder gleich","Links":"Verknüpfungen","ListTabs":"Alle Register auflisten","LoadingItem":"Lade Objekt ","Maintenance":"Verwaltung","Menu":"Menü","New":"Neu","Next":"Weiter","NextView":"Nächste Ansicht","No":"Nein","NotChecked":"Nicht markiert","Notes":"Kommentare","NotSelected":"Nicht ausgewählt","Of":"von","Ok":"OK","Open":"Öffnen","Password":"Kennwort","Paste":"Einfügen","Phone":"Telefon","PleaseWait":"Bitte warten","Previous":"Zurück","PreviousView":"Vorherige Ansicht","Print":"Drucken","Queries":"Abfragen","Redo":"Wiederherstellen","Refresh":"Aktualisieren","Reject":"Ablehnen","RememberMe":"Login auf diesem Computer speichern","Reports":"Berichte","Reset":"Zurücksetzen","Review":"Überprüfen","RunFilter":"Filter ausführen","RunJob":"Job ausführen","Save":"Speichern","SaveBeforeClosing":"Vor dem Schließen speichern","SavedFilters":"Gespeicherte Filter","SaveSubmit":"Speichern/Übermitteln","ScreenDesign":"Bildschirmgestaltung","Search":"Suchen","SelectContents":"Inhalt auswählen","SelectDate":"Datum auswählen","SelectDeselect":"Alle auswählen/Auswahl für alle aufheben","Selected":"Ausgewählt:","ServerName":"Server-Name","Settings":"Einstellungen","ShowFilterRow":"Filterzeile anzeigen","SignIn":"Anmelden","SortAscending":"Aufsteigend sortieren","SortDescending":"Absteigend sortieren","Spreadsheet":"Tabelle","StartsWith":"Beginnt mit","StatusIndicator":"Statusanzeige","Tasks":"Aufgaben","Today":"Heute","Translate":"Übersetzen","UserID":"Benutzer-ID","Utilities":"Dienstprogramme","Yes":"Ja","Page":"Seite","Rows":"Reihen","ShowingAll":"Zeige All","ListAllMenuItems":"Alle Auflisten Menü Items","SessionNavigation":"Sitzung Schifffahrt","NoRecordsFound":"Keine Aufzeichnungen gefunden","SearchTree":"Suche Baum","Clear":"Löschen","DrillDown":"Bohren Sie","Required":"Dies ist ein Pflichtfeld","Available":"verfügbar:","Add":"Hinzufügen","MoveDown":"Nach unten","MoveUp":"Nach oben","Remove":"Entfernen","LastYear":"Letztes Jahr","NextMonth":"nächsten Monat","NextWeek":"Nächste Woche","NextYear":"Nächstes Jahr","OneMonthAgo":"Vor einem Monat","OneWeekAgo":"Vor einer Woche","SixMonthsAgo":"Sechs Monate zuvor","Time":"Zeit","CannotBeSelected":"Diese Zeile kann nicht ausgewählt werden","ResetToDefault":"Zurücksetzen auf Standard-Layout","CloseOtherTabs":"Andere Tabs schließen"}
});

}( this ));

/*
 * Globalize Culture en-GB
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "en-GB", "default", {
	name: "en-GB",
	englishName: "English (United Kingdom)",
	nativeName: "English (United Kingdom)",
	numberFormat: {
		currency: {
			pattern: ["-$n","$n"],
			symbol: "£"
		}
	},
	calendars: {
		standard: {
			firstDay: 1,
			patterns: {
				d: "dd/MM/yyyy",
				D: "dd MMMM yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dd MMMM yyyy HH:mm",
				F: "dd MMMM yyyy HH:mm:ss",
				M: "dd MMMM",
				Y: "MMMM yyyy"
			}
		}
	}
});

}( this ));

/*
 * Globalize Culture es-ES
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "es-ES", "default", {
	name: "es-ES",
	englishName: "Spanish (Spain, International Sort)",
	nativeName: "Español (España, alfabetización internacional)",
	language: "es",
	numberFormat: {
		",": ".",
		".": ",",
		NaN: "NeuN",
		negativeInfinity: "-Infinito",
		positiveInfinity: "Infinito",
		percent: {
			",": ".",
			".": ","
		},
		currency: {
			pattern: ["-n $","n $"],
			",": ".",
			".": ",",
			symbol: "€"
		}
	},
	calendars: {
		standard: {
			firstDay: 1,
			days: {
				names: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
				namesAbbr: ["dom","lun","mar","mié","jue","vie","sáb"],
				namesShort: ["do","lu","ma","mi","ju","vi","sá"]
			},
			months: {
				names: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre",""],
				namesAbbr: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"d.C.","start":null,"offset":0}],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd, dd' de 'MMMM' de 'yyyy",
				t: "H:mm",
				T: "H:mm:ss",
				f: "dddd, dd' de 'MMMM' de 'yyyy H:mm",
				F: "dddd, dd' de 'MMMM' de 'yyyy H:mm:ss",
				M: "dd MMMM",
				Y: "MMMM' de 'yyyy"
			}
		}
	},
	messages: {"AdditionalHelp":"Ayuda adicional","AddNewTab":"Añadir nueva ficha","Alerts":"Alertas","ApplyFilter":"Aplicar filtro","Approve":"Aprobar","Attachments":"Datos adjuntos","Back":"Atrás","Basic":"Básico","Between":"Entre","Book":"Libro","Cancel":"Cancelar","Checked":"Activado","ClearFilter":"Borrar filtro","Close":"Cerrar","CloseCancelChanges":"Cerrar y cancelar cambios","CloseSaveChanges":"Cerrar y guardar cambios","CloseTab":"Cerrar ficha","ColumnPersonalization":"Personalización de columnas","Comments":"Comentarios","Confirmation":"Confirmación","Contains":"Contiene","CreateTab":"Crear nueva ficha","Cut":"Cortar","Delete":"Eliminar","DiscardUndo":"Descartar/Deshacer","DisplayDropDownList":"Mostrar lista desplegable","Displaying":"Mostrado:","DocWord":"Documento","DoesNotContain":"No contiene","DoesNotEndWith":"No acaba en","DoesNotEqual":"No es igual a","DoesNotStartWith":"No empieza por","Download":"Descargar","Duplicate":"Duplicar","Edit":"Editar","EitherSelectedorNotSelected":"Tanto seleccionado como no seleccionado","Email":"Correo electrónico","EndsWith":"Acaba en","EqualsStr":"Es igual a","ExpandCollapse":"Expandir/contraer","ExportFailed":"No se pudo exportar","ExportToExcel":"Exportar a Excel","FileInUse":"El archivo especificado está en uso.","FileInUseDetail":"Cierre el archivo en la aplicación donde está en uso o especifique un nombre de archivo diferente.","Filter":"Filtro","FilterMenu":"Menú de filtro","FilterOptions":"Opciones de filtro","FilterWithinResults":"Filtrar en resultados","First":"Primero","FirstView":"Primera vista","Folder":"Carpeta","ForgotPassword":"¿Olvidó la contraseña?","Forward":"Adelante","GetMoreRows":"Obtener más filas","GreaterThan":"Mayor que","GreaterThanOrEquals":"Mayor que o igual","GridSettings":"Configuración de cuadrícula","GroupSelection":"Selección de grupo","Help":"Ayuda","HideColumn":"Ocultar columna","IsEmpty":"Esta vacío","IsNotEmpty":"No está vacío","Last":"Último","LastView":"Última vista","LaunchActivate":"Iniciar/Activar","LessThan":"Menos que","LessThanOrEquals":"Menos que o igual","Links":"Vínculos","ListTabs":"listar todas las fichas","LoadingItem":"Cargando elemento","Maintenance":"Mantenimiento","Menu":"Menú","New":"Nuevo","Next":"Siguiente","NextView":"Siguiente vista","No":"No","NotChecked":"No activado","Notes":"Notas","NotSelected":"Sin seleccionar","Of":"de","Ok":"Aceptar","Open":"Abrir","Password":"Contraseña","Paste":"Pegar","Phone":"Teléfono","PleaseWait":"Espere","Previous":"Anterior","PreviousView":"Vista anterior","Print":"Imprimir","Queries":"Consultas","Redo":"Rehacer","Refresh":"Actualizar","Reject":"Rechazar","RememberMe":"Recordar mis datos en este equipo \r\n","Reports":"Informes","Reset":"Restablecer","Review":"Revisar","RunFilter":"Ejecutar filtro","RunJob":"Ejecutar trabajo","Save":"Guardar","SaveBeforeClosing":"Guardar antes de cerrar","SavedFilters":"Filtros guardados","SaveSubmit":"Guardar/Enviar","ScreenDesign":"Diseño de pantalla","Search":"Buscar","SelectContents":"Seleccionar contenidos","SelectDate":"Seleccionar una fecha","SelectDeselect":"Seleccionar todo/Anular selección","Selected":"Seleccionado:","ServerName":"Nombre de servidor","Settings":"Configuración","ShowFilterRow":"Mostrar fila de filtro","SignIn":"Iniciar sesión","SortAscending":"Orden ascendente","SortDescending":"Orden descendente","Spreadsheet":"Hoja de cálculo","StartsWith":"Empieza por","StatusIndicator":"Indicador de estado","Tasks":"Tareas","Today":"Hoy","Translate":"Traducir","UserID":"Id. de usuario","Utilities":"Utilidades","Yes":"Sí","Page":"Página","Rows":"Filas","Showing":"Mostrando Todos Los","ListAllMenuItems":"Todos los elementos del menú","SessionNavigation":"Sesión de Navegación","ShowingAll":"Mostrando todos Los","NoRecordsFound":"Registros no encontrados","SearchTree":"árbol de búsqueda","Clear":"Borrar","DrillDown":"Los agujeros en","Required":"Este es un campo obligatorio","Available":"Disponible:","Add":"añadir","MoveDown":"Bajar","MoveUp":"Subir","Remove":"quitar","LastYear":"Último Año","NextMonth":"mes próximo","NextWeek":"próxima semana","NextYear":"El próximo año","OneMonthAgo":"Hace un mes","OneWeekAgo":"Hace una semana","SixMonthsAgo":"Hace seis meses","Time":"tiempo","CannotBeSelected":"Esta fila no se puede seleccionar","ResetToDefault":"Puesta a disposición predeterminada","CloseOtherTabs":"Cerrar las otras pestañas"}
});

}( this ));

/*
 * Globalize Culture fr-FR
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "fr-FR", "default", {
	name: "fr-FR",
	englishName: "French (France)",
	nativeName: "français (France)",
	language: "fr",
	numberFormat: {
		",": " ",
		".": ",",
		NaN: "Non Numérique",
		negativeInfinity: "-Infini",
		positiveInfinity: "+Infini",
		percent: {
			",": " ",
			".": ","
		},
		currency: {
			pattern: ["-n $","n $"],
			",": " ",
			".": ",",
			symbol: "€"
		}
	},
	calendars: {
		standard: {
			firstDay: 1,
			days: {
				names: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
				namesAbbr: ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],
				namesShort: ["di","lu","ma","me","je","ve","sa"]
			},
			months: {
				names: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],
				namesAbbr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"ap. J.-C.","start":null,"offset":0}],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd d MMMM yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dddd d MMMM yyyy HH:mm",
				F: "dddd d MMMM yyyy HH:mm:ss",
				M: "d MMMM",
				Y: "MMMM yyyy"
			}
		}
	}, 
	messages: {"AdditionalHelp":"Aide supplémentaire","AddNewTab":"Ajouter un onglet","Alerts":"Alertes","ApplyFilter":"Appliquer filtre","Approve":"Approuver","Attachments":"Pièces jointes","Back":"Précédent","Basic":"De base","Between":"Entre","Book":"Livre","Cancel":"Annuler","Checked":"Coché(e)","ClearFilter":"Effacer filtre","Close":"Fermer","CloseCancelChanges":"Fermer et annuler les modifications","CloseSaveChanges":"Fermer et enregistrer les modifications","CloseTab":"Fermer l\u0027onglet","ColumnPersonalization":"Personnalisation de colonne","Comments":"Commentaires","Confirmation":"Confirmation","Contains":"Contient","CreateTab":"Créer un nouvel onglet","Cut":"Couper","Delete":"Supprimer","DiscardUndo":"Supprimer/annuler","DisplayDropDownList":"Afficher la liste déroulante","Displaying":"Affichage :","DocWord":"Document","DoesNotContain":"Ne contient pas","DoesNotEndWith":"Ne finit pas par","DoesNotEqual":"N\u0027est pas égal(e)","DoesNotStartWith":"Ne commence pas par","Download":"Décharger","Duplicate":"Copier","Edit":"Modifier","EitherSelectedorNotSelected":"Sélectionné(e) ou Non sélectionné(e)","Email":"E-mail","EndsWith":"Finit par","EqualsStr":"Est égal(e)","ExpandCollapse":"Développer/réduire","ExportFailed":"Echec de l\u0027exportation","ExportToExcel":"Exporter vers Excel","FileInUse":"Fichier spécifié est en cours d\u0027utilisation","FileInUseDetail":"Fermez le fichier dans l\u0027application qui l\u0027utilise ou spécifiez un nom de fichier différent.","Filter":"Filtrer","FilterMenu":"Menu Filtre","FilterOptions":"Options filtre","FilterWithinResults":"Filtrer les résultats","First":"Premier","FirstView":"Première vue","Folder":"Dossier","ForgotPassword":"Mot de passe oublié ?","Forward":"Faire suivre","GetMoreRows":"Lignes supplémentaires","GreaterThan":"Supérieur à","GreaterThanOrEquals":"Supérieur ou égal à","GridSettings":"Paramètres de grille","GroupSelection":"Sélection de groupe","Help":"Aide","HideColumn":"Masquer la colonne","IsEmpty":"Est vide","IsNotEmpty":"N\u0027est pas vide","Last":"Dernier","LastView":"Dernière vue","LaunchActivate":"Lancer/activer","LessThan":"Inférieur à","LessThanOrEquals":"Inférieur ou égal à","Links":"Liens","ListTabs":"Lister tous les onglets","LoadingItem":"Chargement d\u0027article","Maintenance":"Maintenance","Menu":"Menu","New":"Nouveau","Next":"Suivant","NextView":"Vue suivante","No":"Non","NotChecked":"Pas coché(e)","Notes":"Remarques","NotSelected":"Pas sélectionné(e)","Of":"sur","Ok":"OK","Open":"Ouvrir","Password":"Mot de passe","Paste":"Coller","Phone":"Téléphone","PleaseWait":"Patientez","Previous":"Précédent","PreviousView":"Vue précédente","Print":"Imprimer","Queries":"Demandes","Redo":"Rétablir","Refresh":"Actualiser","Reject":"Rejeter","RememberMe":"Se souvenir de moi à cet ordinateur","Reports":"Etats","Reset":"Réinitialiser","Review":"Réviser","RunFilter":"Exécuter le filtre","RunJob":"Exécuter la tâche","Save":"Enregistrer","SaveBeforeClosing":"Enregistrer avant de fermer","SavedFilters":"Filtres enregistrés","SaveSubmit":"Enregistrer/soumettre","ScreenDesign":"Conception d\u0027écran","Search":"Rechercher","SelectContents":"Sélectionner les contenus","SelectDate":"Sélectionner une date","SelectDeselect":"Sélectionner / désélectionner tout","Selected":"Sélectionné(e) :","ServerName":"Nom du serveur","Settings":"Paramètres","ShowFilterRow":"Afficher la ligne de filtre","SignIn":"Connexion","SortAscending":"Tri ascendant","SortDescending":"Tri descendant","Spreadsheet":"Tableur","StartsWith":"Commencer par","StatusIndicator":"Indicateur d\u0027état","Tasks":"Tâches","Today":"Aujourd\u0027hui","Translate":"Traduire","UserID":"ID utilisateur","Utilities":"Outils","Yes":"Oui","Page":"Page","Rows":"Row","Showing":"Afficher tou","ListAllMenuItems":"Lister tous les éléments de menu","SessionNavigation":"Session de Navigation","ShowingAll":"Afficher Tous","NoRecordsFound":"Aucun résultat","SearchTree":"Arbre de recherche","Clear":"Effacer","DrillDown":"Percer","Required":"C\u0027est un champ obligatoire","Available":"Disponible:","Add":"Ajouter","MoveDown":"Descendre","MoveUp":"Déplacer vers le haut","Remove":"Supprimer","LastYear":"L\u0027année dernière","NextMonth":"Mois suivant","NextWeek":"Semaine suivante","NextYear":"Année suivante","OneMonthAgo":"Il ya un mois","OneWeekAgo":"Il ya une semaine","SixMonthsAgo":"Il ya six mois","Time":"temps","CannotBeSelected":"Cette ligne ne peut pas être sélectionné","ResetToDefault":"Remise à disposition par défaut","CloseOtherTabs":"Fermer les autres onglets"}
});

}( this ));

/*
 * Globalize Culture it-IT
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "it-IT", "default", {
	name: "it-IT",
	englishName: "Italian (Italy)",
	nativeName: "italiano (Italia)",
	language: "it",
	numberFormat: {
		",": ".",
		".": ",",
		NaN: "Non un numero reale",
		negativeInfinity: "-Infinito",
		positiveInfinity: "+Infinito",
		percent: {
			pattern: ["-n%","n%"],
			",": ".",
			".": ","
		},
		currency: {
			pattern: ["-$ n","$ n"],
			",": ".",
			".": ",",
			symbol: "€"
		}
	},
	calendars: {
		standard: {
			firstDay: 1,
			days: {
				names: ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],
				namesAbbr: ["dom","lun","mar","mer","gio","ven","sab"],
				namesShort: ["do","lu","ma","me","gi","ve","sa"]
			},
			months: {
				names: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre",""],
				namesAbbr: ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"d.C.","start":null,"offset":0}],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd d MMMM yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dddd d MMMM yyyy HH:mm",
				F: "dddd d MMMM yyyy HH:mm:ss",
				M: "dd MMMM",
				Y: "MMMM yyyy"
			}
		}
	},
	messages: {"AdditionalHelp":"Informazioni aggiuntive","AddNewTab":"Aggiungi nuova scheda","Alerts":"Avvisi","ApplyFilter":"Applica filtro","Approve":"Approva","Attachments":"Allegati","Back":"Indietro","Basic":"Di base","Between":"Compreso tra","Book":"Libro","Cancel":"Annulla","Checked":"Selezionato","ClearFilter":"Annulla filtro","Close":"Chiudi","CloseCancelChanges":"Chiudi e annulla modifiche","CloseSaveChanges":"Chiudi e salva modifiche","CloseTab":"Chiudi scheda","ColumnPersonalization":"Personalizzazione colonne","Comments":"Commenti","Confirmation":"Conferma","Contains":"Contiene","CreateTab":"Crea nuova scheda","Cut":"Taglia","Delete":"Elimina","DiscardUndo":"Ignora/Annulla","DisplayDropDownList":"Visualizza elenco a discesa","Displaying":"Visualizzazione corrente:","DocWord":"Documento","DoesNotContain":"Non contiene","DoesNotEndWith":"Non finisce con","DoesNotEqual":"Diverso da","DoesNotStartWith":"Non inizia con","Download":"Scarica","Duplicate":"Duplica","Edit":"Modifica","EitherSelectedorNotSelected":"Selezionati o non selezionati","Email":"E-mail","EndsWith":"Finisce con","EqualsStr":"Uguale a","ExpandCollapse":"Espandi/Comprimi","ExportFailed":"Esportazione non riuscita","ExportToExcel":"Esporta in Excel","FileInUse":"Il file specificato è in uso","FileInUseDetail":"Chiudere il file nell\u0027applicazione in cui è in uso oppure specificare un altro nome file.","Filter":"Filtro","FilterMenu":"Menu filtro","FilterOptions":"Opzioni filtro","FilterWithinResults":"Filtra nei risultati","First":"Primo","FirstView":"Prima vista","Folder":"Cartella","ForgotPassword":"Password dimenticata?","Forward":"Avanti","GetMoreRows":"Ottieni altre righe","GreaterThan":"Maggiore di","GreaterThanOrEquals":"Maggiore o uguale a","GridSettings":"Impostazioni griglia","GroupSelection":"Selezione gruppo","Help":"Guida","HideColumn":"Nascondi colonna","IsEmpty":"È vuoto","IsNotEmpty":"Non è vuoto","Last":"Ultimo","LastView":"Ultima vista","LaunchActivate":"Avvia/Attiva","LessThan":"Minore di","LessThanOrEquals":"Minore o uguale a","Links":"Collegamenti","ListTabs":"Elenca tutte le schede","LoadingItem":"Caricamento elemento in corso ","Maintenance":"Gestione","Menu":"Menu","New":"Nuovo","Next":"Successivo","NextView":"Vista successiva","No":"No","NotChecked":"Non selezionato","Notes":"Note","NotSelected":"Non selezionati","Of":"di","Ok":"OK","Open":"Apri","Password":"Password","Paste":"Incolla","Phone":"Telefono","PleaseWait":"Attendere","Previous":"Precedente","PreviousView":"Vista precedente","Print":"Stampa","Queries":"Query","Redo":"Ripeti","Refresh":"Aggiorna","Reject":"Rifiuta","RememberMe":"Memorizza nel computer in uso","Reports":"Report","Reset":"Reimposta","Review":"Rivedi","RunFilter":"Esegui filtro","RunJob":"Esegui processo","Save":"Salva","SaveBeforeClosing":"Salva prima di chiudere","SavedFilters":"Filtri salvati","SaveSubmit":"Salva/Inoltra","ScreenDesign":"Design schermo","Search":"Ricerca","SelectContents":"Seleziona contenuto","SelectDate":"Seleziona data","SelectDeselect":"Seleziona/Deseleziona tutto","Selected":"Selezione corrente:","ServerName":"Nome server","Settings":"Impostazioni","ShowFilterRow":"Mostra riga filtro","SignIn":"Accesso","SortAscending":"Ordinamento crescente","SortDescending":"Ordinamento decrescente","Spreadsheet":"Foglio di lavoro","StartsWith":"Inizia con","StatusIndicator":"Indicatore di stato","Tasks":"Attività","Today":"Oggi","Translate":"Traduci","UserID":"ID utente","Utilities":"Utilità","Yes":"Sì","Page":"Pagina","Rows":"Righe","Showing":"Visualizza Tutti","ListAllMenuItems":"Lista tutti gli elementi del menu","SessionNavigation":"Sessione di Navigazione","ShowingAll":"Visualizza Tutti","NoRecordsFound":"Nessun record trovato","SearchTree":"Ricerca ad albero","Clear":"Cancella","DrillDown":"Praticare Into","Required":"Questo è un campo obbligatorio","Available":"Disponibile:","Add":"Aggiungere","MoveDown":"Sposta giù","MoveUp":"Sposta su","Remove":"Rimuovere","LastYear":"Ultimo anno","NextMonth":"Prossimo Mese","NextWeek":"prossima Settimana","NextYear":"Anno Prossimo","OneMonthAgo":"Un mese fa","OneWeekAgo":"Una settimana fa","SixMonthsAgo":"Sei mesi fa","Time":"tempo","CannotBeSelected":"Questa riga non può essere selezionato","ResetToDefault":"Ripristina layout predefinito","CloseOtherTabs":"Chiudi le altre schede"}
});

}( this ));

/*
 * Globalize Culture ja-JP
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "ja-JP", "default", {
	name: "ja-JP",
	englishName: "Japanese (Japan)",
	nativeName: "日本語 (日本)",
	language: "ja",
	numberFormat: {
		NaN: "NaN (非数値)",
		negativeInfinity: "-∞",
		positiveInfinity: "+∞",
		percent: {
			pattern: ["-n%","n%"]
		},
		currency: {
			pattern: ["-$n","$n"],
			decimals: 0,
			symbol: "¥"
		}
	},
	calendars: {
		standard: {
			days: {
				names: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
				namesAbbr: ["日","月","火","水","木","金","土"],
				namesShort: ["日","月","火","水","木","金","土"]
			},
			months: {
				names: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""],
				namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
			},
			AM: ["午前","午前","午前"],
			PM: ["午後","午後","午後"],
			eras: [{"name":"西暦","start":null,"offset":0}],
			patterns: {
				d: "yyyy/MM/dd",
				D: "yyyy'年'M'月'd'日'",
				t: "H:mm",
				T: "H:mm:ss",
				f: "yyyy'年'M'月'd'日' H:mm",
				F: "yyyy'年'M'月'd'日' H:mm:ss",
				M: "M'月'd'日'",
				Y: "yyyy'年'M'月'"
			}
		},
		Japanese: {
			name: "Japanese",
			days: {
				names: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
				namesAbbr: ["日","月","火","水","木","金","土"],
				namesShort: ["日","月","火","水","木","金","土"]
			},
			months: {
				names: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""],
				namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
			},
			AM: ["午前","午前","午前"],
			PM: ["午後","午後","午後"],
			eras: [{"name":"平成","start":null,"offset":1867},{"name":"昭和","start":-1812153600000,"offset":1911},{"name":"大正","start":-1357603200000,"offset":1925},{"name":"明治","start":60022080000,"offset":1988}],
			twoDigitYearMax: 99,
			patterns: {
				d: "gg y/M/d",
				D: "gg y'年'M'月'd'日'",
				t: "H:mm",
				T: "H:mm:ss",
				f: "gg y'年'M'月'd'日' H:mm",
				F: "gg y'年'M'月'd'日' H:mm:ss",
				M: "M'月'd'日'",
				Y: "gg y'年'M'月'"
			}
		}
	},
	messages : {"AdditionalHelp":"追加のヘルプ","AddNewTab":"タブの新規追加","Alerts":"アラート","ApplyFilter":"フィルターの適用","Approve":"承認","Attachments":"添付","Back":"戻る","Basic":"基本","Between":"次の値の間","Book":"帳簿","Cancel":"キャンセル","Checked":"チェック済","ClearFilter":"フィルターのクリア","Close":"閉じる","CloseCancelChanges":"閉じて変更をキャンセル","CloseSaveChanges":"閉じて変更を保存","CloseTab":"タブを閉じる","ColumnPersonalization":"列の個人設定","Comments":"コメント","Confirmation":"確認","Contains":"含む","CreateTab":"タブの新規作成","Cut":"切り取り","Delete":"削除","DiscardUndo":"破棄/元に戻す","DisplayDropDownList":"ドロップダウンリストを表示","Displaying":"表示中:","DocWord":"ﾄﾞｷｭﾒﾝﾄ","DoesNotContain":"次の値を含まない","DoesNotEndWith":"次の値で終わらない","DoesNotEqual":"次の値に等しくない","DoesNotStartWith":"次の値で始まらない","Download":"ダウンロード","Duplicate":"複製","Edit":"編集","EitherSelectedorNotSelected":"選択済か未選択","Email":"電子メール","EndsWith":"次の値で終了","EqualsStr":"等しい","ExpandCollapse":"展開/折りたたみ","ExportFailed":"エクスポートできませんでした","ExportToExcel":"Excel にエクスポート","FileInUse":"指定のファイルは既に使用されています","FileInUseDetail":"既に使用されているアプリケーションのファイルを閉じるか、別のファイル名を指定します。","Filter":"フィルター","FilterMenu":"フィルターメニュー","FilterOptions":"フィルターオプション","FilterWithinResults":"結果のフィルター","First":"最初","FirstView":"最初のビュー","Folder":"フォルダー","ForgotPassword":"パスワードを忘れた場合","Forward":"進む","GetMoreRows":"追加の行を取得","GreaterThan":"これより大きい","GreaterThanOrEquals":"より大か等しい","GridSettings":"グリッドの設定","GroupSelection":"グループの選択","Help":"ヘルプ","HideColumn":"列を非表示","IsEmpty":"空","IsNotEmpty":"空ではない","Last":"最後","LastView":"最後のビュー","LaunchActivate":"開始/有効化","LessThan":"より小さい","LessThanOrEquals":"より小か等しい","Links":"リンク","ListTabs":"すべてのタブの一覧表示","LoadingItem":"品目をロードしています","Maintenance":"管理","Menu":"メニュー","New":"新規作成","Next":"次へ","NextView":"次のビュー","No":"いいえ","NotChecked":"未チェック","Notes":"注記","NotSelected":"未選択","Of":"/","Ok":"OK","Open":"オープン","Password":"パスワード","Paste":"貼り付け","Phone":"電話","PleaseWait":"お待ちください...","Previous":"前へ","PreviousView":"前のビュー","Print":"印刷","Queries":"クエリ","Redo":"やり直し","Refresh":"リフレッシュ","Reject":"拒否","RememberMe":"このコンピュータに保存する","Reports":"レポート","Reset":"リセット","Review":"レビュー","RunFilter":"フィルターの実行","RunJob":"ジョブの実行","Save":"保存","SaveBeforeClosing":"閉じる前に保存","SavedFilters":"保存したフィルター","SaveSubmit":"保存/送信","ScreenDesign":"画面デザイン","Search":"検索","SelectContents":"コンテンツの選択","SelectDate":"日付を選択","SelectDeselect":"すべて選択/選択解除","Selected":"選択済:","ServerName":"サーバー名","Settings":"設定","ShowFilterRow":"フィルター行の表示","SignIn":"サインイン","SortAscending":"昇順に並べ替え","SortDescending":"降順に並べ替え","Spreadsheet":"スプレッドシート","StartsWith":"次で開始","StatusIndicator":"状況インジケーター","Tasks":"タスク","Today":"今日","Translate":"翻訳","UserID":"ユーザー ID","Utilities":"ユーティリティ","Yes":"はい","Page":"のページ","Rows":"行","Showing":"すべてを表示","ListAllMenuItems":"すべてのメニュー項目を一覧表示します。","SessionNavigation":"セッションのナビゲーション","ShowingAll":"すべてを表示","NoRecordsFound":"関連する情報はありません","SearchTree":"探索木","Clear":"クリア","DrillDown":"ダウンダウン","Required":"このフィールドは必須です。","Available":"使用可能：","Add":"加える","MoveDown":"下に移動","MoveUp":"上がる","Remove":"削除する","LastYear":"昨年","NextMonth":"来月","NextWeek":"来週","NextYear":"来年","OneMonthAgo":"一ヶ月前","OneWeekAgo":"一週間前","SixMonthsAgo":"半年前","Time":"時間","CannotBeSelected":"この行を選択することはできません","ResetToDefault":"デフォルトのレイアウトにリセットする","CloseOtherTabs":"他のタブを閉じます。"}
});

}( this ));

/*
 * Globalize Culture nl-NL
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "nl-NL", "default", {
	name: "nl-NL",
	englishName: "Dutch (Netherlands)",
	nativeName: "Nederlands (Nederland)",
	language: "nl",
	numberFormat: {
		",": ".",
		".": ",",
		percent: {
			",": ".",
			".": ","
		},
		currency: {
			pattern: ["$ -n","$ n"],
			",": ".",
			".": ",",
			symbol: "€"
		}
	},
	calendars: {
		standard: {
			"/": "-",
			firstDay: 1,
			days: {
				names: ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],
				namesAbbr: ["zo","ma","di","wo","do","vr","za"],
				namesShort: ["zo","ma","di","wo","do","vr","za"]
			},
			months: {
				names: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december",""],
				namesAbbr: ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec",""]
			},
			AM: null,
			PM: null,
			patterns: {
				d: "d-M-yyyy",
				D: "dddd d MMMM yyyy",
				t: "H:mm",
				T: "H:mm:ss",
				f: "dddd d MMMM yyyy H:mm",
				F: "dddd d MMMM yyyy H:mm:ss",
				M: "dd MMMM",
				Y: "MMMM yyyy"
			}
		}
	},
	messages: {"AdditionalHelp":"Extra help","AddNewTab":"Nieuw tabblad toevoegen","Alerts":"Alarmeringen","ApplyFilter":"Filter toepassen","Approve":"Goedkeuren","Attachments":"Bijlagen","Back":"Terug","Basic":"Basis","Between":"Tussen","Book":"Boeken","Cancel":"Annuleren","Checked":"Ingeschakeld","ClearFilter":"Filter wissen","Close":"Sluiten","CloseCancelChanges":"Afsluiten en wijzigingen annuleren","CloseSaveChanges":"Afsluiten en wijzigingen opslaan","CloseTab":"Tabblad sluiten","ColumnPersonalization":"Personalisatie kolommen","Comments":"Opmerkingen","Confirmation":"Bevestiging","Contains":"Bevat","CreateTab":"Een  nieuw tabblad aanmaken","Cut":"Knippen","Delete":"Verwijderen","DiscardUndo":"Ongedaan maken","DisplayDropDownList":"Keuzelijst weergeven","Displaying":"Weergave:","DocWord":"Document","DoesNotContain":"Bevat niet","DoesNotEndWith":"Eindigt niet op","DoesNotEqual":"Is niet gelijk aan","DoesNotStartWith":"Begint niet met","Download":"Downloaden","Duplicate":"Kopiëren","Edit":"Bewerken","EitherSelectedorNotSelected":"Ingeschakeld of Uitgeschakeld","Email":"E-mail","EndsWith":"Eindigt op","EqualsStr":"Is gelijk aan","ExpandCollapse":"Uit-/invouwen","ExportFailed":"Exporteren is niet gelukt","ExportToExcel":"Naar Excel exporteren","FileInUse":"Opgegeven bestand is in gebruik","FileInUseDetail":"Sluit het bestand in de applicatie waar het in gebruik is of geef een andere bestandsnaam op.","Filter":"Filter","FilterMenu":"Filtermenu","FilterOptions":"Filteropties","FilterWithinResults":"Binnen resultaten filteren","First":"Eerste","FirstView":"Eerste weergave","Folder":"Map","ForgotPassword":"Bent u uw wachtwoord vergeten?","Forward":"Vooruit","GetMoreRows":"Meer rijen ophalen","GreaterThan":"Groter dan","GreaterThanOrEquals":"Groter dan of gelijk aan","GridSettings":"Rasterinstellingen","GroupSelection":"Groepsselectie","Help":"Help","HideColumn":"Kolom verbergen","IsEmpty":"Is leeg","IsNotEmpty":"Is niet leeg","Last":"Laatste","LastView":"Laatste weergave","LaunchActivate":"Starten/activeren","LessThan":"Kleiner dan","LessThanOrEquals":"Kleiner dan of gelijk aan","Links":"Koppelingen","ListTabs":"Alle tabbladen weergeven","LoadingItem":"Artikel laden","Maintenance":"Onderhoud","Menu":"Menu","New":"Nieuw","Next":"Volgende","NextView":"Volgende weergave","No":"Nee","NotChecked":"Niet ingeschakeld","Notes":"Notities","NotSelected":"Niet geselecteerd","Of":"van","Ok":"OK","Open":"Open","Password":"Wachtwoord","Paste":"Plakken","Phone":"Telefoon","PleaseWait":"Ogenblik svp","Previous":"Vorige","PreviousView":"Vorige weergave","Print":"Afdrukken","Queries":"Query\u0027s","Redo":"Opnieuw uitvoeren","Refresh":"Vernieuwen","Reject":"Afkeuren","RememberMe":"Herinner mij op deze computer","Reports":"Rapporten","Reset":"Herstellen","Review":"Bekijken","RunFilter":"Filter uitvoeren","RunJob":"Job uitvoeren","Save":"Opslaan","SaveBeforeClosing":"Opslaan vóór afsluiten","SavedFilters":"Opgeslagen filters","SaveSubmit":"Opslaan","ScreenDesign":"Schermontwerp","Search":"Zoeken","SelectContents":"Inhoud selecteren","SelectDate":"Een datum selecteren","SelectDeselect":"Alles selecteren /deselecteren","Selected":"Geselecteerd:","ServerName":"Servernaam","Settings":"Instellingen","ShowFilterRow":"Filterrij tonen","SignIn":"Aanmelden","SortAscending":"Oplopend sorteren","SortDescending":"Aflopend sorteren","Spreadsheet":"Rekenblad","StartsWith":"Begint met","StatusIndicator":"Statusindicator","Tasks":"Taken","Today":"Vandaag","Translate":"Vertalen","UserID":"Gebruiker-ID","Utilities":"Hulpprogramma\u0027s","Yes":"Ja","Page":"Pagina","Rows":"Rijen","Showing":"Met Daarop Alle","ListAllMenuItems":"Lijst met alle menu-items","SessionNavigation":"sessie Navigatie","ShowingAll":"Met Daarop Alle","NoRecordsFound":"Geen gegevens gevonden","SearchTree":"Zoeken Boom","Clear":"Wis","DrillDown":"Boren Beneden","Required":"Dit is een verplicht veld","Available":"Beschikbaar:","Add":"Toevoegen","MoveDown":"Omlaag","MoveUp":"Omhoog","Remove":"Verwijderen","LastYear":"Afgelopen jaar","NextMonth":"Volgende maand","NextWeek":"Volgende week","NextYear":"Volgend jaar","OneMonthAgo":"Een maand geleden","OneWeekAgo":"Een week geleden","SixMonthsAgo":"Zes maanden geleden","Time":"tijd","CannotBeSelected":"Deze rij kan niet worden geselecteerd","ResetToDefault":"Fabrieksinstellingen lay-out","CloseOtherTabs":"Andere tabbladen sluiten"}
});

}( this ));

/*
 * Globalize Culture pt-BR
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "pt-BR", "default", {
	name: "pt-BR",
	englishName: "Portuguese (Brazil)",
	nativeName: "Português (Brasil)",
	language: "pt",
	numberFormat: {
		",": ".",
		".": ",",
		NaN: "NaN (Não é um número)",
		negativeInfinity: "-Infinito",
		positiveInfinity: "+Infinito",
		percent: {
			pattern: ["-n%","n%"],
			",": ".",
			".": ","
		},
		currency: {
			pattern: ["-$ n","$ n"],
			",": ".",
			".": ",",
			symbol: "R$"
		}
	},
	calendars: {
		standard: {
			days: {
				names: ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],
				namesAbbr: ["dom","seg","ter","qua","qui","sex","sáb"],
				namesShort: ["D","S","T","Q","Q","S","S"]
			},
			months: {
				names: ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro",""],
				namesAbbr: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"d.C.","start":null,"offset":0}],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd, d' de 'MMMM' de 'yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dddd, d' de 'MMMM' de 'yyyy HH:mm",
				F: "dddd, d' de 'MMMM' de 'yyyy HH:mm:ss",
				M: "dd' de 'MMMM",
				Y: "MMMM' de 'yyyy"
			}
		}
	},
	messages: {"AdditionalHelp":"Ajuda adicional","AddNewTab":"Adicionar nova guia","Alerts":"Alertas","ApplyFilter":"Aplicar filtro","Approve":"Aprovar","Attachments":"Anexos","Back":"Voltar","Basic":"Básico","Between":"Entre","Book":"Livro","Cancel":"Cancelar","Checked":"Verificado","ClearFilter":"Limpar filtro","Close":"Fechar","CloseCancelChanges":"Fechar e cancelar alterações","CloseSaveChanges":"Fechar e salvar alterações","CloseTab":"Fechar guia","ColumnPersonalization":"Personalização de coluna","Comments":"Comentários","Confirmation":"Confirmação","Contains":"Contém","CreateTab":"Criar uma nova Guia","Cut":"Cortar","Delete":"Excluir","DiscardUndo":"Descartar/Desfazer","DisplayDropDownList":"Exibir lista suspensa","Displaying":"Exibindo:","DocWord":"Documento","DoesNotContain":"Não contém","DoesNotEndWith":"Não termina com","DoesNotEqual":"Não é igual à","DoesNotStartWith":"Não começa com","Download":"Fazer download","Duplicate":"Duplicar","Edit":"Editar","EitherSelectedorNotSelected":"Selecionado ou não selecionado","Email":"Email","EndsWith":"Termina com","EqualsStr":"É igual a","ExpandCollapse":"Expandir/Recolher","ExportFailed":"Falha na Exportação","ExportToExcel":"Exportar para Excel","FileInUse":"O arquivo especificado está em uso","FileInUseDetail":"Feche o arquivo no aplicativo onde está sendo usado ou especifique um outro nome de arquivo.","Filter":"Filtro","FilterMenu":"Menu Filtro","FilterOptions":"Opções de filtro","FilterWithinResults":"Filtro nos resultados","First":"Primeiro","FirstView":"Primeira visualização","Folder":"Pasta","ForgotPassword":"Esqueceu a senha?","Forward":"Encaminhar","GetMoreRows":"Obter mais linhas","GreaterThan":"É maior que","GreaterThanOrEquals":"É maior que ou igual a","GridSettings":"Configurações de grade","GroupSelection":"Seleção de grupo","Help":"Ajuda","HideColumn":"Ocultar coluna","IsEmpty":"Está vazio","IsNotEmpty":"Não está vazio","Last":"Último","LastView":"Última visualização","LaunchActivate":"Iniciar/Ativar","LessThan":"É menor que","LessThanOrEquals":"É menor que ou igual a","Links":"Links","ListTabs":"Listar todas as guias","LoadingItem":"Carregando item","Maintenance":"Manutenção","Menu":"Menu","New":"Novo","Next":"Próximo","NextView":"Próxima visualização","No":"Não","NotChecked":"Não verificado","Notes":"Notas","NotSelected":"Não selecionado","Of":" de","Ok":"OK","Open":"Abrir","Password":"Senha","Paste":"Colar","Phone":"Telefone","PleaseWait":"Aguarde","Previous":"Anterior","PreviousView":"Visualização anterior","Print":"Imprimir","Queries":"Consultas","Redo":"Refazer","Refresh":"Atualizar","Reject":"Rejeitar","RememberMe":"Lembrar de mim neste computador","Reports":"Relatórios","Reset":"Redefinir","Review":"Revisar","RunFilter":"Executar filtro","RunJob":"Executar trabalho","Save":"Salvar","SaveBeforeClosing":"Salvar antes de fechar","SavedFilters":"Filtros salvos","SaveSubmit":"Salvar/Enviar","ScreenDesign":"Design de tela","Search":"Buscar","SelectContents":"Selecionar conteúdo","SelectDate":"Selecionar uma data","SelectDeselect":"Selecionar/Deselecionar todos","Selected":"Selecionado:","ServerName":"Nome do servidor","Settings":"Configurações","ShowFilterRow":"Mostrar linha de filtro","SignIn":"Conectar","SortAscending":"Classificação ascendente","SortDescending":"Classificação descendente","Spreadsheet":"Planilha","StartsWith":"Começa com","StatusIndicator":"Indicador de status","Tasks":"Tarefas","Today":"Hoje","Translate":"Traduzir","UserID":"ID de usuário","Utilities":"Utilitários","Yes":"Sim","Page":"Página","Rows":"Linhas","Showing":"Mostrar Todos os","ListAllMenuItems":"Listar todos os itens do menu","SessionNavigation":"sessão de Navegação","ShowingAll":"Exibindo todos os","SearchTree":"Árvore de Busca","Clear":"Limpar","DrillDown":"Detalhamento","Required":"Este é um campo obrigatório","Available":"disponível:","Add":"adicionar","MoveDown":"mover para baixo","MoveUp":"mover para cima","Remove":"remover","LastYear":"Ano passado","NextMonth":"próximo mês","NextWeek":"próxima Semana","NextYear":"próximo ano","OneMonthAgo":"Um mês atrás","OneWeekAgo":"Há uma semana","SixMonthsAgo":"Six Months Ago","Time":"tempo","CannotBeSelected":"Esta linha não pode ser selecionado.","ResetToDefault":"Redefinir para Layout Padrão","CloseOtherTabs":"Feche os outros separadores"}
});

}( this ));

/*
 * Globalize Culture zh-CN
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "zh-CN", "default", {
	name: "zh-CN",
	englishName: "Chinese (Simplified, PRC)",
	nativeName: "中文(中华人民共和国)",
	language: "zh-CHS",
	numberFormat: {
		NaN: "非数字",
		negativeInfinity: "负无穷大",
		positiveInfinity: "正无穷大",
		percent: {
			pattern: ["-n%","n%"]
		},
		currency: {
			pattern: ["$-n","$n"],
			symbol: "¥"
		}
	},
	calendars: {
		standard: {
			days: {
				names: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
				namesAbbr: ["周日","周一","周二","周三","周四","周五","周六"],
				namesShort: ["日","一","二","三","四","五","六"]
			},
			months: {
				names: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""],
				namesAbbr: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""]
			},
			AM: ["上午","上午","上午"],
			PM: ["下午","下午","下午"],
			eras: [{"name":"公元","start":null,"offset":0}],
			patterns: {
				d: "yyyy/M/d",
				D: "yyyy'年'M'月'd'日'",
				t: "H:mm",
				T: "H:mm:ss",
				f: "yyyy'年'M'月'd'日' H:mm",
				F: "yyyy'年'M'月'd'日' H:mm:ss",
				M: "M'月'd'日'",
				Y: "yyyy'年'M'月'"
			}
		}
	},
	messages: {"AdditionalHelp":"附加帮助","AddNewTab":"新添选项卡","Alerts":"警报","ApplyFilter":"应用筛选器","Approve":"批准","Attachments":"附件","Back":"后","Basic":"基本","Between":"介于","Book":"账簿","Cancel":"取消","Checked":"已选中","ClearFilter":"清除筛选器","Close":"关闭","CloseCancelChanges":"关闭并取消更改","CloseSaveChanges":"关闭并取消更改","CloseTab":"关闭选项卡","ColumnPersonalization":"列个性化设置","Comments":"备注","Confirmation":"确认","Contains":"包含","CreateTab":"创建新选项卡","Cut":"剪切","Delete":"删除","DiscardUndo":"放弃/撤消","DisplayDropDownList":"显示下拉列表","Displaying":"显示内容: ","DocWord":"文档","DoesNotContain":"不包含","DoesNotEndWith":"终结值非","DoesNotEqual":"不等于","DoesNotStartWith":"起始值非","Download":"下载","Duplicate":"复制","Edit":"编辑","EitherSelectedorNotSelected":"选定项或非选定项","Email":"电子邮件","EndsWith":"终结值为","EqualsStr":"等于","ExpandCollapse":"展开/折叠","ExportFailed":"导出失败","ExportToExcel":"导出至 Excel","FileInUse":"指定的文件在使用中","FileInUseDetail":"请在相关的应用程序中关闭此文件，或者指定其他文件名。","Filter":"筛选器","FilterMenu":"筛选菜单","FilterOptions":"筛选选项","FilterWithinResults":"在结果中筛选","First":"第一个","FirstView":"第一个视图","Folder":"文件夹","ForgotPassword":"忘记密码?","Forward":"前","GetMoreRows":"获取更多行","GreaterThan":"大于","GreaterThanOrEquals":"大于或等于","GridSettings":"表格设置","GroupSelection":"组选择","Help":"帮助","HideColumn":"隐藏列","IsEmpty":"为空","IsNotEmpty":"非空","Last":"最后一个","LastView":"最后一个视图","LaunchActivate":"启动/激活","LessThan":"小于","LessThanOrEquals":"小于或等于","Links":"链接","ListTabs":"列举所有选项卡","LoadingItem":"加载项目","Maintenance":"维护","Menu":"菜单","New":"新建","Next":"下一个","NextView":"下一个视图","No":"否","NotChecked":"未选中","Notes":"注释","NotSelected":"未选择","Of":"/","Ok":"确定","Open":"打开","Password":"密码","Paste":"粘贴","Phone":"电话","PleaseWait":"请稍候","Previous":"上一个","PreviousView":"上一个视图","Print":"打印","Queries":"查询","Redo":"重做","Refresh":"刷新","Reject":"拒绝","RememberMe":"在本机记录我的登录信息","Reports":"报表","Reset":"重置","Review":"审阅","RunFilter":"运行筛选程序","RunJob":"运行作业","Save":"保存","SaveBeforeClosing":"先保存后关闭","SavedFilters":"保存筛选程序","SaveSubmit":"保存/提交","ScreenDesign":"屏幕设计","Search":"搜索","SelectContents":"选择内容","SelectDate":"选择日期","SelectDeselect":"全选/撤消全选","Selected":"选定:","ServerName":"服务器名称","Settings":"设置","ShowFilterRow":"选择筛选行","SignIn":"登录","SortAscending":"升序排序","SortDescending":"降序排序","Spreadsheet":"电子表格","StartsWith":"起始值为","StatusIndicator":"状态指示符","Tasks":"任务","Today":"今天","Translate":"翻译","UserID":"用户 ID","Utilities":"实用工具","Yes":"是","Page":"页","Rows":"行","Showing":"显示所有","ListAllMenuItems":"列出所有的菜单项","SessionNavigation":"会议导航","ShowingAll":"显示所有","NoRecordsFound":"沒有找到记录","SearchTree":"搜索树","Clear":"清除","DrillDown":"向下钻取","Required":"这是一个必需字段","Available":"可供选择：","Add":"增加","MoveDown":"下移","MoveUp":"上移","Remove":"减去","LastYear":"去年","NextMonth":"下个月","NextWeek":"下周","NextYear":"明年","OneMonthAgo":"一个月前","OneWeekAgo":"一个星期前","SixMonthsAgo":"六个月前","Time":"时间","CannotBeSelected":"此行不能选择","ResetToDefault":"重置为默认布局","CloseOtherTabs":"关闭其他标签"}
});

}( this ));

/*
 * Infor Radio Button - An styled replacement for the html radio button.
 */
(function ($) {
	$.widget( "ui.inforRadioButton", {
		_init: function() {
			this.create();
		},
		create: function() {
			//Wrap the buttons in a label
			var radio = this.element;
			var label = null;
			var startLabel = radio.next("label");
			var groupName = radio.attr("name");
			
			if (!radio.parent().hasClass("inforRadioButtonLabel")) {
				label = $('<label class="inforRadioButtonLabel" for="'+radio.attr("id")+'"></label>');
				radio.empty();
				
				if (radio.is(":checked"))
					label.addClass("checked");
				
				if (radio.is(":disabled"))
					label.addClass("disabled");
				
				//set initial states and values
				radio.wrap(label);
				
				radio.click(function () {
					var $this=$(this);
					//uncheck everything else in that group
					$('input[name="'+groupName+'"]').parent().removeClass("checked");	
					$this.parent().addClass("checked");	
				});
				
				radio.focus(function () {
					var $this=$(this);
					//unfocus everything else in that group
					$('input[name="'+groupName+'"]').parent().removeClass("focus");	
					$this.parent().addClass("focus");	
				});
				
				//add hover states
				radio.hover(function() {
					$(this).parent().addClass("hover");	
				}, function() {
					$(this).parent().removeClass("hover");	
				});
				
				//update label
				radio.after(startLabel.html());
				startLabel.remove();
				//correction for IE and Right to left padding.
				var parent = radio.parent();
				if (Globalize.culture().isRTL && $.browser.msie && !parent.parent().is("td") && parent.next().is("br")) {
					radio.parent().css({"padding-right":"20px"});
					radio.css({"text-align":"right","position":"relative", "top":"3px", "right": "-"+radio.parent().width()+"px"});
					radio.parent().find(".inforRadioButtonLabel:first").css("padding-right","0");
					
					//correct an issue if there is no top label.
					if (radio.closest(".inforRadioButtonSet").find(".inforTopLabel").length==0) {
						var first = radio.closest(".inforRadioButtonSet").find(".inforRadioButtonLabel:first");
						first.css({"padding-right":"0px"});
						first.find("input").css({"margin-right":"-2px","text-align":"right","left":"-3px", "right":""});
					}
				}
			} 
		}
	});
})(jQuery);
/*
* Infor Page Level Mesages 
*
* http://www.infor.com
*
* Depends:
*    jquery
*    jqueryUI
*/
(function ($) {
    $.widget("ui.inforPageLevelMessage", {
        options: {
            autoDismiss: false,            // automatically close the message
            autoDismissTimeout: 3000,      // time to keep window open if auto dismiss is true - VSG says 3 so U shouldnt need to change this.
            errorMessage: null,            // actual message to show
            messageType: 'Info',           // Info or Alert or Error
            messageTitle: null,            // title for message
            showClose: true                // show the close "X" or not
        },
		 _init: function () {
            var self = this;
            self.open();
        },
        open: function () {
            var self = this,
            options = self.options;
			
			//remove the last message
			var divTag = $('.inforPageLevelMessage');
			var isOpen = divTag.is(":visible");
			
			if (!isOpen)	
				divTag = $('<div style="display:none" class="inforPageLevelMessage"><table cellspacing="0" cellpadding="0" style="width: 706px;"><tbody><tr class="popupTop"><td class="popupTopLeft"></td><td class="popupTopCenter"></td><td class="popupTopRight"></td></tr><tr class="popupMiddle"><td class="popupMiddleLeft"></td><td class="popupMiddleCenter" style="width: 652px;"><div class="popupMiddleCenterInner content"><div class="inforCloseButtonDark"></div></div></td><td class="popupMiddleRight"></td></tr><tr class="popupBottom"><td class="popupBottomLeft"></td><td class="popupBottomCenter"></td><td class="popupBottomRight"></td></tr></tbody></table></div>');
			
			//calculation to center in the screen...we want a ten pixel margin on each side..
			var centerWidth=$(document).width()-40;			//706;
			divTag.find('table').width(centerWidth);
			divTag.find('.popupMiddleCenter').width(centerWidth-54);	//54 is the width of the images the compose the border.
			
			var severityImage= null;
			var isError = divTag.find(".popupMiddleLeft").hasClass("error");
			
			//adjust the images and background - there is a hierarchy - if there is an error the whole thing is red.
			if (options.messageType=='Info' && !isError) {
				divTag.find(".popupMiddleLeft").addClass("info");
				divTag.find(".popupMiddleRight").addClass("info");
				divTag.find(".popupBottomLeft").addClass("info");
				divTag.find(".popupBottomCenter").addClass("info");
				divTag.find(".popupBottomRight").addClass("info");
			}
			
			if (options.messageType=='Info')
				severityImage = $("<div class='severityImage'></div>").removeClass("alert").removeClass("error").addClass("info");
			
			if (options.messageType=='Alert' && !isError) {
				divTag.find(".popupMiddleLeft").addClass("alert");
				divTag.find(".popupMiddleRight").addClass("alert");
				divTag.find(".popupBottomLeft").addClass("alert");
				divTag.find(".popupBottomCenter").addClass("alert");
				divTag.find(".popupBottomRight").addClass("alert");
			}
			
			if (options.messageType=='Alert')
				severityImage = $("<div class='severityImage'></div>").removeClass("info").removeClass("error").addClass("alert");
			
			if (options.messageType=='Error') {
				divTag.find(".popupMiddleLeft").removeClass("info").removeClass("alert").addClass("error");
				divTag.find(".popupMiddleRight").removeClass("info").removeClass("alert").addClass("error");
				divTag.find(".popupBottomLeft").removeClass("info").removeClass("alert").addClass("error");
				divTag.find(".popupBottomCenter").removeClass("info").removeClass("alert").addClass("error");
				divTag.find(".popupBottomRight").removeClass("info").removeClass("alert").addClass("error");
				severityImage = $("<div class='severityImage'></div>").removeClass("info").removeClass("alert").addClass("error");
			}
			
			//Create a message area object
			var messageDiv = $('<div class="messageField"><div class="header">'+(options.messageTitle==null ?'':options.messageTitle)+'</div><div class="body message">'+(options.errorMessage==null ?'':options.errorMessage)+'</div></div>');
			
			divTag.find(".popupMiddleCenterInner").append(messageDiv);
			var prevImage = $(".severityImage").last();
			
			if (isOpen) {
				messageDiv.addClass("indent");
			}
			
			var prevclass = (prevImage.length==0 ? "" : prevImage.attr("class").toLowerCase().replace("severityimage ","")),
				currMessage = options.messageType.toLowerCase();
			
			if (prevImage.length==0 || prevclass!=currMessage) {
				if (prevImage.length==0)
					messageDiv.before(severityImage).removeClass("indent");
				else
					messageDiv.before(severityImage.css("margin-top","10px")).removeClass("indent").css("margin-top","10px");
			}
			
			//setup the auto dismiss...
			if (options.autoDismiss && !isOpen) {
				var f = function () { 
						if (options.messageType == "Info" || options.messageType == "Alert" )
							self.close(); 
						else
							clearTimeout(f);
				};
                setTimeout(f, options.autoDismissTimeout);
			}
			
			//setup the close button
			var closeButton = divTag.find(".inforCloseButtonDark");
			closeButton.attr("title",Globalize.localize("Close"));
			
			if (options.showClose){	
				closeButton.show();
				closeButton.click(function() {
					self.close();
				});
			} else {
				if (!isOpen)
					closeButton.hide();
			}
			
			//add and animate
			if (!isOpen)
			{
				$('body').append(divTag);
				divTag.show('blind');
			}
        },
		close: function () {
            var msgDiv =$(".inforPageLevelMessage")
			msgDiv.fadeTo('slow',0, function(){
				msgDiv.remove();
			});
        }
    });
})(jQuery);




/*
* Infor MessageDialog and Dialog is heavily based on jQuery UI Dialog 1.8.13
*/
(function ($, undefined) {
    var uiDialogClasses =
        'inforDialog' ,
    sizeRelatedOptions = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    },
    resizableRelatedOptions = {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    },
    attrFn = $.attrFn || {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true,
        click: true
    };
    $.widget("ui.inforDialog", {
        options: {
            autoOpen: true,
            buttons: {},
            closeOnEscape: false,
            closeText: 'Close',
            dialogType: 'General',
            draggable: true,
            hide: null,
            height: 'auto',
            maxHeight: false,
            maxWidth: false,
            messageTitle: '',
            minHeight: 150,
            minWidth: 150,
            modal: false,
			shortMessage: '',
			detailedMessage: '',
            position: {
                my: 'center',
                at: 'center',
                collision: 'fit',
			    using: function (pos) {
				  	
					$(this).css({
						position: 'absolute',
						left: '50%',
						'margin-left': 0 - ($(this).width() / 2),
						top: '40%',
						'margin-top': (0 - ($(this).height() / 3))
					});
					
					/*nned to call twice for some reason to center in the page...*/
					$(this).css({
						position: 'absolute',
						left: '50%',
						'margin-left': 0 - ($(this).width() / 2),
						top: '40%',
						'margin-top': (0 - ($(this).height() / 3))
					});
				}
            },
            resizable: false,
            show: null,
            stack: true,
            title: '',
            width: 300,
            zIndex: 1000,
			close: null,	//a call back that fires when the close x is clicked.
			beforeClose: null //a callback that fires when the close button is clicked.
        },
        _create: function () {
           var self = this,
            options = self.options,
			title = options.title || '&#160;',
            uiDialog = (self.uiDialog = $('<div><table cellspacing="0" cellpadding="0" class="" style="width: inherit"><tbody><tr class="dialogTop"><td class="dialogTopLeft"></td><td class="dialogTopCenter"><div class="dialogTopCenterInner"></div></td></div><td class="dialogTopRight"><div class="dialogTopRightInner"><button type="button" tabindex="0" class="inforCloseButton"></button></div></td></tr><tr class="dialogMiddle"><td class="dialogMiddleLeft"></td><td class="dialogMiddleCenter"><div class="dialogMiddleCenterInner dialogContent"><div class="dialogOuterBackground"><div class="dialogInnerBackground"></div></div><table> <tr> <td><div class="severityImage"></div></td> <td><div class="dialogHeader">An Error Occured</div></td> </tr> <tr> <td></td> <td><div style="display: block;" class="contentText"> </div></td> </tr> </table> </div></div></td><td class="dialogMiddleRight"></td></tr><tr class="dialogBottom"><td class="dialogBottomLeft"></td><td class="dialogBottomCenter"><div class="dialogBottomCenterInner"><div class="dialogButtonBar"></div></div></td><td class="dialogBottomRight"></td></tr></tbody></table>'))
                .appendTo(document.body)
                .hide()
                .addClass(uiDialogClasses)
                .css({
                    zIndex: options.zIndex
                })
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
                .attr('tabIndex', -1).css('outline', 0).keydown(function (event) {
                    if (options.closeOnEscape && event.keyCode &&
                        event.keyCode === $.ui.keyCode.ESCAPE) {

                        self.close(event);
                        event.preventDefault();
                    }
                })
                .mousedown(function (event) {
                    self.moveToTop(false, event);
                });
				
                uiDialog.find(".dialogTopCenterInner").append('<div class="Caption">'+title+'</div>');
                 
				self.element.show()
                    .removeAttr('title')
                    .appendTo(uiDialog.find('.dialogContent'));
				
				//Add remove events for the inforCloseButton  
				uiDialogTitlebarClose = uiDialog.find(".inforCloseButton");
				uiDialogTitlebarClose.attr("title",Globalize.localize(options.closeText));
				uiDialogTitlebarClose.click(function (event) {
						self.close(event);
                        return false;
                    });
				
				if (options.draggable && $.fn.draggable) {
					self._makeDraggable();
				}
				if (options.resizable && $.fn.resizable) {
					self._makeResizable();
				}

				self._isOpen = false;
      },

        _init: function () {
            if (this.options.autoOpen) {
                this.open();
            }
        },
		widgetEventPrefix : 'dialog',
		 destroy: function () {
            var self = this;

            if (self.overlay) {
                self.overlay.destroy();
            }
            self.uiDialog.hide();
            self.element
            .unbind('.dialog')
            .removeData('dialog')
            .hide().appendTo('body');
            self.uiDialog.remove();
            return self;
        },

        widget: function () {
            return this.uiDialog;
        },

        close: function (event) {
           	var self = this,
            maxZ, thisZ;

            if (false === self._trigger('beforeClose', event)) {
                return;
            }

            if (self.overlay) {
                self.overlay.destroy();
            }
            
			self.uiDialog.unbind('keypress.inforDialog');
			$(document).unbind('keydown.inforDialog');
			
			if (self.firstTabbable)
				self.firstTabbable.remove();
				
            self._isOpen = false;

            if (self.options.hide) {
                self.uiDialog.hide(self.options.hide, function () {
                    self._trigger('close', event);
                });
            } else {
                self.uiDialog.hide();
                self._trigger('close', event);
            }
			             
            $.ui.inforDialog.overlay.resize();

            // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
            if (self.options.modal) {
                maxZ = 0;
                $('.inforDialog').each(function () {
                    if (this !== self.uiDialog[0]) {
                        thisZ = $(this).css('z-index');
                        if (!isNaN(thisZ)) {
                            maxZ = Math.max(maxZ, thisZ);
                        }
                    }
                });
                $.ui.inforDialog.maxZ = maxZ;
            }

            self.options.position = '';         // reset any previously sent dialog positions

            return self;
        },

        isOpen: function () {
            return this._isOpen;
        },

        // the force parameter allows us to move modal dialogs to their correct
        // position on open
        moveToTop: function (force, event) {
            var self = this,
            options = self.options,
            saveScroll;

            if ((options.modal && !force) ||
            (!options.stack && !options.modal)) {
                return self._trigger('focus', event);
            }

            if (options.zIndex > $.ui.inforDialog.maxZ) {
                $.ui.inforDialog.maxZ = options.zIndex;
            }
            if (self.overlay) {
                $.ui.inforDialog.maxZ += 1;
                self.overlay.$el.css('z-index', $.ui.inforDialog.overlay.maxZ = $.ui.inforDialog.maxZ);
            }

            //Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
            //  http://ui.jquery.com/bugs/ticket/3193
            saveScroll = { scrollTop: self.element.attr('scrollTop'), scrollLeft: self.element.attr('scrollLeft') };
            $.ui.inforDialog.maxZ += 1;
            self.uiDialog.css('z-index', $.ui.inforDialog.maxZ);
            self.element.attr(saveScroll);
            self._trigger('focus', event);

            return self;
        },
		firstTabbable: null,
        open: function () {
            if (this._isOpen) { return; }
			
            var self = this,
			$topDiv = $(self.element.parent()),
            options = self.options,
            uiDialog = self.uiDialog;

			//set messages
			if (self.options.messageTitle!='')
				uiDialog.find(".dialogHeader").html(self.options.messageTitle);
			
			uiDialog.find(".dialogTopCenterInner .Caption").html(self.options.title);
                  
            //for any of the message types - info/error/confirmation/warning show an icon
			var imageClass = "";
			if (options.dialogType == "Information")
                imageClass = "info";
				
            if (options.dialogType == "Confirmation") 
                imageClass = "confirmation";
            
			if (options.dialogType == "Error") 
                imageClass = "error";
            
			if (options.dialogType == "Alert") 
                imageClass = "alert";
            
			if (options.dialogType == "General") {
                $(".inforMessageDialogContent").find(".detailText").remove();
				imageClass = "";
            }
			
            self._createButtons(options.buttons);
			
			//hide/show the close button
			if (!self.options.showTitleClose)
				uiDialog.find(".inforCloseButton").hide();
			else
				uiDialog.find(".inforCloseButton").show();
			
			//add/update remove the severity image.
			var severityImage = uiDialog.find(".severityImage");
			if (imageClass == "") {
				severityImage.remove();
			} else {
				severityImage.removeClass();
				severityImage.addClass("severityImage "+imageClass);
			}
				
			//Add/update remove the Detail Message
			//contentText
			if (options.dialogType =="General")
				uiDialog.find(".contentText").closest("table").remove();
			else
				uiDialog.find(".contentText").html(self.options.detailedMessage);
			
			self.overlay = options.modal ? new $.ui.inforDialog.overlay(self) : null;
			//set the title
			$topDiv.find(".Caption").html(self.options.title);
            
			self._size();
            self._position(options.position);
			self.moveToTop(true);
			uiDialog.fadeIn();	
			
			self.firstTabbable = $("<button id='tabFocusField' ></button>")
				.css({"opacity":"0" , "position":"absolute" , "left":"-400px"})
				.focus(function(e) {
					self.uiDialog.find(':tabbable:first').focus();
					return;
				}).prependTo("body");
			
			// prevent tabbing out of modal and non-modal dialogs
            $(document).bind('keydown.inforDialog', function (event) {
                     if (event.keyCode==13)
					 {
						//find the default button and press it...
						var defaButton = self.uiDialog.find(".inforFormButton.default");
						if (!defaButton.is(":focus"))
							defaButton.trigger('click');
							
						return;
					 }
					 
					if (event.keyCode !== $.ui.keyCode.TAB) {
                        return;
                    }
					
                    var tabbables = $(':tabbable', self.uiDialog),
                    first = tabbables.filter(':first'),
                    last = tabbables.filter(':last');
					
					if (event.target.nodeName =="HTML") {
						//tabbed in from the address bar to the page
						first.focus(1);
                        return false;
					}
                    if (event.target === last[0] && !event.shiftKey) {
                        first.focus(1);
                        return false;
                    } else if (event.target === first[0] && event.shiftKey) {
                        last.focus(1);
                        return false;
                    }
                });
            
			 // set focus to the first tabbable element in the content area or the first button
             // if there are no tabbable elements, set focus on the dialog itself
             setTimeout(function(){
				var firstInput = self.uiDialog.find('input:first:visible:tabbable');
                
				if (firstInput.length==0)
                    firstInput= self.uiDialog.find('textarea:first:visible:tabbable');

				if (firstInput.length>0) {
					firstInput.focus();
					firstInput.select();
				} else
				{
					self.uiDialog.focus();
				}
			 }, 400);
			 
			self._isOpen = true;
            self._trigger('open');
			
            return self;
        },

        _createButtons: function (buttons) {
           var self = this,
            hasButtons = false,
            uiButtonBar = self.uiDialog.find(".dialogButtonBar");
			
            // if we already have a button pane, remove it
            uiButtonBar.empty();
			
            if (typeof buttons === 'object' && buttons !== null) {
                $.each(buttons, function () {
                    return !(hasButtons = true);
                });
            }
            if (hasButtons) {
                $.each(buttons, function (name, props) {
                    props = $.isFunction(props) ?
                    { click: props, text: name} :
                    props;
                    var button = $('<button type="button" class="inforFormButton"></button>')
                    .click(function () {
                        props.click.apply(self.element[0], arguments);
                    })
                    .appendTo(uiButtonBar);
                   $.each(props, function (key, value) {
                        if (key === "click") {
                            return;
                        }
						if (key === "isDefault") {
                            button.addClass("default");
						}
                        if (key in attrFn) {
                           button[key](value);
                        } else {
                           button.attr(key, value);
                        }
                    });
                    if ($.fn.button) {
                        button.button();
                    }
                });
                //add infor form button styling
				uiButtonBar.find(".inforFormButton").inforFormButton();
            }
        },

        _makeDraggable: function () {
            var self = this,
            options = self.options,
            doc = $(document),
            heightBeforeDrag;

            function filteredUi(ui) {
                return {
                    position: ui.position,
                    offset: ui.offset
                };
            }
			
            self.uiDialog.draggable({
                cancel: '.inforMessageDialogContent, .inforMessageDialogTitlebarClose',
                handle: '.dialogTop',
                containment: 'document',
                start: function (event, ui) {
                    heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
                    $(this).height($(this).height());
                    self._trigger('dragStart', event, filteredUi(ui));
					$(".inforMenu").hide();	//closes any open drop downs or menus.
                },
                drag: function (event, ui) {
                    self._trigger('drag', event, filteredUi(ui));
                },
                stop: function (event, ui) {
                    options.position = [ui.position.left - doc.scrollLeft(),
                    ui.position.top - doc.scrollTop()];
                    $(this).height(heightBeforeDrag);
                    self._trigger('dragStop', event, filteredUi(ui));
                    $.ui.inforDialog.overlay.resize();
                }
            });
        },

        _makeResizable: function (handles) {
            var self = this;
			
			self.uiDialog.resizable({
                handles: "se",
				minWidth: (self.options.minWidth <250 ? 250 : self.options.minWidth),
				minHeight: (self.options.minHeight <100 ? 100 : self.options.minHeight),
				maxWidth: self.options.maxWidth,
				maxHeight: self.options.maxHeight,
				alsoResize: $(self.element, self.element.parent())
            });
			
			//move the resize element so its placed in the right spot
			var bottom = self.uiDialog.find(".dialogBottomRight");
			self.uiDialog.find(".ui-resizable-handle").appendTo(bottom).css({"position":"relative", "top":"1px" , "left": "5px"});
		},

        _minHeight: function () {
            var options = this.options;

            if (options.height === 'auto') {
                return options.minHeight;
            } else {
                return Math.min(options.minHeight, options.height);
            }
        },

        _position: function (position) {
           var myAt = [],
            offset = [0, 0],
            isVisible;

            if (position) {
                if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
                    myAt = position.split ? position.split(' ') : [position[0], position[1]];
                    if (myAt.length === 1) {
                        myAt[1] = myAt[0];
                    }

                    $.each(['left', 'top'], function (i, offsetPosition) {
                        if (+myAt[i] === myAt[i]) {
                            offset[i] = myAt[i];
                            myAt[i] = offsetPosition;
                        }
                    });

                    position = {
                        my: myAt.join(" "),
                        at: myAt.join(" "),
                        offset: offset.join(" ")
                    };
                }

                position = $.extend({}, $.ui.inforDialog.prototype.options.position, position);
            } else {
                position = $.ui.inforDialog.prototype.options.position;
            }

            // need to show the dialog to get the actual offset in the position plugin
            isVisible = this.uiDialog.is(':visible');
            if (!isVisible) {
                this.uiDialog.show();
            }
			
            this.uiDialog.position($.extend({ of: window }, position));
				
            if (!isVisible) {
                this.uiDialog.hide();
            }
        },

        _setOptions: function (options) {
            var self = this,
            resizableOptions = {},
            resize = false;

            $.each(options, function (key, value) {
                self._setOption(key, value);

                if (key in sizeRelatedOptions) {
                    resize = true;
                }
                if (key in resizableRelatedOptions) {
                    resizableOptions[key] = value;
                }
            });

            if (resize) {
                this._size();
            }
            if (this.uiDialog.is(":data(resizable)")) {
                this.uiDialog.resizable("option", resizableOptions);
            }
        },

        _setOption: function (key, value) {
            var self = this,
            uiDialog = self.uiDialog;

            switch (key) {
                //handling of deprecated beforeclose (vs beforeClose) option                                       
                //Ticket #4669 http://dev.jqueryui.com/ticket/4669                                       
                //TODO: remove in 1.9pre                                       
                case "beforeclose":
                    key = "beforeClose";
                    break;
                case "buttons":
                    self._createButtons(value);
                    break;
                case "disabled":
                    if (value) {
                        uiDialog.addClass('inforMessageDialogDisabled');
                    } else {
                        uiDialog.removeClass('inforMessageDialogDisabled');
                    }
                    break;
                case "draggable":
                    var isDraggable = uiDialog.is(":data(draggable)");
                    if (isDraggable && !value) {
                        uiDialog.draggable("destroy");
                    }

                    if (!isDraggable && value) {
                        self._makeDraggable();
                    }
                    break;
                case "position":
                    self._position(value);
                    break;
                case "resizable":
                    // currently resizable, becoming non-resizable
                    var isResizable = uiDialog.is(":data(resizable)");
                    if (isResizable && !value) {
                        uiDialog.resizable('destroy');
                    }

                    // currently resizable, changing handles
                    if (isResizable && typeof value === 'string') {
                        uiDialog.resizable('option', 'handles', value);
                    }

                    // currently non-resizable, becoming resizable
                    if (!isResizable && value !== false) {
                        self._makeResizable(value);
                    }
                    break;
                case "title":
                    // convert whatever was passed in o a string, for html() to not throw up
                    $(".inforMessageDialogTitle", self.uiDialogTitlebar).html("" + (value || '&#160;'));
                    break;
            }

            $.Widget.prototype._setOption.apply(self, arguments);
        },

        _size: function () {
            /* If the user has resized the dialog, the .inforDialog and .inforMessageDialogContent
            * divs will both have width and height set, so we need to reset them
            */
            var options = this.options,
            nonContentHeight,
            minContentHeight,
            isVisible = this.uiDialog.is(":visible");
			var isFixedSize = (options.minWidth == options.width && options.minHeight == options.height);
			
            // reset content sizing
            this.element.show().css({
                width: 'auto',
                minHeight: 0,
                height: 0
            });

            if (!isFixedSize)
			{
				options.width = f_clientWidth() - 300;
			
				if (options.dialogType!='')	//its a message dialog..
					options.width = f_clientWidth() - 600;
				
				if (options.minWidth > options.width) {
					options.width = options.minWidth;
				}
			}
			
			// reset wrapper sizing
            // determine the height of all the non-content elements
            nonContentHeight = this.uiDialog.css({
                height: 'auto',
                width: options.width
            })
            .height();
            minContentHeight = Math.max(0, options.minHeight - nonContentHeight);

            if (options.height === "auto") {
                // only needed for IE6 support
                if ($.support.minHeight) {
                    this.element.css({
                        minHeight: minContentHeight,
                        height: "auto"
                    });
                } else {
                    this.uiDialog.show();
                    var autoHeight = this.element.css("height", "auto").height();
                    if (!isVisible) {
                        this.uiDialog.hide();
                    }
                    this.element.height(Math.max(autoHeight, minContentHeight));
                }
            } else {
                this.element.height(Math.max(options.height - nonContentHeight, 0));
            }
			
            if (this.uiDialog.is(':data(resizable)')) {
                this.uiDialog.resizable('option', 'minHeight', this._minHeight());
            }
			
			if (isFixedSize) {
				this.uiDialog.css({
					height: options.height-5,	//-4 gets rid of the whitespace below the bottom images
					width: options.minWidth
				});
			}
        }
    });

    $.extend($.ui.inforDialog, {
        maxZ: 0,

        overlay: function (dialog) {
            this.$el = $.ui.inforDialog.overlay.create(dialog);
        }
    });

    $.extend($.ui.inforDialog.overlay, {
        instances: [],
        // reuse old instances due to IE memory leak with alpha transparency (see #5185)
        oldInstances: [],
        maxZ: 0,
        events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
        function (event) { return event + '.inforOverlay'; }).join(' '),
        create: function (dialog) {
            if (this.instances.length === 0) {
                // allow closing by pressing the escape key
                $(document).bind('keydown.dialog-overlay', function (event) {
                    if (dialog.options.closeOnEscape && event.keyCode &&
                    event.keyCode === $.ui.keyCode.ESCAPE) {

                        dialog.close(event);
                        event.preventDefault();
                    }
                });

                // handle window resize
                $(window).bind('resize.dialog-overlay', $.ui.inforDialog.overlay.resize);
            }

            var $el = (this.oldInstances.pop() || $('<div></div>').addClass('inforOverlay'))
            .appendTo(document.body)
            .css({
                width: this.width(),
                height: this.height()
            });

            if ($.fn.bgiframe) {
                $el.bgiframe();
            }

            this.instances.push($el);
            return $el;
        },

        destroy: function ($el) {
            var indexOf = $.inArray($el, this.instances);
            if (indexOf != -1) {
                this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
            }

            if (this.instances.length === 0) {
                $([document, window]).unbind('.dialog-overlay');
            }

            $el.remove();

            // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
            var maxZ = 0;
            $.each(this.instances, function () {
                maxZ = Math.max(maxZ, this.css('z-index'));
            });
            this.maxZ = maxZ;
        },

        height: function () {
            var scrollHeight,
            offsetHeight;
            // handle IE 6
            if ($.browser.msie && $.browser.version < 7) {
                scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            );
                offsetHeight = Math.max(
                document.documentElement.offsetHeight,
                document.body.offsetHeight
            );

                if (scrollHeight < offsetHeight) {
                    return $(window).height() + 'px';
                } else {
                    return scrollHeight + 'px';
                }
                // handle "good" browsers
            } else {
                return $(document).height() + 'px';
            }
        },

        width: function () {
            var scrollWidth,
            offsetWidth;
            // handle IE 6
            if ($.browser.msie && $.browser.version < 7) {
                scrollWidth = Math.max(
                document.documentElement.scrollWidth,
                document.body.scrollWidth
            );
                offsetWidth = Math.max(
                document.documentElement.offsetWidth,
                document.body.offsetWidth
            );

                if (scrollWidth < offsetWidth) {
                    return $(window).width() + 'px';
                } else {
                    return scrollWidth + 'px';
                }
                // handle "good" browsers
            } else {
                return $(document).width() + 'px';
            }
        },

        resize: function () {
            /* If the dialog is draggable and the user drags it past the
            * right edge of the window, the document becomes wider so we
            * need to stretch the overlay. If the user then drags the
            * dialog back to the left, the document will become narrower,
            * so we need to shrink the overlay to the appropriate size.
            * This is handled by shrinking the overlay before setting it
            * to the full document size.
            */
            var $overlays = $([]);
            $.each($.ui.inforDialog.overlay.instances, function () {
                $overlays = $overlays.add(this);
            });

            $overlays.css({
                width: 0,
                height: 0
            }).css({
                width: $.ui.inforDialog.overlay.width(),
                height: $.ui.inforDialog.overlay.height()
            });
        }
    });

    $.extend($.ui.inforDialog.overlay.prototype, {
        destroy: function () {
           $.ui.inforDialog.overlay.destroy(this.$el);
        }
    });

	function closeWindow(windowDtl) {
		windowDtl.close(windowDtl);
	}

	function f_clientWidth() {
		return f_filterResults(
						window.innerWidth ? window.innerWidth : 0,
						document.documentElement ? document.documentElement.clientWidth : 0,
						document.body ? document.body.clientWidth : 0
					);
	}

	function f_filterResults(n_win, n_docel, n_body) {
		var n_result = n_win ? n_win : 0;
		if (n_docel && (!n_result || (n_result > n_docel)))
			n_result = n_docel;
		return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
	}

} (jQuery));

/*
* Infor Message Dialog Plugin
*/
(function ($) {
    $.fn.inforMessageDialog = function (options) {
	    var settings = {
			title: "Error Dialog",
			shortMessage: "An Error Occured",
			detailedMessage: "Longer text related to the error.",
			dialogType: "Error",
			buttons: null,
			dialogHtml: null,
			modal: true,
			resizable: false,
			width: null, //allows you to specify a fixed height/width
			height: null,	//allows you to specify a fixed height/width
			showTitleClose: true, //allows you to hide the close button.
			beforeClose: null, //allows you to fire events on close 
			closeOnEscape: false, //allows the user to hit escape to cancel
			position: null,	//set the position...
			innerPadding: true	//add visual style guide inner padding.
		};
		
		return this.each(function() {
			$.fx.speeds._default = 200;	//adjusts anmiation speed.
			
			var	o = $.extend({}, settings, options);
			
			if (o.dialogType=='General')
			{
				elementToAdd=$(o.dialogHtml);
				o.shortMessage='';
				dialogArea = $(this);
			} else {
				if ($("#inforMessageDialog").length==0)
					$('body').append('<div id="inforMessageDialog"></div>');
					
				var dialogArea = $("#inforMessageDialog");
				dialogArea.empty();
			}
	        
			o.buttons=createMessageButtons(o.buttons,o.dialogType);
			dialogArea.inforDialog({
					autoOpen: true,                        // auto open the dialog, usually set to false otherwise the popup appears when the page is loaded
					show: "scale",                         // animation to show and hide the popup
					hide: "fadeOut",
					resizable: o.resizable,                        // can the popup be re-sized
					title: o.title,                  // title for the popup
					messageTitle: o.shortMessage,        // message for the error
					showTitleClose: o.showTitleClose,                   // show the close "X" in the title bar
					dialogType: o.dialogType,                    // what type of dialog to show - General/Info/Error/Confirmation/Warning
					buttons: o.buttons,
					draggable: true,                         // can the popup be moved around the screen
					modal: o.modal,
					minWidth: (o.minWidth!=undefined ? o.minWidth : (o.width!=undefined ? o.width : 'auto')),
					minHeight: (o.minHeight!=undefined ? o.minHeight : (o.height!=undefined ? o.height : 'auto')),
					maxHeight: (o.maxHeight!=undefined ? o.maxHeight : ( o.dialogType=="General" ? undefined : 400)),
					maxWidth: (o.maxWidth!=undefined ? o.maxWidth : ( o.dialogType=="General" ? undefined : 600)),
					height: (o.height!=undefined ? o.height : 'auto'),
					width : (o.width!=undefined ? o.width : 'auto'),
					detailedMessage: o.detailedMessage,
					beforeClose: o.beforeClose,
					close: o.close,
					closeOnEscape: o.closeOnEscape,
					position: o.position,
					open: o.open
				});
			
			if (!o.innerPadding) {
				dialogArea.closest(".inforDialog .dialogMiddleCenter").css("padding","0");
				dialogArea.css({"margin-left":"-17px","margin-right":"-17px"});
			}
				
			return ;
		});
		
		function createMessageButtons(buttons,dialogType){
		/*Set the right type of button*/
			if (buttons!=null)
				return buttons;
				
			switch(dialogType)
			{
			case "Information":
			   return [{	
							text: Globalize.localize("Close"),
							click: function() { $(this).inforDialog("close"); },
							isDefault: true
						}];
			  break;
			case "General":
				return [{	
							text: Globalize.localize("Ok"),
							click: function() { $(this).inforDialog("close"); },
							isDefault: true
						},{	
							text: Globalize.localize("Cancel"),
							click: function() { $(this).inforDialog("close"); }
						}];
				break;
			case "Confirmation":
				return  [{	
							text: Globalize.localize("Yes"),
							click: function() { $(this).inforDialog("close"); },
							isDefault: true
						},{	
							text: Globalize.localize("No"),
							click: function() { $(this).inforDialog("close"); }
						},{	
							text: Globalize.localize("Cancel"),
							click: function() { $(this).inforDialog("close"); }
						}];
				break;
			case "Alert":
			    return [{	
							text: Globalize.localize("Ok"),
							click: function() { $(this).inforDialog("close"); },
							isDefault: true
						}];
				break;
			case "Error":
				return [{	
							text: Globalize.localize("Ok"),
							click: function() { $(this).inforDialog("close"); },
							isDefault: true
						}];
				break;
			default:
				break;
			}
			return buttons;
		}
   };
})(jQuery);
/*
 * Infor Menu Button
 *
 * Usage: 
 *      $("#inforMenuButtonId").inforMenuButton();
 *
 * Deps:
 *    jquery
 *    inforContextMenu.js
 * 
 * Date: 8/12/2011
 */
(function($){
	$.fn.inforMenuButton = function( options ) {
		var settings = {
			menuId : null,
			callback: null
		};
		
		return this.each(function() {
			var	o = $.extend({}, settings, options), 
			$textButton = $(this);
			
			var buttonText = $textButton.html();
			var isIconButton = false;
			//handle icon buttons.
			if ($textButton.hasClass("exportExcel") || $textButton.hasClass("new") || $textButton.hasClass("print")|| $textButton.hasClass("save") || $textButton.hasClass("settings"))
				isIconButton=true;
			
			if (!$textButton.find('.leftSlice').hasClass('leftSlice'))	{ 
			//prevent re-wrapping on multiple calls.	
				$textButton.empty();
				
				if (!isIconButton)
				{
					var leftSlice = $("<span class=\"leftSlice\" />");
					var centerSlice = $("<span class=\"centerSlice\" />");
					var rightSlice = $("<span class=\"rightSlice\" />");
															
					centerSlice.html(buttonText);
					$textButton.append(leftSlice, centerSlice, rightSlice);
				}
				
				if (o.menuId!=null ) {
					$textButton.inforContextMenu({
						menu: o.menuId,
						invokeMethod: 'toggle',
						position: {
							my: (Globalize.culture().isRTL ? "right top" : "left top"),
							at: (Globalize.culture().isRTL ? "right bottom" : "left bottom"),
							of: $textButton,
							offset: (Globalize.culture().isRTL ? "3 -2" : "-3 -2"),
							collision: "flip"
						}
					 }, (o.callback==undefined ? null : function(action, el, pos, item) {
								if ($textButton.hasClass('disabled'))
									return;
									
								o.callback(action, el, pos, item);
					}));
				}
				//set the initial disabled state.
				if ($textButton.hasClass('disabled'))
					$textButton.disable();
					
				if ($textButton.prop("disabled"))
					$textButton.disable();
				
				//style fix for right aligned toolbar
				if (($.browser.msie && $.browser.version==8) && $textButton.parent().hasClass("alignRight"))
					centerSlice.css("line-height","20px");
					
				//style fix for crome
				$.browser.crome = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")!= -1) ? true: false;
				if ($.browser.crome)
					$textButton.css({"margin-top": "0px"});
			
				//style fix for safari
				$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
				if ($.browser.safari)
					$textButton.attr("style","margin-top: 0px !important");	
			}
			
		});
	};
	
}(jQuery));
/*/
 * Infor Master List Detail Pattern - ButtonUsed to review details of records in a master list quickly, 
 * when the detail has a small set of fields.  The user can edit the detail and save without have to enter into edit mode. 
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $(document).ready(function() {
 * 			$(".inforModuleContainer").inforMasterListDetailPattern();
 * 		});
 * Deps: jQuery, Tabs, FieldSets, Buttons, Module Container, Forms.
 * Date: 7/11/2011
 */
(function ($) {
    $.fn.inforMasterListDetailPattern = function (options) {
        var settings = {
            idProperty: 'id',
            masterListOptions: {}
        };

        return this.each(function () {
            var o = $.extend({}, settings, options);

            //setup form controls
            $(".inforModuleContainer").inforForm();

            grid = $(".inforDataGrid").inforDataGrid(o.masterListOptions);
        });
    };
} (jQuery));
/*
 * Infor Trigger Field 
 */
 (function ($) {
	$.widget("ui.inforLookupField", {
		options: {
			gridOptions: null,	//full column options for the inforDataGrid
			returnField: "id",	//id to return from the selected row - matches whats in the grid dataset.
			height: 300,	//height of the grid popup (minus shadows)
			width: 300,	//width of the grid popup
			editable: false,	//can the user type in the grid.
			typeAheadSearch: true,	//disable type ahead search when editable=false
			onPageRequested: null,	//Fires when Paging Make this the same as the datagrid with subscribe?
			sortColumnId: null,	//set the sort indication.
			sortAsc: null,	//set the sort indication.
			source: null,	//attach a source function you might use this to do web requests to return back the data on autocomplete.
			click: null	//You can provide a click method to the button - no grid will every be shown you should do it yourself.
		},
		associatedGrid:  null,
		gridDivId: "lookupGridDivId",	//use a uuid not needed should only be one in a page at once.
		input: null,
		originalDataSet: null,
		selectedIds: [],	//The selected Rows.
		/*Not needed yet... _create: function(), {*/
		_init: function() {
			var self = this;
			var $input = $(this.element);
			this.input = $input;
			
			//attach a default source matcher in case one is not provided.
			if (self.options.source==null) {
				self.options.source=function (request, response) {
					response($(self.options.gridOptions.dataset).map(function () {
						var text = this[self.options.returnField];
						if ((!request.term || text.toLowerCase().indexOf(request.term.toLowerCase()) > -1 ))
							return this;
					}));
				}
			}
			
			
			//use the auto complete for lookup functionality when typing...
			$input.autocomplete({
				source: self.options.source,
				showAsGrid: true,
				minLength: 0,
				suggestHook: function(results, columns, totalRows) {
					//show a grid popup with these results.
					self._openGridPopup(results, columns, totalRows);
				},
				typeAheadSearch: self.options.typeAheadSearch
			})
			.change(function(event, item) {
				if (item!=undefined) {	//copy the id to select id's
					self.selectedIds = [];
					self.selectedIds.push(item.id);
				}
			});
					
			//when clicking open a grid popup
			$input.inforTriggerField({click:function (event) { 
				if (self.options.click) {
					self.options.click(event);
					return;
				}
				
				//close grid if open (enter to open / enter to close again
				if (self.associatedGrid!=undefined)  {
					self._closeGridPopup();
					return;
				}
				
				// pass empty string as value to search for displaying all results
				$input.autocomplete("search", "");	//$input.val()
				return; 
			}});
			
			
			//Setup an editable type drop down styling and options
			if (!self.options.editable) {
				$input.data("selectOnly",true).autocomplete("makeSelectOnly", $input.isReadOnly(), self.options.typeAheadSearch);
			}
		},
		getGrid: function() {
			return this.associatedGrid;
		},
		setCode: function(codeValue) {
			var self = this;
			this.selectedIds=[];
				
				//find the code value provided and set the associated text value in the input field and add to the selectedIds
			if (typeof(codeValue)=="object") {	//should handle multiselect but no way to close dialog yet.
				this.selectedIds = codeValue;
			}
			else {
				this.selectedIds.push(codeValue);
			}
			
			var selectValue ="";
			$.each(this.selectedIds, function(index, value) {
				selectValue += self.getRowById(value)[self.options.returnField]+(self.selectedIds.length-1!=index ? "," : "");
			});
			
			//remove last ,
			this.input.val(selectValue);
		},
		getRowById: function(id) {	//return the dataset row for the given id..using idProperty
			var dataset = this.options.gridOptions.dataset;
			for (var i = 0; i < dataset.length; i++) {
				if (dataset[i][this.options.gridOptions.idProperty]==id)
					return dataset[i];
			}
		},
		_closeGridPopup: function(isCancel) {
			//remove grid and page elements and animate
			var $gridDiv = $("#"+this.gridDivId);
			$gridDiv.parent().css("opacity",0);	//improves appearance on ie 8 during fade out..
			
			$gridDiv.hide((isCancel ? "fade" : "fadeOut"), function () {
				$gridDiv.parent().remove();
			});
			
			$(".inforLookupOverlay").remove();
			//destroy grid 
			if (!$input.closest(".slick-cell").hasClass("hasComboEditor"))
				this.associatedGrid.destroy();	//destroyed inside the grid editor
				
			this.associatedGrid = null;
			
			//set back the dataset
			if (this.originalDataSet!=undefined){
				this.options.gridOptions.dataset=this.originalDataSet;
				this.originalDataSet=null;
			}
			
			$(window).unbind("smartresize.inforLookupField");
		},
		_openGridPopup: function(dataset, columns, totalRows) {
			var self = this;
			
			//switch out the dataset with the passed in filtering one.
			if (dataset!=undefined) {
				self.originalDataSet=self.options.gridOptions.dataset;
				//refresh the datagrid...
				self.options.gridOptions.dataset=dataset;
			} else if (self.originalDataSet!=undefined){
				self.options.gridOptions.dataset=self.originalDataSet;
				self.originalDataSet=null;
			}
			
			if (columns!=undefined)
				self.options.gridOptions.columns=columns;
			
			//create a grid object..
			var $gridDiv = $("#"+this.gridDivId);
			if ($gridDiv.length==0) {
				$gridDiv = $("<div></div>").attr("id",this.gridDivId).addClass("inforLookupGrid").appendTo("body");
				$gridDiv.wrap("<div class='inforLookupGridBoxShadow'></div");
			}
			
			//set height and width
			$gridDiv.width(self.options.width).css("max-height",self.options.height);
			$gridDiv.parent().width(self.options.width).css("max-height",self.options.height + (self.options.gridOptions.showFooter ? 23 : 0)  + (self.options.gridOptions.multiSelect ? 26 : 0));
			
			//position under the field
			var isRTL = Globalize.culture().isRTL;
			this.root = $gridDiv.parent();
			
			this.root.position( {
				my: (isRTL ? "right top" : "left top"),
				at: (isRTL ? "right bottom" : "left bottom"),
				collision: "fit",
				of: this.input
			});
			
			$gridDiv.show("fadeIn");	//amimate: fold is nice too
			
			//create and open the grid...
			//if there is less rows than the width use auto height..each row is 22 pixels + the header + the optional filter row.
			var minHeight = (self.options.gridOptions.dataset.length * 22) + 26 +(self.options.gridOptions.showFilter ? 26 : 0) ;
			if (minHeight<self.options.height)
				self.options.gridOptions.autoHeight=true;
			else
				self.options.gridOptions.autoHeight=false;
			
			self.options.gridOptions.enableCellNavigation=false;
			self.options.gridOptions.enableCellRangeSelection=false;
			
			//Use different routine for paging to update data
			if (totalRows!=undefined) {
				var ds = self.options.gridOptions.dataset;
				self.options.gridOptions.dataset = [];
			}
			
			this.associatedGrid = $("#"+this.gridDivId).inforDataGrid(self.options.gridOptions);
			
			if (self.options.sortColumnId && self.options.sortAsc) {
				this.associatedGrid.setSortColumn(self.options.sortColumnId, self.options.sortAsc);
			}
			
			//Set total count for paging
			if (totalRows!=undefined && ds!=undefined) {
				this.associatedGrid.mergeData(ds, 0, parseInt(totalRows));
			}
			
			//add a close bar for multi select
			if (self.options.gridOptions.multiSelect) {
				var header = $("<div class='inforLookupHeader'></div>"),
					closeButton = $('<button class="inforCloseButton" type="button" title="Close"></button>').click(function() {
						self._select();
					});
					
				header.append(closeButton);
				var loc = $gridDiv.find(".inforGridSettingsButton");
				if (loc.length==0)
					loc = $gridDiv.find(".slick-header");
				
				loc.before(header);
			}
			
			//add modal overlay..
			//create a grid object..
			var $overlay= $("#inforLookupOverlay");
			if ($overlay.length==0) {
				$overlay = $('<div id="inforLookupOverlay"></div>').addClass('inforLookupOverlay')
				.appendTo(document.body)
				.css({
					width: $(window).width(),
					height: $(window).height()
				}).click(function() {
					if (self.options.gridOptions.multiSelect)
						self._select(); 
					else
						self._closeGridPopup(true);
				});
			}
			
			$overlay.css({
					width: $(window).width(),
					height: $(window).height()
			});
			
			//select the selected rows based on the current value(s)..This would fail if the id was not selected.
			//var inputValues = this.input.val().split(",");
			if (self.selectedIds.length>0) {
				var selectedRows = [];
				var dataRows = this.associatedGrid.getData().getItems();	//search requires one scan of the data...
				for (var i = 0; i < dataRows.length; i++) {
					if ($.inArray(dataRows[i][self.options.gridOptions.idProperty], self.selectedIds)!=-1)
						selectedRows.push(i);
				}
				this.associatedGrid.setSelectedRows(selectedRows);
			}
			
			//selected rows events
			this.associatedGrid.onClick.subscribe(function (e, args) {
				self._select();
			});
			
			//setup paging
			if (self.options.onPageRequested!=null) {
				var dataView = this.associatedGrid.getData();
				dataView.onPageRequested.subscribe(function (e, args) {
					e.datagrid = self.associatedGrid;
					//pass in the term as a filter arg
					if (!args.filters) {
						if (self.input.val()=="")
							args.filters = undefined;
						else {
							var columnFilterObject  = {};
							var filterExpr = {value: self.input.val(), 
								  operator: "contains",
								  filterType: TextFilter()};
								  
							columnFilterObject [self.options.gridOptions.idProperty] = filterExpr;
							args.filters = columnFilterObject;
						}
					} 
					self.options.onPageRequested(e, args);
				});
			}
			
			//slight adjustment to not show the bottom most line.
			var $viewport = $gridDiv.find(".slick-viewport");
			$viewport.css("margin-bottom","-1px");
			if (self.options.gridOptions.multiSelect)
				$viewport.height($viewport.height() + (self.options.gridOptions.autoHeight ? 1 : -26));
				
			//move the status area to the far left because it looks off when this dialog is not full page width
			$gridDiv.parent().find(".slick-record-status").css("float", (Globalize.culture().isRTL ? "right": "left"));
			
			//adjust position on resize
			$(window).unbind("smartresize.inforLookupField");
			$(window).bind("smartresize.inforLookupField",function(){
				self._handleResize();
			});
			//console.profileEnd();
		},
		resizeTimer : null,
		windowHeight: null,
		windowWidth: null,
		root: null,
		_select: function() {
			var self = this,
				grid = self.associatedGrid;
			
			setTimeout(function() {
				self.selectedIds = [];
				var fieldValue="",
					selectedRows = grid.getSelectedRows(),
					selectedRowData = [];
				
				for (i = 0; i < selectedRows.length; i++) {
					var item = grid.getDataItem(selectedRows[i]);
					self.selectedIds.push(item[self.options.gridOptions.idProperty]);
					fieldValue += item[self.options.returnField] + (i+1==selectedRows.length ? "" : ",");
					selectedRowData.push(item);
				}
					
				self.input.val(fieldValue);
				self._closeGridPopup(false);
				self.input.trigger("change");	//trigger change so that the right events fire and dirty shows up.
			
				var event = jQuery.Event("select");	//fire the select event.
				event.selectedRows = selectedRowData;
				self.input.trigger(event);	
			},50);	//so select event happens first
		},
		_handleResize: function() {
			var self = this;
			if (self.resizeTimer) clearTimeout(self.resizeTimer);
			
			if (self.windowHeight != $(window).height() || self.windowWidth != $(window).width())
			{	
				self.resizeTimer = setTimeout(function () {
					self.root.position( {
						my: (Globalize.culture().isRTL ? "right top" : "left top"),
						at: (Globalize.culture().isRTL ? "right bottom" : "left bottom"),
						collision: "fit",
						of: self.input
					});
					
					$(".inforLookupOverlay").height($(window).height()).width($(window).width());
					
					self.windowHeight = $(window).height();
					self.windowWidth = $(window).width();
				
				}, 100);
			}
		},
		_setOption: function( key, value ) {
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	});
} (jQuery));

 /*
 * Infor Loading Indicator
 */
(function ($) {
    $.widget("ui.inforLoadingIndicator", {
        options: {
            modal: false,   //Mask the element so that the ui cannot be clicked. Overlays at form level
            delay: 0,   //Delay in milliseconds before element is masked to prevent showing during short operations
			size: "large",	//small, medium or large or smallWhite
			position: {		//specify the position/defaults to center of the element
			  my: "center",
			  at: "center"
			}
        },
		loadingElem : null,	//the element.
		overlay : null,
		delay : null,	//The Timeout.
        _init: function () {
           var self = this;
            self.open();
        },
        open: function () {
           var self = this,
				options = self.options;
			
			//handle the delay
			if (options.delay>0) {
				this.delay = setTimeout(function() {self.show() }, options.delay);
			} else {
				self.show();
			}
        },
		show: function() {
			var element = this.element;
			if (!this.loadingElem)
				this.loadingElem = $('<div id="inforLoadingOverlay"></div>').appendTo(element);
				
			//center the item and add it to the element.
			this.loadingElem.css("position","absolute");
			this.options.position.of = element;
			this.loadingElem.addClass(this.options.size).position(this.options.position);
			
			if (this.options.modal) {
				this.overlay = $('<div class="inforOverlay"></div>').css("z-index","1001").height($(window).height()).width($(window).width());
				$("body").append(this.overlay);
			}
		},
		close: function () {
            //remove it and reset the delay
			if (this.loadingElem!=null)
				this.loadingElem.fadeOut().remove();
			this.loadingElem = null;
			
			clearTimeout(this.delay);
			this.delay = null;
			
			if (this.overlay!=null)
				this.overlay.fadeOut().remove();
			this.overlay = null;
		}
    });
})(jQuery);


/*
* Infor ListBox Plugin. Credits to
*  jQuery selectBox (version 1.0.7): https://github.com/claviska/jquery-selectBox
*/

 (function ($) {
	$.widget("ui.inforListBox", {
		options: {
			autoWidth:true,
			showCheckboxes:true
		},
		_init: function() {
			var self = this,
				select = $(this.element),
				settings = this.options;
				
			// Disable for iOS devices (their native controls are more suitable for a touch device)
			if( navigator.userAgent.match(/iPad|iPhone|Android/i) ) return false;
			// Element must be a select control
			if( this.element[0].tagName.toLowerCase() !== 'select' ) return false;
			//already initialized..
			if( select.data('selectBoxControl') ) return false;
			
			var control = $('<a class="selectBox" />'),
				inline = select.attr('multiple') || parseInt(select.attr('size')) > 1;
			
			// Inherit class names, style, and title attributes
			control
				.addClass(select.attr('class'))
				.attr('style', select.attr('style') || '')
				.attr('title', select.attr('title') || '')
				.attr('tabindex', parseInt(select.attr('tabindex')))
				.css('display', 'inline-block')
				.bind('focus.inforListBox', function() {
					select.trigger('focus');
				})
				.bind('blur.inforListBox', function() {
					if( !control.hasClass('selectBox-active') ) return;
					control.removeClass('selectBox-active');
					select.trigger('blur');
				});
			
			if( select.attr('disabled') ) control.addClass('inforListBoxDisabled');
			
			// Generate control
			if( inline ) {
				var options = self.getOptions();
				
				control
					.append(options)
					.data('inforListBoxOption', options)
					.addClass('inforListBox')
					.bind('keydown.inforListBox', function(event) {
						self._handleKeyDown(event);
					})
					.bind('keypress.inforListBox', function(event) {
						self._handleKeyPress(event);
					})
					.bind('mousedown.inforListBox', function(event) {
						if( $(event.target).is('A.inforListBox') ) event.preventDefault();
						if( !control.hasClass('selectBox-focus') ) control.focus();
					})
					.insertAfter(select);
				
				// Auto-height based on size attribute
				if( !select[0].style.height ) {
					var size = select.attr('size') ? parseInt(select.attr('size')) : 5,
					 optionHeight = (this.options.showCheckboxes ? 20 : 18),
						padding =  8;//top and bottom padding
					
					control.height((optionHeight * size) + padding);
				}
				
				this._disableSelection(control);
				
			}
			// Store data for later use and show the control
			select
				.addClass('selectBox')
				.data('selectBoxControl', control)
				.hide();
				
		},
		getOptions : function() {
				var options = $('<ul class="inforListBoxOption" />'),
					select = $(this.element),
					hasOptGroups = select.find('OPTGROUP').length,
					self = this;
				
				if( hasOptGroups ) {
					select.find('OPTGROUP').each( function() {
						var optgroup = $('<li class="inforListBoxOptGroup" />');
						optgroup.text($(this).attr('label'));
						options.append(optgroup);
						
						$(this).find('OPTION').each( function() {
							var li = $('<li />'),
								a = $('<a />'),
								$this = $(this);
							li.addClass( $this.attr('class') );
							
							var text = $this.text();
							if (text == "" || text == undefined)
								text = '\xa0';
						
							a.attr('rel', $this.val()).text( text ).appendTo(li);
							
							if ($this.attr("title")) {
								a.attr("title",$this.attr("title"));
							}
							
							options.append(li);
							
							if (self.options.showCheckboxes) {
								var checkbox = $('<input type="checkbox" class="inforCheckbox noTrackDirty" />');
								a.prepend(checkbox);
								checkbox.inforCheckbox().bind("click", function(e){
									self.isCheckClick = true;
								});
							}
							
							if( $this.attr('disabled') ) li.addClass('inforListBoxDisabled');
							if( $this.attr('selected') ) {
								li.addClass('inforListBoxSelected');
								li.find("input.inforCheckbox").setValue(true);
							}
						});
						
					});
				
				} else {
					
					select.find('OPTION').each( function() {
						var li = $('<li />'),
							a = $('<a />'),
							$this = $(this);
							
						li.addClass( $this.attr('class') );
						var text = $this.text();
						if (text == "" || text == undefined)
							text = '\xa0';
							
						a.attr('rel', $this.val()).text(text);
						if ($this.attr("title")) {
							a.attr("title",$this.attr("title"));
						}
						
						li.append(a);
						if (self.options.showCheckboxes) {
							var checkbox = $('<input type="checkbox" class="inforCheckbox noTrackDirty" />');
							a.prepend(checkbox);
							checkbox.inforCheckbox().bind("click", function(e) {
								self.isCheckClick = true;
							});
						}
						if( $this.attr('disabled') ) li.addClass('inforListBoxDisabled');
						if( $this.attr('selected') ) {
							li.addClass('inforListBoxSelected');
							li.find("input.inforCheckbox").setValue(true);
						}
						options.append(li);
					});
					
				}
				
				options.find('A')
					.bind('mouseover.selectBox', function(event) {
						self._addHover($(this).parent());
					})
					.bind('mouseout.selectBox', function(event) {
						self._removeHover($(this).parent());
					})
					.bind('click.selectBox', function(event) {
						self._selectOption($(this).parent(), event);
						if( !select.inforListBox('control').hasClass('selectBox-active') ) 
							select.inforListBox('control').focus();
					});
				
				this._disableSelection(options);
				return options;
		},
		isCheckClick: false,
		_selectOption: function (li, event) {
			var select = $(this.element),
				control = select.data('selectBoxControl');
				
			if( control.hasClass('inforListBoxDisabled') ) return false;
			if( li.length === 0 || li.hasClass('inforListBoxDisabled') ) return false;
			
			if( select.attr('multiple') ) {
				// If event.shiftKey is true, this will select all options between li and the last li selected
				if( (event.shiftKey) && control.data('selectBox-last-selected') ) {
					li.toggleClass('inforListBoxSelected');
					
					var affectedOptions;
					if( li.index() > control.data('selectBox-last-selected').index() ) {
						affectedOptions = li.siblings().slice(control.data('selectBox-last-selected').index(), li.index());
					} else {
						affectedOptions = li.siblings().slice(li.index(), control.data('selectBox-last-selected').index());
					}
					
					affectedOptions = affectedOptions.not('.inforListBoxOptGroup, .inforListBoxDisabled');
					
					if( li.hasClass('inforListBoxSelected') ) {
						affectedOptions.addClass('inforListBoxSelected');
					} else {
						affectedOptions.removeClass('inforListBoxSelected');
					}
				} else if (event.ctrlKey || event.metaKey  || this.isCheckClick) {
					li.toggleClass('inforListBoxSelected');
					this.isCheckClick = false;
				} else {
					li.siblings().removeClass('inforListBoxSelected');
					li.addClass('inforListBoxSelected');
				}
				
			} else {
				li.siblings().removeClass('inforListBoxSelected');
				li.addClass('inforListBoxSelected');
			}
			
			if( control.hasClass('selectBox-dropdown') ) {
				control.find('.selectBox-label').text(li.text());
			}
			
			li.siblings().each(function() {
				var $li = $(this);
				if ($li.hasClass('inforListBoxSelected')) 
					$li.find("input.inforCheckbox").setValue(true);
				else
					$li.find("input.inforCheckbox").setValue(false);
			});
			
			if (li.hasClass('inforListBoxSelected')) 
				li.find("input.inforCheckbox").setValue(true);
			else
				li.find("input.inforCheckbox").setValue(false);
			
			// Update original control's value
			var i = 0, selection = [];
			if( select.attr('multiple') ) {
				control.find('.inforListBoxSelected A').each( function() {
					selection[i++] = $(this).attr('rel');
				});
			} else {
				selection = li.find('A').attr('rel');
			}
			
			// Remember most recently selected item
			control.data('selectBox-last-selected', li);
			
			// Change callback
			if( select.val() !== selection ) {
				select.val(selection);
				select.trigger('change');
			}
		},
		_disableSelection : function(selector) {
			$(selector)
				.css('MozUserSelect', 'none')
				.bind('selectstart', function(event) {
					event.preventDefault();
				});
		},
		_addHover: function (li) {
			var select = $(this.element);
			var control = select.data('selectBoxControl'),
				options = control.data('inforListBoxOption');
			
			options.find('.inforListBoxHover').removeClass('inforListBoxHover');
			li.addClass('inforListBoxHover');
		},
		_removeHover : function(select, li) {
				var select = $(this.element);
				var control = select.data('selectBoxControl'),
					options = control.data('inforListBoxOption');
				options.find('.inforListBoxHover').removeClass('inforListBoxHover');
		},
		typeTimer : null,
		typeSearch : '',
		_handleKeyPress: function(event) {
			var select = $(this.element),
				control = select .data('selectBoxControl'),
				options = control.data('inforListBoxOption'),
				self = this;
			
			if( control.hasClass('inforListBoxDisabled') ) return;
			
			switch( event.keyCode ) {
				case 9: // tab
				case 27: // esc
				case 13: // enter
				case 38: // up
				case 37: // left
				case 40: // down
				case 39: // right
					// Don't interfere with the keydown event!
					break;
				
				default: // Type to find
					event.preventDefault();
					
					clearTimeout(self.typeTimer);
					self.typeSearch += String.fromCharCode(event.charCode || event.keyCode);
					
					options.find('A').each( function() {
						if( $(this).text().substr(0, self.typeSearch.length).toLowerCase() === self.typeSearch.toLowerCase() ) {
							self._selectOption($(this).parent(), event);
							self._scrollTo($(this).parent());
							return false;
						}
					});
					// Clear after a brief pause
					self.typeTimer = setTimeout( function() { self.typeSearch = ''; }, 1000);
					
					break;
					
				}
		},
		_scrollTo: function(li) {
			if( !li || li.length === 0 ) return;

			var select = $(this.element),
				scrollBox = select.data('selectBox-control'),
				options = this.options,
				top = parseInt(li.offset().top - scrollBox.position().top),
				bottom = parseInt(top + li.outerHeight());

			if( top < 0 ) {
				scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() );
			}
			if( bottom > scrollBox.height() ) {
				scrollBox.scrollTop( (li.offset().top + li.outerHeight()) - scrollBox.offset().top + scrollBox.scrollTop() - scrollBox.height() );
			}
		},
		_handleKeyDown: function(event) {
			var select = $(this.element),
				control = select.data('selectBoxControl');
			
			if( control.hasClass('inforListBoxDisabled') ) return;
			
			switch( event.keyCode ) {
				
				case 8: // backspace
					event.preventDefault();
					typeSearch = '';
					break;
				case 9: // tab
				case 27: // esc
					hideMenus();
					this._removeHover(select);
					break;
				case 38: // up
				case 37: // left
					event.preventDefault();
					break;
				case 40: // down
				}
		},
		setOptions: function() {
			var $select = $(this.element),
				control = $select.data('selectBoxControl');
			
			switch( typeof(data) ) {
				
				case 'string':
					//select.html(data);
					break;
					
				case 'object':
					$select.html('');
					for( var i in data ) {
						if( data[i] === null ) continue;
						if( typeof(data[i]) === 'object' ) {
							var optgroup = $('<optgroup label="' + i + '" />');
							for( var j in data[i] ) {
								optgroup.append('<option value="' + j + '">' + data[i][j] + '</option>');
							}
							select.append(optgroup);
						} else {
							var option = $('<option value="' + i + '">' + data[i] + '</option>');
							select.append(option);
						}
					}
					break;
			}
			
			if( !control ) return;
			
			// Remove old options
			control.data('inforListBoxOption').remove();
			
			// Generate new options
			var	options = this.getOptions($select);
			control.data('inforListBoxOption', options);
			control.append(options);
		},
		refresh :function() {
			this.setOptions($(this.element).html());
		},
		clear : function() {
			var $select = $(this.element);
			
			$select.children().remove();
			this.refresh();
		}, 
		add : function(data) {
			var $select = $(this.element),
				option = $('<option value="'+data.optionValue+'">'+data.optionText+'</option>');
			
			if (data.optionTitle)
				option.attr("title",data.optionTitle);
		
			$select.append(option);
			this.refresh();
		}, 
		rename : function(data) {
			var $select = $(this.element),
				option = $select.find('option[value="'+data.optionValue+'"]');
			
			option.html(data.optionText);
			if (data.optionTitle)
				option.attr("title",data.optionTitle);
			this.refresh();
		}, 
		remove : function(data) {
			var $select = $(this.element);
			
			$select.find('option[value="'+data.optionValue+'"]').remove();
			this.refresh();
		}, 
		removeSelected : function() {
			var $select = $(this.element),
				selectedOptions = $select.children('option:selected');
			
			selectedOptions.remove();
			this.refresh();
		}, 
		moveSelectedUp : function() {
			var $select = $(this.element),
				$selectedOptions = $select.children('option:selected'),
				prev = $selectedOptions.first().prev();
			
			$selectedOptions.insertBefore(prev);
			this.refresh();
		}, 
		moveSelectedDown  : function() {
			var $select = $(this.element),
				$selectedOptions = $select.children('option:selected'),
				next = $selectedOptions.last().next();
			
			$selectedOptions.insertAfter(next);
			this.refresh();
		},
		value: function(value) {
			var $select = $(this.element);
			
			$select.val(value);
			var control = $select.data('selectBoxControl');
			if( !control ) return;
			
			var options = control.data('inforListBoxOption');
			
			// Update label
			control.find('.selectBox-label').text( $select.find('OPTION:selected').text() || '\u00A0' );
			
			// Update control values
			options.find('.inforListBoxSelected').removeClass('inforListBoxSelected');
			options.find("input.inforCheckbox").setValue(false);
			
			options.find('A').each( function() {
				if( typeof(value) === 'object' ) {
					for( var i = 0; i < value.length; i++ ) {
						if( $(this).attr('rel') == value[i] ) {
							var li = $(this).parent();
							li.addClass('inforListBoxSelected');
							li.find("input.inforCheckbox").setValue(true);
						}
					}
				} else {
					if( $(this).attr('rel') == value ) {
						var li = $(this).parent();
							li.addClass('inforListBoxSelected');
							li.find("input.inforCheckbox").setValue(true);
					}
				}
			});
		},
		destroy: function() {
			var select = $(this.element),
				control = select.data('selectBoxControl');
			
			if(!control) return;
			var options = control.data('inforListBoxOption');
			
			options.remove();
			control.remove();
			select
				.removeClass('selectBox')
				.removeData('selectBoxControl')
				.removeData('selectBoxSettings')
				.show();
		}
	});
} (jQuery));

/*
 * Infor Form Button - A Bluish Button To Be Used on Forms. For toolbars using InforTextButton.
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $("inforFormButtonId").inforFormButton();
 *
 * Date: 8/16/2011
 */
(function ($) {
    $.widget("ui.inforFormButton", {
        options: {
			width: null,	// set the width
			text: null	//the text of the button - or you can inline it initially in the html
		},
		_create: function () {
            var	o = this.options, //Extend the options if any provided
			$textButton = $(this.element);
			var buttonText = $textButton.html();
			var isDisabled = (($textButton.attr("disabled")!=undefined && $textButton.attr("disabled")!='') || $textButton.hasClass("disabled"));
			
			if (!$textButton.find('.leftSlice').hasClass('leftSlice')) {	
				//prevent re-wrapping on multiple calls.
				$textButton.empty();
				var leftSlice = $("<span class=\"leftSlice\" />");
				var centerSlice = $("<span class=\"centerSlice\" />");
				var rightSlice = $("<span class=\"rightSlice\" />");
				
				if (o.width!=null)
				{
					o.width=o.width.replace('px','');
					o.width=parseInt(o.width)-14;
					centerSlice.width(o.width+"px");	//7 pixel left and right slices
				}
				
				centerSlice.html(buttonText);
				if (o.text)
					centerSlice.html(o.text);
					
				$textButton.append(leftSlice, centerSlice, rightSlice);

				if (isDisabled)
				{
					$textButton.disable();
					if (o.width!=null)
						$textButton.parent().find(".centerSlice").width(o.width+"px");	//7 pixel left and right slices
					}
			}
			
		},
		_setOption: function( key, value ) {
			if (key=="width")
			{
				if (this.element.hasClass("disabled"))
					this.element.parent().find(".centerSlice").width(value);
				else
					this.element.find(".centerSlice").width(value);
			}
			if (key=="text")
			{
				if (this.element.hasClass("disabled"))
					this.element.parent().find(".centerSlice").html(value);
				else
					this.element.find(".centerSlice").html(value);
			}
		}
   });
})(jQuery);

/*
 * Infor Form Pattern - A Control to handle Basic Form Functionality.
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $(document).ready(function() {
 * 			$(".inforModuleContainer").inforForm();
 * 		});
 * Deps: jQuery, Tabs, FieldSets, Buttons, Module Container.
 * Date: 7/11/2011
 */
(function($){
	$.fn.inforForm = function( options ) {
		var settings = {
			trackDirty: true,
			autoWidth: true
		};
		
		return this.each(function() {
			$('body').addClass("inforHidden");
			var	o = $.extend({}, settings, options); //Extend the options if any provided
			
			$('*').each(function(){
			    $this = $(this);
				
				if ($this.hasClass("inforTextButton") && $this.children(".centerSlice").length == 0) {
					$this.inforTextButton();
					return;
				}

				if ($this.hasClass("inforRadioButton")) {
					$this.inforRadioButton();
					return;
				}
				
				if ($this.hasClass("inforFormButton") && $this.children(".centerSlice").length == 0)
				{
					$this.inforFormButton();
					return;
				}
				
				if ($this.hasClass("inforMenuButton") && $this.children().length == 0) {
					$this.inforMenuButton();
					return;
				}
				
				if ($this.hasClass("inforSplitButton") && $this.children().length == 0) {
					$this.inforSplitButton();
					return;
				}
				
				if ($this.hasClass("inforToggleButton")) {
					$this.inforToggleButton();
					return;
				}
				
				//bind focus to get around IE9 limitation
				if ($this.hasClass("inforTextbox") && $this.attr("type")=="password" && $.browser.msie) {
					$this.bind("focus",function(e) {
						$(this).select();
					});
				};
				
				if ($this.hasClass("inforFieldSet")) {
					$this.inforFieldSet();
					return;
				}
				
				if ($this.hasClass("inforLightFieldSet")) {
					$this.inforFieldSet();
					return;
				}
					
				if ($this.is("select") && $this.hasClass("inforDropDownList")) {
					$this.inforDropDownList();
				}
				
				if ($this.hasClass("inforDateField")) {
					$this.inforDateField();
				}
				
				if ($this.hasClass("inforSearchField")) {
					$this.inforTriggerField();
				}
				
				if ($this.hasClass("inforEmailField")) {
					$this.inforTriggerField();
				}
				
				if ($this.hasClass("inforFileField")) {
					$this.inforFileField();
				}
				
				if ($this.hasClass("inforListBox")) {
					$this.inforListBox();
				}
				
				if ($this.hasClass("inforCheckbox") && $this.children().length == 0)  {
					$this.inforCheckbox();
				}
				
				if ($this.hasClass("required"))
					$this.required();
				
				if ($this.hasClass("inforScrollableArea"))
				{
					$this.inforScrollableArea();
				}
				
				if ($this.hasClass("inforTabContainer"))
				{
					$this.inforTabset();
				}
				
				if ($this.hasClass("numericOnly"))
				{
					$this.numericOnly();
				}

				if ($this.hasClass("decimalOnly"))
				{
					$this.numericOnly(true);
				}
				
				if ($this.is('input[placeholder], textarea[placeholder]'))
				{
					$this.placeholder();
				}
				
				if ($this.hasClass("inforTextArea"))
				{
					$this.maxlength();
				}
			}); 
			
			if (o.trackDirty)
				$(":input").not(".noTrackDirty").not("button").trackDirty();
			
			if (o.autoWidth)
			{
				$('.autoLabelWidth').find('.inforLabel').autoWidth();
			}
			
			//testing preventing FOUC - seems to work...Need a loading element
			$('body').css("opacity","");
			$('body').removeClass("inforHidden");
		});
	};
	
	$.fn.inforScrollableArea = function(  ) {
		return this.each(function() {
			$area = $(this);
			//set the max height of this area to the bottom of the form and track any resize events...
			handleResize($area);
			$(window).on("smartresize.inforScrollableArea",function(){  
				handleResize($area);
			});
			
			$area.on("resize",function(){  
				handleResize($area);
			});
		});
		
		function handleResize($area) {
			var maxHeight=$(window).height()-$area.offset().top;
			//take into account the next thing below it
			var next = $area.next().not(".inforContextMenu, .inforMenu, div.transparentOverlay").height();
			maxHeight = maxHeight-next;
			
			if ($area.parent().attr("id")=="bottomPane")
				$area.parent().css("overflow","hidden");
			
			var bottomMargin = parseInt($area.css("margin-bottom"));
			if (!isNaN(bottomMargin))
				maxHeight -= bottomMargin;
			
			$area.css("max-height",maxHeight);
			$area.height(maxHeight);
			
			if ($area.hasClass("inforTabContainer") || $area.hasClass("ui-tabs")) {
				$area.children("div").not(".inforTabButton").each(function() {
					var $this = $(this);
					$this.css({"max-height":maxHeight-26 ,"min-height":maxHeight-26});
					if ($this.css("overflow")!=="hidden")
						$this.css("overflow" , "auto");
				});
				$area.css("overflow","hidden");
			} else if ($.browser.msie && $.browser.version==8 && $area.parent().attr("id")=="bottomPane")
				$area.css("max-height",maxHeight-16);
		}
	};
}(jQuery));
/*
* Infor Required Indicator Plugin
*/
(function ($)
{
	/*
	 * Jquery Extensions to get the Value or Code of ((any control but not all included yet).
	*/
	$.fn.getValue = function () {
		var elem = this[0];
		var $elem = $(elem);
		
		if (($.nodeName( elem, "select" ) && $elem.next().hasClass("inforTriggerField")) || $elem.hasClass("inforDataGridDropDownList")) {
			//its a drop down list..
			return $elem.next().find('input').val();
		} 
		
		if ($elem.hasClass("inforCheckbox"))
		{
			if ($.nodeName( elem, "div" ))
				$elem = $elem.find('input');
			
			return ($elem.attr("checked")=="checked" ? true : false);
		}
		//May need this later - for setting the value
		//this.toggleClass(arguments.length).val.apply(this, arguments)
		return $elem.val();
	};
	
	/*
	 * Jquery Extensions to set the Value or Code of (any control but not all included yet).
	*/
	$.fn.setValue = function (value) {
		return this.each(function ()
        {
			var elem = this;
			var $elem = $(elem);
			
			//Drop Downs.
			if (($.nodeName( elem, "select" ) && $elem.next().hasClass("inforTriggerField")) || $elem.hasClass("inforDataGridDropDownList") ) {
				//its a drop down list - first set the selected value
				var seekVal = $.trim(value);	//converts to a string
				seekVal = seekVal.replace(/&nbsp;/gi,'').replace(/&#160;/gi,'');
					
				$elem.find("option:contains('" + seekVal +"')").prop("selected",true);
				$elem.find("option:selected").not("option:contains('" + seekVal +"')").removeProp();
				$elem.val(seekVal);
				
				//set the input value
				return $elem.next().find('input').val(value);
			} 
		
			if ($elem.hasClass("inforRadioButtonSet")) {
				$elem.find("input").each(function() {
					var $this = $(this);
					$this.attr("checked", false);
					$this.parent().removeClass("checked");
				 });
			
				var oneToCheck = $elem.find("input[value='"+value+"']");
				oneToCheck.attr("checked", true);
				oneToCheck.parent().addClass("checked");
			}
			
			//Checkboxes...
			if ($elem.hasClass("inforCheckbox")) {
				//if its the input box we are good but if its the div get the input box.
				if ($.nodeName( elem, "div" ))
				{
					$elem = $elem.find('input')
				}
				
				var checked=false;
				//parse the value we can accept boolean,numeric or string
				if (typeof(value)=="number")
					checked = (value==1 ? true: false);
				
				if (typeof(value)=="boolean")
					checked = value;
				
				if (typeof(value)=="string")
					checked = ((value=="1" || value=="true")  ? true: false);
				//set the value
				if (checked)
				{
					$elem.attr("checked","checked");
					$elem.parent().addClass("checked");
				} else
				{
					$elem.removeAttr("checked");
					$elem.parent().removeClass("checked");
				}
				return true;
			}
		});
		};

	/*
	 * Jquery Extensions to get the Value or Code of (any control)
	*/
	$.fn.getCode = function () {
		var elem = this[0];
		var $elem = $(elem);
		
		if ( $.nodeName( elem, "select" ) && $elem.next().hasClass("inforTriggerField") ) {
			//get the value - find the code in the select list and return the option = value.
			var value = $elem.next().find('input').val();
			
			var seekVal = value.replace(/&nbsp;/gi,'').replace(/&#160;/gi,'');
				seekVal = $.trim(seekVal);
				
			var option = $elem.find('option:contains("'+seekVal+'")'),
			    code = option.attr("value");
			
			if (option.length>1) {
				option.each(function(i, optVal) {
					if ($(optVal).html()==seekVal)
						code = $(optVal).attr("value");
				});
			}
			if (code==undefined)
				code= $elem.data("selectedId");
				
			return code;
		}
		return null;
	};
	
	/*
	 * Infor Required Plugin. Makes any element have a required indicator
	 *
	 * Usage: 
	 *      $("inforTextButtonId").required();
	 */
	$.fn.required = function (options) {
	    return this.each(function ()
        {
			var required = $('<div class="inforRequiredIndicator"></div>');
           
			//extra case for drop downs
			if ($(this).is("select"))
				required.css("top","-1px");
			
			//move the indicator for trigger fields.
			var $elem = $(this),
				$trigger = $(this).closest(".inforTriggerField");
			
			if ($trigger.length==1)
				$elem = $trigger;
				
			if (!Globalize.culture().isRTL) 
				$elem.before(required);
			else
				$elem.after(required);
        });
    }
	
	/*
	* Adds a function that can easily disable a complex field to jquery.
	*/
	$.fn.disable = function( options ) {
		var settings = {
			readonly : false
		};
		return this.each(function() {
			
			var	o = $.extend({}, settings, options), 
				$control = $(this), 
				targetClass = (!o.readonly ? "disabled" : "readonly");
			
			if ($control.hasClasses(['inforLookupField', 'inforCalculatorField', 'inforSpinner', 'inforDateField', 'inforUrlField', 'inforSearchField', 'inforFileField', 'inforEmailField']))
			{
				$control.addClass(targetClass).attr(targetClass,targetClass).closest(".inforTriggerField").addClass(targetClass);
				if ($control.hasClass("inforFileField")) {
					var $next = $control.next();
					$next.addClass(targetClass).attr(targetClass,targetClass).data("selectOnly",$next.hasClass("selectOnly"));
					$next.removeClass("selectOnly")
				}
				
				if ($control.hasClass("inforLookupField")) {
					$control.data("selectOnly",$control.hasClass("selectOnly"));
					$control.removeClass("selectOnly");
				}
				
				return;
			}
			
			if ($control.hasClass("inforDropDownList"))
			{
				var $div = $control.next();
				var $input = $div.find("input");
				$input.data("selectOnly",$input.hasClass("selectOnly"));
				$input.attr(targetClass,targetClass).removeClass("selectOnly");
				$div.addClass(targetClass);
				return;
			}
			
			if ($control.hasClasses(["inforCheckbox","inforRadioButton"]))
			{
				$control.attr(targetClass,targetClass);
				$control.parent().addClass(targetClass);
				$control.parent().parent().removeClass("inforCheckboxFocus");
				return;
			}
			
			if ($control.hasClass("inforIconButton"))
			{
				$control.attr(targetClass,targetClass);
				return;
			}
			
			if ($control.hasClass("inforTextButton"))
			{
				//allow tooltips to show on disabled buttons
				var htmlFrag = $control.find('.centerSlice').html();
				var title = $control.attr("title");
				
				//already wrapped.
				if ($control.parent().hasClass("inforTextButton"))
					return;
					
				$control.css("display","none");
				
				$control.wrap('<div class="inforTextButton disabled" type="button"></div>');
				if (title!=undefined)
					$control.attr("title",title);
					
				$control.parent().append('<span class="leftSlice"></span><span class="centerSlice">'+htmlFrag+'</span><span class="rightSlice"></span>');
				
				//hack for non-detection of crome.
				$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
			
				//style fix for WebKit
				if ($.browser.safari)
				{
					$control.parent().height("20px");
					$control.parent().css("margin-bottom","1px");
					$control.removeClass("safariAdjust");
				}
				return;
			}
			
			if ($control.hasClass("inforSplitButtonText"))
			{
				$control.parent().addClass(targetClass);
				$control.next().attr(targetClass,targetClass);
				return;
			}
			
			if ($control.hasClass("inforIconSplitButton"))
			{
				$control.parent().addClass(targetClass);
				$control.attr(targetClass,targetClass);
				$control.next().attr(targetClass,targetClass);
				$control.addClass(targetClass);
				$control.next().addClass(targetClass);
				return;
			}
			
			if ($control.hasClass("inforSplitButton"))
			{
				$control.addClass(targetClass);
				$control.find("inforSplitButtonMenu").attr(targetClass,targetClass);
				return;
			}
			
			if ($control.hasClass("inforMenuButton"))
			{
				$control.addClass(targetClass);
				return;
			}
			
			if ($control.hasClass("inforFormButton"))
			{
				//allow tooltips to show on disabled buttons
				var htmlFrag = $control.find('.centerSlice').html();
				var title = $control.attr("title");
				var inlineCss = $control.attr("style");
				
				//already wrapped.
				if ($control.parent().hasClass("inforFormButton"))
					return;
				
				//copy all the classes as well..
				var classes= $control.attr("class").replace("inforFormButton","").replace(targetClass,"").replace("undefined","");
				
				$control.css("display","none");
				$control.wrap('<div class="inforFormButton disabled '+ classes +'" type="button"></div>');
				if (title!=undefined)
					$control.attr("title",title);
				
				$control.parent().append('<span class="leftSlice"></span><span class="centerSlice">'+htmlFrag+'</span><span class="rightSlice"></span>');
				
				
				var width = $control.find('.centerSlice').css("width");
				if (width!=undefined && width!="0px")
					$control.parent().find('.centerSlice').css("width", width);

				if (inlineCss!=undefined)
					$control.parent().attr("style",inlineCss);
				
				return;
			}
			
			if ($control.hasClasses(["inforTextbox","inforTextArea"])) {
				$control.addClass(targetClass);
				$control.attr(targetClass,"");
			}
			
			if ($control.hasClass("inforDualListExchange")) {
				$control.addClass("disabled").inforDualListExchange("option","enabled",false);
				return;
			}
			
			if ($control.hasClass("inforTree")) {
				$control.addClass("disabled").bind('before.jstree', function (event, data) {
				  var isSelectable = false; 
				  if (!isSelectable && (data.func == 'select_node' || data.func == 'hover_node')) {
					event.stopImmediatePropagation();
					return false;
				  }
				  
				  if ($control.hasClass("disabled") && (data.func == 'check_node' || data.func == 'uncheck_node')) {
						event.stopImmediatePropagation();
						return false;
				  }
				});
			}
		});
	};
	
	/*
	* Adds a function that can easily enable a complex field to jquery.
	*/
	$.fn.enable = function(  ) {
	
		return this.each(function() {
			var $control = $(this),
				targetClass = "disabled readonly";
			
			if ($control.hasClasses(['inforLookupField', 'inforCalculatorField', 'inforSpinner', 'inforDateField', 'inforUrlField', 'inforSearchField', 'inforFileField', 'inforEmailField']))
			{
				$control.removeClass(targetClass).removeAttr(targetClass).closest(".inforTriggerField").removeClass(targetClass);
				if ($control.hasClass("inforFileField")) {
					var $next = $control.next();
					$next.removeClass(targetClass).removeAttr(targetClass);
					if ($next.data("selectOnly"))
						$next.data("selectOnly");
				}
				
				if ($control.hasClass("inforLookupField") && $control.data("selectOnly")) {
					$control.autocomplete("makeSelectOnly", false, $control.data("autocomplete").options.typeAheadSearch);
				}
				return;
			}
			
			if ($control.hasClass("inforDropDownList"))
			{
				var $div = $control.next();
				var $input = $div.find("input");
				$input.removeAttr(targetClass);
				$div.removeClass(targetClass);
				if ($input.data("selectOnly"))
					$input.addClass("selectOnly");
				return;
			}
			
			if ($control.hasClasses(["inforCheckbox","inforRadioButton"]))
			{
				$control.removeAttr(targetClass);
				$control.parent().removeClass(targetClass);
				return;
			}
			
			if ($control.hasClass("inforIconButton"))
			{
				$control.removeAttr(targetClass);
				return;
			} 

			if ($control.hasClass("inforTextButton"))
			{
				$control.removeClass(targetClass);
				
				//unwrap the parent div and remove the siblings
				if (!$control.parent().hasClass("inforTextButton"))
					return;
					
				$control.siblings().remove();
				$control.unwrap();
				$control.css("display","");
				
				//hack for non-detection of crome.
				$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
			
				if ($.browser.safari) {
					$control.height("22px");
					$control.css("margin-bottom","");
					$control.addClass("safariAdjust");
				}
				return;
			} 
			
			if ($control.hasClass("inforSplitButtonText"))
			{
				$control.parent().removeClass(targetClass);
				$control.next().removeAttr(targetClass);
				return;
			} 
			
			if ($control.hasClass("inforIconSplitButton"))
			{
				$control.parent().removeClass(targetClass);
				$control.removeAttr(targetClass);
				$control.next().removeAttr(targetClass);
				$control.removeClass(targetClass);
				$control.next().removeClass(targetClass);
				return;
			}
			
			if ($control.hasClass("inforMenuButton"))
			{
				$control.removeClass(targetClass);
				return;
			}
			
			if ($control.hasClass("inforFormButton"))
			{
				$control.removeClass(targetClass);
				//unwrap the parent div and remove the siblings
				if (!$control.parent().hasClass("inforFormButton"))
					return;
				
				var isDisabled = $control.parent().css("display")=="none" && $control.parent().hasClass("inforFormButton");
				$control.siblings().remove();
				$control.unwrap();
				if (!isDisabled)
					$control.css("display","");
				
				return;
			} 

			if ($control.hasClasses(["inforTextbox","inforTextArea"]))
			{
				$control.removeClass(targetClass);
				$control.removeAttr(targetClass);
			}		
			
			if ($control.hasClass("inforDualListExchange"))
			{
				$control.removeClass("disabled").inforDualListExchange("option","enabled",true);
				return;
			}
			
			if ($control.hasClass("inforTree")) {
				$control.removeClass("disabled").unbind('before.jstree');
			}
			return;
		});
	};
	
	/*
	* Adds an isDisabled Function to jQuery.
	* Returns true if the control is Enabled.
	*/
	$.fn.isEnabled = function() {  
		if (this.length==0)
			return false;
			
		if (this[0].attributes["disabled"]==undefined)
			return true;
			
		if (this[0].attributes["disabled"].value=='disabled' || this[0].attributes["disabled"].value=='')
			return false;
			
		return false;
	};
	
	/*
	* Adds an isReadOnly Function to jQuery.
	* Returns true if the control is readOnly.
	*/
	$.fn.isReadOnly = function() {  
		if (this.length==0)
			return false;
			
		if (this[0].attributes["readonly"]==undefined)
			return false;
			
		if (this[0].attributes["readonly"].value=='readonly' || this[0].attributes["readonly"].value=='')
			return true;
			
		return false;
	};
	
	/*
	* Makes an object readonly. Fx for the checkboxes and radio buttons
	*/
	
	$.fn.readOnly = function() {  
		return this.each(function () {
			$(this).disable({readonly: true});
		});
	};
	
	/*
	* Toggles the Checkbox State.
	*/
	$.fn.toggleChecked = function() {  
		var checkBox = $(this);
		if (!checkBox.hasClass("inforCheckbox"))
			return false;
			
		var checked = !checkBox.attr('checked');
		checkBox.attr('checked', checked);
		if (checked)
			checkBox.parent().addClass("checked");
		else
			checkBox.parent().removeClass();

		return checked;
	};
	
	/*
	* Restricts the input on a Input Field to Numeric.
	*/
	$.fn.numericOnly = function(allowDecimal) {  
		var $input = $(this);
		
		//prevent pasting in bad values..
		$input.bind('paste', function(e) {
			var el = $(this);
			
			setTimeout(function() {
				var text = el.val();	
				if (allowDecimal)
					text = parseFloat(text);
				else
					text =  parseInt(text);
				
				if (isNaN(text))
					text = "";
					
				el.val(text);
			}, 100);
		});
		
		$input.keydown(function(event) {
			var key = event.keyCode;
			
			//Allow , and .
			if ( (!event.shiftKey && key==190) || (!event.shiftKey && key==188) || (!event.shiftKey && key==110)) {
				if (!allowDecimal || $input.val().indexOf(".")>-1)
					event.preventDefault(); 
				
				return;
			}
				
			//allow dash (negative)
			if (key==189 || key==109)
				return;
				
			// Allow: backspace, delete, tab and escape
			if (key == 46 || key == 8 || key == 9 || key == 27 || 
				 // Allow: Ctrl+A
				(key == 65 && event.ctrlKey === true) || 
				 // Allow: Ctrl+C
				(key == 67 && event.ctrlKey === true) || 
				 // Allow: Ctrl+X
				(key == 88 && event.ctrlKey === true) || 
				 // Allow: Ctrl+V
				(key == 86 && event.ctrlKey === true) || 
				// Allow: home, end, left, right
				(key >= 35 && key <= 39)) {
					 // let it happen, don't do anything
					 return;
			}
			else {
				// Ensure that it is a number and stop the keypress
				if ((key < 48 || key > 57) && (key < 96 || key > 105 ) || event.shiftKey ) {
					event.preventDefault(); 
				}   
			}

		});
		
		return $input;
	};		
	
	/*
	* Allows you to track dirty fields and add the dirty indicator...
	*/
    $.fn.trackDirty = function (settings) {
         var isDirty = "isDirty";
		 var config = {
                className: "inforDirtyIndicator",
                onDirtyChangeCallback: null
			},
            changeCallback = function () {
                var el = this,
                    $el = $(el);
					
				if (($el.attr("readonly") || $el.attr("disabled")) && !$el.hasClass("selectOnly"))
						return;
                
				//Handle Setting back to orginal value - the value is set at plugin initialization
				var isChangedBack = $el.data("originalValue") === $el.getValue();
				if ($el.is("select"))
				{	
					isChangedBack = ($el.data("originalValue") === $el.getCode()) || ($el.data("originalValue") === $el.val());
				}
				
				if (isChangedBack)
				{
					$el.data(isDirty, false);
					if ($el.prev().hasClass("inforDirtyIndicator"))
						$el.prev().remove();
					
					return;
				}
				
                if ($el.data(isDirty) === true)
                    return;
				
                $el.data(isDirty, true);
				if (!Globalize.culture().isRTL) 
					$el.before("<div class='inforDirtyIndicator'></div>");
				else
					$el.after("<div class='inforDirtyIndicator'></div>");
				
				if (config.onDirtyChangeCallback)
                    config.onDirtyChangeCallback.apply(el)
            };

        if (settings) $.extend(config, settings);
        
        this.each(function () {
			var $this = $(this);
			
			var originalVal = $this.getValue();
			
			if ($this.is("select"))
					originalVal = $this.getCode();
			
			if (originalVal==undefined)
				originalVal=null;
				
            $this.data("originalValue",originalVal);
			if ($this.is(":visible")) {
				$this.filter(":input").change(changeCallback);
				$this.find(":input").live("change", changeCallback);
			}
        });

        return this;
    };
    
	/*
	* Allows you to set field widths to the longest..
	*/
    $.fn.autoWidth = function(options) 
	{ 	
		var settings = { 
			limitWidth   : false 
		} 

		if (options) { 
			$.extend(settings, options); 
		} 

		var maxWidth = 0,
			isCheckboxLabel = false;
			
		this.css("width","auto"); 
		
		this.each(function(){ 
				var $this = $(this);
				if ($this.width() > maxWidth){ 
				  if(settings.limitWidth && maxWidth >= settings.limitWidth) { 
					maxWidth = settings.limitWidth; 
				  } else { 
					maxWidth = $this.width(); 
				  } 
				} 
				if ($this.hasClass("inforCheckboxLabel"))
					isCheckboxLabel = true;
		});   

		this.width(maxWidth + (isCheckboxLabel ? 2: 0)); 
	}

	$.fn.isVisible = function(value) 
	{ 	
		this.each(function(){ 
			$control = $(this);
			if ($control.hasClass("inforFormButton"))
			{
				if ($control.hasClass("disabled"))
					$control = $control.parent();
			}
			
			if (!value)
				$control.hide();
			else
				$control.show();
		});
	}
	
	$.fn.maxlength = function(value) { 	
		if (!$.browser.msie)
			return this;
		
		this.each(function(){ 
			var $control = $(this),
				maxlength = $control.attr('maxlength');
				
			if (typeof maxlength !== 'undefined' && maxlength !== false) {
				$control.on('keydown blur', function() {
					setTimeout(function() {
						// Store the maxlength and value of the field.
						var val = $control.val();
							
						// Trim the field if it has content over the maxlength.
						if (val.length > maxlength) {
							$control.val(val.slice(0, maxlength)).trigger("change");
						}
					},1);
				}).on("paste", function(){
					$(this).trigger("keydown");
				});
			}
		});
		
		return this;
	}
	
    // Add :dirty selector
    $.extend($.expr[":"], {
        dirty: function (a) {
            return $(a).data(isDirty) === true;
        }
    });
	
	// Add : hasClasses
	$.fn.extend({
		hasClasses: function (selectors) {
			var self = this;
			for (i in selectors) {
				if ($(self).hasClass(selectors[i])) 
					return true;
			}
			return false;
		}
	});
	
	
	/* Override the jquery Function to set the centerslice text - note that this should also work on form buttons. */
	$.fn.baseText = $.fn.text;
	$.fn.text = function (value) { 
		var centerslice=this.children(".centerSlice");
		if (centerslice.length>0) {
			return (value == undefined ? centerslice.baseText() : centerslice.baseText(value));
		}
		else {
			return (value == undefined ? this.baseText() : this.baseText(value));
		}
	};
	
	/* Override the jquery hide function to add better behavior for controls */
	$.fn.baseHide = $.fn.hide;
	$.fn.hide = function (duration , easing , callback ) { 
		var elem,
			i = 0,
			j = this.length;
		
		for ( ; i < j; i++ ) {
			elem = $(this[i]);
			if (elem.hasClasses(['inforLookupField', 'inforDateField', 'inforUrlField', 'inforSpinner', 'inforSearchField', 'inforEmailField', 'inforCalculatorField'])) {
				elem.closest(".inforTriggerField").hide(duration , easing , callback);
			} else if (elem.hasClass("inforDropDownList") && elem.data("initialized")) {
				elem.next().hide(duration , easing , callback);
			} else if (elem.is("button") && (elem.hasClass("inforFormButton") || elem.hasClass("inforTextButton")) && elem.parent().hasClass("disabled")) {
				elem.parent().hide(duration , easing , callback);
			} else {
				elem.baseHide(duration , easing , callback)
			}
		}
		return this;
	};
	
	/* Override the jquery show function to add better behavior for controls */
	$.fn.baseShow = $.fn.show;
	$.fn.show = function (duration , easing , callback ) { 
		var elem,
			i = 0,
			j = this.length;
		
		for ( ; i < j; i++ ) {
			elem = $(this[i]);
		
			if (elem.hasClasses(['inforLookupField', 'inforDateField', 'inforUrlField', 'inforSpinner', 'inforSearchField', 'inforEmailField', 'inforCalculatorField'])) {
				elem.closest(".inforTriggerField").show(duration , easing , callback);
			} else if (elem.hasClass("inforDropDownList") && elem.data("initialized")) {
				elem.next().show(duration , easing , callback);
			} else if (elem.is("button") && (elem.hasClass("inforFormButton") || elem.hasClass("inforTextButton")) && elem.parent().hasClass("disabled")) {
				elem.parent().show(duration , easing , callback);
			} else {
				elem.baseShow(duration , easing , callback)
			}
		}
		return this;
	};
	
})(jQuery);

/*
* Infor Placeholder plugin.
* Copyright 2010, Daniel Stocks (http://webcloud.se)
* Released under the MIT, BSD, and GPL Licenses.
*/
(function($) {
	function Placeholder(input) {
		this.input = input;
		if (input.attr('type') == 'password') {
			this.handlePassword();
		}
		// Prevent placeholder values from submitting
		$(input[0].form).submit(function() {
			if (input.hasClass('placeholder') && input[0].value == input.attr('placeholder')) {
				input[0].value = '';
			}
		});
	}
	Placeholder.prototype = {
		show : function(loading) {
			// FF and IE saves values when you refresh the page. If the user refreshes the page with
			// the placeholders showing they will be the default values and the input fields won't be empty.
			if (this.input[0].value === '' || (loading && this.valueIsPlaceholder())) {
				if (this.isPassword) {
					try {
						this.input[0].setAttribute('type', 'text');
					} catch (e) {
						this.input.before(this.fakePassword.show()).hide();
					}
				}
				this.input.addClass('placeholder');
				this.input[0].value = this.input.attr('placeholder');
			}
		},
		hide : function() {
			if (this.valueIsPlaceholder() && this.input.hasClass('placeholder')) {
				this.input.removeClass('placeholder');
				this.input[0].value = '';
				if (this.isPassword) {
					try {
						this.input[0].setAttribute('type', 'password');
					} catch (e) { }
					// Restore focus for Opera and IE
					this.input.show();
					this.input[0].focus();
				}
			}
		},
		valueIsPlaceholder : function() {
			return (this.input[0].value=="") || (this.input[0].value == this.input.attr('placeholder'));
		},
		handlePassword: function() {
			var input = this.input;
			input.attr('realType', 'password');
			this.isPassword = true;
			// IE < 9 doesn't allow changing the type of password inputs
			if ($.browser.msie && input[0].outerHTML) {
				var fakeHTML = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, 'type=$1text$1'));
				this.fakePassword = fakeHTML.val(input.attr('placeholder')).addClass('placeholder').focus(function() {
					input.trigger('focus');
					$(this).hide();
				});
				$(input[0].form).submit(function() {
					fakeHTML.remove();
					input.show()
				});
			}
		}
	};
	var NATIVE_SUPPORT = !!("placeholder" in document.createElement( "input" ));
	$.fn.placeholder = function() {
		return NATIVE_SUPPORT ? this : this.each(function() {
			var input = $(this);
			var placeholder = new Placeholder(input);
			placeholder.show(true);
			input.focus(function() {
				placeholder.hide();
			});
			input.change(function() {
				$(this).removeClass('placeholder');
			});
			input.blur(function() {
				placeholder.show(false);
			});

			// On page refresh, IE doesn't re-populate user input
			// until the window.onload event is fired.
			if ($.browser.msie) {
				$(window).load(function() {
					if(input.val()) {
						input.removeClass("placeholder");
					}
					placeholder.show(true);
				});
				// What's even worse, the text cursor disappears
				// when tabbing between text inputs, here's a fix
				input.focus(function() {
					if(this.value == "") {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveStart('character', 0);
						range.select();
					}
				});
			}
		});
	}
})(jQuery);
/*
 * Infor JQuery FieldSet Control: Turns any Div into a collapsable fieldset.
 * 
 * Usage: 
 *      $(".inforFieldSet").inforFieldSet();
*/
(function($){
	$.fn.inforFieldSet = function( options ) {
		var settings = {
			collapsible: true,
			divider: true,
			initialState: 'closed'
		};
		
		return this.each(function() {
			var	o = $.extend({}, settings, options), //Extend the options if any provided
			$div = $(this);
				
			//attach the click and logic to the expand button.
			$div.find("legend")
				.unbind('click')
				.attr("title", Globalize.localize("ExpandCollapse"))
				.click(function(){	
					var $this = $(this);
					//Toggle the state....
					if ($this.hasClass("closed"))
					{	//Open It
						$this.removeClass("closed");
						$this.addClass("open");
					} else {	
						//Close It
						$this.removeClass("open");
						$this.addClass("closed");
					}
					$this.nextAll("div.content").fadeToggle(300,function() {
						$('.autoLabelWidth').find('.inforLabel').autoWidth();
						$('.inforTabContainer').trigger("resize");
					});
				});
			
			//Set the initial state to either open or closed. Could do this by css or by the plugin.
			var expandButton = $div.find(".inforExpandButton").first();
			
			if (expandButton.hasClass("open") || o.initialState=="open")
			{
				expandButton.addClass("open");
				expandButton.removeClass("closed");
				expandButton.nextAll("div.content").show();
			}
			else {
				expandButton.addClass("closed");
				expandButton.removeClass("open");
				expandButton.nextAll("div.content").hide();
			}
			
			//Hide the divider if we dont need it. Can also set in initial html
			if (!o.divider)
			{
				$(this).css("borderRightWidth","0px");
			}
			
			//Hide the expander if we dont need it. Can also set in initial html
			if (!o.collapsible)
			{
				$(this).find(".inforExpandButton").remove();
			}
			
			//correct text indent
			var firstChild = $div.children(":first")
			if (firstChild.hasClass("inforFieldSetLabel"))
			{
				if (firstChild.css("textIndent")=="0px")
					firstChild.css("textIndent","10px");
			}
			//correct margins when we are on a tab panel
		});
	};
	
	$.fn.expand = function () {
		return this.each(function() {
			var $elem = $(this);
			var className = $elem.attr("class");
			if (className=="inforFieldSet" || className=="inforLightFieldSet"){ 
				$elem.find("legend").addClass("open");
				$elem.find("legend").removeClass("closed");
				$elem.find("legend").nextAll("div.content").show("blind");
			} 
		});
	};
	
	$.fn.collapse = function () {
		return this.each(function() {
			var $elem = $(this);
			var className = $elem.attr("class");
			if (className=="inforFieldSet" || className=="inforLightFieldSet"){ 
				$elem.find("legend").addClass("closed");
				$elem.find("legend").removeClass("open");
				$elem.find("legend").nextAll("div.content").hide("blind");
			} 
		});
	};
}(jQuery));
/*
 * Infor Dual List Exchange - A Select From/To List
 *
 * Copyright 2011, Infor, http://www.infor.com 
 *
 * Usage: 
 *      $(document).ready(function() {
 * 			$("#inforDualListExchange1").inforDualListExchange();
 * 		});
 */
(function ($) {
	"use strict";
	
	$.widget("infor.inforDualListExchange", {
		options: {
			availableGridOptions: null, //The options for the grid
			selectedGridOptions: null, //The options for the grid - if null uses the same as availableGridOptions
			availabletemText: Globalize.localize("Available"),	//Translated text for the top headers
			selectedItemText: Globalize.localize("Selected"),		//Translated text for the top headers
			enabled: true,
			enableRowReordering: true
		},
		availableGrid: null,
		selectedGrid: null,
		rightButton: null,
		leftButton: null,
		upButton: null,
		downButton: null,
		_init: function() {
			var self = this,
				$div = $(this.element),
				o = this.options;
			
			if (!o.selectedGridOptions)	//if null uses the same as availableGridOptions
			o.selectedGridOptions = $.extend(true,{}, o.availableGridOptions);	//clone deep copy ...not by ref.
			
			
			//Create the html for the dual list
			var $table = $("<table>").appendTo($div);
			$("<tr>").append('<td colspan="2"><label class="inforLabel noColon">'+o.availabletemText+'</label></td>')
			    .append('<td colspan="2"><label class="inforLabel noColon">'+o.selectedItemText+'</label></td>').appendTo($table);
			
			//Create the Grid Row Area...
			//Calculate the area based on the size given on the div
			var totalHeight = $div.height(),
				totalWidth = $div.width();
			
			var widthOffset = 36+46,	//the size of the two button sets plus  offset.
				heightOffset = 24 + (o.availableGridOptions.showFooter ? 25 : 0);		//the size of the header row and grid footers...
				
			//TODO - Some way to set size in css.
			var $gridRow = $("<tr>").appendTo($table.find("tbody")),
				$available = $('<div id="available" ></div>').width((totalWidth-widthOffset)/2).height(totalHeight-heightOffset).appendTo($gridRow).wrap("<td>");

			$('<td><button type="button" class="inforFormButton right"><div class="inforFormButtonArrow right"></div></button><br><button type="button" class="inforFormButton left"><div class="inforFormButtonArrow left"></div></button></td>').appendTo($gridRow);
			var $selected = $('<div id="selected" ></div>').width((totalWidth-widthOffset)/2).height(totalHeight-heightOffset).appendTo($gridRow).wrap("<td>");
			$('<td><button type="button" class="inforFormButton up"><div class="inforFormButtonArrow up"></div></button><br><button type="button" class="inforFormButton down"><div class="inforFormButtonArrow down"></div></button></td>').appendTo($gridRow);
		
			//disable sort for the selected grid as it interferes with row reorder
			for (var i=0; i < o.selectedGridOptions.columns.length; i++) {
				o.selectedGridOptions.columns[i].sortable = false;
			}
			
			//enable row reorder..
			if (o.enableRowReordering) {
				o.selectedGridOptions.enableRowReordering = true;
				o.selectedGridOptions.columns.push({ sortable: false, id: "rowReordering", name: "", width: 40, behavior: "selectAndMove", selectable: false, resizable: false, cssClass: "cell-reorder dnd" });
			}
			
			//o.selectedGridOptions.showFilter = false;
			
			this.availableGrid = $available.inforDataGrid(o.availableGridOptions);
			this.selectedGrid  = $selected.inforDataGrid(o.selectedGridOptions);
			
			this.availableGrid.getData().onRowCountChanged.subscribe(function (e, args) {
				self._setButtonStates();
			});
			
			this.availableGrid.onSelectedRowsChanged.subscribe(function (e, args) {
				self._setButtonStates();
			});
			
			this.selectedGrid.onSelectedRowsChanged.subscribe(function (e, args) {
				self._setButtonStates();
			});
			
			//link the buttons
			this.rightButton = $div.find(".inforFormButton.right").attr("title",Globalize.localize("Add")).inforFormButton().click(function(e) {
				self._transferSelectedRows(self.availableGrid, self.selectedGrid, true);
			});
			
			this.leftButton = $div.find(".inforFormButton.left").attr("title",Globalize.localize("Remove")).inforFormButton().click(function(e) {
				self._transferSelectedRows(self.selectedGrid, self.availableGrid, false);
			});
			
			this.upButton = $div.find(".inforFormButton.up").attr("title",Globalize.localize("MoveUp")).inforFormButton().click(function(e) {
				self._moveSelectedRows(self.selectedGrid, "up");
			});
			
			this.downButton = $div.find(".inforFormButton.down").attr("title",Globalize.localize("MoveDown")).inforFormButton().click(function(e) {
				self._moveSelectedRows(self.selectedGrid, "down");
			});
			
			this._setupDragDrop();
			
			//link the click events (click a row to move it
			this.availableGrid.onDblClick.subscribe(function(e) {
				self._transferSelectedRows(self.availableGrid, self.selectedGrid, true);
			});
			
			this.selectedGrid.onDblClick.subscribe(function(e) {
				self._transferSelectedRows(self.selectedGrid, self.availableGrid, false);
			});
			
			this._setButtonStates();
		},
		_setupDragDrop: function() {
		  var grid = this.availableGrid,
			  self = this;
		  
		  //subscribe events to the drag source
		  this.availableGrid.onDragInit.subscribe(function (e, dd) {
			// prevent the grid from cancelling drag'n'drop by default
			e.stopImmediatePropagation();
		  });

		  this.availableGrid.onDragStart.subscribe(function (e, dd) {
		  
			if (!self.options.enabled)
				return;
				
			var cell = grid.getCellFromEvent(e),
				data = grid.getData().getItems();
			if (!cell) {
			  return;
			}

			dd.row = cell.row;
			if (!data[dd.row]) {
			  return;
			}

			if (Slick.GlobalEditorLock.isActive()) {
			  return;
			}

			e.stopImmediatePropagation();
			var selectedRows = grid.getSelectedRows();

			if (!selectedRows.length || $.inArray(dd.row, selectedRows) == -1) {
			  selectedRows = [dd.row];
			  grid.setSelectedRows(selectedRows);
			}

			dd.rows = selectedRows;
			dd.count = selectedRows.length;

			var proxy = $("<span></span>")
				.addClass("inforDragProxy")
				.text(dd.count + " selected row(s)")
				.appendTo("body");

			dd.helper = proxy;

			$(dd.available).addClass("dragTarget");	
			return proxy;
		  });

		  this.availableGrid.onDrag.subscribe(function (e, dd) {
			e.stopImmediatePropagation();
			dd.helper.css({top: e.pageY + 14, left: e.pageX + 14});
		  });

		  this.availableGrid.onDragEnd.subscribe(function (e, dd) {
			e.stopImmediatePropagation();
			dd.helper.remove();
			$(dd.available).removeClass("dragTarget");	
		  });

		  //subscribe events to the drag target
		  $("#selected")
			.bind("dropend", function (e, dd) {
				$(dd.available).removeClass("dragTarget");	
			})
			.bind("drop", function (e, dd) {
				
				if (!dd.helper)
					return;		//to avoid this firing on row move/column drag exc..
					
				self._transferSelectedRows(self.availableGrid, self.selectedGrid, true);	//addToSelected();
			});
			
		   $.drop({ mode:true });	//set mode so that when we drag onto the element it drops as apposed to if the proxy touches it
		},
		_moveSelectedRows: function(source, direction) {
			if (!this.options.enabled)
				return;
			
			//find all selected rows..
			var selectedItems = source.getSelectedRows(),
				data = source.getData().getItems();
			
			if (direction=="up")
				selectedItems.sort();
			else
				selectedItems.sort().reverse();
			
			if (selectedItems[0]==0 && direction=="up")
				return;
			
			if (selectedItems[0]==data.length-1 && direction!="up")
				return;
				
			for (var i=0; i < selectedItems.length; i++) {
				//remove the row
				var from = selectedItems[i],
					to = selectedItems[i]+(direction=="up" ? -1 : 1);
				
				if (to<0 || to>data.length)
					continue;
					
				data.splice(to, 0, data.splice(from, 1)[0]);
			}
			source.updateData(data);
			this._setButtonStates();
		},
		_transferSelectedRows: function(source, target, indicator) {
			if (!this.options.enabled)
				return;
				
			//add all of the selected items to selected list
			var selectedItems = source.getSelectedRows(),
				itemsToAdd = [];
			
			if (selectedItems.length==0)
				return;
				
			selectedItems.sort();
			var last = selectedItems[selectedItems.length-1];
			
			for (var i=0; i < selectedItems.length; i++) {
				itemsToAdd.push(source.getDataItem(selectedItems[i]));
			}
			
			if (selectedItems[0]==-1)
				return;
				
			target.addRows(itemsToAdd, indicator);
			source.removeSelectedRows();
			
			//select the next one...
			if (source.getDataLength()>0)
				source.setSelectedRows((source.getDataLength() == last ? [source.getDataLength()-1] : [last]));
			
			this._setButtonStates();
		},
		_setOption: function(key, value) {	
			//Set any options after the control is initialized.
			$.Widget.prototype._setOption.apply(this,arguments);
			
			if (key=="enabled") {
				this._setButtonStates();
				
				if (this.options.enableRowReordering) {
					if (value==false)
						this.selectedGrid.hideColumn("rowReordering");
					else
						this.selectedGrid.showColumn("rowReordering");
				}
			}
		},
		_setButtonStates: function () {

			if (!this.options.enabled) {
				this.leftButton.disable();
				this.downButton.disable();
				this.upButton.disable();
				this.rightButton.disable();
				return;
			}
			
			//Set the buttons to disabled as needed.
		    var selectedCount = this.selectedGrid.getDataLength(),
                availCount = this.availableGrid.getDataLength();

			 if (selectedCount > 1) {
		        this.downButton.enable();
		        this.upButton.enable();
		    } else {
				this.downButton.disable();
				this.upButton.disable();
			 }
			
			if (selectedCount > 0) {
		       this.leftButton.enable();
			} else {
				this.leftButton.disable();
            }
			if (availCount > 0) {
		        this.rightButton.enable();
		    } else {
		        this.rightButton.disable();
		    }
			
			if (this.selectedGrid.getSelectedRows().length==0) {
				this.leftButton.disable();
				this.downButton.disable();
				this.upButton.disable();
			}
			
			if (this.availableGrid.getSelectedRows().length==0) {
				this.rightButton.disable();
			}
			
		},
		getGrids: function() {
			//Return the grids so they can be accessed with the grid api.
			return {available: this.availableGrid, selected: this.selectedGrid};
		},
		setSelectedItems: function(items) {
			if (this.selectedGrid==undefined)
				return;
			
			this.selectedGrid.updateData(items);
		},
		setAvailableItems: function(items) {
			if (this.availableGrid==undefined)
				return;
			
			this.availableGrid.updateData(items);
		},
		getSelectedItems: function() {
			if (this.selectedGrid==undefined)
				return [];
				
			return this.selectedGrid.getData().getItems();
		},
		getAvailableItems: function() {
			if (this.availableGrid==undefined)
				return [];
				
			return this.availableGrid.getData().getItems();
		}
	});
}($));

/*
 * Infor DropDown List
 *
 * Depends:
 *	inforContextMenu
 *	jquery.js
 */
 (function ($) {
	
    $.widget("ui.inforDropDownList", {
		options: {
			source: null,
			displayCodeOnly: false, //if true we show the option value in the field
			editable: false,	//Cannot Type in the Drop Down.
			typeAheadSearch: true,	//disable type ahead search when editable=false
			delay: 700, //The delay in milliseconds the autocompleter waits after a keystroke to activate itself
			beforechange: null
		},
		_create: function () {
            var self = this;
            var select = this.element;
			
			if (select.data("initialized")!=undefined)	//is wrapped
				return;
			
			var inlineCss=select.attr("style");
			select.data("initialized",true);
			select.baseHide();
			
			//Init the source function.
			if (self.options.source==null) {
				self.options.source=function (request, response) {
					//var matcher = new RegExp(request.term, "i");
					response(select.children("option").map(function () {
						var text = $(this).text();
						//if ((!request.term || matcher.test(text)))
						if ((!request.term || text.toLowerCase().indexOf(request.term.toLowerCase()) > -1 ))
								return {
								id: this.value,
								label: (request.term =="" ? text : text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>")),
								value: text,
								cssClass: $(this).attr("class"),
								title: this.title
							};
					}));
				}
			}

			var input = $("<input>")
					.insertAfter(select)
					.autocomplete({
						displayCodeOnly: self.options.displayCodeOnly,
						source: self.options.source,
					    delay: self.options.delay,
						editable: self.options.editable,
						change: function (event, ui) {
					      if (!ui.item) {	//value was typed
							  var value = this.value;
							  var id = select.find(":contains('"+value+"')").val();
							  select.data("selectedId",id);
							  select.val(id);
							  self._trigger("selected", event, {
										item: {
										id:  id,
										label: value,
										value: value
									}
							  });
							  return false;
							}
							select.val(ui.item.id);
							select.data("selectedId",ui.item.id);
							
							self._trigger("selected", event, {
								item: select.find("[value='" + ui.item.id + "']")
							});
					    },
						select: function (event, ui) {
					      $(this).data("lastValue",ui.item.value);
						  select.data("selectedId",ui.item.id);
						  
						  if (self.options.displayCodeOnly)
								input.setValue(ui.item.id);
								
							//set selected icon..
						   self._setSelectedIcon(ui.item,input);
						},
					    minLength: 0
					})
					.change(function(event, item) {
						if (self.options.beforechange) {
							item = self.options.beforechange(event, item);
							input.val(item.value);
							input.data("lastValue",item.value);
							setTimeout(function() {
								input.val(item.value);
							},175);
						}
						if (item) {
							select.val(item.id);
							select.data("selectedId",item.id);
							
							if (self.options.displayCodeOnly)
							{
								select.val(item.id);
								$(this).setValue(item.id);
							}	
							select.trigger('change');  
						}
					})
					.addClass("inforDropDownList")
					.attr("tabindex", select.attr("tabindex"));
			
			//when on a tab not initialized correctly - hope that the css is correct and dont copy it over.
            if (!select.is(":visible") && select.width()==0)
				input.css("width","");
				
			var $select = $(select);
			
			//Carry over the readonly and disabled styling
			if (!$select.is(":enabled"))
				input.attr('disabled','disabled');
		
			
			if ($select.isReadOnly()) {
				input.attr('readonly','readonly');
				input.removeClass("selectOnly");
			}
			
			//use the new plugin to styling this control.
			input.inforTriggerField();
			input.focus(function(e) {
				if (!e.isTrigger)
					select.trigger("focus");
			});
			
			//copy knockout bindings - if ko is present
			if (typeof ko !="undefined") {
				ko.copyBinding($select, input.closest(".inforTriggerField"), "visible", true);
				ko.copyBinding($select, input, "enable", false);
				ko.copyBinding($select, input, "readOnly", false);
				ko.copyBinding($select, input.closest(".inforTriggerField"), "enable", false);
				ko.copyBinding($select, input.closest(".inforTriggerField"), "readOnly", false);
				ko.copyBinding($select, input.closest(".inforTriggerField"), "css", false);
			}
	
			var $div = input.closest(".inforTriggerFieldTable");
			//carry over other css.
			if (inlineCss!=undefined) {
				$div.attr("style",inlineCss);
				var width = $div.width();
				$div.width("");
				
				//copy the width
				input.width(width);
				input.attr("style",inlineCss);
				
				//remove positional attributes
				input.css("position","").css("top","").css("left","");
			}
			
			//attach button code.
			var button = input.closest("tbody").find(".inforTriggerButton")
				.attr("title", Globalize.localize("DisplayDropDownList"))
				.attr("tabIndex","-1")
				.click(function () {
					// close if already visible
					if (input.autocomplete("widget").is(":visible")) {
						input.autocomplete("close");
						  return false; //false prevents control from submitting form
					}
					// pass empty string as value to search for, displaying all results
					input.autocomplete("search", "");
					input.focus();
					return false; //false prevents control from submitting form
				});
			
			input.closest("tr").find("td:eq(2)").append(button);
			if (!self.options.editable)
				input.autocomplete("makeSelectOnly", $(select).isReadOnly(), self.options.typeAheadSearch);
			
			//Set the Initial Value.
			var item = $(select).find("option:selected");
			
			if (self.options.displayCodeOnly)
				input.val(item.val());
			else
				input.val(item.text());
			
			$(select).data("selectedId",item.val());
			
			//set initial icon...
			this._setSelectedIcon(item,input);
			
			//Carry forward the placeholder.
			if ($(select).attr('placeholder'))
				input.attr('placeholder',$(select).attr('placeholder'));
			
			if ($div.css("position")=="absolute")
				input.width(input.width()-44);
					
		},
		_setSelectedIcon: function(item,input) {
			var cssClass=cssClass = item.cssClass; 
			if (cssClass==undefined && item.attr!=undefined)
				cssClass = item.attr("class");
				
			if (cssClass) {
				var $img = input.prev(".inforDropDownSelectedImage");
				
				if ($img.length==0) {
					$img = $('<div class="inforDropDownSelectedImage"></div>').addClass(cssClass);
					input.before($img).css("text-indent","14px");
					$img.css({"position":"absolute","height":"16px","width":"17px","margin-top":"2px","background-repeat":"no-repeat"});
				} else {
					$img.attr("class","");
					$img.addClass("inforDropDownSelectedImage "+cssClass);
				}
			} else {
				input.css("text-indent","").prev(".inforDropDownSelectedImage").remove();
			}
		},
		destroy: function () {
			$(this.element).show().next().remove();
		},
		setCode: function(codeValue) {
			var $elem = this.element;
			
			//first find the code.
			var selectedOption = $elem.find("option[value='" + codeValue +"']").prop("selected",true);
			//unselect others..
			$elem.find("option:selected").not("option[value='" + codeValue +"']").prop("selected",false);
			$elem.trigger("change");
			
			//Update the input.
			var input = $elem.next().find("input");
			input.val(selectedOption.text());
			
			//set the image
			this._setSelectedIcon(selectedOption,input);
		}
	});

})(jQuery);

/*
 * jQuery UI Autocomplete 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
	options: {
		displayCodeOnly: false,
		appendTo: "body",
		autoFocus: true,
		delay: 700,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "fit flip",
			offset: "-3 -2"
		},
		source: null,
		typeAheadSearch: true,
		suggestHook: null 	//lookup behavior - just return the items and let the lookup control use its code to do it
	},

	pending: 0,
	isInGrid: false,
	_create: function() {
		var self = this,
			doc = this.element[ 0 ].ownerDocument,
			suppressKeyPress;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" )
			.attr({
				role: "textbox",
				"aria-autocomplete": "list",
				"aria-haspopup": "true"
			})
			.bind( "keydown.autocomplete", function( event ) {
				self.handleKey(event);
			})
			.bind( "keypress.autocomplete", function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					event.preventDefault();
				}
			})
			.bind( "focus.autocomplete", function() {
				if ( self.options.disabled ) {
					return;
				}

				self.selectedItem = null;
				self.previous = self.element.val();
			})
			.bind( "blur.autocomplete", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				clearTimeout( self.searching );
				// clicks on the menu (or a button to trigger a search) will cause a blur event
				self.closing = setTimeout(function() {
					self.close( event );
					self._change( event );
				}, 100 );	//changed from 50 this makes second click close the open menu.
			});
		this._initSource();
		this.response = function() {
			return self._response.apply( self, arguments );
		};
		
		if (this.options.suggestHook==undefined) {	//do not add menus to the page for the lookup.
			this.menu = $("<ul></ul>")
				.addClass( "ui-autocomplete" )
				.appendTo( $( this.options.appendTo || "body", doc )[0] )
				// prevent the close-on-blur in case of a "slow" click on the menu (long mousedown)
				.mousedown(function( event ) {
					// clicking on the scrollbar causes focus to shift to the body
					// but we can't detect a mouseup or a click immediately afterward
					// so we have to track the next mousedown and close the menu if
					// the user clicks somewhere outside of the autocomplete
					var menuElement = self.menu.element[ 0 ];
					if ( !$( event.target ).closest( ".contextMenuItem" ).length ) {
						setTimeout(function() {
							$( document ).one( 'mousedown', function( event ) {
								if ( event.target !== self.element[ 0 ] &&
									event.target !== menuElement &&
									!$.ui.contains( menuElement, event.target ) ) {
									self.close();
								}
							});
						}, 1 );
					}

					// use another timeout to make sure the blur-event-handler on the input was already triggered
					setTimeout(function() {
						clearTimeout( self.closing );
					}, 13);
				})
				.menu({
					focus: function( event, ui ) {
						var item = ui.item.data( "item.autocomplete" );
						if ( false !== self._trigger( "focus", event, { item: item } ) ) {
							// use value to match what will end up in the input, if it was a key event
							if ( /^key/.test(event.originalEvent.type) ) {
								self.element.val( item.value );
							}
						}
					},
					selected: function( event, ui ) {
						var item = ui.item.data( "item.autocomplete" ),
							previous = self.previous;

						// only trigger when focus was lost (click on menu)
						if ( self.element[0] !== doc.activeElement ) {
							self.element.focus();
							self.previous = previous;
							// #6109 - IE triggers two focus events and the second
							// is asynchronous, so we need to reset the previous
							// term synchronously and asynchronously :-(
							setTimeout(function() {
								self.previous = previous;
								self.selectedItem = item;
							}, 1);
						}

						if ( false !== self._trigger( "select", event, { item: item } ) ) {
							self.element.val( item.value );
						}
						// reset the term after the select event
						// this allows custom select handling to work properly
						self.term = self.element.val();

						self.close( event );
						self.selectedItem = item;
						//textbox value has changed, trigger change event
						self.element.trigger('change', item);
					},
					blur: function( event, ui ) {
						// don't set the value of the text field if it's already correct
						// this prevents moving the cursor unnecessarily
						if ( self.menu.element.is(":visible") &&
							( self.element.val() !== self.term ) ) {
							self.element.val( self.term );
						}
					}
				})
				.zIndex( this.element.zIndex() + 3000 )
				// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
				.css({ top: 0, left: 0 })
				.hide()
				.data( "menu" );
		} 
		
		if ( $.fn.bgiframe ) {
			 this.menu.element.bgiframe();
		}
		this.isInGrid = (this.element.closest(".slick-cell").length==1);
	},
	
	 handleKey: function (event){
		var self = this;
		
		if ( self.options.disabled || (self.element.attr( "readonly" ) &&  !self.element.hasClass("selectOnly"))) {
			return;
		}
		suppressKeyPress = false;
		
		var keyCode = $.ui.keyCode;
		switch( event.keyCode ) {
		case keyCode.PAGE_UP:
			self._move( "previousPage", event );
			break;
		case keyCode.PAGE_DOWN:
			self._move( "nextPage", event );
			break;
		case keyCode.UP:
			if (self.menu==undefined)
				return;	//in the grid
				
			if (!self.menu.element.is(":visible")) {
				if (!self.isInGrid)
					self.openList(false, event);
				
				return;
			}	
			self._move( "previous", event );
			// prevent moving cursor to beginning of text field in some browsers
			event.preventDefault();
			event.stopPropagation();	//prevent moving in the grid
			break;
		case keyCode.DOWN:
			if (self.menu==undefined)
				return;	//in the grid
			
			if (!self.menu.element.is(":visible")) {
				if (!self.isInGrid)
					self.openList(false, event);
				
				return;
			}
			self._move( "next", event );
			// prevent moving cursor to end of text field in some browsers
			event.preventDefault();
			event.stopPropagation();	//prevent moving in the grid
			break;
		//passthrough - ENTER NUMPAD ENTER and TAB all select the current element
		case keyCode.ENTER:
		case keyCode.NUMPAD_ENTER:
		case keyCode.TAB:
			self.openList(event.keyCode==keyCode.TAB, event);
			break;
		case keyCode.ESCAPE:
			self.element.val( self.term );
			self.close( event );
			break;
		default:
			// keypress is triggered before the input value is changed
			clearTimeout( self.searching );
			self.searching = setTimeout(function() {
				// only search if the value has changed
				if ( self.term != self.element.val() && self.options.typeAheadSearch) {
					self.selectedItem = null;
					self.search( null, event );
				}
			}, self.options.delay );
			break;
		}
	 },
	 openList: function(isTab, event) {
		var self = this;
		if (self.menu==undefined)
				return;
			if ( !self.menu.active) {
				var isOpen = self.menu.element.closest(".inforMenu").is(":visible");
				if (isOpen)
					self.close( event );
				else {
					if (self.element.hasClass("selectOnly")) {
						if (!isTab) {	//only open on ENTER or num_enter
							self._search("");
							event.stopPropagation();
						}
					} else {
						//flush the typed in value when hitting enter to the select - webtop.
						var select = $(this).parent().prev();
						var value = this.value;
						var id = select.find(":contains('"+value+"')").val();
						   select.data("selectedId",id);
						   select.val(id);
						   self._trigger("selected", event, {
									item: {
									id:  id,
									label: value,
									value: value
								}
							});
					}
				}
				return;
			} 
			self.menu.select(event);
	 },
	 destroy: function() {
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-autocomplete" )
			.removeAttr( "aria-haspopup" );
			
		if (this.menu!=undefined && this.menu.element!=undefined)
			this.menu.element.closest(".inforMenu").remove();
			
		$.Widget.prototype.destroy.call( this );
	},
	 makeSelectOnly: function(isReadOnly, typeAheadSearch) {
		//Setup an editable type drop down styling and options. used in lookupfield and dropdown list
		var input = this.element,
			options = this.options,
			timeout = null;
		
		input.addClass((isReadOnly ? "" : "selectOnly"))
			.attr("readonly","")
			.focusin(function(){
				timeout = setTimeout(function(){
					input.select();
				},100);
			})
			.focusout(function(){
				clearTimeout(timeout);
			})
			.bind("keypress",function(event) {
				if (!typeAheadSearch)
					return;
				
				if (!input.hasClass("selectOnly"))
					return;	//readonly...
				
				var charCode = event.charCode || event.keyCode, 
				  character = String.fromCharCode(charCode); 
				
				if (event.ctrlKey || event.altKey)	//allow copy paste and other keyboard commands stuff
					return;
				
				if (charCode == 38 || charCode == 40)	//ignore arrow up and down.
					return;
					
				if (!/^[a-zA-Z*!@#$%^&0-9]+$/i.test(character))	//allow only alpha numerics...
					return;
				
				//get the key that was pressed.
				if (!event.shiftKey)
					character = character.toLowerCase();
				else
					character = character.toUpperCase();
				
				//trigger a search on the delay
				clearTimeout( self.searching );
				self.searching = setTimeout(function() {
					// todo : only search if the value has changed
					input.autocomplete('search', character);
				}, options.delay);
					
				//when the user starts typing place an input field over...
				var tempInput = $("<input id='inforTempInput' class='inforTempInput'>");
				//hide the current text..
				input.css("color","white");
				
				$('body').append(tempInput);
				tempInput.position({
					my: (Globalize.culture().isRTL ? "right" : "left"),
					at: (Globalize.culture().isRTL ? "right" : "left"),
					offset: (Globalize.culture().isRTL ? "-6 1" : "6 1"),
					of: input
				}).val(character).putCursorAtEnd()
				.autoGrowInput({	//similute highlighted effect
					comfortZone: 6,
					minWidth: 16,
					maxWidth: input.width()-4
				})
				.bind("keyup",function(event) {
					//handle arrow keys...
					if ($.inArray(event.which,[37,38,39,40,13])!=-1) {
						input.autocomplete('handleKey',event); 
						event.stopPropagation();
						event.preventDefault();
						return false;
					} else {
						//trigger a search on the delay
						clearTimeout( self.searching );
						self.searching = setTimeout(function() {
							input.autocomplete('search', event.target.value);
						}, options.delay );
					}
				})
				.bind("blur",function(event) {
					$("#inforTempInput").remove();
					input.css("color","");
					
					setTimeout(function() {
						if (!$("*:focus").closest(".contextMenuItem").length)
							input.autocomplete('close');
					},100);
				});
				
				event.preventDefault();
				return;
			}).bind("blur",function(event) {
				//restore the last value
				$(this).val($(this).data("lastValue"));
			}).bind("focus",function(event) {
				//focus the field and save the last value.
				var $this = $(this);
				$this.data("lastValue",$this.val());
				$this.select();
			});
		},
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( $( value || "body", this.element[0].ownerDocument )[0] )
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},
	_initSource: function() {
		var self = this,
			array,
			url;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter(array, request.term) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( self.xhr ) {
					self.xhr.abort();
				}
				self.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					autocompleteRequest: ++requestIndex,
					success: function( data, status ) {
						if ( this.autocompleteRequest === requestIndex ) {
							response( data );
						}
					},
					error: function() {
						if ( this.autocompleteRequest === requestIndex ) {
							response( [] );
						}
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},
	search: function( value, event) {
		value = value != null ? value : this.element.val();

		// always save the actual value, not the one passed as an argument
		this.term = this.element.val();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		clearTimeout( this.closing );
		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	 _search: function( value ) {
		this.pending++;
		this.element.addClass( "inforSmallLoadingIndicator" );
		this.source( { term: value }, this.response );
	},

	_response: function( content, columns, totalRows) {
		if ( !this.options.disabled && content && content.length ) {
			content = this._normalize( content );
			this._suggest( content, columns, totalRows);
			this._trigger( "open" );
		} else {
			this.close();
		}
		this.pending--;
		if ( !this.pending ) {
			this.element.removeClass( "inforSmallLoadingIndicator" );
		}
	},

	close: function( event ) {
		if (this.menu==undefined)	
			return;	//return
			
		clearTimeout( this.closing );
		var $menu = this.menu.element.closest(".inforMenu")
		
		if (event == undefined)
			$menu.hide();
		
		if ( $menu.is(":visible") ) {
			$menu.hide("blind",{}, 150);
			this.menu.deactivate();
			this._trigger( "close", event );
		}
	},
	
	_change: function( event ) {
		if ( this.previous !== this.element.val() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function(item) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items, columns, totalRows) {
		//detect if this is a lookupfield. in this case show a grid..
		if (this.options.suggestHook!=undefined) {
			this.options.suggestHook(items, columns, totalRows);
			return;
		}
			
		var $menu = this.menu.element.closest(".inforMenu")
			.zIndex( this.element.zIndex() + 90000 );
			
		//empty it and add new items..
		var ul = $menu.find(".inforMenuOptions");
		ul.empty();
		this._renderMenu( ul, items );
		
		// TODO refresh should check if the active item is still in the dom, removing the need for a manual deactivate
		this.menu.deactivate();
		this.menu.refresh();

		// size and position menu
		ul.show();
		$menu.show().css("opacity",0);
		this._resizeMenu();
		
		$menu.position( $.extend({
				of: this.element,
				my: "left top",
				at: "left bottom",
				collision: "none",
				offset: (Globalize.culture().isRTL ? "-16 -21" : null)
			}, this.options.position ));
			
		//see if we need to adjust the positioning or size to fit on top
		var top = 0;
		
		if ($menu!=undefined && $menu.position()!=undefined)
			top = $menu.position().top;
			
		if (top<=0) {
			//position on the bottom and shrink...
			$menu.position({
				my: "left top",
				at: "left bottom",
				collision: "none",
				of: this.element,
				offset: "-3 -2"
			});
			top = $menu.position().top;
			var inputHeight = 30;
			ul.height($(window).height()-top-inputHeight);
			$menu.height($(window).height()-top-inputHeight);
			$menu.find(".menuContent").css({"margin-bottom":"-2px","margin-top":"-4px" });
		}
		var selectedElem = $menu.find("li.selected");
		if (this.options.autoFocus) {
			if (selectedElem.length==0)
				this.menu.next( new $.Event("mouseover") );
		}
		
		//scroll selected element into view
		if (selectedElem.length>0) {
			this.menu.activate(new $.Event("mouseover") , selectedElem);
		}
		$menu.css("opacity",1).show("blind",{}, 150);
	},

	_resizeMenu: function() {
		var menu = this.menu.element.closest(".inforMenu");
		var width = this.element.outerWidth()-3;	//make the same width as the control (input part only)//(includes margin and width of button)
		menu.css("min-width",width);
		menu.find(".inforMenuOptions").css("min-width",width);
		if ($.browser.msie && $.browser.version==8) {	//correct growing when cursor in on a menu item on ie8
			menu.find(".menuContent").css("width",menu.find(".inforMenuOptions").width());
		}
	},

	_renderMenu: function( ul, items ) {
		var self = this;
		$.each( items, function( index, item ) {
			self._renderItem( ul, item );
		});
	},

	_renderItem: function( ul, item) {
		var labelVal = item.label=="" ? String.fromCharCode(160) : item.label;//allow blank items
		
		var anchor = $( "<a></a>" ).addClass(item.cssClass).html( labelVal );
		if (item.title)
			anchor.attr("title",item.title);
			
		var li= $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( anchor )
			.appendTo( ul );
		
			
		//Match the Selected Item..
		if ($.trim(this.term)==$.trim(item.label))
			li.addClass('selected');
		
		if (this.options.displayCodeOnly && this.term==item.id)
			li.addClass('selected');
			
		return li;
	},

	_move: function( direction, event ) {
		if (this.menu==undefined)	
			return;
		
		if ( !this.menu.element.is(":visible") ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.first() && /^previous/.test(direction) ||
				this.menu.last() && /^next/.test(direction) ) {
			this.element.val( this.term );
			this.menu.deactivate();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		if (this.menu!=undefined)
			return this.menu.element;
		else
			return this.element;
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});

}( jQuery ));

/*
 * JQuery UI Menu
 *  
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function($) {

$.widget("ui.menu", {
	_create: function() {
		var self = this;
		this.element
			.addClass("inforMenuOptions")
			.attr({
				role: "listbox"
			})
			.click(function( event ) {
				if ( !$( event.target ).closest( ".contextMenuItem a" ).length ) {
					return;
				}
				// temporary
				event.preventDefault();
				self.select( event );
			});
			
		var id = this.element.attr("id");
		if (id==undefined)
			id=$.generateId();
		
		$('body').append('<div class="inforMenu" id="'+id+'"><table cellspacing="0" cellpadding="0" class="" ><tbody><tr class="menuTop"><td class="menuTopLeft"></td><td class="menuTopCenter"></td><td class="menuTopRight"></td></tr><tr class="menuMiddle"><td class="menuMiddleLeft"></td><td class="menuMiddleCenter"><div class="menuMiddleCenterInner menuContent"></div></td><td class="menuMiddleRight"></td></tr><tr class="menuBottom"><td class="menuBottomLeft"></td><td class="menuBottomCenter"></td><td class="menuBottomRight"></td></tr></tbody> </table></div>');
		$('#' + id ).find(".menuContent").append(this.element);
		this.element.css("display","");
		this.refresh();
	},
	
	refresh: function() {
		var self = this;

		// don't refresh list items that are already adapted
		var items = this.element.children("li:not(.contextMenuItem):has(a)")
			.addClass("contextMenuItem")
			.attr("role", "menuitem");
		
		items.children("a")
			.attr("tabindex", -1)
			// mouseenter doesn't work with event delegation
			.mouseenter(function( event ) {
				self.activate( event, $(this).parent() );
			})
			.mouseleave(function() {
				self.deactivate();
			});
	},

	activate: function( event, item ) {
		this.deactivate();
		if (this.hasScroll()) {
			var offset = item.offset().top - this.element.offset().top,
				scroll = this.element.scrollTop(),
				elementHeight = this.element.height();
			if (offset < 0) {
				this.element.scrollTop( scroll + offset);
			} else if (offset >= elementHeight) {
				this.element.scrollTop( scroll + offset - elementHeight + item.height());
			}
		}
		this.active = item.eq(0)
			.children("a")
				.addClass("ui-state-hover")
				.attr("id", "ui-active-menuitem")
			.end();
		this._trigger("focus", event, { item: item });
	},

	deactivate: function() {
		if (!this.active) { return; }

		this.active.children("a")
			.removeClass("ui-state-hover")
			.removeAttr("id");
		this._trigger("blur");
		this.active = null;
	},

	next: function(event) {
		this.move("next", ".contextMenuItem:first", event);
	},

	previous: function(event) {
		 this.move("prev", ".contextMenuItem:last", event);
	},

	first: function() {
		return this.active && !this.active.prevAll(".contextMenuItem").length;
	},

	last: function() {
		return this.active && !this.active.nextAll(".contextMenuItem").length;
	},

	move: function(direction, edge, event) {
		var selected = this.element.find(".selected");
		
		if (!this.active && selected.length==0) {
			this.activate(event, this.element.children(edge));
			this.element.children(edge).addClass("selected");
			return;
		} else {
			this.activate(event, selected);
			selected.removeClass("selected");
		}
		var next = this.active[direction + "All"](".contextMenuItem").eq(0);
		if (next.length) {
			this.activate(event, next);
			next.addClass("selected");
		} else {
			this.activate(event, this.element.children(edge));
			this.element.children(edge).addClass("selected");
		}
	},
	nextPage: function(event) {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.last()) {
				this.activate(event, this.element.children(".contextMenuItem:first"));
				return;
			}
			var base = this.active.offset().top,
				height = this.element.height(),
				result = this.element.children(".contextMenuItem").filter(function() {
					var close = $(this).offset().top - base - height + $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(".contextMenuItem:last");
			}
			this.activate(event, result);
		} else {
			this.activate(event, this.element.children(".contextMenuItem")
				.filter(!this.active || this.last() ? ":first" : ":last"));
		}
	},
	previousPage: function(event) {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.first()) {
				this.activate(event, this.element.children(".contextMenuItem:last"));
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height();
				result = this.element.children(".contextMenuItem").filter(function() {
					var close = $(this).offset().top - base + height - $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(".contextMenuItem:first");
			}
			this.activate(event, result);
		} else {
			this.activate(event, this.element.children(".contextMenuItem")
				.filter(!this.active || this.first() ? ":last" : ":first"));
		}
	},

	hasScroll: function() {
		return this.element.height() < this.element[ $.fn.prop ? "prop" : "attr" ]("scrollHeight");
	},

	select: function( event ) {
		this._trigger("selected", event, { item: this.active });
	}
});

}(jQuery));

(function($){
	
	/* Return the Width of the text */
	String.prototype.textWidth = function(font) {
		var f = font || '11px arial',
		  o = $('<div>' + this + '</div>')
				.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
				.appendTo($('body')),
		  w = o.width();

		o.remove();
	  return w;
	}

}(jQuery));

/*
 * jQuery autoGrowInput plugin by James Padolsey
 * See related thread: http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fieldss
 */
(function($){
	

$.fn.autoGrowInput = function(o) {
	
	o = $.extend({
		maxWidth: 1000,
		minWidth: 0,
		comfortZone: 70
	}, o);
	
	this.filter('input:text').each(function(){
		
		var minWidth = o.minWidth || $(this).width(),
			val = '',
			input = $(this),
			check = function() {
				if (val === (val = input.val())) {return;}
				
				// Enter new content into testSubject
				var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				
				// Calculate new width + whether to change
				var testerWidth = escaped.textWidth(),
					newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
					currentWidth = input.width(),
					isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
										 || (newWidth > minWidth && newWidth < o.maxWidth);
				
				// Animate width
				if (isValidWidthChange)
					input.width(newWidth);
			};
		
		$(this).bind('keydown keyup blur update', check);
	});
	return this;
};
})(jQuery);
/*
 * Infor Date Field Control.
 * 
 * Deps:
 * 		jqueryUi - Datepicker
 * 
 * Usage: 
 *      $("inforDateField").inforDateField();
 *
 */
(function($){
	$.fn.inforDateField = function( options ) {
	    var settings = {
	       buttonText: Globalize.localize('SelectDate'),	
		   dateFormat: Globalize.culture().calendar.patterns.d,	//use current short date format unless its set by the control prefs.
		   openOnEnter: true,	//If the user hits enter the drop down will open when in the field.
		   showQuickDates: false, //Changes the Today button to a Menu Button with additional input options
		   quickDateOptions: [
				{label: Globalize.localize('Today'), offset: 0, period: 'T' },
				{label: Globalize.localize('OneWeekAgo'), offset: -7, period: 'D' },
				{label: Globalize.localize('OneMonthAgo'), offset: -1, period: 'M' },
				{label: Globalize.localize('SixMonthsAgo'), offset: -6, period: 'M' },
				{label: Globalize.localize('LastYear'), offset: -1, period: 'Y' },
				{label: Globalize.localize('NextWeek'), offset: 7, period: 'D' },
				{label: Globalize.localize('NextMonth'), offset: 1, period: 'M' },
				{label: Globalize.localize('NextYear'), offset: 1, period: 'Y' }
		   ],		//Overridable list of options for the quick dates menu
		   isHijri : (Globalize.culture().calendar.name== "UmAlQura" || Globalize.culture().calendar.name=="Hijri"),
    	   showTimeInput: false, //Adds a simple input field for time (You should use a format that supports time as well).
		   timeFormat: Globalize.culture().calendar.patterns.t, //Seperated Globalize time format to use in the date picker time picker - should also be in the dateFormat
		   validateInput: true
		};
		
		return this.each(function() {
			var	o = $.extend({}, settings, options), //Extend the options if any provided
			$dateField = $(this);
			$dateField.inforTriggerField();
			$dateField.datepicker(o);
			
			if (o.validateInput) {
				$dateField.data("lastValue",$dateField.val()).focus(function() {
					var field = $(this);
					 field.data("lastValue",field.val());
				}).bind("blur.validate",function () {
					var field = $(this),
						parsedDate = Globalize.parseDate(field.val());
						
					if (parsedDate == null && field.val()!="")
						field.val(field.data("lastValue"));
				});
			}
		});
	};
} (jQuery));

/*
* jQuery UI Datepicker 1.8.13 - Completely Modified from this version.
*
* Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* http://docs.jquery.com/UI/Datepicker
*
* Depends:
*	jquery.ui.core.js
*/
(function ($) {

    var PROP_NAME = 'datepicker';
    var dpuuid = new Date().getTime();
   
    /* Date picker manager.
    Use the singleton instance of this class, $.datepicker, to interact with the date picker.
    Settings for (groups of) date pickers are maintained in an instance object,
    allowing multiple different settings on the same page. */

    function Datepicker() {
        this.debug = false; // Change this to true to start debugging
        this._curInst = null; // The current instance in use
        this._keyEvent = false; // If the last event was a key event
        this._disabledInputs = []; // List of date picker inputs that have been disabled
        this._datepickerShowing = false; // True if the popup picker is showing , false if not
        this._inDialog = false; // True if showing within a "dialog", false if not
        this._mainDivId = 'inforDatePicker-div'; // The ID of the main datepicker division
        this._inlineClass = 'inforDatePicker-inline'; // The name of the inline marker class
        this._appendClass = 'inforDatePicker-append'; // The name of the append marker class
        this._triggerClass = 'inforDatePickerButton'; // The name of the trigger marker class
        this._dialogClass = 'inforDatePicker-dialog'; // The name of the dialog marker class
        this._disableClass = 'inforDatePicker-disabled'; // The name of the disabled covering marker class
        this._unselectableClass = 'inforDatePicker-unselectable'; // The name of the unselectable cell marker class
        this._currentClass = 'inforDatePicker-current-day'; // The name of the current day marker class
        this._dayOverClass = 'inforDatePicker-days-cell-over'; // The name of the day hover marker class
        this._defaults = { // Global defaults for all the date picker instances
			culture: '', // use jQuery.culture by default
		    showOn: 'button', // 'focus' for popup on focus,
            // 'button' for trigger button, or 'both' for either
            showAnim: 'fadeIn', // Name of jQuery animation for popup
            showOptions: {}, // Options for enhanced animations
            defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
            appendText: '', // Display text following the input box, e.g. showing the format
            buttonText: '...', // Text for trigger button
            buttonImage: '', // URL for trigger button image
            buttonImageOnly: true, // True if the image appears alone, false if it appears on a button
            hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
            navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
            gotoCurrent: false, // True if today link goes back to current selection instead
            showOtherMonths: true, // True to show dates in other months, false to leave blank
            selectOtherMonths: true, // True to allow selection of dates in other months, false for unselectable
            showWeek: false, // True to show week of the year, false to not show it
            calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			 // takes a Date and returns the number of the week for it
            shortYearCutoff: '+10', // Short year values < this are in the current century,
			minDate: null, // The earliest selectable date, or null for no limit
            maxDate: null, // The latest selectable date, or null for no limit
            duration: 'fast', // Duration of display/closure
            beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
            beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
            onSelect: null, // Define a callback function when a date is selected
            onChangeMonthYear: null, // Define a callback function when the month or year is changed
            onClose: null, // Define a callback function when the datepicker is closed
            numberOfMonths: 1, // Number of months to show at a time
            showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
            stepMonths: 1, // Number of months to step back/forward
            stepBigMonths: 12, // Number of months to step back/forward for the big links
            altField: '', // Selector for an alternate field to store selected dates into
            altFormat: '', // The date format to use for the alternate field
			altField2: '', // Selector for an alternate field to store selected dates into
            altFormat2: '', // The date format to use for the alternate field
            constrainInput: true, // The input is constrained by the current date format
            showButtonPanel: false, // True to show button panel, false to not show it
            autoSize: false, // True to size the input for the date format, false to leave as is
			openOnEnter: true //If the user hits enter the drop down will open when in the field.
        };
		this.dpDiv = $('<div id="' + this._mainDivId + '" class="inforDatePicker inforDatePicker-widget inforDatePicker-widget-content"></div>');
	}

    $.extend(Datepicker.prototype, {
        /* Class name added to elements to indicate already configured with a date picker. */
        markerClassName: 'hasDatepicker',

		// TODO rename to "widget" when switching to widget factory
        _widgetDatepicker: function () {
            return this.dpDiv;
        },

        /* Override the default settings for all instances of the date picker.
        @param  settings  object - the new settings to use as defaults (anonymous object)
        @return the manager object */
        setDefaults: function (settings) {
            extendRemove(this._defaults, settings || {});
            return this;
        },

        /* Attach the date picker to a jQuery selection.
        @param  target    element - the target input field or division or span
        @param  settings  object - the new settings to use for this date picker instance (anonymous) */
        _attachDatepicker: function (target, settings) {
            // check for settings on the control itself - in namespace 'date:'
            var inlineSettings = null;
            for (var attrName in this._defaults) {
                var attrValue = target.getAttribute('date:' + attrName);
                if (attrValue) {
                    inlineSettings = inlineSettings || {};
                    try {
                        inlineSettings[attrName] = eval(attrValue);
                    } catch (err) {
                        inlineSettings[attrName] = attrValue;
					}
                }
            }
            var nodeName = target.nodeName.toLowerCase();
            var inline = (nodeName == 'div' || nodeName == 'span');
            if (!target.id) {
                this.uuid += 1;
                target.id = 'dp' + this.uuid;
            }
            var inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {}, inlineSettings || {});
            if (nodeName == 'input') {
                this._connectDatepicker(target, inst);
            } else if (inline) {
                this._inlineDatepicker(target, inst);
			}
       },

        /* Create a new instance object. */
        _newInst: function(target, inline) {
			var id = target[0].id.replace(/([^A-Za-z0-9_])/g, '\\\\$1'); // escape jQuery meta chars
			return {id: id, input: target, // associated target
				selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
				drawMonth: 0, drawYear: 0, // month being drawn
				inline: inline, // is datepicker inline or not
				dpDiv: (!inline ? this.dpDiv : // presentation div
				$('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
			};
		},

        /* Attach the date picker to an input field. */
        _connectDatepicker: function (target, inst) {
            var input = $(target);
            inst.append = $([]);
            inst.trigger = $([]);
            if (input.hasClass(this.markerClassName))
                return;
            this._attachments(input, inst);
            input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp).
			bind("setData.datepicker", function (event, key, value) {
			    inst.settings[key] = value;
			}).bind("getData.datepicker", function (event, key) {
			    return this._get(inst, key);
			});
            this._autoSize(inst);
            $.data(target, PROP_NAME, inst);
        },

        /* Make attachments based on settings. */
        _attachments: function (input, inst) {
            var appendText = this._get(inst, 'appendText');
            var isRTL = this._get(inst, 'isRTL');
            if (inst.append)
                inst.append.remove();
            if (appendText) {
                inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
                input[isRTL ? 'before' : 'after'](inst.append);
            }
            input.unbind('focus', this._showDatepicker);
            if (inst.trigger)
                inst.trigger.remove();
            var showOn = this._get(inst, 'showOn');
            if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
                input.focus(this._showDatepicker);
            if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
                var buttonText = this._get(inst, 'buttonText');
                var buttonImage = this._get(inst, 'buttonImage');
                inst.trigger = $(inst.input).closest(".inforTriggerField").find(".inforTriggerButton");
				inst.trigger.addClass(this._triggerClass).attr("tabIndex", -1).
					attr({ src: buttonImage, alt: buttonText, title: buttonText });
                
				input.parent().after(inst.trigger.parent());	//move the td
				
                inst.trigger.click(function () {
					  if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
                        $.datepicker._hideDatepicker();
                    else
                        $.datepicker._showDatepicker(input[0]);
                    return false;
                });
            }
        },

        /* Apply the maximum length for the date format. */
       _autoSize: function(inst) {
		if (this._get(inst, 'autoSize') && !inst.inline) {
			var date = new Date(2009, 12 - 1, 20); // Ensure double digits
			var dateFormat = this._get(inst, 'dateFormat');
			if (dateFormat.match(/ddd|MMM/)) {
				var findMax = function(names) {
					var max = 0;
					var maxI = 0;
					for (var i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};


                var months = this._get(inst, 'months'),
                    days = this._get(inst, 'days');
                date.setMonth(findMax(months[dateFormat.match(/MMMM/) ? "names" : "namesAbbr"]));
                date.setDate(findMax(days[dateFormat.match(/dddd/) ? "names" : "namesAbbr"]) + 20 - date.getDay());
			}
			inst.input.attr('size', this._formatDate(inst, date).length);

		}
	},
      
	   /* Attach an inline date picker to a div. Might be needed for standalone calendar. */
	   _inlineDatepicker: function (target, inst) {
			var divSpan = $(target);
			if (divSpan.hasClass(this.markerClassName))
				return;
			divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function (event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function (event, key) {
				return this._get(inst, key);
			});
			$.data(target, PROP_NAME, inst);
			this._setDate(inst, this._getDefaultDate(inst), true);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		},

        /* Is the first field in a jQuery collection disabled as a datepicker?
        @param  target    element - the target input field or division or span
        @return boolean - true if disabled, false if enabled */
        _isDisabledDatepicker: function (target) {
            if (!target) {
                return false;

            }
            for (var i = 0; i < this._disabledInputs.length; i++) {
                if (this._disabledInputs[i] == target)
                    return true;

            }
            return false;
        },

        /* Retrieve the instance data for the target control.
        @param  target  element - the target input field or division or span
        @return  object - the associated instance data
        @throws  error if a jQuery problem getting data */
        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);

            }
            catch (err) {
                throw 'Missing instance data for this datepicker';

            }
        },

        /* Redraw the date picker attached to an input field or division.
        @param  target  element - the target input field or division or span */
        _refreshDatepicker: function (target) {
            var inst = this._getInst(target);
            if (inst) {
                this._updateDatepicker(inst);
			}
        },

        /* Set the dates for a jQuery selection.
        @param  target   element - the target input field or division or span
        @param  date     Date - the new date */
        _setDateDatepicker: function (target, date) {
            var inst = this._getInst(target);
            if (inst) {
                this._setDate(inst, date);
                this._updateDatepicker(inst);
                this._updateAlternate(inst);
            }
        },

        /* Get the date(s) for the first entry in a jQuery selection.
        @param  target     element - the target input field or division or span
        @param  noDefault  boolean - true if no default date is to be used
        @return Date - the current date */
        _getDateDatepicker: function (target, noDefault) {
            var inst = this._getInst(target);
            if (inst && !inst.inline)
                this._setDateFromField(inst, noDefault);
            return (inst ? this._getDate(inst) : null);
        },

        /* Handle keystrokes. */
        _doKeyDown: function (event) {
			var inst = $.datepicker._getInst(event.target);
            var handled = true;
            var isRTL = inst.dpDiv.is('.inforDatePicker-rtl');
            inst._keyEvent = true;
            if ($.datepicker._datepickerShowing)
                switch (event.keyCode) {

                case 9: 
					$.datepicker._hideDatepicker();
                    handled = false;
                    break; // hide on tab out
                case 13: 
					if (inst.input.closest("div").parent().hasClass("slick-headerrow-column"))	//let enter run the filter in the grid
						return;
						
					var sel = $('td.' + $.datepicker._dayOverClass , inst.dpDiv);

                    if (sel[0])
                        $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                    else
                        $.datepicker._hideDatepicker();
                    return false; // don't submit the form
                    break; // select the value on enter
                case 27: 
					$.datepicker._hideDatepicker();
                    break; // hide on escape
                case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
                    break; // previous month/year on page up/+ ctrl
                case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
                    break; // next month/year on page down/+ ctrl
                case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
                    handled = event.ctrlKey || event.metaKey;
                    break; // clear on ctrl or command +end
                case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
                    handled = event.ctrlKey || event.metaKey;
                    break; // current on ctrl or command +home
                case 37: 
					$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
                    break; // -1 day on left
                case 38: 
					$.datepicker._adjustDate(event.target, -7, 'D');

                    break; // -1 week on up
                case 39: 
					$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
                    break; // +1 day on right
               case 40: 
					$.datepicker._adjustDate(event.target, +7, 'D');
                    handled = event.ctrlKey || event.metaKey;
                    break; // +1 week on down
                default: handled = false;

            }
            else if (event.keyCode == 13 ) // display the date picker on enter
            {
				if (inst.input.closest("div").parent().hasClass("slick-headerrow-column"))	//let enter run the filter in the grid
						return;
					
				if (inst.settings.openOnEnter)
					$.datepicker._showDatepicker(this);
				else
					handled = false;
            }
			else {
                handled = false;
            }
            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
		_quickDates: function(target, button){
			//open a menu on the menu button with some options for date input
			var menu = $("#inforQuickDatesMenu"),
				$button = $(button),
				target = $(target),
                inst = this._getInst(target[0]),
				options = this._get(inst, "quickDateOptions")
			
			//Add item if not there
			if (menu.length==0) {
				$('<ul id="inforQuickDatesMenu" class="inforContextMenu"></ul>').appendTo("body");
				menu = $("#inforQuickDatesMenu");
			}
			
			//Clear the menu
			menu.empty();
						
			//loop the configurable options and add them
			$.map( options, function(opt) {
				//add the option and maybe a generic click handler function...
				var li = $("<li></li>"),
					a = $("<a></a>").attr("href","#").text(opt.label).attr("onclick",
						'DP_jQuery_' + dpuuid + '.datepicker._quickDateSelect(\'#' +inst.id + '\',' + opt.offset + ',\'' + opt.period + '\')');
				
				li.append(a);
				menu.append(li);
			});
			
			//show the menu...
			$button.inforContextMenu({
					menu: 'inforQuickDatesMenu',
					invokeMethod: 'immediate',
					position: {
						my: (Globalize.culture().isRTL ? "right top" : "left top"),
						at: (Globalize.culture().isRTL ? "right bottom" : "left bottom"),
						of: $button,
						offset: (Globalize.culture().isRTL ? "0 -2" : "0 -2")
					}
			});
		},
		_quickDateSelect: function(id, offset, period) {
			var target = $(id);
				inst = this._getInst(target[0]);
           
		    if (period=="T") {
				this._selectToday(target);
				return;
			}
			this._adjustDate(id, offset, period);
			this._selectDate(id, this._formatDate(inst, inst.selectedDay, inst.selectedMonth, inst.selectedYear, inst.selectedHours, inst.selectedMinutes,inst.selectedSeconds  ))
		},
		selectToday: function (target){
			this._selectToday(target);
		},
		_selectToday: function (target){
			var todayDate = new Date(),
			    target = $(target),
                inst = this._getInst(target[0]);
			
			if (this._get(inst, 'isHijri')) {
				todayDate = Globalize.culture().calendar.convert.fromGregorian(todayDate);
				inst.selectedDay = todayDate[2];
				inst.selectedMonth = todayDate[1];
				inst.selectedYear = todayDate[0];
				
				$.datepicker._selectDate(target, $.datepicker._formatDate(inst,
					todayDate[2], todayDate[1], todayDate[0]), inst.selectedHours, inst.selectedMinutes,inst.selectedSeconds); 
				return;
			}
			 
			//Notice that we added 1 to the month variable to correct the problem with January being 0 and December being 11. After adding 1, January will be 1, and December will be 12.
			inst.selectedDay = todayDate.getDate();
			inst.selectedMonth = todayDate.getMonth();
			inst.selectedYear = todayDate.getFullYear();
				
			$.datepicker._selectDate(target, $.datepicker._formatDate(inst,
					todayDate.getDate(), todayDate.getMonth(), todayDate.getFullYear(), inst.selectedHours, inst.selectedMinutes,inst.selectedSeconds)); 
					
		},
        /* Filter entered characters - based on date format. */
        _doKeyPress: function (event) {
            var inst = $.datepicker._getInst(event.target);
            if ($.datepicker._get(inst, 'constrainInput')) {
			
				var chars = $.datepicker._possibleChars(inst.settings.culture || $.datepicker._defaults.culture, $.datepicker._get(inst, 'dateFormat'));
				var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);

			//insert current date with a T
			if (chr.toLowerCase()=="t")
			{
				$.datepicker._selectToday(event.target);
			}
				
			return event.ctrlKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
        },

        /* Synchronise manual entry and field/alternate field. */
        _doKeyUp: function (event) {
            var inst = $.datepicker._getInst(event.target);

            if (inst.input.val() != inst.lastVal) {
                try {
               	var date = $.datepicker.parseDate(
                                (inst.input ? inst.input.val() : null),
                                $.datepicker._get(inst, 'dateFormat'),
                                inst.settings.culture)
			
				if (date) { // only if valid
                        $.datepicker._setDateFromField(inst);
                       //$.datepicker._updateAlternate(inst);
                        $.datepicker._updateDatepicker(inst);
                    }
                }
                catch (event) {
                    //$.datepicker.log(event);
                }
            }
            return true;
        },

        /* Pop-up the date picker for a given input field.
        @param  input  element - the input field attached to the date picker or
        event - if triggered by focus */
        _showDatepicker: function (input) {
			$(".inforMenu").hide();
            input = input.target || input;
            if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
                input = $('input', input.parentNode)[0];
            if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
                return;
            var inst = $.datepicker._getInst(input);

            if ($.datepicker._curInst && $.datepicker._curInst != inst) {
                $.datepicker._curInst.dpDiv.stop(true, true);
            }
            var beforeShow = $.datepicker._get(inst, 'beforeShow');
            extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
            inst.lastVal = null;
            $.datepicker._lastInput = input;
            $.datepicker._setDateFromField(inst);
            if ($.datepicker._inDialog) // hide cursor
                input.value = '';
            if (!$.datepicker._pos) { // position below input
                $.datepicker._pos = $.datepicker._findPos(input);
                $.datepicker._pos[1] += input.offsetHeight; // add the height
            }
            var isFixed = false;
            $(input).parents().each(function () {
                isFixed |= $(this).css('position') == 'fixed';
                return !isFixed;
            });
            if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
                $.datepicker._pos[0] -= document.documentElement.scrollLeft;
                $.datepicker._pos[1] -= document.documentElement.scrollTop;
            }
            var offset = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] };
            $.datepicker._pos = null;

            //to avoid flashes on Firefox
            inst.dpDiv.empty();
			inst.dpDiv.hide();
			
            // determine sizing offscreen
            inst.dpDiv.css({ position: 'absolute', display: 'block', top: '-1000px' });
			//fire before show.
			var beforeShow = $.datepicker._get(inst, 'beforeShow');
            extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
			
            $.datepicker._updateDatepicker(inst);
            // fix width for dynamic number of date pickers
            // and adjust position before showing
            offset = $.datepicker._checkOffset(inst, offset, isFixed);
            inst.dpDiv.css({ position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
                left: offset.left + 'px', top: offset.top + 'px'

            });
            if (!inst.inline) {
                var showAnim = $.datepicker._get(inst, 'showAnim');
                var duration = $.datepicker._get(inst, 'duration');
                var postProcess = function () {
                    var cover = inst.dpDiv.find('iframe.inforDatePicker-cover'); // IE6- only
                    if (!!cover.length) {
                        var borders = $.datepicker._getBorders(inst.dpDiv);

                        cover.css({ left: -borders[0], top: -borders[1],
                            width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()
                        });
                    }
                };
                inst.dpDiv.zIndex($(input).zIndex() + 1000);

                $.datepicker._datepickerShowing = true;
                if ($.effects && $.effects[showAnim])
                    inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
                else
                    inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
                if (!showAnim || !duration)
                    postProcess();
                if (inst.input.is(':visible') && !inst.input.is(':disabled'))
                    inst.input.focus();
                $.datepicker._curInst = inst;
            }

        },
		_updateYearPanel: function (table,inst, centerYear){
			//Add the formatted years in - 5 up and down from the current selected year
			var todayDate = new Date();
			var todayYear = (todayDate).getFullYear();
			//corrects draw year for Hijri (Arabic) calendar
			todayYear = parseInt(Globalize.format(todayDate,'yyyy'), 10);
			
			var selectedYear = inst.selectedYear;
			//corrects year for Hijri (Arabic) calendar
			selectedYear = parseInt(Globalize.format(new Date(inst.selectedYear,inst.selectedMonth ,inst.selectedDay),'yyyy'), 10);
			
			//the click callback
			function selectYear() {
				table.find(".datePickerYear-selected").removeClass("datePickerYear-selected");
				$(this).addClass("datePickerYear-selected");
			}
			
			table.find(".datePickerYear-selected").removeClass("datePickerYear-selected");
			table.find(".datePickerMonthYearYear-current").removeClass("datePickerMonthYearYear-current");
			
			i=5;
			var j=0;
			table.find(".datePickerMonthYearGrid tr").not(":first").each( function() {
				var col1 = $(this).find("td:eq(2) div");
				col1.html(centerYear-i).click(selectYear);  
				
				//highlight selected month and year and today month and year.
				if ((centerYear-i)==todayYear)
					col1.addClass("datePickerMonthYearYear-current");
				
				if ((centerYear-i)==selectedYear)
					col1.addClass("datePickerYear-selected");
					
				var col2= $(this).find("td:eq(3) div")
				col2.html(centerYear+j).click(selectYear);  
				if ((centerYear+j)==todayYear)
					col2.addClass("datePickerMonthYearYear-current");
					
				if ((centerYear+j)==selectedYear)
					col2.addClass("datePickerYear-selected");
				
				i--;
				j++;
			});
		},
		_showDateMonthPanel: function (inst) {
			var self = this;
            inst.dpDiv.empty();
			inst.dpDiv.hide();
			//find the years and months and build the html
			var monthNamesShort  = this._get(inst, 'months').namesAbbr;
			var okText  = this._get(inst, 'Ok');
			var nextText  = this._get(inst, 'Next');
			var prevText  = this._get(inst, 'Previous');
			var cancelText  = this._get(inst, 'Cancel');
			
			var table = $('<table cellspacing="0" cellpadding="0" class="inforDatePickerPanel"><tbody><tr><td align="left" style="vertical-align: top;"><table cellspacing="0" cellpadding="0" class="datePickerMonthYearPanel"><tbody><tr><td align="left" style="vertical-align: top;"><table class="datePickerMonthYearGrid"><colgroup><col><col class="datePickerMonthYearGridDivider"></colgroup><tbody><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">Jan</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Jul</div></td><td class="datePickerPreviousYearCell"><button type="button" tabindex="0" class="datePickerPreviousYear" title="'+prevText+'"></button></td><td class="datePickerNextYearCell"><button type="button" tabindex="0" class="datePickerNextYear" title="'+nextText+'"></button></td></tr><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">Feb</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Aug</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearFirstCol">2007</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearSecondCol">2012</div></td></tr><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">Mar</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Sep</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearFirstCol">2008</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearSecondCol">2013</div></td></tr><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">Apr</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Oct</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearFirstCol">2009</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearSecondCol">2014</div></td></tr><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">May</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Nov</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearFirstCol">2010</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearSecondCol">2015</div></td></tr><tr><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthFirstCol">Jun</div></td><td><div class="datePickerMonthYearMonth datePickerMonthYearMonthSecondCol">Dec</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearFirstCol">2011</div></td><td><div class="datePickerMonthYearYear datePickerMonthYearYearSecondCol">2016</div></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="left" style="vertical-align: top;"><div class="inforDatePickerButtonPanel inforDatePickerMonthYearButtonPanel"><button type="button" tabindex="0" class="inforFormButton" style="display: inline-block;">'+okText+'</button><button type="button" tabindex="0" class="inforFormButton" style="display: inline-block;">'+cancelText+'</button></div></td></tr></tbody></table>');
			
			var todayDate = new Date();
			var todayYear = (todayDate).getFullYear();
			var currentYear = (inst.currentYear); 
			//corrects draw year for Hijri (Arabic) calendar
			if (this._get(inst, 'isHijri')) {
				todayDate = Globalize.culture().calendar.convert.fromGregorian(todayDate);
				todayYear = todayDate[0];
			}
			
			if (currentYear==0)
				currentYear = todayYear;
			else
				currentYear = parseInt(Globalize.format(new Date(inst.currentYear, inst.currentMonth, inst.currentDay),'yyyy'), 10);
			
			if (inst.settings.defaultDate) {	//center on default date if provided.
				currentYear = inst.settings.defaultDate.getFullYear();
			}
			
			self._updateYearPanel(table,inst,currentYear);
			
			//Add the formatted months in.
			var todayMonth = (new Date()).getMonth();
			if (this._get(inst, 'isHijri')) 
				todayMonth = todayDate[1];
				
			var selectedMonth = inst.selectedMonth;
			
			var i=0;
			function selectMonth(){
				table.find(".datePickerMonth-selected").removeClass("datePickerMonth-selected");
				$(this).addClass("datePickerMonth-selected");
			}
			
			table.find(".datePickerMonthYearGrid tr").each( function() {
				var col1 = $(this).find("td:eq(0) div");
				col1.data("month",i).html(monthNamesShort[i]).click(selectMonth);    
				
				if (i==todayMonth)
					col1.addClass("datePickerMonthYearMonth-current");	
				
				if (i==selectedMonth)
					col1.addClass("datePickerMonth-selected");	
					
				var col2 = $(this).find("td:eq(1) div");
				col2.data("month",i+6).html(monthNamesShort[i+6]).click(selectMonth);   
				
				if (i+6==todayMonth)
					col2.addClass("datePickerMonthYearMonth-current");	
				
				if (i+6==selectedMonth)
					col2.addClass("datePickerMonth-selected");	
				
				i++;
			});
			
			//set up the buttons...
			table.find(".inforFormButton:eq(0)").inforFormButton().click(function() {
					//update selected month and year..and return
					var month = table.find(".datePickerMonth-selected").data("month");
					var year = table.find(".datePickerYear-selected").html();
					self._selectMonthYear(inst,month,year);
					self._updateDatepicker(inst);
			});
			table.find(".inforFormButton:eq(1)").inforFormButton().click(function() {
					self._updateDatepicker(inst);
			});
			table.find(".datePickerPreviousYear").click(function() {
				currentYear=currentYear-1;
				self._updateYearPanel(table,inst,currentYear);
			});
			table.find(".datePickerNextYear").click(function() {
				currentYear=currentYear+1;
				self._updateYearPanel(table,inst,currentYear);
			});
			
			//add and animate..
			inst.dpDiv.append(table);
			inst.dpDiv.show();
		},
		_selectMonthYear: function (inst, month, year) {
			
			inst._selectingMonthYear = false;
			if (month!=undefined) {
				inst['selectedMonth' ] =
				inst['drawMonth'] = month;
            }
			
			if (year!=undefined) {
				inst['selectedYear' ] =
				inst['drawYear'] = parseInt(year, 10);
            }
			
			this._notifyChange(inst);
            this._adjustDate($("#"+inst.id));
        },
        /* Generate the date picker content. */
        _updateDatepicker: function (inst) {
            var self = this;
            var borders = $.datepicker._getBorders(inst.dpDiv);

            instActive = inst; // for delegate hover events
            inst.dpDiv.empty().append(this._generateHTML(inst));

			inst.dpDiv.find(".inforDatePickerPanelArrow").click(function() 
			{
				self._showDateMonthPanel(inst);	
			});
			
            var cover = inst.dpDiv.find('iframe.inforDatePicker-cover'); // IE6- only
            if (!!cover.length) { //avoid call to outerXXXX() when not in IE6
                cover.css({ left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight() })
            }

            inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();

            var numMonths = this._getNumberOfMonths(inst);
            var cols = numMonths[1];
            var width = 17;

            inst.dpDiv.removeClass('inforDatePicker-multi-2 inforDatePicker-multi-3 inforDatePicker-multi-4').width('');
            if (cols > 1)
                inst.dpDiv.addClass('inforDatePicker-multi-' + cols).css('width', (width * cols) + 'em');

            inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('inforDatePicker-multi');
            inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('inforDatePicker-rtl');
            if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&


            // #6694 - don't focus the input if it's already focused
            // this breaks the change event in IE
			inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
            inst.input.focus();
			
			//prevent text drop
			inst.input.attr("ondrop","return false");

			if (this._get(inst, 'showTimeInput')) {
				var self = this;
				//attach validation on the date field and an event to update internal values for select
				$("#inforTimeInput").bind("change", function() {
					var format = self._get(inst, 'timeFormat');
						date = Globalize.parseDate($(this).val(), format);
					
					inst.drawHours = inst.selectedHours = parseInt((Globalize.format(date, "HH")==null ? 0 :Globalize.format(date, "HH")) , 10);
					inst.drawMinutes = inst.selectedMinutes = parseInt((Globalize.format(date, "mm")==null ? 0 :Globalize.format(date, "mm")), 10);
					inst.drawSeconds = inst.selectedSeconds = parseInt((Globalize.format(date, "ss")==null ? 0 :Globalize.format(date, "ss")), 10);
				}).bind("keypress", function(event) {
						if (event.keyCode==13) {
							$(this).trigger("change");
							$.datepicker._selectDate("#"+inst.id,$.datepicker._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear, inst.selectedHours, inst.selectedMinutes,inst.selectedSeconds) );
							return;
						}
						if ($.datepicker._get(inst, 'constrainInput')) {
							var chars = $.datepicker._possibleChars(inst.settings.culture || $.datepicker._defaults.culture, $.datepicker._get(inst, 'dateFormat'));
							var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
						
							return event.ctrlKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
						}
				});
			}
			
            // deffered render of the years select (to avoid flashes on Firefox) 
            if (inst.yearshtml) {
                var origyearshtml = inst.yearshtml;
                setTimeout(function () {
                    //assure that inst.yearshtml didn't change.
                    if (origyearshtml === inst.yearshtml && inst.yearshtml) {
                        inst.dpDiv.find('select.inforDatePicker-inforDatePicker-year:first').replaceWith(inst.yearshtml);
                    }
                    origyearshtml = inst.yearshtml = null;
                }, 0);
            }
        },
		
		/* Retrieve the size of left and top borders for an element.
        @param  elem  (jQuery object) the element of interest
        @return  (number[2]) the left and top borders */
        _getBorders: function (elem) {
            var convert = function (value) {
                return { thin: 1, medium: 2, thick: 3}[value] || value;
            };
            return [parseFloat(convert(elem.css('border-left-width'))),
			parseFloat(convert(elem.css('border-top-width')))];
        },

        /* Check positioning to remain on screen. */
        _checkOffset: function (inst, offset, isFixed) {
            var dpWidth = inst.dpDiv.outerWidth();
            var dpHeight = inst.dpDiv.outerHeight();
            var inputWidth = inst.input ? inst.input.outerWidth() : 0;
            var inputHeight = inst.input ? inst.input.outerHeight() : 0;
            var viewWidth = document.documentElement.clientWidth + $(document).scrollLeft();
            var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();

            offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
            offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
            offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

            // now check if datepicker is showing outside window viewport - move to a better place if so.
            offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

            return offset;
        },

        /* Find an object's position on the screen. */
        _findPos: function (obj) {
            var inst = this._getInst(obj);
            var isRTL = this._get(inst, 'isRTL');
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];

            }
            var position = $(obj).offset();
            return [position.left, position.top];
        },

        /* Hide the date picker from view.
        @param  input  element - the input field attached to the date picker */
        _hideDatepicker: function (input) {
            var inst = this._curInst;
            if (!inst || (input && inst != $.data(input, PROP_NAME)))
                return;
            if (this._datepickerShowing) {
                var showAnim = this._get(inst, 'showAnim');
                var duration = this._get(inst, 'duration');
                var postProcess = function () {
                    $.datepicker._tidyDialog(inst);
                    this._curInst = null;
                };
                if ($.effects && $.effects[showAnim])
                    inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
                else
                    inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
                if (!showAnim)
                    postProcess();
                var onClose = this._get(inst, 'onClose');
                if (onClose)
                    onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);  // trigger custom callback
                this._datepickerShowing = false;
                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
                    if ($.blockUI) {
                        $.unblockUI();
                        $('body').append(this.dpDiv);
					}
                }
                this._inDialog = false;

            }
        },

        /* Tidy up after a dialog display. */
        _tidyDialog: function (inst) {
            inst.dpDiv.removeClass(this._dialogClass).unbind('.inforDatePicker-calendar');
        },

        /* Close date picker if clicked elsewhere. */
        _checkExternalClick: function (event) {
            if (!$.datepicker._curInst)
                return;
            var $target = $(event.target);
            if ($target[0].id != $.datepicker._mainDivId &&
				$target.parents('#' + $.datepicker._mainDivId).length == 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.hasClass($.datepicker._triggerClass) &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))
                $.datepicker._hideDatepicker();
        },

        /* Adjust one of the date sub-fields. */
        _adjustDate: function (id, offset, period) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (this._isDisabledDatepicker(target[0])) {
                return;

            }
            this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
            this._updateDatepicker(inst);

        },

        /* Action for current link. */
        _gotoToday: function (id) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
                inst.selectedDay = inst.currentDay;
                inst.drawMonth = inst.selectedMonth = inst.currentMonth;
                inst.drawYear = inst.selectedYear = inst.currentYear;
            }
            else {
                var date = new Date();
                inst.selectedDay = date.getDate();
                inst.drawMonth = inst.selectedMonth = date.getMonth();
                inst.drawYear = inst.selectedYear = date.getFullYear();
            }
            this._notifyChange(inst);
            this._adjustDate(target);
        },

        /* Restore input focus after not changing month/year. */
        _clickMonthYear: function (id) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (inst.input && inst._selectingMonthYear) {
                setTimeout(function () {
                    inst.input.focus();
                }, 0);
            }
            inst._selectingMonthYear = !inst._selectingMonthYear;
        },

        /* Action for selecting a day. */
        _selectDay: function (id, month, year, td) {
            var target = $(id);
		    if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
                return;
            }
            var inst = this._getInst(target[0]);
            inst.selectedDay = inst.currentDay = $('a', td).html();
            inst.selectedMonth = inst.currentMonth = month;
            inst.selectedYear = inst.currentYear = year;
            this._selectDate(id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear, inst.selectedHours, inst.selectedMinutes,inst.selectedSeconds));
        },

        /* Erase the input field and hide the date picker. */
        _clearDate: function (id) {
            var target = $(id);
            this._selectDate(target, '');
        },

        /* Update the input field with the selected date. */
        _selectDate: function (id, dateStr) {
            var target = $(id);
            var inst = this._getInst(target[0]);
            dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
            if (inst.input)
                inst.input.val(dateStr);
            
			this._updateAlternate(inst);
			
            var onSelect = this._get(inst, 'onSelect');
            if (onSelect)
                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
            else if (inst.input)
                inst.input.trigger('change'); // fire the change event
            
			if (inst.inline)
                this._updateDatepicker(inst);
            else {
                this._hideDatepicker();
                this._lastInput = inst.input[0];
                inst.input.focus().select(); // restore focus
                this._lastInput = null;
            }
        },

        /* Update any alternate field to synchronise with the main field. */
        _updateAlternate: function (inst) {
           var altField = this._get(inst, 'altField');
            if (altField) { // update alternate field too
                var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
				var date = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
                var dateStr = this.formatDate(date, altFormat, inst.settings.culture);
				$(altField).each(function () { $(this).val(dateStr); });
			}
			var altField2 = this._get(inst, 'altField2');
            if (altField2) { // update alternate field too
               var altFormat2 = this._get(inst, 'altFormat2') || this._get(inst, 'dateFormat');
               var date = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
                var dateStr = this.formatDate(date, altFormat2, inst.settings.culture);
				$(altField2).each(function () {  $(this).val(dateStr); });
            }
        },

        /* Set as beforeShowDay function to prevent selection of weekends.
        @param  date  Date - the date to customise
        @return [boolean, string] - is this date selectable?, what is its CSS class? */
        noWeekends: function (date) {
            var day = date.getDay();
            return [(day > 0 && day < 6), ''];
        },

        /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
        @param  date  Date - the date to get the week for
        @return  number - the number of the week within the year that contains this date */
        iso8601Week: function (date) {
            var checkDate = new Date(date.getTime());
            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
            var time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },

        /* Parse a string value into a date object.
        See formatDate below for the possible formats.

        @param  format    string - the expected format of the date
        @param  value     string - the date in the above format


        @param  settings  Object - attributes include:
        shortYearCutoff  number - the cutoff year for determining the century (optional)
        dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
        dayNames         string[7] - names of the days from Sunday (optional)
        monthNamesShort  string[12] - abbreviated names of the months (optional)
        monthNames       string[12] - names of the months (optional)
        @return  Date - the extracted date value or null if value is blank */
        parseDate: function (value, format, culture) {
			return Globalize.parseDate(value, format, culture || this._defaults.culture);
       },

        /* Standard date formats. */
        ATOM: 'yyyy-mm-dd', // RFC 3339 (ISO 8601)
		COOKIE: 'ddd, dd mmm yyyy',
		ISO_8601: 'yyyy-mm-dd',
		RFC_822: 'ddd, d mmm yy',
		RFC_850: 'dddd, dd-mmm-yy',
		RFC_1036: 'ddd, d mmm yy',
		RFC_1123: 'ddd, d mmm yyyy',
		RFC_2822: 'ddd, d mmm yyyy',
		RSS: 'ddd, d mmm yy', // RFC 822
		TICKS: '!',
		TIMESTAMP: '@',
		W3C: 'yyyy-mm-dd', // ISO 8601

        _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/*
   @param  value     string - the date to format
   @param  formats   string - the format of the date
   @param  culture   string - the culture to format the date as, omit to use the datepicker default culture.
   @return  string - the date in the above format */
	formatDate: function(date, format, culture) {
		return Globalize.format(date, format, culture || this._defaults.culture);
	},
    /* Extract all possible characters from the date format. */
	_possibleChars: function(culture, format) {
		var chars = '';
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function (match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
				case 'd': case 'm': case 'y': case '@':
					chars += '0123456789';
					break;
				case 'D': case 'M':
					chars += '0123456789';
					break;
				case ':':
					chars += ':';
					break;
				case 't':
					if (lookAhead("t"))
						chars += "PMA";
					break;
				case '/':
					chars += Globalize.culture().calendar["/"];
					break;
				case "'":
					if (lookAhead("'"))
						chars += "'";
					else
						literal = true;
					break;
				default:
					chars += format.charAt(iFormat);
			}
		return chars;
    },
    
	/* Get a setting value, defaulting if necessary. */
    _get: function(inst, name) {
			// try instance settings
			var val = inst.settings[name];
			if (typeof val === "undefined") {
				// then try global defaults
				val = this._defaults[name];
				if (typeof val === "undefined") {
					var cultureName = inst.settings.culture || this._defaults.culture,
						culture = Globalize.findClosestCulture(cultureName);
					// try a culture value or a culture calendar value
					// e.g. 'isRTL' (culture.isRTL) or 'days' (culture.calendar.days)
					val = culture[name];
					if (typeof val === "undefined") {
						val = culture.calendar[name];
						if (typeof val === "undefined") {
							// then try datepicker specific data for the culture
						   val =  Globalize.localize(name, cultureName || this._defaults.culture);
						}
					}
				}
			}
			return val;
		},

		/* Parse existing date and initialise date picker. */
		_setDateFromField: function (inst, noDefault) {
			if (inst.input.val() == inst.lastVal) {
				return;
			}
			var dateFormat = this._get(inst, 'dateFormat');
			var dates = inst.lastVal = inst.input ? inst.input.val() : null;
			var date, defaultDate;
			date = defaultDate = this._getDefaultDate(inst);

			try {
				date = this.parseDate(dates, dateFormat, inst.settings.culture) || defaultDate;
			} catch (event) {
				dates = (noDefault ? '' : dates);
			}
			//parse the date using format for isHijri
			inst.selectedDay = parseInt(Globalize.format(date, "dd"), 10);	//date.getDate();
			inst.drawMonth = inst.selectedMonth = parseInt(Globalize.format(date, "MM")-1, 10);
			inst.drawYear = inst.selectedYear = parseInt(Globalize.format(date, "yyyy"), 10);
			
			inst.drawHours = inst.selectedHours = parseInt(Globalize.format(date, "HH"), 10);
			inst.drawMinutes = inst.selectedMinutes = parseInt(Globalize.format(date, "mm"), 10);
			inst.drawSeconds = inst.selectedSeconds = parseInt(Globalize.format(date, "ss"), 10);
			
			inst.currentDay = (dates ? parseInt(Globalize.format(date, "dd"), 10) : 0);
			inst.currentMonth = (dates ? parseInt(Globalize.format(date, "MM")-1, 10) : 0);
			inst.currentYear = (dates ? parseInt(Globalize.format(date, "yyyy"), 10) : 0);
			this._adjustInstDate(inst);
		},

        /* Retrieve the default date shown on opening. */
        _getDefaultDate: function (inst) {
			return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
        },

        /* A date may be specified as an exact value or a relative one. */
       	_determineDate: function(inst, date, defaultDate) {
			var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			};
			var offsetString = function(offset) {
				try {
					return $.datepicker.parseDate(offset, $.datepicker._get(inst, 'dateFormat'),
						inst.settings.culture);
				}
				catch (e) {
					// Ignore
				}
				var date = (offset.toLowerCase().match(/^c/) ?
					$.datepicker._getDate(inst) : null) || new Date();
				var year = date.getFullYear();
				var month = date.getMonth();
				var day = date.getDate();
				var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
				var matches = pattern.exec(offset);
				while (matches) {
					switch (matches[2] || 'd') {
						case 'd' : case 'D' :
							day += parseInt(matches[1], 10); break;
						case 'w' : case 'W' :
							day += parseInt(matches[1], 10) * 7; break;
						case 'm' : case 'M' :
							month += parseInt(matches[1], 10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case 'y': case 'Y' :
							year += parseInt(matches[1], 10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;

					}
					matches = pattern.exec(offset);

				}
				return new Date(year, month, day);
			};
			date = (date == null ? defaultDate : (typeof date == 'string' ? offsetString(date) :
				(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : date)));
			date = (date && date.toString() == 'Invalid Date' ? defaultDate : date);
			
			if (this._get(inst, 'showTimeInput')) {
				return date;
			}
			
			if (date) {
					date.setHours(0);
					date.setMinutes(0);
					date.setSeconds(0);
					date.setMilliseconds(0);
			}
			return this._daylightSavingAdjust(date);
	},

        /* Handle switch to/from daylight saving.
        Hours may be non-zero on daylight saving cut-over:
        > 12 when midnight changeover, but then cannot generate
        midnight datetime, so jump to 1AM, otherwise reset.
        @param  date  (Date) the date to check
        @return  (Date) the corrected date */
        _daylightSavingAdjust: function (date) {
            if (!date) return null;
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },

        /* Set the date(s) directly. */
        _setDate: function(inst, date, noChange) {
			var clear = !(date);
			var origMonth = inst.selectedMonth;
			var origYear = inst.selectedYear;
			date = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
			inst.selectedDay = inst.currentDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = inst.currentMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = inst.currentYear = date.getFullYear();
			if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
				this._notifyChange(inst);
			this._adjustInstDate(inst);
			if (inst.input) {
				inst.input.val(clear ? '' : this._formatDate(inst));
			}
		},

        /* Retrieve the date(s) directly. */
        _getDate: function(inst) {
			var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
				this._daylightSavingAdjust(new Date(
				inst.currentYear, inst.currentMonth, inst.currentDay)));
				return startDate;
		},

        /* Generate the HTML for the current state of the date picker. */
        _generateHTML: function (inst) {
            var today = new Date();
			today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
            
			if (this._get(inst, 'isHijri')) 
				today = Globalize.culture().calendar.convert.fromGregorian(today);

			var isRTL = this._get(inst, 'isRTL');
            var showButtonPanel = this._get(inst, 'showButtonPanel');
            var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
            var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
            var numMonths = this._getNumberOfMonths(inst);
            var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
            var stepMonths = this._get(inst, 'stepMonths');
            var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
			
            var minDate = this._getMinMaxDate(inst, 'min');
            var maxDate = this._getMinMaxDate(inst, 'max');
			
            var drawMonth = inst.drawMonth - showCurrentAtPos;
            var drawYear = inst.drawYear;
            if (drawMonth < 0) {
                drawMonth += 12;
                drawYear--;
            }
            if (maxDate) {
                var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
                maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
                while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                    drawMonth--;
                    if (drawMonth < 0) {
                        drawMonth = 11;
                        drawYear--;
					}
                }
            }
			inst.drawMonth = drawMonth;
			//localize draw year...
            inst.drawYear = drawYear;
			
            var prevText = this._get(inst, 'Previous');
            prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
            var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a class="inforDatePicker-prev inforDatePicker-corner-all" onclick="DP_jQuery_' + dpuuid +
			'.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' +
			' title="' + prevText + '"><span class="' + (isRTL ? 'inforNextMonthButton' : 'inforPrevMonthButton') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="inforDatePicker-prev inforDatePicker-corner-all inforDatePicker-state-disabled" title="' + prevText + '"><span class="' + (isRTL ? 'inforNextMonthButton' : 'inforPrevMonthButton') + '">' + prevText + '</span></a>'));
            var nextText = this._get(inst, 'Next');
            nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));
            var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a class="inforDatePicker-next inforDatePicker-corner-all" onclick="DP_jQuery_' + dpuuid +
			'.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' +
			' title="' + nextText + '"><span class="' + (isRTL ? 'inforPrevMonthButton' : 'inforNextMonthButton') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="inforDatePicker-next inforDatePicker-corner-all inforDatePicker-state-disabled" title="' + nextText + '"><span class="' + (isRTL ? 'inforPrevMonthButton' : 'inforNextMonthButton') + '">' + nextText + '</span></a>'));
            var currentText = this._get(inst, 'Today');
            var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
            currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
            var controls = (!inst.inline ? '<button type="button" class="inforDatePicker-close inforDatePicker-state-default inforDatePicker-priority-primary inforDatePicker-corner-all" onclick="DP_jQuery_' + dpuuid +
			'.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>' : '');
            var buttonPanel = (showButtonPanel) ? '<div class="inforDatePicker-buttonpane inforDatePicker-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="inforDatePicker-current inforDatePicker-state-default inforDatePicker-priority-secondary inforDatePicker-corner-all" onclick="DP_jQuery_' + dpuuid +
			'.datepicker._gotoToday(\'#' + inst.id + '\');"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
            var firstDay = parseInt(this._get(inst, 'firstDay'), 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);
            var showWeek = this._get(inst, 'showWeek');
            var dayNames = this._get(inst, 'days').names;
            var dayNamesMin = this._get(inst, 'days').namesShort;
			
            var monthNames = this._get(inst, 'months').names;
			var monthNamesShort = this._get(inst, 'months').namesAbbr;
            
			var beforeShowDay = this._get(inst, 'beforeShowDay');
            var showOtherMonths = this._get(inst, 'showOtherMonths');
            var selectOtherMonths = this._get(inst, 'selectOtherMonths');
            var defaultDate = this._getDefaultDate(inst);
            var html = '';
			var showTime = this._get(inst, 'showTimeInput');
			
            for (var row = 0; row < numMonths[0]; row++) {
                var group = '';
                for (var col = 0; col < numMonths[1]; col++) {
                    var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
					if (showTime) {
						selectedDate = new Date(drawYear, drawMonth, inst.selectedDay, inst.selectedHours, inst.selectedMinutes, inst.selectedSeconds);
					}
                    var cornerClass = ' inforDatePicker-corner-all';
                    var calender = '';
					calender += '<div class="inforDatePicker-header inforDatePicker-helper-clearfix' + cornerClass + '">' +
					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="inforDatePicker-calendar"><thead class="inforDatePickerDaysOfWeek">' +
					'<tr>';
                    var thead = (showWeek ? '<th class="inforDatePicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
                    for (var dow = 0; dow < 7; dow++) { // days of the week
                        var day = (dow + firstDay) % 7;
                        thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="inforDatePicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
					}
                    calender += thead + '</tr></thead><tbody>';
                    var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                    if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
                        inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                    var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                    var numRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                    var printDate = this._getCalDate(new Date(drawYear, drawMonth, 1 - leadDays),undefined, this._get(inst, 'isHijri'));	//this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
					
					for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        calender += '<tr>';
                        var tbody = (!showWeek ? '' : '<td class="inforDatePicker-week-col">' + this._get(inst, 'calculateWeek')(printDate) + '</td>');
                        for (var dow = 0; dow < 7; dow++) { // create date picker days
                            var daySettings = (beforeShowDay ? beforeShowDay.apply((inst.input ? inst.input[0] : null), [new Date(printDate[0], printDate[1],printDate[2])]) : [true, '']);
                            var otherMonth = (printDate[1] != drawMonth);
                            
							var checkDate = new Date(printDate[0],printDate[1],printDate[2]);
							var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && checkDate < minDate) || (maxDate && checkDate > maxDate);
							
                            tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' inforDatePicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' inforDatePicker-other-month' : '') + // highlight days from other months
							((printDate[3] == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate[3] && defaultDate.getTime() == selectedDate.getTime()) ?
                            // or defaultDate is current printedDate and defaultDate is selectedDate
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' inforDatePicker-state-disabled' : '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(this._equalDates(printDate,selectedDate) ? ' ' + this._currentClass : '') + // highlight selected day
							(this._equalDates(printDate,today) ? ' inforDatePicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' onclick="DP_jQuery_' + dpuuid + '.datepicker._selectDay(\'#' +
							inst.id + '\',' + printDate[1]+ ',' + printDate[0] + ', this);return false;"') + '>' + // actions
							(otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
							(unselectable ? '<span class="inforDatePicker-state-default">' + printDate[2] + '</span>' : 
                            '<a class="inforDatePicker-state-default'   + // highlight selected day 
							(otherMonth ? ' inforDatePicker-priority-secondary' : '') + // distinguish dates from other months
							'" id="' +
                            ((dow + firstDay + 6) % 7 >= 5 ? 'inforDatePicker-week-end' : 'inforDatePicker-week-day') +
                            '" href="#">' + printDate[2]  + '</a>')) + '</td>'; 
							
							 //need a hijri way to set the next date.. cannot use date format..
							 printDate = this._getCalDate(printDate,1,this._get(inst, 'isHijri'));
						}
                        calender += tbody + '</tr>';
					}
                    drawMonth++;
                    if (drawMonth > 11) {
                        drawMonth = 0;
                        drawYear++;
					}
                    calender += '</tbody></table>';
                }
                group += calender;
				
				//if today is restricted disable the button...
				var enableToday = (beforeShowDay ? beforeShowDay.apply((inst.input ? inst.input[0] : null), [today]) : [true, '']);
                           
                // add the today bar
                var todayBar = '';
					if (showTime) {
						var curTime = Globalize.format(selectedDate, this._get(inst, 'timeFormat'));
						todayBar += '<div style="padding:1px 0px;text-align:center;background-color:#e4e4e4"><label class="inforLabel" style="float:none;width:auto;">'+Globalize.localize('Time')+'</label><input id="inforTimeInput" class="inforTextbox" style="width:80px" value="'+curTime+'"/></div>';
					}
                    todayBar += '<div class="inforDatePickerButtonPanel">';
					if (this._get(inst, 'showQuickDates')) {
						todayBar += '<button id="quickDates" class="inforMenuButton" type="button"'
						todayBar += 'onclick="DP_jQuery_' + dpuuid + '.datepicker._quickDates(\'#' +inst.id + '\', this );")';
						todayBar += '><span class="leftSlice"></span><span class="centerSlice">Quick Dates</span><span class="rightSlice"></span></button>';
					
					} else {
						todayBar += '<button class="inforDatePickerTodayButton inforFormButton'+(!enableToday[0] ? ' disabled"': '"') +'type="button" tabindex="0" style="display: inline-block;"';
						if (enableToday[0])
							todayBar += 'onclick="DP_jQuery_' + dpuuid + '.datepicker._selectToday(\'#' +inst.id + '\');return false;")';
						todayBar += '><span class="leftSlice"></span><span class="centerSlice">'+currentText+'</span><span class="rightSlice"></span></button>'
					}
					
					todayBar += '</div>';   
					
							
                group += todayBar
                html += group;
			}

            html += buttonPanel + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !inst.inline ?
			'<iframe src="javascript:false;" class="inforDatePicker-cover" frameborder="0"></iframe>' : '');
            inst._keyEvent = false;
            return html;
        },
		/* Return of the mm/yy/dd is all the same..*/
       _equalDates: function(date1, date2) {
			var d1 = null, d2=null;
			
			if (date1 instanceof Date) 
				d1 = date1.getFullYear().toString() + date1.getMonth().toString() + date1.getDate().toString(); 
			else 
				d1 = date1[0].toString() + date1[1].toString() + date1[2].toString(); 
				
			if (date2 instanceof Date) 
				d2 = date2.getFullYear().toString() + date2.getMonth().toString() + date2.getDate().toString(); 
			else 
				d2 = date2[0].toString() + date2[1].toString() + date2[2].toString(); 
				
			return d1==d2;
		},
		/* Return the next day no matter what calendar (Hijri) */
        _getCalDate: function(startDate, adjust, isHijri) {
			if (!isHijri) {
				var newDate = null;
				if (startDate instanceof Date)
					newDate  = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+(adjust==undefined ? 0 : adjust)); 
				else
					newDate  = new Date(startDate[0], startDate[1], startDate[2]+(adjust==undefined ? 0 : adjust));
				
				newDate = this._daylightSavingAdjust(newDate);
				return [newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getTime()];
			}
			else {	//more complicated...
				//what is the gregorian date?
				var gregDate = null,
					cal = Globalize.culture().calendar;
			
				if (startDate instanceof Date)
					gregDate  = cal.convert.toGregorian(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+(adjust==undefined ? 0 : adjust));
				else
					gregDate  = cal.convert.toGregorian(startDate[0], startDate[1], startDate[2]+(adjust==undefined ? 0 : adjust));
					
				var hDate = cal.convert.fromGregorian(gregDate);
				return hDate;
			}
		},
        /* Generate the month and year header. */
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {
			var html = '<div class="inforDatePicker-title">';
            var monthHtml = '';
			
            // month selection
            monthHtml += '<span class="inforDatePicker-month">' + monthNames[drawMonth] + '</span>';

            html += monthHtml + '&#xa0;';
            html += '<span class="inforDatePicker-year">' + drawYear + '</span><div class="inforDatePickerPanelArrow"> </div>';
			html += '</div>'; 
            return html;
        },

        /* Adjust one of the date sub-fields. */
        _adjustInstDate: function (inst, offset, period) {
            var year = inst.drawYear + (period == 'Y' ? offset : 0);
			var month = inst.drawMonth + (period == 'M' ? offset : 0);
          
			var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
            var date = this._restrictMinMax(inst,
			this._daylightSavingAdjust(new Date(year, month, day)));
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            
			//corrects draw year for Hijri (Arabic) calendar
			inst.drawYear = parseInt(Globalize.format(date,'yyyy'), 10);
			
			if (period == 'M' || period == 'Y')
                this._notifyChange(inst);
        },

        /* Ensure a date is within any min/max bounds. */
        _restrictMinMax: function (inst, date) {
            var minDate = this._getMinMaxDate(inst, 'min');
            var maxDate = this._getMinMaxDate(inst, 'max');
            var newDate = (minDate && date < minDate ? minDate : date);
            newDate = (maxDate && newDate > maxDate ? maxDate : newDate);

            return newDate;
        },

        /* Notify change of month/year. */
        _notifyChange: function (inst) {
            var onChange = this._get(inst, 'onChangeMonthYear');
            if (onChange)
                onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
        },

        /* Determine the number of months to show. */
        _getNumberOfMonths: function (inst) {
            var numMonths = this._get(inst, 'numberOfMonths');
            return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
        },

        /* Determine the current maximum date - ensure no time components are set. */
        _getMinMaxDate: function (inst, minMax) {
            return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
        },
		/* Detach a datepicker from its control.
        @param  target    element - the target input field or division or span */
        _destroyDatepicker: function (target) {
            var $target = $(target);
            var inst = $.data(target, PROP_NAME);
            if (!$target.hasClass(this.markerClassName)) {
                return;
			}
            var nodeName = target.nodeName.toLowerCase();
            $.removeData(target, PROP_NAME);
            if (nodeName == 'input') {
                inst.append.remove();
                inst.trigger.remove();
                $target.removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress).
				unbind('keyup', this._doKeyUp);
            } else if (nodeName == 'div' || nodeName == 'span')
                $target.removeClass(this.markerClassName).empty();
        },
        /* Find the number of days in a given month. */
        _getDaysInMonth: function(year, month) {
			var daysinMonth = 32 - new Date(year, month, 32).getDate();
			return daysinMonth;
		},
		/* Find the day of the week of the first of a month. */
        _getFirstDayOfMonth: function (year, month) {
            return new Date(year, month, 1).getDay();
        },

        /* Determines if we should allow a "next/prev" month display change. */
        _canAdjustMonth: function (inst, offset, curYear, curMonth) {
            var numMonths = this._getNumberOfMonths(inst);
            var date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
            if (offset < 0)
                date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
            return this._isInRange(inst, date);
        },

        /* Is the given date in the accepted range? */
        _isInRange: function (inst, date) {
            var minDate = this._getMinMaxDate(inst, 'min');
            var maxDate = this._getMinMaxDate(inst, 'max');
            return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()));
        },
		
		/* Provide the configuration settings for formatting/parsing. */
		_getFormatConfig: function (inst) {
            var shortYearCutoff = this._get(inst, 'shortYearCutoff');
            shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
            return { shortYearCutoff: shortYearCutoff,
                dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
                monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')
            };
        },
        /* Format the given date for display. */
        _formatDate: function (inst, day, month, year) {
           	if (!day) {
				inst.currentDay = inst.selectedDay;
				inst.currentMonth = inst.selectedMonth;
				inst.currentYear = inst.selectedYear;
			}
			
			var date = null;
			if (!this._get(inst, 'isHijri')) {
				date = (day ? (typeof day == 'object' ? day :
					this._daylightSavingAdjust(new Date(year, month, day))) :
					this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
				
				if (this._get(inst, 'showTimeInput')) 
					date = new Date(year, month, day, inst.selectedHours, inst.selectedMinutes, inst.selectedSeconds);
					
			}else {
				date = Globalize.culture().calendar.convert.toGregorian(year, month, parseInt(day, 10), inst.selectedHours, inst.selectedMinutes, inst.selectedSeconds);
			}
			return this.formatDate(date, this._get(inst, 'dateFormat'), inst.settings.culture);
        }
    });

    /* jQuery extend now ignores nulls! */
    function extendRemove(target, props) {
        $.extend(target, props);
        for (var name in props)
            if (props[name] == null || props[name] == undefined)
                target[name] = props[name];
        return target;
    };

    /* Determine whether an object is an array. */
    function isArray(a) {
        return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
    };

    $.fn.datepicker = function (options) {

        /* Verify an empty collection wasn't passed - Fixes #6976 */
        if (!this.length) {
            return this;
        }

        /* Initialise the date picker. */
        if (!$.datepicker.initialized) {
            $(document).mousedown($.datepicker._checkExternalClick).
			find('body').append($.datepicker.dpDiv);
            $.datepicker.initialized = true;
        }

        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
            return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
        if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
            return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
        return this.each(function () {
			if (options==undefined)
				return;
				
            typeof options == 'string' ? 
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
        });
    };

    $.datepicker = new Datepicker(); // singleton instance
    $.datepicker.initialized = false;
    $.datepicker.uuid = new Date().getTime();

    // Add another global to avoid noConflict issues with inline event handlers
    window['DP_jQuery_' + dpuuid] = $;
})(jQuery);

/*
	* JQuery Event Drag Plugin v 2.0.0 - This is used in order to resize columns. 
* Open Source MIT License - http://threedubmedia.com/code/license
* 
*/
(function(f){f.fn.drag=function(b,a,d){var e=typeof b=="string"?b:"",k=f.isFunction(b)?b:f.isFunction(a)?a:null;if(e.indexOf("drag")!==0)e="drag"+e;d=(b==k?a:d)||{};return k?this.on(e,d,k):this.trigger(e)};var i=f.event,h=i.special,c=h.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:false,drop:true,click:false},datakey:"dragdata",livekey:"livedrag",add:function(b){var a=f.data(this,c.datakey),d=b.data||{};a.related+=1;if(!a.live&&b.selector){a.live=true;i.add(this,"draginit."+ c.livekey,c.delegate)}f.each(c.defaults,function(e){if(d[e]!==undefined)a[e]=d[e]})},remove:function(){f.data(this,c.datakey).related-=1},setup:function(){if(!f.data(this,c.datakey)){var b=f.extend({related:0},c.defaults);f.data(this,c.datakey,b);i.add(this,"mousedown",c.init,b);this.attachEvent&&this.attachEvent("ondragstart",c.dontstart)}},teardown:function(){if(!f.data(this,c.datakey).related){f.removeData(this,c.datakey);i.remove(this,"mousedown",c.init);i.remove(this,"draginit",c.delegate);c.textselect(true); this.detachEvent&&this.detachEvent("ondragstart",c.dontstart)}},init:function(b){var a=b.data,d;if(!(a.which>0&&b.which!=a.which))if(!f(b.target).is(a.not))if(!(a.handle&&!f(b.target).closest(a.handle,b.currentTarget).length)){a.propagates=1;a.interactions=[c.interaction(this,a)];a.target=b.target;a.pageX=b.pageX;a.pageY=b.pageY;a.dragging=null;d=c.hijack(b,"draginit",a);if(a.propagates){if((d=c.flatten(d))&&d.length){a.interactions=[];f.each(d,function(){a.interactions.push(c.interaction(this,a))})}a.propagates= a.interactions.length;a.drop!==false&&h.drop&&h.drop.handler(b,a);c.textselect(false);i.add(document,"mousemove mouseup",c.handler,a);return false}}},interaction:function(b,a){return{drag:b,callback:new c.callback,droppable:[],offset:f(b)[a.relative?"position":"offset"]()||{top:0,left:0}}},handler:function(b){var a=b.data;switch(b.type){case !a.dragging&&"mousemove":if(Math.pow(b.pageX-a.pageX,2)+Math.pow(b.pageY-a.pageY,2)<Math.pow(a.distance,2))break;b.target=a.target;c.hijack(b,"dragstart",a); if(a.propagates)a.dragging=true;case "mousemove":if(a.dragging){c.hijack(b,"drag",a);if(a.propagates){a.drop!==false&&h.drop&&h.drop.handler(b,a);break}b.type="mouseup"}case "mouseup":i.remove(document,"mousemove mouseup",c.handler);if(a.dragging){a.drop!==false&&h.drop&&h.drop.handler(b,a);c.hijack(b,"dragend",a)}c.textselect(true);if(a.click===false&&a.dragging){jQuery.event.triggered=true;setTimeout(function(){jQuery.event.triggered=false},20);a.dragging=false}break}},delegate:function(b){var a= [],d,e=f.data(this,"events")||{};f.each(e.live||[],function(k,j){if(j.preType.indexOf("drag")===0)if(d=f(b.target).closest(j.selector,b.currentTarget)[0]){i.add(d,j.origType+"."+c.livekey,j.origHandler,j.data);f.inArray(d,a)<0&&a.push(d)}});if(!a.length)return false;return f(a).on("dragend."+c.livekey,function(){i.remove(this,"."+c.livekey)})},hijack:function(b,a,d,e,k){if(d){var j={event:b.originalEvent,type:b.type},n=a.indexOf("drop")?"drag":"drop",l,o=e||0,g,m;e=!isNaN(e)?e:d.interactions.length; b.type=a;b.originalEvent=null;d.results=[];do if(g=d.interactions[o])if(!(a!=="dragend"&&g.cancelled)){m=c.properties(b,d,g);g.results=[];f(k||g[n]||d.droppable).each(function(q,p){l=(m.target=p)?i.handle.call(p,b,m):null;if(l===false){if(n=="drag"){g.cancelled=true;d.propagates-=1}if(a=="drop")g[n][q]=null}else if(a=="dropinit")g.droppable.push(c.element(l)||p);if(a=="dragstart")g.proxy=f(c.element(l)||g.drag)[0];g.results.push(l);delete b.result;if(a!=="dropinit")return l});d.results[o]=c.flatten(g.results); if(a=="dropinit")g.droppable=c.flatten(g.droppable);a=="dragstart"&&!g.cancelled&&m.update()}while(++o<e);b.type=j.type;b.originalEvent=j.event;return c.flatten(d.results)}},properties:function(b,a,d){var e=d.callback;e.drag=d.drag;e.proxy=d.proxy||d.drag;e.startX=a.pageX;e.startY=a.pageY;e.deltaX=b.pageX-a.pageX;e.deltaY=b.pageY-a.pageY;e.originalX=d.offset.left;e.originalY=d.offset.top;e.offsetX=b.pageX-(a.pageX-e.originalX);e.offsetY=b.pageY-(a.pageY-e.originalY);e.drop=c.flatten((d.drop||[]).slice()); e.available=c.flatten((d.droppable||[]).slice());return e},element:function(b){if(b&&(b.jquery||b.nodeType==1))return b},flatten:function(b){return f.map(b,function(a){return a&&a.jquery?f.makeArray(a):a&&a.length?c.flatten(a):a})},textselect:function(b){f(document)[b?"unbind":"bind"]("selectstart",c.dontstart).attr("unselectable",b?"off":"on").css("MozUserSelect",b?"":"none")},dontstart:function(){return false},callback:function(){}};c.callback.prototype={update:function(){h.drop&&this.available.length&& f.each(this.available,function(b){h.drop.locate(this,b)})}};h.draginit=h.dragstart=h.dragend=c})($);

/*
* SlickGrid Core
*/
(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Event": Event,
            "EventData": EventData,
            "Range": Range,
            "NonDataRow": NonDataItem,
            "Group": Group,
            "GroupTotals": GroupTotals,
            "EditorLock": EditorLock,
			
            /*
				* A global singleton editor lock.
            * @class GlobalEditorLock
            * @static
            * @constructor
            */
            "GlobalEditorLock": new EditorLock()
        }
    });

    /*
    * An event object for passing data to event handlers and letting them control propagation.
    * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
    * @class EventData
    * @constructor
    */
    function EventData() {
        var isPropagationStopped = false;
        var isImmediatePropagationStopped = false;

		/*
        * Stops event from propagating up the DOM tree.
        * @method stopPropagation
        */
        this.stopPropagation = function () {
            isPropagationStopped = true;
        };

        /*
        * Returns whether stopPropagation was called on this event object.
        * @method isPropagationStopped
        * @return {Boolean}
        */
        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        /*
        * Prevents the rest of the handlers from being executed.
        * @method stopImmediatePropagation
        */
        this.stopImmediatePropagation = function () {
            isImmediatePropagationStopped = true;
        };

		/*
        * Returns whether stopImmediatePropagation was called on this event object.\
        * @method isImmediatePropagationStopped
        * @return {Boolean}
        */
        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        }
    }

    /*
    * A simple publisher-subscriber implementation.
    * @class Event
    * @constructor
    */
    function Event() {
        var handlers = [];

        /*
        * Adds an event handler to be called when the event is fired.
        * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
        * object the event was fired with.<p>
        * @method subscribe
        * @param fn {Function} Event handler.
        */
        this.subscribe = function (fn) {
            handlers.push(fn);
        };

        /*
        * Removes an event handler added with <code>subscribe(fn)</code>.
        * @method unsubscribe
        * @param fn {Function} Event handler to be removed.
        */
        this.unsubscribe = function (fn) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === fn) {
                    handlers.splice(i, 1);
                }
            }
        };

		this.unsubscribeAll = function () {
            handlers = [];
        };
        
		/*
        * Fires an event notifying all subscribers.
        * @method notify
        * @param args {Object} Additional data object to be passed to all handlers.
        * @param e {EventData}
        * Optional.
        * An <code>EventData</code> object to be passed to all handlers.
        * For DOM events, an existing W3C/jQuery event object can be passed in.
        * @param scope {Object}
        * Optional.
        * The scope ("this") within which the handler will be executed.
        * If not specified, the scope will be set to the <code>Event</code> instance.
        */
        this.notify = function (args, e, scope) {
            e = e || new EventData();
            scope = scope || this;

            var returnValue;
            for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
                returnValue = handlers[i].call(scope, e, args);
				}

            return returnValue;
        };
    }

    /*
    * A structure containing a range of cells.
    * @class Range
    * @constructor
    * @param fromRow {Integer} Starting row.
    * @param fromCell {Integer} Starting cell.
    * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
    * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
    */
    function Range(fromRow, fromCell, toRow, toCell) {
        if (toRow === undefined && toCell === undefined) {
            toRow = fromRow;
            toCell = fromCell;
        }

        /*
        * @property fromRow
        * @type {Integer}
        */
        this.fromRow = Math.min(fromRow, toRow);

        /*
        * @property fromCell
        * @type {Integer}
        */
        this.fromCell = Math.min(fromCell, toCell);

        /*
        * @property toRow
        * @type {Integer}
        */
        this.toRow = Math.max(fromRow, toRow);

        /*
        * @property toCell
        * @type {Integer}
        */
        this.toCell = Math.max(fromCell, toCell);

        /*
        * Returns whether a range represents a single row.
        * @method isSingleRow
        * @return {Boolean}
        */
        this.isSingleRow = function () {
            return this.fromRow == this.toRow;
        };

        /*
        * Returns whether a range represents a single cell.
        * @method isSingleCell
        * @return {Boolean}
        */
        this.isSingleCell = function () {
            return this.fromRow == this.toRow && this.fromCell == this.toCell;
        };

        /*
        * Returns whether a range contains a given cell.
        * @method contains
        * @param row {Integer}
        * @param cell {Integer}
        * @return {Boolean}
        */
        this.contains = function (row, cell) {
            return row >= this.fromRow && row <= this.toRow &&
                   cell >= this.fromCell && cell <= this.toCell;
        };

        /*
        * Returns a readable representation of a range.
        * @method toString
        * @return {String}
        */
        this.toString = function () {
            if (this.isSingleCell()) {
                return "(" + this.fromRow + ":" + this.fromCell + ")";
            }
            else {
                return "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
            }
        }
    }


    /*
    * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
    * @class NonDataItem
    * @constructor
    */
    function NonDataItem() {
        this.__nonDataRow = true;
    }


    /*
    * Information about a group of rows.
    * @class Group
    * @extends Slick.NonDataItem
    * @constructor
    */
    function Group() {
        this.__group = true;
        this.__updated = false;

        /*
        * Number of rows in the group.
        * @property count
        * @type {Integer}
        */
        this.count = 0;

        /*
        * Grouping value.
        * @property value
        * @type {Object}
        */
        this.value = null;

        /*
        * Formatted display value of the group.
        * @property title
        * @type {String}
        */
        this.title = null;

        /*
        * Whether a group is collapsed.
        * @property collapsed
        * @type {Boolean}
        */
        this.collapsed = false;

        /*
        * GroupTotals, if any.
        * @property totals
        * @type {GroupTotals}
        */
        this.totals = null;
    }

    Group.prototype = new NonDataItem();

    /*
    * Compares two Group instances.
    * @method equals
    * @return {Boolean}
    * @param group {Group} Group instance to compare to.
    */
    Group.prototype.equals = function (group) {
        return this.value === group.value &&
               this.count === group.count &&
               this.collapsed === group.collapsed;
    };

	/*
    * Information about group totals.
    * An instance of GroupTotals will be created for each totals row and passed to the aggregators
    * so that they can store arbitrary data in it. That data can later be accessed by group totals
    * formatters during the display.
    * @class GroupTotals
    * @extends Slick.NonDataItem
    * @constructor
    */
    function GroupTotals() {
        this.__groupTotals = true;

        /*
        * Parent Group.
        * @param group
        * @type {Group}
        */
        this.group = null;
    }

    GroupTotals.prototype = new NonDataItem();

    /*
    * A locking helper to track the active edit controller and ensure that only a single controller
    * can be active at a time. This prevents a whole class of state and validation synchronization
    * issues. An edit controller (such as InforDataGrid) can query if an active edit is in progress
    * and attempt a commit or cancel before proceeding.
    * @class EditorLock
    * @constructor
    */
    function EditorLock() {
        var activeEditController = null;

        /*
        * Returns true if a specified edit controller is active (has the edit lock).
        * If the parameter is not specified, returns true if any edit controller is active.
        * @method isActive
        * @param editController {EditController}
        * @return {Boolean}
        */
        this.isActive = function (editController) {
            return (editController ? activeEditController === editController : activeEditController !== null);
        };

        /*
        * Sets the specified edit controller as the active edit controller (acquire edit lock).
        * If another edit controller is already active, and exception will be thrown.
        * @method activate
        * @param editController {EditController} edit controller acquiring the lock
        */
        this.activate = function (editController) {
            if (editController === activeEditController) { // already activated?
                return;
            }
            if (activeEditController !== null) {
                throw "InforDataGrid.EditorLock.activate: an editController is still active, can't activate another editController";
            }
            if (!editController.commitCurrentEdit) {
                throw "InforDataGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
            }
            if (!editController.cancelCurrentEdit) {
                throw "InforDataGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
            }
            activeEditController = editController;
        };

        /*
        * Unsets the specified edit controller as the active edit controller (release edit lock).
        * If the specified edit controller is not the active one, an exception will be thrown.
        * @method deactivate
        * @param editController {EditController} edit controller releasing the lock
        */
        this.deactivate = function (editController) {
            if (activeEditController !== editController) {
                throw "InforDataGrid.EditorLock.deactivate: specified editController is not the currently active one";
            }
            activeEditController = null;
        };

        /*
        * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
        * controller and returns whether the commit attempt was successful (commit may fail due to validation
        * errors, etc.). Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
        * and false otherwise. If no edit controller is active, returns true.
        * @method commitCurrentEdit
        * @return {Boolean}
        */
        this.commitCurrentEdit = function () {
            return (activeEditController ? activeEditController.commitCurrentEdit() : true);
        };

        /*
        * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
        * controller and returns whether the edit was successfully cancelled. If no edit controller is
        * active, returns true.
        * @method cancelCurrentEdit
        * @return {Boolean}
        */
        this.cancelCurrentEdit = function cancelCurrentEdit() {
            return (activeEditController ? activeEditController.cancelCurrentEdit() : true);
        };
    }
})($);

/*
* InforDataGrid v2.0
*/
(function ($) {
    // Slick.Grid
    $.extend(true, window, {
        Slick: {
            Grid: SlickGrid
        }
    });

    var scrollbarDimensions; // shared across all grids on this page

    /**
    * @param {Node} container Container node to create the grid in.
    * @param {Array,Object} data An array of objects for databinding.
    * @param {Array} columns An array of column definitions.
    * @param {Object} options Grid options.
    **/
    function SlickGrid(container, data, columns, options) {
		// settings
        var defaults = {
            headerHeight: 25,
            rowHeight: 25,
            defaultColumnWidth: 80,
            enableAddRow: false,
            leaveSpaceForNewRows: false,
            editable: false,
            autoEdit: true,
            enableCellNavigation: true,
            enableCellRangeSelection: false,
            enableColumnReorder: true,
            asyncEditorLoading: false,
            asyncEditorLoadDelay: 100,
            forceFitColumns: false,
            enableAsyncPostRender: false,
            asyncPostRenderDelay: 60,
            autoHeight: false,
			autoHeightToPageSize: false,
			fillHeight: true,
			editorLock: Slick.GlobalEditorLock,
            showHeaderRow: false,
			showSummaryRow: false,
            headerRowHeight: 28,
			summaryRowHeight: 25,
			showTopPanel: false,
            topPanelHeight: 25,
            formatterFactory: null,
            editorFactory: null,
            selectedCellCssClass: "selected",
            multiSelect: true,
			fullWidthRows: true,
			filterMenuOptions: null,
			gridMenuOptions: null,
			showColumnHeaders: true
		};

        var columnDefaults = { 
            name: "",
            resizable: true,
            sortable: true,
			reorderable: true,
            minWidth: 20,
            headerCssClass: null
        };

        // scroller
        var maxSupportedCssHeight; // browser's breaking point
        var th; // virtual height
        var h; // real scrollable height
        var ph; // page height
        var n; // number of pages
        var cj; // "jumpiness" coefficient
		var defaultColumns = $.extend(true, [], columns);	//deep copy the array for restore function
		
        var page = 0; // current page
        var offset = 0; // current page offset
        var scrollDir = 1;
		
        // private
		var initialized = false;
		var $container;
        var uid = "slickgrid_" + Math.round(1000000 * Math.random());
        var self = this;
        var $headerScroller;
        var $headers;
        var $headerRow, $headerRowScroller, $summaryRow, $summaryRowScroller;
        var $topPanelScroller;
        var $topPanel;
        var $viewport;
		var $pageFooter;
		
		var $gridSettingsButton;
        var $filterMenuButton;
        var $canvas;
        var $style;
        var stylesheet, columnCssRulesL = [], columnCssRulesR = [];
        var viewportH, viewportW;
        var canvasWidth;
		var viewportHasHScroll, viewportHasVScroll;
   
        var headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, // border+padding
        cellWidthDiff = 0, cellHeightDiff = 0;
		var absoluteColumnMinWidth;
		var numberOfRows = 0;
		
		var dataView = data;
		var filterInResults = true;
		var allColumns = [];	//both the hidden and non hidden columns
		
        var activePosX;
        var activeRow, activeCell;
        var activeCellNode = null;
        var currentEditor = null;
        var serializedEditorValue;
        var editController;

        var rowsCache = {};
        var renderedRows = 0;
        var numVisibleRows;
        var prevScrollTop = 0;
        var scrollTop = 0;
        var lastRenderedScrollTop = 0;
        var prevScrollLeft = 0;

        var selectionModel;
        var selectedRows = [];

        var plugins = [];
        var cellCssClasses = {};

        var columnsById = {};
        var sortColumnId;
        var sortAsc = true;

        // async call handles
        var h_editorLoader = null;
        var h_render = null;
        var h_postrender = null;
        var postProcessedRows = {};
        var postProcessToRow = null;
        var postProcessFromRow = null;
		
        // perf counters
        var counter_rows_rendered = 0;
        var counter_rows_removed = 0;
	
		// Handle Window Resizing
        var resizeTimer = null;
		var windowHeight = $(window).height(), windowWidth = $(window).width();
		
		var columnFilters = {};
		var isFiltering = false;
		var selectedRecordArea = null;
		
		var columnpicker = null;
		var personalizationInfo = {caller: '', sortColumnId: 0, sortAsc: null,  columnInfo: [], filterInResults: true};
										
        //////////////////////////////////////////////////////////////////////////////////////////////
        // Initialization
        function init() {
            $container = $(container);
            if ($container.length < 1) {
                throw new Error("InforDataGrid requires a valid container, " + container + " does not exist in the DOM.");
            }

            maxSupportedCssHeight = getMaxSupportedCssHeight();

            scrollbarDimensions = scrollbarDimensions || measureScrollbar(); // skip measurement if already have dimensions
            options = $.extend({}, defaults, options);
            columnDefaults.width = options.defaultColumnWidth;

            // validate loaded JavaScript modules against requested options
            if (options.enableColumnReorder && !$.fn.sortable) {
                throw new Error("InforDataGrid's \"enableColumnReorder = true\" option requires jquery-ui.sortable module to be loaded");
            }

            editController = {
                "commitCurrentEdit": commitCurrentEdit,
                "cancelCurrentEdit": cancelCurrentEdit
            };

            $container
                .empty()
                .attr("tabIndex", 0)
                .attr("hideFocus", true)
                .css("overflow", "hidden")
                .css("outline", 0)
                .addClass(uid);

            // set up a positioning container if needed
            if (!/relative|absolute|fixed/.test($container.css("position")))
                $container.css("position", "relative");

            $headerScroller = $("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headers = $("<div class='slick-header-columns' style='width:10000px; "+(!Globalize.culture().isRTL ? "left:-1000px" : "right:-1000px")+"' />").appendTo($headerScroller);
		
            $headerRowScroller = $("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headerRow = $("<div class='slick-headerrow-columns' style='width:10000px;' />").appendTo($headerRowScroller);
			
            $topPanelScroller = $("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $topPanel = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller);

            if (!options.showTopPanel) {
                $topPanelScroller.hide();
            }

            if (!options.showHeaderRow) {
                $headerRowScroller.hide();
            }
			
			if (!options.showColumnHeaders) {
            	$headerScroller.hide();
			}
            $viewport = $("<div class='slick-viewport' tabIndex='0' hideFocus style='width:100%;overflow-x:auto;outline:0;position:relative;overflow-y:auto;'>").appendTo($container);
            $canvas = $("<div class='grid-canvas' tabIndex='0' hideFocus />").appendTo($viewport);

			$summaryRowScroller = $("<div class='slick-summaryrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $summaryRow = $("<div class='slick-summaryrow-columns' style='width:10000px;' />").appendTo($summaryRowScroller);
			
			$pageFooter = $(".inforBottomFooter");
			
			if (!options.showSummaryRow) {
                $summaryRowScroller.hide();
            }
			
			// header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
            // calculate the diff so we can set consistent sizes
            measureCellPaddingAndBorder();

            // for usability reasons, all text selection in InforDataGrid is disabled
            // with the exception of input and textarea elements (selection must
            // be enabled there so that editors work as expected); note that
            // selection in grid cells (grid body) is already unavailable in
            // all browsers except IE
            disableSelection($headers); // disable all text selection in header (including input and textarea)

            viewportW = parseFloat($.css($container[0], "width", true));

            createColumnHeaders();
            setupColumnSort();
            createCssRules();
            resizeAndRender();
			
            bindAncestorScrollEvents();
            $viewport.on("scroll.slickgrid", handleScroll);
            //Causes IE8 Resize issues...
			//$container.on("resize.slickgrid, resizeAndRender);
			//$(window).on('resize', handleResize);
            //$(window).smartresize(handleResize);
			$(window).on("smartresize.inforDataGrid",function(){
				handleResize();
			});

			$headerScroller
                .on("contextmenu.slickgrid", handleHeaderContextMenu)
                .on("click.slickgrid", handleHeaderClick);

            $canvas
                .on("keydown.slickgrid", handleKeyDown)
                .on("click.slickgrid", handleClick)
				.on("dblclick.slickgrid", handleDblClick)
                .on("contextmenu.slickgrid", handleContextMenu)
                .on("draginit", handleDragInit)
                .on("dragstart", handleDragStart)
                .on("drag", handleDrag)
                .on("dragend", handleDragEnd);

            $canvas.delegate(".slick-cell", "mouseenter", handleMouseEnter);
            $canvas.delegate(".slick-cell", "mouseleave", handleMouseLeave);
			
			if (!initialized) {
				initialized = true;
			}
		}
		
		function handleResize() {
			if (resizeTimer) clearTimeout(resizeTimer);
			
			if (windowHeight != $(window).height() || windowWidth != $(window).width())
			{	
				resizeTimer = setTimeout(resizeAndRender, 10);
				windowHeight = $(window).height();
				windowWidth = $(window).width();
				
				if (options.forceFitColumns)
					resizeCanvas();
			}
		}
		
        function registerPlugin(plugin) {
            plugins.unshift(plugin);
            plugin.init(self);
        }
	
		function getPlugin(name) {
            for (i = 0; i < plugins.length; i++) {
				var plugin = plugins[i];
				if (plugin.name==name)
					 return plugins[i];
			}
        }

        function unregisterPlugin(plugin) {
            for (var i = plugins.length; i >= 0; i--) {
                if (plugins[i] === plugin) {
                    if (plugins[i].destroy) {
                        plugins[i].destroy();
                    }
                    plugins.splice(i, 1);
                    break;
                }
            }
        }

        function setSelectionModel(model) {
            if (selectionModel) {
                selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
                if (selectionModel.destroy) {
                    selectionModel.destroy();
                }
            }

            selectionModel = model;
            selectionModel.init(self);

            selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
        }

        function getSelectionModel() {
            return selectionModel;
        }

        function getCanvasNode() {
            return $canvas[0];
        }

        function measureScrollbar() {
            var $c = $("<div style='position:absolute; top:-10000px; "+(!Globalize.culture().isRTL ? "left:-1000px" : "right:-1000px") +" width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
            var dim = { width: $c.width() - $c[0].clientWidth, height: $c.height() - $c[0].clientHeight };
            $c.remove();
            return dim;
        }

        function getCanvasWidth() {
		  var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
		  var rowWidth = 0;
		  var i = columns.length;
		  while (i--) {
			rowWidth += (columns[i].width || columnDefaults.width);
		  }
		  
		  if (Globalize.culture().isRTL && viewportHasHScroll)
			rowWidth += scrollbarDimensions.width+5;
			
		  return options.fullWidthRows ? Math.max(rowWidth, availableWidth) : rowWidth;
		}

        function updateCanvasWidth(forceColumnWidthsUpdate) {
		  var oldCanvasWidth = canvasWidth;
		  canvasWidth = getCanvasWidth();

		  if (canvasWidth != oldCanvasWidth) {
			$canvas.width(canvasWidth);
			$headerRow.width(canvasWidth);
			if (Globalize.culture().isRTL) {
				$headerRow.next("div").width(canvasWidth);
				$headers.width(canvasWidth+1000);
				$summaryRow.next("div").width(canvasWidth);
			}
			$summaryRow.width(canvasWidth);
			viewportHasHScroll = (canvasWidth > viewportW - scrollbarDimensions.width);
		  }

		  if (canvasWidth != oldCanvasWidth || forceColumnWidthsUpdate) {
			applyColumnWidths();
		  }
		}
		
        function disableSelection($target) {
            if ($target && $target.jquery) {
                $target
                    .attr('unselectable', 'on')
                    .css('MozUserSelect', 'none')
                    .on('selectstart.ui', function () { return false; }); // from jquery:ui.core.js 1.7.2
            }
        }

		/*add the button menus*/
		function appendGridSettingsMenu() {
			appendMenu("gridSettingsMenu", options.gridMenuOptions);
		}
		
		/*dynamically add the menu contents and call*/
		function appendMenu(menuid, menuOpts) {
			$("#"+menuid).remove();
			var ul = $('<ul id="'+menuid+'" class="inforContextMenu"></ul>');
			
			for (var i = 0; i < menuOpts.length; i++) {
				var opt = menuOpts[i];
				if (opt.condition || opt.condition==undefined) {
					var li = $('<li><a>'+opt.label+'</a></li>'),
						a = li.find("a");
					
					if (opt.id)
						a.attr("id",opt.id);
					
					if (opt.cssClass)
						li.addClass(opt.cssClass);
					
					if (opt.href)
						a.attr("href",opt.href);
					
					if (opt.onclick) {
						a.attr("onclick",opt.onclick);
					}
					
					ul.append(li);
				}
			}
			$("body").append(ul);
		}
		
		/*add the button menus*/
		function appendFilterMenu() {
			appendMenu("gridFilterMenu", options.filterMenuOptions);
		}
		
		//set the menu options as checked or unchecked depending on the current values.
		function setMenuChecked() {
			//set the show filter row...
			var menu = $("#gridSettingsMenu");
			var isChecked = (options.showHeaderRow == true);
			
			var li = menu.find("#showFilter").parent();
			if (isChecked)
			{
				li.removeClass("notChecked");
				li.addClass("checked");
			}
			else
			{
				li.removeClass("checked");
				li.addClass("notChecked");
			}
			
			//set the toggle in results
			menu = $("#gridFilterMenu");
			li =  menu.find("#filterInResults").parent();
			if (filterInResults)
			{
				li.removeClass("notChecked");
				li.addClass("checked");
			}
			else
			{
				li.removeClass("checked");
				li.addClass("notChecked");
			}
		}
		
		/* Update Headers to remove extra border. */
		function showGridSettings() {
			if (!options.showColumnHeaders)
				return;
				
			if ($gridSettingsButton==undefined)
			{	
				$gridSettingsButton = $("<button type='button' class='inforGridSettingsButton' title='"+Globalize.localize("GridSettings")+"'></button>");
				
				if (Globalize.culture().isRTL)
					$gridSettingsButton.addClass("inforRTLFlip");
				
				$container.prepend($gridSettingsButton);
				appendGridSettingsMenu();
			}
			
			var leftOffset = -20;
			if (Globalize.culture().isRTL)
				leftOffset = 5;
				
			$gridSettingsButton.inforContextMenu({
				menu: 'gridSettingsMenu',
				invokeMethod: 'toggle',
				positionBelowElement: true,
				offsetLeft: leftOffset,
				offsetTop: -3,
				beforeOpening: setMenuChecked
			},
				function(action, button, pos, aHref) {
					if (action=="sfr")
						toggleFilterRow();
						
					if (action=="cp")
						columnPersonalization(button);
						
					if (action=="ex")
						excelExport();
						
					if (action=="re")
						resetColumnLayout();
			});
		}
		
		function excelExport() {	//find the cell range selector plugin and call it
			getPlugin("CellRangeSelector").excelExport();
		}
		
		function getFilteredData() {
			var dv = getData();
			return  dv.getFilteredAndPagedItems(dv.getItems(), filter).rows;
		}
		
		//add and show the column picker
		function columnPersonalization (button) {
			saveColumns();	//save once ..
			if (columnpicker==null)
				columnpicker = new Slick.Controls.ColumnPicker(allColumns, self, options);
			
			columnpicker.open(button);
		}
		
        function getMaxSupportedCssHeight() {
		  var supportedHeight = 1000000;
		  // FF reports the height back but still renders blank after ~6M px
		  var testUpTo = ($.browser.mozilla) ? 6000000 : 1000000000;
		  var div = $("<div style='display:none' />").appendTo(document.body);

		  while (true) {
			var test = supportedHeight * 2;
			div.css("height", test);
			if (test > testUpTo || div.height() !== test) {
			  break;
			} else {
			  supportedHeight = test;
			}
		  }

		  div.remove();
		  return supportedHeight;
		}

        // TODO: this is static. need to handle page mutation.
        function bindAncestorScrollEvents() {
            var elem = $canvas[0];
            while ((elem = elem.parentNode) != document.body) {
                // bind to scroll containers only
                if (elem == $viewport[0] || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight)
                    $(elem).on("scroll.slickgrid", handleActiveCellPositionChange);
            }
        }

        function unbindAncestorScrollEvents() {
            $canvas.parents().unbind("scroll.slickgrid");
        }

        function updateColumnHeader(columnId, title, toolTip) {
            if (!initialized) { return; }
			var idx = getColumnIndex(columnId);
            var $header = $headers.children().eq(idx);
            if ($header) {
                columns[idx].name = title;
                columns[idx].toolTip = toolTip;
                $header
                    .attr("title", toolTip || title || "")
                    .children().eq(0).html(title);
            }
        }

        function getHeaderRow() {
            return $headerRow[0];
        }

		function getSummaryRow() {
            return $summaryRow[0];
        }

        function getHeaderRowColumn(columnId) {
            var idx = getColumnIndex(columnId);
            var $header = $headerRow.children().eq(idx);
            return $header && $header[0];
        }

		function getSummaryRowColumn(columnId) {
            var idx = getColumnIndex(columnId);
            var $footer = $summaryRow.children().eq(idx);
            return $footer && $footer[0];
        }
		
		function RequiredFieldValidator(value) {	
           if (value == null || value == undefined || !value.length) {
                return { valid: false, msg: Globalize.localize("Required") };
		    }
			else
                return { valid: true, msg: null };
        }
        
		function createColumnHeaders() {
            function hoverBegin() {
				if ($(this).hasClass('non-data-column-header'))
					return;
				
                $(this).addClass("ui-state-hover");
            }
            function hoverEnd() {
                $(this).removeClass("ui-state-hover");
            }

            $headers.empty();
            $headerRow.empty();
			$summaryRow.empty();
			columnsById = {};
			
            for (var i = 0; i < columns.length; i++) {
                var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
                columnsById[m.id] = i;

                var header = $("<div class='ui-state-default slick-header-column' id='" + uid + m.id + "' />")
                    .html("<span class='slick-column-name'>" + m.name + "</span>")
                    .width(m.width - headerColumnWidthDiff)
                    .attr("title", m.toolTip || m.name || "")
                    .data("fieldId", m.id)
                    .addClass(m.headerCssClass || "")
                    .appendTo($headers);
				
				if (m.reorderable)
					header.addClass("reorderable");
					
				if (m.required) {	//add required indicator and attach the validator.
					var ind = $('<div class="inforRequiredIndicator"></div>');
					header.find(".slick-column-name").before(ind);
					if (m.validator==undefined)
						m.validator = RequiredFieldValidator;
				}
				
				if (options.enableColumnReorder || m.sortable) {
                    header.hover(hoverBegin, hoverEnd);
                }

                if (m.sortable) {
                    header.append("<span class='slick-sort-indicator' />");
                }

                if (options.showHeaderRow) {
                    $("<div class='ui-state-default slick-headerrow-column l" + i + " r" + i + "'></div>").appendTo($headerRow);
				}
				
				if (options.showSummaryRow) {
                    $("<div class='ui-state-default slick-summaryrow-column l" + i + " r" + i + "'></div>").appendTo($summaryRow);
                }
            }

			// add a spacer to let the container scroll beyond the header row columns width
			var spacerHtml = $("<div style='display:block;height:1px;width:10000px;position:absolute;top:0;"+(!Globalize.culture().isRTL ? "left:0;": "right:0;")+"'></div>");
					
			if (options.showHeaderRow) {
				$(spacerHtml).appendTo($headerRowScroller);
				updateFilterRow();
			}
			if (options.showSummaryRow) {
				$(spacerHtml).appendTo($summaryRowScroller);
			}
			
            _setSortColumn(sortColumnId, sortAsc);
            setupColumnResize();
			 
            if (options.enableColumnReorder) {
                setupColumnReorder();
            }
        }
		
        function setupColumnSort() {
            $headers.click(function (e) {
                if ($(e.target).hasClass("slick-resizable-handle")) {
                    return;
                }

                var $col = $(e.target).closest(".slick-header-column");
                if (!$col.length)
                    return;

                var column = columns[getColumnIndex($col.data("fieldId"))];
                if (column.sortable) {
                    if (!getEditorLock().commitCurrentEdit())
                        return;

                    if (column.id === sortColumnId) {
                        sortAsc = !sortAsc;
                    }
                    else {
                        sortColumnId = column.id;
                        sortAsc = true;
                    }

                    _setSortColumn(sortColumnId, sortAsc);
					
                    trigger(self.onSort, { sortCol: column, sortAsc: sortAsc });
					
					//set the state of the grid and fire the events
					personalizationInfo.sortColumnId=sortColumnId;
					personalizationInfo.sortAsc=sortAsc;
					dataView.setPagingOptions({sortColumnId: sortColumnId, pageNum: 0});
					dataView.requestNewPage("sort");
					trigger(self.onPersonalizationChanged, getGridPersonalizationInfo('SortColumn'));
				}
            });
        }

        function setupColumnReorder() {
			$headers.sortable({
                containment: "parent",
                placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
                axis: "x",
				cursor: "default",
				forcePlaceholderSize: true,
				helper: "clone",
				delay: 0,
				items: ".reorderable",
                start: function (e, ui) { 
					var $helper = $(ui.helper);
					$helper.addClass("slick-header-column-active");
						
					$(document).bind("mousemove",function(e){
						if (Globalize.culture().isRTL)
							$helper.css({position: "fixed", left: e.clientX - 12 +"px", right: $(window).width() - e.clientX - $helper.width() +"px"});
						else
							$helper.css({position: "fixed", left: e.clientX - 12 +"px"});
					});
					
					$headers.children("div:not(.reorderable):not(.slick-sortable-placeholder)").each(function () {
						$(this).data("fixedIndex", getColumnIndex($(this).attr("id").replace(uid, "")));
					});
				},
                beforeStop: function (e, ui) { 
					$(ui.helper).removeClass("slick-header-column-active");
					$(document).unbind("mousemove");
				},
                stop: function (e) {
					if (!getEditorLock().commitCurrentEdit()) {
                        $(this).sortable("cancel");
                        return;
                    }

                   var reorderedIds = $headers.sortable("toArray");
                    var reorderedColumns = [];
                    for (var i = 0; i < reorderedIds.length; i++) {
                        reorderedColumns.push(columns[getColumnIndex(reorderedIds[i].replace(uid, ""))]);
                    }
					//add non-reorderable columns back
					$headers.children("div:not(.reorderable):not(.slick-sortable-placeholder)").each(function () {
						var fixedIndex = $(this).data("fixedIndex");
						reorderedColumns.splice(fixedIndex,0,columns[fixedIndex]);
					});
                    setColumns(reorderedColumns);

                    trigger(self.onColumnsReordered, {});
					updateFilterRow();
                    e.stopPropagation();
				    setupColumnResize();
                }
            });
        }
		
		function setupColumnResize() {
		  var c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
		  columnElements = $headers.children();
		  columnElements.find(".slick-resizable-handle").remove();
		  columnElements.each(function (i, e) {
			if (columns[i].resizable) {
			  if (firstResizable === undefined) {
				firstResizable = i;
			  }
			  lastResizable = i;
			}
		  });
		  if (firstResizable === undefined) {
			return;
		  }
		  columnElements.each(function (i, e) {
			if (i < firstResizable || (options.forceFitColumns && i >= lastResizable)) {
			  return;
			}
			$col = $(e);
			$("<div class='slick-resizable-handle' />")
				.appendTo(e)
				.bind("dragstart", function (e, dd) {
				  if (!getEditorLock().commitCurrentEdit()) {
					return false;
				  }
				  pageX = e.pageX;
				  
				  $(this).parent().addClass("slick-header-column-resize");
				  $(".slick-header-column").css("cursor","e-resize");	//prevents cursor from changing
				  
				  var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
				  // lock each column's width option to current width
				  columnElements.each(function (i, e) {
					columns[i].previousWidth = $(e).outerWidth();
				  });
				  if (options.forceFitColumns) {
					shrinkLeewayOnRight = 0;
					stretchLeewayOnRight = 0;
					// colums on right affect maxPageX/minPageX
					for (var j = i + 1; j < columnElements.length; j++) {
					  c = columns[j];
					  if (c.resizable) {
						if (stretchLeewayOnRight !== null) {
						  if (c.maxWidth) {
							stretchLeewayOnRight += c.maxWidth - c.previousWidth;
						  } else {
							stretchLeewayOnRight = null;
						  }
						}
						shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
					  }
					}
				  }
				  var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
				  for (var j = 0; j <= i; j++) {
					// columns on left only affect minPageX
					c = columns[j];
					if (c.resizable) {
					  if (stretchLeewayOnLeft !== null) {
						if (c.maxWidth) {
						  stretchLeewayOnLeft += c.maxWidth - c.previousWidth;
						} else {
						  stretchLeewayOnLeft = null;
						}
					  }
					  shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
					}
				  }
				  if (shrinkLeewayOnRight === null) {
					shrinkLeewayOnRight = 100000;
				  }
				  if (shrinkLeewayOnLeft === null) {
					shrinkLeewayOnLeft = 100000;
				  }
				  if (stretchLeewayOnRight === null) {
					stretchLeewayOnRight = 100000;
				  }
				  if (stretchLeewayOnLeft === null) {
					stretchLeewayOnLeft = 100000;
				  }
				  maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
				  minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
				})
				.bind("drag", function (e, dd) {
				  
				  var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, e.pageX)) - pageX, x;
				  
					if (Globalize.culture().isRTL)	//flip the direction for rtl...
						d = (d < 0 ? Math.abs(d) : (-d));
				
				 if (d < 0) { // shrink column
					x = d;
					for (var j = i; j >= 0; j--) {
					  c = columns[j];
					  if (c.resizable) {
						actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
						if (x && c.previousWidth + x < actualMinWidth) {
						  x += c.previousWidth - actualMinWidth;
						  c.width = actualMinWidth;
						} else {
						  c.width = c.previousWidth + x;
						  x = 0;
						}
					  }
					}

					if (options.forceFitColumns) {
					  x = -d;
					  for (var j = i + 1; j < columnElements.length; j++) {
						c = columns[j];
						if (c.resizable) {
						  if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
							x -= c.maxWidth - c.previousWidth;
							c.width = c.maxWidth;
						  } else {
							c.width = c.previousWidth + x;
							x = 0;
						  }
						}
					  }
					}
				  } else { // stretch column
					x = d;
					for (var j = i; j >= 0; j--) {
					  c = columns[j];
					  if (c.resizable) {
						if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
						  x -= c.maxWidth - c.previousWidth;
						  c.width = c.maxWidth;
						} else {
						  c.width = c.previousWidth + x;
						  x = 0;
						}
					  }
					}

					if (options.forceFitColumns) {
					  x = -d;
					  for (var j = i + 1; j < columnElements.length; j++) {
						c = columns[j];
						if (c.resizable) {
						  actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
						  if (x && c.previousWidth + x < actualMinWidth) {
							x += c.previousWidth - actualMinWidth;
							c.width = actualMinWidth;
						  } else {
							c.width = c.previousWidth + x;
							x = 0;
						  }
						}
					  }
					}
				  }
				  applyColumnHeaderWidths();
				  //if (options.syncColumnCellResize) {
					applyColumnWidths();
				  //}
				})
				.bind("dragend", function (e, dd) {
				  var newWidth;
				  $(this).parent().removeClass("slick-header-column-resize");
				  $(".slick-header-column").css("cursor","");	//prevents cursor from changing
				  
				  for (var j = 0; j < columnElements.length; j++) {
					c = columns[j];
					newWidth = $(columnElements[j]).outerWidth();

					if (c.previousWidth !== newWidth) {
					  invalidateAllRows();
					}
				  }
				  updateCanvasWidth(true);
				  render();
				  trigger(self.onColumnsResized, {});
				  
				  trigger(self.onPersonalizationChanged, getGridPersonalizationInfo('ColumnsResized'))
				  updateFilterRow();
				});
		  });
		}
        
		function getVBoxDelta($el) {
            var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
            var delta = 0;
            $.each(p, function (n, val) { delta += parseFloat($el.css(val)) || 0; });
            return delta;
        }

        function measureCellPaddingAndBorder() {
            var el;
            var h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
            var v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];

            el = $("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
			
            headerColumnWidthDiff = headerColumnHeightDiff = 0;
            $.each(h, function (n, val) { headerColumnWidthDiff += parseFloat(el.css(val)) || 0; });
            $.each(v, function (n, val) { headerColumnHeightDiff += parseFloat(el.css(val)) || 0; });
            el.remove();

            var r = $("<div class='slick-row' />").appendTo($canvas);
            el = $("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(r);
            cellWidthDiff = cellHeightDiff = 0;
            $.each(h, function (n, val) { cellWidthDiff += parseFloat(el.css(val)) || 0; });
            $.each(v, function (n, val) { cellHeightDiff += parseFloat(el.css(val)) || 0; });
            r.remove();

            absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
        }

        function createCssRules() {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
            var rowHeight = (options.rowHeight - cellHeightDiff);

            var rules = [
			
                "." + uid + " .slick-header-column { "+(!Globalize.culture().isRTL ? "left: 1000px;" : "right: 1000px;")+" }",
                "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
                "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
				"." + uid + " .slick-summaryrow-columns { height:" + options.summaryRowHeight + "px; }",
				"." + uid + " .slick-cell { height:" + rowHeight + "px; }",
                "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
            ];

            for (var i = 0; i < columns.length; i++) {
				rules.push("." + uid + " .l" + i + " { }");
				rules.push("." + uid + " .r" + i + " { }");
			}
			
		  if ($style[0].styleSheet) { // IE
			$style[0].styleSheet.cssText = rules.join(" ");
		  } else {
			$style[0].appendChild(document.createTextNode(rules.join(" ")));
		  }

		  var sheets = document.styleSheets;
		  for (var i = 0; i < sheets.length; i++) {
			if ((sheets[i].ownerNode || sheets[i].owningElement) == $style[0]) {
			  stylesheet = sheets[i];
			  break;
			}
		  }

		  // find and cache column CSS rules
		  columnCssRulesL = [], columnCssRulesR = [];
		  var cssRules = (stylesheet.cssRules || stylesheet.rules);
		  var matches, columnIdx;
		  for (var i = 0; i < cssRules.length; i++) {
			if (matches = /\.l\d+/.exec(cssRules[i].selectorText)) {
			  columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
			  columnCssRulesL[columnIdx] = cssRules[i];
			} else if (matches = /\.r\d+/.exec(cssRules[i].selectorText)) {
			  columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
			  columnCssRulesR[columnIdx] = cssRules[i];
			}
		  }
		}

        function removeCssRules() {
            $style.remove();
			stylesheet = null;
        }

        function destroy() {
            getEditorLock().cancelCurrentEdit();

            trigger(self.onBeforeDestroy, {});

            for (var i = 0; i < plugins.length; i++) {
                unregisterPlugin(plugins[i]);
            }

            if (options.enableColumnReorder && $headers.sortable)
                $headers.sortable("destroy");

            unbindAncestorScrollEvents();
            $container.unbind(".slickgrid");
            removeCssRules();

            $canvas.unbind("draginit dragstart dragend drag");
            $container.empty().removeClass(uid);
			$(window).unbind("smartresize.inforDataGrid");
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        // General
		
        function trigger(evt, args, e) {
            e = e || new Slick.EventData();
            args = args || {};
            args.grid = self;
            return evt.notify(args, e, self);
        }

        function getEditorLock() {
            return options.editorLock;
        }

        function getEditController() {
            return editController;
        }

        function getColumnIndex(id) {
            return columnsById[id];
        }

        function autosizeColumns() {
			var c,
			  widths = [],
			  shrinkLeeway = 0,
			  total = 0,
			  prevTotal,
			  availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
			
			if ($gridSettingsButton || options.showFilter)	//subtract size for the buttons on the end.
				availWidth -= 18
			
            for (var i = 0; i < columns.length; i++) {
				c = columns[i];
				widths.push(c.width);
				total += c.width;
				if (c.resizable) {
				  shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
				}
			  }

            // shrink
            prevTotal = total;
		  while (total > availWidth && shrinkLeeway) {
			var shrinkProportion = (total - availWidth) / shrinkLeeway;
			for (var i = 0; i < columns.length && total > availWidth; i++) {
			  c = columns[i];
			  var width = widths[i];
			  if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
				continue;
			  }
			  var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
			  var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
			  shrinkSize = Math.min(shrinkSize, width - absMinWidth);
			  total -= shrinkSize;
			  shrinkLeeway -= shrinkSize;
			  widths[i] -= shrinkSize;
			}
			if (prevTotal == total) {  // avoid infinite loop
			  break;
			}
			prevTotal = total;
		  }

		  // grow
		  prevTotal = total;
		  while (total < availWidth) {
			var growProportion = availWidth / total;
			for (var i = 0; i < columns.length && total < availWidth; i++) {
			  c = columns[i];
			  if (!c.resizable || c.maxWidth <= c.width) {
				continue;
			  }
			  var growSize = Math.min(Math.floor(growProportion * c.width) - c.width, (c.maxWidth - c.width) || 1000000) || 1;
			  total += growSize;
			  widths[i] += growSize;
			}
			if (prevTotal == total) {  // avoid infinite loop
			  break;
			}
			prevTotal = total;
		  }

		  for (var i = 0; i < columns.length; i++) {
			columns[i].width = widths[i];
		  }

		  applyColumnHeaderWidths();
		  updateCanvasWidth(true);
		  updateFilterRow();
		  invalidateAllRows();
		  render();
		}

        function applyColumnHeaderWidths() {
            if (!initialized) { return; }
			var h;
            for (var i = 0, headers = $headers.children(), ii = headers.length; i < ii; i++) {
                h = $(headers[i]);
                if (h.width() !== columns[i].width - headerColumnWidthDiff) {
                    h.width(columns[i].width - headerColumnWidthDiff);
                }
            }
        }

		function applyColumnWidths() {
		  var x = 0, w, rule;
		  for (var i = 0; i < columns.length; i++) {
			w = columns[i].width;
			
			rule = columnCssRulesL[i];
			if (!Globalize.culture().isRTL)
				rule.style.left = x + "px";
			else
				rule.style.right = x + "px";
			
			rule = columnCssRulesR[i];
			if (!Globalize.culture().isRTL)
				rule.style.right = (canvasWidth - x - w) + "px";
			else
				rule.style.left = (canvasWidth - x - w) + "px";
	
			x += columns[i].width;
		  }
		}

		/*External Facing function to set the sort column*/
		function setSortColumn(sortColumnId, sortAsc)
		{
			var column = columns[getColumnIndex(sortColumnId)];
            _setSortColumn(sortColumnId, sortAsc);
            trigger(self.onSort, { sortCol: column, sortAsc: sortAsc });
			
			//set the state of the grid and fire the events
			if (personalizationInfo.sortColumnId==sortColumnId && personalizationInfo.sortAsc==sortAsc)
				return;
				
			personalizationInfo.sortColumnId=sortColumnId;
			personalizationInfo.sortAsc=sortAsc;
			trigger(self.onPersonalizationChanged, getGridPersonalizationInfo('SortColumn'));
		}
		
        function _setSortColumn(columnId, ascending) {
            sortColumnId = columnId;
            sortAsc = ascending;
            var columnIndex = getColumnIndex(sortColumnId);

            $headers.children().removeClass("slick-header-column-sorted");
            $headers.find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");

            if (columnIndex != null) {
                $headers.children().eq(columnIndex)
                    .addClass("slick-header-column-sorted")
                    .find(".slick-sort-indicator")
                        .addClass(sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");
            }
			
	    }
		
        function handleSelectedRangesChanged(e, ranges) {
            selectedRows = [];
            var hash = {};
            for (var i = 0; i < ranges.length; i++) {
                for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                    if (!hash[j] && canRowBeSelected(j)) { // prevent duplicates
                         selectedRows.push(j);
                    }
                    hash[j] = {};
                    for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
                        if (canCellBeSelected(j, k)) {
                            hash[j][columns[k].id] = options.selectedCellCssClass;
                        }
                    }
                }
            }
			
			setCellCssStyles(options.selectedCellCssClass, hash);
			
				
			trigger(self.onSelectedRowsChanged, { rows: getSelectedRows() }, e);
			
			//set the footer status 
			if (selectedRecordArea==null && options.showFooter) {
				selectedRecordArea = $container.next(".inforGridFooter").find(".slick-records-status");
			}
			
			if (options.showFooter && selectedRecordArea.length!=0)
				selectedRecordArea.html(Globalize.localize("Selected") + (selectedRows.length < 10 ? " " + selectedRows.length : selectedRows.length));
		}

        function getColumns() {
            return columns;
        }
		 
        function setColumns(columnDefinitions) {
            columns = columnDefinitions;
			if (initialized) {
				invalidateAllRows();
				createColumnHeaders();
				removeCssRules();
				createCssRules();
				resizeAndRender();
				applyColumnWidths();
				handleScroll();
				updateSummaryRow();
			}
			trigger(self.onPersonalizationChanged, getGridPersonalizationInfo('SetColumns'))
		}
		
		function saveColumns() {
			if (allColumns.length!=0)
				return;
				
			for (var i=0; i<columns.length; i++) {
				allColumns.push(columns[i]);
			}
		}
		
	    function hideColumn(columnid) {
			saveColumns();	//save the columns once...
			var visibleColumns = [];
			for (var i=0; i<columns.length; i++) {
				if (columns[i].id!=columnid)
					visibleColumns.push(columns[i]);
			}
			setColumns(visibleColumns);
			updateFilterRow();
		}
		
		function colInArry(array, columnid) {
			for (var i=0; i < array.length; i++) {
				if (array[i].id==columnid)
					return true;
			}
			return false;
		}
		
		function showColumn(columnid) {
			if (allColumns.length==0)
				return;
				
            var columns = getColumns();
			for (var i=0; i < allColumns.length; i++) {
				if ((columnid instanceof Array) && ($.inArray(allColumns[i].id, columnid)>-1)) {
					columns.splice(i,0,allColumns[i]);
				} else if (allColumns[i].id==columnid) {
					columns.splice(i,0,allColumns[i]);
					break
				}
			}
			setColumns(columns);
			updateFilterRow();
		}
		
		function hideColumns(cols) {
			saveColumns();    //save the columns once...
			var visibleColumns = [];
			for (var i=0; i<columns.length; i++) {
				if ($.inArray(columns[i].id, cols) == -1)
					visibleColumns.push(columns[i]);
			}
			setColumns(visibleColumns);
			updateFilterRow();
		}
								
		function showColumns(cols) {
			showColumn(cols);
		}

        function getOptions() {
            return options;
        }
		
		//Gets the current personalization info...
		function getGridPersonalizationInfo(callerInfo) {
			saveColumns();	//save the columns once...
			
			//get the current savable grid settings in an object to be serialized/saved
			personalizationInfo.caller=callerInfo;
			personalizationInfo.columnInfo = [];
			personalizationInfo.filterInResults = filterInResults;
			
			for(var i=0; i< allColumns.length; i++) {
				var col = allColumns[i];
				var index = getColumnIndex(col.id);
				var colWidth = col.width;
				
				//col index of <0 means not shown
				var colIndex = -1;
				if (index!=undefined) {
					colWidth = getColumns()[index].width;
					colIndex = index;
				}
				var columnInfo = {id:col.id , width: colWidth, columnIndex: colIndex };
				personalizationInfo.columnInfo.push(columnInfo);
			}
			//TODO: save the size of the comments popup? And save filter?
			return personalizationInfo;
		}
		
		function arraymove(arr, fromIndex, toIndex) {
			element = arr[fromIndex];
			arr.splice(fromIndex,1);
			arr.splice(toIndex,0,element);
		}
		
		//Restored the personalization (columns) to the ones initialized with (overriding cookies)
		function resetColumnLayout() {
			filterInResults = true;
			columns = defaultColumns;
			defaultColumns = $.extend(true, [], columns);
			setColumns(columns);
			processHiddenColumns();
			applyColumnWidths();
			updateFilterRow();
		}
		
		function processHiddenColumns() {
			for (var i=0; i< defaultColumns.length; i++) {
				var col = defaultColumns[i];
				if (col.hidden==true)
					hideColumn(col.id);
			}
		}
		
		//Sets the current personalization info back from an stored object
		function restorePersonalization(gridInfo) {
			//restore filterInResults
			filterInResults = gridInfo.filterInResults;
			
			//set the column sizes...
			var currentColumns = getColumns();
			for(var i=0; i< gridInfo.columnInfo.length; i++) {
				var colinfo = gridInfo.columnInfo[i];
				var targetCol = null,
					oldIndex = -1;
				
				//find the matching column in the columns collection...
				for(var j=0; j< currentColumns.length; j++) {
					if (currentColumns[j].id==colinfo.id) {
						targetCol = currentColumns[j];
						oldIndex = j;
						break;
					}
				}	
				
				if (targetCol==null)
					continue;
					
				targetCol.width = colinfo.width;
				arraymove(currentColumns,oldIndex,colinfo.columnIndex);
			}
			
			//set columns...
			setColumns(currentColumns);
			
			//hide hidden columns
			for(var i=0; i< gridInfo.columnInfo.length; i++) {
				var colinfo = gridInfo.columnInfo[i];
				if (colinfo.columnIndex==-1)
					hideColumn(colinfo.id);
			}
			
			//show columns hidden by default but shown by user
			for(var i=0; i< allColumns.length; i++) {
				var colinfo = allColumns[i];
				if (colinfo.hidden==true) {
					for(var j=0; j< gridInfo.columnInfo.length; j++) {
						var col = gridInfo.columnInfo[j];
						if (col.id==colinfo.id && col.columnIndex>=0) {
							showColumn(col.id);
							break;
						}
					}
				}
			}
			
			//set the sort order...
			if (gridInfo.sortColumnId) {
				setSortColumn(gridInfo.sortColumnId, gridInfo.sortAsc);
			}
			
			updateFilterRow();
		}
		
        function setOptions(args) {
            if (!getEditorLock().commitCurrentEdit()) {
                return;
            }

            makeActiveCellNormal();

            if (options.enableAddRow !== args.enableAddRow) {
                invalidateRow(getDataLength());
            }

            options = $.extend(options, args);

            render();
        }

        function setData(newData, scrollToTop) {
            data = newData;
			invalidateAllRows();
			updateRowCount();
            if (scrollToTop)
                scrollTo(0);
	    }
		
		/*
			Do a minimal refresh of the data contents..
		*/
		function updateData(data) {
			var gridDataObj = getData();
			gridDataObj.setItems([]); //Clear row cache
			
			gridDataObj.setItems(data); //Set the objects back in the dataview.. 
			updateRowCount();  //Notify the grid to update whats changed
			render(); //Call render to refresh including the hover events.
			
			var colid = personalizationInfo.sortColumnId;
			if (colid)
				setSortColumn(colid, personalizationInfo.sortAsc); //re-apply sort order
		}
		
		var loadedPages = [];
		
		function mergeData(newData, pageNum, totalRows) {
			$viewport.inforLoadingIndicator("close");	//hide loading indicator
			$viewport.css("overflow","auto");	//prevent scroll bar during load.
			
			//see if the page was loaded..Caching
			var cachePos = $.inArray( pageNum, loadedPages );
			if (cachePos>-1) {
				updateData(loadedPages[cachePos].dataset);
				getData().setPagingOptions({totalRows: totalRows, pageNum: pageNum});
				return;
			}
			
			loadedPages.push({pageNum:pageNum, datset: newData});
			if (options.pagingMode=="ContinuousScrolling") {
				var oldData = getData().getItems();
				var allData = oldData.concat(newData);
				updateData(allData);
			
				if (totalRows==undefined)
					totalRows = allData.length;
			}
			else {
				updateData(newData);
				
				if (totalRows==undefined)
					totalRows = newData.length;
			}
			
			var dataView = getData();
			dataView.setPagingOptions({totalRows: totalRows, pageNum: pageNum});
			dataView.onPagingInfoChanged.notify(dataView.getPagingInfo(), null, self);
			
			//scroll down...for better continuous scrolling.
			if (options.pagingMode=="ContinuousScrolling") {
				dataView.activeReq= false;	//let the next request go through
				scrollRowIntoView(totalRows*.80, false);
			}
		}
		
        function getData(commitEdits) {
			//Commit any pending edits...
			if (commitEdits)
				getEditorLock().commitCurrentEdit(); 
			
			return data;
		}
					
		/*
			Add a row to the bottom of the grid. 
			Revisit this later. When we know where we should add it.
		*/
		function addRow(newRow){
			if (newRow==undefined)
				newRow = { id: getData().getMaxId() + 1};	
				
			//add new indication..
			newRow.indicator = "new" ;
			
			getData().addItem(newRow);	
            updateRowCount();
			render();
			scrollRowIntoView(getDataLength(), false);
			trigger(self.onAddNewRow, { item: newRow });
		}
		
		function addRows(newRows, indicator){
			if (!newRows || newRows.length==0)
				return;
				
			//add new indication..
			var indicatorStr = (indicator ? "new" : "");
			var dataSet = getData(),
				items = dataSet.getItems();
			
			for (var i=0; i < newRows.length; i++) {
				newRows[i].indicator = indicatorStr ;
				//dataSet.addItem(newRows[i]);
				items.push(newRows[i]);
				trigger(self.onAddNewRow, { item: newRows[i] });
			}
			
			updateData(items);	
            updateRowCount();
			render();
			dataSet.reSort();
			
			//scroll to the last one we added.
			var idx = data.getRowIdx(newRows[newRows.length-1]);	
			scrollRowIntoView((idx == -1 ? 0 : idx), true);
		}
		
        //Remove all Selected Rows from the grid.
		function removeSelectedRows() {
            var gridDataObj = getData();
			var rowData = gridDataObj.getItems();
            
			var selRows = getSelectedRows();
			selRows.sort(function(a,b){return a - b});
            for (var i = (selRows.length - 1); i >= 0; i--) {
                rowData.splice(selRows[i], 1);
            }
			
			gridDataObj.setItems(rowData);
            //Calling .setData() forced the grid to re-render everything. 
			//By calling updateRowCount() you are notifying the grid the number of 
			//the rows have changed and that it needs to render what has been added or removed only. 
			//setData(gridDataObj);
            updateRowCount();
            render();
			
            // clear selected rows
            setSelectedRows({});
            $(".selector-checkbox-header").removeAttr('checked');
		}
		
		/* Since the rows are destroyed on a selection, the hover events need to be reattached each time */
		function attachHoverEvents() {
			$('.slick-row').mouseenter(function () {
				$(this).addClass('slick-row-hovered');
			});
			$('.slick-row').mouseleave(function () {
				$(this).removeClass('slick-row-hovered');
			});
		}
	
        function getDataLength() {
            if (data.getLength) {
                return data.getLength();
            }
            else {
                return data.length;
            }
        }

		function getSelectableLength() {
            var collection = null,
				selectable = 0;
				
			if (data.getLength) {
                collection = getFilteredData();
            }
            else {
                collection = data;
            }
			
			for (var i = 0; i < collection.length; i++) {
				if (canRowBeSelected(i))
					selectable++;
			}
			
			return selectable;
        }
		
        function getDataItem(i) {
            if (data.getItem) {
                return data.getItem(i);
            }
            else {
                return data[i];
            }
        }

        function getTopPanel() {
            return $topPanel[0];
        }

        function showTopPanel() {
            options.showTopPanel = true;
            $topPanelScroller.slideDown("fast", resizeCanvas);
        }

        function hideTopPanel() {
            options.showTopPanel = false;
            $topPanelScroller.slideUp("fast", resizeCanvas);
        }

        function showHeaderRowColumns(animate) {
            options.showHeaderRow = true;
			$headerRowScroller.show();
			resizeCanvas();
			createColumnHeaders();
			showFilterButton();
		}
		
		function showSummaryRowColumns(animate) {
            options.showSummaryRow = true;
            if (animate)
				$summaryRowScroller.slideDown("fast", resizeCanvas);
			else {
				$summaryRowScroller.show();
				resizeCanvas();
			}
		}
		
        function hideHeaderRowColumns(animate) {
            options.showHeaderRow = false;
		
			if ($filterMenuButton!=undefined)
				$filterMenuButton.hide();
			
			if (animate)
				$headerRowScroller.slideUp("fast", resizeCanvas);
			else {
				$headerRowScroller.hide();
				resizeCanvas();
			}
			$(".slick-header-columns").removeClass("filter-visible");
		}
		
		function hideSummaryRowColumns(animate) {
            options.showSummaryRow = false;
		
			if (animate)
				$summaryRowScroller.slideUp("fast", resizeCanvas);
			else {
				$summaryRowScroller.hide();
				resizeCanvas();
			}
		}

		function toggleFilterRow() {
			if (options.showHeaderRow == true)
				hideHeaderRowColumns(true);
			else {
				if (!options.showFilter) {
					options.showFilter = true;
					showFilterRow();
				}
				
				showHeaderRowColumns(true);
			}
		}
		
        //////////////////////////////////////////////////////////////////////////////////////////////
        // Rendering / Scrolling

        function scrollTo(y) {
            var oldOffset = offset;
			
            page = Math.min(n - 1, Math.floor(y / ph));
            offset = Math.round(page * cj);
            var newScrollTop = y - offset;

            if (offset != oldOffset) {
                var range = getVisibleRange(newScrollTop);
                cleanupRows(range.top, range.bottom);
                updateRowPositions();
            }

            if (prevScrollTop != newScrollTop) {
                scrollDir = (prevScrollTop + oldOffset < newScrollTop + offset) ? 1 : -1;
                $viewport[0].scrollTop = (lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop);

                trigger(self.onViewportChanged, {});
            }
        }

        function defaultFormatter(row, cell, value, columnDef, dataContext) {
            return (value === null || value === undefined) ? "" : value;
        }

        function getFormatter(row, column) {
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);

            // look up by id, then index
            var columnOverrides = rowMetadata &&
                    rowMetadata.columns &&
                    (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);

            return (columnOverrides && columnOverrides.formatter) ||
                    (rowMetadata && rowMetadata.formatter) ||
                    column.formatter ||
                    (options.formatterFactory && options.formatterFactory.getFormatter(column)) ||
                    defaultFormatter;
        }

        function getEditor(row, cell) {
            var column = columns[cell];
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            var columnMetadata = rowMetadata && rowMetadata.columns;

            if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
                return columnMetadata[column.id].editor;
            }
            if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
                return columnMetadata[cell].editor;
            }

            return column.editor || (options.editorFactory && options.editorFactory.getEditor(column));
        }

		function getDataItemValueForColumn(item, columnDef) {
		  if (options.dataItemColumnValueExtractor) {
			return options.dataItemColumnValueExtractor(item, columnDef);
		  }
		  return item[columnDef.field];
		}

        function appendRowHtml(stringArray, row) {
            var d = getDataItem(row);
			
            var dataLoading = row < getDataLength() && !d;
            var cellCss;
            var rowCss = "slick-row " +
                (dataLoading ? " loading" : "") +
                (row % 2 == 1 ? ' odd' : ' even') +
				($.inArray(row,selectedRows)>-1 ? " selected" : " ");
		  
            var metadata = data.getItemMetadata && data.getItemMetadata(row);
				
            if (metadata && metadata.cssClasses) {
                rowCss += " " + metadata.cssClasses;
            }
			stringArray.push("<div class='ui-widget-content " + rowCss + "' row='" + row + "' style='top:" + (options.rowHeight * row - offset) + "px'>");

            var colspan;
            var rowHasColumnData = metadata && metadata.columns;
			
            for (var i = 0, cols = columns.length; i < cols; i++) {
                var m = columns[i];
                colspan = getColspan(row, i); // TODO: don't calc unless we have to

                if (true || rowHasColumnData) {
                    cellCss = "slick-cell lr l" + i + " r" + Math.min(columns.length - 1, i + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
                }
                else {
                    cellCss = "slick-cell c" + i + (m.cssClass ? " " + m.cssClass : "");
                }

                if (row === activeRow && i === activeCell) {
                    cellCss += (" active");
                }

                // TODO: merge them together in the setter
				for (var key in cellCssClasses) {
                    if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
                        cellCss += (" " + cellCssClasses[key][row][m.id]);
                    }
                }

                stringArray.push("<div class='" + cellCss + "'>");

                // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
                if (d) {
                    stringArray.push(getFormatter(row, m)(row, i, getDataItemValueForColumn(d, m), m, d, getOptions(), self));
                }

                stringArray.push("</div>");

                if (colspan)
                    i += (colspan - 1);
            }

            stringArray.push("</div>");
        }

        function cleanupRows(rangeToKeep) {
            for (var i in rowsCache) {
                if (((i = parseInt(i, 10)) !== activeRow) && (i < rangeToKeep.top || i > rangeToKeep.bottom)) {
                    removeRowFromCache(i);
                }
            }
        }

        function invalidate() {
            updateRowCount();
            invalidateAllRows();
            render();
		}

        function invalidateAllRows() {
            if (currentEditor) {
                makeActiveCellNormal();
            }
            for (var row in rowsCache) {
                removeRowFromCache(row);
            }
        }

        function removeRowFromCache(row) {
            var node = rowsCache[row];
            if (!node) { return; }
            $canvas[0].removeChild(node);

            delete rowsCache[row];
            delete postProcessedRows[row];
            renderedRows--;
            counter_rows_removed++;
        }

        function invalidateRows(rows) {
            if (!rows || !rows.length) { return; }
            scrollDir = 0;
            for (var i = 0, rl = rows.length; i < rl; i++) {
                if (currentEditor && activeRow === rows[i]) {
                    makeActiveCellNormal();
                }

                if (rowsCache[rows[i]]) {
                    removeRowFromCache(rows[i]);
                }
            }
        }

        function invalidateRow(row) {
            invalidateRows([row]);
        }

        function updateCell(row, cell) {
            var cellNode = getCellNode(row, cell);
            if (!cellNode) {
                return;
            }

            var m = columns[cell], d = getDataItem(row);
            if (currentEditor && activeRow === row && activeCell === cell) {
                currentEditor.loadValue(d);
            }
            else {
                cellNode.innerHTML = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d, getOptions()) : "";
                invalidatePostProcessingResults(row);
            }
        }

        function updateRow(row) {
            if (!rowsCache[row]) { return; }

             var columnIndex = 0;
			 $(rowsCache[row]).children().each(function (i) {
               var m = columns[columnIndex], d = getDataItem(row);
                if (row === activeRow && i === activeCell && currentEditor) {
                    currentEditor.loadValue(getDataItem(activeRow));
                }
                else if (d) {
					this.innerHTML = getFormatter(row, m)(row, columnIndex, getDataItemValueForColumn(d, m), m, getDataItem(row), getOptions());
				}
                else {
                    this.innerHTML = "";
                }
				columnIndex += getColspan(row, i);
            });

            invalidatePostProcessingResults(row);
        }

        function getViewportHeight() {
            return parseFloat($.css($container[0], "height", true)) -
                (options.showColumnHeaders ? options.headerHeight : 0) -
                getVBoxDelta($headers) -
                (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) -
                (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0) -
                (options.showSummaryRow ? options.summaryRowHeight + getVBoxDelta($summaryRowScroller) : 0);
		 }
		
		function resizeCanvas() {
           
			if (options.fillHeight && !options.autoHeight) {
				//Find the top of the viewport and subtract that from the window height
				var offSet = $viewport.offset();
				
				if ($viewport.length==0)	//might be here unless the grid was not destroyed().
					return;
					
				var winHeight = $(window).height();	
				var newHeight = winHeight-offSet.top-2;
				
				//See whats below the grid...
				var nextElement = $viewport.parent().next(":visible").not(".inforMenu");
				if (nextElement.length>0)
				{
					newHeight -=  nextElement.height();
				}
				
                var topPane = $viewport.closest("#topPane");	//handle being in the top of a splitter
				if ($viewport.closest("#topPane").length>0){
					newHeight = topPane.height() - 26 - (options.showFilter ? 26 : 0)  - (options.showFooter ? 25 : 0) -4;	
				}
				
				if (options.showSummaryRow)
					newHeight -= options.summaryRowHeight;
				
				if ($pageFooter.length==1)	//account for space when there is a page footer.
					newHeight -= 27;
					
				$viewport.height(newHeight);
			}
			
			if (!initialized) { return; }
			var oldViewportH = $viewport.height();
			
			if (options.autoHeight || options.autoHeightToPageSize) {
				viewportH = options.rowHeight * ((options.autoHeight ? getDataLength() : getData().getPagingInfo().pageSize)
									+ (options.enableAddRow ? 1 : 0) + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0)) ;
				viewportH += 1;	//add one to prevent lookup scrollbar...
			} else {
                viewportH = getViewportHeight();
            }
			
			if (viewportH==1 && oldViewportH>1)	//Prevent quick shrink and reopen on paging (lookups).
				return;
				
            numVisibleRows = Math.ceil(viewportH / options.rowHeight);
            viewportW = parseFloat($.css($container[0], "width", true));
			$viewport.height(viewportH);
			
			if (options.forceFitColumns) {
				autosizeColumns();
				updateFilterRow();
			}
            
			updateRowCount();
			
			//adjust for scrollbar
			if (options.autoHeight || options.autoHeightToPageSize) {
				var hasScroll =  $viewport.get(0).scrollWidth > $viewport.width();
				if (hasScroll)
					$viewport.height($viewport.height()+($.browser.mozilla ? 9 : 17));
			}
			render();
		}

        function resizeAndRender() {
			if (options.forceFitColumns) {
                autosizeColumns();
            } else {
                resizeCanvas();
			}
        }

		function updateRowCount() {
			  if (!initialized) { return; }
				 
			  numberOfRows = getDataLength() +
				  (options.enableAddRow ? 1 : 0) +
				  (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);

			  var oldViewportHasVScroll = viewportHasVScroll;
			  // with autoHeight, we do not need to accommodate the vertical scroll bar
			  viewportHasVScroll = !options.autoHeight && !options.autoHeightToPageSize && (numberOfRows * options.rowHeight > viewportH);

			  // remove the rows that are now outside of the data range
			  // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
			  var l = options.enableAddRow ? getDataLength() : getDataLength() - 1;
			  for (var i in rowsCache) {
				if (i >= l) {
				  removeRowFromCache(i);
				}
			  }

			  var oldH = h;
			  th = Math.max(options.rowHeight * numberOfRows, viewportH - scrollbarDimensions.height);
			  if (th < maxSupportedCssHeight) {
				// just one page
				h = ph = th;
				n = 1;
				cj = 0;
			  } else {
				// break into pages
				h = maxSupportedCssHeight;
				ph = h / 100;
				n = Math.floor(th / ph);
				cj = (th - h) / (n - 1);
			  }

			  if (h !== oldH) {
				$canvas.css("height", h);
				scrollTop = $viewport[0].scrollTop;
			  }

			  var oldScrollTopInRange = (scrollTop + offset <= th - viewportH);

			  if (th == 0 || scrollTop == 0) {
				page = offset = 0;
			  } else if (oldScrollTopInRange) {
				// maintain virtual position
				scrollTo(scrollTop + offset);
			  } else {
				// scroll to bottom
				scrollTo(th - viewportH);
			  }

			  if (h != oldH && (options.autoHeight || options.autoHeightToPageSize)) {
				resizeCanvas();
			  }

			  if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
				autosizeColumns();
			  }
			  updateCanvasWidth(false);
		}

        function getVisibleRange(viewportTop) {
            if (viewportTop == null)
                viewportTop = scrollTop;

            return {
                top: Math.floor((scrollTop + offset) / options.rowHeight),
                bottom: Math.ceil((scrollTop + offset + viewportH) / options.rowHeight)
            };
        }
        
		function getRenderedRange(viewportTop) {
            var range = getVisibleRange(viewportTop);
            var buffer = Math.round(viewportH / options.rowHeight);
            var minBuffer = 3;

            if (scrollDir == -1) {
                range.top -= buffer;
                range.bottom += minBuffer;
            }
            else if (scrollDir == 1) {
                range.top -= minBuffer;
                range.bottom += buffer;
            }
            else {
                range.top -= minBuffer;
                range.bottom += minBuffer;
            }

            range.top = Math.max(0, range.top);
            range.bottom = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, range.bottom);

            return range;
        }

        function renderRows(range) {
            var parentNode = $canvas[0],
                rowsBefore = renderedRows,
                stringArray = [],
                rows = [],
                startTimestamp = new Date(),
                needToReselectCell = false;

            for (var i = range.top; i <= range.bottom; i++) {
                if (rowsCache[i]) { continue; }
                renderedRows++;
                rows.push(i);
                appendRowHtml(stringArray, i);
                if (activeCellNode && activeRow === i) {
                    needToReselectCell = true;
                }
                counter_rows_rendered++;
            }
			
            if (!rows.length) { return; }
			
			var x = document.createElement("div");
            x.innerHTML = stringArray.join("");

            for (var i = 0, l = x.childNodes.length; i < l; i++) {
                rowsCache[rows[i]] = parentNode.appendChild(x.firstChild);
            }

            if (needToReselectCell) {
                activeCellNode = getCellNode(activeRow, activeCell);
            }

            if (renderedRows - rowsBefore > 5) {
                avgRowRenderTime = (new Date() - startTimestamp) / (renderedRows - rowsBefore);
            }
        }

        function startPostProcessing() {
            if (!options.enableAsyncPostRender) { return; }
            clearTimeout(h_postrender);
            h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
        }

        function invalidatePostProcessingResults(row) {
            delete postProcessedRows[row];
            postProcessFromRow = Math.min(postProcessFromRow, row);
            postProcessToRow = Math.max(postProcessToRow, row);
            startPostProcessing();
        }

        function updateRowPositions() {
            for (var row in rowsCache) {
                rowsCache[row].style.top = (row * options.rowHeight - offset) + "px";
            }
        }

		function updateSummaryRow() {
			getData().refresh();
			
			var cols =getColumns();
			for (var i = 0; i < cols.length; i++) {
				if (cols[i].id !== "indicator-icon") {
					var header = getSummaryRowColumn(cols[i].id);
					
					if (!cols[i].summaryTotalFormatter)
						continue;
					
					var groups = getData().getGroups();
					if (groups.length>0) {
						var html = cols[i].summaryTotalFormatter(groups[0].totals,cols[i]);
						$(header).empty().html(html);
					}
				}
			}
		}
			
        function render() {
            if (!initialized) { return; }
			
			var visible = getVisibleRange();
            var rendered = getRenderedRange();

            // remove rows no longer in the viewport
            cleanupRows(rendered);

            // add new rows
            renderRows(rendered);

            postProcessFromRow = visible.top;
            postProcessToRow = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, visible.bottom);
            startPostProcessing();

            lastRenderedScrollTop = scrollTop;
            h_render = null;
			
			attachHoverEvents();
	    }

        function handleScroll() {
            scrollTop = $viewport[0].scrollTop;
            var scrollLeft = $viewport[0].scrollLeft;
			
            var scrollDist = Math.abs(scrollTop - prevScrollTop);

			if (scrollLeft !== prevScrollLeft) {
                prevScrollLeft = scrollLeft;

                $headerScroller[0].scrollLeft = scrollLeft;
                $topPanelScroller[0].scrollLeft = scrollLeft;
				$headerRowScroller[0].scrollLeft = scrollLeft;
				$summaryRowScroller[0].scrollLeft = scrollLeft;
			}

            if (scrollDist) {
                scrollDir = prevScrollTop < scrollTop ? 1 : -1;
                prevScrollTop = scrollTop;

                // switch virtual pages if needed
                if (scrollDist < viewportH) {
					 scrollTo(scrollTop + offset);
                }
                else {
                    var oldOffset = offset;
                    page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
                    offset = Math.round(page * cj);
                    if (oldOffset != offset)
                        invalidateAllRows();
                }

                if (h_render)
                    clearTimeout(h_render);

                if (Math.abs(lastRenderedScrollTop - scrollTop) < viewportH)
                    render();
                else
                    h_render = setTimeout(render, 50);

                trigger(self.onViewportChanged, {});
            }

            trigger(self.onScroll, { scrollLeft: scrollLeft, scrollTop: scrollTop });
        }

        function asyncPostProcessRows() {
            while (postProcessFromRow <= postProcessToRow) {
                var row = (scrollDir >= 0) ? postProcessFromRow++ : postProcessToRow--;
                var rowNode = rowsCache[row];
                if (!rowNode || postProcessedRows[row] || row >= getDataLength()) { continue; }

                var d = getDataItem(row), cellNodes = rowNode.childNodes;
                for (var i = 0, j = 0, l = columns.length; i < l; ++i) {
                    var m = columns[i];
                    if (m.asyncPostRender) { m.asyncPostRender(cellNodes[j], postProcessFromRow, d, m); }
                    ++j;
                }

                postProcessedRows[row] = true;
                h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
                return;
            }
        }

        function addCellCssStyles(key, hash) {
            if (cellCssClasses[key]) {
                throw "addCellCssStyles: cell CSS hash with key '" + key + "' already exists.";
            }

            cellCssClasses[key] = hash;

            var node;
            for (var row in rowsCache) {
                if (hash[row]) {
                    for (var columnId in hash[row]) {
                        node = getCellNode(row, getColumnIndex(columnId));
                        if (node) {
                            $(node).addClass(hash[row][columnId]);
							if (key==options.selectedCellCssClass)
								$(node).parent(".slick-row").addClass(key);
                        }
                    }
                }
            }
        }

        function removeCellCssStyles(key) {
            if (!cellCssClasses[key]) {
                return;
            }

            var node;
            for (var row in rowsCache) {
                if (cellCssClasses[key][row]) {
                    for (var columnId in cellCssClasses[key][row]) {
                        node = getCellNode(row, getColumnIndex(columnId));
                        if (node) {
                            $(node).removeClass(cellCssClasses[key][row][columnId]);
							if (key==options.selectedCellCssClass)
								$(node).parent(".slick-row").removeClass(key);
                        }
                    }
                }
            }

            delete cellCssClasses[key];
        }

        function setCellCssStyles(key, hash) {
            removeCellCssStyles(key);
            addCellCssStyles(key, hash);
	    }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Interactivity

        function handleDragInit(e, dd) {
			 var cell = getCellFromEvent(e);
            if (!cell || !cellExists(cell.row, cell.cell)) {
                return false;
            }

            retval = trigger(self.onDragInit, dd, e);
            if (e.isImmediatePropagationStopped()) {
                return retval;
            }

            // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
            // cancel out of it
            return false;
        }

        function handleDragStart(e, dd) {
            var cell = getCellFromEvent(e);
            if (!cell || !cellExists(cell.row, cell.cell)) {
                return false;
            }

            var retval = trigger(self.onDragStart, dd, e);
            if (e.isImmediatePropagationStopped()) {
                return retval;
            }

            return false;
        }

        function handleDrag(e, dd) {
            return trigger(self.onDrag, dd, e);
        }

        function handleDragEnd(e, dd) {
            trigger(self.onDragEnd, dd, e);
        }

        function handleKeyDown(e) {
            trigger(self.onKeyDown, {}, e);
            var handled = e.isImmediatePropagationStopped();
						
			if (!handled) {
                if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
                    if (e.which == 27) {
                        if (!getEditorLock().isActive()) {
                            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
                        }
                        cancelEditAndSetFocus();
                    }
                    else if (e.which == 37) {
                        navigateLeft();
                    }
                    else if (e.which == 39) {
                        navigateRight();
                    }
                    else if (e.which == 38) {
                        navigateUp();
                    }
                    else if (e.which == 40) {
                        navigateDown();
                    }
                    else if (e.which == 9) {	//tab right
                       navigateNext();
                    }
                    else if (e.which == 13) {
                        if (options.editable) {
                            if (currentEditor) {
                                // adding new row
                                if (activeRow === getDataLength()) {
                                    navigateDown();
                                }
                                else {
                                    commitEditAndSetFocus();
                                }
                            } else {
                                if (getEditorLock().commitCurrentEdit()) {
                                    makeActiveCellEditable();
                                }
                            }
                        }
                    }
                    else
                        return;
                }
                else if (e.which == 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
                    navigatePrev();
                }
                else
                    return;
            }

            // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
            e.stopPropagation();
            e.preventDefault();
            try {
                e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
            }
            catch (error) { } // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl" (hitting control key only, nothing else), "Shift" (maybe others)
        }

        function handleClick(e) {
			var cell = getCellFromEvent(e);
			
            if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
                return;
            }

            trigger(self.onClick, { row: cell.row, cell: cell.cell }, e);
            if (e.isImmediatePropagationStopped()) {
                return;
            }

            if (canCellBeActive(cell.row, cell.cell)) {
                if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
                    scrollRowIntoView(cell.row, false);
                    setActiveCellInternal(getCellNode(cell.row, cell.cell), (cell.row === getDataLength()) || options.autoEdit, true);
                }
            }
			
			//In non edit mode a click selects the row.
			if (options.editable==false)
			{
				if (getOptions().multiSelect) {
					//If ctrl is down add to the 
                    setSelectedRows([cell.row]);
                }
                else {
                   var empty = [];
                   setSelectedRows(empty.concat(cell.row));
                }
			}
        }

        function handleContextMenu(e) {
            var $cell = $(e.target).closest(".slick-cell", $canvas);
            if ($cell.length === 0) { return; }

            // are we editing this cell?
            if (activeCellNode === $cell[0] && currentEditor !== null) { return; }

            trigger(self.onContextMenu, {}, e);
        }

        function handleDblClick(e) {
            var cell = getCellFromEvent(e);
            if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
                return;
            }

            trigger(self.onDblClick, { row: cell.row, cell: cell.cell }, e);
            if (e.isImmediatePropagationStopped()) {
                return;
            }

            if (options.editable) {
                gotoCell(cell.row, cell.cell, true);
            }
        }

        function handleHeaderContextMenu(e) {
            var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var column = $header && columns[self.getColumnIndex($header.data("fieldId"))];
            trigger(self.onHeaderContextMenu, { column: column }, e);
        }

        function handleHeaderClick(e) {
            var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var column = $header && columns[self.getColumnIndex($header.data("fieldId"))];
			if (column) {
				trigger(self.onHeaderClick, { column: column }, e);
			}
        }

        function handleMouseEnter(e) {
            trigger(self.onMouseEnter, {}, e);
        }

        function handleMouseLeave(e) {
            trigger(self.onMouseLeave, {}, e);
        }

        function cellExists(row, cell) {
            return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
        }

        function getCellFromPoint(x, y) {
            var row = Math.floor((y + offset) / options.rowHeight);
            var cell = 0;

            var w = 0;
            for (var i = 0; i < columns.length && w < x; i++) {
                w += columns[i].width;
                cell++;
            }

            if (cell < 0) {
                cell = 0;
            }

            return { row: row, cell: cell - 1 };
        }

        function getCellFromNode(node) {
            // read column number from .l<columnNumber> CSS class
            var cls = /l\d+/.exec(node.className);
            if (!cls)
                throw "getCellFromNode: cannot get cell - " + node.className;
            return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
        }

        function getCellFromEvent(e) {
            var $cell = $(e.target).closest(".slick-cell", $canvas);
            if (!$cell.length)
                return null;

            return {
                row: $cell.parent().attr("row") | 0,
                cell: getCellFromNode($cell[0])
            };
        }

        function getCellNodeBox(row, cell) {
            if (!cellExists(row, cell))
                return null;

            var y1 = row * options.rowHeight - offset;
            var y2 = y1 + options.rowHeight - 1;
            var x1 = 0;
            for (var i = 0; i < cell; i++) {
                x1 += columns[i].width;
            }
            var x2 = x1 + columns[cell].width;

            return {
                top: y1,
                left: x1,
                bottom: y2,
                right: x2
            };
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Cell switching

        function resetActiveCell() {
            setActiveCellInternal(null, false);
        }

        function setFocus() {
            // IE tries to scroll the viewport so that the item being focused is aligned to the left border
            // IE-specific .setActive() sets the focus, but doesn't scroll
            if ($.browser.msie) {
                $canvas[0].setActive();
            }
            else {
                $canvas[0].focus();
            }
        }

        function scrollActiveCellIntoView() {
            if (activeCellNode) {
                var left = $(activeCellNode).position().left,
                    right = left + $(activeCellNode).outerWidth(),
                    scrollLeft = $viewport.scrollLeft(),
                    scrollRight = scrollLeft + $viewport.width();

                if (left < scrollLeft)
                    $viewport.scrollLeft(left);
                else if (right > scrollRight)
                    $viewport.scrollLeft(Math.min(left, right - $viewport[0].clientWidth));
            }
        }

        function setActiveCellInternal(newCell, editMode, isClick) {
		
            if (activeCellNode !== null) {
                makeActiveCellNormal();
                $(activeCellNode).removeClass("active");
            }

            var activeCellChanged = (activeCellNode !== newCell);
            activeCellNode = newCell;

            if (activeCellNode != null) {
                activeRow = parseInt($(activeCellNode).parent().attr("row"));
                activeCell = activePosX = getCellFromNode(activeCellNode);

                $(activeCellNode).addClass("active");

                if (options.editable && editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
                    clearTimeout(h_editorLoader);

                    if (options.asyncEditorLoading) {
                        h_editorLoader = setTimeout(function () { makeActiveCellEditable(); }, options.asyncEditorLoadDelay);
                    }
                    else {
                        makeActiveCellEditable(null, isClick);
                    }
                }
                else {
                    setFocus();
                }
            }
            else {
                activeRow = activeCell = null;
            }

            if (activeCellChanged) {
                scrollActiveCellIntoView();
                trigger(self.onActiveCellChanged, getActiveCell());
            }
        }

        function clearTextSelection() {
            if (document.selection && document.selection.empty) {
                document.selection.empty();
            }
            else if (window.getSelection) {
                var sel = window.getSelection();
                if (sel && sel.removeAllRanges) {
                    sel.removeAllRanges();
                }
            }
        }

        function isCellPotentiallyEditable(row, cell) {
            // is the data for this row loaded?
            if (row < getDataLength() && !getDataItem(row)) {
                return false;
            }

            // are we in the Add New row? can we create new from this cell?
            if (columns[cell].cannotTriggerInsert && row >= getDataLength()) {
                return false;
            }

            // does this cell have an editor?
            if (!getEditor(row, cell)) {
                return false;
            }
			
			// Handle expression based Non Editable Cells.
			var $activeCell = $(activeCellNode);
			if ($activeCell.children("div").hasClass("uneditable")) {
				return false;
			}
			
			return true;
        }

        function makeActiveCellNormal() {
            if (!currentEditor) { return; }
            trigger(self.onBeforeCellEditorDestroy, { editor: currentEditor });
            currentEditor.destroy();
            currentEditor = null;

            if (activeCellNode) {
                //error
				if ($(activeCellNode).hasClass("invalid")) {
                    var indicatorIcon = $(activeCellNode.parentNode).children(".status-indicator").children(".indicator-icon");
                    $(indicatorIcon).removeClass("error-icon");
					//remove errors on the trigger fields.
					$(activeCellNode).find("input").removeClass("error");
					$(activeCellNode).find(".inforTriggerButton").removeClass("error");
			    }
                $(activeCellNode).removeClass("editable invalid");
				
                 var d = getDataItem(activeRow);
				 if (d) {
                    var column = columns[activeCell],
						formatter = getFormatter(activeRow, column);
                    activeCellNode.innerHTML = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, getDataItem(activeRow), getOptions());
					invalidatePostProcessingResults(activeRow);
                }
            }

            // if there previously was text selected on a page (such as selected text in the edit cell just removed),
            // IE can't set focus to anything else correctly
            if ($.browser.msie) { clearTextSelection(); }

            getEditorLock().deactivate(editController);
        }

        function makeActiveCellEditable(editor, isClick) {
            if (!activeCellNode) { return; }
            if (!options.editable) {
                throw "Grid : makeActiveCellEditable : should never get called when options.editable is false";
            }

            // cancel pending async call if there is one
            clearTimeout(h_editorLoader);

            if (!isCellPotentiallyEditable(activeRow, activeCell)) {
                return;
            }

            var columnDef = columns[activeCell];
            var item = getDataItem(activeRow);

            if (trigger(self.onBeforeEditCell, { row: activeRow, cell: activeCell, item: item, column: columnDef }) === false) {
                setFocus();
                return;
            }

            getEditorLock().activate(editController);
            var $activeCell = $(activeCellNode);
			if ($activeCell.children("div").hasClass("uneditable")) {
				$activeCell.removeClass("editable");
			}
			$activeCell.addClass("editable");
			
            // don't clear the cell if a custom editor is passed through
            if (!editor) {
                activeCellNode.innerHTML = "";
            }

            currentEditor = new (editor || getEditor(activeRow, activeCell))({
                grid: self,
                gridPosition: absBox($container[0]),
                position: absBox(activeCellNode),
                container: activeCellNode,
                column: columnDef,
                item: item || {},
                commitChanges: commitEditAndSetFocus,
                cancelChanges: cancelEditAndSetFocus
            });

            if (item)
                currentEditor.loadValue(item, isClick);

            serializedEditorValue = currentEditor.serializeValue();

            if (currentEditor.position) {
                handleActiveCellPositionChange();
			}
        }

        function commitEditAndSetFocus() {
            // if the commit fails, it would do so due to a validation error
            // if so, do not steal the focus from the editor
            if (getEditorLock().commitCurrentEdit()) {
                setFocus();

                if (options.autoEdit) {
                    navigateDown();
                }
            }
        }

        function cancelEditAndSetFocus() {
            if (getEditorLock().cancelCurrentEdit()) {
                setFocus();
            }
        }

        function absBox(elem) {
            var box = { top: elem.offsetTop, left: elem.offsetLeft, bottom: 0, right: 0, width: $(elem).outerWidth(), height: $(elem).outerHeight(), visible: true };
            box.bottom = box.top + box.height;
            box.right = box.left + box.width;

            // walk up the tree
            var offsetParent = elem.offsetParent;
            while ((elem = elem.parentNode) != document.body) {
                if (box.visible && elem.scrollHeight != elem.offsetHeight && $(elem).css("overflowY") != "visible")
                    box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;

                if (box.visible && elem.scrollWidth != elem.offsetWidth && $(elem).css("overflowX") != "visible")
                    box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;

                box.left -= elem.scrollLeft;
                box.top -= elem.scrollTop;

                if (elem === offsetParent) {
                    box.left += elem.offsetLeft;
                    box.top += elem.offsetTop;
                    offsetParent = elem.offsetParent;
                }

                box.bottom = box.top + box.height;
                box.right = box.left + box.width;
            }

            return box;
        }

        function getActiveCellPosition() {
            return absBox(activeCellNode);
        }

        function getGridPosition() {
            return absBox($container[0])
        }

        function handleActiveCellPositionChange() {
            if (!activeCellNode) return;
            var cellBox;

            trigger(self.onActiveCellPositionChanged, {});

            if (currentEditor) {
                cellBox = cellBox || getActiveCellPosition();
                if (currentEditor.show && currentEditor.hide) {
                    if (!cellBox.visible)
                        currentEditor.hide();
                    else
                        currentEditor.show();
                }

                if (currentEditor.position)
                    currentEditor.position(cellBox);
            }
        }

        function getCellEditor() {
            return currentEditor;
        }

        function getActiveCell() {
            if (!activeCellNode)
                return null;
            else
                return { row: activeRow, cell: activeCell };
        }

        function getActiveCellNode() {
            return activeCellNode;
        }

        function scrollRowIntoView(row, doPaging) {
            var rowAtTop = row * options.rowHeight;
            var rowAtBottom = (row + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0);

            // need to page down?
            if ((row + 1) * options.rowHeight > scrollTop + viewportH + offset) {
                scrollTo(doPaging ? rowAtTop : rowAtBottom);
				render();
            }

            // or page up?
            else if (row * options.rowHeight < scrollTop + offset) {
                scrollTo(doPaging ? rowAtBottom : rowAtTop);
                render();
            }
        }

        function getColspan(row, cell) {
            var metadata = data.getItemMetadata && data.getItemMetadata(row);
            if (!metadata || !metadata.columns) {
                return 1;
            }

            var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
            var colspan = (columnData && columnData.colspan);
            if (colspan === "*") {
                colspan = columns.length - cell;
            }
            return (colspan || 1);
        }

        function findFirstFocusableCell(row) {
            var cell = 0;
            while (cell < columns.length) {
                if (canCellBeActive(row, cell)) {
                    return cell;
                }
                cell += getColspan(row, cell);
            }
            return null;
        }

        function findLastFocusableCell(row) {
            var cell = 0;
            var lastFocusableCell = null;
            while (cell < columns.length) {
                if (canCellBeActive(row, cell)) {
                    lastFocusableCell = cell;
                }
                cell += getColspan(row, cell);
            }
            return lastFocusableCell;
        }

        function gotoRight(row, cell, posX) {
            if (cell >= columns.length) {
                return null;
            }

            do {
                cell += getColspan(row, cell);
            }
            while (cell < columns.length && !canCellBeActive(row, cell));

            if (cell < columns.length) {
                return {
                    "row": row,
                    "cell": cell,
                    "posX": cell
                };
            }
            return null;
        }

        function gotoLeft(row, cell, posX) {
            if (cell <= 0) {
                return null;
            }

            var firstFocusableCell = findFirstFocusableCell(row);
            if (firstFocusableCell === null || firstFocusableCell >= cell) {
                return null;
            }

            var prev = {
                "row": row,
                "cell": firstFocusableCell,
                "posX": firstFocusableCell
            };
            var pos;
            while (true) {
                pos = gotoRight(prev.row, prev.cell, prev.posX);
                if (!pos) {
                    return null;
                }
                if (pos.cell >= cell) {
                    return prev;
                }
                prev = pos;
            }
        }

        function gotoDown(row, cell, posX) {
            var prevCell;
            while (true) {
                if (++row >= getDataLength() + (options.enableAddRow ? 1 : 0)) {
                    return null;
                }

                prevCell = cell = 0;
                while (cell <= posX) {
                    prevCell = cell;
                    cell += getColspan(row, cell);
                }

                if (canCellBeActive(row, prevCell)) {
                    return {
                        "row": row,
                        "cell": prevCell,
                        "posX": posX
                    };
                }
            }
        }

        function gotoUp(row, cell, posX) {
            var prevCell;
            while (true) {
                if (--row < 0) {
                    return null;
                }

                prevCell = cell = 0;
                while (cell <= posX) {
                    prevCell = cell;
                    cell += getColspan(row, cell);
                }

                if (canCellBeActive(row, prevCell)) {
                    return {
                        "row": row,
                        "cell": prevCell,
                        "posX": posX
                    };
                }
            }
        }

        function gotoNext(row, cell, posX) {
            var pos = gotoRight(row, cell, posX);
            if (pos) {
                return pos;
            }

            var firstFocusableCell = null;
            while (++row < getDataLength() + (options.enableAddRow ? 1 : 0)) {
                firstFocusableCell = findFirstFocusableCell(row);
                if (firstFocusableCell !== null) {
                    return {
                        "row": row,
                        "cell": firstFocusableCell,
                        "posX": firstFocusableCell
                    };
                }
            }
            return null;
        }

        function gotoPrev(row, cell, posX) {
            var pos;
            var lastSelectableCell;
            while (!pos) {
                pos = gotoLeft(row, cell, posX);
                if (pos) {
                    break;
                }
                if (--row < 0) {
                    return null;
                }

                cell = 0;
                lastSelectableCell = findLastFocusableCell(row);
                if (lastSelectableCell !== null) {
                    pos = {
                        "row": row,
                        "cell": lastSelectableCell,
                        "posX": lastSelectableCell
                    };
                }
            }
            return pos;
        }

        function navigateRight() {
            navigate("right");
        }

        function navigateLeft() {
            navigate("left");
        }

        function navigateDown() {
            navigate("down");
        }

        function navigateUp() {
            navigate("up");
        }

        function navigateNext() {
            navigate("next");
        }

        function navigatePrev() {
            navigate("prev");
        }

		function moveDown() {
			var selectedRows = getSelectedRows();
			
			var rowId = 0;
			if(selectedRows[0]!=undefined)
				rowId=selectedRows[0]+1;
			
			if (rowId>getDataLength()-1)
				return;
				
			scrollRowIntoView(rowId, true);
			setSelectedRows([rowId]);
		}
		
		function moveUp() {
			var selectedRows = getSelectedRows();
			
			var rowId = 0;
			if(selectedRows[0]!=undefined)
				rowId=selectedRows[0]-1;
			
			if (rowId<0)
				return;
			
			scrollRowIntoView(rowId, true);
			setSelectedRows([rowId]);
		}
		
        function navigate(dir) {
           if (options.editable==false && dir=="up" )
			{
				moveUp();
				return;
			}
			
			if (options.editable==false && dir=="down")
			{
				moveDown();
				return;
			}
			
			if (!activeCellNode || !options.enableCellNavigation) { return; }
            if (!getEditorLock().commitCurrentEdit()) { return; }

            var stepFunctions = {
                "up": gotoUp,
                "down": gotoDown,
                "left": gotoLeft,
                "right": gotoRight,
                "prev": gotoPrev,
                "next": gotoNext
            };
           
			var stepFn = stepFunctions[dir];
            var pos = stepFn(activeRow, activeCell, activePosX);
            if (pos) {
                var isAddNewRow = (pos.row == getDataLength());
                scrollRowIntoView(pos.row, !isAddNewRow);
				var cellNode = getCellNode(pos.row, pos.cell);
                setActiveCellInternal(cellNode, isAddNewRow || options.autoEdit);
				
                activePosX = pos.posX;
            }
        }
		
		function getCellNode(row, cell) {
            if (rowsCache[row]) {
                var cells = $(rowsCache[row]).children();
                var nodeCell;
                for (var i = 0; i < cells.length; i++) {
                    nodeCell = getCellFromNode(cells[i]);
                    if (nodeCell === cell) {
                        return cells[i];
                    }
                    else if (nodeCell > cell) {
                        return null;
                    }

                }
            }
            return null;
        }

        function setActiveCell(row, cell) {
            if (!initialized) { return; }
			
			if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
                return;
            }

            if (!options.enableCellNavigation) {
                return;
            }

            scrollRowIntoView(row, false);
            setActiveCellInternal(getCellNode(row, cell), false);
        }

        function canCellBeActive(row, cell) {
			 if (!options.enableCellNavigation || row >= getDataLength() + (options.enableAddRow ? 1 : 0) || row < 0 || cell >= columns.length || cell < 0) {
                return false;
            }

            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            if (rowMetadata && typeof rowMetadata.focusable === "boolean") {
                return rowMetadata.focusable;
            }

            var columnMetadata = rowMetadata && rowMetadata.columns;
            if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === "boolean") {
                return columnMetadata[columns[cell].id].focusable;
            }
            if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === "boolean") {
                return columnMetadata[cell].focusable;
            }

            if (typeof columns[cell].focusable === "boolean") {
                return columns[cell].focusable;
            }

            return true;
        }

		function canRowBeSelected(row) {
			var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
			if (rowMetadata && typeof rowMetadata.selectable === "boolean") 
				return rowMetadata.selectable;
			
			return true;
		} 

        function canCellBeSelected(row, cell) {
            if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
                return false;
            }

            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            if (rowMetadata && typeof rowMetadata.selectable === "boolean") {
                return rowMetadata.selectable;
            }

            var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
            if (columnMetadata && typeof columnMetadata.selectable === "boolean") {
                return columnMetadata.selectable;
            }

            if (typeof columns[cell].selectable === "boolean") {
                return columns[cell].selectable;
            }

            return true;
        }

        function gotoCell(row, cell, forceEdit) {
            if (!initialized) { return; }
			if (!canCellBeActive(row, cell)) {
                return;
            }

            if (!getEditorLock().commitCurrentEdit()) { return; }

            scrollRowIntoView(row, false);

            var newCell = getCellNode(row, cell);

            // if selecting the 'add new' row, start editing right away
            setActiveCellInternal(newCell, forceEdit || (row === getDataLength()) || options.autoEdit);

            // if no editor was created, set the focus back on the grid
            if (!currentEditor) {
                setFocus();
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        // IEditor implementation for the editor lock

        function commitCurrentEdit() {
            var item = getDataItem(activeRow);
            var column = columns[activeCell];

            if (currentEditor) {
                //Was formerly 
				//if (currentEditor.isValueChanged()) {
					var validationResults = currentEditor.validate();
					if (validationResults.valid) {
						if (currentEditor.isValueChanged()) {
							if (activeRow < getDataLength()) {
								var editCommand = {
									row: activeRow,
									cell: activeCell,
									editor: currentEditor,
									serializedValue: currentEditor.serializeValue(),
									prevSerializedValue: serializedEditorValue,
									execute: function () {
										this.editor.applyValue(item, this.serializedValue);
										updateRow(this.row);
									},
									undo: function () {
										this.editor.applyValue(item, this.prevSerializedValue);
										updateRow(this.row);
									}
								};

								if (options.editCommandHandler) {
									makeActiveCellNormal();
									options.editCommandHandler(item, column, editCommand);
								}
								else {
									editCommand.execute();
									makeActiveCellNormal();
								}

								trigger(self.onCellChange, {
									row: activeRow,
									cell: activeCell,
									item: item
								});
							}
							else {
								var newItem = {};
								currentEditor.applyValue(newItem, currentEditor.serializeValue());
								makeActiveCellNormal();
								trigger(self.onAddNewRow, { item: newItem, column: column });
							}

							// check whether the lock has been re-acquired by event handlers
							return !getEditorLock().isActive();
						}
					}
					else {
							//set errors on the trigger fields.
							$(activeCellNode).find("input").addClass("error");
							$(activeCellNode).find(".inforTriggerButton").addClass("error");
							
							trigger(self.onValidationError, {
								editor: currentEditor,
								cellNode: activeCellNode,
								validationResults: validationResults,
								row: activeRow,
								cell: activeCell,
								column: column
							});

							currentEditor.focus();
							return false;
						}
					makeActiveCellNormal();
				//}
			}
			return true;
        }

        function cancelCurrentEdit() {
            makeActiveCellNormal();
            return true;
        }

        function rowsToRanges(rows) {
            var ranges = [];
            var lastCell = columns.length - 1;
            for (var i = 0; i < rows.length; i++) {
                ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
            }
            return ranges;
        }

        function getSelectedRows() {
            return selectedRows;
        }
		
        function setSelectedRows(rows) {
            selectionModel.setSelectedRanges(rowsToRanges(rows));
		}

		function selectAllRows() {
            var rows = [];
			for (var i = 0; i < getDataLength(); i++) {
				rows.push(i);
			}
			setSelectedRows(rows);
		}
					
		 //////////////////////////////////////////////////////////////////////////////////////////////
        // Filtering
		
		/* Update the Header For Filtering. */
		function updateFilterRow() {
			if (!options.showHeaderRow)
				return;
					
			for (var i = 0; i < columns.length; i++) {
			
				//ignore these columns:
				if ($.inArray(columns[i].id, ['selector', 'indicator-icon', '_checkbox_selector', 'drilldown'])>= 0) {
					//do something
					continue;
				}
				
				if (columns[i].filterType==undefined)
					continue;
					
				var filterType = columns[i].filterType();
				
				switch(filterType)
				{
				case "TextFilter":
				    addTextFilterColumn(self,columns[i]);
				    break;
				case "DateFilter":
				    addDateFilterColumn(self,columns[i]);
				    break;
				case "SelectFilter":
					addSelectFilterColumn(self,columns[i]);
				   break;
				case "IntegerFilter":
					addIntegerFilterColumn(self,columns[i],false);
				    break;
				case "DecimalFilter":
					addIntegerFilterColumn(self,columns[i],true);
				    break;
				case "CheckboxFilter":
					addCheckboxFilterColumn(self,columns[i]);
					break;
				case "ColumnContentsFilter":
					addColumnContentsFilterColumn(self,columns[i]);
					break;
				default:
				  continue;
				}
			}
		}
	
		/*Append/move the filter button on the page*/
		function showFilterButton() {
			if ($filterMenuButton==undefined)
			{	
				$filterMenuButton = $("<button type='button' class='inforFilterMenuButton' title='"+Globalize.localize("FilterMenu")+"'></button>");
				if (Globalize.culture().isRTL)
					$filterMenuButton.addClass("inforRTLFlip");
				
				$container.prepend($filterMenuButton);
				appendFilterMenu();
				
				var leftOffset = -20;
				
				if (Globalize.culture().isRTL)
					 leftOffset = 5;
					 
				$filterMenuButton.inforContextMenu({
					menu: 'gridFilterMenu',
					invokeMethod: 'toggle',
					positionBelowElement: true,
					offsetLeft: leftOffset,
					offsetTop: -4,
					beforeOpening: setMenuChecked
				},
					function(action, el, pos, item) {
						if (action=="rf")
							applyFilter();
							
						if (action=="fwr")
							toggleFilterResults();
							
						if (action=="cf")
							clearFilter();
							
						if (action=="sf")
							savedFilters();
				});
			}
			
			//might be hidden if user selected the menu option...
			$filterMenuButton.show();
		}
		
		function savedFilters() {
			//not yet implemented : http://jira.infor.com/browse/HFC-110
		}
		
		function toggleFilterResults() {
			filterInResults = !filterInResults;
			personalizationInfo.filterInResults = filterInResults;
			trigger(self.onPersonalizationChanged, getGridPersonalizationInfo('FilterInResults'));
		}
		
		function applyFilter(initialColumnFilters) {
			var isSupplied = false;
			
			if (isFiltering)
				return;
			
			columnFilters = {};
			
			if (initialColumnFilters!=undefined) {
				columnFilters=initialColumnFilters;
				isSupplied = true;
			}
			
			isFiltering = true;
			
			//loop through all the filter rows and update all filter values..
			for (var i = 0; i < columns.length; i++) {
				if (columns[i].filterType==undefined)
					continue;
				
				var columnId = columns[i].id;
				var $headerCol = $(getHeaderRowColumn(columnId));
				var filterType = columns[i].filterType();
				
				if ($headerCol.length==0)
					continue;
				
				var op = $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ","");
				var value = $headerCol.find("input").val();
						
				switch(filterType) {
					case "TextFilter":
						if (value!="" || op=="isEmpty" || op=="isNotEmpty") {
							var newObj = {value: value, 
										  operator: $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ",""),
										  filterType: TextFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "DateFilter":
					    if (value!="" || op=="isEmpty" || op=="isNotEmpty") {
							var newObj = {value: value, 
										  operator: $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ",""),
										  filterType: DateFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "SelectFilter":
						if ($.trim(value)!="" || op=="isEmpty" || op=="isNotEmpty") {
							var select = $headerCol.find("select");
							var newObj = {value: (select.data("useCodes") ? select.getCode() : select.getValue()) , 
										  operator: $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ",""),
										  filterType: SelectFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "IntegerFilter":
						if (value!="" || op=="isEmpty" || op=="isNotEmpty") {
							var newObj = {value: value, 
										  operator: $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ",""),
										  filterType: IntegerFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "DecimalFilter":
						if (value!="" || op=="isEmpty" || op=="isNotEmpty") {
							var newObj = {value: value, 
										  operator: $headerCol.find(".inforFilterButton").attr("class").replace("inforFilterButton ",""),
										  filterType: DecimalFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "DateFilter":
						break;
					case "CheckboxFilter":
						if (op!="eitherSelectedorNotSelected") {
							var newObj = {value: null, 
										  operator: op,
										  filterType: CheckboxFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					case "ColumnContentsFilter":
						var selections = $headerCol.find(".inforFilterButton").data("selections");
						
						if (selections!=undefined) {
							var newObj = {value: selections, 
										  operator: op,
										  filterType: ColumnContentsFilter()};
							columnFilters[columnId] = newObj;
						}
						break;
					default:
				}
			}			  
			
			dataView.setPagingOptions({filters: columnFilters});
			//set the state of the grid and fire the events
			dataView.setPagingOptions({sortColumnId: personalizationInfo.sortColumnId});
			
			if (!filterInResults) {
				dataView.requestNewPage("filter");
			}	
			
			if (isSupplied) {
				//set all the filter text
				for (columnId in columnFilters) {
					var $header = $(getHeaderRowColumn(columnId)),
						filterExpr = columnFilters[columnId],
						$filterButton = $header.find(".inforFilterButton")
						
					$header.find("input").val(filterExpr.value);
					$filterButton.attr("class","inforFilterButton").addClass(filterExpr.operator);
					
					if (filterExpr.filterType=="ColumnContentsFilter") {
						$filterButton.data("selections",filterExpr.value);
					}
				}
			}
			dataView.refresh();
			isFiltering = false;
			//scroll to top
			scrollRowIntoView(0, false);
			setSelectedRows([]);
		}
		
		function clearFilter() {
			//clear text filters..
			$headerRow.find("input").val("");
			
			//clear the checkbox and othe rtypes of filters
			$headerRow.find(".inforFilterButton").each(function(){
				var $this = $(this);
				$this.removeClass();
				if ($this.data("filterType")==CheckboxFilter())
					$this.addClass('inforFilterButton eitherSelectedorNotSelected');
				
				if ($this.data("filterType")==TextFilter())
					$this.addClass('inforFilterButton contains');
				
				if ($this.data("filterType")==SelectFilter())
					$this.addClass('inforFilterButton equals');
					
				if ($this.data("filterType")==DateFilter())
					$this.addClass('inforFilterButton equals');
				
				if ($this.data("filterType")==IntegerFilter())
					$this.addClass('inforFilterButton equals');
					
				if ($this.data("filterType")==DecimalFilter())
					$this.addClass('inforFilterButton equals');
				
				if ($this.data("filterType")==ColumnContentsFilter())
				{
					$this.addClass('inforFilterButton contains');
					$this.data("selections",null);
				}
			});
			
			//clear the filter operators
			columnFilters = {};
			dataView.refresh();
		}
		
		var currentButton = "";
		
		/*Return a filter button with events for the filter based on column type*/
		function getFilterButton(columnId, filterType, initialValue, initialToolTip) {
		
			var button = $("<button type='button' class='inforFilterButton "+initialValue+"'>");
			button.data("columnId", columnId);
			button.data("filterType", filterType);
			button.data("isOpen", false);
			//set the initial tooltip
			button.attr("title",Globalize.localize(initialToolTip));
			button.click(function(e) {
					var $button = $(this),
						currentMenu = $('#gridFilterMenuOptionsContainer');
					
					if (currentMenu.is(":visible")) {
						var isSameMenu = currentButton == button.data("columnId");
						if (isSameMenu) 
							return;
					}
					
					$("#gridFilterMenuOptionsContainer").remove();
					
					currentButton = button.data("columnId");
					
					//different menus for each filter option
					var filterType = $(this).data("filterType");
					
					if (filterType=="TextFilter")
						$('body').append('<ul id="gridFilterMenuOptions" class="inforContextMenu"><li class="equals"><a href="#equals">Equals</a></li><li class="doesNotEqual"><a href="#doesNotEqual">Does Not equal</a></li><li class="contains"><a href="#contains">Contains</a></li><li class="doesNotContain"><a href="#doesNotContain">Does Not Contain</a></li><li class="isEmpty"><a href="#isEmpty">Is Empty</a></li><li class="isNotEmpty"><a href="#isNotEmpty">Is Not Empty</a></li><li class="startsWith"><a href="#startsWith">Starts With</a></li><li class="doesNotStartWith"><a href="#doesNotStartWith">Does Not Start With</a></li><li class="endsWith"><a href="#endsWith">Ends With</a></li><li class="doesNotEndWith"><a href="#doesNotEndWith">Does Not End With</a></li></ul>');
					
					if (filterType=="SelectFilter")
						$('body').append('<ul id="gridFilterMenuOptions" class="inforContextMenu"><li class="equals"><a href="#equals">Equals</a></li><li class="doesNotEqual"><a href="#doesNotEqual">Does Not equal</a></li><li class="isEmpty"><a href="#isEmpty">Is Empty</a></li><li class="isNotEmpty"><a href="#isNotEmpty">Is Not Empty</a></li></ul>');
					
					if (filterType=="CheckboxFilter")
						$('body').append('<ul id="gridFilterMenuOptions" class="inforContextMenu"><li class="eitherSelectedorNotSelected"><a href="#eitherSelectedorNotSelected">Either Selected or Not Selected</a></li><li class="checked"><a href="#selected">Selected</a></li><li class="notChecked"><a href="#notSelected">Not Selected</a></li></ul>');
					
					if (filterType=="DateFilter")
						$('body').append('<ul id="gridFilterMenuOptions" class="inforContextMenu"><li class="today"><a href="#today">Today</a></li><li class="equals"><a href="#equals">Equals</a></li><li class="doesNotEqual"><a href="#doesNotEqual">Does Not equal</a></li><li class="isEmpty"><a href="#isEmpty">Is Empty</a></li><li class="isNotEmpty"><a href="#isNotEmpty">Is Not Empty</a></li><li class="lessThan"><a href="#lessThan">Less Than</a></li><li class="lessThanOrEquals"><a href="#lessThanOrEquals">Less Than or Equals</a></li><li class="greaterThan"><a href="#greaterThan">Greater Than</a></li><li class="greaterThanOrEquals"><a href="#greaterThanOrEquals">Greater Than or Equals</a></li></ul>');
					
					if (filterType=="IntegerFilter" || filterType=="DecimalFilter")
						$('body').append('<ul id="gridFilterMenuOptions" class="inforContextMenu"><li class="equals"><a href="#equals">Equals</a></li><li class="doesNotEqual"><a href="#doesNotEqual">Does Not equal</a></li><li class="isEmpty"><a href="#isEmpty">Is Empty</a></li><li class="isNotEmpty"><a href="#isNotEmpty">Is Not Empty</a></li><li class="lessThan"><a href="#lessThan">Less Than</a></li><li class="lessThanOrEquals"><a href="#lessThanOrEquals">Less Than or Equals</a></li><li class="greaterThan"><a href="#greaterThan">Greater Than</a></li><li class="greaterThanOrEquals"><a href="#greaterThanOrEquals">Greater Than or Equals</a></li></ul>');
				
					if (filterType=="ColumnContentsFilter")
					{
						var col = columns[getColumnIndex(columnId)],
							isEmpty = addContentsFilterMenu(col.field, button, col.filterFormatter, col.contentsFilterValues);
						if (isEmpty)
							return;
					}
					
					$button.inforContextMenu({
						menu: 'gridFilterMenuOptions',
						invokeMethod: 'immediate',
						event: e,
						srcElement: $button,
						positionBelowElement: true,
						offsetLeft: -3,
						offsetTop: 2
					}, function(action, el, pos, item) {
						
						if (el.data("filterType")=="ColumnContentsFilter")
							return;
						
						var isChanged=!el.hasClass(action);
						
						//toggle the button icon..
						el.removeClass();
						el.addClass('inforFilterButton '+action);
						
						//set the tooltip
						el.attr("title",item.html());
						$('#gridFilterMenuOptions').remove();
						
						//apply filter...
						if (el.data("filterType")=="CheckboxFilter" && isChanged)
							applyFilter();
						
						if (action=="isNotEmpty" || action=="isEmpty")
							applyFilter();
						
						if (action=="today")
							$.datepicker.selectToday(el.next());
					});	
			});
			
			return button;
		}
		
		//scan the column for distinct values and add them to the list with a checkbox..and manage saving values to data.
		function addContentsFilterMenu(field, button, formatter, suppliedValues) {
			var html = '<ul id="gridFilterMenuOptions" class="inforContextMenu">';
			var data = getData().getItems();
			var distinctValues = [];
			
			if (data.length==0)
				return true;
			
			if (suppliedValues) {
				for (i = 0; i < suppliedValues.length; i++) {
					if ((jQuery.inArray(suppliedValues[i], distinctValues)==-1) && suppliedValues[i]!=undefined && suppliedValues[i]!="")
						distinctValues.push(suppliedValues[i]);
				}
			} else {
				for (i = 0; i < data.length; i++) {
					if ((jQuery.inArray(data[i][field], distinctValues)==-1) && data[i][field]!=undefined && data[i][field]!="")
						distinctValues.push(data[i][field]);
				}
			}
			
			if (distinctValues.length==0)
				return true;
			
			var prevSelections = button.data("selections");
				
			for (i = 0; i < distinctValues.length; i++) {
				var isChecked = true;
				//check previous selections and retick
				if (prevSelections!=undefined)
				{
					for (j = 0; j < prevSelections.length; j++) {
						if (distinctValues[i]==prevSelections[j].id)
							isChecked=prevSelections[j].isChecked;
					}
				}
				//allow a function to be injected to format the value...
				var newHtml = '<li class="checkbox"><a href="#"><div class="inforCheckbox "><span '+(isChecked ? 'class="checked"' : '')+'><input type="checkbox" class="inforCheckbox" '+(isChecked ? 'checked="checked"' : '')+'style="filter: alpha(opacity = 0);opacity:0;margin:0;padding:0" id="'+distinctValues[i]+'"/></span></div><label class="inforCheckboxLabel" for="'+distinctValues[i]+'">'+distinctValues[i]+'</label></a></li>';
				if (formatter!=undefined)
					html = html+ formatter(newHtml,distinctValues[i]);
				else
					html = html+newHtml;
			}
			
			html = html+'</ul>';
			
			//reset the selections...
			if (prevSelections==undefined)
			{
				var selections = [];
				for (i = 0; i < distinctValues.length; i++) {
					selections.push({id: distinctValues[i], isChecked: true});
				}
				button.data("selections", selections);
			}
			
			$('body').append(html);
				
			$("#gridFilterMenuOptions").find(".inforCheckbox").click(function(e) {
				var $this = $(this),
					isChecked = this.checked;
				
				if (isChecked){
					$this.parent("span").addClass("checked");
				}
				else{
					$this.parent("span").removeClass("checked");
				}
				
				//update the selections.
				var selections = button.data("selections");
				var found=false;
				for (var i = 0; i < selections.length; i++) {
					if (selections[i].id==$this.attr("id"))
					{
						selections[i].isChecked=isChecked;
						found=true;
					}
				}
				
				//check for any new elements not in the previous list and add them.
				if (!found)
					selections.push({id: $this.attr("id"), isChecked: isChecked});

				button.data("selections", selections);
				//apply filter...
				applyFilter();
				e.stopPropagation();	//do this if you do not want the click on the checkbox to close the menu
			});
			
			return false;
		}
		
		/* Adds a checkbox Filter to the grid column */
		function addCheckboxFilterColumn(gridObj, column) {
			var header = gridObj.getHeaderRowColumn(column.id);
			//save last value
			var filterButton = $(header).find(".inforFilterButton")
			var lastFilterValue =""
			if (filterButton.length>0)
				lastFilterValue = filterButton.attr("class").replace("inforFilterButton ","");
			
			$(header).empty();
			//add the button
			var $button = getFilterButton(column.id,  CheckboxFilter(), "eitherSelectedorNotSelected", "EitherSelectedorNotSelected");
			
			$(header).css("text-align","center");
			if ($.browser.mozilla)	//slight adjustment for firefox.
				$button.css({top:'2px',left:'0px'})
			else if ($.browser.msie)
				$button.css({left:'0px'})
			else
				$button.css({top:'4px',left:'0px'})
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
			
			$button.css({"float":"none"});
			
			$(header).append($button);
		}
		
		/* Adds a ColumnContents to the grid column */
		function addColumnContentsFilterColumn(gridObj, column) {
			var header = gridObj.getHeaderRowColumn(column.id);
			//save last value
			var filterButton = $(header).find(".inforFilterButton")
			var lastFilterValue =""
			if (filterButton.length>0)
				lastFilterValue = filterButton.attr("class").replace("inforFilterButton ","");
			
			$(header).empty();
			//add the button
			var $button = getFilterButton(column.id,  ColumnContentsFilter(), "contains", "SelectContents");
			
			$(header).css("text-align","center");
			if ($.browser.mozilla)	//slight adjustment for firefox.
				$button.css({top:'2px',left:'0px'})
			else if ($.browser.msie)
				$button.css({left:'0px'})
			else
				$button.css({top:'4px'})
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
			
			$button.css({"float":"none"});
			
			$(header).append($button);
		}
		
		/* Adds a text Filter to the grid column */
		function addTextFilterColumn(gridObj, column) {
			var header = gridObj.getHeaderRowColumn(column.id),
				lastFilterValue ="",	//save last value
				lastValue = $(header).find(".inforTextbox").val();
			
			$(header).empty();
			
			var inputWidth = $(header).width() - 4 - 18;	//column width - margin - button size
			
			var input = $("<input class='inforTextbox' type='text'>")
				.data("columnId", column.id)
				.data("filterType", TextFilter())
				.width(inputWidth)	
				.val(lastValue)
				.appendTo(header)
				.keypress(function(event) {
					if (event.which == $.ui.keyCode.ENTER)	//Run the filter...
					{	
						gridObj.applyFilter();
						event.preventDefault();
						event.stopPropagation();
						$(this).focus();
					}
				});
				
			var $button = getFilterButton(column.id, TextFilter(), "contains", "Contains");
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
				
			input.before($button);
		}
		
		function addSelectFilterColumn(gridObj, column) {
			var header = gridObj.getHeaderRowColumn(column.id),
				lastFilterValue ="",	//save last value
				lastValue = $(header).find(".inforTextbox").val();
			
			$(header).empty();
			
			var inputWidth = $(header).width() - 4 - 18 - 12;	//column width - margin - button size - trigger button size.
			var option_str = "",
				useCodes = false;
				
			for (i in column.options) {
				v = column.options[i];
				if (v.value!=undefined && v.label!=undefined) {
					option_str += "<OPTION value='" + v.value + "' " +">" + v.label + "</OPTION>";
					useCodes = true;
				} else
					option_str += "<OPTION value='" + v + "' "+ ">" + v + "</OPTION>";
			} 
			
			var input = $("<select class='inforDropDownList'>"+option_str+"</select>")
				.data("columnId", column.id)
				.data("filterType", SelectFilter())
				.data("useCodes", useCodes)
				.width(inputWidth)	
				.val(lastValue)
				.appendTo(header)
				.inforDropDownList(column.editorOptions)
				.change(function(event) {
					gridObj.applyFilter();
					event.preventDefault();
					event.stopPropagation();
					$(this).focus();
				});
				
			var $button = getFilterButton(column.id, SelectFilter(), "equals", "equals");
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
				
			input.before($button);
		}
		
		function addIntegerFilterColumn(gridObj, column, isDecimal) {
			var header = gridObj.getHeaderRowColumn(column.id);
			
			//save last value
			var filterButton = $(header).find(".inforFilterButton")
			var lastFilterValue =""
			if (filterButton.length>0)
				lastFilterValue = filterButton.attr("class").replace("inforFilterButton ","");
			
			var lastValue = $(header).find(".inforTextbox").val();
			
			$(header).empty();
			
			var filterType = (isDecimal ?  DecimalFilter() :  IntegerFilter());
			
			var input = $("<input class='inforTextbox alignRight' type='text'>")
				.data("columnId", column.id)
				.data("filterType", filterType)
				.width($(header).width() - 4 - 18)
				.val(lastValue)
				.appendTo(header)
				.numericOnly(isDecimal)
				.keypress(function(event) {
					if (event.which == $.ui.keyCode.ENTER)	//Run the filter...
					{	
						gridObj.applyFilter();
						event.preventDefault();
						event.stopPropagation();
						$(this).focus();
					}
				});
			
			var $button = getFilterButton(column.id, filterType, "equals" , "EqualsStr");
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
				
			input.before($button);
		}
	
		/* Adds a date Filter to the grid column */
		function addDateFilterColumn(gridObj, column) {
			var header = gridObj.getHeaderRowColumn(column.id);
			
			//save last value
			var filterButton = $(header).find(".inforFilterButton")
			var lastFilterValue =""
			if (filterButton.length>0)
				lastFilterValue = filterButton.attr("class").replace("inforFilterButton ","");
			
			var lastValue = $(header).find(".inforDateField").val();
			$(header).empty();
			
			var input = $("<input class='inforDateField' type='text'>")
				.data("columnId", column.id)
				.data("filterType", DateFilter())
				.val(lastValue)
				.appendTo(header)
				.inforDateField({dateFormat: column.DateShowFormat })
				.keypress(function(event) {
					if (event.which == $.ui.keyCode.ENTER)	//Run the filter...
					{	
						gridObj.applyFilter();
						event.preventDefault();
						event.stopPropagation();
						$(this).focus();
					}
				});
				
			input.parent().width($(header).width() - 4 - 18 - 10 + 20);	//4 pixel padding / width of the button
			input.width($(header).width() - 4 - 18 - 10);	//4 pixel padding / width of the button
			var $button = getFilterButton(column.id, DateFilter(), "equals", "Equals");
			
			$button.css({"float":(!Globalize.culture().isRTL ? "left" : "right"), "top":"4px"});
			input.closest(".inforTriggerField").css("margin-top","0");
			
			if (lastFilterValue!="")//restore last value
				$button.removeAttr("class").addClass("inforFilterButton "+lastFilterValue);
			
			input.before($button);
		
			//fixes a strange alignment issue in crome.
			//input.focus();
		}
		
		/* Add the Filter Bar */
		function showFilterRow() {
		
			if (!options.showFilter)
			{
				//remove the filter row and bail out.
				hideHeaderRowColumns();
				$(".slick-header-columns").removeClass("filter-visible");
				return;
			}
			
			showHeaderRowColumns(true);
			$(".slick-header-columns").addClass("filter-visible");
		  
			updateFilterRow();
			
			//set initial styling..
			if ($(getHeaderRow()).is(":visible")) {
				$(".slick-header-columns").addClass("filter-visible");
			}
			else {
				$(".slick-header-columns").removeClass("filter-visible");
			}
			
			showFilterButton();
		}
		
		function filterTextValue(colValue, filterValue, operator) {
			if (colValue==undefined)
				colValue="";
				
			colValue= colValue.toString().toLowerCase();
			filterValue = filterValue.toLowerCase();
			var pattern = filterValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
				filterRegx = new RegExp(pattern, "i");
		
			switch(operator)
				{
				case "equals":
					if (colValue!=filterValue && filterValue!="")
						return false;
					break;
				case "doesNotEqual":
					if (colValue==filterValue && filterValue!="")
						return false;
					break;
				case "contains":
					if (colValue.search(filterRegx)<0 && filterValue!="")
						return false;
					break;
				case "doesNotContain":
					if (colValue.search(filterRegx)>=0 && filterValue!="")
						return false;
					break;
				case "isEmpty":
					if (colValue!="" && colValue!=undefined)
						return false;
					break;
				case "isNotEmpty":
					if (colValue=="" || colValue==undefined && filterValue!="")
						return false;
					break;
				case "startsWith":
					if (colValue.search(filterRegx)!=0 && filterValue!="")
						return false;
					break;
				case "doesNotStartWith":
					if (colValue.search(filterRegx)==0 && filterValue!="")
						return false;
					break;	
				case "endsWith":
					if (!colValue.endsWith(filterRegx) && filterValue!="")
						return false;
					break;	
				case "doesNotEndWith":
					if (colValue.endsWith(filterRegx) && filterValue!="")
						return false;
					break;
				}
			return true;
		}
		
		function filterIntegerValue(colValue, filterValue, operator) {
			
			switch(operator)
				{
				case "equals":
					if (parseFloat(colValue,10)!=parseFloat(filterValue,10))
						return false;
					break;
				case "doesNotEqual":
					if (parseFloat(colValue,10)==parseFloat(filterValue,10))
						return false;
					break;
				case "isEmpty":
					if (!(colValue==="" || colValue==undefined) || colValue==0 || colValue=="0")
						return false;
					break;
				case "isNotEmpty":
					if (colValue=="" || colValue==undefined)
						return false;
					break;
				case "lessThan":
					if ((colValue==undefined ? 0 : colValue)>=filterValue)
						return false;
					break;
				case "lessThanOrEquals":
					if (!((colValue==undefined ? 0 : colValue)<filterValue || colValue==filterValue))
						return false;
					break;
				case "greaterThan":
					if ((colValue==undefined ? 0 : colValue)<=filterValue)
						return false;
					break;
				case "greaterThanOrEquals":
					if (!((colValue==undefined ? 0 : colValue)>filterValue || colValue==filterValue))
						return false;
					break;
				}
			return true;
		}
		
		function filterColumnContentsValue(colValue, filterValues) {
			if (colValue==undefined)	//no rows in the grid and something triggered a filter
				return;
			
			if (filterValues==undefined)
				return true;
			 
			var isInList = false;
			
			for (var i = 0; i < filterValues.length; i++) {
				if (colValue==filterValues[i].id && filterValues[i].isChecked==true)
				{
					isInList=true;
					break
				}
			}
			
			return isInList;
		}
		
		function filterCheckboxValue(colValue, operator) {
			if (colValue==undefined)	//no rows in the grid and something triggered a filter
				return;
				
			switch(operator)
				{
				case "selected":
					if ((colValue.toString() == "0" || colValue == 0 || colValue == false) && !(colValue==="")) 
						return false;
					break;
				case "notSelected":
					if ((colValue.toString() == "1" || colValue == 1 || colValue == true) && !(colValue==="")) 
						return false;
					break;
				}
			return true;
		}
		
		function filterDateValue(colValue, filterValue, operator, columnInfo) {
			if (columnInfo.DateSourceFormat!=undefined && !(colValue instanceof Date))	//convert to date
				colValue = $.datepicker.parseDate(colValue,columnInfo.DateSourceFormat);
			
			//add 00:00:00 time if time part is missing
			if (columnInfo.DateShowFormat!=undefined && columnInfo.DateShowFormat.search('HH:mm:ss')>-1 && filterValue.search(' ')==-1)
				filterValue=filterValue+" 00:00:00";
				
			filterValue = $.datepicker.parseDate(filterValue,columnInfo.DateShowFormat);
			var filterValueJustDate = null;
			var colValueJustDate = null;
			
			if (filterValue!=undefined)
				filterValueJustDate= filterValue.getDate().toString() + filterValue.getMonth().toString() + filterValue.getFullYear().toString(); 
			
			if (colValue!=undefined) {
				if (typeof colValue=="string" &&  colValue.substr(0,6)=="/Date(")
					colValue = new Date(parseInt(colValue.substr(6)));
					
				colValueJustDate = colValue.getDate().toString() + colValue.getMonth().toString() + colValue.getFullYear().toString(); 
			}
			
			switch(operator)
				{
				case "today":
					if (colValueJustDate!=filterValueJustDate)
						return false;
					break;
				case "equals":
					if (colValueJustDate!=filterValueJustDate)
						return false;
					break;
				case "doesNotEqual":
					if (colValueJustDate==filterValueJustDate)
						return false;
					break;
				case "isEmpty":
					if (colValue!=undefined)
						return false;
					break;
				case "isNotEmpty":
					if (colValue==undefined)
						return false;
					break;
				case "lessThan":
					if (colValue>=filterValue || colValueJustDate==filterValueJustDate)
						return false;
					break;
				case "lessThanOrEquals":
					if (!(colValue<filterValue || colValueJustDate==filterValueJustDate))
						return false;
					break;
				case "greaterThan":
					if (colValue<=filterValue || colValueJustDate==filterValueJustDate)
						return false;
					break;
				case "greaterThanOrEquals":
					if (!(colValue>filterValue || colValueJustDate==filterValueJustDate))
						return false;
					break;
				}
			return true;
		}
	
		 /* Filter out values from the grid that do not match...*/
		function filter(item) {
			for (var columnId in columnFilters) {
				var filterValue = columnFilters[columnId].value;
				
				var filterType = columnFilters[columnId].filterType;
				var operator = columnFilters[columnId].operator;
				//var colValue = item[columnId];
				var columnInfo = getColumns()[getColumnIndex(columnId)];
				
				if (typeof columnInfo=="undefined")	
					continue;
					
				var colValue = item[columnInfo.field];
				
				switch(filterType)
				{
				case "TextFilter":
					if (!filterTextValue(colValue, filterValue, operator))
						return false;
					break;
				case "SelectFilter":
					if (!filterTextValue(colValue, filterValue, operator))
						return false;
					break;
				case "IntegerFilter":
					if (!filterIntegerValue(colValue, filterValue, operator))
						return false;
				   break;
				case "DecimalFilter":
					if (!filterIntegerValue(colValue, filterValue, operator))
						return false;
				   break;
				case "DateFilter":
					if (!filterDateValue(colValue, filterValue, operator, columnInfo))
						return false;
					break;
				case "CheckboxFilter":
					if (!filterCheckboxValue(colValue, operator))
						return false;
					break;
				case "ColumnContentsFilter":
					if (!filterColumnContentsValue(colValue, filterValue))
						return false;
					break;
				default:
					continue;
				}
			}
			
			//tree grid - collapse/expand
			if (item.parent != null) {
				var parent = getData().getItems()[item.parent];

				while (parent) {
				  if (parent.collapsed) {
					return false;
				  }

				  parent = getData().getItems()[parent.parent];
				}
			  }

			return true;
		}

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Public API
        $.extend(this, {
            "slickGridVersion": "2.0a1 (modified)",

            // Events
            "onScroll": new Slick.Event(),
            "onSort": new Slick.Event(),
            "onHeaderContextMenu": new Slick.Event(),
            "onHeaderClick": new Slick.Event(),
            "onMouseEnter": new Slick.Event(),
            "onMouseLeave": new Slick.Event(),
            "onClick": new Slick.Event(),
            "onDblClick": new Slick.Event(),
            "onContextMenu": new Slick.Event(),
            "onKeyDown": new Slick.Event(),
            "onAddNewRow": new Slick.Event(),
            "onValidationError": new Slick.Event(),
            "onViewportChanged": new Slick.Event(),
            "onColumnsReordered": new Slick.Event(),
            "onColumnsResized": new Slick.Event(),
            "onCellChange": new Slick.Event(),
            "onBeforeEditCell": new Slick.Event(),
            "onBeforeCellEditorDestroy": new Slick.Event(),
            "onBeforeDestroy": new Slick.Event(),
            "onActiveCellChanged": new Slick.Event(),
            "onActiveCellPositionChanged": new Slick.Event(),
            "onDragInit": new Slick.Event(),
            "onDragStart": new Slick.Event(),
            "onDrag": new Slick.Event(),
            "onDragEnd": new Slick.Event(),
            "onSelectedRowsChanged": new Slick.Event(),
			"onPersonalizationChanged": new Slick.Event(),
			"onRowsMoved": new Slick.Event(),
			"trigger": trigger,
			
            // Methods
            "registerPlugin": registerPlugin,
            "unregisterPlugin": unregisterPlugin,
            "getColumns": getColumns,
            "setColumns": setColumns,
            "getColumnIndex": getColumnIndex,
            "updateColumnHeader": updateColumnHeader,
            "setSortColumn": setSortColumn,
            "autosizeColumns": autosizeColumns,
            "getOptions": getOptions,
            "setOptions": setOptions,
            "getData": getData,
            "getFilteredData" : getFilteredData,
			"getDataLength": getDataLength,
			"getSelectableLength": getSelectableLength,
			
            "getDataItem": getDataItem,
            "setData": setData,
            "getSelectionModel": getSelectionModel,
            "setSelectionModel": setSelectionModel,
            "getSelectedRows": getSelectedRows,
            "setSelectedRows": setSelectedRows,
			"selectAllRows": selectAllRows,
			
			"canRowBeSelected" : canRowBeSelected,
			
			//Added for additional needed functionality
			"showGridSettings": showGridSettings,
			"showFilterButton": showFilterButton,
			"addRow": addRow,
			"addRows": addRows,
			"excelExport": excelExport,
			"resetColumnLayout": resetColumnLayout,
			
            "removeSelectedRows": removeSelectedRows,
            "attachHoverEvents": attachHoverEvents,
			"updateData": updateData,
			"mergeData": mergeData,	//for paging
			"updateSummaryRow": updateSummaryRow, //for summary row
			
			"hideColumn": hideColumn,
			"showColumn": showColumn,
			"hideColumns": hideColumns,
			"showColumns": showColumns,
			
			"resizeAndRender": resizeAndRender,
			"restorePersonalization": restorePersonalization,
			
			//added for filtering...
			"clearFilter" : clearFilter,
			"applyFilter" : applyFilter,
			"updateFilterRow" : updateFilterRow,
			"showFilterRow" : showFilterRow,
			"filter" : filter,	//Should not be used called call applyFilter
			
			"render": render,
            "invalidate": invalidate,
            "invalidateRow": invalidateRow,
            "invalidateRows": invalidateRows,
            "invalidateAllRows": invalidateAllRows,
            "updateCell": updateCell,
            "updateRow": updateRow,
            "getViewport": getVisibleRange,
            "resizeCanvas": resizeCanvas,
            "updateRowCount": updateRowCount,
            "scrollRowIntoView": scrollRowIntoView,
            "getCanvasNode": getCanvasNode,

            "getCellFromPoint": getCellFromPoint,
            "getCellFromEvent": getCellFromEvent,
            "getActiveCell": getActiveCell,
            "setActiveCell": setActiveCell,
            "getActiveCellNode": getActiveCellNode,
            "getActiveCellPosition": getActiveCellPosition,
            "resetActiveCell": resetActiveCell,
            "editActiveCell": makeActiveCellEditable,
            "getCellEditor": getCellEditor,
            "getCellNode": getCellNode,
            "getCellNodeBox": getCellNodeBox,
            "canCellBeSelected": canCellBeSelected,
            "canCellBeActive": canCellBeActive,
            "navigatePrev": navigatePrev,
            "navigateNext": navigateNext,
            "navigateUp": navigateUp,
            "navigateDown": navigateDown,
            "navigateLeft": navigateLeft,
            "navigateRight": navigateRight,
            "gotoCell": gotoCell,
            "getTopPanel": getTopPanel,
            "showTopPanel": showTopPanel,
            "hideTopPanel": hideTopPanel,
            "showHeaderRowColumns": showHeaderRowColumns,
            "hideHeaderRowColumns": hideHeaderRowColumns,
            "showSummaryRowColumns": showSummaryRowColumns,
            "hideSummaryRowColumns": hideSummaryRowColumns,
            "getHeaderRow": getHeaderRow,
            "getHeaderRowColumn": getHeaderRowColumn,
            "getSummaryRow": getSummaryRow,
            "getSummaryRowColumn": getSummaryRowColumn,
            "getGridPosition": getGridPosition,
            "addCellCssStyles": addCellCssStyles,
            "setCellCssStyles": setCellCssStyles,
            "removeCellCssStyles": removeCellCssStyles,

            "destroy": destroy,

            // IEditor implementation
            "getEditorLock": getEditorLock,
            "getEditController": getEditController
        });

        init();
    }
} ($));

/*
* InforDataGrid Formatters and Editors
*/
(function ($) {

    var SlickEditor = {
	/*Filters */
		TextFilter : function () {
            return "TextFilter";
        },
		IntegerFilter : function () {
            return "IntegerFilter";
        },
		DecimalFilter : function () {
            return "DecimalFilter";
        },
		DateFilter : function () {
            return "DateFilter";
        },
		CheckboxFilter : function () {
            return "CheckboxFilter";
        },
		SelectFilter : function () {
            return "SelectFilter";
        },
		ColumnContentsFilter : function () {
            return "ColumnContentsFilter";
        },
	/*Formatters*/
		SelectorCellFormatter: function (row, cell, value, columnDef, dataContext) {
            return (!dataContext ? "" : row);
        },
		
		CellTemplateFormatter: function (row, cell, value, columnDef, dataContext) {
            var compiled_template = tmpl(columnDef.cellTemplate);
			return compiled_template(dataContext);
        },
		
		LinkFormatter: function (row, cell, value, columnDef, dataContext) {
		   //replace the dataContext
		   var linkHrefExpr = ""
		   
		   if (columnDef.linkHref!=undefined)
				linkHrefExpr = columnDef.linkHref.replace('%value%',value);
			
		   if (columnDef.linkHref!=undefined &&  columnDef.linkHref.search('%dataContext.')>-1)
		   {
				var linkHref = columnDef.linkHref.replace(/'/gi,'"');
				while (linkHref.indexOf('%') >= 0)	//loop through all matches to replace values to build: reportid_instanceid,reportname
				{
					var expr = linkHref.substr(linkHref.search('%')+1);
					expr = expr.substr(0,expr.search('%'));
					
					//faster than eval for dataContext. expressions
					if (expr.indexOf("dataContext.")==0) {
						expr = dataContext[expr.replace("dataContext.","")];
					} else
						expr = eval(expr);
						
					if (expr==undefined) 
						expr="undefined";
						
					expr = expr.toString();	//Just in case it is not a string..
				
					expr = expr.replace(/'/g,"&#39;"); // escape quote inline js
					expr = expr.replace(/"/g,"&#34;"); // escape doublequote inline js
					
					var start = linkHref.substr(0,linkHref.search('%'));
					var end = linkHref.substr(linkHref.search('%')+1);
					end  = end.substr(end.search('%')+1);
					
					linkHref = start+expr+end;
					linkHrefExpr = linkHref;
				}
			}
		   
		   var linkOnClick = "";
		   
		   if (columnDef.linkOnClick!=undefined)
		      linkOnClick = columnDef.linkOnClick.replace(/'/gi,'"').replace('%value%',value);
			
		  if (columnDef.linkOnClick!=undefined && columnDef.linkOnClick.search('%dataContext.')>-1)
		   {
				var linkOnClick = columnDef.linkOnClick.replace(/'/gi,'"');
				
				while (linkOnClick.indexOf('%') >= 0)	//loop through all matches to replace values to build: reportid_instanceid,reportname
				{
					var expr = linkOnClick.substr(linkOnClick.search('%')+1);
					expr = expr.substr(0,expr.search('%'));
					
					//faster than eval for dataContext. expressions
					if (expr.indexOf("dataContext.")==0) {
						expr = dataContext[expr.replace("dataContext.","")];
					} else
						expr = eval(expr);
					
					if (expr==undefined) 
						expr="undefined";
					
					expr = expr.toString();	//Just in case it is not a string..
					
					expr = expr.replace(/'/g,"&#39;"); // escape quote inline js
                    expr = expr.replace(/"/g,"&#34;"); // escape doublequote inline js
                    
					var start = linkOnClick.substr(0,linkOnClick.search('%'));
					var end = linkOnClick.substr(linkOnClick.search('%')+1);
					end  = end.substr(end.search('%')+1);
					linkOnClick = start+expr+end ;
				}
		   }
		   
		   return "<a class='inforHyperlink' " 
			+ (linkHrefExpr=="" ? "" : "href='" + linkHrefExpr + "'") 
			+ (columnDef.linkTarget==undefined ? "" :  "target='" + columnDef.linkTarget + "'") 
			+ (linkOnClick=="" ? "" :  " onclick='" + linkOnClick + "'") 
			+">" + value + "</a>" ;
			
		},
		
        CheckboxCellFormatter: function (row, cell, value, columnDef, dataContext, gridOptions) {
			var isReadonly = false;
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext) || !gridOptions.editable)
            	isReadonly = true;
			
			if (value==undefined)
				return '<div class="inforCheckbox '+(isReadonly ? ' uneditable"': '"')+'><span '+(isReadonly ? 'class="readonly"': '')+'><input class="inforCheckbox" '+(isReadonly ? ' readonly': '')+' type="checkbox" style="opacity: 0;"></span></div>';
			if (value.toString() == "1" || value == 1 || value == true) {
                return '<div class="inforCheckbox '+(isReadonly ? ' uneditable"': '"')+'><span class="checked'+(isReadonly ? ' readonly"': '"')+'><input id="checkedCheckBox" '+(isReadonly ? ' readonly': '')+' class="inforCheckbox" type="checkbox" checked="checked" style="opacity: 0;"></span></div>';
            }
            else {
                return '<div class="inforCheckbox '+(isReadonly ? ' uneditable"': '"')+'><span '+(isReadonly ? 'class="readonly"': '')+'><input class="inforCheckbox" '+(isReadonly ? ' readonly': '')+' type="checkbox" style="opacity: 0;"></span></div>';
            }
        },

		DateCellFormatter : function(row, cell, value, columnDef, dataContext){
			var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))
            {  
				isReadonly = true;
			}
			
			if (value instanceof Date) {	//date objects as source.
				var thedate = value;
				var displayVal = null;
				
				if (columnDef.DateShowFormat!=undefined)
					displayVal = $.datepicker.formatDate(thedate,columnDef.DateShowFormat);
				else
					displayVal = $.datepicker.formatDate(thedate,Globalize.culture().calendar.patterns.d);
					
				return  '<div '+(isReadonly ? 'class="uneditable"': '')+'>'+displayVal+'</div>';
            }
			else if (value != '0000-00-00') {	//string dates as source
				var thedate = null;
				var displayVal = null;
				
				if (value!=undefined && value.substr(0,6)=="/Date(" || columnDef.DateSourceFormat=="JSON")	//auto detect JSON Format or its specified.
					thedate = new Date(parseInt(value.substr(6)));
				else if (columnDef.DateSourceFormat!=undefined)
					thedate = $.datepicker.parseDate(value,columnDef.DateSourceFormat);
				else
					thedate = value;
				
				if (columnDef.DateShowFormat!=undefined)
					displayVal = $.datepicker.formatDate(thedate,columnDef.DateShowFormat);
				else
					displayVal = $.datepicker.formatDate(thedate,Globalize.culture().calendar.patterns.d);
				
				if (thedate == null)
					return '';
				else
					return  '<div '+(isReadonly ? 'class="uneditable"': '')+'>'+displayVal+'</div>';
            } else {
				return '';
            }
        }, 
		
        DrillDownCellFormatter: function (row, cell, value, columnDef, dataContext, gridOptions) {
            
			var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))
            {  
				isReadonly = true;
			}
			
			var tooltip = Globalize.localize("DrillDown");
			if (gridOptions.drillDownTooltip!=null)
				tooltip = gridOptions.drillDownTooltip;
			
			if (isReadonly) 
				 return "<div class='uneditable uncolored'><a class='drilldown "+(Globalize.culture().isRTL ? "inforRTLFlip" : "")+"' title='"+tooltip+"'></a></div>";
            else 
                return "<a class='drilldown "+(Globalize.culture().isRTL ? "inforRTLFlip" : "")+"' title='"+tooltip+"'></a>";
        },
		
		ButtonCellFormatter: function (row, cell, value, columnDef, dataContext) {
			var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))
            {  
				isReadonly = true;
			}
			
			var tooltip = "";
			if (columnDef.toolTip!=null)
				tooltip = columnDef.toolTip;
			
			var html = "<button type='button' class='" + (columnDef.buttonCssClass != undefined ? columnDef.buttonCssClass : "") + " gridButton'" + (isReadonly ? " disabled" : "") + "data-columnid='" + columnDef.id + "'" + (tooltip ? "title='"+tooltip+"'" : "") + "></button>";
			
			return html;
        },
		
		MultiLineTextCellFormatter:  function (row, cell, value, columnDef, dataContext, gridOptions) {
            if (value == null || value == undefined)
                value = "";
           var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))
            	isReadonly = true;
			
			var height = gridOptions.rowHeight - 1;
            return "<div class='"+(isReadonly ? "uneditable " : "")+"multiline-cell' style='height:"+height+(!$.browser.msie ? "px;white-space: pre-wrap'" : "px'")+">" + value + "</div>";
            
        },
		
		SelectCellFormatter: function (row, cell, value, columnDef, dataContext) {
			var isReadonly = false;
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))  
				isReadonly = true;
			
			if (value == null || value == undefined)
                value = "";
			
			//lookup the value in the options..
			for (var i = 0; i < columnDef.options.length; i++) {
				var opt = columnDef.options[i];
				if (opt.value==value) {
					value = opt.label
					break;
				}
			}
			
			if (isReadonly) {
				 return "<div class='uneditable'>" + value + "</div>";
            }
            else {
                return value;
            }
		},
		
		TextCellFormatter: function (row, cell, value, columnDef, dataContext) {
            if (value == null || value == undefined) {
                value = "";
            }
			var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext)) {  
				isReadonly = true;
			}
				
            if (isReadonly) {
				 return "<div class='uneditable'>" + value + "</div>";
            }
            else {
                return value;
            }
        },
		
		IntegerCellFormatter: function (row, cell, value, columnDef, dataContext) {
            if (value == null || value == undefined) {
                value = "";
            }
			var isReadonly = false;
			
			if (columnDef.editability!=undefined && columnDef.editability(row, cell, value, columnDef, dataContext))
            {  
				isReadonly = true;
			}
			return "<div class='"+(isReadonly ? "uneditable" : "")+" alignRight'>" + value + "</div>";
        },
		
		DecimalCellFormatter : function (row, cell, value, columnDef, dataContext) {
           return IntegerCellFormatter(row, cell, value, columnDef, dataContext);
        },
		
        IndicatorIconFormatter: function (row, cell, value, columnDef, dataContext) {
            if (dataContext.hasError == true || dataContext.indicator == "error")
                return "<div class='indicator-icon error-icon'></div>";
            else if (dataContext.indicator == "new")
                return "<div class='indicator-icon new-icon'></div>";
            else if (dataContext.indicator == "dirty")
                return "<div class='indicator-icon dirty-icon'></div>";
            else
                return "<div class='indicator-icon'></div>";
        },

        UneditableColumnFormatter: function (row, cell, value, columnDef, dataContext) {
			var display = value;
			//Add some checks and encode empty stuff as &nbsp
			if (value==null || value==undefined || value=='' || (typeof value == "string" && value.replace(/\s/g,"") == ""))
				display="&nbsp";
			
			columnDef.editable=false;
			return "<div class='uneditable'>" + display + "</div>";
        },
		
		TreeRowFormatter : function (row, cell, value, columnDef, dataContext, gridOptions, gridObj) {
		  //Make sure that all columns are unsortable for now.
		  
		  if (value==null || value==undefined || value=='')
			value = "";
			
		  value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
		  gridOptions.treeGrid = true;
			
		  var dataView = gridObj.getData(),
			  data = dataView.getItems(),
			  spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>",
			  idx = gridObj.getData().getIdxById(dataContext[gridOptions.idProperty]);
		   
		  if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
			if (dataContext.collapsed) {
			  return spacer + " <span class='inforExpandButton closed'></span>" + "<span style='font-weight:bold'>" + value +"</span>";
			} else {
			  return spacer + " <span class='inforExpandButton open'></span>" + "<span style='font-weight:bold'>" + value +"</span>";
			}
		  } else {
			return spacer + " <span "+(dataContext["indent"]==0 ? "" : "class='bullet'")+"></span>&nbsp; <span>" + value + "</span>";
		  }
		},
		
	    /*Editors*/
        TextCellEditor: function (args) {
            var $input;
            var defaultValue;
            
            this.init = function () {
				
				$(args.container).addClass("hasTextEditor");
					 
				$input = $("<input type='text' class='inforTextbox' />")
                    .appendTo(args.container)
                    .on("keydown.nav", function (e) {
                        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
                    })
                    .focus()
                    .select();
				
				//auto commit on click out
				$input.blur(function() {
					args.grid.getEditController().commitCurrentEdit();
				});
				 
				$input.width($input.parent().width()-8);
			};

            this.destroy = function () {
                $input.parent().removeClass("hasTextEditor");
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.getValue = function () {
                return $input.val();
            };

            this.setValue = function (val) {
                $input.val(val);
            };

            this.loadValue = function (item) {
				defaultValue = item[args.column.field] || "";
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }

                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },
			
		IntegerCellEditor: function (args, isDecimal) {
            var $input;
            var defaultValue;

            this.init = function () {
                $(args.container).addClass("hasTextEditor");
				$input = $("<INPUT type=text class='inforTextbox alignRight' />");

                $input.on("keydown.nav", function (e) {
                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
                });

                $input.appendTo(args.container);
                $input
					.focus()
					.select()
					.numericOnly()
					.width($input.parent().width()-8)
					.blur(function() {	//auto commit on click out
						args.grid.getEditController().commitCurrentEdit();
					});
			};

            this.destroy = function () {
                $input.parent().removeClass("hasTextEditor");
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
				if ($input.val()=="")
					return "";
					
                return parseInt($input.val(), 10) || 0;
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (defaultValue=="" && $input.val()=="0") || ((!($input.val() == "" && defaultValue == null)) && (parseInt($input.val()) != defaultValue));
            };

            this.validate = function () {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }
                
				var val =($input.val()=="" ? "0" : $input.val());
				if (isNaN(parseInt(val))) {
                    return {
                        valid: false,
                        msg: "Please enter a valid integer"
                    };
                }
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },

		DecimalCellEditor: function (args) {
            var $input;
            var defaultValue;
           
            this.init = function () {
                $(args.container).addClass("hasTextEditor");
				$input = $("<INPUT type=text class='inforTextbox alignRight' />");

                $input.on("keydown.nav", function (e) {
                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
                });

                $input.appendTo(args.container);
                $input.focus()
					  .select()
					  .numericOnly(true)
					  .width($input.parent().width()-8)
					  .blur(function() {	//auto commit on click out
							args.grid.getEditController().commitCurrentEdit();
					  });
			};

            this.destroy = function () {
                $input.parent().removeClass("hasTextEditor");
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                if ($input.val()=="")
					return "";
				
				return parseFloat($input.val()) || 0;
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
				return (defaultValue=="" && $input.val()=="0") || ((!($input.val() == "" && defaultValue == null)) && (parseFloat($input.val()) != defaultValue));
            };

            this.validate = function () {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }
                var val =($input.val()=="" ? "0" : $input.val());
				if (isNaN(parseFloat(val))) {
                    return {
                        valid: false,
                        msg: "Please enter a valid decimal"
                    };
                }
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },
		
        DateCellEditor: function (args) {
            var $input;
            var defaultValue;
            var calendarOpen = false;
			var showFormat =  Globalize.culture().calendar.patterns.d;
            var sourceFormat = undefined;	//date format... 
			
            this.init = function () {
				if(args.column.DateShowFormat != undefined){
                        showFormat = args.column.DateShowFormat;
                } 
				$input = $('<input class="inforDateField" type="text" placeholder="'+Globalize.localize("SelectDate")+'" />');
                $input.appendTo(args.container);
				  
                $input.focus()
					  .select()
					  .width($input.parent().width()-15)
					  .inforDateField({dateFormat: showFormat})
					  .blur(function() {	//auto commit on click out
							setTimeout(function() {
								var focus = $("*:focus"),
									classes = (focus == undefined ? "" : focus.attr("class"));
								
								if ($("#inforDatePicker-div").is(":visible"))
									return;
								
								if (classes!=undefined  && classes.indexOf("inforDate") != -1 && focus.closest(".slick-headerrow-column").length!=1)
									return;
								
								args.grid.getEditController().commitCurrentEdit();
							},100);
					  })
					  .closest(".inforTriggerField").parent().addClass("hasDateEditor")
			};

            this.destroy = function () {
                $.datepicker.dpDiv.stop(true, true);
                $input.datepicker("hide");
                $input.datepicker("destroy");
            	$input.closest(".inforTriggerField").parent().removeClass("hasDateEditor");
				$input.remove();
			 };

            this.show = function () {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).show();
                }
            };

            this.hide = function () {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).hide();
                }
            };

            this.position = function (position) {
                if (!calendarOpen) return;
                $.datepicker.dpDiv
                    .css("top", position.top + 30)
                    .css("left", position.left);
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
				var thedate = null;
               
				if (defaultValue instanceof Date) {	//date objects as source.
					thedate = defaultValue;
				}
                else if (args.column.DateSourceFormat=="JSON"){
                    thedate = new Date(parseInt(defaultValue.substr(6)));
                }
				else if (args.column.DateSourceFormat != undefined)	{//string dates as source
					sourceFormat = args.column.DateSourceFormat;
					thedate =  $.datepicker.parseDate(defaultValue,sourceFormat);
				} 
                defaultValue =  $.datepicker.formatDate(thedate, showFormat);

                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
               var thedate = $.datepicker.parseDate($input.val(),showFormat);
				if (sourceFormat!=undefined)
					return $.datepicker.formatDate(thedate, sourceFormat); 
				
                return (thedate==undefined ? "" : thedate) 
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                 if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }
				return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },

        CheckboxCellEditor: function (args) {
            var $select;
            var defaultValue;

            this.init = function () {
                $select = $('<div class="inforCheckbox"><span><input class="inforCheckbox" type="checkbox" style="opacity: 0;"></span></div>');
                $select.click(function () {
					var span = $(this).children("span");
					if (span.hasClass("checked"))	//defaultValue.toString() == "1" || defaultValue == 1 || defaultValue == true) 
						span.removeClass("checked");				
					else 
						span.addClass("checked"); 
				});
                $select.appendTo(args.container);
				
				$(document).bind("keydown.celledit", this.handleKeyDown);
				 
                if ($.browser.msie && $.browser.version<=8)	//throws cannot focus invisible element error in msie
					$select.focus().blur(function() {	//auto commit on click out
						args.grid.getEditController().commitCurrentEdit();
					});
				else
					$select.find("input").focus().blur(function() {	//auto commit on click out
						args.grid.getEditController().commitCurrentEdit();
					});
				
				$select.addClass("inforCheckboxFocus");
				$select.parent().addClass("hasCheckboxEditor")
            };

			this.handleKeyDown = function (e) {
               if ((e.which == $.ui.keyCode.ENTER && !e.ctrlKey) || (e.which==32)) {
                   e.preventDefault();
				   $select.trigger("click");
 			    }
                else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                    e.preventDefault();
                    args.grid.navigatePrev();
                }
                else if (e.which == $.ui.keyCode.TAB) {
                    e.preventDefault();
                    args.grid.navigateNext();
                }
            };
            
			this.destroy = function () {
				$select.parent().removeClass("hasCheckboxEditor");
				$select.remove();
				$(document).unbind("keydown.celledit");
			};

            this.focus = function () {
               $select.closest("div").addClass("inforCheckboxFocus");
			   $select.focus();
            };

            this.loadValue = function (item, isClick) {
				defaultValue = item[args.column.field];
				
				if (defaultValue==undefined)
					defaultValue=0;
					
				if (isClick)
				{
					if (defaultValue.toString() == "1" || defaultValue == 1 || defaultValue == true )
						$select.children("span").removeClass("checked");
					else
						$select.children("span").addClass("checked"); 
				} else {
					if (defaultValue.toString() == "1" || defaultValue == 1 || defaultValue == true )
						$select.children("span").addClass("checked");
					else
						$select.children("span").removeClass("checked");
				}
            };

            this.serializeValue = function () {
				var isChecked = $select.children("span").hasClass("checked");
                if (typeof(defaultValue)== "string") {
                     if (isChecked) {
                        return "1";
                    }
                    else {
                        return "0";
                    }
                }
                else if (defaultValue == 1 || defaultValue == 0) {
                    if (isChecked) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }               
                else if (typeof(defaultValue) == "boolean") {
                    return isChecked;
                }
                else
                {
                    return false;
                }
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                
				isChecked = $select.children("span").hasClass("checked");
                if (typeof(defaultValue)== "string") {
                   return !((defaultValue == "1" && isChecked) || (defaultValue == "0" && !isChecked));
                }
                else if (defaultValue == 1 || defaultValue == 0) {
                    return !((defaultValue == 1 && isChecked) || (defaultValue == 0 && !isChecked));
                }
                else if (typeof(defaultValue) == "boolean") {
                    return !((defaultValue && isChecked) || (!defaultValue && !isChecked));
                } 
                else
                    return true;
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },
		
        SelectCellEditor: function (args) {
            var $select;
            var defaultValue;
			var isCodeList = args.column.options[0] && args.column.options[0].value!=undefined && args.column.options[0].label!=undefined;

            this.init = function () {
				
               if (typeof(args.column.options) == "function") {
                    $select = $("<SELECT></SELECT>");
                    $select.appendTo(args.container);
                    $select.width($select.parent().width()-15);
					$select.inforDropDownList({source: function (request, response) {
                        response(args.column.options(request, response, args));
                    }});
                }
                else {
                    var option_str = "";
					for (var i = 0; i < args.column.options.length; i++){
                        v = args.column.options[i];
						if (v.value!=undefined && v.label!=undefined)
							option_str += "<OPTION value='" + v.value + "' "+(args.item[args.column.field]==v.value ? "selected " : "") +">" + v.label + "</OPTION>";
                    	else
							option_str += "<OPTION value='" + v + "' "+(args.item[args.column.field]==v ? "selected " : "") +">" + v + "</OPTION>";
                    }
                    $select = $("<SELECT>" + option_str + "</SELECT>");
                    $select.appendTo(args.container);
                    $select.width($select.parent().width()-15);
					$select.inforDropDownList(args.column.editorOptions);
					$select.next().find("input").focus();
				}
				
                $select.parent().addClass("haseditor");
				$select.addClass("inforDataGridDropDownList");
				
                $select.parent().addClass("hasComboEditor");
				$select.next().find("input").blur(function(e) {
					setTimeout(function() {
						var focus = $("*:focus"),
							classes = (focus == undefined ? "" : focus.attr("class"));
						
						if (classes==undefined)
							classes="";
							
						if (focus.closest(".slick-cell").length==1)
							return;
							
						if (classes.indexOf("inforDropDownList") != -1)
							return;
						
						if (classes.indexOf("ui-state-hover") != -1)
							return;
						
						if (classes.indexOf("inforTempInput") != -1)
							return;
						
						if (focus.closest(".inforMenu").length==1)
							return;
						
						args.grid.getEditController().commitCurrentEdit();
					},100);
				 });
			};

            this.destroy = function () {
                $select.autocomplete("destroy").remove();
				$select.parent().removeClass("hasComboEditor");
            };

            this.focus = function () {
                $select.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
				if (isCodeList)
					$select.inforDropDownList("setCode",defaultValue);
				else {
					$select.setValue(defaultValue);
					$select.val(defaultValue);
				}
			};

            this.serializeValue = function () {
                if (args.column.options) {
					if (isCodeList)
						return $select.getCode();
            		else
						return $select.getValue();
                } else {
                    return "";
                }
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
				var isChanged = false;
				if (isCodeList)
					 isChanged = ($select.getCode() != defaultValue);
				else
					 isChanged = ($select.getValue() != defaultValue);
					 
                return isChanged;
            };

            this.validate = function () {
				var val = null;
				
				if (isCodeList)
					val = $select.getCode();
				else
					val = $select.getValue();
					 
                if (args.column.validator) {
                    var validationResults = args.column.validator(val);
                    if (!validationResults.valid)
                        return validationResults;
                }
				
				return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },

		LookupCellEditor: function (args) {
            var $lookup;
            var defaultValue;

            this.init = function () {
				$(args.container).addClass("hasComboEditor hasEditor");
				
				$lookup = $('<input class="inforLookupField" type="text">');
				$lookup.appendTo(args.container)
						.width($lookup.parent().width()-15)
					    .inforLookupField(args.column.editorOptions)
				        .focus()
						.blur(function() {
							setTimeout(function() {
								var focus = $("*:focus"),
								classes = (focus == undefined ? "" : focus.attr("class"));
								
								if (classes!=undefined  && classes.indexOf("inforTriggerButton") != -1)
									return;
								if (classes!=undefined  && classes.indexOf("inforLookupField") != -1)
									return;
								
								args.grid.getEditController().commitCurrentEdit();
							},100);
						});
			};

            this.destroy = function () {
                var returnVal = $lookup.data("returnVal")
				if (returnVal) {
					$lookup.val(returnVal);
					$lookup.data("returnVal","");
					return;
				}
				
				$lookup.inforLookupField("destroy").remove();
				$lookup.parent().removeClass("hasComboEditor hasEditor");
            };

            this.focus = function () {
                $lookup.focus();
            };

            this.loadValue = function (item) {
				defaultValue = item[args.column.field];
                $lookup.val(defaultValue);
                $lookup[0].defaultValue = defaultValue;
                $lookup.select();
            };

            this.serializeValue = function () {
                 return $lookup.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($lookup.val() == "" && defaultValue == null)) && ($lookup.val() != defaultValue);
            };

            this.validate = function () {
                 if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }

				return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        },
		
        LongTextCellEditor: function (args) {
            var $input, $wrapper;
            var defaultValue;
            var scope = this;

            this.init = function () {
                var $container = $("body");

                $wrapper = $('<div style="z-index:10000; position: absolute;" class="inforGridCommentPopup"><image class="pointer" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAALCAYAAACZIGYHAAAAyElEQVQoz2NgIB4womGiFTP19/ctAGEgmxlNHRMSxmoAE8yApUuX/Afhvr7ehVhcwoJuOLIBzCBNIM0/fvz4//Hjx//Tp0/739vbswifV+C2V1ZWCgNdcAFmAAy8evUKbFBXV2cbNoPgBhQXF4mADNi8eROKAegGNTU1ZaF7Dex8mAG7du38jw/ADGpoqM9BdhFLa2uLCTEGoBtUV1ebBzYIaKIZ0IAPxBqAblBNTXUBA8iAq1ev/icHnDt37v+ECf3/Gf5TAQAAzpx+ghtZTxsAAAAASUVORK5CYII="></image><table style="popupTable"><tbody><tr class="menuTop"><td class="menuTopLeft"></td><td class="menuTopCenter"></td><td class="menuTopRight"></td></tr><tr class="menuMiddle"><td class="menuMiddleLeft"></td><td class="menuMiddleCenter"><div class="menuMiddleCenterInner menuContent"></div></td><td class="menuMiddleRight"></td></tr><tr class="menuBottom"><td class="menuBottomLeft"></td><td class="menuBottomCenter"></td><td class="menuBottomRight"></td></tr></tbody></table></div>')
					.appendTo($container);
				
				
                var closeButton = $('<div class="closeButtonDiv"><button class="inforCloseButtonDark"></button></div>')
					.prependTo($wrapper.find(".menuMiddleCenter"));
					
				$input = $("<textarea>")
                    .appendTo($wrapper.find(".menuContent"));
				
				$input.resizable({ handles: 'se'});
				
                closeButton.on("click", this.saveAndClose);
                $input.on("keydown", this.handleKeyDown);

                scope.position(args.position);
                $input.focus().select()
					.blur(function() {	//auto commit on click out
						args.grid.getEditController().commitCurrentEdit();
					});
            };

            this.handleKeyDown = function (e) {
                if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                    scope.save();
                }
                else if (e.which == $.ui.keyCode.ESCAPE) {
                    e.preventDefault();
                    scope.cancel();
                }
                else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                    e.preventDefault();
                    args.grid.navigatePrev();
                }
                else if (e.which == $.ui.keyCode.TAB) {
                    e.preventDefault();
                    args.grid.navigateNext();
                }
            };

            this.save = function () {
                args.commitChanges();
				$wrapper.remove();
            };

			this.saveAndClose = function () {
              args.grid.getEditorLock().commitCurrentEdit();
            };

            this.cancel = function () {
                $input.val(defaultValue);
                args.cancelChanges();
            };

            this.hide = function () {
                $wrapper.hide();
            };

            this.show = function () {
                $wrapper.show();
            };

            this.position = function (position) {
                $wrapper
                    .css("top", position.top - 5)
                    .css("left", position.left - 5)
            };

            this.destroy = function () {
                $wrapper.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                $input.val(defaultValue = item[args.column.field]);
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }, 
	
		MultiLineTextCellEditor: function (args) {
            var $input;
            var defaultValue;
            
            this.init = function () {
				
				$(args.container).addClass("hasTextEditor");
				
				$input = $("<textarea type=text class='inforTextArea' />")
                    .appendTo(args.container)
                    .on("keydown.nav", function (e) {
                        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT || e.keyCode === $.ui.keyCode.ENTER ) {
                            e.stopImmediatePropagation();
                        }
					})
                    .focus()
                    .select();
				
				$input.width($input.parent().width()-1).height(args.grid.getOptions().rowHeight-5);
				//auto commit on click out
				$input.blur(function() {
					args.grid.getEditController().commitCurrentEdit();
				});
			};

            this.destroy = function () {
                $input.parent().removeClass("hasTextEditor");
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.getValue = function () {
                return $input.val();
            };

            this.setValue = function (val) {
                $input.val(val);
            };

            this.loadValue = function (item) {
				defaultValue = item[args.column.field] || "";
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid)
                        return validationResults;
                }

                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }
	};

	$.extend(window, SlickEditor);

})($);

/*
* InforDataGrid DataView
*/
(function ($) {
    $.extend(true, window, {
        Slick: {
            Data: {
                DataView: DataView,
                Aggregators: {
                    Avg: AvgAggregator,
                    Min: MinAggregator,
                    Max: MaxAggregator,
					Sum: SumAggregator
                }
            }
        }
    });


    /*
    * A sample Model implementation.
    * Provides a filtered view of the underlying data.
    *
    * Relies on the data item having an "id" property uniquely identifying it.
    */
    function DataView(options) {
        var self = this;

        var defaults = {
            groupItemMetadataProvider: null
        };

        // private
		var idProperty = "id"; // property holding a unique row id
		
        if (options!=undefined && options.idProperty!=undefined)
			idProperty=options.idProperty;
		
		var items = []; // data by index
        var rows = []; // data by row
        var idxById = {}; // indexes by id
        var rowsById = null; // rows by id; lazy-calculated
        var filter = null; // filter function
        var updated = null; // updated item ids
        var suspend = false; // suspends the recalculation
        var sortAsc = true;
        var sortComparer;
		var filters = null;	//filter expressions
		var sortColumnId = null;
			
        // grouping
        var groupingGetter;
        var groupingGetterIsAFn;
        var groupingFormatter;
        var groupingComparer;
        var groups = [];
        var collapsedGroups = {};
        var aggregators;
        var aggregateCollapsed = false;

        var pagesize = 0;
        var pagenum = 0;
        var totalRows = 0;
		var activeReq = false; //active request?
		
        // events
        var onRowCountChanged = new Slick.Event();
        var onRowsChanged = new Slick.Event();
        var onPagingInfoChanged = new Slick.Event();
        var onPageRequested = new Slick.Event();
		var onDataLoading = new Slick.Event();
		var onDataLoaded = new Slick.Event();
		var onAggregatorsChanged = new Slick.Event();
		
        options = $.extend(true, {}, defaults, options);

        function beginUpdate() {
            suspend = true;
        }

        function endUpdate(hints) {
            suspend = false;
            refresh(hints);
        }

        function updateIdxById(startingIndex) {
            startingIndex = startingIndex || 0;
            var id;
            for (var i = startingIndex, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined) {
                    throw "Each data element must implement a unique 'id' property";
                }
                idxById[id] = i;
            }
        }

        function ensureIdUniqueness() {
            var id;
            for (var i = 0, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined || idxById[id] !== i) {
                    throw "Each data element must implement a unique 'id' property";
                }
            }
        }

        function getItems() {
            return items;
        }

		//Get the Max Value in the id column
		function getMaxId() {	
			var maxId = -1;
			for (var i = 0, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id>maxId)
					maxId = id;
            }
			
			return maxId;
		}
		
        function setItems(data, objectIdProperty) {
            if (objectIdProperty !== undefined) idProperty = objectIdProperty;
            items = data;
            idxById = {};
            updateIdxById();
            ensureIdUniqueness();
            refresh();
        }
		
		function setPagingOptions(args) {
           
			if (args.filters != undefined)
                filters = args.filters;
			
			if (args.sortColumnId != undefined)
                sortColumnId = args.sortColumnId;
			
			if (args.pageSize != undefined)
                pagesize = args.pageSize;
			
			if (args.pageNum != undefined) {
              	var newPage = (args.pageNum != pagenum);
				
				if (options.pagingMode=="PagerClientSide")
					pagenum = Math.min(args.pageNum, Math.ceil(totalRows / pagesize));
				else
					pagenum = args.pageNum;
				
				if (newPage && args.totalRows==undefined) {
					requestNewPage("pager");
					
					if (options.pagingMode=="PagerServerSide")
						return;
				}
			}
			
			if (args.totalRows != undefined) {
				if (getPagingInfo().totalRows!=args.totalRows) {
					totalRows = args.totalRows;
					onPagingInfoChanged.notify(getPagingInfo(), null, self);
				}
				onDataLoaded.notify(getPagingInfo());
				return;	//dont call refresh if we explicitly set this..
			}
			
			onPagingInfoChanged.notify(getPagingInfo(), null, self);
			refresh();
        }
		
		function requestNewPage(operation) {
			var pageInfo = getPagingInfo();
			
			pageInfo.operation = operation;
			if (options.pagingMode!="PagerClientSide")
				onDataLoading.notify(pageInfo);
			
			onPageRequested.notify(pageInfo, null, self);
		}
		
        function getPagingInfo() {
			return { pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, filters: filters, sortColumnId: sortColumnId, sortAsc: sortAsc};
        }

        function sort(comparer, ascending) {
            sortAsc = ascending;
            sortComparer = comparer;
            if (ascending === false) items.reverse();
            items.sort(comparer);
            if (ascending === false) items.reverse();
            idxById = {};
            updateIdxById();
            refresh();
        }
		
        function reSort() {
            if (sortComparer) {
                sort(sortComparer, sortAsc);
            }
        }

        function setFilter(filterFn) {
            filter = filterFn;
            refresh();
        }

        function groupBy(valueGetter, valueFormatter, sortComparer) {
            if (!options.groupItemMetadataProvider) {
                options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
			}

            groupingGetter = valueGetter;
            groupingGetterIsAFn = typeof groupingGetter === "function";
            groupingFormatter = valueFormatter;
            groupingComparer = sortComparer;
            collapsedGroups = {};
            groups = [];
            refresh();
        }

        function setAggregators(groupAggregators, includeCollapsed) {
            aggregators = groupAggregators;
            aggregateCollapsed = includeCollapsed !== undefined ? includeCollapsed : aggregateCollapsed;
            refresh();
			onAggregatorsChanged.notify(getPagingInfo(), null, self);
        }

		function getAggregators() {
            return aggregators;
        }
        
		function getItemByIdx(i) {
            return items[i];
        }

        function getIdxById(id) {
            return idxById[id];
        }

        // calculate the lookup table on first call
        function getRowById(id) {
            if (!rowsById) {
                rowsById = {};
                for (var i = 0, l = rows.length; i < l; ++i) {
                    rowsById[rows[i][idProperty]] = i;
                }
            }

            return rowsById[id];
        }
		
		function getRowIdx(row) {
            for (var i = 0, l = rows.length; i < l; ++i) {
				if (rows[i][idProperty]==row[idProperty])
					return i;
			}
            return -1;
        }
        
		function getItemById(id) {
            return items[idxById[id]];
        }

        function updateItem(id, item) {
            if (idxById[id] === undefined || id !== item[idProperty])
                throw "Invalid or non-matching id";
            items[idxById[id]] = item;
            if (!updated) updated = {};
            updated[id] = true;
            refresh();
        }

        function insertItem(insertBefore, item) {
            items.splice(insertBefore, 0, item);
            updateIdxById(insertBefore);
            refresh();
        }

        function addItem(item) {
            items.push(item);
            updateIdxById(items.length - 1);
            refresh();
        }

        function deleteItem(id) {
            var idx = idxById[id];
            if (idx === undefined) {
                throw "Invalid id";
            }
            delete idxById[id];
            items.splice(idx, 1);
            updateIdxById(idx);
            refresh();
        }

        function getLength() {
            return rows.length;
        }

        function getItem(i) {
            return rows[i];
        }

        function getItemMetadata(i) {
            var item = rows[i];
            if (item === undefined) {
                return null;
            }

            // overrides for group rows
            if (item.__group) {
				return options.groupItemMetadataProvider.getGroupRowMetadata(item);
            }

            // overrides for totals rows
            if (item.__groupTotals) {
                return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
            }

            return null;
        }

        function collapseGroup(groupingValue) {
            collapsedGroups[groupingValue] = true;
            refresh();
        }

        function expandGroup(groupingValue) {
            delete collapsedGroups[groupingValue];
            refresh();
        }

        function getGroups() {
            return groups;
        }

        function extractGroups(rows) {
            var group;
            var val;
            var groups = [];
            var groupsByVal = {};
            var r;

            for (var i = 0, l = rows.length; i < l; i++) {
                r = rows[i];
                val = (groupingGetterIsAFn) ? groupingGetter(r) : r[groupingGetter];
                group = groupsByVal[val];
                if (!group) {
                    group = new Slick.Group();
                    group.count = 0;
                    group.value = val;
                    group.rows = [];
                    groups[groups.length] = group;
                    groupsByVal[val] = group;
                }

                group.rows[group.count++] = r;
            }

            return groups;
        }
		
        // TODO: lazy totals calculation
        function calculateGroupTotals(group) {
            var r, idx;

            if (group.collapsed && !aggregateCollapsed) {
                return;
            }

            idx = aggregators.length;
            while (idx--) {
                aggregators[idx].init();
            }

            for (var j = 0, jj = group.rows.length; j < jj; j++) {
                r = group.rows[j];
                idx = aggregators.length;
                while (idx--) {
                    aggregators[idx].accumulate(r);
                }
            }

            var t = new Slick.GroupTotals();
            idx = aggregators.length;
            while (idx--) {
                aggregators[idx].storeResult(t);
            }
            t.group = group;
            group.totals = t;
        }

        function calculateTotals(groups) {
            var idx = groups.length;
            while (idx--) {
                calculateGroupTotals(groups[idx]);
            }
        }

        function finalizeGroups(groups) {
            var idx = groups.length, g;
            while (idx--) {
                g = groups[idx];
                g.collapsed = (g.value in collapsedGroups);
                g.title = groupingFormatter ? groupingFormatter(g) : g.value;
            }
        }

        function flattenGroupedRows(groups) {
            var groupedRows = [], gl = 0, g;
            for (var i = 0, l = groups.length; i < l; i++) {
                g = groups[i];
                groupedRows[gl++] = g;

                if (!g.collapsed) {
                    for (var j = 0, jj = g.rows.length; j < jj; j++) {
                        groupedRows[gl++] = g.rows[j];
                    }
                }

                if (g.totals && (!g.collapsed || aggregateCollapsed)) {
                    groupedRows[gl++] = g.totals;
                }
            }
            return groupedRows;
        }

        function getFilteredAndPagedItems(items, filter) {
			var pageStartRow = pagesize * pagenum;
            var pageEndRow = pageStartRow + pagesize;
			
			if (options.pagingMode=="PagerServerSide") {
				pageStartRow = 0;
				pageEndRow = items.length;
			}
            var itemIdx = 0, rowIdx = 0, item;
            var continousMode = options.pagingMode=="ContinuousScrolling";
			var newRows = [];
			
            // filter the data and get the current page if paging
            if (filter) {
                for (var i = 0, il = items.length; i < il; ++i) {
                    item = items[i];

                    if (!filter || filter(item)) {
                        if ((continousMode ? true : !pagesize) || (itemIdx >= pageStartRow && itemIdx < pageEndRow)) {
                            newRows[rowIdx] = item;
                            rowIdx++;
                        }
                        itemIdx++;
                    }
                }
            }
            else {
                newRows = pagesize ? items.slice(pageStartRow, pageEndRow) : items.concat();
                itemIdx = items.length;
            }
			
            return { totalRows: itemIdx, rows: newRows };
        }

        function getRowDiffs(rows, newRows) {
            var item, r, eitherIsNonData, diff = [];
            for (var i = 0, rl = rows.length, nrl = newRows.length; i < nrl; i++) {
                if (i >= rl) {
                    diff[diff.length] = i;
                }
                else {
                    item = newRows[i];
                    r = rows[i];

                    if ((groupingGetter && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
                            item.__group !== r.__group ||
                            item.__updated ||
                            item.__group && !item.equals(r))
                        || (aggregators && eitherIsNonData &&
                    // no good way to compare totals since they are arbitrary DTOs
                    // deep object comparison is pretty expensive
                    // always considering them 'dirty' seems easier for the time being
                            (item.__groupTotals || r.__groupTotals))
                        || item[idProperty] != r[idProperty]
                        || (updated && updated[item[idProperty]])
                        ) {
                        diff[diff.length] = i;
                    }
                }
            }
            return diff;
        }

        function recalc(_items, _rows, _filter) {
            rowsById = null;

            var newRows = [];

            var filteredItems = getFilteredAndPagedItems(_items, _filter);
			
            totalRows = filteredItems.totalRows;
            newRows = filteredItems.rows;

            groups = [];
            if (groupingGetter != null) {
                groups = extractGroups(newRows);
                if (groups.length) {
                    finalizeGroups(groups);
                    if (aggregators) {
                        calculateTotals(groups);
                    }
					if (groupingComparer)
						groups.sort(groupingComparer);
                    newRows = flattenGroupedRows(groups);
                }
            } else {
				//calculate summaryRow totals - also using aggregators.
				if (aggregators) {
					groups = extractGroups(newRows);
					calculateTotals(groups);
				}
			}

            var diff = getRowDiffs(_rows, newRows);
            rows = newRows;

            return diff;
        }
		
        function refresh() {
            if (suspend) return;

            var countBefore = rows.length;
            var totalRowsBefore = totalRows;

            var diff = recalc(items, rows, filter); // pass as direct refs to avoid closure perf hit

            // if the current page is no longer valid, go to last page and recalc
            // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
            if (pagesize && totalRows < pagenum * pagesize) {
                pagenum = Math.floor(totalRows / pagesize);
                diff = recalc(items, rows, filter);
            }

            updated = null;

            if (totalRowsBefore != totalRows && options.pagingMode!="PagerServerSide") {
				onPagingInfoChanged.notify(getPagingInfo(), null, self);
			}
			
			if (countBefore != rows.length) 
				onRowCountChanged.notify({ previous: countBefore, current: rows.length }, null, self);
            
			if (diff.length > 0) 
				onRowsChanged.notify({ rows: diff }, null, self);
        }
		
		return {
            // methods
            "beginUpdate": beginUpdate,
            "endUpdate": endUpdate,
            "setPagingOptions": setPagingOptions,
            "getPagingInfo": getPagingInfo,
            "getItems": getItems,
			"getFilteredAndPagedItems": getFilteredAndPagedItems,
            "setItems": setItems,
            "setFilter": setFilter,
			"getMaxId": getMaxId,
			"sort": sort,
            "reSort": reSort,
            "groupBy": groupBy,
            "setAggregators": setAggregators,
			"collapseGroup": collapseGroup,
            "expandGroup": expandGroup,
            "getGroups": getGroups,
            "getIdxById": getIdxById,
            "getRowById": getRowById,
			"getRowIdx": getRowIdx,
            "getItemById": getItemById,
            "getItemByIdx": getItemByIdx,
            "refresh": refresh,
            "updateItem": updateItem,
            "insertItem": insertItem,
            "addItem": addItem,
            "deleteItem": deleteItem,

            // data provider methods
            "getLength": getLength,
            "getItem": getItem,
            "getItemMetadata": getItemMetadata,
			"requestNewPage" : requestNewPage,
			
			//properties
			"activeReq": activeReq,
			
            // events
            "onRowCountChanged": onRowCountChanged,
            "onRowsChanged": onRowsChanged,
            "onPagingInfoChanged": onPagingInfoChanged,
			"onPageRequested": onPageRequested,
			"onDataLoading": onDataLoading,
			"onDataLoaded": onDataLoaded,
			"onAggregatorsChanged": onAggregatorsChanged
        };
    }

    function AvgAggregator(field) {
        var count;
        var nonNullCount;
        var sum;

        this.init = function () {
            count = 0;
            nonNullCount = 0;
            sum = 0;
        };

        this.accumulate = function (item) {
            var val = item[field];
            count++;
            if (val != null && val != NaN) {
                nonNullCount++;
                sum += 1 * val;
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.avg) {
                groupTotals.avg = {};
            }
            if (nonNullCount != 0) {
                groupTotals.avg[field] = sum / nonNullCount;
            }
        };
    }

	function SumAggregator(field) {
        var sum;

        this.init = function () {
            sum = 0;
        };

        this.accumulate = function (item) {
            var val = item[field];
			
			if (typeof val == "string")
				val = val.replace(",","");	//remove thousands seperator.
				
            if (val != null && val != "" && val != NaN) {
                sum += parseFloat(val);
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.sum) {
                groupTotals.sum = {};
            }
            groupTotals.sum[field] = sum;
        };
    }
	
    function MinAggregator(field) {
        var min;

        this.init = function () {
            min = null;
        };

        this.accumulate = function (item) {
            var val = item[field];
            if (val != null && val != NaN) {
                if (min == null || val < min) {
                    min = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.min) {
                groupTotals.min = {};
            }
            groupTotals.min[field] = min;
        }
    }

    function MaxAggregator(field) {
        var max;

        this.init = function () {
            max = null;
        };

        this.accumulate = function (item) {
            var val = item[field];
            if (val != null && val != NaN) {
                if (max == null || val > max) {
                    max = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.max) {
                groupTotals.max = {};
            }
            groupTotals.max[field] = max;
        }
    }

})($);

/*
* CheckBox Selection Plugin
*/
(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "CheckboxSelectColumn": CheckboxSelectColumn
        }
    });

    function CheckboxSelectColumn(options) {
        var _grid;
        var _selectedRowsLookup = {};
        var _defaults = {
            columnId: "_checkbox_selector",
            cssClass: "selector-checkbox-header",
            toolTip: Globalize.localize("SelectDeselect"),
            width: 20,
			resizable: false,
            sortable: false
        };

        var _options = $.extend(true, {}, _defaults, options);

        function init(grid) {
            _grid = grid;
            _grid.onSelectedRowsChanged.subscribe(handleSelectedRowsChanged);
            _grid.onClick.subscribe(handleClick);
            _grid.onHeaderClick.subscribe(handleHeaderClick);
        }

        function destroy() {
            _grid.onSelectedRowsChanged.unsubscribe(handleSelectedRowsChanged);
            _grid.onClick.unsubscribe(handleClick);
            _grid.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleSelectedRowsChanged(e, args) {
            var selectedRows = _grid.getSelectedRows();
            var lookup = {}, row, i;
            for (var i = 0; i < selectedRows.length; i++) {
                row = selectedRows[i];
                lookup[row] = true;
                if (lookup[row] !== _selectedRowsLookup[row]) {
                    _grid.invalidateRow(row);
                    delete _selectedRowsLookup[row];
                }
            }
            for (i in _selectedRowsLookup) {
                _grid.invalidateRow(i);
            }
            _selectedRowsLookup = lookup;
            _grid.render();

            if (selectedRows.length == _grid.getSelectableLength()) {
                _grid.updateColumnHeader(_options.columnId, '<div class="inforCheckbox selector-checkbox-header"><span class="checked"><input id="checkedCheckBox" class="inforCheckbox" type="checkbox" checked="checked" style="opacity: 0;"></span></div>'
					, _options.toolTip);
			}
            else {
                _grid.updateColumnHeader(_options.columnId, '<div class="inforCheckbox selector-checkbox-header"><span><input class="inforCheckbox" type="checkbox" style="opacity: 0;"></span></div>', _options.toolTip);
			}
        }

		function addChildren(row) {
			var selected = [];
			selected.push(row);
			
			if (_grid.getOptions().treeGrid) {
				var data = _grid.getData().getItems();
				//if this row is a parent, select the children	
				for (var j = row; j < data.length; j++) {
					if (data[j]["parent"]==row) {
						selected.push(j);
					}
				}
			}
			return selected;
		}
		
        function handleClick(e, args) {
            // clicking on a row select checkbox
            if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).find(":first-child").is(".inforCheckbox")) {
               // if editing, try to commit
                if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }
                if (_selectedRowsLookup[args.row]) {
                    _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) { 
						if (_grid.getOptions().treeGrid) {
							var data = _grid.getData().getItems();
							if (data[n]["parent"] == args.row)
								return false;
							else
								return n != args.row;
						} else 
							return n != args.row;
					}));
                }
                else if (_grid.getOptions().multiSelect) {
					var addedRows = addChildren(args.row);
                    _grid.setSelectedRows(_grid.getSelectedRows().concat(addedRows));
                }
                else {
                    var empty = [];
                    _grid.setSelectedRows(empty.concat(args.row));
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        function handleHeaderClick(e, args) {
			if (args.column && args.column.id == _options.columnId && $(e.target).find(":first-child").is(".inforCheckbox")){
                // if editing, try to commit
                if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                if (!$(e.target).hasClass("checked")) {
                    _grid.selectAllRows();
					$(e.target).addClass("checked");
			    }
                else {
                    _grid.setSelectedRows([]);
					$(e.target).removeClass("checked");
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        function getColumnDefinition() {
            return {
                id: _options.columnId,
                name: '<div class="inforCheckbox selector-checkbox-header"><span><input class="inforCheckbox" type="checkbox" style="opacity: 0;"></span></div>',
                toolTip: _options.toolTip,
                width: 20,
                resizable: false,
                sortable: false,
				reorderable: false,
                cssClass: "non-data-cell",
                formatter: checkboxSelectionFormatter,
				selectable: false
            };
        }
       

        function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
            if (dataContext) {
				var isSelectable = (_grid == undefined ? true : _grid.canRowBeSelected(row)),
					tooltip = Globalize.localize("CannotBeSelected");
					
                return _selectedRowsLookup[row]
                        ? '<div class="inforCheckbox selector-checkbox"><span class="checked"><input id="checkedCheckBox" class="inforCheckbox" type="checkbox" checked="checked" style="opacity: 0;"></span></div>'
                        : '<div class="inforCheckbox selector-checkbox" title="'+(!isSelectable ? tooltip :"")+'"><span '+(!isSelectable ? "class='readonly'" :"")+'><input class="inforCheckbox" type="checkbox" style="opacity: 0;" '+(!isSelectable ? " readonly" :"")+'></span></div>';
            }
            return null;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getColumnDefinition": getColumnDefinition
        });
    }
})($);

/*
* Row Selection Plugin
*/
(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "RowSelectionModel": RowSelectionModel
        }
    });

    function RowSelectionModel(options) {
        var _grid;
        var _ranges = [];
        var _self = this;
        var _options;
        var _defaults = {
            selectActiveRow: true
        };

        function init(grid) {
            _options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
            _grid.onKeyDown.subscribe(handleKeyDown);
            _grid.onClick.subscribe(handleClick);
        }

        function destroy() {
            _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
            _grid.onKeyDown.unsubscribe(handleKeyDown);
            _grid.onClick.unsubscribe(handleClick);
        }

        function rangesToRows(ranges) {
            var rows = [];
            for (var i = 0; i < ranges.length; i++) {
                for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                    rows.push(j);
                }
            }
            return rows;
        }

        function rowsToRanges(rows) {
            var ranges = [];
            var lastCell = _grid.getColumns().length - 1;
            for (var i = 0; i < rows.length; i++) {
                ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
            }
            return ranges;
        }

        function getRowsRange(from, to) {
            var i, rows = [];
            for (i = from; i <= to; i++) {
                rows.push(i);
            }
            for (i = to; i < from; i++) {
                rows.push(i);
            }
            return rows;
        }

        function getSelectedRows() {
            return rangesToRows(_ranges);
        }

        function setSelectedRows(rows) {
            setSelectedRanges(rowsToRanges(rows));
        }

        function setSelectedRanges(ranges) {
			_ranges = ranges;
            _self.onSelectedRangesChanged.notify(_ranges);
        }

        function getSelectedRanges() {
            return _ranges;
        }

        function handleActiveCellChange(e, data) {
            if (_options.selectActiveRow) {
                setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
            }
        }

        function handleKeyDown(e) {
			 var activeRow = _grid.getActiveCell();
			 if (e.shiftKey	&& e.ctrlKey && e.which == 35) {	//ctrl-shift-end
					e.preventDefault();
					e.stopPropagation();
					var selection = _grid.getSelectedRows(),
					   from =  selection.pop(),
					   to = _grid.getDataLength()-1;
					
					selection = [];
					for (var i = from; i <= to; i++) {
						selection.push(i);
					}
					_grid.setSelectedRows(selection);
					_grid.scrollRowIntoView(to, false);
					return;
			}
			
			if (!e.shiftKey	&& e.ctrlKey && e.which == 65) {	//ctrl-a selects all.
				e.preventDefault();
				e.stopPropagation();
				_grid.selectAllRows();
				return;
			}
			
			
            if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
                var selectedRows = getSelectedRows();
                selectedRows.sort(function (x, y) { return x - y });

                if (!selectedRows.length) {
                    selectedRows = [activeRow.row];
                }

                var top = selectedRows[0];
                var bottom = selectedRows[selectedRows.length - 1];
                var active;
				
					
                if (e.which == 40) {
                    active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
                }
                else {
                    active = activeRow.row < bottom ? --bottom : --top;
                }

                if (active >= 0 && active < _grid.getDataLength()) {
                    _grid.scrollRowIntoView(active);
                    _ranges = rowsToRanges(getRowsRange(top, bottom));
                    setSelectedRanges(_ranges);
                }

                e.preventDefault();
                e.stopPropagation();
            }
        }

        function handleClick(e) {
            var cell = _grid.getCellFromEvent(e),
				opt = _grid.getOptions(),
			    readonlySelect = (!opt.enableCellNavigation && opt.multiSelect && !opt.editable);
		   
			if (!cell || (readonlySelect ? false : !_grid.canCellBeActive(cell.row, cell.cell))) {
				return false;
			}
		
            var selection = rangesToRows(_ranges);
            var idx = $.inArray(cell.row, selection);

            if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
                return false;
            }
            else if (_grid.getOptions().multiSelect) {
                if (idx === -1 && (e.ctrlKey || e.metaKey)) {
                    selection.push(cell.row);
                    _grid.setActiveCell(cell.row, cell.cell);
                }
                else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
                    selection = $.grep(selection, function (o, i) { return (o !== cell.row); });
                    _grid.setActiveCell(cell.row, cell.cell);
                }
                else if (selection.length && e.shiftKey) {
                    var last = selection.pop();
                    var from = Math.min(cell.row, last);
                    var to = Math.max(cell.row, last);
                    selection = [];
                    for (var i = from; i <= to; i++) {
                        if (i !== last) {
                            selection.push(i);
                        }
                    }
                    selection.push(last);
                    _grid.setActiveCell(cell.row, cell.cell);
                }
            }

            _ranges = rowsToRanges(selection);
            setSelectedRanges(_ranges);
            e.stopImmediatePropagation();

            return true;
        }

        $.extend(this, {
            "getSelectedRows": getSelectedRows,
            "setSelectedRows": setSelectedRows,

            "getSelectedRanges": getSelectedRanges,
            "setSelectedRanges": setSelectedRanges,

            "init": init,
            "destroy": destroy,

            "onSelectedRangesChanged": new Slick.Event()
        });
    }
})($);

/*
* RowMove Manager Plugin.
*/
(function($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "RowMoveManager": RowMoveManager
        }
    });

    function RowMoveManager() {
        var _grid;
        var _canvas;
        var _dragging;
        var _self = this;

        function init(grid) {
            _grid = grid;
            _canvas = _grid.getCanvasNode();
            _grid.onDragInit.subscribe(handleDragInit);
            _grid.onDragStart.subscribe(handleDragStart);
            _grid.onDrag.subscribe(handleDrag);
            _grid.onDragEnd.subscribe(handleDragEnd);
        }

        function destroy() {
            _grid.onDragInit.unsubscribe(handleDragInit);
            _grid.onDragStart.unsubscribe(handleDragStart);
            _grid.onDrag.unsubscribe(handleDrag);
            _grid.onDragEnd.unsubscribe(handleDragEnd);
        }

        function handleDragInit(e) {
            // prevent the grid from cancelling drag'n'drop by default
            e.stopImmediatePropagation();
        }

        function handleDragStart(e,dd) {
            var cell = _grid.getCellFromEvent(e);
            if (_grid.getEditorLock().isActive() || !/move|selectAndMove/.test(_grid.getColumns()[cell.cell].behavior)) {
                return false;
            }

            _dragging = true;
            e.stopImmediatePropagation();

            var selectedRows = _grid.getSelectedRows();

            if (selectedRows.length == 0 || $.inArray(cell.row, selectedRows) == -1) {
                selectedRows = [cell.row];
                _grid.setSelectedRows(selectedRows);
            }

            var rowHeight = _grid.getOptions().rowHeight;

            dd.selectedRows = selectedRows;

            dd.selectionProxy = $("<div class='slick-reorder-proxy'/>")
                .css("position", "absolute")
                .css("zIndex", "99999")
                .css("width", $(_canvas).innerWidth())
                .css("height", rowHeight*selectedRows.length)
                .appendTo(_canvas);

            dd.guide = $("<div class='slick-reorder-guide'/>")
                .css("position", "absolute")
                .css("zIndex", "99998")
                .css("width", $(_canvas).innerWidth())
                .css("top", -1000)
                .appendTo(_canvas);

            dd.insertBefore = -1;

        }

        function handleDrag(e,dd) {
            if (!_dragging) {
                return;
            }

            e.stopImmediatePropagation();

            var top = e.pageY - $(_canvas).offset().top;
            dd.selectionProxy.css("top",top-5);

            var insertBefore = Math.max(0,Math.min(Math.round(top/_grid.getOptions().rowHeight),_grid.getDataLength()));
            if (insertBefore !== dd.insertBefore) {
                var eventData = {
                    "rows":         dd.selectedRows,
                    "insertBefore": insertBefore
                };

                if (_self.onBeforeMoveRows.notify(eventData) === false) {
                    dd.guide.css("top", -1000);
                    dd.canMove = false;
                }
                else {
                    dd.guide.css("top",insertBefore*_grid.getOptions().rowHeight);
                    dd.canMove = true;
                }

                dd.insertBefore = insertBefore;
            }
        }

        function handleDragEnd(e,dd) {
            if (!_dragging) {
                return;
            }
            _dragging = false;
            e.stopImmediatePropagation();

            dd.guide.remove();
            dd.selectionProxy.remove();

            if (dd.canMove) {
                var eventData = {
                    "rows":         dd.selectedRows,
                    "insertBefore": dd.insertBefore
                };
                _self.onMoveRows.notify(eventData);
            }
        }

        $.extend(this, {
            "onBeforeMoveRows": new Slick.Event(),
            "onMoveRows":       new Slick.Event(),

            "init":             init,
            "destroy":          destroy
        });
    }
})($);

/* 
* Cell Decorator Plugin for Xls copy
*/
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  function CellRangeDecorator(grid, options) {
    var _elem;
    var _defaults = {
		selectionClass: "slick-cell-range-select"
    };

    options = $.extend(true, {}, _defaults, options);

    function show(range) {
      var self = this;
	  if (!_elem) {
        _elem = $("<div></div>")
            .css("position", "absolute").addClass(options.selectionClass)
            .appendTo(grid.getCanvasNode())
			.click(function(e) {
				self.hide();
				$(document.elementFromPoint(e.clientX,e.clientY)).trigger("click");
			});
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      _elem.css({
        top: from.top,
        left: from.left,
        height: to.bottom - from.top +1,
        width: to.right - from.left -1
      });
		
      return _elem;
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
    }

    $.extend(this, {
      "show": show,
      "hide": hide
    });
  }
})($);

/* 
* CellRangeSelector Plugin for Xls copy
  Based on http://www.developerextensions.com/index.php/extjs-excel-copypaste-grid
*/

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeSelector": CellRangeSelector
    }
  });

  function CellRangeSelector(options) {
    var _grid;
    var _canvas;
    var _dragging;
    var _decorator;
    var _self = this;
	var _textarea = null;
	var _tsvData = "";	//Excel pastable data.

	function init(grid) {
		_grid = grid;
		_canvas = _grid.getCanvasNode();
		if (!options.enableCellRangeSelection)
			return;
			
		_decorator = new Slick.CellRangeDecorator(grid);
		_grid.onDragInit.subscribe(handleDragInit);
		_grid.onDragStart.subscribe(handleDragStart);
		_grid.onDrag.subscribe(handleDrag);
		_grid.onDragEnd.subscribe(handleDragEnd);
		_grid.onActiveCellChanged.subscribe(handleActiveCellChange);
		_grid.getData().onRowCountChanged.subscribe(handleActiveCellChange);
		_grid.onSort.subscribe(handleActiveCellChange);
		
		this.onCellRangeSelected.subscribe(handleCellRangeSelected);
	  
		$(_canvas).bind('keydown', 'ctrl+c', function(){
			copyToClipBoard();
		});
		
		$(_canvas).bind('keydown', 'ctrl+v', function(){
			directFocus();
		});
		
		if (_grid.getOptions().editable) {
			$(_canvas).bind("paste", function(elem, e) {
				//let the value past into the text area and on
				setTimeout(function() { handlePaste() }, 0);
			});
		}
	}

	function destroy() {
		_grid.onDragInit.unsubscribe(handleDragInit);
		_grid.onDragStart.unsubscribe(handleDragStart);
		_grid.onDrag.unsubscribe(handleDrag);
		_grid.onDragEnd.unsubscribe(handleDragEnd);
		_grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
		_grid.onSort.unsubscribe(handleActiveCellChange);
		_grid.getData().onRowCountChanged.unsubscribe(handleActiveCellChange);
	}

	function handleDragInit(e, dd) {
      // prevent the grid from cancelling drag'n'drop by default
      e.stopImmediatePropagation();
    }

    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);
      if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
        if (_grid.canCellBeSelected(cell.row, cell.cell)) {
          _dragging = true;
          e.stopImmediatePropagation();
        }
      }
      if (!_dragging) {
        return;
      }

      var start = _grid.getCellFromPoint(
          dd.startX - $(_canvas).offset().left,
          dd.startY - $(_canvas).offset().top);

      dd.range = {start: start, end: {}};
		
	  //return _decorator.show(new Slick.Range(start.row, start.cell));
    }

    function handleDrag(e, dd) {
      if (!_dragging) {
        return;
      }
      e.stopImmediatePropagation();

      var end = _grid.getCellFromPoint(
          e.pageX - $(_canvas).offset().left,
          e.pageY - $(_canvas).offset().top);

      if (!_grid.canCellBeSelected(end.row, end.cell)) {
        return;
      }

      dd.range.end = end;
	  if (dd.range.start.row==end.row && dd.range.start.cell==end.cell)
		return;
		
	  _decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, end.row, end.cell));
    }
    
	function handleDragEnd(e, dd) {
	  if (!_dragging) {
        return;
      }

      _dragging = false;
      e.stopImmediatePropagation();

      _self.onCellRangeSelected.notify({
        range: new Slick.Range(
            dd.range.start.row,
            dd.range.start.cell,
            dd.range.end.row,
            dd.range.end.cell
        )
      });
	  
	  if (!$.browser.msie)
		_canvas.focus();	//focus the canvas so the keys work.
	}
	
	function handleCellRangeSelected(e, args) {
       _ranges = args.range;
    }
	
	function handleActiveCellChange(e, args) {
       _decorator.hide();
    }
	
	function collectGridData(includeHeaders) {
		var data = _grid.getData().getItems(),
			from = _ranges,
			rowTsv = "",
			columns = _grid.getColumns();
		
		_tsvData = "";	
		
		if (includeHeaders) {
			rowTsv = "";
			for (var j = 0; j <= from.toCell - from.fromCell; j++) {
				var col = columns[from.fromCell + j],
					fieldId = col.field;
					
				if (fieldId==undefined) {
					continue;
				}
				if ( rowTsv!="" ){
					rowTsv+="\t";
				}
				rowTsv += col.name;
			}
			_tsvData +=rowTsv;
		}
			
		for (var i = 0; i <= from.toRow - from.fromRow; i++) {
			if ( _tsvData!="" ) {
				_tsvData +="\n";
			}
			rowTsv = "";
			
			for (var j = 0; j <= from.toCell - from.fromCell; j++) {
				var fieldId = columns[from.fromCell + j].field;
				//ignore columns with no field. this includes built in columns
				if (fieldId==undefined) {
					continue;
				}
					
				if ( rowTsv!="" ){
					rowTsv+="\t";
				}
				
				//Format the values as needed.
				var cellVal = data[from.fromRow + i][fieldId];
				if (cellVal==undefined || cellVal==null)
					cellVal="";
				
				//replace tabs and new lines with spaces and ...
				if (typeof cellVal =="string") {
					cellVal = cellVal.replace(new RegExp( "\\t", "g" ),"     ");
					//cellVal = cellVal.replace(new RegExp( "\\n", "g" ),"...");
					if (cellVal.search(new RegExp( "\\n", "g" ))>-1) {
						cellVal = '"' + cellVal + '"'
					}
				}
			  	rowTsv += cellVal;
			}
			_tsvData +=rowTsv;
		}
	}
	
	function excelExport() {
		//set ranges to all then trigger a ctrl c
		_ranges = new Slick.Range(
            0,
            0,
            _grid.getFilteredData().length-1,
            _grid.getColumns().length-1
	    );
		collectGridData(true);
		downloadFile(_tsvData);
	}
		
	function downloadFile(data) {
		var form = $("<form></form>").appendTo("body")
			.attr("action", options.exportScriptUrl)
			.attr("method", "POST");

		  $("<input type='hidden'/>").appendTo(form)
			.attr("name", "data")
			.attr("value", data);
			
		  $("<input type='hidden'/>").appendTo(form)
			.attr("name", "filename")
			.attr("value", options.exportFileName);
			
		  form.submit();
		  form.remove();
	}
	
	function copyToClipBoard(includeHeaders){
		collectGridData(includeHeaders);
		
		if (window.clipboardData) {
			clipboardData.setData("Text", _tsvData);
		} else {
			var cellPos = $(".slick-cell-range-select").position();
			var input = getHiddenInput();
			input.css({left: cellPos.left+"px", top: cellPos.top+"px"});
			input.val(_tsvData).focus().select();
		} 
	}
	
	function directFocus() {
		this._focused = document.activeElement;
		var cellPos = $(".slick-cell-range-select").position(),
			textArea = getHiddenInput();
			
		textArea.css({left: cellPos.left+"px", top: cellPos.top+"px"});
		textArea.val("").focus().select();
	}
	
	function handlePaste() {
		if (typeof _ranges == "undefined")
			return;
			
		$(this._focused).val("").focus();
		var contents = "",
			to = _ranges,
			data = _grid.getData().getItems(),
			columns = _grid.getColumns();
		
		if (window.clipboardData) {
			contents = window.clipboardData.getData("Text");
		} else {
			contents = getHiddenInput().val();
		}
		
		var rows = contents.split("\n");
		//paste from the cell out.
		for (var i = 0; i <= rows.length-1; i++) {
			if (rows[i]=="" && i==rows.length-1)	//skip last empty row in excel.
				continue;
				
			var cols = rows[i].split("\t");
			for (var j = 0; j <= cols.length-1; j++) {
				var editable = columns[to.fromCell +j].editable;
				if (!(editable==undefined ? true : editable))
					continue;
					
				data[to.fromRow + i][columns[to.fromCell +j].field] = (cols[j]=="undefined" ? "" : cols[j]);
				_grid.invalidateRow(to.fromRow + i);
			}
		}
		_grid.render();
		
		if (_grid.getOptions().showSummaryRow) {
			_grid.updateSummaryRow();
		}	
	}
	
	function getHiddenInput() {
		if (!_textarea) {
			_textarea= $("<textarea></textarea>").appendTo($(_canvas)).css({"position":"absolute" , "z-index":"-1" });
		}
		return _textarea;
	}
	
    $.extend(this, {
      "init": init,
      "destroy": destroy,
	  "name": "CellRangeSelector",
	  
      "onBeforeCellRangeSelected": new Slick.Event(),
      "onCellRangeSelected": new Slick.Event(),
	  "excelExport": excelExport
	});
  }
})($);

/*
* Paging Control.
*/
(function($) {
    function SlickGridPager(dataView, grid, $container)
    {
        var $status;
		var $nextButton;
		var $prevButton;
		var $lastButton;
		var $firstButton;
		var $records;	//show number of records
	
        function init()
        {
            dataView.onPagingInfoChanged.subscribe(function(e,pagingInfo) {
                updatePager(pagingInfo);
            });

            constructPagerUI();
            updatePager(dataView.getPagingInfo());
        }

		function getNavState()
		{
			var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
			var pagingInfo = dataView.getPagingInfo();
			var lastPage = Math.floor(pagingInfo.totalRows/pagingInfo.pageSize);
			
			if (Math.floor(pagingInfo.totalRows/pagingInfo.pageSize)==pagingInfo.totalRows/pagingInfo.pageSize)
				 lastPage -= 1;
				 
            return {
                canGotoFirst:	!cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoLast:	!cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
                canGotoPrev:	!cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoNext:	!cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
                pagingInfo:		pagingInfo,
                lastPage:		lastPage
            }
        }

        function setPageSize(n)
        {
            dataView.setRefreshHints({
                isFilterUnchanged: true
            });
            dataView.setPagingOptions({pageSize:n});
        }
		
		function goToPage(input)
        {
			var n = parseInt(input.val()),
				state = getNavState();
			
			if ( n-1 > state.lastPage ) {
				n = state.lastPage+1;
				input.val(n);
			}
		
			if ( n <= 0 ) {	//do not allow zero or less than zero
				n = 1;
				input.val(n);
			}
			
			if (n!= input.data("oldVal")) {
				dataView.setPagingOptions({pageNum: n-1});	//page sizes are zero indexed...
				input.data("oldVal",n);
			}
		}
		
		function ensureValidKey(event) {
			//0-9
			if (event.keyCode >= 48 && event.keyCode <= 57) {
				return;
			}
			//numpad
			if (event.keyCode >= 91 && event.keyCode <= 105) {
				return;
			}
			//disallow the rest
			event.preventDefault(); 
		}
		
        function gotoFirst()
        {
            if (getNavState().canGotoFirst)
                dataView.setPagingOptions({pageNum: 0});
        }

        function gotoLast()
        {
            var state = getNavState();
            if (state.canGotoLast)
                dataView.setPagingOptions({pageNum: state.lastPage});
        }

        function gotoPrev()
        {
            var state = getNavState();
            if (state.canGotoPrev)
                dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum-1});
        }

        function gotoNext()
        {
            var state = getNavState();
            if (state.canGotoNext)
                dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum+1});
        }

        function constructPagerUI()
        {
            $container.empty();

            var $navLeft = $("<span class='slick-pager-nav' />").appendTo($container);
    
			var pagingMode = grid.getOptions().pagingMode;
			var showButtons = (pagingMode==PagingModes.PagerServerSide || pagingMode==PagingModes.PagerClientSide);
			
            var icon_prefix = "<button type='button' class='inforGridPagingButton ";
            var icon_suffix = "></button>";
			
			if (showButtons) {
				$firstButton = $(icon_prefix + (Globalize.culture().isRTL ? " lastPage" : " firstPage") +"' title='"+Globalize.localize("First")+"'" + icon_suffix)
						.click(gotoFirst)
						.appendTo($navLeft);

				$prevButton = $(icon_prefix + (Globalize.culture().isRTL ? " nextPage" : " previousPage") +"' title='"+Globalize.localize("Previous")+"'" + icon_suffix)
						.click(gotoPrev)
						.appendTo($navLeft);
			
				$status = $("<span class='slick-pager-status' />").appendTo($container);
			
				if ($.browser.msie)
					$status.css("margin-top","-4px");
		
				var $navRight = $("<span class='slick-pager-nav' />").appendTo($container);
				
				$nextButton = $(icon_prefix + (Globalize.culture().isRTL ? " previousPage" : " nextPage") +"' title='"+Globalize.localize("Next")+"'" + icon_suffix)
				.click(gotoNext)
                    .appendTo($navRight);

				$lastButton = $(icon_prefix + (Globalize.culture().isRTL ? " firstPage" : " lastPage") +"' title='"+Globalize.localize("Last")+"'" + icon_suffix)
						.click(gotoLast)
						.appendTo($navRight);
						
				$container.children().wrapAll("<div class='slick-pager' />");
				if ($.browser.msie)
					$container.find(".slick-pager").css("padding-top","1px");
			}
			
			
			if (grid.getOptions().multiSelect==true) {
				if (showButtons)
					$("<span class='inforToolbarSpacer'></span>").appendTo($container);	
					
				$selectedRecords =	$("<div class='slick-records-status' />").appendTo($container);	 //show a selected count 
				$("<span class='inforToolbarSpacer'></span>").appendTo($container);	
			}
			$records = $("<div class='slick-record-status' />").appendTo($container);		//show number of records
		}
		
        function updatePager(pagingInfo) {
            var state = getNavState();
			var pagingMode = grid.getOptions().pagingMode;
			var showButtons = (pagingMode==PagingModes.PagerServerSide || pagingMode==PagingModes.PagerClientSide);
			
			if (showButtons) {
				//set the disabled button state
				if (!state.canGotoFirst) 
					$firstButton.attr("disabled","");
				else
					$firstButton.removeAttr("disabled");
					
				if (!state.canGotoLast) 
					$lastButton.attr("disabled","");
				else
					$lastButton.removeAttr("disabled");
					
				if (!state.canGotoNext) 
					$nextButton.attr("disabled","");
				else
					$nextButton.removeAttr("disabled","");
				
				if (!state.canGotoPrev) 
					$prevButton.attr("disabled","");
				else
					$prevButton.removeAttr("disabled","");
			
			
				//show the page status
				if (pagingInfo.totalRows == 0)	//show number of records START
				{ $status.css({"padding-top": "4px" ,"margin-top":""}).text(Globalize.localize("NoRecordsFound"));
					$container.find(".inforGridPagingButton").hide();
					$records.html("");
					if (grid.getOptions().multiSelect==true)
						$selectedRecords.html("");
					return;
				}	
				
				if (pagingInfo.pageSize == 0 || pagingInfo.pageSize == pagingInfo.totalRows) {
					$status.css("padding-top","4px").text(Globalize.localize("ShowingAll")+" " + pagingInfo.totalRows + " "+Globalize.localize("Rows"));
					$container.find(".inforGridPagingButton").hide();
					return;
				}
				
				//Show the status text...
				var pageNum = (pagingInfo.pageNum+1),
					floor = Math.floor(pagingInfo.totalRows/pagingInfo.pageSize),
					pageCount = (floor+1);
				 
				if (floor===pagingInfo.totalRows/pagingInfo.pageSize)
					pageCount = floor;
					
				$status.html(Globalize.localize("Page")+" <input "+($.browser.msie ? "style='width:12px;margin-top:1px'": "style='width:12px'")+" class='inforTextbox' value='"+ pageNum +"'/>" + " " + Globalize.localize("Of") + " " + pageCount);
				$status.css({"padding-top": "" ,"margin-top":""});
				if ($.browser.msie)
					$status.css("margin-top","-4px");
			
				var pageNumTextBox = $status.find("input");
				var timeout = null;
				pageNumTextBox.keydown(ensureValidKey).keyup(function(evt) {
					var $input = $(this);
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						goToPage($input);
					},700);
				 }).data("oldVal",pageNum);
				
				//adjust the width
				if (pageNumTextBox) {
					if (pageCount>10)
						pageNumTextBox.width(15);
						
					if (pageCount>100)
						pageNumTextBox.width(18);
					
					if (pageCount>1000)
						pageNumTextBox.width(20);
				}
			
				$container.find(".inforGridPagingButton").show();
			}
			
			//Show the record selections
			var recEnd = (pagingInfo.pageNum+1) * pagingInfo.pageSize;
			var recBegin = recEnd - (pagingInfo.pageSize - 1);
				
			if (!showButtons) {	//continuous or live scrolling.. or none
				recBegin = (pagingInfo.totalRows>0 ? 1 :0 );
			}
				
			recEnd = (recEnd > pagingInfo.totalRows) ? pagingInfo.totalRows : recEnd;
			
			if (grid.getOptions().pagingMode==PagingModes.None)
				recEnd= pagingInfo.totalRows;
			
			if (pagingMode==PagingModes.ContinuousScrolling)
				$records.html(Globalize.localize("Displaying") + " " + recBegin + " - " + pagingInfo.totalRows );
			else
				$records.html(Globalize.localize("Displaying") + " " + recBegin + " - " + recEnd + " " + Globalize.localize("Of") + " " + pagingInfo.totalRows );
		 
			if (grid.getOptions().multiSelect==true)
				$selectedRecords.html(Globalize.localize("Selected") + " 0" );
			
			if (pagingInfo.totalRows == 0)	{
				$records.html(Globalize.localize("NoRecordsFound"));
				if (grid.getOptions().multiSelect==true)
					$selectedRecords.html("");
			}	
			//Show the selected count
		}

        init();
    }

    // Slick.Controls.Pager
    $.extend(true, window, { Slick: { Controls: { Pager: SlickGridPager }}});
})($);

/*
* Column Picker Control.
*/
(function($) {
function InforGridColumnPicker(columns,grid,options) {
		var $menu;
		
		var defaults = {
			fadeSpeed: 250
		};

		function init() {
			options = $.extend({}, defaults, options);
			var isInLookup = $(grid.getCanvasNode()).closest(".inforLookupGridBoxShadow").length>0;
			
			$menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:"+(isInLookup ? 1044 :999)+";' />").appendTo(document.body);

			$menu.hoverIntent(
				function(){},
				function(e) { 
					$(this).fadeOut(options.fadeSpeed);
			});
			$menu.on("click", updateColumn);
		}

		function open(button) {
            $menu.empty();
			
			var $li, $input;
			
			for (var i=0; i<columns.length; i++) {
			
				if (columns[i].name=="" || columns[i].id=="#" || columns[i].id=="")
					continue;
				
				$li = $("<li />").appendTo($menu);

				$input = $("<input type='checkbox' class='inforCheckbox' />")
                        .attr("id", columns[i].id)
                        .data("id", columns[i].id)
                        .appendTo($li);
				
				$input.inforCheckbox().css({"left":"0" , "top":"0"});
				
                if (grid.getColumnIndex(columns[i].id) != null)
                    $input.setValue(true);	
				
				if ($.inArray(columns[i].id, ['selector', 'indicator-icon', '_checkbox_selector', 'drilldown'])< 0) 
				{	
					$("<label class='inforCheckboxLabel' for='" + columns[i].id + "' />")
					    .text(columns[i].name)
					    .appendTo($li);
				} 
			}
			
			var leftCss = button.offset().left-$menu.width();
			if (Globalize.culture().isRTL)
				leftCss = button.offset().left+3;
				
			$menu
				.css("top", button.offset().top)
				.css("left", leftCss )
				.fadeIn(options.fadeSpeed);
			
			//columns to skip from showing in the list
			$menu.find('#indicator-icon').closest('li').hide();
			$menu.find('#selector').closest('li').hide();
			$menu.find('#_checkbox_selector').closest('li').hide();
			$menu.find('#drilldown').closest('li').hide();
		}

		function updateColumn(e) {
			var $target = $(e.target);
			if ($target.is(":checkbox")) {
				//either hide or show this particular column
				 if ($target.is(":checked")) {
					grid.showColumn($target.attr("id"));
				 } else {
					grid.hideColumn($target.attr("id"));
				 }
				 grid.updateFilterRow();
			}
		}

		init();
			
		//Create callable methods...
		$.extend(this, {
			"open": open
		});
	}

	// Slick.Controls.ColumnPicker
	$.extend(true, window, { Slick: { Controls: { ColumnPicker: InforGridColumnPicker }}});
})($);

/* 
* Row Grouping and Totals.
*/
(function($) {
    $.extend(true, window, {
        Slick: {
            Data: {
                GroupItemMetadataProvider: GroupItemMetadataProvider
            }
        }
    });


    /*
     * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
     * This metadata overrides the default behavior and formatting of those rows so that they appear and function
     * correctly when processed by the grid.
     *
     * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
     * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
 	 */
    function GroupItemMetadataProvider(options) {
        var _grid;
        var _defaults = {
            groupCssClass: "slick-group",
            totalsCssClass: "slick-group-totals",
            groupFocusable: true,
            totalsFocusable: false,
            toggleCssClass: "inforExpandButton",
            toggleExpandedCssClass: "open",
            toggleCollapsedCssClass: "closed",
            enableExpandCollapse: true
        };

        options = $.extend(true, {}, _defaults, options);

        function defaultGroupCellFormatter(row, cell, value, columnDef, item) {
           	
			if (!options.enableExpandCollapse) {
                return item.title;
            }

            return "<span class='" + options.toggleCssClass + " " +
                    (item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) +
                    "'></span>" + item.title;
        }

        function defaultTotalsCellFormatter(row, cell, value, columnDef, item) {
            return (columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef)) || "";
        }
		
        function init(grid) {
            _grid = grid;
            _grid.onClick.subscribe(handleGridClick);
            _grid.onKeyDown.subscribe(handleGridKeyDown);

        }

        function destroy() {
            if (_grid) {
                _grid.onClick.unsubscribe(handleGridClick);
                _grid.onKeyDown.unsubscribe(handleGridKeyDown);
            }
		}

        function handleGridClick(e, args) {
            var item = this.getDataItem(args.row);
            if (item && item instanceof Slick.Group && $(e.target).hasClass(options.toggleCssClass)) {
                if (item.collapsed) {
                    this.getData().expandGroup(item.value);
                }
                else {
                    this.getData().collapseGroup(item.value);
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }

        // TODO:  add -/+ handling
        function handleGridKeyDown(e) {
            if (options.enableExpandCollapse && (e.which == $.ui.keyCode.SPACE)) {
                var activeCell = this.getActiveCell();
                if (activeCell) {
                    var item = this.getDataItem(activeCell.row);
                    if (item && item instanceof Slick.Group) {
                        if (item.collapsed) {
                            this.getData().expandGroup(item.value);
                        }
                        else {
                            this.getData().collapseGroup(item.value);
                        }

                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                }
            }
        }

        function getGroupRowMetadata() {
            return {
                selectable: false,
                focusable: options.groupFocusable,
                cssClasses: options.groupCssClass,
                columns: {
                    0: {
                        colspan: "*",
                        formatter: defaultGroupCellFormatter,
                        editor: null
                    }
                }
            };
        }

        function getTotalsRowMetadata() {
            return {
                selectable: false,
                focusable: options.totalsFocusable,
                cssClasses: options.totalsCssClass,
                formatter: defaultTotalsCellFormatter,
                editor: null
            };
        }
		
        return {
            "init":     init,
            "destroy":  destroy,
            "getGroupRowMetadata":  getGroupRowMetadata,
            "getTotalsRowMetadata": getTotalsRowMetadata
        };
    }
})($);

/*
* Infor DataGrid Plugin wraper.
*/
(function($) {
	
	var sortcol = "json_number";
	var slickOptions = {};
	
	PagingModes = {
		None : "None",
		LiveScrolling : "LiveScrolling",	//not supported yet...
		PagerServerSide : "PagerServerSide",
		ContinuousScrolling : "ContinuousScrolling",
		PagerClientSide : "PagerClientSide"
	}
	
	$.fn.inforDataGrid = function(options) {
	
		/* The Settings available for this control only. */		
		var settings = {
			columns: null,  //The Column Collection
			dataset: [], //The JSON data
			idProperty:'id', //The field name that is the unique key field in the data
			editable: true, //If true you can enter cells and edit
			showCheckboxes:true, //Should we show the row selection checkboxes
			showDrillDown: true,  //Should we show the drill down column.
			drillDown: null,	  //The Drill Down Callback function when a drill down is clicked
			drillDownTooltip: null,	//a drill down tooltip.
			showStatusIndicators: true, //Should we show the status indicator: new/edit/error indicator
			showGridSettings: true, //should we show the grid settings button on the top left
			showFilter: true,	//Should we display the Filter Bar and filtering options.
			forceFitColumns: false, //allow the columns to resize to fit the width the screen for a small number of columns.
			multiSelect: true, //can we select more than one row at a time.
			showHeaderContextMenu: true,
			enableRowReordering: false,	//allow rows to be reordered...
			showFooter: false, 	//show the paging footer?
			enableCellNavigation: true,	//can click into cells.
			pageSize: 0,	//Paging Page size. 0 = all rows no paging. Reccomend 50, 100 or 200.
			pagingMode: PagingModes.None,		// see PagingModes
			enableGrouping: false,	//Enable the grouping features.
			rowHeight: 25,	//Change This if using multiline editor
			fillHeight: true,	//should the grid size itself to the bottom of the page. use if grid is on the bottom and nothing underneath
			savePersonalization: true,	//should the personalization settings be saved in a cookie? Or you use onPersonalizationChanged
			enableCellRangeSelection: true,	//allows you to select/copy a range of cells.
			showExport: false,	//adds an export function to the footer.
			exportScriptUrl: "http://usmvvwdev67.infor.com:8000/Html5Controls/Services/ExcelRelay.php",
			exportFileName: "Export.xls",
			showColumnHeaders: true,	//hide headers
			filterMenuOptions: [{label: Globalize.localize("RunFilter"), href: "#rf" },
								{label: Globalize.localize("FilterWithinResults"), id: "filterInResults" , href: "#fwr"},
								{label: Globalize.localize("ClearFilter"), href: "#cf"},
								{label: Globalize.localize("SavedFilters"), href: "#sf"}
							   ],	//Configurable list of options and actions for the grid filter menu
			gridMenuOptions: [{label: Globalize.localize("ShowFilterRow"), href: "#sfr", cssClass: "selected", id: "showFilter" },
							  {label: Globalize.localize("ColumnPersonalization"), href: "#cp", cssClass: "columns" },
							  {label: Globalize.localize("ResetToDefault"), href: "#re"},
							  {label: Globalize.localize("ExportToExcel"), href: "#ex", cssClass: "separator export", condition: options.showExport }
							 ]//Configurable list of options and actions for the grid menu button
		};
		
		var selectedRowIds = [];	//Used for Filtering
		var gridObj = null;
		var dataView = null;
		
		var o = $.extend({}, settings, options); //Extend the options if any provided
		var $grid = $(this);
		
		/* Add Class for some default styling. */		
		$grid.addClass('inforDataGrid');
		
		/* The Mapped Settings to the Slick grid */		
		slickOptions = {
			editable: o.editable,
			enableCellNavigation: o.enableCellNavigation,
			autoEdit: true,
			multiSelect: o.multiSelect,
            showHeaderRow: true,
			showSummaryRow: o.showSummaryRow,
			enableColumnReorder: true,
			topPanelHeight: 25,
			forceFitColumns: o.forceFitColumns,
			showFilter: o.showFilter,
			enableRowReordering: o.enableRowReordering,
			autoHeight: o.autoHeight,
			autoHeightToPageSize: o.autoHeightToPageSize,
			pagingMode: o.pagingMode,
			drillDownTooltip: o.drillDownTooltip,
			showFooter: o.showFooter,
			fillHeight: o.fillHeight,
			filterMenuOptions: o.filterMenuOptions,
			gridMenuOptions: o.gridMenuOptions,
			rowHeight: o.rowHeight,
			enableCellRangeSelection: o.enableCellRangeSelection,
			idProperty : o.idProperty,
			showColumnHeaders: o.showColumnHeaders
		};
		
		if (o.enableObjectSupport) {
			slickOptions.dataItemColumnValueExtractor = function(item, columnDef) {
				if (columnDef == undefined || columnDef.field == undefined)
					return "";
					
				var names = columnDef.field.split('.'),
					val   = item[names[0]];

				for (var i = 1; i < names.length; i++) {
				  if (val && typeof val == 'object' && names[i] in val) {
					val = val[names[i]];
				  } else {
					val = '';
				  }
				}

				return val;
			}
		}
		
		if (o.multiSelect==false)
			o.showCheckboxes = false;
			
		/*Setup additional stuff based on settings*/
		var newColumns = [];
        if (o.showStatusIndicators) {
			newColumns.push({ id: "indicator-icon", sortable:false, reorderable:false, selectable: false, resizable: false, width: 16, formatter: IndicatorIconFormatter, cssClass: "status-indicator non-data-cell" });
        }
		
		if (o.showCheckboxes) {
			var checkboxSelector = new Slick.CheckboxSelectColumn({ cssClass: "slick-cell-checkboxsel" });
		    newColumns.push(checkboxSelector.getColumnDefinition());
		}
		
		if (o.showDrillDown)
			newColumns.push({ id: "drilldown", selectable: false, reorderable:false, sortable:false, resizable: false, width: 18, formatter: DrillDownCellFormatter, editability: o.drillDownEditability ,  cssClass: "non-data-cell" });
				
		//Setup the Grid columns..
		o.columns = newColumns.concat(o.columns);
		
		//Create a DataView Which is used during sorting and selection.
		dataView = new Slick.Data.DataView({idProperty: o.idProperty, pagingMode: o.pagingMode });
		gridObj =  new Slick.Grid($grid, dataView, o.columns, slickOptions);
		$grid.data("gridInstance",gridObj);	//save a ref ro the grid so it can be accessed by selector.
		
		//re-render grid when dataView changes
		dataView.onRowCountChanged.subscribe(function (e, args) {
			gridObj.updateRowCount();
			gridObj.render();
		});
		
		// Subscribe to events to update row selection
		dataView.onRowsChanged.subscribe(function (e, args) {
			gridObj.invalidateRows(args.rows);
			gridObj.render();

			if (selectedRowIds.length > 0) {
				// since how the original data maps onto rows has changed,
				// the selected rows in the grid need to be updated
				var selRows = [];
				for (var i = 0; i < selectedRowIds.length; i++) {
					var idx = dataView.getRowById(selectedRowIds[i]);
					if (idx != undefined)
						selRows.push(idx);
				}
				gridObj.setSelectedRows(selRows);
			}
			if (o.showSummaryRow)
				gridObj.updateSummaryRow();
		});
		
		gridObj.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	
		if (o.showCheckboxes)
			gridObj.registerPlugin(checkboxSelector);
		
		if (o.showFooter && $grid.next(".inforGridFooter").length==0) {
			var $footer = $('<div class="inforGridFooter"></div>');
		}
		
		//Render the gridObj.
		dataView.beginUpdate();
		dataView.setItems(o.dataset);
		dataView.setFilter(gridObj.filter);
		
		dataView.endUpdate();
		gridObj.invalidate();	//already calls: gridObj.render();
	
		if (o.pagingMode==PagingModes.ContinuousScrolling) {
			dataView.activeReq = false;
			var curPage = 0;
			gridObj.onViewportChanged.subscribe(function(e,args) {
                 var vp = gridObj.getViewport(),
				     toPage = Math.floor(vp.bottom / o.pageSize);
				
				if (toPage>curPage && !dataView.activeReq) {
					curPage++;
					dataView.setPagingOptions({pageNum: toPage});
				}
			});
			//load the first page - must be done in view.
		}
		
		var $viewport = $grid.find(".slick-viewport");
		if (o.pagingMode!=PagingModes.None) {
			dataView.onDataLoading.subscribe(function(e,args) {
				$viewport.inforLoadingIndicator();
				$viewport.css("overflow","hidden");
			});
			
			dataView.onDataLoaded.subscribe(function(e,args) {
				$viewport.inforLoadingIndicator("close");
				$viewport.css("overflow","auto");
			});
		}
		
		if (o.showFooter && $grid.next(".inforGridFooter").length==0) {
			var $footer = $('<div class="inforGridFooter"></div>');
			$grid.after($footer);
			dataView.setPagingOptions({pageSize:o.pageSize});
			new Slick.Controls.Pager(dataView, gridObj, $footer);
		}
		
		//Attach Cell Change Event to Track Status
		if (o.showStatusIndicators) {
			gridObj.onCellChange.subscribe(function (e, args) {
				// Set dirty icon when a cell is edited but not new
				if (args.item.indicator != "new") {
					args.item.indicator = "dirty";
				}
				// Refresh the row with proper styling
				gridObj.invalidateRow(args.row);
				gridObj.render();
			});
		}
		
		//Attach Validation Events to show validation indicator
		gridObj.onValidationError.subscribe(function (e, args) {
			// TODO: Style this! add red border
			$(args.cellNode).addClass("invalid");
			if (o.showStatusIndicators)
			{		
				var indicatorIcon = $(args.cellNode.parentNode).children(".status-indicator").children(".indicator-icon")
				$(indicatorIcon).addClass("error-icon");
				
				//add tooltip
				if (args.validationResults.msg)
					$(indicatorIcon).attr("title",args.validationResults.msg).inforToolTip({isErrorTooltip:true});
				else
					$(indicatorIcon).attr("title","");
			}
		});

		//Style Adjustments
		styleNonDataHeaders(o);

		// The headers will be recreated, so restlying is necessary
		gridObj.onColumnsReordered.subscribe(function (e, args) {
			styleNonDataHeaders(gridObj.getOptions());
		});
		
		//Setup the Sorting
		gridObj.onSort.subscribe(function (e, args) {
			if (args.sortCol == undefined)
				return;	//happens when the user hides the sorted column 
				
			sortdir = args.sortAsc ? 1 : -1;
			sortcol = args.sortCol.field;
			dataView.sort(comparer, args.sortAsc);
			gridObj.attachHoverEvents();
		});
		
		//attach the click event and button events and drill down.
		gridObj.onClick.subscribe(function(e,args) {
			if ($(e.target).hasClass("drilldown") && o.drilldown!=undefined) {
				//cell is uneditable.
				if ($(e.target).parent().hasClass("uneditable"))
					return;
					
				gridObj.getEditorLock().commitCurrentEdit();
				
				var item = dataView.getItem(args.row);
				o.drilldown(item);
			}
			
			//handle Grid buttons
			if ($(e.target).hasClass("gridButton")) {
				var columnId = $(e.target).attr("data-columnid");
				if (columnId!=undefined) {
					var columns = gridObj.getColumns(),
						idx = gridObj.getColumnIndex(columnId),
						columnDef = columns[idx];
					
					if (columnDef.buttonClick!=undefined)
						columnDef.buttonClick(dataView.getItem(args.row));
				}
			}
			
			/*handle Tree Expand*/
			if ($(e.target).hasClass("inforExpandButton") && gridObj.getOptions().treeGrid) {
			  var item = gridObj.getData().getItem(args.row);
			  if (item) {
				if (item.collapsed) {
				  item.collapsed = false;
				} else {
				  item.collapsed = true;
				} 
				gridObj.getData().updateItem(item[o.idProperty], item);
			  }
			  e.stopImmediatePropagation();
			}
		}); 
	
		// keep track of which rows are selected, in order to 
		// reselect them when sorting
		gridObj.onSelectedRowsChanged.subscribe(function (e, args) {
		    selectedRowIds = [];
			var rows = gridObj.getSelectedRows();
		    for (var i = 0, l = rows.length; i < l; i++) {
				var item = dataView.getItem(rows[i]);
				if (item) selectedRowIds.push($(item).attr(o.idProperty));
			}
            gridObj.attachHoverEvents();
		});

		if (o.showGridSettings) 
			gridObj.showGridSettings();
		
		gridObj.showFilterRow();
		
		if (o.showHeaderContextMenu)
			gridObj.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
		
		//Row reordering
		if (o.enableRowReordering) {
			var moveRowsPlugin = new Slick.RowMoveManager();
			moveRowsPlugin.onBeforeMoveRows.subscribe(function(e,data) {
				 for (var i = 0; i < data.rows.length; i++) {
                    // no point in moving before or after itself
                    if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
                        e.stopPropagation();
                        return false;
                    }
                }
                return true;
            });
			moveRowsPlugin.onMoveRows.subscribe(function(e,args) {
				
				var extractedRows = [], left, right;
                var rows = args.rows;
                var insertBefore = args.insertBefore;
				var data = gridObj.getData().getItems();
				
				left = data.slice(0, insertBefore);
				right = data.slice(insertBefore, data.length);
				
				// Put in table order - the selection doesn't guarantee this 
				rows.sort(function(a,b){return a-b});

				for (var i=0; i<rows.length; i++) {
					extractedRows.push(data[rows[i]]);
				}

				// Need to sort reverse numerically or else the splices below fail badly
				rows.reverse();

				for (var i=0; i<rows.length; i++) {
					var row = rows[i];
					if (row < insertBefore)
						left.splice(row,1);
					else
						right.splice(row-insertBefore,1);
				}

				data = left.concat(extractedRows.concat(right));

				var selectedRows = [];
				for (var i=0; i<rows.length; i++)
					selectedRows.push(left.length+i);

                gridObj.resetActiveCell();
				gridObj.updateData(data);
				gridObj.setSelectedRows(selectedRows);
				gridObj.render();
				gridObj.trigger(gridObj.onRowsMoved, { movedRows: extractedRows, positions: gridObj.getSelectedRows()});
			});

            gridObj.registerPlugin(moveRowsPlugin);
		}
		
		if (o.savePersonalization) {
			var cookieId = window.location.pathname+'#'+$grid.attr("id");
			var cookieContents = $.cookie(cookieId);
		}
		
		//process hidden columns
		for (var i=0; i< o.columns.length; i++) {
			var col = o.columns[i];
			if (col.hidden==true)
				gridObj.hideColumn(col.id);
	    }
		
		//save personalization in a cookie and restore settings
		if (o.savePersonalization) {
			gridObj.onPersonalizationChanged.subscribe(function (e, args) {
				delete args.grid;	//dont serialize the grid object.
				$.cookie(cookieId, JSON.stringify(args));//convert the JSON to a string...
			});
			
			//restore previous - convert from string to JSON.
			if (cookieContents != null)
				gridObj.restorePersonalization(eval('(' + cookieContents + ')'));
		}
		
		if (o.showSummaryRow)
			o.enableGrouping = true;	//needed to collect the grouping calcs..
			
		if (o.enableGrouping) {
			//Add grouping and sum totals
			var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
			dataView.groupItemMetadataProvider = groupItemMetadataProvider;
			
			// register the group item metadata provider to add expand/collapse group handlers
			gridObj.registerPlugin(groupItemMetadataProvider);
			
			//need this to update the footer when a cell changes
			gridObj.onCellChange.subscribe(function (e, args) {
				dataView.refresh();
			});
		}
		
		//Enable Updating Totals on the Summary Row
		if (o.showSummaryRow) {
         	gridObj.onCellChange.subscribe(function (e, args) {
				gridObj.updateSummaryRow();
			});
			
			dataView.onAggregatorsChanged.subscribe(function (e, args) {
				gridObj.updateSummaryRow();
			});
        }
		
		//excel copy and paste
		if (o.enableCellRangeSelection || o.showExport) {
			var _selector = new Slick.CellRangeSelector({enableCellRangeSelection: o.enableCellRangeSelection, exportScriptUrl:  o.exportScriptUrl, exportFileName: o.exportFileName});
			gridObj.registerPlugin(_selector);
		}
		
		//Add a Grid button and an Export Function
		if (o.showExport) {
			var exportButton = $('<button class="inforGridFooterButton export" title="Export to Excel" type="button"></button>');
			exportButton.click(function() {
				_selector.excelExport();
			});
			$grid.next(".inforGridFooter").prepend(exportButton);
		}
		
		return gridObj;
   };
   
	function handleHeaderContextMenu(e, args) {
		//prevent normal menu
		e.preventDefault();
		
		if (args.column==undefined)
			return;
			
		//add the menu
		$('body').append('<ul id="gridHeaderMenuOptions" class="inforContextMenu"><li class="sortAsc"><a href="#sortAsc">'+Globalize.localize("SortAscending")+'</a></li><li class="sortDesc"><a href="#sortDesc">'+Globalize.localize("SortDescending")+'</a></li><li><a href="#hide">'+Globalize.localize("HideColumn")+'</a></li></ul>');
		//figure out which column we are on
		
		var $header = $(e.currentTarget);
		$header.inforContextMenu({
			menu: 'gridHeaderMenuOptions',
			invokeMethod: 'immediate',
			event: e,
			srcElement: $header,
			offsetLeft: -10,
			offsetTop: 7
		}, function(action, el, pos, item) {
			if (action=="hide")
				args.grid.hideColumn(args.column.id);
				
			if (action=="sortAsc")
				args.grid.setSortColumn(args.column.id, true);
				
			if (action=="sortDesc")
				args.grid.setSortColumn(args.column.id, false);
		});
	} 
	
    // Update Headers to remove extra border and misc stuff.
	function styleNonDataHeaders() {
		var checkboxSelectorHeader = $('.slick-header-column[id*="checkbox_selector"]');
		checkboxSelectorHeader.addClass('non-data-column-header'); //remove left/right header borders

		var drilldownHeader = $('.slick-header-column[id*="drilldown"]');
		drilldownHeader.addClass('non-data-column-header');

		var iconHeader = $('.slick-header-column[id*="indicator-icon"]');
		iconHeader.addClass('non-data-column-header');
		
		//The last non-selectable column gets an extra border.
		$(".non-data-column-header:last").addClass('non-data-column-header-last');
	}
	
	// Sorting algorithm
	function comparer(a, b) {
		var x = a[sortcol], y = b[sortcol];
		
		if (typeof a[sortcol] =="string" && typeof b[sortcol] =="string")
		{	// case insensitive sorting
			x = a[sortcol].toLowerCase();
			y = b[sortcol].toLowerCase();
		} else
		{
			x = a[sortcol];
			y = b[sortcol];
			
			if ((x==undefined || x==null))
				return -1;
			
			if ((y==undefined || y==null))
				return 1;
				
		}
		return (x == y ? 0 : (x > y ? 1 : -1));
	}
	
	// Add Ends With to String prototype
	String.prototype.endsWith = function (s) {
	  return this.length >= s.length && this.substr(this.length - s.length) == s;
	}
	
    $.fn.hasHScrollBar = function() {
        return this.get(0).scrollWidth > this.width();
    }
	
	// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	var cache = {};
	this.tmpl = function tmpl(str, data) {
	  // Figure out if we're getting a template, or if we need to
	  // load the template - and be sure to cache the result.
	  var fn = !/\W/.test(str) ?
		  cache[str] = cache[str] ||
		  tmpl(document.getElementById(str).innerHTML) :

		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			  str
				  .replace(/[\r\t\n]/g, " ")
				  .split("<%").join("\t")
				  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
				  .replace(/\t=(.*?)%>/g, "',$1,'")
				  .split("\t").join("');")
				  .split("%>").join("p.push('")
				  .split("\r").join("\\'") + "');}return p.join('');");

	  // Provide some basic currying to the user
	  return data ? fn(data) : fn;
	};
}($));
/*
	Infor Context Menu - Allows you to immediately excute or attach a single level menu to 
*/
if(jQuery)( function($) {
	$.extend($.fn, {
		inforContextMenu: function(o, callback) {
			// Defaults
			if( o.menu == undefined ) return false;
			if (o.invokeMethod == undefined )	o.invokeMethod = "rightClick" ;
			if (o.positionBelowElement == undefined )	o.positionBelowElement = false ;
			if (o.offsetLeft == undefined )	o.offsetLeft = null;
			if (o.offsetTop == undefined )	o.offsetTop = null;
			if (o.position == undefined )	o.position = null;
			
			//For immediate Action (used in the data grid right click).
			if (o.event == undefined )	o.event = null ;
			if (o.srcElement == undefined )	o.srcElement = null ;
			if (o.beforeOpening== undefined )	o.beforeOpening = null ; 	//called before the menu is opened.
			var self = $(this);
			 
			// Loop each context menu
			self.each( function() {
				var el = $(this);
				var offset = el.offset();
				var $menuElem = $('#' + o.menu);
				
				// Add contextMenu class
				if (!$menuElem.hasClass('inforMenuOptions'))	{	//already wrapped..
					$menuElem.addClass('inforMenuOptions');
					$('body').append('<div class="inforMenu" id="'+o.menu+'Container"><table cellspacing="0" cellpadding="0" class="" style="width: auto"><tbody><tr class="menuTop"><td class="menuTopLeft"></td><td class="menuTopCenter"></td><td class="menuTopRight"></td></tr><tr class="menuMiddle"><td class="menuMiddleLeft"></td><td class="menuMiddleCenter"><div class="menuMiddleCenterInner menuContent"></div></td><td class="menuMiddleRight"></td></tr><tr class="menuBottom"><td class="menuBottomLeft"></td><td class="menuBottomCenter"></td><td class="menuBottomRight"></td></tr></tbody> </table></div>');
					$('#' + o.menu+"Container").find(".menuContent").append($menuElem);
				}
				
				// Simulate a true right click
				if (o.invokeMethod == "rightClick") {
					el.mousedown( function(e) {
						var evt = e;
						evt.stopPropagation();
					
						$(this).mouseup( function(e) {
							e.stopPropagation();
							var srcElement = $(this);
							$(this).unbind('mouseup');
							if( evt.button == 2 ) 
							{	
								if (o.beforeOpening)
									o.beforeOpening();
									
								$(this).openMenu(e,o,el,callback,offset,evt,srcElement);
							}
						});
					});
				} else if (o.invokeMethod == "click"){
					el.click( function(e) {
						var evt = e;
						e.stopPropagation();
						var srcElement = $(this);
						if( evt.button == 0 ) 
						{	
							if (o.beforeOpening)
								o.beforeOpening();
							
							$(this).openMenu(e,o,el,callback,offset,evt,srcElement);
						}
					});
				} else if (o.invokeMethod == "submenu"){
					el.data("open", function(e) {
						var srcElement = el;
						if (o.beforeOpening)
							o.beforeOpening();
						
						srcElement.openMenu(e,o,el,callback,offset,e,srcElement);
						return $('#' + o.menu+"Container");
					});
					
					el.hover( function(e) {
						var openFunc = el.data("open");
						openFunc(e);
					});
					
					$('#' + o.menu+"Container").addClass("submenu");
					el.siblings("li:not(.arrow)").hoverIntent( function(e){
						if ($(this).hasClass("arrow")) {
							return;
						}
						$(".inforMenu.submenu").hide();
					}, function() {});
					
				} else if (o.invokeMethod == "toggle"){
					el.click( function(e) {
						
						if (!$(this).is(":enabled"))
							return;
						
						if (o.beforeOpening)
							o.beforeOpening();
							
						var menu = $('#' + o.menu);
						var isOpen = menu.data("isOpen");
						var menusOnForm = $(".inforMenuOptions");
						$('#' + o.menu+"Container").hide();
						menusOnForm.hide();
						
						menusOnForm.data("isOpen",false);
						
						if (isOpen==true) {
							menu.data("isOpen",false);
						}
						else {
							var evt = e;
							e.stopPropagation();
							var srcElement = $(this);
							if( evt.button == 0 ) 
							{	
								$(this).openMenu(e,o,el,callback,offset,evt,srcElement);
							}
							menu.data("isOpen",true);
						}
					});
				} else if (o.invokeMethod == "immediate"){
					if (offset==null)
						offset=$('body').offset();
						
					el.openMenu(o.event,o,el,callback,offset,o.event,o.srcElement);
				}
				
				// Disable text selection
				if( $.browser.mozilla ) {
					$('#' + o.menu).each( function() {el.css({ 'MozUserSelect' : 'none' }); });
				} else if( $.browser.msie ) {
					$('#' + o.menu).each( function() { el.bind('selectstart.disableTextSelect', function() { return false; }); });
				} else {
					$('#' + o.menu).each(function() { el.bind('mousedown.disableTextSelect', function() { return false; }); });
				}
				// Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
				$(el).add($('.inforMenu')).bind('contextmenu', function() { return false; });
				
			});
			return self;
		},
		
		closeMenu: function(o) {
			var $menu = $(this);
			
			$(document).unbind('click').unbind('keypress.'+$menu.attr("id"));
			$(".inforTabset").find("a").unbind('mousedown');
			
			$menu.fadeOut(150);
			$menu.data("isOpen",false);
			
			var menu = $('#' + o.menu);
			menu.data("isOpen",false);
			var menusOnForm = $(".inforMenuOptions");
			$('#' + o.menu+"Container").hide();
			menusOnForm.hide();
			menusOnForm.data("isOpen",false);
			menusOnForm.closest(".inforMenu").hide();
	
			if (o.onClose)
				o.onClose(menu);
				
			return true;
		}, 
		
		openMenu: function(e, o, el, callback, offset, evt, srcElement, deffered) {
			if ($('#' + o.menu+"Container").is(":visible"))
				return;
				
			// Hide context menus that may be showing excluding the parent menu
			var menusOnForm = null;
			if (srcElement!=undefined)
				menusOnForm = $(".inforMenu").not(srcElement.closest(".inforMenu")).not(srcElement.data("parentMenu"));
			else
				menusOnForm =  $(".inforMenu");
				
			menusOnForm.hide();
			$('#' + o.menu+"Container").hide();
			
			//hide any visible tooltips
			$("#inforTooltip").hide();
			
			if ($(el).hasClass('disabled'))
				return false;
			
			// Detect mouse position
			var d = {}, x, y;
			
			if (!o.position) {
				if (!o.positionBelowElement) {
					if( self.innerHeight ) {
						d.pageYOffset = self.pageYOffset;
						d.pageXOffset = self.pageXOffset;
						d.innerHeight = self.innerHeight;
						d.innerWidth = self.innerWidth;
					} else if( document.documentElement &&
						document.documentElement.clientHeight ) {
						d.pageYOffset = document.documentElement.scrollTop;
						d.pageXOffset = document.documentElement.scrollLeft;
						d.innerHeight = document.documentElement.clientHeight;
						d.innerWidth = document.documentElement.clientWidth;
					} else if( document.body ) {
						d.pageYOffset = document.body.scrollTop;
						d.pageXOffset = document.body.scrollLeft;
						d.innerHeight = document.body.clientHeight;
						d.innerWidth = document.body.clientWidth;
					}
					(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
					(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;
					
				} else {
					x = $(el).offset().left;
					y = $(el).offset().top+$(el).height()-1;
				}
			}
			
			var $menu = $('#' + o.menu).closest(".inforMenu"),
				$container = $('#' + o.menu+"Container");
				
			
			
			// Hover events
			$menu.find('A').mouseover( function() {
				$menu.find('LI.hover').removeClass('hover');
				$(this).parent().addClass('hover');
			}).mouseout( function() {
				$menu.find('LI.hover').removeClass('hover');
			});
			
			// Keyboard
			$(document).unbind("keypress."+$menu.attr("id")).bind("keypress."+$menu.attr("id"),function(e) {
				var openSubs = $(".inforMenu.submenu:visible");
				if (openSubs.length>0 && openSubs.attr("id")!=$menu.attr("id")) {
					return;
				}
				switch( e.keyCode ) {
					case 38: // up
						if( $menu.find('LI.hover').size() == 0 ) {
							$menu.find('LI:last').addClass('hover');
						} else {
							$menu.find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
							if( $menu.find('LI.hover').size() == 0 ) $menu.find('LI:last').addClass('hover');
						}
					break;
					case 40: // down
						if( $menu.find('LI.hover').size() == 0 ) {
							$menu.find('LI:first').addClass('hover');
						} else {
							$menu.find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
							if( $menu.find('LI.hover').size() == 0 ) $menu.find('LI:first').addClass('hover');
						}
						e.stopPropagation();
					break;
					case 39: // left
						var li = $menu.find('LI.hover.arrow');
						var openFunc = li.data("open");
						if (openFunc) {
							var subMenu = openFunc(e);
							subMenu.find('LI:first').addClass('hover');
							subMenu.find("a").focus();
							subMenu.data("parentLi",li);
							li.removeClass("hover");
						}
					break;
					case 37: // right
						var li = $menu.find('LI.hover.arrow');
						if ($menu.hasClass("submenu")) {
							//$menu.hide();
							$menu.hide();
							if ($menu.data("parentLi"))
								$menu.data("parentLi").addClass('hover').find("a").focus();
							li.removeClass("hover");
						}	
					break;
					case 13: // enter
						$menu.find('LI.hover A').trigger('click');
					break;
					case 27: // esc
						$(document).trigger('click');
					break
				}
			});
			
			//Handle Selection of Menu Items
			$('#' + o.menu).find('A').unbind('click');
			$('#' + o.menu).find('LI:not(.disabled):not(.headerText) A').click( function() {
				if ($(this).parent().hasClass("arrow")) 
					return false;
				
				$(document).unbind('click').unbind('keypress.'+o.menu);
				
				var menu = $('#' + o.menu);
				menu.closeMenu(o);
				var action = "",
					item = $(this);
					
				if (item.attr("href"))
					action = item.attr("href").substr(1);
							
				// Callback
				if( callback ) 
					callback(action, $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y}, $(this) );
				
				return false;
			});
			
			// Hide bindings
			setTimeout(function() {
				$(document).bind("click.contextMenu", function(e) {
					if (e.button==2) //right click in mozilla
						return;
						
					$menu.closeMenu(o);
				});
			},1);
			
			//TODO Test this.
			$(".inforTabset").find("a").mousedown(function (e){
				$menu.closeMenu(o);
			});
			
			//Adjust the padding if there are no images
			var hasImages = false;
			
			$.each($menu.find('A'), function() { 
			  if ($(this).css("background-image")!='none' && !$(this).parent().hasClass("arrow")) {
					hasImages=true;
					return;
			  }
			});
			
			if (hasImages) {
				if (!Globalize.culture().isRTL)
					$menu.find('A').css({"padding-left":"22px", "margin-left":"3px"});
				else
					$menu.find('A').css({"padding-right":"22px", "margin-right":"3px"});
				
				//has a checkbox..
				$menu.find('A').parent(".checkbox").find('A').css("padding-left","6px");
				if (!Globalize.culture().isRTL)
					$menu.find('.headerText').css("margin-left","-13px");
				else
					$menu.find('.headerText').css("margin-left","3px");
			}
	
			//localize the grid options menu.
			if ($menu.attr("id")=="gridFilterMenuOptionsContainer") {
				$menu.find(".greaterThan a").html(Globalize.localize("GreaterThan"));
				$menu.find(".greaterThanOrEquals a").html(Globalize.localize("GreaterThanOrEquals"));
				$menu.find(".lessThan a").html(Globalize.localize("LessThan"));
				$menu.find(".lessThanOrEquals a").html(Globalize.localize("LessThanOrEquals"));
				$menu.find(".equals a").html(Globalize.localize("EqualsStr"));
				$menu.find(".doesNotEqual a").html(Globalize.localize("DoesNotEqual"));
				$menu.find(".contains a").html(Globalize.localize("Contains"));
				$menu.find(".doesNotContain a").html(Globalize.localize("DoesNotContain"));
				$menu.find(".isEmpty a").html(Globalize.localize("IsEmpty"));
				$menu.find(".isNotEmpty a").html(Globalize.localize("IsNotEmpty"));
				$menu.find(".startsWith a").html(Globalize.localize("StartsWith"));
				$menu.find(".doesNotStartWith a").html(Globalize.localize("DoesNotStartWith"));
				$menu.find(".endsWith a").html(Globalize.localize("EndsWith"));
				$menu.find(".doesNotEndWith a").html(Globalize.localize("DoesNotEndWith"));
				$menu.find(".eitherSelectedorNotSelected a").html(Globalize.localize("EitherSelectedorNotSelected"));
				$menu.find(".checked a").html(Globalize.localize("Selected").replace(":",""));
				$menu.find(".notChecked a").html(Globalize.localize("NotSelected"));
				$menu.find(".between a").html(Globalize.localize("Between"));
				$menu.find(".today a").html(Globalize.localize("Today"));
			}
		
			//Detect and Apply submenus.
			$.each($menu.find('li > ul'), function(i, val) { 
				var submenu = $(this);
					parentLi = submenu.parent("li").addClass("arrow")
					id = submenu.attr("id");
				
					if (id==undefined) {
						id = "submenu"+i;
						submenu.attr("id",id);
					}
					
					if (Globalize.culture().isRTL)
						submenu.parent("li").siblings("li").css("padding-left","10px");
					
					parentLi.data("parentMenu",$menu).inforContextMenu({
						menu: id,
						invokeMethod: "submenu",
						event: e,
						position : {
							 my: (Globalize.culture().isRTL ? "right top" : "left top"),
							 at:  (Globalize.culture().isRTL ? "left top" : "right top"),
							 of: parentLi,
							 offset: (Globalize.culture().isRTL ? "5 -8" : "-6 -8"),
							 collision: "flip"
						 }
					}, function(action, el, pos, item) {
						if( callback ) {
							var action = "";
							if (item.attr("href"))
								action = item.attr("href").substr(1);
							
							callback( action, $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y}, $(this) );
						}
					});	
			});
			
			if (Globalize.culture().isRTL)
				$menu.find('li.arrow').css("padding-left","0px");
			
			// Show the menu
			$(document).unbind('click.contextMenu');
			if (!deffered) {
				$('#' + o.menu).show();
				$container.show();
			}
			if (o.offsetLeft)
				x=x+o.offsetLeft;
			
			if (o.offsetTop)
				y=y+o.offsetTop;
			
			if (o.position) {
				$menu.position(o.position);
			} else {
				//Adjust if the menu wants to go off the right of the page:
				if (($container.width()+x+20)>=($(window).width()))
					x = $(window).width() - $container.width() - 5;
				
				$menu.css({ top: y, left: x, display: "inline" });
				
				//flip if the menu up if it wants go off the bottom
				if (y > $(window).height()-$container.height()) {
					y -= ($container.height()+(13));
					$menu.css({ top: y});
				}
			}
			
		},
		
	});
})(jQuery);

 /*
 * Infor Checkbox Control - Initially Contributed by Josh Russell (Riptide Software, Inc.)
 */
(function( $ ){
	var methods = {
		init : function( options ) { 
            return doInit(this,options);
		},
		isChecked : function( ) {
			return this.prop('checked');
		}
	};
  
	$.fn.inforCheckbox = function(method) {
	   // Method calling logic
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on inforCheckbox.' );
		}    
	}
	
	function doInit(els,options){
        /* Default settings */
    	var settings = {
    	   focusClass: 'inforCheckboxFocus',
    	   checkedClass: 'checked',
    	   disabledClass: 'disabled',
    	   readOnlyClass: 'readonly'
    	};
    	
    	/* Processing settings */
    	settings = $.extend(settings, options || {});
    	
    	/* Wrapping all passed elements */
    	return els.each(function() 
    	{
    		var $el = $(this); /* Reference to DOM Element*/
            var div = $('<div class="inforCheckbox" />'), span = $('<span />');
            
			if ($el.parent().parent().hasClass("inforCheckbox"))
				return;
				
			if ($el.is("div") && $el.hasClass("inforCheckbox"))
				return;
            
			// wrap the checkbox in a couple DOM elements so
            // that we can apply styles
    		$el.wrap(div).wrap(span);
    		
    		span = $el.parent();
    		div = span.parent();
    		
    		// the next thing is to hide the original checkbox 
    		// and add event handlers that will take care of
    		// styling
			var inlineCss=$el.attr("style");
			if (Globalize.culture().isRTL)
				$el.css("right","-4px");
			else
				$el.css("left","-4px");
				
    		$el.css({'opacity':0, "position": "relative", "top": "-1px"})
    			.focus(function(){
				 if ($el.attr("readonly") || $el.attr("disabled"))
						return;
						
    		      div.addClass(settings.focusClass);
    		  })
    		  .blur(function(){
    		     if ($el.attr("readonly") || $el.attr("disabled"))
						return;
				
				div.removeClass(settings.focusClass);
    		  })
    		  .click(function(){
					if ($el.attr("readonly") || $el.attr("disabled"))
						return;
				
					if(this.checked){
    		          span.addClass(settings.checkedClass);
    		      }
    		      else{
    		          span.removeClass(settings.checkedClass);
    		      }
				  div.addClass(settings.focusClass);
    		  });
            
			//carry over other css.
			if (inlineCss!=undefined) {
				div.attr("style",inlineCss);
			}
            // check the box by default
            if($el.attr('checked')){
                span.addClass(settings.checkedClass);
            }
            
            // disable the checkbox if it is supposed to be
            if($el.attr('disabled') && !$el.attr('readonly')){
                span.addClass(settings.disabledClass);
            }
            
            // set readonly if the checkbox is readonly
            if($el.attr('readonly')){
                // This is required because readonly on a checkbox is a bit counter intuitive.
                // The readonly attribute prevents the user from changing the value. However,
                // with a checkbox, checking/unchecking doesn't technically change the value;
                // rather it changes the state, which is not prevented by readonly. Adding
                // disabled prevents the checkbox from having its state changed. One drawback
                // to this approach is that while readonly checkboxes would still be submitted to
                // the server, disabled checkboxes wouldn't be.
                $el.attr('disabled','disabled');
                span.addClass(settings.readOnlyClass);
            }
            
            if($el.hasClass('partial')){
                $el.removeClass('partial');
                span.addClass('partial');
            }
			
			//hide it if its hidden initially
			if ($el.css("display")=="none") {
				$el.css("display","");
				var root = $el.closest("div.inforCheckbox");
				root.hide();
				if (root.next().hasClass("inforCheckboxLabel"))
					root.next().hide();
			}
			
			if ($el.css("visibility")=="hidden") {
				$el.closest("div.inforCheckbox");
				$el.css("visibility","");
				var root = $el.closest("div.inforCheckbox");
				root.hide();
				if (root.next().hasClass("inforCheckboxLabel"))
					root.next().css("visibility","hidden")
			}
    	});
	}
})(jQuery);



/**
 * Infor CheckGroup
 * This is a tree of checkboxes wherein the parent checkbox can have a partially checked state.
 * This plugin should be applied to an unordered list of checkboxes where there is one checkbox as
 * the parent and a sublist of checkboxes that will be the children.
 * <ul>
 *  <li><input type="checkbox" />
 *       <ul>
 *           <li><input type="checkbox" /></li>
 *           <li><input type="checkbox" /></li>
 *       </ul>
 *   </li>
 * Author: Josh Russell (Riptide Software, Inc.)
 * @depends: inforCheckBox
 */
 (function($){
    $.fn.inforCheckboxGroup = function(options) {
    
        // make sure we've got inforCheckbox
        if(typeof $().inforCheckbox == 'undefined'){
            $.error('inforCheckGroup dependency on inforCheckbox not satisfied');
        }
    
	   /* Default settings */
    	var settings = {
        };
    	
    	/* Processing settings */
    	settings = $.extend(settings, options || {});
    	
    	return this.each(function(){
    	   $el = $(this); // Wrap the reference to the DOM node - should be a ul
    	   
    	   var $parentCheckbox = $(':checkbox:first',$el),
    	       $childrenCheckboxes = $parentCheckbox.parents('li').find('ul :checkbox');
    	   
    	   // Set a partial state if some children are checked and others are not.
    	   // This functionality depends on the way inforCheckbox handles finding a 
    	   // class of partial on the checkbox it is working with. Therefore, this must
    	   // be done before inforCheckbox is called. Or, if the whole child list is checked,
    	   // then set checked on the parent.
    	   if(isPartiallyChecked($childrenCheckboxes)){
    	       $parentCheckbox.addClass('partial');
    	   }
    	   // This might be an edge case, but it should be dealt with anyway.
    	   else if(isFullyChecked($childrenCheckboxes)){
    	       $parentCheckbox.prop('checked',true);
    	   }
    	    
    	   // if the parent is disabled, make sure all children are disabled
    	   if($parentCheckbox.attr('disabled')){
    	       $childrenCheckboxes.attr('disabled','disabled');
    	   }
    	   
    	   // if the parent is readonly, make sure all children are read only
    	   if($parentCheckbox.attr('readonly')){
    	       $childrenCheckboxes.attr('readonly','readonly');
    	   }
    	   
    	   // if the parent is checked, make sure all children are checked
    	   if($parentCheckbox.prop('checked')){
    	       $childrenCheckboxes.prop('checked', true);
    	   }
    	   
    	   // Apply inforCheckbox to all checkboxes in the group
    	   $(':checkbox',$el).inforCheckbox();
    	   
    	   // Now apply some event handlers to the parent checkbox
    	   $parentCheckbox.click(function(){
    	       // the element was checked
    	       if(this.checked){
    	           $childrenCheckboxes.prop('checked',true).parent('span').addClass('checked');
    	           $(this).parent('span').removeClass('partial').addClass(settings.checkedClass);
    	       }
    	       else{
    	           $childrenCheckboxes.prop('checked',false).parent('span').removeClass('checked');
    	           $(this).parent('span').removeClass(settings.checkedClass);
    	       }
    	   });
    	   
    	   // The final thing to do is attach event handlers to the children so that
    	   // when they are checked/unchecked, the state of the parent can be toggled.
    	   $childrenCheckboxes.click(function(){
    	       if(isPartiallyChecked($childrenCheckboxes)){
    	           $parentCheckbox.parent('span').removeClass('checked').addClass('partial');
    	       }
    	       else if(isFullyChecked($childrenCheckboxes)){
    	           $parentCheckbox.prop('checked',true).parent('span').removeClass('partial').addClass('checked');
    	       }
    	   });
    	   
    	});
	}
	
	function isPartiallyChecked(childList){
	   // This works because is() returns true if one element in the set
	   // of matched elements matches the selector passed to is(). Therefore
	   // if is(':checked') and is(':not(:checked)') both return true,
	   // some checkboxes are checked and others are not.
	   return childList.is(':checked') && childList.is(':not(:checked)');
	}
	
	function isFullyChecked(childList){
	   return childList.is(':checked') && !childList.is(':not(:checked)');
	}
 
 })(jQuery);
/*
 * Infor Calculator Field - Creates a Popup Calculator Input Field
 */
(function ($) {
	$.widget("ui.inforCalculatorField", {
		_init: function() {
			var self = this,
				$input = $(this.element);
				
			//add trigger button styling
			$input.numericOnly(true).data("isInitialized",true).inforTriggerField({click: function(e) {
				self._openPopup($input, e);
			}});
		},
		expression: null,	//the full expression - which can be calculated directly with eval
		calcInput: null,	//the bottom input - the number
		_openPopup: function ($input, e) {
			var $div = $("#inforCalculatorPopupContainer"),
				self = this,
				originalVal = $input.val();
			
			//close if already open (button was toggled)
			if ($div.length!=0) {
				$("#inforCalculatorPopupContainer").remove();	
				return;
			}
			
			//create a div in which the Calculator goes - stopPropagtion to prevent clicks from carrying through
			$div = $("<div id='inforCalculatorPopup'> </div>").click(function (e) {
				e.stopPropagation();
			});
			
			//add the Calculator table and buttons html
			$div.append('<div class="inforCalculatorTableHeader"><input class="inforCalculatorExpression" readonly><input class="inforTextbox inforCalculatorInput" readonly></div> <table class="inforCalculatorTable"> <tbody> <tr> <td><button data-calc="(" class="inforTextButton">(</button></td> <td><button data-calc=")" class="inforTextButton">)</button></td> <td><button data-calc="clear"  class="inforFormButton">C</button></td> <td colspan="2"><button data-calc="back" class="inforFormButton"><div class="backButton"></div></button></td> </tr> <tr> <td><button data-calc="7" class="inforTextButton">7</button></td> <td><button data-calc="8" class="inforTextButton">8</button></td> <td><button data-calc="9" class="inforTextButton">9</button></td> <td><button data-calc="/" class="inforFormButton">/</button></td> <td><button data-calc="sqRoot" class="inforFormButton">√</button></td> </tr> <tr> <td><button data-calc="4" class="inforTextButton">4</button></td> <td><button data-calc="5" class="inforTextButton">5</button></td> <td><button data-calc="6" class="inforTextButton">6</button></td> <td><button data-calc="*" class="inforFormButton">*</button></td> <td><button data-calc="percent" class="inforFormButton">%</button></td> </tr> <tr> <td><button data-calc="1" class="inforTextButton">1</button></td> <td><button data-calc="2" class="inforTextButton">2</button></td> <td><button data-calc="3" class="inforTextButton">3</button></td> <td><button data-calc="-" class="inforFormButton">-</button></td> <td rowspan="2"><button data-calc="=" class="inforEqualsButton"></button></td> </tr> <tr> <td><button data-calc="0" class="inforTextButton">0</button></td> <td><button data-calc="." class="inforTextButton">.</button></td> <td><button data-calc="plusMinus" class="inforTextButton">+/-</button></td> <td><button data-calc="+" class="inforFormButton">+</button></td> </tr> </tbody> </table> ');
			
			//copy the input from the field and style the two input fields Expression(Top) and CalcInput(Bottom) 
			this.calcInput = $div.find(".inforCalculatorInput").addClass("selectOnly").attr("readonly","");
			this.calcInput.val($(this.element).val()).select();
			this.expression = $div.find(".inforCalculatorExpression").attr("readonly","");
			
			//Create and add events to the buttons
			$div.find(".inforTextButton").inforTextButton().add($div.find(".inforFormButton").inforFormButton()).on('click',function (e) {
				var calcExpr = $(e.currentTarget).attr("data-calc");
				self._handleKey(calcExpr);
			});
			
			//equals button
			$div.find(".inforEqualsButton").on('click',function() { 
				self._calc();
			});
			
			//handle the keypresses by filtering only allowed hot keys and calling the _handleClick
			$div.bind('keypress', function(e) {
				var charCode = e.charCode || e.keyCode,
					actualChar = String.fromCharCode(charCode);
				
				//no letters..(except c for clear)
				if (actualChar.replace(/[a-zA-Z]/g, '')=='' && actualChar.toLowerCase()!='c')
					return;
				
				switch (charCode) {
					case 61:	//allow = and enter to calculate
					case 13:
						self._calc();
						e.preventDefault();
						break;
					case 99:	//upper and lower case c and esc to clear.
					case 67:
					case 27:
						self._handleKey("clear");
						e.stopPropagation();
						break;
					case 9:	//tab to calculate and insert.
						$(document).trigger("click");
						break;
					case 8:	//backspace to clear one.
						self._handleKey("back");
						$input.focus();
						break;
					default:	//else insert the character.
						self._handleKey(actualChar);
						break;
				}
			});
		
			//open the popup in a context menu to get the right cross browser image edge styling
			$("body").append($div);
			$input.inforContextMenu({
				menu: 'inforCalculatorPopup',
				invokeMethod: 'immediate',
				event: e,
				srcElement: $input,
				offsetLeft: -2,
				positionBelowElement: true,
				onClose: function (menu) {
						$input.val(self.calcInput.val());
						$input.trigger("change");
						menu.closest(".inforMenu").remove();
				}
			});
			
			//add ok and cancel buttons
			var okButton = $("<button class='inforFormButton'>"+Globalize.localize("Ok")+"</button>").inforFormButton().click(function() {
				$(document).trigger("click");	//close it (cancel)
				$input.focus();
			});
			var cancelButton = $("<button class='inforFormButton'>"+Globalize.localize("Cancel")+"</button>").inforFormButton().click(function() {
				$(document).trigger("click");	//close it (cancel) / restore
				$input.val(originalVal).focus();
			});
			$div.find("table").after($("<div class='inforCalculatorTableFooter'></div>").append(okButton,cancelButton));
			
			$.browser.safari = ( $.browser.webkit && navigator.userAgent.toLowerCase().indexOf("chrome")=== -1) ? true: false;
			//style fix for WebKit
			if ($.browser.safari)
			{
				okButton.css("margin-top","-2px");
				cancelButton.css("margin-top","-2px");
			}
			//correct some styling added by the context menu that we dont want to break. 
			$div.closest(".menuContent").css("text-indent","");
			this.calcInput.focus();
		},
		firstOp: null,	//stores the first operation in the sequence. Used for Percentage Calc.
		resetOp: false,	//should we reset the numeric input on next click
		_handleKey: function(key) {
			//Handle Each Key Press or input from the buttons. Similar to Windows Calc Functionality
			var oldOpVal = this.calcInput.val(),
				oldExprVal = this.expression.val();
			
			switch (key) 
			{
				case "(":
					if (oldOpVal=="" || oldOpVal=="0")
						this.expression.val(oldOpVal+key);
					else
						this.expression.val(key+oldOpVal);
					break;
				case ")":
					if ($.inArray("(", oldExprVal)==-1)
						return;
						
					this.expression.val(oldExprVal+key);
					break;
				case "=":
				case "+":
				case "*":
				case "/":
				case "-":
					if (oldExprVal.search("sqrt")==-1)
						this.expression.val(oldExprVal+oldOpVal+key);
					
					this.resetOp = true;
					if (!this.firstOp)
						this.firstOp = oldOpVal;
					break;
				case "percent":
					this.expression.val(oldExprVal+(parseFloat(this.firstOp)*parseFloat(oldOpVal)/100));
					break;
				case "sqRoot":
					this.expression.val("sqrt("+oldOpVal+")");
					break;
				case "back":
					var newOp = oldOpVal.substr(0,oldOpVal.length-1);
					this.calcInput.val(newOp);
					this.expression.val(oldExprVal.substr(0,oldExprVal.length-1));
					this.firstOp = newOp;
					break;
				case "clear":
					this.calcInput.val("0");
					this.expression.val("");
					this.firstOp = null;
					break;
				case "plusMinus":
					this.calcInput.val((-oldOpVal));
					break;
				default:	//numbers
					if (key.replace(/[0-9.,]/g, '')=='') {
						if (this.resetOp)
							this.calcInput.val(key);
						else
							this.calcInput.val((oldOpVal=="0" ? key: oldOpVal+key ) );	//reset zero after clear
						
						this.resetOp = false;
					}
					break;
				}
		},
		_calc: function() {
			this._handleKey("=");
			//Replace the visual sqrt with the js executable Math.sqrt
			var result = "",
				calculation = this.expression.val().replace(/sqrt/gi,"Math.sqrt").replace(/=/gi,"");
			
			//Execute the calc in the expression field - any errors show the visual "Invalid Input"
			try {
			  result = eval(calculation);
			}
			catch(err)
			{
			  result="Invalid Input";
			}
			
			//Show Divide By Zero Errors.
			this.calcInput.val((result==Infinity ? "Cannot Divide By Zero" : result));
			this.expression.val("");
		}
	});
} (jQuery));
/*
* Infor Application Navigation Plugin. 
*  
* Details: http://bit.ly/puLtCi
*/
 ( function ( $ ) {
     $.widget("ui.inforApplicationNav", {
         options: {
            loadMenu: null,  //Adds the ability to refresh menu items with an ajax call.
			showSessionMenu : false, 	//adds the session navigation menu and api.
			onSessionMenuOpen: null,
			backgroundIFrame: false	//opens an iFrame overtop of submenus. Use this if having issues with pdf/applets in the page
         },
         pending: 0,
         elementId: null,
		 resizeTimer : null,
		 windowHeight : $(window).height(), 
		 windowWidth : $(window).width(),
		 _sessionInfo: [],	//the array of sessions.
         /* Initial Create Function.*/
         _create: function () {
             this.elementId = this.element.attr("id");
			 this.element.css({"height":"28px", "overflow":"hidden"});
			 var self = this;
			 appNavResizeTimer = null;
             appNavWindowHeight = $(window).height(), appNavWindowWidth = $(window).width();
             isScrolling = false;
             options = this.options;
             
			 //add the <br> at the end if its not there.
              if (!this.element.children().last().is("br"))
                 this.element.append('<br style="clear: left" />');

              
             this.buildmenu(this.elementId);
             $(window).bind("smartresize.inforApplicationNav",function(){
				self._resizeAndRender();
			 });
			 
			 setApplicationNavOverflow();
			 this.element.data("backgroundIFrame",options.backgroundIFrame);
		 },
		 render: function () {
			 setApplicationNavOverflow();
		 },
		 _resizeAndRender: function () {
			if (this.resizeTimer) clearTimeout(this.resizeTimer);
			
			if (this.windowHeight != $(window).height() || this.windowWidth != $(window).width())
			{	
				this.resizeTimer = setTimeout(setApplicationNavOverflow, 10);
				this.windowHeight = $(window).height();
				this.windowWidth = $(window).width();
			}
		 },
         /* Initial Menu Build Out. Should only be called once. */
         buildmenu: function (elementId) {
             var $mainmenu = $("#" + elementId + ">ul"); //reference main menu UL
             //add some html as a placeholder for the overflowmenu
             $mainmenu.find("#overFlowMenu").remove();
             $mainmenu.append('<li id ="overFlowMenu"><ul><li id="overFlowLi"><a href="#"></a></li></ul></li>');

			 if (this.options.showSessionMenu) {
				//add some html as a placeholder for the sessionNavMenu
				$mainmenu.find("#sessionNavMenu").remove();
				$mainmenu.prepend('<li id ="sessionNavMenu"><ul><li id="sessionNavLi"><a href="#"></a></li></ul></li>');
			 }
		 	 
             //var $headers = $mainmenu.find("ul").parent();
             //attachSubMenus($headers);
             var $headers = $mainmenu.children("li").has('ul');
             attachSubMenus($headers);
             
			 /*attach hover events to top level menu items for auto open.*/
             $mainmenu.children("li").each(function () {
                 var $this = $(this);
				 if ($this.find("ul").length == 0) {	//attach a blank hover intent for top level - this helps prevent the menus from closing in auto open mode.
						$this.hoverIntent(function () {
							}, function () {
							});
				}
             });
			 
             // Add dividers
             $(".headerDividerContainer").remove();
             $(".topNavSpacer").remove();
             $(".inforApplicationNav>ul>li").not("#sessionNavMenu").before('<li class=\'headerDividerContainer\'></li>');

             // Last item also needs an end divider
             $(".inforApplicationNav>ul>li:last").after('<li class=\'headerDividerContainer\'></li>');
             $(".headerDividerContainer").append('<div class=\'headerDivider\'></div>')
             $(".headerDividerContainer:first").before('<li id=\'topNavSpacer\' class=\'topNavSpacer\'></li>');
             
			 setApplicationNavOverflow();
			 this._setupSessionNav();
		 },
         /* Can be called to add need styling and elements to a new submenu piece. Eg:
         $("#inforApplicationNav1").inforApplicationNav("decorateMenu",<newMenuSection>);
         */
		 _setupSessionNav: function () {
			 if (!this.options.showSessionMenu)
			 return;
			 
			 var self = this;
			 	
			 //add a button first thing in the menu
			 var sessionNavButton = $("<button type='button' class='sessionNavButton' title='"+Globalize.localize('SessionNavigation')+"'/>");
			 var spacer = $(".inforApplicationNav .topNavSpacer");
			 spacer.width(26).append(sessionNavButton);

			 sessionNavButton.click(function (event) {
			 
				 if (self.options.onSessionMenuOpen!=null) {
						self._sessionInfo = self.options.onSessionMenuOpen(self._sessionInfo);
				 }
				 
				 //hide it if already visible. (toggled the button)
				 var $li = $(".inforApplicationNav>ul").find("#sessionNavMenu");
				 var $ul = $li.children("ul");

				 if ($ul.is(":visible")) {
					 $ul.hide();
					return;
				 }

				 closeSiblingMenus($li);

                //remove the old ones...
				 $ul.children().remove();
				//refresh the menu elements
				for (var i = 0; i < self._sessionInfo.length; i++) {
					var session = self._sessionInfo[i];
				 
					 var li = $("<li></li>");
					 var anchor = $("<a href='#'>" + (session.text==undefined ? "" : session.text)  + "</a>").attr("id",(session.id==undefined ? session.text :session.id));
					 if (anchor==undefined)
						continue;
					
					//style with the css classes.
					 if (session.id=="navSessionSpacer") {
						anchor.prepend("<div class='navSessionSpacer'></div>");
						anchor.css({"height":"6px"})
					 }
					 
					 if (session.cssClass=="disabledSession" || session.cssClass=="disabledText")	//add disabled text.
						anchor.addClass("disabledText");
					 
					 if (session.cssClass != undefined && session.id!="navSessionSpacer")
						anchor.prepend("<div class='sessionIcon "+session.cssClass+"'></div>");
					
					 if (session.id!="navSessionSpacer") {
						anchor.click(function (e) {
						 //close the menu
						 closeSiblingMenus($ul.parent());
						 //do the action
						 var action = $(this).data("action");
						 
						 if ($(this).children(":first").hasClasses(["disabledSession","disabledText"]))
							return;
							
						 if (action != null)
							action();
					 });
					 }
					 
					 //add it to the dom.
					 li.append(anchor);
					 
					 if (session.parent!=undefined) {
						//presumably the parent was added first...but we could code a new loop
						//find the parent element...
						var parent = $("a#"+session.parent);
						//add a ul if not there..
						var ul = parent.next("ul");
						if (ul.length==0) {
							ul = $("<ul></ul>");
							parent.after(ul);
						}
						
						//add it..
						ul.append(li);
					 } else {
						$ul.append(li);
					 }
					 anchor.data("action",session.action);	//save for the click.
				}
				
				attachSubMenus($li);
				//and then...open the session nav...
				openMenu($li.children(":first"), $li);
				event.stopPropagation();
			 });
		 },
         decorateMenu: function (subMenu) {
             attachSubMenus(subMenu);
         },
         close: function () {
             closeOpenMenus($(this.element).closest('.inforApplicationNav'));
         },
		 sessionInfo: function(updatedInfo) {
			 if (updatedInfo!=undefined)
				this._sessionInfo = updatedInfo;
				
			 return this._sessionInfo;
		 }
     });

     function attachSubMenus($headers) {
		 if ($headers.data("attached") != undefined) {
			return; 
		}
		$headers.data("attached", true);

        $headers.each(function (i) {
             $this = $(this);
             if ($.data(this, "processed") != undefined)
            	return; //continue...
			
             $.data(this, "processed", true);

             var $curobj = $this.css({ zIndex: Math.abs(100 - i) });
             var $subul = $this.find('ul:eq(0)').css({ display: 'block' });

             this._dimensions = { w: this.offsetWidth, h: 28, subulw: $subul.outerWidth(), subulh: $subul.outerHeight() }
             this.istopheader = $curobj.parents("ul").length == 1 ? true : false //is top level header?
             $subul.css({ top: this.istopheader ? this._dimensions.h + "px" : 0 });

             //add arrow images
             if (this.istopheader)
                 $curobj.children("a:eq(0):not(.scrollDown)").css({ paddingRight: 10 }).append('<div class="downarrow" />');
             else
                 $curobj.children("a:eq(0):not(.scrollDown)").addClass("rightarrow");

             if (this.istopheader) {
                 $curobj.click(function (e) {
                    if ($subul.is(":visible"))	//click when open closes the menu...
                     {
                         $curobj.removeClass("activeHeader");
                         $subul.hide(); //to speed normal animation...
                      return;
                     }

                     if ($curobj.attr("id") != "overFlowMenu") {
                         $headers.removeClass("activeHeader");
                         $curobj.addClass("activeHeader");
                     }

                     openMenu($subul, $curobj);
                 });
             }

             //Add or ensure there is an overlay
             if ($('body').find(".transparentOverlay").length == 0) {
                $('<div></div>').addClass('transparentOverlay')
				    .appendTo('body')
				    .data("openMenus", [])
				    .css({ 'width': '100%', 'height': '100%', 'top': '-28px', 'position': 'absolute', 'display': 'none', 'z-index': '-1' })
				    .mousedown(function () { 		//Serves to close with click like other menus and also closes menu item when its clicked.
				       closeOpenMenus($headers.closest('.inforApplicationNav'));
				    }).hoverIntent(function () {
				        closeOpenMenus($headers.closest('.inforApplicationNav'));
				    }, function () { });
             }

             //open submenus on a hover or if one menu on the top level is open.
             $curobj.hover(function () {
                 if (this.istopheader) {
                     var openMenus = $curobj.closest(".inforApplicationNav").find('ul li ul').filter(":visible");
                     if (openMenus.length > 0 && !$subul.is(":visible")) {
                         $headers.removeClass("activeHeader");
                         $curobj.addClass("activeHeader");
                         closeSiblingMenus($curobj);
                         openMenu($subul, $curobj);
                     }
                 }
             });

             $curobj.hoverIntent(
				function (e) {
				    if ($(this).attr("id") == "overFlowMenu")
				        return;
				    if (!this.istopheader) {
				        closeSiblingMenus($curobj);
				        openMenu($subul, $curobj);
				        $curobj.find('a.rightarrow:first').addClass("selected");
				    }
				},
				function (e) {
				    //We also close on a click out...closeMenu($subul,$curobj);
				    $curobj.find('a.rightarrow:first').removeClass("selected");
				}
			)//end hoverIntent

         }) //end $headers.each()

         //add box shadow
         var uls = $headers.closest(".inforApplicationNav").find('ul li ul');
		 uls.addClass("boxShadow");
		 if ($.browser.msie && $.browser.version==8) {
			uls.addClass("ie8Effects");
		 }
			
         var mainMenu = $headers.closest(".inforApplicationNav ul");
         mainMenu.find("ul").css({ display: 'none', visibility: 'visible' });

         //close sibling menus when hovering Li's at the same level.
         mainMenu.find("li").each(function () {
             var $this = $(this);
             if ($(this).children("ul").length == 0) {
                 $this.hoverIntent(
				function () {
				   closeSiblingMenus($(this));
				},
				function () { }
				);
             }
         });
         mainMenu.find("li ul");
     }

     /* If more then the number of vertical menu items fit in the page and scrollbars */
     function setVerticalOverflow(submenu) {
         //find the bottom of the window 
         var winOffset = $(window).height();
         var rootDiv = $(submenu).closest(".inforApplicationNav");
         var bottomOfNav = rootDiv.position().top + 28; //(from the top page to the top of the control)
         var allowableHeight = winOffset - (bottomOfNav);
         //add height of the scrollbar buttons..
         allowableHeight = allowableHeight - 46;
         //each menu is 23 in height
         var fittingMenus = allowableHeight / 23;
         var menuCounter = 1;

         var hiddenTopItems = [];
         var hiddenBottomItems = [];
         var visibleSubMenus = [];

         $(submenu).children().each(function (index) {
             var $li = $(this);

             if ($li.hasClass("scrollUp") || $li.hasClass("scrollDown"))
                 return;

             if (menuCounter <= fittingMenus) {
                 $li.show();
                 visibleSubMenus.push($li);
             } else {
                 $li.hide();
                 hiddenBottomItems.push($li);
             }
             menuCounter++;
         });

         if (hiddenBottomItems.length > 0) {
             var topOfNav = rootDiv.position().top; //(from the top page to the top of the control)
             if ($(submenu).parent().position().top > topOfNav && $(submenu).parent().attr("id") != "overFlowMenu") {
                 $(submenu).css("top", -($(submenu).offset().top - 28) + "px");
             }
             addVerticalScrollbars($(submenu), hiddenTopItems, hiddenBottomItems, visibleSubMenus);
         }
     }

     /* Add the vertical scroll styling/elements to the page. */
     function addVerticalScrollbars(submenu, hiddenTopItems, hiddenBottomItems, visibleSubMenus) {

         //add to scrollbar
         removeVerticalScrollbars(submenu);

         var liWidth = (submenu.filter(':first').width() - 16) / 2;
         var up = $("<li class='scrollUp' style='padding-left:" + liWidth + "px'><div class='scrollArrow'/></li>").prependTo(submenu);
         var down = $("<li class='scrollDown roundedBottomCorners' style='padding-left:" + liWidth + "px'><div class='scrollArrow'/></li>").appendTo(submenu);

         down.prev().removeClass("roundedBottomCorners");

         up.attr("disabled", "disabled");
         up.unbind('mouseenter');
         up.unbind('mouseleaver');

         //Attach the hover events on a timer
         up.mouseenter(function () {
             submenu.everyTime(200, 'up', function (i) {
                 moveUp(submenu)
             }, 0);
         }).mouseleave(function () {
             submenu.stopTime("up");
         });

         //Attach the hover events on a timer
         down.mouseenter(function () {
             submenu.everyTime(200, 'down', function (i) {
                 moveDown(submenu)
             }, 0);
         }).mouseleave(function () {
             submenu.stopTime("down");
         });

         saveDataToMenu(submenu, hiddenTopItems, hiddenBottomItems, visibleSubMenus, up, down);
     }

     /* Move up one element */
     function moveUp(submenu) {
         var hiddenTopItems = $.data(submenu, "hiddenTopItems");
         var hiddenBottomItems = $.data(submenu, "hiddenBottomItems");
         var visibleSubMenus = $.data(submenu, "visibleSubMenus");
         var upButton = $.data(submenu, "upButton");
         var downButton = $.data(submenu, "downButton");

         if (!upButton.isEnabled()) {
             submenu.stopTime("up");
             return;
         }
         isScrolling = true;

         if ($.data(submenu, "hiddenTopItems").length == 0) {
             enableVerticalScrollBars(submenu);
             isScrolling = false;
             submenu.stopTime("up");
             return;
         }

         //remove an item from the bottom of the hidden top items and  show it
         var topElem = hiddenTopItems.splice(hiddenTopItems.length - 1, 1)[0];

         topElem.show();
         visibleSubMenus.splice(0, 0, topElem);

         //remove last item from the visible items and hide it.
         var bottomElem = visibleSubMenus.pop();

         bottomElem.hide();
         hiddenBottomItems.push(bottomElem);

         //disable if there are no more.
         enableVerticalScrollBars(submenu);
         isScrolling = false;
         saveDataToMenu(submenu, hiddenTopItems, hiddenBottomItems, visibleSubMenus, upButton, downButton);
     }

     /* Move down one element */
     function moveDown(submenu) {

         var hiddenTopItems = $.data(submenu, "hiddenTopItems");
         var hiddenBottomItems = $.data(submenu, "hiddenBottomItems");
         var visibleSubMenus = $.data(submenu, "visibleSubMenus");
         var upButton = $.data(submenu, "upButton");
         var downButton = $.data(submenu, "downButton");

         if (!downButton.isEnabled()) {
             submenu.stopTime("down");
             return;
         }

         isScrolling = true;

         if (hiddenBottomItems.length == 0) {
             enableVerticalScrollBars(submenu);
             isScrolling = false;
             submenu.stopTime("down");
             return;
         }

         //remove an item from the bottom - show it
         var bottomElem = hiddenBottomItems.splice(0, 1)[0];

         bottomElem.show();
         visibleSubMenus.push(bottomElem);

         //remove an item from top - hide it
         var topElem = visibleSubMenus.splice(0, 1)[0];

         topElem.hide();
         hiddenTopItems.push(topElem);

         //disable if there are no more.
         enableVerticalScrollBars(submenu);
         isScrolling = false;
         saveDataToMenu(submenu, hiddenTopItems, hiddenBottomItems, visibleSubMenus, upButton, downButton);
     }

     function saveDataToMenu(submenu, hiddenTopItems, hiddenBottomItems, visibleSubMenus, upButton, downButton) {
         $.data(submenu, "hiddenTopItems", hiddenTopItems);
         $.data(submenu, "hiddenBottomItems", hiddenBottomItems);
         $.data(submenu, "visibleSubMenus", visibleSubMenus);
         $.data(submenu, "upButton", upButton);
         $.data(submenu, "downButton", downButton);
     }

     /* Remove the Scroll Buttons */
     function removeVerticalScrollbars(subMenu) {
         subMenu.find(".scrollUp").remove();
         subMenu.find(".scrollDown").remove();
     }

     /* Main code for the app overflow. Determine if there is overflow and add the scroll/overflow buttons if needed */
     function setApplicationNavOverflow() {
		 //fix styling during resize..
		 //var root = $(".inforApplicationNav");
		 //root.css({"height":"28px", "overflow":"hidden"});
		 
         hiddenLeftItems = [];
         hiddenRightItems = [];
         visibleItems = [];
         //show all items..
         $(".inforApplicationNav>ul>li").show();
         itemCount = 1;

         //hide the elements that are off screen....
         $(".inforApplicationNav>ul>li").each(function (index) {
             var $this = $(this);

             if ($this.attr("id") == "overFlowMenu") {
                 //Hide the seperators that were added.
                 $this.prev().hide();
                 $this.next().hide();
                 return;
             }

             var isTopElement = (!$this.hasClass("headerDividerContainer") && !$this.hasClass("topNavSpacer")) && !$this.is("#sessionNavMenu");

             var rootDiv = $(this).closest(".inforApplicationNav");
             var expectedOffset = rootDiv.position().top; //(the height of the control)

             if (this.offsetTop > expectedOffset)	//if greater than the height of the control
             {
                 if (isTopElement) {
                     var newObj = { idx: itemCount, elm: $this };
                     hiddenRightItems.push(newObj);
                     itemCount++;
                 }

                 $this.hide();
                 $this.next().hide();
             } else {
                 if (isTopElement) {
                     var arrObj = { idx: itemCount, elm: $this };
                     visibleItems.push(arrObj);
                     itemCount++;
                 }
             }
         });

         //add scrollbars if needed
         if (hiddenRightItems.length > 0)
             addScrollbars();
         else {
             removeScrollbars();
             $(".headerDividerContainer:last").show();
         }
         itemCount--;
		 
	 }

     /* Remove the Horizontal Scroll buttons from the dom */
     function removeScrollbars() {
         $("#scrollLeft").unbind('appNav click').hide().prev(".headerDividerContainer").hide();
		 $("#scrollRight").unbind('appNav click').hide();
         $(".overFlowButton").remove();
     }
     
	 /*Bump first element off of visible Items and hide it*/
     function hideLast() {
         var lastVisible = visibleItems.splice(visibleItems.length - 1, 1)[0];
         if (lastVisible == undefined)
             return;

         lastVisible.elm.hide();
         lastVisible.elm.next().hide();
         visibleItems.sort(sortByIdx);
         hiddenRightItems.push(lastVisible);
         hiddenRightItems.sort(sortByIdx);
     }

     /* Additional Check on the left scroll button itself is overflowing. if it is hide the last visible item.*/
     function checkButtonOverFlow() {
         var rightbutton = $("#scrollRight");
         var rootDiv = rightbutton.closest(".inforApplicationNav");
         var bottomOfNav = rootDiv.position().top + 28;

         if (rightbutton.length > 0 && rightbutton.offset().top >= bottomOfNav)
             hideLast();

         var overFlow = $(".overFlowButton");
         if (overFlow.length > 0 && overFlow.offset().top >= bottomOfNav)
             hideLast();

         //look for a special area and hide an item if need be...
         var rightArea = $(".inforApplicationNavHeaderRight");
         if (rightArea.length > 0 && rightArea.offset().top >= bottomOfNav)
             hideLast();

         //if they are still off hide them...
         if (rightbutton.length > 0 && rightbutton.offset().top >= bottomOfNav)
             rightbutton.hide();

         if (overFlow.length > 0 && overFlow.offset().top >= bottomOfNav)
             overFlow.hide();

         if (rightArea.length > 0 && rightArea.offset().top >= bottomOfNav)
             rightArea.hide();
     }

     /*Add the scroll buttons (horizontal) to the dom and add events. */
     function addScrollbars() {
         //remove the previous ones..
         removeScrollbars();
		 
         var left = $("#scrollLeft");
		 if (left.length==0) {
			left = $("<button type='button' id='scrollLeft' type class='scrollLeft' title='"+Globalize.localize("Previous")+"'/>");
			$("#topNavSpacer").after(left);
			left.before('<li class="headerDividerContainer"><div class="headerDivider"></div></li>');
		 }
		 
		 var right = $("#scrollRight");
		 if (right.length==0) {
			right = $("<button id='scrollRight' type='button' class='scrollRight' title='"+Globalize.localize("Next")+"'/>");
			$(".inforApplicationNav>br").before(right);
		 }
		 
		 left.show();
		 left.prev(".headerDividerContainer").show();
		 right.show();
		 
         $("#scrollLeft").bind('appNav click',function () {
             moveLeft();
         });

         $("#scrollRight").bind('appNav click',function () {
			  moveRight();
         });

         addOverflow();
		 checkButtonOverFlow();
         enableScrollBars();
     }

     /* Set the Disabled on the Scrollbars. */
     function enableScrollBars() {
         var left = $("#scrollLeft");
         var right = $("#scrollRight");

         if (hiddenLeftItems.length == 0)
             left.attr("disabled", "disabled");
         else
             left.removeAttr("disabled");

         if (hiddenRightItems.length == 0)
             right.attr("disabled", "disabled");
         else
             right.removeAttr("disabled");

     }

     function enableVerticalScrollBars(submenu) {
         var up = $.data(submenu, "upButton");
         var down = $.data(submenu, "downButton");
         var hiddenBottomItems = $.data(submenu, "hiddenBottomItems");
         var hiddenTopItems = $.data(submenu, "hiddenTopItems");

         if (hiddenBottomItems.length == 0)
             down.attr("disabled", "disabled");
         else
             down.removeAttr("disabled");

         if (hiddenTopItems.length == 0)
             up.attr("disabled", "disabled");
         else
             up.removeAttr("disabled");
     }

     /* Scroll one element Left. */
     function moveLeft() {
         //At the start
         if (hiddenLeftItems.length == 0) {
             return;
         }

         //Hide the last visible item
         firstHidden = visibleItems.splice(visibleItems.length - 1, 1)[0];
         firstHidden.elm.hide();
         firstHidden.elm.next().hide();
         hiddenRightItems.push(firstHidden);

         //Bump the last item off hiddenLeftItems and make it visible
         var nextVisible = hiddenLeftItems.splice(hiddenLeftItems.length - 1, 1)[0];
         nextVisible.elm.show();
         nextVisible.elm.next().show();
         visibleItems.push(nextVisible);
         visibleItems.sort(sortByIdx);

         //arrays must be sorted...
         hiddenLeftItems.sort(sortByIdx);
         hiddenRightItems.sort(sortByIdx);
         visibleItems.sort(sortByIdx);

         checkButtonOverFlow();
         enableScrollBars();
     }

     /* Scroll one element right. */
     function moveRight() {
         if (hiddenRightItems.length == 0) {
             return;
         }

         //Bump first element off of visible Items and hide it
         var firstHidden = visibleItems.splice(0, 1)[0];
         firstHidden.elm.hide();
         firstHidden.elm.next().hide();
         hiddenLeftItems.push(firstHidden);
         //now if there is overflow hide one more.

         //Bump first element off of hiddenRight Items and make it visible 
         var firstVisible = hiddenRightItems.splice(0, 1)[0];
         firstVisible.elm.show();
         firstVisible.elm.next().show();
         visibleItems.push(firstVisible);
         visibleItems.sort(sortByIdx);

         //arrays must be sorted...
         hiddenLeftItems.sort(sortByIdx);
         hiddenRightItems.sort(sortByIdx);
         visibleItems.sort(sortByIdx);

         checkButtonOverFlow();
         enableScrollBars();
     }

     /* Sort Method for the scrolling arrays. */
     function sortByIdx(a, b) {
         var x = a.idx;
         var y = b.idx;
         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
     }

     /* Find all of the items including those taht arent visible and add them to the overflow menu button */
     function addOverflow() {
         var overflow = $("<button type='button' class='overFlowButton' title='"+Globalize.localize('ListAllMenuItems')+"'/>");
         $(".inforApplicationNav>br").before(overflow);

         overflow.click(function () {
             var $li = $(".inforApplicationNav>ul").find("#overFlowMenu");
             var $ul = $li.children("ul");

             if ($ul.is(":visible")) {
                 $ul.hide();
				return;
             }

             closeSiblingMenus($li);

             //add the menu items
             $ul.children().remove();

             $(".inforApplicationNav>ul>li").each(function (index) {
                 var $this = $(this);

                 if ($this.attr("id") == "overFlowMenu")
                     return;

                 if ($this.hasClass("headerDividerContainer"))
                     return;

                 var childA = $this.children("a"),
					 html = childA.html();
					 
                 if (html != null && html != undefined && html != "") {
                     var li = $("<li id='overFlowLi'></li>");
                     var anchor = $("<a href='#'>" + html + "</a>");
                     
					 //copy the onclick action
					 if (childA.attr("onclick"))
						anchor.attr("onclick",childA.attr("onclick"));
					 
					 if (childA.attr("target")) {
						anchor.attr("target",childA.attr("target"));
						anchor.attr("href",childA.attr("href"));
					 }
					 
                     anchor.click(function (e) {
                         //find the element
                         var menuItem = $this;

                         //scroll it into view
                         while (hiddenLeftItems.length != 0 && !menuItem.is(":visible")) {
                             moveLeft();
                         }

                         while (hiddenRightItems.length != 0 && !menuItem.is(":visible")) {
                             moveRight();
                         }

                         //close the overflow menu
                         closeSiblingMenus($ul.parent());

                         //open it
                         var sublist = menuItem.children("ul");
                         if (sublist.length == 0) {
                            //open the menu item if it has a href/target
                            var sourceTarget=childA.attr("target"),
								href = menuItem.children("a").attr("href");
								
							if (!sourceTarget)
								window.location = href;
							
							if (!menuItem.children("a").attr("onclick"))
								childA.trigger("click");
						 }
                         else {
                             menuItem.parent().find("li").removeClass("activeHeader");
                             menuItem.addClass("activeHeader");
                             //May have a dynamic call setup
                             if (options.loadMenu != null) {
                                 setTimeout(function () {
                                     options.loadMenu(sublist, menuItem, appNavResponse);
                                 }, 600);
                                 return;
                             } else {
                                 setTimeout(function () {
                                     openMenu(sublist, menuItem);
                                 }, 600);
                             }
                         }
                     });
                     li.append(anchor);
                     $ul.append(li);
                 }
             });
             //Remove the down arrows..
             $li.find(".downarrow").remove();
             //open the menu
             openMenu($li.children(":first"), $li);
         });
     }

     /* Close ALL Menus by clicking the overlay. */
     function closeOpenMenus(root) {
		 root.find('ul li ul').filter(":visible").hide();
         root.find(".activeHeader").removeClass("activeHeader");
         $('body').find(".transparentOverlay").css({ 'z-index': '-1', 'display': 'none' });
		 $("#inforObjectOverlay").hide();
		 
		 root.css({"height":"28px", "overflow":"hidden"});
	 }

     /* Close ALL Menus at the same level (no animation)... */
     function closeSiblingMenus($curobj) {
         $curobj.siblings("li").children("ul").filter(":visible").each(function () {
            var $targetul = $(this);
             $targetul.hide();
             //close any child menus of these
             $targetul.children("ul").filter(":visible").hide();
         });
	 }

     /* Call back for the Ajax Call. */
     function appNavResponse($subul, $curobj) {
         //Add The content
         var newSubmenus = $subul.find("ul").not(".boxShadow");
         if (newSubmenus.length > 0) {
             attachSubMenus(newSubmenus.parent());
         }
         //$subul.find("ul").not(".boxShadow").parent());
         $curobj.removeClass("inforAppNavLoading");
         openMenu($subul, $curobj, true);
     }

     /* Open the Menu/Submenu. */
	 function openMenu($subul, $curobj, isCallback) {
		 $curobj.closest(".inforApplicationNav").css({"height":"", "overflow":""});
		 var $headers = $subul.children("li").has('ul');
         attachSubMenus($headers);
         
		 $('body').find(".transparentOverlay").css({ 'z-index': '2', 'display': '' });
         $("#inforObjectOverlay").show();
		 
		 //Add Click Event to each menu item
         //For now this helps close the menu and remove the overlay - later we can use this to track session info.
         var subLis = $subul.find('ul li');
         subLis.each(function (i) {
             var $this = $(this);
             $this.unbind('click');
             $this.bind('click', function (e) {
                 closeOpenMenus($(this).closest('.inforApplicationNav'));
                 e.stopPropagation(); //prevent from reopening on header click event which will fire.
             });
         });

         //Click on the items that have submenus...
         $subul.unbind('click');
         $subul.bind('click', function (e) {
             closeOpenMenus($(this).closest('.inforApplicationNav'));
             e.stopPropagation(); //prevent from reopening on header click event which will fire.
         });

         var $targetul = $subul; //reference UL to reveal
		 //fix cspie issue.
         if ($.browser.msie && $.browser.version==8 && $targetul.is("css3-container")) {
			$targetul = $targetul.next();
		 }	
		 var header = $curobj.get(0); //reference header LI as DOM object

         var isOpen = $targetul.is(":visible");
         if (isOpen)
             return;

         //May have a dynamic call setup
         if (!isCallback && options.loadMenu != null && header.id != "overFlowMenu") {
             $curobj.addClass("inforAppNavLoading");
             options.loadMenu($subul, $curobj, appNavResponse);
             return;
         }

         header._offsets = { left: $curobj.offset().left, top: $curobj.offset().top };
         var menuleft = header.istopheader ? 0 : header._dimensions.w;
         //calculate this sub menu's offsets from its parent
		 
         if (!header.istopheader) {
             menuleft = menuleft - 2; //padding.
         }

         var rootDiv = $targetul.closest(".inforApplicationNav");
         
		 //if 1 or less queued animations
         if ($targetul.queue().length <= 1) {
          	if (!Globalize.culture().isRTL)
				$targetul.css({left:menuleft+"px"}).animate({height:'show',opacity:'show'}, 3, function() {
					 //append an iFrame so it opens up over applets ect...
					 if (rootDiv.data("backgroundIFrame")){ 
						showHideIFrame($targetul);
					 }
				});
			else {
				if (menuleft<=0)
					menuleft="-3";
				$targetul.css({right:menuleft+"px", width:$targetul.width()}).animate({height:'show',opacity:'show'}, 3);
			}
		 }

         var bottomOfNav = rootDiv.position().top + 28;

         if (!header.istopheader) {
			if (Globalize.culture().isRTL) {
				 $targetul.css({right:$targetul.parent("li").width()+"px"});
				
				 if ($targetul.offset().left<0 ) 
					$targetul.css({"top" : "10px", "right" : -( parseInt( $targetul.css("right") )+2 )+"px" });
				
				 //see if the last is left and flow left so that once we move left we move left until the left side.
				 if (parseInt($targetul.parent().parent().css("right")) < -3 ) {
						$targetul.css("right",  -( parseInt( $targetul.css("right"))+2 )+"px" );
						
						if ($targetul.offset().left+$targetul.width() >$(window).width() ) 
							$targetul.css("right",  Math.abs( parseInt( $targetul.css("right"))+2 )+"px" );
				 }
			} 
			else {
				$targetul.position({
					 my: "left",
					 at:  "right",
					 of: $targetul.parent("li"),
					 offset: "-1 -14",
					 collision: "flip"
				 });
				 
				 //see if the last is left and flow left so that once we move left we move left until the left side.
				 if ($targetul.parent().parent().position().left<0) {
						$targetul.css("left", -$targetul.position().left+"px");
						
						if ($targetul.offset().left<0) 
							$targetul.css("left", Math.abs($targetul.position().left)+"px");
				}
			}
         }

         /*see if the elements will fit if it is scootched up */

         //this is the expected height of the menu...numItems*23 (the width of each li)+10 (the bottom padding)
         var expectedHeight = ($targetul.children("li").length * 23) + 10;
         var offSetTop = $targetul.offset().top;
         if (offSetTop < 0)
             offSetTop = bottomOfNav;

         var winHeight = $(window).height() - (bottomOfNav);

         //overflow expected....and won't fit
         if ((offSetTop + expectedHeight > winHeight) && winHeight < expectedHeight) {
             //move menu to just under the top
             setVerticalOverflow($targetul);
         } else {
             if (offSetTop + expectedHeight > winHeight)	//see if it will oveflow past the bottom and fit if to be scootched up 
             {
                 $targetul.css("top", "-" + (offSetTop + expectedHeight - winHeight) + "px");
                
                 if ($targetul.offset().top < 28)
                     $targetul.css("top", "28px");
			 }
         }

         // Round corners of last menu item
         $curobj.children("ul").addClass("roundedBottomCorners").children("li:last").addClass("roundedBottomCorners");

         //set the location of the menu to be under the button
         if (header.id == "overFlowMenu") {
             overflowButton = $(".overFlowButton");
             $targetul.position({
                 my: "top right",
                 at: "bottom left",
                 of: overflowButton,
                 offset: "-40 14",
                 collision: "fit"
             });
		 }
		 
		 if (header.id == "sessionNavMenu") {
			if (Globalize.culture().isRTL)
				$targetul.css({"display":"block", "position":"fixed","right":"0px","top": bottomOfNav+"px"});
            else
				$targetul.css({"display":"block", "position":"fixed","left":"0px","top": bottomOfNav+"px"});
        	
			$targetul.show();
			$targetul.parent().show();
		 }
		 
     }

	function showHideIFrame(elem){
		if (!$.browser.msie)	//only works well on msie
			return;
			
		var bkgrndIFrame = $("#inforBkgrndIFrame");

		if (elem.css("display")=="block") {
		   if (bkgrndIFrame.length==0)
			   bkgrndIFrame = $('<div style="position:absolute" id="inforBkgrndIFrame"><iframe frameborder="0" style="height:100px;width:100px;"></iframe></div>').appendTo("body");
		
		   bkgrndIFrame.css({"left":elem.offset().left, "top":elem.offset().top, "z-index": 1});
		   bkgrndIFrame.children().eq(0).height(elem.height()).width(elem.width());
		   bkgrndIFrame.show();
		}
		else {
		   bkgrndIFrame.hide();
		}
    }
 })(jQuery);


/*
* Infor Spash Screen
*/
(function ($) {
    $.widget("ui.inforAboutDialog", {
        options: {
			productName: "<Product Name>",	//text for product name 
			details: ""
		},
		_init: function () {
            var self = this,
                o = self.options,
			    $div = $('<div id="inforAboutDialog" class="inforAboutDialog" style="display:none"></div>');
                $productName = $('<span class="productName">'+o.productName+'</span><br>');
                $details = $('<textarea class="inforTextArea">'+o.details +'</textarea><br>');
                $closebutton = $('<button class="inforCloseButton"></button>');
                $logo = $('<div class="inforLogo"></div>');
                $okbutton = $('<button class="inforFormButton">'+Globalize.localize("Ok", Globalize.culture().name)+'</button>');
			
			 $div.append($closebutton,$productName,$details,$logo,$okbutton);
			 $('body').append($div);
			
			//Add signIn Dialog elements to the page
			var $dialog = $div.inforDialog({
				title: "",
				dialogType: "General",
				minHeight: 420,
				minWidth: 620,
				maxHeight: 420,
				maxWidth: 620,
				height: 420,
				width : 620,
				modal: true,
				draggable:false,
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
			root.addClass("inforAboutDialog");
			root.removeClass("inforDialog");
			$('.inforOverlay').hide();
			
			//adjust width
			root.css({"width":"","height":""});
			root.show();
			root.find(".inforCloseButton").show();
			
			//close button functionality
			$closebutton.click(function(){
				$div.remove();
				$dialog.remove();
			 });
			 
			 $okbutton.inforFormButton().focus().click(function(){
				$div.remove();
				$dialog.remove();
			 });
			 
			 //adjust to middle.
			 if (!Globalize.culture().isRTL)
				$okbutton.css({"left":300-($okbutton.width()/2)+"px"});
			 else
				$okbutton.css({"right":320-($okbutton.width()/2)+"px"});
		}
   });
})(jQuery);



