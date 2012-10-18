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