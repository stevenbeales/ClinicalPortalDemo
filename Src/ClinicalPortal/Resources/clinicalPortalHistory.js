
(function ($, cp) {

    var lasthash = '';
    var isie = false;
    var iecount = 0;
    var ieVersion = 0;
    var historyMarked = [];

    cp.historyMark = {
        initialize: function () {
            var quirks = document.compatMode;
            if (document.all) {
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { ieVersion = new Number(RegExp.$1); }
                if (ieVersion >= 8 && quirks == 'BackCompat' || ieVersion < 8) {
                    bookmarks.iframe();
                    isie = true;
                }
            }
            setInterval(cp.historyMark.checkhash, 400);
        },
        sethash: function (hash, url, controlId) {
            if (hash) {
                if (isie) { iecount++; }
                var str = hash + ',' + url + ',' + controlId + ',' + iecount;
                var num = '';
                var partof = false;
                lasthash = hash;
                window.location.href = hash;
                for (var i = 0; i < historyMarked.length; i++) {
                    var bookmarkInfo = historyMarked[i].split(",");
                    if (bookmarkInfo[0] == hash) {
                        partof = true;
                        num = bookmarkInfo[3];
                    }
                }
                if (isie) {
                    if (!partof) {
                        bookmarks.setiframe(hash, iecount);
                    } else {
                        bookmarks.setiframe(hash, num);
                    }
                }
                if (!partof) {
                    historyMarked.push(str);
                }
            }
        },
        checkhash: function () {
            var currentHash = window.location.hash;
            var historyUrl, historyCtrlId, historyHash;
            if (currentHash) {
                if (currentHash != lasthash) {
                    if (lasthash != undefined) {
                        for (var i = 0; i < historyMarked.length; i++) {
                            var bookmarkInfo = historyMarked[i].split(",");
                            if (bookmarkInfo[0] == currentHash) {
                                historyHash = bookmarkInfo[0]; historyUrl = bookmarkInfo[1]; historyCtrlId = bookmarkInfo[2];
                                break;
                            }
                        }
                        if (historyHash && historyUrl && historyCtrlId) {
                            lasthash = historyHash;
                            cp.historyMark.load(historyUrl, "", historyCtrlId);
                        }
                    }
                }
            }
        },
        iframe: function () {
            var bug = document.createElement("iframe");
            bug.src = '/bookmarks/blank.html';
            bug.id = 'bugframe';
            bug.style.width = '100px';
            bug.style.height = '100px';
            bug.style.display = 'none';
            document.body.appendChild(bug);
        },
        setiframe: function (hash, num) {
            document.getElementById('bugframe').src = 'default.html?' + num + hash;
        },
        fixiframe: function (hash) {
            var currentHash = window.location.hash;
            if (hash) {
                if (hash != currentHash) {
                    window.location.href = hash;
                }
            }
        },
        load: function (url, hash, controlId) {
            controlId = controlId || cp.getContentControlId();
            cp.loadPageAsyn(controlId, url);
            if (hash && (typeof hash === "string")) {
                if (hash.slice(0, 1) !== "#") {
                    hash = "#" + hash;
                }
                this.sethash(hash, url, controlId);
            }
        }
    };


} (jQuery, cp));