
(function ($, cp) {

    var msgNumberCtrlId;
    var msgGridCtrlId;

    cp.home = (function () {
        var showCount = function (msgCounts, msgNumberCtrlId) {
            for (var propName in msgCounts) {
                if (msgCounts.hasOwnProperty(propName)) {
                    var msgCount = msgCounts[propName];
                    var msgCountDiv = $("<div></div>").attr("style", "float: left;margin-left: 5px;");
                    msgCountDiv.append($("<a></a>").attr("href", "#").text(propName));
                    msgCountDiv.append(" ");
                    msgCountDiv.append($("<span></span>").text("(" + msgCount + ")"));
                    $("#" + msgNumberCtrlId).append(msgCountDiv);
                }
            }
        };

        var homeObj = {
            "init": function (msgNumberContainerId, msgGridContainerId) {
                msgNumberCtrlId = msgNumberContainerId;
                msgGridCtrlId = msgGridContainerId;
            },
            "loadMessageCount": function () {
                var service1Obj = cp.getService("Service/Service1.asmx");
                var msgCount = service1Obj.GetMessageCount();
                this.showMessageCount(cp.parseJSON(msgCount));
            },
            "showMessageCount": function (msgCounts) {
                showCount(msgCounts, msgNumberCtrlId);
            }
        };
        return homeObj;
    } ());

    cp.home.message = (function () {

        var msgGrid;

        var handleGridClick = function (e, target) {
            var msgGrid = target.grid;
            var dataItem = msgGrid.getDataItem(target.row);
            cp.loadPageAsyn("MessageDetail.html?msgId=" + dataItem.msgId);
        };

        var showList = function (messages, msgGridCtrlId) {
            //var grid;
            var columns = [];

            //Define Columns for the Grid.
            columns.push({ id: "msgId", name: "message Id", field: "msgId", width: 40, hidden: true });
            columns.push({ id: "Sent", name: "Sent", field: "sent", width: 150, sortable: true });
            columns.push({ id: "From", name: "From", field: "from", width: 150, reorderable: false });
            columns.push({ id: "Patient", name: "Patient", field: "patient", width: 150 });
            columns.push({ id: "Topic", name: "Topic", field: "topic", width: 350 });

            var options = {
                columns: columns,
                idProperty: 'msgId',
                dataset: messages,
                showFilter: false,
                editable: false,
                autoEdit: true,
                pageSize: 5,
                pagingMode: PagingModes.PagerClientSide,
                showCheckboxes: false,
                showDrillDown: false,
                //fillHeight:false,
                autoHeightToPageSize: true,
                showFooter: true,
                showGridSettings: false,
                drilldown: function (currentRow) {
                    alert('Drill Down on ' + currentRow.officeId);
                },
                drillDownTooltip: "Display Details About this Office",
                forceFitColumns: true,
                savePersonalization: false,
                autoCellEditCommit: false,
                enableCellRangeSelection: false,
                enableObjectSupport: true
            };

            msgGrid = $("#" + msgGridCtrlId).inforDataGrid(options);
            msgGrid.onClick.subscribe(handleGridClick);
        };

        return {
            "loadMessageList": function () {
                var service1Obj = cp.getService("Service/Service1.asmx");
                var msgList = service1Obj.GetMessageList();
                this.showMessageList(cp.parseJSON(msgList));
            },
            "showMessageList": function (messages) {
                showList(messages, msgGridCtrlId);
            },
            "getMsgGrid": function () {
                return msgGrid;
            }
        };

    } ());

})(jQuery, cp)
