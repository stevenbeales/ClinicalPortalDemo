﻿window.dhtmlHistory = {
    isIE: false, isOpera: false, isSafari: false, isKonquerer: false, isGecko: false, isSupported: false,
    create: function (options) {
        var that = this;
        var UA = navigator.userAgent.toLowerCase();
        var platform = navigator.platform.toLowerCase();
        var vendor = navigator.vendor || "";
        if (vendor === "KDE") {
            this.isKonqueror = true;
            this.isSupported = false
        } else {
            if (typeof window.opera !== "undefined") {
                this.isOpera = true;
                this.isSupported = true
            } else {
                if (typeof document.all !== "undefined") {
                    this.isIE = true;
                    this.isSupported = true
                } else {
                    if (/\(KHTML, like Gecko\) Safari/i.test(UA)) {
                        this.isSafari = true;
                        this.isSupported = (platform.indexOf("mac") > -1)
                    } else {
                        if ((UA.indexOf("gecko") != -1) || (/\(KHTML, like Gecko\) Version\/(.+)Safari/i.test(UA))) {
                            this.isGecko = true;
                            this.isSupported = true
                        }
                    }
                }
            }
        }
        window.historyStorage.setup(options);
        if (this.isSafari) {
            this.createSafari()
        }
        else {
            if (this.isOpera) {
                this.createOpera()
            }
        }
        var initialHash = this.getCurrentLocation();
        this.currentLocation = initialHash;
        if (this.isIE) {
            this.createIE(initialHash)
        }
        var unloadHandler = function () {
            that.firstLoad = null
        };
        this.addEventListener(window, "unload", unloadHandler);
        if (this.isIE) {
            this.ignoreLocationChange = true
        }
        else {
            if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
                this.ignoreLocationChange = true;
                this.firstLoad = true;
                historyStorage.put(this.PAGELOADEDSTRING, true)
            } else {
                this.ignoreLocationChange = false;
                this.fireOnNewListener = true
            }
        } var locationHandler = function () {
            that.checkLocation()
        };
        setInterval(locationHandler, 100)
    },
    initialize: function () {
        if (this.isIE) {
            if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
                this.fireOnNewListener = false;
                this.firstLoad = true;
                historyStorage.put(this.PAGELOADEDSTRING, true)
            } else {
                this.fireOnNewListener = true;
                this.firstLoad = false
            }
        }
    },
    addListener: function (listener) {
        this.listener = listener;
        if (this.fireOnNewListener) {
            this.fireHistoryEvent(this.currentLocation);
            this.fireOnNewListener = false
        }
    },
    addEventListener: function (o, e, l) {
        if (o.addEventListener) {
            o.addEventListener(e, l, false)
        }
        else {
            if (o.attachEvent) {
                o.attachEvent("on" + e, function () {
                    l(window.event)
                })
            }
        }
    },
    add: function (newLocation, historyData) {
        if (this.isSafari) {
            newLocation = this.removeHash(newLocation);
            historyStorage.put(newLocation, historyData);
            this.currentLocation = newLocation;
            window.location.hash = newLocation;
            this.putSafariState(newLocation)
        } else {
            var that = this;
            var addImpl = function () {
                if (that.currentWaitTime > 0) {
                    that.currentWaitTime = that.currentWaitTime - that.waitTime
                }
                newLocation = that.removeHash(newLocation);
                if (document.getElementById(newLocation) && that.debugMode) {
                    var e = "Exception: History locations can not have the same value as _any_ IDs that might be in the document," + " due to a bug in IE; please ask the developer to choose a history location that does not match any HTML" + " IDs in this document. The following ID is already taken and cannot be a location: " + newLocation;
                    throw new Error(e)
                }
                historyStorage.put(newLocation, historyData);
                that.ignoreLocationChange = true;
                that.ieAtomicLocationChange = true;
                that.currentLocation = newLocation;
                window.location.hash = newLocation;
                if (that.isIE) {
                    that.iframe.src = contextPath + "/includes/blank.html?" + newLocation
                } that.ieAtomicLocationChange = false
            };
            window.setTimeout(addImpl, this.currentWaitTime);
            this.currentWaitTime = this.currentWaitTime + this.waitTime
        }
    },
    isFirstLoad: function () {
        return this.firstLoad
    },
    getVersion: function () {
        return "0.6"
    },
    getCurrentLocation: function () {
        var r = (this.isSafari ? this.getSafariState() : this.getCurrentHash());
        return r
    },
    getCurrentHash: function () {
        var r = window.location.href;
        var i = r.indexOf("#");
        return (i >= 0 ? r.substr(i + 1) : "")
    },
    PAGELOADEDSTRING: "DhtmlHistory_pageLoaded",
    listener: null,
    waitTime: 200,
    currentWaitTime: 0,
    currentLocation: null,
    iframe: null,
    safariHistoryStartPoint: null,
    safariStack: null,
    safariLength: null,
    ignoreLocationChange: null,
    fireOnNewListener: null,
    firstLoad: null,
    ieAtomicLocationChange: null,
    createIE: function (initialHash) {
        this.waitTime = 400;
        var styles = (historyStorage.debugMode ? "width: 800px;height:80px;border:1px solid black;" : historyStorage.hideStyles);
        var iframeID = "rshHistoryFrame"; var iframeHTML = '<iframe frameborder="0" id="' + iframeID + '" style="' + styles + '" src= "' + contextPath + "/includes/blank.html?" + initialHash + '"></iframe>';
        document.write(iframeHTML);
        this.iframe = document.getElementById(iframeID)
    },
    createOpera: function () {
        this.waitTime = 400;
        var imgHTML = '<img src="javascript:location.href=\'javascript:dhtmlHistory.checkLocation();\';" style="' + historyStorage.hideStyles + '" />';
        document.write(imgHTML)
    },
    createSafari: function () {
        var formID = "rshSafariForm";
        var stackID = "rshSafariStack";
        var lengthID = "rshSafariLength";
        var formStyles = historyStorage.debugMode ? historyStorage.showStyles : historyStorage.hideStyles;
        var inputStyles = (historyStorage.debugMode ? "width:800px;height:20px;border:1px solid black;margin:0;padding:0;" : historyStorage.hideStyles);
        var safariHTML = '<form id="' + formID + '" style="' + formStyles + '">' + '<input type="text" style="' + inputStyles + '" id="' + stackID + '" value="[]"/>' + '<input type="text" style="' + inputStyles + '" id="' + lengthID + '" value=""/>' + "</form>";
        document.write(safariHTML);
        this.safariStack = document.getElementById(stackID);
        this.safariLength = document.getElementById(lengthID);
        if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
            this.safariHistoryStartPoint = history.length;
            this.safariLength.value = this.safariHistoryStartPoint
        } else { this.safariHistoryStartPoint = this.safariLength.value }
    },
    getSafariStack: function () {
        var r = this.safariStack.value;
        return historyStorage.fromJSON(r)
    },
    getSafariState: function () {
        var stack = this.getSafariStack();
        var state = stack[history.length - this.safariHistoryStartPoint - 1];
        return state
    },
    putSafariState: function (newLocation) {
        var stack = this.getSafariStack();
        stack[history.length - this.safariHistoryStartPoint] = newLocation;
        this.safariStack.value = historyStorage.toJSON(stack)
    },
    fireHistoryEvent: function (newHash) {
        var historyData = historyStorage.get(newHash);
        this.listener.call(null, newHash, historyData)
    },
    checkLocation: function () {
        if (!this.isIE && this.ignoreLocationChange) {
            this.ignoreLocationChange = false;
            return
        }
        if (!this.isIE && this.ieAtomicLocationChange) {
            return
        }
        var hash = this.getCurrentLocation();
        if (hash == this.currentLocation) {
            return
        }
        this.ieAtomicLocationChange = true;
        if (this.isIE && this.getIframeHash() != hash) {
            this.iframe.src = contextPath + "/includes/blank.html?" + hash
        }
        else {
            if (this.isIE) {
                return
            }
        }
        this.currentLocation = hash;
        this.ieAtomicLocationChange = false;
        this.fireHistoryEvent(hash)
    },
    getIframeHash: function () {
        var doc = this.iframe.contentWindow.document;
        var hash = String(doc.location.search);
        if (hash.length == 1 && hash.charAt(0) == "?") { hash = "" } else { if (hash.length >= 2 && hash.charAt(0) == "?") { hash = hash.substring(1) } } return hash
    },
    removeHash: function (hashValue) {
        var r;
        if (hashValue === null || hashValue === undefined) {
            r = null
        }
        else {
            if (hashValue === "") {
                r = ""
            }
            else {
                if (hashValue.length == 1 && hashValue.charAt(0) == "#") {
                    r = ""
                }
                else {
                    if (hashValue.length > 1 && hashValue.charAt(0) == "#") {
                        r = hashValue.substring(1)
                    }
                    else {
                        r = hashValue
                    }
                }
            }
        } return r
    },
    iframeLoaded: function (newLocation) {
        if (this.ignoreLocationChange) {
            this.ignoreLocationChange = false;
            return
        } var hash = String(newLocation.search);
        if (hash.length == 1 && hash.charAt(0) == "?") { hash = "" } else { if (hash.length >= 2 && hash.charAt(0) == "?") { hash = hash.substring(1) } } window.location.hash = hash;
        this.fireHistoryEvent(hash)
    }
};

window.historyStorage = {
    setup: function (options) {
        if (typeof options !== "undefined") {
            if (options.debugMode) {
                this.debugMode = options.debugMode
            }
            if (options.toJSON) {
                this.toJSON = options.toJSON
            }
            if (options.fromJSON) {
                this.fromJSON = options.fromJSON
            }
        }
        var formID = "rshStorageForm";
        var textareaID = "rshStorageField";
        var formStyles = this.debugMode ? historyStorage.showStyles : historyStorage.hideStyles;
        var textareaStyles = (historyStorage.debugMode ? "width: 800px;height:80px;border:1px solid black;" : historyStorage.hideStyles);
        var textareaHTML = '<form id="' + formID + '" style="' + formStyles + '">' + '<textarea id="' + textareaID + '" style="' + textareaStyles + '"></textarea>' + "</form>";
        document.write(textareaHTML);
        this.storageField = document.getElementById(textareaID);
        if (typeof window.opera !== "undefined") { this.storageField.focus() }
    },
    put: function (key, value) {
        this.assertValidKey(key);
        if (this.hasKey(key)) { this.remove(key) } this.storageHash[key] = value;
        this.saveHashTable()
    },
    get: function (key) {
        this.assertValidKey(key);
        this.loadHashTable();
        var value = this.storageHash[key];
        if (value === undefined) { value = null } return value
    },
    remove: function (key) {
        this.assertValidKey(key);
        this.loadHashTable();
        delete this.storageHash[key];
        this.saveHashTable()
    },
    reset: function () {
        this.storageField.value = "";
        this.storageHash = {}
    },
    hasKey: function (key) {
        this.assertValidKey(key);
        this.loadHashTable();
        return (typeof this.storageHash[key] !== "undefined")
    },
    isValidKey: function (key) {
        return (typeof key === "string")
    },
    showStyles: "border:0;margin:0;padding:0;",
    hideStyles: "left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute;",
    debugMode: false,
    storageHash: {},
    hashLoaded: false,
    storageField: null,
    assertValidKey: function (key) {
        var isValid = this.isValidKey(key);
        if (!isValid && this.debugMode) {
            throw new Error("Please provide a valid key for window.historyStorage. Invalid key = " + key + ".")
        }
    },
    loadHashTable: function () {
        if (!this.hashLoaded) {
            var serializedHashTable = this.storageField.value;
            if (serializedHashTable !== "" && serializedHashTable !== null) {
                this.storageHash = this.fromJSON(serializedHashTable);
                this.hashLoaded = true
            }
        }
    },
    saveHashTable: function () {
        this.loadHashTable();
        var serializedHashTable = this.toJSON(this.storageHash);
        this.storageField.value = serializedHashTable
    },
    toJSON: function (o) {
        return JSON.stringify(o)
    },
    fromJSON: function (s) {
        return JSON.parse(s)
    }
};