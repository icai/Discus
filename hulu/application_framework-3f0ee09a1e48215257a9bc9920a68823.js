window.HuluRouter = {}, HuluRouter.Broadcaster = {}, _.extend(HuluRouter.Broadcaster, Backbone.Events), HuluRouter.BaseRouter = Support.SwappingRouter.extend({
	name: null,
	attachRootEl: function() {
		throw new Error("Not implemented!");
	},
	getHistoryState: function() {
		return Hulu.Utils.History.getRouterState(this);
	},
	serializeState: function(a) {
		return this.getMainView() ? this.getMainView().serializeState(a) : null;
	},
	deserializeState: function(a) {
		a == null && (a = this.getHistoryState()), this.getMainView() && this.getMainView().deserializeState(a);
	},
	getMainView: function() {
		throw new Error("Not implemented!");
	}
}), HuluRouter.Router = HuluRouter.BaseRouter.extend({
	constructor: function(a) {
		this._generateRoutes(), this._namedParam = /:\w+/g, this._scrollPositionTimer = -1, this._task = [], this._taskMaster = null, this._taskTimeout = Hulu.Configuration.isProduction() ? 6e4 : 12e4, HuluRouter.BaseRouter.apply(this, [a]);
	},
	before: {},
	after: {},
	_firstRouteFinished: !1,
	isFirstLoad: !0,
	pageEnterTime: (new Date).getTime(),
	_criticalBlock: function(a, b) {
		var c = this;
		return function() {
			b == null && (b = this);
			try {
				a.apply(b, arguments);
			} catch (d) {
				var e = Hulu.Utils.Url.isHomePage(),
					f = Hulu.Utils.Url.isErrorPage(),
					g = !c._firstRouteFinished || Cookies.getCookieByKey("HULU_CRIT_ERROR") != null;
				throw Hulu.Error.postScriptError(d, "Error in critical path!" + (g ? " during page load" : "") + (e ? " in home page" : "")), Hulu.GA.trackEvent(Hulu.GA.EVENTS.CRITICAL_ERROR, "critical_block"), Hulu.Utils.warn(d), Hulu.Utils.warn(d.stack), _.include(["development", "demo"], Hulu.Configuration.env()) ? d : g ? !e && !f && !Hulu.Utils.Env.isCrawler() ? (Hulu.navigate("/error_page/500", !0), d) : d : (Cookies.setCookieByKey("HULU_CRIT_ERROR", 1) && Hulu.Utils.Url.load(), d);
			}
		};
	},
	swap: function(a) {
		$(window).unbind("scroll.history"), this._scrollPositionTimer >= 0 && clearTimeout(this._scrollPositionTimer), this.isFirstLoad = !this.currentView, HuluRouter.Broadcaster.trigger(Hulu.Events.Router.BEFORE_SWAP_CRITICAL), HuluRouter.Broadcaster.triggerSafe(Hulu.Events.Router.BEFORE_SWAP, function(a) {
			Hulu.Error.postScriptError(a, "Errors in BEFORE_SWAP event listener");
		}), this._beforeSwap();
		if (!this.currentView) this._checkTask(a, !0, 0);
		else {
			var b = this._suppressScroll;
			if (!b) {
				var c = parseFloat(Hulu.Utils.History.getGlobalState("scrollTop")),
					d = Hulu.Utils.scrollBodyTop();
				$(window).bind("scroll.swap", function() {
					Hulu.Utils.scrollBodyTop(d);
				}), Hulu.Utils.log("History scrolltop: " + c);
			}
			var e = this;
			$("#footer").animate({
				opacity: 0
			}, 300), $("#content").animate({
				opacity: 0
			}, 300, this._criticalBlock(function() {
				$(window).unbind("scroll.swap"), e._checkTask(a, b, c);
			}));
		}
	},
	_beforeSwap: function() {
		Hulu.isSwapping = !0, Hulu.addNavigationHistory(Hulu.Utils.Url.convertToFullUrl(Hulu.Utils.Url.getHref())), this._currentSubRouter && this._currentSubRouter.beforeSwap && this._currentSubRouter.beforeSwap();
	},
	_checkTask: function(a, b, c) {
		var d = !1;
		if (this._task.length > 0) {
			this._taskMaster = $.when.apply($, this._task);
			if (!this._taskMaster.isResolved()) {
				d = !0;
				var e = this,
					f = this._taskMaster,
					g = setTimeout(function() {
						e._onSwapTaskFailed({
							responseText: "internal timeout in hulu swapping router"
						}), e._clearTask();
					}, e._taskTimeout);
				this._taskMaster.done(this._criticalBlock(function() {
					if (f != e._taskMaster) return;
					this._afterSwap(a, b, c);
				}, e)).fail(function() {
					if (f != e._taskMaster) return;
					e._onSwapTaskFailed.apply(e, arguments);
				}).always(function() {
					clearTimeout(g), e._clearTask();
				});
			}
		}
		d || this._afterSwap(a, b, c, !0, a instanceof Hulu.Views.Error);
	},
	_onSwapTaskFailed: function() {
		if (this._taskMaster == null) return;
		this._taskMaster = null;
		var a = null;
		for (var b = 0, c = arguments.length; b < c; b++) arguments[b] != null && arguments[b].responseText != null && (Hulu.Utils.warn("Swap task failed becauseof: " + arguments[b].responseText), a == null && arguments[b].status != null && (a = arguments[b].status));
		var d = Hulu.Utils.Views.Common.getErrorPage(a);
		this._afterSwap(d, !0, 0, !0, !0);
	},
	_afterSwap: function(a, b, c, d, e) {
		Hulu.isSwapping = !1;
		if (this._taskMaster == null && !d) return;
		var f = this.currentView != null;
		this.currentView && this.currentView.leave && (this.currentView.trayClicked || (Hulu.Config.clickedTrayConfig = null), this.currentView.leave()), this.currentView = a, this._currentSubRouter && this._currentSubRouter.beforeRenderView && this._currentSubRouter.beforeRenderView(), $(this.el).empty().append(this.currentView.render().el), this.currentView.markAddedToDomTree();
		var g = this;
		f && (setTimeout(function() {
			b ? Hulu.Utils.scrollBodyTop(0) : isNaN(c) || Hulu.Utils.scrollBodyTop(c);
		}, 0), $("#footer").animate({
			opacity: 1
		}, 300), $("#content").animate({
			opacity: 1
		}, 300, function() {
			$(window).bind("scroll.history", $.proxy(g._saveScrollPosition, g)), HuluRouter.Broadcaster.trigger(Hulu.Events.Router.NEW_VIEW_LOADED);
		})), e ? HuluRouter.Broadcaster.trigger(Hulu.Events.Router.SWAP_FAILED) : (HuluRouter.Broadcaster.trigger(Hulu.Events.Router.AFTER_SWAP_CRITICAL), HuluRouter.Broadcaster.triggerSafe(Hulu.Events.Router.AFTER_SWAP, function(a) {
			Hulu.Error.postScriptError(a, "Error in AFTER_SWAP listener");
		})), f || ($("#footer").show(), $(window).bind("scroll.history", $.proxy(this._saveScrollPosition, this)), HuluRouter.Broadcaster.trigger(Hulu.Events.Router.NEW_VIEW_LOADED)), setTimeout(function() {
			Cookies.eraseCookieByKey("HULU_CRIT_ERROR"), g._firstRouteFinished = !0;
		}, 0);
	},
	_saveScrollPosition: function() {
		this._scrollPositionTimer >= 0 && clearTimeout(this._scrollPositionTimer), this._scrollPositionTimer = setTimeout(function() {
			Hulu.Utils.History.setGlobalState("scrollTop", Hulu.Utils.scrollBodyTop()), this._scrollPositionTimer = -1;
		}, 1e3);
	},
	initialize: function() {
		this.attachRootEl();
	},
	_runFilters: function(a, b, c, d) {
		if (_(a).isEmpty()) return !0;
		var e = _(a).detect(function(a, e) {
			_.isRegExp(e) || (e = new RegExp(e));
			if (e.test(b)) {
				var f = _.isFunction(a) ? a.apply(d, c) : d[a].apply(d, c);
				return _.isBoolean(f) && f === !1;
			}
			return !1;
		}, this);
		return e ? !1 : !0;
	},
	route: function(a, b, c) {
		Backbone.history || (Backbone.history = new Backbone.History);
		var d = a;
		_.isRegExp(a) || (a = this._routeToRegExp(a)), Backbone.history.route(a, this._criticalBlock(function(e) {
			this.pageEnterTime = (new Date).getTime(), this._suppressScroll = Hulu.isInternalRoute, this._clearTask(), $("#content").stop(!0, !1);
			if (Hulu.afterRouteTask instanceof Function) {
				var f = Hulu.afterRouteTask.call(this);
				f != null && f.done instanceof Function && f.fail instanceof Function && this.registerCriticalTask(f);
			}
			var g = this._extractParameters(a, e),
				h = {};
			if (d != null) {
				var i = d.match(this._namedParam) || [];
				if (i.length > 0) for (var j = 0; j < i.length; j++) h[i[j].substr(1)] = g[j];
				i.length == g.length - 1 ? (h.query = g[g.length - 1], g.pop()) : h.query = {};
			}
			h.path = e;
			var k = this;
			this._currentSubRouter != null && this._currentSubRouter.deprecate(), this._currentSubRouter = null;
			if (b == "action placeholder") {
				var l = this._oldRoutes[d].split(".");
				if (l != null && l.length == 2) {
					var m = Hulu.Routers[l[0]];
					if (m) {
						var n = new m(this);
						this._currentSubRouter = n, g.unshift(l[1]), c = n._actionHandler, k = n;
					}
				}
			}
			this._runFilters(k.before, e, g, k) && (Hulu.activeController = k, Hulu.activeController.fragment = e, k.params = h, k.isInternalRoute = this._suppressScroll, c.apply(k, g), this._runFilters(k.after, e, g, k), this.trigger.apply(this, ["route:" + b].concat(g)));
		}, this));
	},
	getMainView: function() {
		return this._currentSubRouter ? this._currentSubRouter.mainView() : null;
	},
	registerCriticalTask: function(a, b) {
		if (!(a != null && a.done instanceof Function && a.fail instanceof Function)) throw new ArgumentError(a, "Must be jquery deferred or promise object");
		b != null && (a = Hulu.Utils.wrapDeferredWithFallback(a, b, this._taskTimeout)), this._task.push(a);
	},
	_clearTask: function() {
		this._task = [], this._taskMaster = null;
	},
	_generateRoutes: function() {
		if (this.routes) {
			if (window.errorCode != null && window.errorCode != "") {
				var a = window.errorCode.toString().charAt(0) == "5" ? "ErrorController.error500" : "ErrorController.error404",
					b = this.routes;
				this.routes = {}, this.routes[Hulu.Utils.Url.getPathName().substr(1)] = a, $.extend(this.routes, b), window.errorCode = null;
			}
			this._oldRoutes = $.extend({}, this.routes);
			for (var c in this.routes) this[this.routes[c]] == null && (this.routes[c] = "action placeholder");
		}
	}
}), HuluRouter.Router.SubRouter = function(a) {
	this.router = a;
}, HuluRouter.Router.SubRouter.prototype.deprecate = function() {
	this.router = null;
}, HuluRouter.Router.SubRouter.extend = HuluRouter.Router.extend, HuluRouter.PartialRouter = HuluRouter.BaseRouter.extend({
	constructor: function(a) {
		this.subHandlers = [], HuluRouter.BaseRouter.apply(this, [a]);
	},
	initialize: function() {
		this.attachRootEl(), HuluRouter.Broadcaster.on(Hulu.Events.Router.BEFORE_SWAP_CRITICAL, $.proxy(this.beforeSwap, this)), HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP_CRITICAL, $.proxy(this.afterSwap, this)), HuluRouter.Broadcaster.on(Hulu.Events.Router.SWAP_FAILED, $.proxy(this.swapFailed, this));
	},
	route: function(a, b, c) {
		var d = a;
		return _.isRegExp(a) || (a = this._routeToRegExp(a)), c || (c = this[b]), this.subHandlers.unshift({
			rawRoute: d,
			route: a,
			callback: c
		}), this;
	},
	beforeSwap: function() {
		return this._onSwap("before");
	},
	afterSwap: function() {
		return Hulu.Utils.DOM.insertIframehack(), this._onSwap("after");
	},
	swapFailed: function() {
		return this._onSwap("failed");
	},
	swap: function(a) {
		if (this.currentView == a) return;
		this.currentView && this.currentView.leave && this.currentView.leave(), this.currentView = a, $(this.el).empty().append(this.currentView.render().el), this.currentView.markAddedToDomTree();
	},
	skip: function() {},
	_onSwap: function(a) {
		var b = this,
			c = _.any(this.subHandlers, function(c) {
				var d = Backbone.history.getFragment();
				if (c.route.test(d)) {
					var e = b._extractParameters(c.route, d);
					return b.params = Hulu.Utils.Url.assembleParams(c.rawRoute, e), c.callback.apply(b, [a].concat(e)), !0;
				}
				return !1;
			});
		return c;
	}
}), HuluRouter.Router.singleton = function(a) {
	a && (a.getInstance = function() {
		return a._instance == null && (a._instance = new a, Hulu.Utils.History.registerRouter(a._instance)), a._instance;
	});
};

var Hulu = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Dispatcher: {},
	Common: {},
	Controls: {},
	Helpers: {},
	Global: {},
	_navigationHistory: [],
	needForceRefresh: !1,
	needFingerprint: !1,
	Config: {
		pageWidthBoundary: {
			mobile: 920,
			tablet: 1420,
			embed: 1420,
			standard: 1557
		},
		pageMinSize: {
			small: 980,
			medium: 1317,
			large: 1557,
			full: 1616
		},
		pageMinMargins: {
			mobile: 10,
			tablet: 30,
			embed: 90
		},
		subTraySize: {
			large: 3,
			small: 2
		},
		trayWidth: 480,
		columnWidth: {
			mobile: 150,
			embed: 240,
			tablet: 220,
			standard: 240
		},
		maxColumns: 6,
		minColumns: {
			mobile: 1,
			embed: 2,
			tablet: 3,
			standard: 4
		},
		sliderWidth: {
			six: 1424,
			five: 1198,
			four: 946
		},
		gridWidth: {
			six: 1424,
			five: 1198,
			four: 946
		}
	},
	pageSizeType: null,
	hasInited: !1,
	isSwapping: !1,
	init: function() {
		this.addNavigationHistory(document.referrer), Hulu.Dispatcher = _.clone(Backbone.Events), Hulu.router = Hulu.Routers.Main.getInstance(), Hulu.Configuration.region() != "jp" && Hulu.Controls.MobileDevice.init(), Hulu.videoPlayerRouter = Hulu.Routers.VideoPlayer.getInstance(), Hulu.header = Hulu.Routers.Header.getInstance(), Hulu.footer = Hulu.Routers.Footer.getInstance(), Hulu._setupContextTypes(), Login.init(), Hulu.SourceAware.init(), Hulu.Controls.Intl.init(), Hulu._setupGlobal(), Hulu.Controls.PlayButton.init(), Hulu.Controls.ExpandBadge.init(), Hulu.Controls.HoverBox.init(), Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_IN, function() {
			Cookies.initHeartbeat();
		}), Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_OUT, function() {
			Cookies.stopHeartbeat();
		}), Hulu.Behaviors.setLocale(Cookies.getCookieByKey("HULU_LOCALE")), this._setupEvents(), this.hasInited = !0;
	},
	run: function() {
		var a = document.documentElement.clientWidth;
		this._calculateSizeClass(), Hulu.Utils.History.start();
		var b = document.documentElement.clientWidth,
			c = Hulu.Utils.Env.getPageWidthBoundary(),
			d = Hulu.Utils.Env.getColumnWidth();
		_.each([c, c - d], function(c) {
			b < c && a >= c && Hulu.Dispatcher.trigger(Hulu.Events.Common.PAGEWIDTH_CHANGE);
		}), $(document).trigger(Hulu.Application.Events.READY), this.needForceRefresh = !1, this.needFingerprint = !1, Hulu.Utils.Env.isAjaxSwap() && !Hulu.Configuration.isDevelopment() && this._startCheckVersion();
	},
	_startCheckVersion: function() {
		try {
			this._versionCheckConstant = {
				FAST_INTERVAL: 3e5,
				NORMAL_INTERVAL: 18e5,
				CHECK_THRESHOLD: 36e5,
				SESSION_THRESHOLD: 36e6,
				FINGREPRINT_CHECK_THRESHOLD: 1296e6
			}, this._versionCheckStatus = {
				lastVersionCheckTime: new Date,
				sessionStartTime: new Date
			}, setTimeout(Hulu._checkVersion, Hulu._versionCheckConstant.FAST_INTERVAL);
		} catch (a) {
			Hulu.Utils.warn("Hulu._startCheckVersion meet error"), Hulu.Utils.warn(a);
		}
	},
	_checkVersion: function() {
		try {
			var a = new Date;
			if (a < Hulu._versionCheckStatus.sessionStartTime || a - Hulu._versionCheckStatus.sessionStartTime > Hulu._versionCheckConstant.SESSION_THRESHOLD) {
				Hulu.needForceRefresh = !0;
				return;
			}
			if (a < Hulu._versionCheckStatus.lastVersionCheckTime || a - Hulu._versionCheckStatus.lastVersionCheckTime > Hulu._versionCheckConstant.CHECK_THRESHOLD) {
				Hulu.needForceRefresh = !0;
				return;
			}
			var b = null,
				c = null;
			if (cram && cram.hasLoaded()) {
				b = cram.get("versionChangedTime"), b == null && (b = a.getTime(), cram.set("versionChangedTime", b)), c = cram.get("currentVersion");
				if (c == null || c != Hulu.Configuration.version()) c = Hulu.Configuration.version(), cram.set("currentVersion", c), b = a.getTime(), cram.set("versionChangedTime", b), cram.get("needFingerprint") == "yes" && cram.set("needFingerprint", "no");
			}
			if (a.getTime() - b > Hulu._versionCheckConstant.FINGREPRINT_CHECK_THRESHOLD) {
				if (cram && cram.hasLoaded() && cram.get("needFingerprint") == "yes") {
					Hulu.needForceRefresh = !0, Hulu.needFingerprint = !0, cram.set("needFingerprint", "no");
					return;
				}
				Hulu.needForceRefresh = !0, cram && cram.hasLoaded() && cram.set("needFingerprint", "yes");
				return;
			}
			Hulu.Collections.JsonResource.get("/api/2.0/get_version_info", {}).done(function(a) {
				Hulu.Utils.isBlank(a) || Hulu.Utils.isBlank(a.version) ? (Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.DATA_LOAD, {
					result: "invalid_resposne",
					response: encodeURIComponent(a)
				}), setTimeout(Hulu._checkVersion, Hulu._versionCheckConstant.FAST_INTERVAL)) : (Hulu._versionCheckStatus.lastVersionCheckTime = new Date, a.version.toLowerCase() != Hulu.Configuration.version() ? Hulu.needForceRefresh = !0 : setTimeout(Hulu._checkVersion, Hulu._versionCheckConstant.NORMAL_INTERVAL));
			}).fail(function(a) {
				Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.DATA_LOAD, {
					result: "error",
					response: encodeURIComponent(a)
				}), setTimeout(Hulu._checkVersion, Hulu._versionCheckConstant.FAST_INTERVAL);
			});
		} catch (d) {
			Hulu.Utils.warn("Hulu._checkVersion meet error"), Hulu.Utils.warn(d);
		}
	},
	getReferrer: function() {
		return this._navigationHistory[Math.max(this._navigationHistory.length - 2, 0)];
	},
	addNavigationHistory: function(a) {
		this._navigationHistory.push(a);
	},
	isInternalRoute: !1,
	navigate: function(a, b, c, d, e) {
		var f = null;
		try {
			decodeURIComponent(a);
		} catch (g) {
			f = "/error_page/404", HuluRouter.Broadcaster.triggerSafe(Hulu.Events.Router.BEFORE_NAVIGATE, null, {
				refresh: !0,
				targetUrl: f
			}), Hulu.Utils.Url.load(f);
		}
		Hulu.Utils.History.setGlobalState("scrollTop", Hulu.Utils.scrollBodyTop());
		var h = Redirects.findRedirect(a);
		h || (h = a);
		var i = b || !Hulu.Utils.Env.isAjaxSwap() || this.needForceRefresh;
		i || (h = h.replace(document.location.protocol + "//" + document.location.host, ""), i = Hulu.checkNavigateRefresh(h));
		if (i) this._onUnload(), h = Hulu.Utils.Url.convertToFullUrl(h), this.addNavigationHistory(h), f = h, this.needFingerprint && (f.indexOf("?") >= 0 ? f += "&cb=" + (new Date).getTime() : f += "?cb=" + (new Date).getTime()), HuluRouter.Broadcaster.triggerSafe(Hulu.Events.Router.BEFORE_NAVIGATE, null, {
				refresh: !0,
				targetUrl: f
			}), Hulu.Utils.Url.load(f);
		else {
			Hulu.Utils.isBlank(c) || Hulu.Context.save(c.type, c.data), Hulu.Social.verifyLoginStatus({
				forceServerRoundtrip: !0
			}), history && (history.state = null), this.isInternalRoute = !0, this.afterRouteTask = d;
			try {
				f = h, HuluRouter.Broadcaster.triggerSafe(Hulu.Events.Router.BEFORE_NAVIGATE, function(a) {
					Hulu.Error.postScriptError(a, "Errors in BEFORE_NAVIGATE event listener");
				}, {
					refresh: !1,
					targetUrl: f
				}), h == Hulu.Utils.Url.getPathName() + Hulu.Utils.Url.getSearch() ? Backbone.history.loadUrl(h) : e ? Backbone.history.navigate(h, {
					trigger: !0,
					replace: !0
				}) : Backbone.history.navigate(h, !0);
			} finally {
				this.isInternalRoute = !1, this.afterRouteTask = null;
			}
		}
	},
	checkNavigateRefresh: function(a) {
		if (Hulu.Utils.Url.isFullUrl(a)) {
			if (!Hulu.Utils.Url.isCurrentDomainUrl(a)) return !0;
			var b = Hulu.Utils.Url.parse(a),
				c = b != null ? b.attr("path") : null;
			return Hulu.Routers.Main.getInstance().isH1OPath(c);
		}
		if (Hulu.Utils.Url.isSecurePage(a) != Hulu.Utils.Url.isSecurePage()) return !0;
		var c = Hulu.Utils.Url.getAbsolutePath(a);
		return Hulu.Routers.Main.getInstance().isH1OPath(c);
	},
	_setupContextTypes: function() {
		Hulu.Context.registerType("SHOW", "id", {
			modelClass: Hulu.Models.Show
		}), Hulu.Context.registerType("SHOW_DETAILS", "id", {
			modelClass: Hulu.Models.ShowDetails
		}), Hulu.Context.registerType("VIDEO", "id", {
			modelClass: Hulu.Models.Video
		}), Hulu.Context.registerType("COMPANY", "id", {
			modelClass: Hulu.Models.Company
		}), Hulu.Context.registerType("COUNTRY", ["canonical_name", "asset_scope"], {
			modelClass: Hulu.Models.Country
		}), Hulu.Context.registerType("GENRE", ["canonical_name", "asset_scope"], {
			modelClass: Hulu.Models.Genre
		}), Hulu.Context.registerType("MASTHEAD", ["location", "package"]), Hulu.Context.registerType("COLLECTION", ["baseUrl", "restParams"], {
			size: 100
		}), Hulu.Context.registerType("SHELF_CONFIG", "name"), Hulu.Context.registerType("FEED_ITEM", "id"), Hulu.Context.registerType("PROFILE_DATA", "id"), Hulu.Context.registerType("AD", "id", {
			modelClass: Hulu.Models.Ad
		}), Hulu.Context.registerType("STREAM_SCHEDULE", "id", {
			modelClass: Hulu.Models.StreamSchedule
		}), Hulu.Context.registerType("VIDEO_GAME", "id", {
			modelClass: Hulu.Models.VideoGame
		}), Hulu.Context.registerType("PAGE_CONFIG", ["key", "source"]);
	},
	_setupGlobal: function() {
		Hulu.Global.queueIdCollection = new Hulu.Collections.IdsCollection({
			urls: Hulu.Constants.QUEUE_URLS,
			cookieKeyForCount: "HULU_QC"
		}), Hulu.Global.favIdCollection = new Hulu.Collections.IdsCollection({
			urls: Hulu.Constants.FAVORITES_URLS,
			cookieKeyForCount: "HULU_FC"
		});
	},
	_setupEvents: function() {
		$(window).resize($.proxy(function() {
			this._calculateSizeClass(), Hulu.Dispatcher.trigger(Hulu.Events.Common.PAGEWIDTH_CHANGE);
		}, this)), $(window).scroll(function() {
			Hulu.Dispatcher.trigger(Hulu.Events.Common.PAGE_SCROLL);
		}), $(window).scroll(Hulu.Utils.throttle(function() {
			Hulu.Dispatcher.trigger(Hulu.Events.Common.PAGE_THROTTLE_SCROLL);
		}, 200)), $(window).unload($.proxy(this._onUnload, this)), Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_IN, this._onLoggedIn, this), Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_OUT, this._onLoggedOut, this), Hulu.Dispatcher.on(Hulu.Events.Common.FB_INIT, Hulu.Social.onFBInit);
	},
	_calculateSizeClass: function() {
		var a = Hulu.Utils.DOM.getViewport(),
			b = "small",
			c = $("body");
		a.width >= Hulu.Config.pageMinSize.large ? b = "large" : a.width >= Hulu.Config.pageMinSize.medium && (b = "medium"), Hulu.Controls.MobileDevice.isMobile ? b = "mobile" : Hulu.Utils.Env.isEmbed() && (b = "embed"), c.hasClass(b) || c.removeClass("small medium large mobile embed").addClass(b);
		var d = a.width >= Hulu.Config.pageMinSize.full;
		d != c.hasClass("full") && c.toggleClass("full"), Hulu.pageSizeType = b;
	},
	_onLoggedIn: function(a) {
		if (Hulu.Utils.Env.isAjaxSwap() || !a || a.state != "init") Hulu.Global.queueIdCollection.load(), Hulu.Global.favIdCollection.load();
	},
	_onLoggedOut: function() {
		Hulu.Global.queueIdCollection.clear(), Hulu.Global.favIdCollection.clear();
	},
	_onUnload: function() {
		Hulu.hoverBox.disable();
	},
	getMasthead: function() {
		if (Hulu.activeController && Hulu.activeController.getMasthead) return Hulu.activeController.getMasthead();
	}
};

Hulu.inherits = function(a, b, c) {
	return Backbone.Model.extend.call(a, b, c);
}, Hulu.Application = {}, Hulu.Application.Events = {
	READY: "Hulu.Application.Events.ready"
}, Hulu.Constants = {
	QUEUE_URLS: {
		load: "/api/2.0/queued_video_ids",
		add: "/api/2.0/add_to_queue",
		remove: "/api/2.0/remove_from_queue"
	},
	FAVORITES_URLS: {
		load: "/api/2.0/favorited_show_ids",
		add: "/api/2.0/add_to_favorites",
		remove: "/api/2.0/remove_from_favorites"
	},
	RECOMMENDATION_URLS: {
		feedback: "/api/2.0/recommend_feedback"
	},
	META_TAGS_URL: "/api/2.0/meta_tags",
	MOZART_URLS: {
		smartstart: "/mozart/v1.h2o/recommended/smartstart",
		editorial: "/mozart/v1.h2o/editorial",
		masthead: "/mozart/v1.h2o/masthead/"
	},
	DOPPLER_URLS: {
		ingest: "/doppler/1.0/ingest",
		status: "/doppler/1.0/status",
		regex: /^\/doppler\/.*/gi
	},
	ANIMATION: {
		thumbFadeIn: 500,
		thumbFadeOut: 250,
		thumbFadeInDelay: 1e3,
		thumbFadeOutDelay: 0
	},
	QUERY_STRING_PARAMS: {
		genre: "g",
		details: "details",
		nextvideo: "nextvideo",
		playlist_id: "playlist_id"
	},
	CC_FREE_HD: {
		cc: "has_captions",
		free: "free_only",
		hd: "has_hd"
	},
	SPOTLIGHT: {
		types: ["election", "game_day_101", "huluween", "holiday_entertaining", "best_of_2012", "oscars"]
	},
	MASTHEAD_LOAD_TIMEOUT: 2e4,
	PLUS_URL_MATCHER: /^\/plus(-)?(\/|\?|$)/,
	SOURCE_AWARE: {
		constant: "const",
		incremental: "incremental",
		refresh: "refresh"
	},
	DONUT_SCOPE: "h2o",
	ADZONE: {
		redirectEnabled: !1,
		plusUpsellEnabled: !0,
		currentSeason: 2013,
		states: {
			PREGAME: "pre",
			INGAME: "in",
			POSTGAME: "post"
		},
		defaultState: "pre"
	},
	OSCARS_SURVEY: {
		identifier: "oscars2013",
		expires: "2013-02-24T16:30:00PST"
	},
	PLUS_UPSELL: {
		states: {
			INIT: "init",
			REDIRECT: "0",
			OPEN: "1",
			CLOSE: "2"
		}
	},
	AUTH_TYPE: {
		fox: "fox",
		nbc: "nbc"
	},
	PLAYER: {
		adzonePlayerSize: {
			width: 896,
			height: 504
		}
	},
	H2O_FLIGHT: "web",
	MOVIE_TRAILERS_SHOW_ID: 1439,
	ADZONE_SHOW_ID: 5734,
	TRENDING_NOW_PLAYLIST_ID: 1031,
	END: {}
},
function() {
	window.ArgumentNullError = Hulu.inherits(Error, {
		argumentName: "",
		message: "ArgumentNullError",
		name: "ArgumentNullError",
		constructor: function(a) {
			this.argumentName = a, this.message = "Argument {" + a + "} cannot be null!";
		}
	}), window.ArgumentError = Hulu.inherits(Error, {
		argumentName: "",
		message: "ArgumentError",
		name: "ArgumentError",
		constructor: function(a, b) {
			this.argumentName = a, this.message = "Argument {" + a + "} is not valid! " + b;
		}
	});
}.call(this), Hulu.Events = {}, Hulu.Events.Common = {
	PAGEWIDTH_CHANGE: "Hulu.Events.Common.PAGEWIDTH_CHANGE",
	PAGE_SCROLL: "Hulu.Events.Common.SCROLL",
	PAGE_THROTTLE_SCROLL: "Hulu.Events.Common.PAGE_THROTTLE_SCROLL",
	PAGE_READY: "Hulu.Events.Common.PAGE_READY",
	PLAYER_READY: "Hulu.Events.Common.PLAYER_READY",
	PLAYER_STARTED: "Hulu.Events.Common.PLAYER_STARTED",
	HEADER_READY: "Hulu.Events.Common.HEADER_READY",
	FB_INIT: "Hulu.Events.Common.FB_INIT",
	PAGE_CONFIG_READY: "Hulu.Events.Common.PAGE_CONFIG_READY",
	CC_FREE_HD_SELECT: "Hulu.Events.Common.CC_FREE_HD_SELECT",
	GRID_FILTER_CHANGED: "Hulu.Events.Common.GRID_FILTER_CHANGED"
}, Hulu.Events.CollectionBase = {
	DATA_UPDATED: "DATA_UPDATED",
	DATA_ERROR: "DATA_ERROR"
}, Hulu.Events.Login = {
	USER_LOGGED_IN: "Hulu.Events.Login.USER_LOGGED_IN",
	USER_LOGGED_OUT: "Hulu.Events.Login.USER_LOGGED_OUT",
	FB_CONNECTED: "Hulu.Events.Login.FB_CONNECTED"
}, Hulu.Events.Router = {
	BEFORE_NAVIGATE: "Hulu.Events.Router.BEFORE_NAVIGATE",
	BEFORE_SWAP_CRITICAL: "Hulu.Events.Router.BEFORE_SWAP_CRITICAL",
	AFTER_SWAP_CRITICAL: "Hulu.Events.Router.AFTER_SWAP_CRITICAL",
	BEFORE_SWAP: "Hulu.Events.Router.BEFORE_SWAP",
	AFTER_SWAP: "Hulu.Events.Router.AFTER_SWAP",
	NEW_VIEW_LOADED: "Hulu.Events.Router.NEW_VIEW_LOADED",
	SWAP_FAILED: "Hulu.Events.Router.SWAP_FAILED"
}, Hulu.Events.Control = {
	BUTTON_CLICK: "Hulu.Events.Control.BUTTON_CLICK",
	LIST_SELECT: "Hulu.Events.Control.LIST_SELECT",
	LIST_CHANGE: "Hulu.Events.Control.LIST_CHANGE",
	DROPDOWN_SELECT: "Hulu.Events.Control.DROPDOWN_SELECT",
	DROPDOWN_CHANGE: "Hulu.Events.Control.DROPDOWN_CHANGE",
	HOVERBOX_NOT_INTERESTED: "Hulu.Events.Control.HOVERBOX_NOT_INTERESTED",
	CONTROL_READY: "Hulu.Events.Control.CONTROL_READY",
	CONTROL_RENDERED: "Hulu.Events.Control.CONTROL_RENDERED",
	FILTER_CHANGED: "Hulu.Events.Control.Shelf.FILTER_CHANGED"
}, Hulu.Events.Collection = {
	SYNCED: "Hulu.Events.Collection.SYNCED"
}, Hulu.Events.Cram = {
	LOADED: "Hulu.Events.Cram.LOADED",
	UNLOAD: "Hulu.Events.Cram.UNLOAD"
}, Hulu.Events.Masthead = {
	LOAD: "Hulu.Events.Masthead.LOAD",
	FIRST_IMG_LOAD: "Hulu.Events.Masthead.FIRST_IMG_LOAD",
	DISPLAY: "Hulu.Events.Masthead.DISPLAY",
	RENDERED: "Hulu.Events.Masthead.RENDERED",
	FADED_IN: "Hulu.Events.Masthead.FADED_IN",
	LOAD_ERROR: "Hulu.Events.Masthead.LOAD_ERROR",
	MINI_PLAYER_STOPPED: "Hulu.Events.Masthead.MINI_PLAYER_STOPPED"
}, Hulu.Events.Shelf = {
	FIRST_LOADED: "Hulu.Events.Shelf.FIRST_LOADED"
}, Hulu.Configuration = {
	_Env: "production",
	_Region: "US",
	_Language: "en",
	_LocationHost: "www.hulu.com",
	_Version: null,
	_TempoVersion: null,
	_DefaultContentPgid: -1,
	ASSET_PREFIX: "/huluguru/",
	initialize: function(a) {
		a = a || {}, a.env && (this._Env = a.env), a.region && (this._Region = a.region), a.language && (this._Language = a.language), this._DefaultContentPgid = a.content_pgid || 67, this._Version = a.version, this._TempoVersion = a.tempo_version;
	},
	env: function() {
		return this._Env.toLowerCase();
	},
	language: function() {
		return this._Language.toLowerCase();
	},
	region: function() {
		return this._Region.toLowerCase();
	},
	locationHost: function() {
		return this._LocationHost;
	},
	isProduction: function() {
		return this.env().match(/production/) || this.env().match(/plusprod/);
	},
	isPlusprod: function() {
		return this.env().match(/plusprod/);
	},
	isStaging: function() {
		return !this.isProduction();
	},
	isSmoke: function() {
		return window.location.hostname == "smoke.hulu.com";
	},
	isDemo: function() {
		return window.location.hostname == "demo.huluqa.com";
	},
	isDevelopment: function() {
		return this.env() == "development" || this.env() == "staging_development";
	},
	getH1OHost: function() {
		return "http://" + this.locationHost();
	},
	getContentPgid: function() {
		return this._DefaultContentPgid;
	},
	version: function() {
		return this._Version != null ? this._Version.toLowerCase() : null;
	},
	tempoVersion: function() {
		return this._TempoVersion != null && this._TempoVersion.match(/^[a-zA-Z0-9]+$/) ? this._TempoVersion : null;
	}
};

var cram = function() {
	function a(a) {
		if (!document.createElement) return null;
		var b = document.getElementsByTagName("body");
		b = b.length > 0 ? b[0] : null;
		if (!b) return null;
		var c = document.createElement("div");
		return c ? (a(c), b.appendChild(c), c) : null;
	}
	var b = function() {
		return navigator.appName == "Microsoft Internet Explorer" && /MSIE ([0-9]+[\.0-9]*)/.test(navigator.userAgent) ? parseFloat(RegExp.$1) : 0;
	}, c = function() {
			this.store = {}, this.get = function(a) {
				return this.store[a];
			}, this.set = function(a, b) {
				this.store[a] = b;
			}, this.removeKey = function(a) {
				delete this.store[a];
			};
		};
	c.valid = function() {
		return !0;
	}, c.create = function(a, b) {
		var d = b || function() {};
		return d.valid = a || c.valid, d.prototype = new c, d;
	};
	var d, e = c.create(function() {
			return window.SWFObject;
		}, function() {
			if (document.getElementById("_cram_flash")) return d;
			var b = a(function(a) {
				a.id = "_cram_flash", a.style.position = "absolute", a.style.top = "-100px", a.style.left = "-100px";
			});
			if (!b) return;
			var c = new SWFObject("/cram.swf?v3", "_cram_swf", "1", "1", "9");
			c.addParam("allowScriptAccess", "sameDomain");
			if (c.write("_cram_flash")) {
				var e = document.getElementById("_cram_swf");
				e && (this.get = function(a) {
					if (e && e.get) return e.get(a);
				}, this.set = function(a, b) {
					e && e.set && e.set(a, b);
				}, this.remove = function(a) {
					e && e.remove && e.remove(a);
				}, this.free = function() {
					e = null;
				});
			}
			d = this;
		}),
		f = {
			flash: e
		}, g = ["flash"],
		h = null,
		i = !1,
		j = 8e3,
		k = {
			load: function() {
				for (var a = 0; a < g.length; a++) {
					var b = f[g[a]];
					if (b.valid()) {
						h = new b;
						break;
					}
				}
			},
			methods: f,
			valid: function() {
				return !!h;
			},
			loaded: function() {
				i = !0, $(document).trigger(Hulu.Events.Cram.LOADED);
			},
			unload: function() {
				try {
					h && i && h.free && h.free();
				} catch (a) {}
				$(document).trigger(Hulu.Events.Cram.UNLOAD);
			},
			hasLoaded: function() {
				return i;
			},
			setStore: function(a) {
				h = a;
			},
			get: function(a) {
				var b = null;
				if (h && i) try {
						var c = h.get(a) || "null";
						b = $.parseJSON(unescape(c));
				} catch (d) {
					b = null;
				}
				return b;
			},
			set: function(a, b) {
				if (h && i) try {
						h.set(a, escape($.toJSON(b)));
				} catch (c) {}
			},
			setAfterLoaded: function(a, b) {
				if (h && i) try {
						h.set(a, escape($.toJSON(b)));
				} catch (c) {} else {
					var d = -1,
						e = function() {
							clearTimeout(d), $(document).off(Hulu.Events.Cram.LOADED, e);
							try {
								h.set(a, escape($.toJSON(b)));
							} catch (c) {}
						};
					d = setTimeout(e, j), $(document).on(Hulu.Events.Cram.LOADED, e);
				}
			},
			remove: function(a) {
				if (h && i) try {
						h.removeKey(a);
				} catch (b) {}
			}
		};
	return k;
}();

$(window).unload(function() {
	cram.unload();
}),
function() {
	Hulu.Utils = {
		createImage: function() {
			return window.Image ? new Image : document.createElement("img");
		},
		_imageElementPool: [],
		MAXITEMS_IN_IMAGE_ELEMENTS_POOL: 50,
		_currentPosition: -1,
		generateUPID: function() {
			return String(Math.floor(Math.random() * 2147483647));
		},
		getReuseImageElement: function() {
			this._currentPosition++, this._currentPosition >= this.MAXITEMS_IN_IMAGE_ELEMENTS_POOL && (this._currentPosition = 0);
			var a = this._imageElementPool[this._currentPosition];
			return Hulu.Utils.isBlank(a) && (a = Hulu.Utils.createImage(), Hulu.Utils._imageElementPool.push(a)), $.browser.msie && !a.onload && (a.onload = function() {}), a;
		},
		getValueInChain: function(a, b) {
			if (a == null) return null;
			var c = a;
			for (var d = 0; d < b.length; d++) {
				var e = b[d];
				typeof c[e] == "function" ? c = c[e]() : c.hasOwnProperty(e) ? c = c[e] : c = null;
				if (c == null) break;
			}
			return c;
		},
		thumbUrl: function(a, b, c, d) {
			c == "1x1" ? c = "220x124" : c == "2x2" && (c = "476x268");
			var e = a;
			e == "video_game" && (c == "220x124" || c == "476x268") && (e = "video_game_plus_art");
			var f = "http://ib" + (b % 4 + 1) + ".huluim.com/" + e + "/" + b;
			return f += c != null ? "?size=" + c : "?", d && (f = Hulu.Utils.Url.buildSortedUrl(f, d)), f;
		},
		getViewportInfo: function() {
			var a = $(window).width(),
				b = $(window).height(),
				c = $(window).scrollLeft(),
				d = $(window).scrollTop();
			return {
				width: a,
				height: b,
				left: c,
				top: d
			};
		},
		showElementOnCenter: function(a) {
			if (!a) return;
			var b = this.getViewportInfo(),
				c = (b.height - a.outerHeight()) / 2,
				d = (b.width - a.outerWidth()) / 2;
			a.css({
				position: "fixed",
				top: c + "px",
				left: d + "px"
			}), a.show();
		},
		getCanvas: function() {
			return $("#header-bg-canvas");
		},
		showBackground: function(a, b) {
			var c = Hulu.Utils.getCanvas();
			if (!c) return;
			var d = "1600px",
				e = "1200px",
				f = $("body");
			f.length > 0 && (d = "100%", e = "100%"), c.css({
				backgroundColor: "#000000",
				width: d,
				height: e,
				opacity: .6,
				filter: "alpha(opacity=60)",
				position: "fixed",
				top: 0,
				left: 0
			}), c.empty().hide(), c.append('<div class="event-handle" style="width:100%;height:100%;position:relative;"></div>'), Hulu.Utils.DOM.insertIframehack(c, !0), a > 0 ? c.fadeIn(a, b) : c.show();
		},
		hideBackground: function() {
			var a = Hulu.Utils.getCanvas();
			if (!a) return;
			a.empty().hide();
		},
		attachBackgroundEventHandler: function(a, b) {
			var c = Hulu.Utils.getCanvas();
			if (!c) return;
			c.bind(a, b);
		},
		detachBackgroundEventHandler: function(a, b) {
			var c = Hulu.Utils.getCanvas();
			if (!c) return;
			c.unbind(a, b);
		},
		getOptionsInRange: function(a, b, c) {
			var d = "";
			if (a && b && a <= b) for (var e = a; e <= b; e++) d += "<option value='" + e + "'", c == e && (d += " selected"), d += ">" + e + "</option>";
			return d;
		},
		homePageUrl: function() {
			return "/";
		},
		isUndefined: function(a) {
			return typeof a == "undefined";
		},
		isBlank: function(a) {
			return _.isUndefined(a) || _.isNull(a) || /^\s*$/.test(a);
		},
		log: function(a) {},
		warn: function(a) {},
		assert: function(a, b) {},
		assertParams: function() {},
		getObjectAttributes: function(a) {
			var b = "";
			if (a instanceof Object) for (var c in a) _.isFunction(a[c]) ? b += c + ": function; " : b += c + ": " + a[c] + "; ";
			else _.isString(a) && (b += a.toString());
			return b;
		},
		getKeyByValue: function(a, b) {
			var c = null;
			for (k in a) if (b == a[k]) {
					c = k;
					break;
				}
			return c;
		},
		renderTemplate: function(a, b) {
			var c = Hulu.Configuration.region(),
				d = Hulu.Configuration.language();
			return b = b || {}, b = _.extend({
				_templatePath: a
			}, b), b = _.extend({
				_Region: c,
				_Language: d
			}, b), (Hulu.Configuration.isStaging() || Hulu.Configuration.isSmoke()) && a.match(/^test\//) ? JST["staging/templates/" + a](b) : (!JST["templates/" + a + "_" + c] || (a = a + "_" + c), JST["templates/" + a](b));
		},
		throttle: function(a, b) {
			var c = !1,
				d = !1;
			return function() {
				function g() {
					a.apply(e, f), setTimeout(h, b || 100), d = !0;
				}

				function h() {
					d = !1, c && g(), c = !1;
				}
				var e = this,
					f = arguments;
				d == 0 ? g() : c = !0;
			};
		},
		wrapDeferredWithFallback: function(a, b, c) {
			if (a != null && a.done instanceof Function && a.fail instanceof Function) {
				if (b != null && b instanceof Function) {
					var d = !1,
						e = function() {
							if (!d) try {
									b.call(this);
							} finally {
								d = !0;
							}
						}, f = $.Deferred(),
						g = setTimeout(function() {
							a.state() == "pending" && (e.call(this), f.resolve());
						}, c || 5e3);
					return a.fail(e).always(function() {
						f.resolve(), clearTimeout(g);
					}), f.promise();
				}
				throw new ArgumentError("fallback", "Must be function!");
			}
			throw new ArgumentError("deferredTask", "Must be jquery deferred or promise object");
		},
		findInKeys: function(a, b) {
			var c = {};
			return a == null ? c : (_.each(b, function(b) {
				a[b] && (c[b] = a[b]);
			}), c);
		},
		toRailsStyleParams: function(a) {
			var b = {};
			return _.each(a, function(a, c) {
				b[Hulu.Utils.Str.uncamelize(c)] = a;
			}), b;
		},
		pingImage: function(a, b) {
			b = b || {};
			var c = Hulu.Utils.getReuseImageElement(),
				d = function() {
					c.removeAttribute("src"), c.onload = null, c.onerror = null;
				}, e = function() {
					typeof b.onSuccess == "function" && b.onSuccess.apply(this, [a]), d();
				}, f = function() {
					typeof b.onError == "function" && b.onError.apply(this, [a]), d();
				};
			c.removeAttribute("src"), c.onload = e, c.onerror = f, c.src = a;
			if (c.complete) {
				var g = c.naturalWidth == undefined ? "width" : "naturalWidth";
				c[g] ? e() : f();
			}
			return c;
		},
		isValidEmailAddress: function(a) {
			var b = new RegExp(/^[a-z0-9!#\$%&'\*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#\$%&'\*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i);
			return b.test(a);
		},
		isSameConfig: function(a, b, c) {
			var d = {
				featureable_scope: "ignore",
				asset_scope: "ignore"
			};
			c && _.extend(d, {
				sort: "ignore",
				order: "ignore",
				season_number: "ignore"
			});
			var e = _.extend({}, a.restParams, d),
				f = _.extend({}, b.restParams, d),
				g = Hulu.Utils.Url.buildSortedUrl(a.baseUrl, e),
				h = Hulu.Utils.Url.buildSortedUrl(b.baseUrl, f);
			return g.toLowerCase() == h.toLowerCase();
		},
		scrollBodyTop: function(a) {
			var b;
			return $.browser.safari ? b = $("body") : b = $("html,body"), a == null ? b.scrollTop() : b.scrollTop(a);
		},
		isStringMatchPatterns: function(a, b, c) {
			for (var d = 0; d < a.length; d++) {
				var e = b,
					f = a[d];
				if (typeof f == "string") {
					c && (e = e.toLowerCase(), f = f.toLowerCase());
					if (e.indexOf(f) >= 0) return !0;
				} else if (e.search(f) >= 0) return !0;
			}
			return !1;
		},
		hideElement: function(a) {
			try {
				a && (a.style.display = "none");
			} catch (b) {}
		},
		loadScript: function(a, b) {
			Hulu.Utils.isBlank(a) || $.getScript(a, b);
		},
		classPatch: function(a, b) {
			_.extend(a.prototype, b);
		},
		classAttributePatch: function(a, b, c) {
			_.extend(a.prototype[b], c);
		},
		extendAttributesMap: function(a, b) {
			a.attributesMap = a.attributesMap.concat(b);
		},
		loadStylesheet: function(a) {
			if ($("head").length > 0 && !Hulu.Utils.isBlank(a)) {
				var b = document.createElement("link");
				b.rel = "stylesheet", b.type = "text/css", b.href = a, $("head")[0].appendChild(b);
			}
		},
		isWatchPage: function() {
			var a = Hulu.router.getMainView();
			if (a) return a.isWatchPage;
			var b = Hulu.Utils.Url.getPathName();
			return Hulu.Utils.Url.doesPathMatchPageType(b, Hulu.Utils.Url.PAGE_TYPES.watch);
		}
	};
}.call(this),
function() {
	Hulu.Utils.Str = {
		trim: function(a) {
			return a.replace(/^\s+|\s+$/g, "");
		},
		ltrim: function(a) {
			return a.replace(/^\s+/, "");
		},
		rtrim: function(a) {
			return a.replace(/\s+$/, "");
		},
		titlecase: function(a) {
			return a.replace(/\w\S*/g, function(a) {
				return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
			});
		},
		format: function() {
			if (arguments.length == 0) return null;
			var a = arguments[0].toString();
			for (var b = 1; b < arguments.length; ++b) {
				var c = new RegExp("\\{" + (b - 1) + "\\}", "gm");
				a = a.replace(c, arguments[b]);
			}
			return a;
		},
		fill: function(a, b, c, d) {
			a = a.toString();
			var e = [];
			d || e.push(a);
			for (var f = 0; f < c - a.length; ++f) e.push(b);
			return d && e.push(a), e.join("");
		},
		lfill: function(a, b, c) {
			return this.fill(a, b, c, !0);
		},
		rfill: function(a, b, c) {
			return this.fill(a, b, c, !1);
		},
		cleanupText: function(a) {
			return a.replace(/ & /g, " and ").replace(/\s+/g, "-").replace(/[^-\w]+/g, "").toLowerCase();
		},
		hashtag: function(a) {
			return "#" + a.replace(/&/g, "and").replace(/[^\w]+/g, "");
		},
		canonicalize: function(a) {
			return a.replace(/-/g, "_").replace(/ /g, "-").toLowerCase();
		},
		decamelize: function(a, b) {
			return b = b || " ", a.replace(/(?:^\w|[A-Z]|\b\w)/g, function(a, c) {
				return c == 0 ? a.toLowerCase() : b + a.toLowerCase();
			});
		},
		camelize: function(a, b) {
			return a.toLowerCase().replace(/(?:^|[-_])(\w)/g, function(a, c, d) {
				return d == 0 && !b ? c : c.toUpperCase();
			});
		},
		capitalize: function(a) {
			return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase();
		},
		escapeForRegex: function(a) {
			return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		},
		uncamelize: function(a) {
			return a.replace(/([A-Z])/g, "_$1").replace(/_+/g, "_").toLowerCase();
		},
		truncate: function(a, b) {
			return !a || a.length <= b ? a : $.trim(a.substring(0, b - 3)) + "...";
		},
		_truncatePreserveFunction: {
			en: function(a, b, c) {
				return !a || a.length <= b ? a : c ? $.trim(a).substring(0, b).split(" ").slice(0, -1).join(" ") : $.trim(a).substring(0, b - 3).split(" ").slice(0, -1).join(" ") + "...";
			},
			ja: function(a, b, c) {
				return b /= 2, !a || a.length <= b ? a : c ? $.trim(a).substring(0, b) : $.trim(a).substring(0, b - 3) + "...";
			}
		},
		truncatePreserveWord: function(a, b, c) {
			var d = Hulu.Configuration.language(),
				e = this._truncatePreserveFunction[d] || this._truncatePreserveFunction.en;
			return e(a, b, c);
		},
		objectToString: function(a) {
			return _.map(a, function(a, b) {
				return b + ":" + a;
			}).sort().join("|");
		}
	};
}.call(this),
function() {
	Hulu.Utils.Math = {
		randomInt: function(a) {
			return Hulu.Utils.isBlank(a) && (a = 1e8), Math.round(Math.random() * 1e8);
		},
		isVerticalRectIntersect: function(a, b) {
			return a.top + a.height >= b.top && b.top + b.height >= a.top;
		},
		isHorizontalRectIntersect: function(a, b) {
			return a.left + a.width >= b.left && b.left + b.width >= a.left;
		},
		isRectIntersect: function(a, b) {
			return this.isVerticalRectIntersect(a, b) && this.isHorizontalRectIntersect(a, b);
		},
		isVerticalRectContain: function(a, b) {
			return a.top <= b.top && a.top + a.height >= b.top + b.height;
		},
		isHorizontalRectContain: function(a, b) {
			return a.left <= b.left && a.left + a.width >= b.left + b.width;
		},
		isRectContain: function(a, b) {
			return this.isVerticalRectContain(a, b) && this.isHorizontalRectContain(a, b);
		},
		signOfNumber: function(a) {
			return a >= 0 ? 1 : -1;
		},
		boundedNumber: function(a, b, c) {
			return Math.min(b, Math.max(c, a));
		}
	};
}.call(this),
function() {
	var a = !! window.history && !! window.history.pushState,
		b = !1;
	try {
		if (window.navigator && navigator.userAgent) {
			var c = navigator.userAgent.toString();
			b = $.client.os.toLowerCase() == "windows" && c.search(/BingPreview/gi) >= 0;
		}
	} catch (d) {}
	var e = window.location,
		f = e.pathname.match(/^\/(signup?|thanks)(\/|$)+/),
		g = $.client.browser == "Explorer" && $.client.version >= 8 && Hulu.Configuration.region() != "jp" && !f,
		h = !b && (a || g);
	Hulu.Utils.Env = {
		getLoadingColumnCount: function() {
			return this._getColumnCount(document.documentElement.clientWidth);
		},
		getClientWidth: function() {
			var a = Hulu.Utils.Env.isEmbed() ? document.body : document.documentElement;
			return a.clientWidth;
		},
		getTrayWidth: function() {
			var a = Hulu.Utils.Env.getNewColumnCount(),
				b = Hulu.Utils.Env.getColumnWidth();
			return a * b;
		},
		getNewColumnCount: function() {
			var a = Hulu.Utils.Env.getClientWidth(),
				b = this._getColumnCount(a);
			return b;
		},
		_getConfigValue: function(a, b) {
			if (a) {
				var c = Hulu.Config[a];
				if (c) return b ? c[b] : c;
			}
		},
		_getMobilizedConfigValue: function(a) {
			var b = "standard";
			if (Hulu.Controls.MobileDevice.isMobile) {
				var c = document.documentElement.clientWidth;
				Hulu.Utils.Env.isTabletLayout() ? b = "tablet" : b = "mobile";
			} else Hulu.Utils.Env.isEmbed() && (b = "embed");
			return this._getConfigValue(a, b);
		},
		getPageWidthBoundary: function() {
			return this._getMobilizedConfigValue("pageWidthBoundary");
		},
		getMinColumnCount: function() {
			return this._getMobilizedConfigValue("minColumns");
		},
		getMaxColumnCount: function() {
			return this._getConfigValue("maxColumns");
		},
		getColumnWidth: function() {
			return this._getMobilizedConfigValue("columnWidth");
		},
		getMinMarginWidth: function() {
			return this._getMobilizedConfigValue("pageMinMargins");
		},
		_getColumnCount: function(a) {
			var b = Hulu.Utils.Env.getMaxColumnCount(),
				c = Hulu.Utils.Env.getMinColumnCount(),
				d = Hulu.Utils.Env.getPageWidthBoundary(),
				e = Hulu.Utils.Env.getColumnWidth();
			if (Hulu.Controls.MobileDevice.isMobile || Hulu.Utils.Env.isEmbed()) {
				var f = Hulu.Utils.Env.getMinMarginWidth() * 2,
					g = a - f,
					h = Math.max(c, Math.floor(g / e));
				return Math.min(b, h);
			}
			var i;
			for (var j = 0; b - j > c; j++) {
				i = d - j * e;
				if (a >= i) return b - j;
			}
			return c;
		},
		isIE: function(a) {
			return a ? $.browser.msie && parseInt($.browser.version, 10) == parseInt(a) : $.browser.msie;
		},
		isFireFox: function(a) {
			return a ? $.client.browser == "Firefox" && parseInt($.client.version, 10) == parseInt(a) : $.client.browser == "Firefox";
		},
		isCrawler: function() {
			return b;
		},
		isDegraded: function() {
			return Hulu.Utils.Env.isIE(8) || Hulu.Utils.Env.isIE(7) || Hulu.Controls.MobileDevice.isMobile;
		},
		isTabletLayout: function() {
			return Hulu.Controls.MobileDevice.isMobile && Hulu.Utils.Env.getClientWidth() >= 720;
		},
		isDeprecatingBrowser: function() {
			if (/^\/watch/.test(Hulu.Utils.Url.getPathName())) return !1;
			var a = $.client.browser == "Explorer" && $.client.version <= 7;
			return Hulu.Configuration.region() != "jp" && (a = a || $.client.browser == "Firefox" && parseFloat($.client.version) < 3.7), a;
		},
		isAjaxSwap: function() {
			if (window.navigator) {
				var a = navigator.userAgent;
				if (a.indexOf("Android") > -1 && a.indexOf("533.1") > -1) return !1;
			}
			return h;
		},
		hasPushState: function() {
			return a;
		},
		isEmbed: function() {
			return Hulu.Utils.Url.isEmbedPage(Hulu.Utils.Url.getPathName());
		}
	};
}.call(this),
function() {
	Hulu.Utils.GUID = {
		S4: function() {
			return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
		},
		getNewGuid: function() {
			var a = "";
			return _.each(_.range(8), function(b) {
				a += Hulu.Utils.GUID.S4();
			}), a.toUpperCase();
		}
	};
}.call(this),
function() {
	Hulu.Utils.DOM = {
		isHorizontalOverlapped: function(a, b) {
			var c = Hulu.Utils.DOM.getRectArea(a),
				d = Hulu.Utils.DOM.getRectArea(b);
			return Hulu.Utils.Math.isHorizontalRectIntersect(c, d);
		},
		isVerticalOverlapped: function(a, b) {
			var c = Hulu.Utils.DOM.getRectArea(a),
				d = Hulu.Utils.DOM.getRectArea(b);
			return Hulu.Utils.Math.isVerticalRectIntersect(c, d);
		},
		isVerticalContain: function(a, b) {
			var c = Hulu.Utils.DOM.getRectArea(a),
				d = Hulu.Utils.DOM.getRectArea(b);
			return Hulu.Utils.Math.isVerticalRectContain(c, d);
		},
		isVerticalIntersect: function(a) {
			var b = Hulu.Utils.DOM.getRectArea(a),
				c = Hulu.Utils.DOM.getViewport();
			return Hulu.Utils.Math.isVerticalRectIntersect(c, b);
		},
		isInView: function(a) {
			var b = Hulu.Utils.DOM.getRectArea(a),
				c = Hulu.Utils.DOM.getViewport();
			return Hulu.Utils.Math.isRectContain(c, b);
		},
		isInViewVertically: function(a) {
			var b = Hulu.Utils.DOM.getRectArea(a),
				c = Hulu.Utils.DOM.getViewport();
			return Hulu.Utils.Math.isVerticalRectContain(c, b);
		},
		isOutOfView: function(a) {
			var b = Hulu.Utils.DOM.getRectArea(a),
				c = Hulu.Utils.DOM.getViewport();
			return !Hulu.Utils.Math.isRectIntersect(b, c);
		},
		getRectArea: function(a) {
			var b = $(a),
				c = b.offset() || {
					top: 0,
					left: 0
				};
			return {
				top: c.top,
				left: c.left,
				height: b.outerHeight(),
				width: b.outerWidth()
			};
		},
		getViewport: function() {
			var a = $(document);
			return {
				top: a.scrollTop(),
				left: a.scrollLeft(),
				height: document.documentElement.clientHeight,
				width: document.documentElement.clientWidth
			};
		},
		pageAtTop: function(a) {
			return Hulu.Utils.DOM.getViewport().top <= (a || 10);
		},
		insertIframehack: function(a, b) {
			var c = $(a || document);
			c = b ? c : c.find(".iframe-hacker-container[iframe-added!='1']"), c.prepend('<iframe class="iframe-hacker"></iframe>').attr("iframe-added", "1").addClass("iframe-hacker-container"), _.each(c, this.resizeIframeHack);
		},
		resizeIframeHack: function(a) {
			a = $(a);
			var b = parseInt(a.css("border-left-width")),
				c = parseInt(a.css("border-top-width")),
				d = b + parseInt(a.css("padding-left")),
				e = parseInt(a.css("border-right-width")) + parseInt(a.css("padding-right")),
				f = c + parseInt(a.css("padding-top")),
				g = parseInt(a.css("border-bottom-width")) + parseInt(a.css("padding-bottom")),
				h = a.children("iframe.iframe-hacker");
			d && e && f && g ? h.height(a.height() + f + g).width(a.width() + d + e).css("top", "-" + c + "px").css("left", "-" + b + "px") : h.height("100%").width("100%");
		},
		toggleIfameHackTag: function(a) {
			var b = $(document.body);
			a ? (b.addClass("iframe-hacker-page"), ($.client.os == "Windows" || $.client.os == "Linux") && b.addClass("iframe-square-hack")) : (b.removeClass("iframe-hacker-page"), b.removeClass("iframe-square-hack"));
		}
	};
}.call(this),
function() {
	var a = /^\/error_page\/.*/gi,
		b = Hulu.Utils.Env.hasPushState() || !Hulu.Utils.Env.isAjaxSwap();
	Hulu.Utils.Url = {
		_namedParam: /:\w+/g,
		PAGE_TYPES: {
			homepage: {
				regex: /^\/$/,
				pageType: "homepage"
			},
			tv: {
				regex: /^\/tv$/,
				pageType: "tv"
			},
			movies: {
				regex: /^\/movies$/,
				pageType: "movies"
			},
			latino: {
				regex: /^\/latino$/,
				pageType: "latino"
			},
			search: {
				regex: /^\/search$/,
				pageType: "search"
			},
			company: {
				regex: /^\/(company|companies|network|studio)(\/|$)/,
				pageType: "company"
			},
			picks: {
				regex: /^\/browse\/picks/,
				pageType: "browse-picks"
			},
			tvgenres: {
				regex: /^\/tv\/genres/,
				pageType: "tv-genres"
			},
			moviesgenres: {
				regex: /^\/movies\/genres/,
				pageType: "movies-genres"
			},
			ad: {
				regex: /^\/watch\/ad/,
				pageType: "ad"
			},
			adzone: {
				regex: /^\/adzone(\/|$)/,
				pageType: "adzone"
			},
			watch: {
				regex: /^\/watch\//,
				pageType: "watch"
			},
			browse: {
				regex: /^\/browse\//,
				pageType: "browse"
			},
			video_games: {
				regex: /^\/videogames$/,
				pageType: "video_games"
			},
			docomo: {
				regex: /^\/docomo\//,
				pageType: "docomo"
			}
		},
		SECURE_PAGES: ["signup"],
		join: function(a, b) {
			return a = Hulu.Utils.Str.trim(a), b = Hulu.Utils.Str.trim(b).replace(/^\/+/g, ""), a[a.length - 1] == "/" ? a + b : a + "/" + b;
		},
		isFullUrl: function(a) {
			return a.indexOf("http://") == 0 || a.indexOf("https://") == 0;
		},
		isInternalPage: function(a) {
			return window.location.host.match(/\.hulu(qa)?\.com(:[0-9]+)?$/);
		},
		isSecurePage: function(a) {
			var b = a || Hulu.Utils.Url.getHref(),
				c = !1;
			try {
				var d = $.url(b).data.seg.path;
				c = _.some(Hulu.Utils.Url.SECURE_PAGES, function(a) {
					return a == d;
				});
			} catch (e) {}
			return c;
		},
		parse: function(a) {
			var b = null;
			try {
				b = $.url(a);
			} catch (c) {}
			return b;
		},
		isCurrentDomainUrl: function(a) {
			return a = a.replace(document.location.protocol + "//" + document.location.host, ""), a.indexOf("http://") < 0 && a.indexOf("https://") < 0;
		},
		isGenrePage: function(a) {
			return /^\/\w+\/genres/.test("url");
		},
		isEmbedPage: function(a) {
			return /\/embed/.test(a);
		},
		isAdWatchPage: function(a) {
			return /\/watch\/ad\/(\d+)/.test(a);
		},
		isAdZoneWatchPage: function(a) {
			return /\/adzone\/(\d+)/.test(a || Hulu.Utils.Url.getPathName());
		},
		isLivePage: function() {
			var a = Hulu.Utils.Url.getPathName();
			return /\/live(\?|$)/.test(a);
		},
		isSignupPage: function() {
			var a = Hulu.Utils.Url.getPathName();
			return /^\/(signup|thanks)(\?|$)/.test(a);
		},
		isHomePage: function() {
			var a = Hulu.Utils.Url.getPathName();
			return a == "" || a == "/";
		},
		isErrorPage: function() {
			return a.exec(Hulu.Utils.Url.getPathName()) != null;
		},
		getWatchId: function(a) {
			return /\/watch\/(\d+)/.test(a) ? RegExp.$1 : -1;
		},
		getSeriesName: function(a) {
			var b = null;
			if (a && Hulu.Utils.Url.getPageType(a) == "series") {
				var c = Hulu.Utils.Url.parse(a);
				c && (b = c.attr("path").replace(/\//g, ""));
			}
			return b;
		},
		getAbsolutePath: function(a) {
			return /^\//.test(a) ? a : Hulu.Utils.Url.join(Hulu.Utils.Url.getPathName(), a);
		},
		getSourcePath: function(a) {
			if (!a) return null;
			var b = a.type,
				c = a.path;
			return b == Hulu.PageInfo.API_TYPES.API2 ? c = "/api/2.0" + c : b == Hulu.PageInfo.API_TYPES.MOZART ? c = "/mozart" + c : b == Hulu.PageInfo.API_TYPES.SAPI && (c = "/sapi/search" + c), c;
		},
		buildSortedUrl: function(a, b) {
			var c = function(a, b) {
				return a.length > 150 || b.length > 150 ? a.length - b.length : a == b ? 0 : a < b ? -1 : 1;
			};
			return Hulu.Utils.Url.build(a, $.param(b).split("&").sort(c));
		},
		parseQueryString: function(a) {
			var b = {}, c = (a || "").split("&");
			for (var d = 0; d < c.length; d++) {
				var e = c[d].split("=");
				if (e.length == 2) try {
						b[e[0]] = decodeURIComponent(e[1].replace(/\+/g, " "));
				} catch (f) {
					Hulu.Utils.warn(f);
				}
			}
			return b;
		},
		parseFragment: function(a) {
			a = a || Backbone.history.fragment;
			var b = a.split("#")[0].split("?"),
				c = b[0],
				d = Hulu.Utils.Url.parseQueryString(b[1]);
			return {
				path: c,
				query: d,
				queryString: b[1]
			};
		},
		secureUrl: function(a) {
			return Hulu.Utils.secureHost == "" ? a : "https://" + Hulu.Utils.secureHost + a;
		},
		mozartUrl: function(a, b) {
			var c = a.split("?"),
				d = c[0],
				e = [];
			c[1] != null && (e = c[1].split("&")), e = e.concat(b);
			var f = [],
				g = {};
			for (var h in e) {
				if (typeof e[h] != "string") {
					Hulu.Utils.warn("Unexpected param to mozart url: " + a + ", " + b), Hulu.Utils.warn("key " + h + ", value " + e[h]);
					continue;
				}
				var i = e[h].toLowerCase(),
					j = null,
					k = null;
				i.indexOf("id=", 0) === 0 && (j = e[h].substring(3), k = "id"), i.indexOf("name=", 0) === 0 && (j = e[h].substring(5), k = "id"), i.indexOf("brand_name=", 0) === 0 && (j = e[h].substring(11).replace(/\+/g, "%20"), k = "id"), i.indexOf("type=", 0) === 0 && (j = e[h].substring(5), k = "type");
				if (j != null) {
					if (g[k] && j !== g[k]) throw new Error("Conflicting name and id or type: " + j + " vs. " + g[k] + " in " + e.join("&"));
					g[k] = j;
				} else e[h].length > 0 && f.push(e[h]);
			}
			return a.indexOf("_language=") == -1 && (f.push("_language=" + Hulu.Configuration.language()), f.push("_region=" + Hulu.Configuration.region())), d.charAt(d.length - 1) === "/" && (d = d.substr(0, d.length - 1)), Hulu.Utils.isBlank(g.id) || (d += "/" + g.id), Hulu.Utils.isBlank(g.type) || (d += "/" + g.type), d + "?" + f.join("&");
		},
		isMozartUrl: function(a) {
			return a.indexOf("/mozart/v1.h2o/", 0) !== -1 || a.indexOf("/v1.h2o/", 0) !== -1;
		},
		isEditorialUrl: function(a) {
			return /^\/mozart\/[^\/]+\/editorial/i.test(a);
		},
		isRecommendationUrl: function(a) {
			return /^\/mozart\/[^\/]+\/recommended/i.test(a);
		},
		extractIdFromEditorialUrl: function(a) {
			var b = /^\/mozart\/[^\/]+\/editorial\/(\d+)$/i;
			return b.test(a) ? a.replace(b, "$1") : null;
		},
		isWYWUrl: function(a, b) {
			return this.isMozartUrl(a) && b["name"] == "wyw";
		},
		parseSpotlightPath: function(a) {
			if (!this.isSpotlightUrl(a)) return null;
			var b = null,
				c = null,
				d = null,
				e = /^\/([a-zA-Z0-9-_]+)($|\/([0-9]+)\/([0-9]+))/.exec(a.replace(/-/g, "_"));
			return e && (b = e[1], c = e[3], d = e[4]), [b, c, d];
		},
		isSpotlightUrl: function(a) {
			var b = a.split("/")[1];
			return b && _.include(Hulu.Constants.SPOTLIGHT.types, b.replace(/-/g, "_"));
		},
		build: function(a, b, c) {
			c || (c = {});
			var d = _.filter(b, function(a) {
				return !Hulu.Utils.isBlank(a);
			});
			if (Hulu.Utils.Url.isMozartUrl(a)) return Hulu.Utils.Url.mozartUrl(a, b);
			if (d.length == 0) return a;
			var e = a;
			return c.useHash ? e += a.match(/\#/) ? "&" : "#" : e += a.match(/\?/) ? "&" : "?", e + d.join("&");
		},
		load: function(a) {
			Hulu.Utils.isBlank(a) ? window.location.reload() : document.location.href = a;
		},
		pop: function(a, b, c, d, e, f) {
			b = b || 900, c = c || 600, window.hasOwnProperty && window.hasOwnProperty("screenX") && window.hasOwnProperty("outerWidth") ? e = Math.min(isNaN(e) ? window.screenX + (window.outerWidth - b) / 2 : e - b / 2, window.screenX + window.outerWidth - b) : e = isNaN(e) ? 0 : e - b / 2, window.hasOwnProperty && window.hasOwnProperty("screenY") && window.hasOwnProperty("outerHeight") ? f = Math.min(isNaN(f) ? window.screenY + (window.outerHeight - c) / 2 : f - c / 2, window.screenY + window.outerHeight - c - 60) : f = isNaN(f) ? 0 : f - c / 2;
			var g = window.open(a, "_blank", "toolbar=0,status=0,resizable=1,scrollbars=1,width=" + b + ",height=" + c + ",left=" + e + ",top=" + f);
			g ? g.focus() : d && d();
		},
		assembleParams: function(a, b) {
			var c = {}, d = a.match(this._namedParam) || [];
			if (d.length > 0) for (var e = 0; e < d.length; e++) c[d[e].substr(1)] = b[e];
			return d.length == b.length - 1 ? (c.query = b[b.length - 1], b.pop()) : c.query = {}, c;
		},
		convertToFullUrl: function(a) {
			if (Hulu.Utils.Url.isFullUrl(a)) return a;
			var b = Hulu.Utils.Url.getAbsolutePath(a);
			return a = Hulu.Utils.Url.join(document.location.protocol + "//" + document.location.host, b), a;
		},
		doesCurrentPageMatchPageType: function(a) {
			return Hulu.Utils.Url.doesPathMatchPageType(Hulu.Utils.Url.getPathName(), a);
		},
		doesPathMatchPageType: function(a, b) {
			if (a && b && b.regex) {
				var c = b.regex;
				if (!c.length) return c.test(a);
				for (var d = 0; d < c.length; d++) if (c[d].test(a)) return !0;
			}
			return !1;
		},
		getCurrentPageType: function() {
			return Hulu.Utils.Url.getPageType(Hulu.Utils.Url.getPathName());
		},
		getPageType: function(a) {
			var b = null,
				c = Hulu.Utils.Url.PAGE_TYPES;
			for (var d in c) if (c.hasOwnProperty(d) && Hulu.Utils.Url.doesPathMatchPageType(a, c[d])) {
					b = c[d].pageType;
					break;
				}
			if (b == null) {
				var e = Hulu.router.getRoute(a);
				b = e.split("Controller")[0].toLowerCase(), b == "shows" ? b = "series" : b == "home" && (b = a.replace(/^\//, "").replace(/\//g, "-").toLowerCase());
			}
			return b == null && (b = "unknown"), b;
		},
		getQueryStringParam: function(a) {
			var b = null;
			if (a) {
				var c = Hulu.Utils.Url.parseFragment().query;
				if (c && c[a]) {
					b = c[a];
					var d = b.indexOf("#");
					d > -1 && (b = b.substr(0, d));
				}
			}
			return b;
		},
		getHashParam: function(a) {
			var b = null;
			if (a) {
				var c = Hulu.Utils.Url.getHash();
				if (c) {
					c = c.replace("#", "");
					var d = Hulu.Utils.Url.parseQueryString(c);
					d && d[a] && (b = d[a]);
				}
			}
			return b;
		},
		getPathName: function() {
			if (b) return window.location.pathname;
			var a = Backbone.history.getHash();
			return a = a.replace(/[\?|#].*$/i, ""), "/" + a;
		},
		getHash: function() {
			var a = Backbone.history.getHash();
			if (!b) {
				var c = a.search("#");
				c > 0 ? a = a.substring(c + 1) : a = "";
			}
			return a != "" && (a = "#" + a), a;
		},
		getSearch: function() {
			if (b) return window.location.search;
			var a = Backbone.history.getHash(),
				c = a.search("\\?"),
				d = "";
			if (c > 0) {
				var e = a.search("#");
				e >= 0 ? d = a.substring(c, e) : d = a.substring(c);
			}
			return d;
		},
		getHref: function() {
			return b ? window.location.href : window.location.href.replace("/#!", "/").replace(/\/#$/, "/");
		}
	};
}.call(this), Hulu.Utils.Treatment = {
	experiments: {
		SHORT_FORM_UX: "short_form_ux",
		PRE_LOAD_PLAYER: "player_loading_time_improve",
		MASTHEAD_REDESIGN: "masthead-redesign"
	},
	treatments: {
		SHORT_FORM_UX: "new tray format",
		ADJUST_SERVICE_CALL: "adjust service call in js",
		MASTHEAD_REDESIGN_TOTALLY_NEW: "totally-new",
		MASTHEAD_REDESIGN_HALF_NEW: "half-new",
		MASTHEAD_REDESIGN_P13N: "p13n-masthead"
	},
	disableShortFormUx: function() {
		return Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT) != Hulu.Utils.Treatment.treatments.SHORT_FORM_UX;
	},
	LoadPlayerBeforeSwap: function() {
		var a = Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT);
		return a == Hulu.Utils.Treatment.treatments.ADJUST_SERVICE_CALL;
	},
	useNewMastheadUI: function() {
		var a = Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT);
		return _.include([Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_TOTALLY_NEW, Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_HALF_NEW, Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_P13N], a);
	},
	useNewMastheadData: function() {
		var a = Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT);
		return _.include([Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_TOTALLY_NEW, Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_P13N], a);
	},
	userNewMastheadTotallyNew: function() {
		var a = Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT);
		return _.include([Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_TOTALLY_NEW], a);
	},
	userNewMastheadP13N: function() {
		var a = Hulu.Donut.getAssignment(Hulu.Constants.H2O_FLIGHT);
		return _.include([Hulu.Utils.Treatment.treatments.MASTHEAD_REDESIGN_P13N], a) && Hulu.Behaviors.isLoggedIn();
	}
},
function() {
	var a = {
		HULU_UID: {
			name: "_hulu_uid"
		},
		HULU_ID: {
			name: "_hulu_id"
		},
		HULU_E_UID: {
			name: "_hulu_e_uid"
		},
		HULU_UNAME: {
			name: "_hulu_uname"
		},
		HULU_PLID: {
			name: "_hulu_plid"
		},
		HULU_PGID: {
			name: "_hulu_pgid"
		},
		HULU_GUID: {
			name: "guid",
			expires_in_secs: 315576e3,
			keep_on_logout: !0
		},
		HULU_SID: {
			name: "sid",
			expires_in_secs: 7200
		},
		HULU_BEACON_SEQ: {
			name: "beacon_seq",
			expires_in_secs: 7200
		},
		HULU_SITE_BEACON_SEQ: {
			name: "site_beacon_seq",
			expires_in_secs: 7200
		},
		HULU_S_REF: {
			name: "_session_referrer",
			expires_in_secs: 7200
		},
		HULU_AUTH: {
			name: "_hulu_auth"
		},
		HULU_FROM_FOR_SIGNUP: {
			name: "from",
			expires_in_secs: 2592e3
		},
		HULU_F1: {
			name: "f1",
			expires_in_secs: 2592e3
		},
		HULU_CCOH_IGNORE: {
			name: "_hulu_plholdignore",
			expires_in_secs: 86400
		},
		HULU_FB_CONNECTED: {
			name: "_fb_connected"
		},
		HULU_FB_ID: {
			name: "_fb_id"
		},
		HULU_ISON: {
			name: "_hulu_ison"
		},
		HULU_SHRB: {
			name: "_hulu_shrb"
		},
		HULU_HARB: {
			name: "_hulu_harb"
		},
		HULU_RCSOURCES: {
			name: "_rcsources",
			expires_in_secs: 86400
		},
		HULU_PW: {
			name: "password",
			path: "/api/2.0/authenticate"
		},
		HULU_LI: {
			name: "login",
			path: "/api/2.0/authenticate"
		},
		HULU_FBPW: {
			name: "fb_passwd",
			path: "/api/2.0/new_fb"
		},
		HULU_FBCPW: {
			name: "fb_passwd_c",
			path: "/api/2.0/new_fb"
		},
		HULU_MOBILE_PLUS: {
			name: "mobile_plus",
			expires_in_secs: 3600
		},
		HULU_MOBILE_WARNING: {
			name: "mobile_warning",
			expires_in_secs: 172800
		},
		HULU_IOS_APP: {
			name: "hulu_ios_app",
			expires_in_secs: 315576e3
		},
		HULU_ANDROID_APP: {
			name: "hulu_android_app",
			expires_in_secs: 315576e3
		},
		HULU_GOOGLE_TV: {
			name: "hulu_google_tv",
			expires_in_secs: 315576e3
		},
		HULU_BOXEE_BOX: {
			name: "hulu_boxee_box",
			expires_in_secs: 315576e3
		},
		HULU_SKYFIRE: {
			name: "hulu_sf",
			expires_in_secs: 315576e3
		},
		HULU_BLACKBERRY: {
			name: "hulu_pbbb",
			expires_in_secs: 315576e3
		},
		HULU_EVS: {
			name: "_hulu_evs",
			expires_in_secs: 86400
		},
		CLICKED_AD_GROUP_ID: {
			name: "click_ad_group_id",
			expires_in_secs: 3600
		},
		HULU_IE_JUMPLIST: {
			name: "_hulu_jumplist",
			expires_in_secs: 315576e3
		},
		HULU_HBC: {
			name: "_hulu_hbc"
		},
		HULU_PSH: {
			name: "_hulu_psh"
		},
		HULU_QC: {
			name: "_hulu_qc"
		},
		WYW_SORT: {
			name: "_wyw_sort"
		},
		HULU_FC: {
			name: "_hulu_fc"
		},
		HULU_MASTHEAD_HC: {
			name: "_hulu_masthead_hc",
			expires_in_secs: 315576e3,
			keep_on_logout: !0
		},
		GA_SEGMENT: {
			name: "__utmv"
		},
		HULU_CRIT_ERROR: {
			name: "_hulu_crit_error"
		},
		COOKIE_CHECK: {
			name: "_ck"
		},
		HULU_OVER_18: {
			name: "_hoa"
		},
		HULU_OVER_21: {
			name: "_hob"
		},
		INBOX_COUNT: {
			name: "_inbox_count"
		},
		CANVAS_STATUS: {
			name: "_canvas_status"
		},
		P_EDIT_TOKEN: {
			name: "_p_edit_token",
			expires_in_secs: 600,
			secure: !0
		},
		REC_FILTER: {
			name: "rec_filter"
		},
		HULU_ITUNES_USER: {
			name: "_hiu"
		},
		HULU_SECONDARY: {
			name: "_hsc",
			secure: !0,
			httponly: !0
		},
		HULU_ERROR_SAMPLE_RATE: {
			name: "_hulu_err_sr",
			expires_in_secs: 600,
			keep_on_logout: !0
		},
		HULU_IE7: {
			name: "_hulu_ie7",
			expires_in_secs: 86400,
			keep_on_logout: !0
		},
		HULU_PLUS_AFFILIATE: {
			name: "_hulu_plus_affiliate",
			expires_in_secs: 2592e3,
			keep_on_logout: !0
		},
		HULU_PLUS_CMP: {
			name: "_hulu_plus_cmp",
			expires_in_secs: 2592e3,
			keep_on_logout: !0
		},
		HULU_PLUS_CMP_URL: {
			name: "_hulu_plus_cmp_url",
			expires_in_secs: 2592e3,
			keep_on_logout: !0
		},
		HULU_PLUS_UPSELL: {
			name: "_hulu_plus_upsell",
			expires_in_secs: 2592e3
		},
		PARTNER_PRODUCT: {
			name: "_partner_product",
			expires_in_secs: 2592e3,
			keep_on_logout: !0
		},
		HULU_INTERNATIONAL: {
			name: "hic",
			expires_in_secs: 172800,
			keep_on_logout: !0
		},
		HULU_LOCALE: {
			name: "locale",
			expires_in_secs: 31557600,
			keep_on_logout: !0
		},
		HULU_JP_CMP: {
			name: "_hulu_jp_cmp",
			expires_in_secs: 2592e3
		},
		HULU_SIGNUP_URL: {
			name: "_hulu_signup_url"
		},
		HULU_THANKS_TRACKING: {
			name: "thanks_tracking",
			expires_in_secs: 86400
		},
		HULU_TERMS: {
			name: "_hulu_terms",
			expires_in_secs: 2592e3,
			keep_on_logout: !0
		},
		ANONYMOUS_SYW: {
			name: "anonymous_syw",
			expires_in_secs: 2592e3
		},
		USER_ENGAGEMENT: {
			name: "_ue",
			expires_in_secs: 63115200
		},
		SIGNUP_LOCKOUT: {
			name: "_sl",
			keep_on_logout: !0,
			session_only: !0
		},
		PLUS_DRIVER_PAGE: {
			name: "_driver_page",
			keep_on_logout: !0
		},
		PLUS_DRIVER_TYPE: {
			name: "_driver_type",
			keep_on_logout: !0
		},
		PLUS_DRIVER_ID_1: {
			name: "_driver_id_1",
			keep_on_logout: !0
		},
		PLUS_DRIVER_ID_2: {
			name: "_driver_id_2",
			keep_on_logout: !0
		},
		PLUS_DRIVER_ID_3: {
			name: "_driver_id_3",
			keep_on_logout: !0
		},
		TEMP_USER_TOKEN: {
			name: "_tut",
			secure: !0,
			session_only: !0
		},
		JSONP_PARAMS: {
			name: "_jsonp_params",
			secure: !0,
			session_only: !0
		},
		DOCOMO_EXTRA: {
			name: "docomo_extra",
			expires_in_secs: 86400
		},
		PLUS_EMAIL_FRAUD: {
			name: "_p_gwizd",
			keep_on_logout: !0
		},
		SIGNUP_REDIRECT: {
			name: "_signup_redir",
			expires_in_secs: 3600
		}
	};
	window.Cookies = {
		BEAT_INTERVAL: 18e5,
		INTERVAL_ID: null,
		getCookieByKey: function(b) {
			var c = null,
				d = a[b],
				e = decodeURIComponent || unescape;
			if (d) {
				var f = d.name;
				f && typeof document.cookie != "undefined" && _.each(document.cookie.split(";"), function(a) {
					var b = a.split("=");
					return b.length > 1 && f.toLowerCase() == e(Hulu.Utils.Str.trim(b[0].toLowerCase())) ? (c = e(Hulu.Utils.Str.trim(b[1])), !1) : !0;
				});
			}
			return c;
		},
		setCookieByKey: function(b, c, d) {
			d || (d = {});
			var e = a[b];
			return !e || !e.name ? (Hulu.Utils.warn("the key is not defined correctly! : " + b), !1) : (d.seconds || (d.seconds = e.expires_in_secs), d.path || (d.path = e.path), d.secure || (d.secure = e.secure), d.sessionOnly || (d.sessionOnly = e.session_only), this._setCookie(e.name, c, d), !0);
		},
		eraseCookieByKey: function(b, c) {
			c || (c = {}), c.seconds || (c.seconds = -3600);
			var d = a[b];
			if (!d || !d.name) {
				Hulu.Utils.warn("the key is not defined correctly!", b);
				return;
			}
			d.path && (c.path = d.path), this._setCookie(d.name, "", c);
		},
		initHeartbeat: function() {
			var a = Cookies.BEAT_INTERVAL / 5,
				b = this;
			this._checkHeartbeat(Cookies.BEAT_INTERVAL), Cookies.INTERVAL_ID = setInterval(function() {
				b._checkHeartbeat(Cookies.BEAT_INTERVAL);
			}, a);
		},
		stopHeartbeat: function() {
			window.clearInterval(Cookies.INTERVAL_ID);
		},
		areCookiesEnabled: function() {
			var a = "test",
				b = "COOKIE_CHECK";
			Cookies.setCookieByKey(b, a);
			var c = Cookies.getCookieByKey(b);
			return Cookies.eraseCookieByKey(b), c == a;
		},
		_checkHeartbeat: function(a) {
			var b = new Date,
				c = parseInt(this.getCookieByKey("HULU_HBC")),
				d = b.getTime();
			c > 0 ? d - c > a && (this.setCookieByKey("HULU_HBC", b.getTime()), this._refreshCookies()) : (this.setCookieByKey("HULU_HBC", b.getTime()), this._refreshCookies());
		},
		_refreshCookies: function() {
			$.ajax({
				url: "/api/2.0/refresh_cookies",
				cache: !1
			}).done(function() {
				Hulu.Behaviors.isLoggedIn() || Cookies._clearUserCookies();
			}).fail();
		},
		_clearUserCookies: function() {
			var b = _.keys(a);
			_.each(b, function(b) {
				a[b].keep_on_logout || Cookies.eraseCookieByKey(b);
			});
		},
		_setCookie: function(a, b, c) {
			if (typeof document.cookie == "undefined") return;
			if (typeof b == "undefined") {
				Hulu.Utils.warn("the cookie value is not defined correctly!");
				return;
			}
			c || (c = {});
			var d = this._getSubDomain(),
				e = encodeURIComponent || escape;
			b = e(a) + "=" + e(b);
			if (!c.sessionOnly) {
				var f = new Date;
				c.seconds ? f.setTime(f.getTime() + c.seconds * 1e3) : f.setMonth(f.getMonth() + 1), b += "; expires=" + f.toUTCString();
			}
			var g = c.path;
			g || (g = "/"), b += "; path=" + g, c.secure && b + "; " + Hulu.Utils.secureCookiePostfix, d != null && (b += "; domain=" + d), document.cookie = b;
		},
		_getSubDomain: function() {
			var a = null;
			return Hulu.Configuration.region() == "jp" ? a = Hulu.Configuration.isProduction() ? ".hulu.jp" : ".hulu.co.jp" : Hulu.Configuration.isProduction() ? a = ".hulu.com" : a = ".huluqa.com", a;
		}
	};
}.call(this), window.RedirectList = [{
		path_pattern: /^\/(movie-trailers|show\/1439|trailers)$/,
		to: "/movies/trailers"
	}, {
		path_pattern: /^\/trailers\/(coming_soon|in_theater)/,
		to: "/movies/trailers"
	}, {
		path_pattern: /^\/browse\/(network)$/,
		to: "/tv/(1)s"
	}, {
		path_pattern: /^\/browse\/popular\/(feature_films|movies|film_clips)/,
		to: "/movies/popular/films"
	}, {
		path_pattern: /^\/browse\/popular\/film_trailers/,
		to: "/movies/popular/trailers"
	}, {
		path_pattern: /^\/browse\/popular\/(tv|videos|episodes|clips)/,
		to: "/tv/popular/shows"
	}, {
		path_pattern: /^\/browse\/recent\/(feature_films|movies|film_clips|film_trailers)/,
		to: "/movies/new/films"
	}, {
		path_pattern: /^\/browse\/recent\/(tv|episodes|clips)/,
		to: "/tv/new/shows"
	}, {
		path_pattern: /^\/browse\/tv$/,
		to: "/tv/popular/shows"
	}, {
		path_pattern: /^\/browse\/movies$/,
		to: "/movies/popular/films"
	}, {
		path_pattern: /^\/popular$/,
		to: "/tv/popular/episodes"
	}, {
		path_pattern: /^\/popular\/(videos|games|episodes|tv)$/,
		to: "/tv/popular/episodes"
	}, {
		path_pattern: /^\/popular\/(clips)$/,
		to: "/tv/popular/clips"
	}, {
		path_pattern: /^\/popular\/(movies|feature_films|)$/,
		to: "/movies/popular/films"
	}, {
		path_pattern: /^\/popular\/film_clips$/,
		to: "/movies/popular/clips"
	}, {
		path_pattern: /^\/popular\/film_trailers$/,
		to: "/movies/popular/trailers"
	}, {
		path_pattern: /^\/recent$/,
		to: "/tv/new/episodes"
	}, {
		path_pattern: /^\/recent\/(games|episodes|tv|videos)$/,
		to: "/tv/new/episodes"
	}, {
		path_pattern: /^\/recent\/clips$/,
		to: "/tv/new/clips"
	}, {
		path_pattern: /^\/recent\/(movies|feature_films|)$/,
		to: "/movies/new/films"
	}, {
		path_pattern: /^\/recent\/film_clips$/,
		to: "/movies/new/clips"
	}, {
		path_pattern: /^\/recent\/film_trailers$/,
		to: "/movies/new/trailers"
	}, {
		path_pattern: /^\/(channels|genres)\/movies$/,
		to: "/movies/genres"
	}, {
		path_pattern: /^\/(channels|genres)$/,
		to: "/tv/genres"
	}, {
		path_pattern: /^\/(channels|genres)\/tv$/,
		to: "/tv/genres"
	}, {
		path_pattern: /^\/(channels|genres)\/([a-zA-Z0-9-]+)$/,
		to: "/tv/genres/(2)"
	}, {
		path_pattern: /^\/(channels|genres)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/,
		to: "/tv/genres/(2)/(3)"
	}, {
		path_pattern: /^\/(nfl|nhl)(\/|\?|$)/,
		to: "/tv/genres/sports"
	}, {
		path_pattern: /^\/playlists$/,
		to: "/tv/picks"
	}, {
		path_pattern: /^\/documentaries$/,
		to: "/movies/documentaries"
	}, {
		path_pattern: /^\/criterion$/,
		to: "/movies/criterion"
	}, {
		path_pattern: /^\/(video-game-trailers|show\/11999)$/,
		to: "/videogames"
	}
],
function() {
	window.Redirects = {
		_redirectList: window.RedirectList || [],
		findRedirect: function(a) {
			var b = null;
			return _.any(Redirects._allConfigs(), function(c) {
				return b = Redirects._parseOne(c, a), b ? !0 : !1;
			}), b;
		},
		_parseOne: function(a, b) {
			var c = null,
				d = Hulu.Utils.Url.parse(b),
				e = Hulu.Utils.Url.parse(a.to),
				f = a.path_pattern;
			if (!d || !e) return null;
			var g = f.exec(d.attr("path"));
			if (g) {
				var h = e.attr("query"),
					c = e.attr("path");
				c = c.replace(/\((\d+)\)/g, function(a, b) {
					return g[b];
				}), a.keep_params != "false" && d.attr("query") != "" && (h += "&" + d.attr("query"));
				var i = $.param(Hulu.Utils.Url.parseQueryString(h));
				Hulu.Utils.isBlank(i) || (c += "?" + i);
			}
			return c;
		},
		_allConfigs: function() {
			return Redirects._redirectList;
		}
	};
}.call(this),
function() {
	var a = "_global",
		b = Hulu.Utils.Env.hasPushState();
	Hulu.Utils.History = {
		_routers: {},
		registerRouter: function(a) {
			if (!(a != null && a instanceof HuluRouter.BaseRouter)) throw new Error("History.registerRouter only accept a non-null router instance!");
			if (Hulu.Utils.isBlank(a.name)) return;
			if (this._routers.hasOwnProperty(a.name)) throw new Error("Already registered the router with name '" + a.name + "'!");
			this._routers[a.name] = a;
		},
		getRouterState: function(a) {
			return history.state != null && a.name != null ? history.state[a.name] : null;
		},
		updateState: function(a) {
			if (!b) return !1;
			var c = history.state;
			c == null && (c = {});
			var d = !1;
			for (var e in this._routers) {
				var f = this._routers[e].serializeState(a);
				f != null && (c[e] = f, d = !0);
			}
			d || Hulu.Utils.warn("The changedView's state is not saved, maybe it's not rendered by addChild or not in current main view. view name: " + a.name), history.state = c;
			try {
				history.replaceState(c, document.title);
			} catch (g) {
				return !1;
			}
			return !0;
		},
		setGlobalState: function(c, d) {
			if (!b) return !1;
			if (Hulu.Utils.isBlank(c) || typeof c != "string") throw new Error("key must be non-empty string!");
			var e = history.state || {};
			e[a] == null && (e[a] = {}), e[a][c] = d, history.state = e;
			try {
				history.replaceState(e, document.title);
			} catch (f) {
				return !1;
			}
			return !0;
		},
		getGlobalState: function(c) {
			if (!b) return undefined;
			if (Hulu.Utils.isBlank(c) || typeof c != "string") throw new Error("key must be non-empty string!");
			return history.state && history.state[a] ? history.state[a][c] : null;
		},
		start: function() {
			document.location && document.location.hash == "#_=_" && (document.location.hash = "");
			var a = !b && Hulu.Utils.Env.isAjaxSwap();
			if (a && window.location.pathname == "/" && window.location.search != "") {
				window.location.replace("/#!" + window.location.search + window.location.hash);
				return;
			}
			b && $(window).bind("popstate", $.proxy(function(a) {
				var b = Backbone.history.getFragment();
				b != Backbone.history.fragment && b != decodeURIComponent(Backbone.history.fragment) && (history.state = a.originalEvent.state);
			}, this)), Backbone.history.start({
				pushState: !0,
				hashChange: a
			});
		}
	}, Backbone.history || (Backbone.history = new Backbone.History), Backbone.history.getFragment = function(a, b) {
		if (a == null) if (this._hasPushState || b || !Hulu.Utils.Env.isAjaxSwap()) {
				a = window.location.pathname;
				var c = window.location.search;
				c && (a += c);
			} else a = this.getHash();
		a.indexOf(this.options.root) || (a = a.substr(this.options.root.length));
		var d = /#[(\w)(\/)]*$/,
			e = a.replace(d, ""),
			f = /^(\/)+/,
			g = e.replace(f, ""),
			h = /(\/)+$/,
			i = g.replace(h, "");
		return !this._hasPushState && b ? "!" + i + window.location.hash : i;
	}, Backbone.history._oldGetHash = Backbone.history.getHash, Backbone.history.getHash = function(a) {
		var b = this._oldGetHash(a);
		return b.replace(/^!/i, "");
	}, Backbone.history._oldUpdateHash = Backbone.history._updateHash, Backbone.history._updateHash = function(a, b, c) {
		return this._oldUpdateHash(a, b == "" ? "" : "!" + b, c);
	};
}.call(this),
function() {
	Hulu.Utils.DateTime = {
		parse: function(a) {
			var b = Hulu.Utils.isBlank(a) ? null : moment(a).toDate();
			return b;
		},
		formatDate: function(a) {
			return $.format.date(a, "MMMM dd, yyyy");
		},
		_HOUR_TEMPLATED: "{0} hr.",
		_MINUTE_TEMPLATE: "{0} min.",
		_HMS_TEMPLATE: {
			_HR_MIN: "{0} hr {1} min",
			_HR: "{0} hr",
			_MIN: "{0} min",
			_SEC: "{0} sec"
		},
		getHumanizedDurationHMS: function(a) {
			var b = null;
			if (a >= 3600) {
				var c = Math.floor(a / 3600),
					d = Math.floor(a % 3600 / 60 + .5);
				0 == d ? b = Hulu.Utils.Str.format(this._HMS_TEMPLATE._HR, c) : b = Hulu.Utils.Str.format(this._HMS_TEMPLATE._HR_MIN, c, d);
			} else a >= 60 ? b = Hulu.Utils.Str.format(this._HMS_TEMPLATE._MIN, Math.floor(a / 60 + .5)) : b = Hulu.Utils.Str.format(this._HMS_TEMPLATE._SEC, Math.floor(a));
			return b;
		},
		getHumanizedDurationHMSShort: function(a) {
			var b = null;
			return a >= 3600 ? b = Math.floor(a / 3600) + "h" : a >= 60 ? b = Math.floor(a / 60 + .5) + "m" : b = Math.floor(a) + "s", b;
		},
		getHumanizedDurationHourMin: function(a) {
			var b = "";
			a >= 3600 && (b += Hulu.Utils.Str.format(this._HOUR_TEMPLATED, Math.floor(a / 3600)) + " ");
			var c = Hulu.Utils.Str.lfill(Math.floor(a % 3600 / 60), "0", 2);
			return b += Hulu.Utils.Str.format(this._MINUTE_TEMPLATE, c), b;
		},
		getHumanizedDuration: function(a) {
			var b = "";
			return a >= 3600 && (b = Math.floor(a / 3600) + ":"), b += Hulu.Utils.Str.lfill(Math.floor(a % 3600 / 60), "0", 2) + ":", b += Hulu.Utils.Str.lfill(Math.floor(a % 60), "0", 2), b;
		},
		calculateSeconds: function(a) {
			return Math.round(a / 1e3);
		},
		calculateMinite: function(a) {
			return Math.round(parseInt(a) / 60);
		}
	};
}.call(this),
function() {
	Hulu.Utils.Share = {
		sites: {
			FACEBOOK: "facebook",
			TWITTER: "twitter"
		},
		share: function(a, b, c, d, e, f) {
			var g = this._config[a];
			if (g) {
				var h = this.generateUrl(a, b, c, d),
					i = g.width,
					j = g.height;
				Hulu.Utils.Url.pop(h, i, j, null, e, f);
			}
		},
		generateUrl: function(a, b, c, d) {
			var e = "";
			if (a) {
				var f = this._config[a];
				f && (d = $.extend(d, {
					generateUrl: f.generateUrl
				}));
			}
			if (d && d.generateUrl) {
				var g = {
					link: b,
					text: c
				};
				e = d.generateUrl(g);
			}
			return e;
		},
		fbLikeWithCount: function(a, b) {
			var c = "";
			b && b == "dark" && (c = " colorscheme='dark'");
			var d = '<fb:like href="' + a + '" layout="button_count" send="false"" show_faces="false" width="90" font="lucida grande"' + c + "></fb:like>";
			return d;
		},
		_config: {
			facebook: {
				width: 655,
				height: 420,
				generateUrl: function(a) {
					if (a) return "http://www.facebook.com/share.php?u=" + encodeURIComponent(a.link);
				}
			},
			twitter: {
				width: 550,
				height: 420,
				generateUrl: function(a) {
					if (a) return "http://twitter.com/intent/tweet?text=" + encodeURIComponent(a.text) + encodeURIComponent(a.link);
				}
			}
		}
	};
}.call(this),
function() {
	Hulu.Behaviors = {
		DEFAULT_PGID: 1,
		subscriberPgid: 2,
		authPgid: 192,
		authNames: {
			"128": "NBC",
			"64": "FOX"
		},
		getComputerGUID: function() {
			var a = Cookies.getCookieByKey("HULU_GUID");
			return a == null && (a = Hulu.Utils.GUID.getNewGuid()), Cookies.setCookieByKey("HULU_GUID", a), a;
		},
		setLocale: function(a) {
			Cookies.setCookieByKey("HULU_LOCALE", a || I18n.locale.split("-")[0] || I18n.defaultLocale.split("-")[0]);
		},
		getLocale: function() {
			var a = Cookies.getCookieByKey("HULU_LOCALE");
			return a || (a = "ja"), a;
		},
		startNewSiteSession: function() {
			Cookies.eraseCookieByKey("HULU_SID");
		},
		getSiteSessionId: function() {
			var a = Cookies.getCookieByKey("HULU_SID"),
				b = Cookies.getCookieByKey("HULU_BEACON_SEQ"),
				c = Cookies.getCookieByKey("HULU_SITE_BEACON_SEQ");
			return a == null && (a = Hulu.Utils.GUID.getNewGuid(), this.getSessionReferrer(!0), Hulu.perf.newSession = !0, Hulu.userEngagement.newSession = !0, b = 0, c = 0), Cookies.setCookieByKey("HULU_SID", a), Cookies.setCookieByKey("HULU_BEACON_SEQ", b), Cookies.setCookieByKey("HULU_SITE_BEACON_SEQ", c), a;
		},
		getSiteBeaconSeq: function() {
			var a = Cookies.getCookieByKey("HULU_SITE_BEACON_SEQ");
			if (parseInt(a) == null || isNaN(parseInt(a))) a = 0;
			return Cookies.setCookieByKey("HULU_SITE_BEACON_SEQ", parseInt(a) + 1), a;
		},
		getSessionReferrer: function(a) {
			var b = Cookies.getCookieByKey("HULU_S_REF");
			if (b == null || a) b = document.referrer.replace(document.location.protocol + "//", ""), b = b.substr(0, 200), Cookies.setCookieByKey("HULU_S_REF", b);
			return b;
		},
		getCMPId: function() {
			var a = Cookies.getCookieByKey("HULU_PLUS_CMP");
			return a ? parseInt(a) : "";
		},
		getPlanId: function() {
			var a = Cookies.getCookieByKey("HULU_PLID");
			return a ? parseInt(a) : 0;
		},
		getUserId: function() {
			if (Hulu.Configuration.region() == "jp") {
				var a = Cookies.getCookieByKey("HULU_ID");
				if (a) {
					var b = a.length;
					b = 4 - b % 4;
					for (var c = 0; c < b && b < 4; c++) a += "=";
					a = a.replace(/-/g, "+").replace(/_/g, "/"), a = parseInt($.base64.decode(a)) / 1e4;
				}
			} else var a = Cookies.getCookieByKey("HULU_UID");
			return a ? parseInt(a) : -1;
		},
		getUserFBId: function() {
			var a = Cookies.getCookieByKey("HULU_FB_ID");
			return a ? parseInt(a) : -1;
		},
		getUserEncryptedId: function() {
			var a = Cookies.getCookieByKey("HULU_E_UID") || "";
			return a;
		},
		getUserName: function() {
			var a = Cookies.getCookieByKey("HULU_UNAME") || "";
			return a;
		},
		getAvatarUrl: function() {
			var a = Hulu.Behaviors.getUserFBId();
			return a != -1 ? "https://graph.facebook.com/" + a + "/picture?" : null;
		},
		getUserPgid: function() {
			if (Hulu.Behaviors.getUserId() <= 0) return Hulu.Behaviors.DEFAULT_PGID;
			var a = Cookies.getCookieByKey("HULU_PGID");
			return a = a == null ? Hulu.Behaviors.DEFAULT_PGID : parseInt(a), a;
		},
		getEmailValidationStatus: function() {
			var a = Cookies.getCookieByKey("HULU_EVS");
			return a == null ? -1 : parseInt(a);
		},
		isSubscriber: function() {
			var a = Hulu.Behaviors.getUserPgid(),
				b = Hulu.Behaviors.subscriberPgid;
			return Boolean(b & a);
		},
		isAuth: function() {
			var a = Hulu.Behaviors.getUserPgid(),
				b = Hulu.Behaviors.authPgid;
			return Boolean(b & a);
		},
		getAuthType: function() {
			var a = [],
				b = Hulu.Behaviors.getUserPgid(),
				c = Hulu.Behaviors.authNames;
			for (var d in c) d & b && a.push(c[d].toLowerCase());
			return a.join(",");
		},
		authMvpd: function() {
			var a = Hulu.Behaviors.authCookie();
			return a == null ? null : a.mvpd;
		},
		authCookie: function() {
			var a = null;
			return /^([a-zA-Z-_]+)-(\d+)$/.test(Cookies.getCookieByKey("HULU_AUTH")) && (a = {
				mvpd: RegExp.$1,
				expires: parseInt(RegExp.$2)
			}), a;
		},
		isEmailValidated: function() {
			return Hulu.Behaviors.getEmailValidationStatus() > 0;
		},
		isLoggedIn: function() {
			var a = Hulu.Behaviors.getUserId();
			return a && a != -1;
		},
		isFacebookConnected: function() {
			var a = Cookies.getCookieByKey("HULU_FB_CONNECTED");
			return Hulu.Behaviors.isLoggedIn() && a == "1";
		},
		isSocialOn: function() {
			var a = Cookies.getCookieByKey("HULU_ISON");
			return Hulu.Behaviors.isLoggedIn() && a != null && a == "1";
		},
		shouldShowRoadblock: function() {
			var a = Cookies.getCookieByKey("HULU_SHRB");
			return a == "1" && Hulu.Behaviors.isFacebookConnected();
		},
		hasAgreedToRoadblock: function() {
			var a = Cookies.getCookieByKey("HULU_HARB");
			return a == "1" && Hulu.Behaviors.isFacebookConnected();
		},
		updateClickedAdGroupId: function(a) {
			var b = null,
				c = $(a).parents("div.ad-root:first");
			return c && c.length > 0 && (b = c.find("div[adgroupid]:first")), b && b.length > 0 && Cookies.setCookieByKey("CLICKED_AD_GROUP_ID", b.attr("adgroupid")), !0;
		},
		requestPlusContent: function(a, b) {
			return Hulu.Behaviors.isLoggedIn() ? (Hulu.Collections.JsonResource.post("/plus/add_plus_content_request", {
				show_id: b
			}, {
				dataType: ""
			}).done(function() {
				$(a).parent().empty().html('<div class="check"></div> ' + I18n.t("show.request_plus_content"));
			}), !1) : (Login.showLoginForm("header"), !1);
		},
		getWywSort: function() {
			var a = Cookies.getCookieByKey("WYW_SORT");
			return a = a == "1" ? "recently_watched" : "default", a;
		},
		updateWywSort: function(a) {
			var a = a == "recently_watched" ? "1" : "0";
			Hulu.Collections.JsonResource.post("/profile/update_wyw_sort", {
				value: a
			}, {
				dataType: ""
			}).fail(function() {});
		}
	};
}.call(this), Hulu.Utils.Preloader = {
	_load_queue_content: [],
	_load_queue_image: [],
	_loading_count_content: 0,
	_loading_count_image: 0,
	MAX_CONCURRENT_COUNT: 3,
	queue: function(a) {
		var b = Hulu.Utils.Url.parse(a);
		b = b ? b.attr("host") : null, b == window.location.hostname ? this._load_queue_content.push(a) : this._load_queue_image.push(a), this._process();
	},
	_process: function() {
		if (this._load_queue_content.length == 0 && this._load_queue_image.length == 0) return;
		for (var a = this._loading_count_content; this._load_queue_content.length > 0 && a < this.MAX_CONCURRENT_COUNT; a++) {
			var b = this._load_queue_content.pop();
			this._loading_count_content += 1, $.get(b).always(function(a) {
				Hulu.Utils.Preloader._loading_count_content -= 1, setTimeout(function() {
					Hulu.Utils.Preloader._process();
				}, 50);
			});
		}
		for (var a = this._loading_count_image; this._load_queue_image.length > 0 && a < this.MAX_CONCURRENT_COUNT; a++) {
			var c = Hulu.Utils.Preloader.getImageNode();
			c.each(Hulu.Utils.Preloader._preloadImage).error(Hulu.Utils.Preloader._onImageError);
		}
	},
	_preloadImage: function() {
		var a = Hulu.Utils.Preloader._load_queue_image.pop();
		Hulu.Utils.Preloader._loading_count_image += 1, this.src = a, this.complete && $(this).trigger("load");
	},
	_onImageError: function() {
		$(this).trigger("load");
	},
	getImageNode: function() {
		return Hulu.Utils.Preloader._imageNode == null && (Hulu.Utils.Preloader._imageNode = $(Hulu.Utils.createImage()), Hulu.Utils.Preloader._imageNode.bind("load", function() {
			Hulu.Utils.Preloader._loading_count_image -= 1, setTimeout(function() {
				Hulu.Utils.Preloader._process();
			}, 50);
		})), Hulu.Utils.Preloader._imageNode;
	}
}, Hulu.UserHistory = {
	CAPACITY: 50,
	CAPACITY_100: 200,
	NOT_READY_DELAY: 8e3,
	KEYS: {
		HISTORY: "userHistory",
		WATCHED_HISTORY: "userWatchedHistory"
	},
	_add: function(a, b) {
		a = this._getKey(a);
		var c = [];
		cram && cram.valid() && (c = $.makeArray(cram.get(a)) || []);
		if (_.indexOf(c, b) >= 0) return;
		c.unshift(b);
		var d = function() {
			if (cram && cram.valid()) {
				c = $.makeArray(cram.get(a)) || [];
				if (_.indexOf(c, b) >= 0) return;
				c.unshift(b);
				var d = a == Hulu.UserHistory.KEYS.HISTORY ? Hulu.UserHistory.CAPACITY_100 : Hulu.UserHistory.CAPACITY;
				cram.set(a, c.slice(0, d));
			}
		};
		cram && cram.valid() ? d() : setTimeout(d, Hulu.UserHistory.NOT_READY_DELAY);
	},
	_get: function(a) {
		return a = this._getKey(a), cram ? $.makeArray(cram.get(a)).join("_") : null;
	},
	_getKey: function(a) {
		return a + "_" + Hulu.Behaviors.getUserId();
	},
	addHistory: function(a, b) {
		this._add(Hulu.UserHistory.KEYS.HISTORY, a);
		if (!Hulu.Behaviors.isLoggedIn() && parseInt(b) > 0) {
			var c = Hulu.UserHistory.getAnonymousHistory();
			c = _.without(c, b.toString()), c = [b].concat(c), c = c.slice(0, 10), Cookies.setCookieByKey("ANONYMOUS_SYW", c.join("_"));
		}
	},
	addWatchedHistory: function(a) {
		this._add(Hulu.UserHistory.KEYS.WATCHED_HISTORY, a);
	},
	getAnonymousHistory: function() {
		if (Hulu.Behaviors.isLoggedIn()) return Hulu.Utils.warn("Call getAnonymousHistory when user is login"), [];
		var a = Cookies.getCookieByKey("ANONYMOUS_SYW");
		return Hulu.Utils.isBlank(a) ? [] : a.split("_");
	},
	getHistory: function() {
		return this._get(Hulu.UserHistory.KEYS.HISTORY);
	},
	getWatchedHistory: function() {
		return this._get(Hulu.UserHistory.KEYS.WATCHED_HISTORY);
	},
	clearHistory: function() {
		cram && (cram.remove(this._getKey(Hulu.UserHistory.KEYS.HISTORY)), cram.remove(this._getKey(Hulu.UserHistory.KEYS.WATCHED_HISTORY)));
	},
	cleanHistoryWhenUserSwitch: function() {
		Cookies.eraseCookieByKey("ANONYMOUS_SYW");
	}
},
function() {
	Hulu.Utils.Models = {}, Hulu.Utils.Models.Video = {
		isShortForm: function(a, b) {
			return a == "clip" || b < 600;
		},
		getVideoGroup: function(a) {
			var b = {
				film_clip: !0,
				film_trailer: !0,
				feature_film: !0,
				filmclip: !0,
				filmtrailer: !0,
				featurefilm: !0
			};
			return !Hulu.Utils.isBlank(a) && b[a.toLowerCase()] ? "movie" : "tv";
		},
		formatSeasonEpisode: function(a) {
			return Hulu.Utils.Str.format("{0} {1}, {2} {3}", I18n.t("tray_name.season"), a.seasonNumber, I18n.t("tray_name.episode"), a.episodeNumber);
		},
		getDisplayType: function(a) {
			switch (a.videoType) {
				case "episode":
					return "Episode";
				case "clip":
					if (a.videoGame) return a.programmingType;
				case "film_clip":
					return "Clip";
				case "feature_film":
					return "Movie";
				case "film_trailer":
					return "Trailer";
				case "game":
					return "Game";
				default:
					return "Video";
			}
		},
		getSmartStartData: function(a) {
			var b = a.getTileDescription(Hulu.Utils.Tile.descriptionTypes.NO_SHOW_NAME, "1x1"),
				c = {
					smartStartTitle: a.getSmartStartTitle(),
					description: b,
					watchUrl: a.pageUrl,
					videoId: a.id,
					thumbnailUrl: a.getThumbUrl("1x1"),
					videoType: a.videoType
				};
			a.getBadgeType(Hulu.Behaviors.isSubscriber(), Hulu.Behaviors.getAuthType()) == Hulu.Utils.Tile.badgeTypes.PLUS && (c.subscriberBadge = !0, c.plusBadgeUrl = a.getPlusUrl());
			var d = Hulu.Utils.Url.getQueryStringParam(Hulu.Constants.QUERY_STRING_PARAMS.genre);
			if (d) {
				var e = {};
				e[Hulu.Constants.QUERY_STRING_PARAMS.genre] = d, c.watchUrl = Hulu.Utils.Url.build(c.watchUrl, $.param(e).split("&"));
			}
			return c;
		}
	}, Hulu.Utils.Models.Show = {
		VIDEO_CONFIG_BY_SHOW_ID: {
			"5734": {
				watchPageOverride: Hulu.Utils.Env.isEmbed() ? "/adzone/embed/" : "/adzone/",
				getTitles: function(a) {
					var b = ": ",
						c = a.title.indexOf(b);
					if (c >= 0) {
						var d = a.title.substr(0, c),
							e = a.title.substr(c + b.length, a.title.length);
						return {
							title: d,
							subTitle: e
						};
					}
				},
				getShareText: function(a, b) {
					var c = a.getTitleForSharing(),
						d = "Watch {0} and more #SuperBowl ads on @hulu #AdZone ",
						e = Hulu.Twitter.calTruncateLen(Hulu.Utils.Str.format(d, c));
					return c = Hulu.Utils.Str.truncatePreserveWord(c, c.length - e), Hulu.Utils.Str.format(d, c);
				}
			}
		},
		getVideoConfig: function(a) {
			if (a && a.id && Hulu.Utils.Models.Show.VIDEO_CONFIG_BY_SHOW_ID[a.id]) return Hulu.Utils.Models.Show.VIDEO_CONFIG_BY_SHOW_ID[a.id];
		}
	}, Hulu.Utils.Models.Common = {
		getItemType: function(a) {
			return a instanceof Hulu.Models.Base ? a.modelName : (Hulu.Utils.warn("item type not recognized: " + Hulu.Utils.getObjectAttributes(a)), null);
		}
	};
}.call(this),
function() {
	Hulu.Utils.Views = {}, Hulu.Utils.Views.FB = {
		renderCommentCount: function(a) {
			var b = "http://graph.facebook.com/fql",
				c = window.location.protocol + "//" + Hulu.Configuration.locationHost() + Hulu.Utils.Url.getPathName(),
				d = "SELECT commentsbox_count FROM link_stat WHERE url='" + c + "'";
			Hulu.Collections.JsonResource.get(b, {
				q: d
			}, {
				dataType: "jsonp"
			}).done(function(b) {
				try {
					var c = b.data[0].commentsbox_count;
					!isNaN(c) && c > 0 && a.html("(" + c + ")");
				} catch (d) {}
			});
		}
	}, Hulu.Utils.Views.Common = {
		removeOrAddIds: function(a, b, c) {
			var d = a == "favorite" ? Hulu.Global.favIdCollection : Hulu.Global.queueIdCollection;
			if (!d || !b) return;
			var c = c ? c : {}, e = d.has(b),
				f = e ? d.remove : d.add;
			Hulu.Behaviors.isLoggedIn() ? (f.apply(d, [b, c]), a == "favorite" && !e && Hulu.Behaviors.isSocialOn() && Hulu.Beacon.Publish.trackPublish(Hulu.Beacon.Publish.TYPE.MANUAL_SITE, Hulu.Beacon.Publish.TARGET.FACEBOOK, Hulu.Beacon.Publish.ITEM.FAVORITE)) : (Hulu.GlobalHandler.register(Hulu.Events.Login.USER_LOGGED_IN, function() {
				f.apply(d, [b, c]);
			}), Login.showLoginForm("header"));
		},
		getErrorPage: function(a) {
			return Hulu.errorPage || (Hulu.errorPage = new Hulu.Views.Error({})), Hulu.errorPage.setError(a), Hulu.errorPage;
		},
		detectSBC: function(a) {
			for (var b = 0; b < a.length; b++) {
				var c = a.charCodeAt(b);
				if (c > 126 || c < 32) return b;
			}
			return -1;
		},
		selectYearArray: function(a, b, c) {
			b = parseInt(b || (new Date).getFullYear() - 13), c = parseInt(c || 1900);
			var d = c > b ? 1 : -1;
			c += d;
			var e = [
				[a || I18n.t("datetime.prompts.year"), ""]
			];
			for (var f = b; f != c; f += d) e.push([I18n.t("date.year_with_name", {
						year: f
					}), f]);
			return e;
		},
		selectMonthArray: function(a, b) {
			var c;
			b ? c = I18n.t("date.month_names") : c = I18n.t("date.abbr_month_names");
			var d = [
				[a || I18n.t("datetime.prompts.month"), ""]
			];
			for (var e = 1; e <= 12; e++) d.push([c[e], e]);
			return d;
		},
		selectDayArray: function(a) {
			var b = [
				[a || I18n.t("datetime.prompts.day"), ""]
			];
			for (var c = 1; c <= 31; c++) b.push([I18n.t("date.day_with_name", {
						day: c
					}), c]);
			return b;
		}
	}, Hulu.Utils.Views.Tray = {
		getLayoutParam: function(a) {
			return _.map(a, function(a) {
				return a.getShortSummary();
			}).join("|");
		},
		TRAY_CONFIG_BY_HASH: {
			"mozart/editorial/1409": {
				templateType: "TYPE_S_ONE_ROW",
				rootKlass: "toyota-adzone-tray"
			}
		}
	}, Hulu.Utils.Views.Adzone = {
		isVotable: function(a, b) {
			if (a && b) {
				var c = b.seasonNumber == Hulu.Constants.ADZONE.currentSeason,
					d = a != Hulu.Constants.ADZONE.states.PREGAME;
				return c && d;
			}
			return !1;
		}
	};
}.call(this),
function() {
	var a = [{
			boundWidth: 980,
			boundHeight: 551,
			width: 944
		}, {
			boundWidth: 1317,
			boundHeight: 788,
			width: 1184
		}
	],
		b = 1,
		c = null,
		d = null,
		e = !0;
	Hulu.Utils.Player = {
		getPlayerSize: function() {
			var c = b;
			try {
				var f = Hulu.Utils.Url.isLivePage() ? Hulu.Utils.Player.getLivePlayer() : Hulu.Utils.Player.getPlayer();
				if (f && f.getStageHeight) {
					var g = $(f),
						h = g.height(),
						i = f.getStageHeight();
					i != null && i != 0 ? b = h / i : b = 1;
				} else b = 1;
			} catch (j) {
				b = 1;
			}
			if (b == 0 || isNaN(b)) b = c;
			if (null != d) return e ? {
					width: d.width,
					height: d.height,
					isSmall: !0,
					ratio: b
			}: {
				width: d.width / b,
				height: d.height / b,
				isSmall: !0,
				ratio: 1
			};
			if (Hulu.Utils.Env.isIE(8)) return {
					width: a[0].width,
					height: a[0].width * 9 / 16,
					isSmall: !0,
					ratio: b
			};
			var k = $(window),
				l = k.height() / b,
				m = Math.floor(k.width() / b);
			for (var n = 0; n < a.length - 1; n++) if (m < a[n + 1].boundWidth || l < a[n + 1].boundHeight) break;
			m = a[n].width, l = m * 9 / 16;
			var o = 531,
				p = 944;
			m < p && (m = p, l = o);
			var q = {
				width: m,
				height: l,
				isSmall: m == a[0].width,
				ratio: b
			};
			return q;
		},
		changeContainerPadding: function(a, c, d, f) {
			if (Hulu.Utils.Env.isIE(8)) {
				var g = Math.abs(b - 1) < .01 ? 24 : 23,
					h = Math.abs(b - 1) < .01 ? 9 : 0,
					i = Math.abs(b - 1) < .01 ? 11 : 0,
					j = Math.abs(b - 1) < .01 ? 9 : 8;
				e || (g = h = i = j = 0), a.css({
					padding: g + "px " + h + "px " + i + "px " + j + "px"
				});
			} else {
				var k = (f ? 9 : 11) * b,
					l = (f ? 9 : 11) * b,
					m = (f ? 9 : 11) * b,
					n = (f ? 9 : 11) * b,
					o = c + (f ? 18 : 22) * b,
					p = d + (f ? 18 : 23) * b,
					q = 0,
					r = 0;
				e || (k = l = m = n = o = p = 0), a.css({
					padding: k + "px " + l + "px " + m + "px " + n + "px",
					"background-size": o + "px " + p + "px",
					"background-position": q + "px " + r + "px"
				});
			}
		},
		changePlayerHeight: function(a, c, d) {
			var e = Hulu.Utils.Url.isLivePage() ? Hulu.Utils.Player.getLivePlayer() : Hulu.Utils.Player.getPlayer();
			if (e) {
				var f = $(e),
					g = this.getPlayerSize(),
					h = g.height * b,
					i = h * 16 / 9;
				e.changePlayerSize(g.width, g.height);
				var j = Hulu.Utils.Url.isLivePage() ? Hulu.Utils.Player.getLivePlayerContainer() : Hulu.Utils.Player.getPlayerContainer();
				if (j) {
					var k = $(j);
					k.height(h + "px"), k[0].style.width != "100%" && (k.width(i + "px"), this.changeContainerPadding(k, i, h, g.isSmall));
				}
				d ? f.animate({
					height: h
				}, 1e3) : f.height(h + "px").width(i + "px"), Hulu.Utils.Player._adjustWidths(i);
			}
		},
		resizePlayer: function() {
			var a = this.getPlayerSize(),
				d = Hulu.Utils.Url.isLivePage() ? Hulu.Utils.Player.getLivePlayer() : Hulu.Utils.Player.getPlayer();
			d && d.changePlayerSize && d.changePlayerSize(a.width, a.height);
			var e = Hulu.Utils.Url.isLivePage() ? Hulu.Utils.Player.getLivePlayerContainer() : Hulu.Utils.Player.getPlayerContainer();
			if (e) {
				var f = $(e),
					g = a.height * b,
					h = g * 16 / 9;
				Hulu.Utils.Player._adjustWidths(h);
				var i = c;
				null != i ? (f.css({
					width: i.width,
					height: i.height
				}), d && $(d).width(i.width).height(i.height)) : (f.css({
					width: h,
					height: g
				}), this.changeContainerPadding(f, h, g, a.isSmall), d && $(d).height(g).width(h));
			}
			return a;
		},
		getPlayer: function() {
			return $("#player")[0];
		},
		getLivePlayer: function() {
			return $("#live-player")[0];
		},
		getPlayerContainer: function() {
			return $("#player-container")[0];
		},
		getBannerAdContainerEl: function() {
			return Hulu.Utils.Url.isLivePage() ? $("div#live-banner-ad-container") : $("div#banner-ad-container");
		},
		getLivePlayerContainer: function() {
			return $("#live-player-container")[0];
		},
		setPlayerResizeDimensions: function(a) {
			c = a;
		},
		setFixedPlayerSize: function(a) {
			d = a;
		},
		setHasPlayerBorder: function(a) {
			e = a, Hulu.Utils.Player.resizePlayer();
		},
		isFlashPlayerEnabled: function() {
			return !Hulu.Utils.Env.isCrawler() && !Hulu.Controls.MobileDevice.isMobile;
		},
		_getVideoDescription: function() {
			return Hulu.Utils.Url.isLivePage() ? $("#live-video-description") : $("#video-description");
		},
		_adjustWidths: function(a) {
			Hulu.Utils.Player._getVideoDescription().width(a), $("div.player-width").width(a);
		}
	};
}.call(this), Hulu.Utils.VListTile = {
	TILE_TEMPLATES: {
		TILE_WITH_VERDICT: 0,
		TILE_WITH_HIGHLIGHT: 1
	},
	descLens: {
		shortLen: 200,
		longLen: 600
	},
	getData: function(a, b) {
		var c = {
			model: a,
			type: a.modelName,
			id: a.id,
			title: a.name,
			linkUrl: a.pageUrl
		}, d = null;
		if (b.location == "winter") c.tileClass = "feature", c.thumbnail = a.getThumbUrl("358x202"), b.available || (c.tileClass += " upcoming", c.availableDate = moment(a.features.featureDate).format("MMM. D")), c.verdict = a.features.title;
		else if (a.modelName == "video" && _.include(["feature_film", "film_trailer"], a.videoType)) {
			c.tileClass = "poster", c.thumbnail = a.posterUrl;
			var e = c.title.indexOf(" - ");
			c.title = e < 0 ? c.title : c.title.substr(0, e), d = this.descLens.longLen;
		} else c.tileClass = "default", c.thumbnail = a.getThumbUrl("1x1"), d = this.descLens.shortLen;
		c.highlight = b.highlight ? b.highlight : !1, c.watchText = a.modelName == "video" && a.videoType == "film_trailer" || !b.available ? I18n.t("v_list_tile.watch_trailer") : I18n.t("v_list_tile.watch_now"), c.description = a.features.description || a.description, c.description == a.features.description && (c.noEscape = !0), d != null && (c.description = Hulu.Utils.Str.truncate(c.description, d));
		switch (b.location) {
			case "blockbusters":
				var f = moment(a.features.featureDate).format("MMM. D");
				c.subTitle = Hulu.Utils.Str.format("{0} {1}", I18n.t("v_list_tile.in_theaters"), f);
				break;
			case "holidays":
				var g = moment(a.features.availableAt),
					h = g ? g.format("MMM. D") : "";
				c.highlight ? c.subTitle = I18n.t("v_list_tile.new") : c.subTitle = h ? Hulu.Utils.Str.format("{0} {1}", I18n.t("v_list_tile.featured_on"), h) : null;
			default:
		}
		return c;
	}
}, Hulu.Utils.EventManager = {
	_counter: 1,
	pool: {},
	unbindAll: function(a) {
		if (Hulu.Utils.isBlank(a)) return !1;
		if (Hulu.Utils.isBlank(a.__event_id)) return !1;
		var b = this.pool[a.__event_id];
		if (b) {
			var c = b.length;
			while (c--) {
				var d = b[c];
				this.unbind(d.trigger, d.evt, a, d.method);
			}
			delete this.pool[a.__event_id];
		}
		return !0;
	},
	bind: function(a, b, c, d) {
		if (Hulu.Utils.isBlank(c) || Hulu.Utils.isBlank(a)) return !1;
		c.__event_id = c.__event_id || this._getEventId(c);
		if (b instanceof Array) for (var e = 0; e < b.length; e++) this._bindEvent(a, b[e], c, d);
		else this._bindEvent(a, b, c, d);
		return !0;
	},
	unbind: function(a, b, c, d) {
		if (Hulu.Utils.isBlank(c) || Hulu.Utils.isBlank(a) || Hulu.Utils.isBlank(c.__event_id)) return !1;
		var e = this._findRecord(a, b, c, d);
		for (var f = 0; f < e.length; f++) this._unbindEvent(e[f].trigger, e[f].evt, c, e[f].method);
		return !0;
	},
	_bindEvent: function(a, b, c, d) {
		this._alreadyHasRecord(a, b, c, d) || (a.on(b, d, c), this._addRecord(a, b, c, d));
	},
	_unbindEvent: function(a, b, c, d) {
		this._alreadyHasRecord(a, b, c, d) && (a.off(b, d, c), this._removeRecord(a, b, c, d));
	},
	_addRecord: function(a, b, c, d) {
		this.pool[c.__event_id] || (this.pool[c.__event_id] = []);
		var e = this.pool[c.__event_id],
			f = !1;
		_.each(e, function(c) {
			c.trigger == a && c.evt == b && c.method == d && (f = !0);
		}), f || e.push({
			trigger: a,
			evt: b,
			method: d
		});
	},
	_findRecord: function(a, b, c, d) {
		var e = [];
		if (!this.pool[c.__event_id]) return e;
		var f = this.pool[c.__event_id];
		return _.each(f, function(c) {
			b == "*" && c.trigger == a ? e.push(c) : c.trigger == a && c.evt == b && c.method == d && e.push(c);
		}), e;
	},
	_removeRecord: function(a, b, c, d) {
		var e = this.pool[c.__event_id],
			f = -1;
		for (var g = 0; g < e.length; g++) {
			var h = e[g];
			if (h.trigger == a && h.evt == b && h.method == d) {
				f = g;
				break;
			}
		}
		f >= 0 && e.splice(f, 1);
	},
	_alreadyHasRecord: function(a, b, c, d) {
		if (!this.pool[c.__event_id]) return !1;
		var e = this.pool[c.__event_id];
		for (var f = 0; f < e.length; f++) if (e[f].trigger == a && e[f].evt == b && e[f].method == d) return !0;
		return !1;
	},
	_getEventId: function(a) {
		var b = "",
			c = "",
			d = this._counter;
		return this._counter += 1, a instanceof Hulu.Routers.BaseController ? (b = a.name, c = "controller") : a instanceof Hulu.Controls.BaseControl ? (b = a.name, c = a.controlType) : a instanceof Hulu.Views.BaseView ? (b = a.name, c = "view") : a instanceof Hulu.Models.Base ? (b = a.modelName, c = "model") : Hulu.Utils.isBlank(a.name) || (b = a.name, c = "unknown"), c + "_" + d + "_" + b;
	}
}, Hulu.Utils.Tile = {
	descriptionTypes: {
		DEFAULT: "1",
		NO_SHOW_NAME: "2",
		SEARCH_RESULT: "3"
	},
	badgeTypes: {
		NON: 0,
		EXPIRE: 1,
		AUTH_FOX: 2,
		AUTH_NBC: 3,
		PLUS: 4,
		OSCAR_WINNER: 5,
		HULU_PREDICTED_WINNER: 6
	},
	subTitleLen: {
		shortLen: 22,
		longLen: 44
	},
	sourceLen: {
		shortLen: 22,
		longLen: 30
	},
	getData: function(a, b) {
		var c = b["type"] == null ? "video" : b.type,
			d = b["size"] == null ? "small" : b.size,
			e = b.descType = Hulu.Utils.Tile.descriptionTypes.DEFAULT;
		b["tileType"] == Hulu.Controls.Render.Tile.TYPES.TYPE_WITHOUT_SHOW_NAME && (e = Hulu.Utils.Tile.descriptionTypes.NO_SHOW_NAME), b["tileType"] == Hulu.Controls.Render.Tile.TYPES.TYPE_SEARCH_RESULT && (e = Hulu.Utils.Tile.descriptionTypes.SEARCH_RESULT);
		var f = a.model,
			g = {
				linkTitle: null,
				linkUrl: f.pageUrl,
				size: d,
				id: f.id,
				name: f.name,
				type: c,
				attributes: a,
				model: f,
				subscriberBadge: !1,
				authBadge: !1,
				offsiteBadge: !1,
				positionlinkUrl1base: a._position + 1,
				plusBadgeUrl: null,
				scrollNumber: a.scrollNumber,
				isThumbnailDelayed: a.isThumbnailDelayed
			};
		f.getThumbUrl instanceof Function && (g.thumbnails = {
			"1x1": f.getThumbUrl("1x1"),
			"2x2": f.getThumbUrl("2x2")
		}), a.hasOwnProperty("indexInPage") && (g.indexInPage = a.indexInPage), a.hasOwnProperty("pageIndex") && (g.pageIndex = a.pageIndex);
		var h = {};
		switch (c) {
			case "video":
				var i = a.isSubscriber !== undefined ? a.isSubscriber : Hulu.Behaviors.isSubscriber(),
					j = Hulu.Behaviors.getAuthType(),
					k = f.getBadgeType(i, j);
				switch (k) {
					case Hulu.Utils.Tile.badgeTypes.PLUS:
						g.subscriberBadge = !0, g.plusBadgeUrl = f.getPlusUrl();
						break;
					case Hulu.Utils.Tile.badgeTypes.AUTH_FOX:
						g.authBadge = !0, g.authType = Hulu.Constants.AUTH_TYPE.fox, g.authBadgeDesc = f.getAuthDescription(Hulu.Constants.AUTH_TYPE.fox), g.authBadgeUrl = f.getAuthUrl(Hulu.Constants.AUTH_TYPE.fox);
						break;
					case Hulu.Utils.Tile.badgeTypes.AUTH_NBC:
						g.authBadge = !0, g.authType = Hulu.Constants.AUTH_TYPE.nbc, g.authBadgeDesc = f.getAuthDescription(Hulu.Constants.AUTH_TYPE.nbc), g.authBadgeUrl = f.getAuthUrl(Hulu.Constants.AUTH_TYPE.nbc);
					default:
				}
				a.genre && (h[Hulu.Constants.QUERY_STRING_PARAMS.genre] = a.genre), g.description = f.getTileDescription(e, d), g.videoTitle = f.title, g.showName = f.show.name, g.posterUrl = f.posterUrl;
				if (Hulu.Utils.Url.isSpotlightUrl(Hulu.Utils.Url.getPathName())) {
					var c = Hulu.Utils.Url.getPathName().split("/")[1];
					g.linkUrl = Hulu.Utils.Str.format("/{0}/{1}/{2}", c, b.trayMetaData.id, g.id);
				} else if (a.config && Hulu.Utils.Url.isEditorialUrl(a.config.baseUrl)) {
					var l = a.config.restParams,
						m = l.id;
					m || (m = Hulu.Utils.Url.extractIdFromEditorialUrl(a.config.baseUrl)), l && m && (g.linkUrl += "?playlist_id=" + m, l.asset_scope && (g.linkUrl += "&asset_scope=" + l.asset_scope));
				}
				if (b.tileType == Hulu.Controls.Render.Tile.TYPES.TYPE_SHORT_FORM) {
					g.headline = f.features && f.features.title != "" ? f.features.title : Hulu.Utils.Str.truncatePreserveWord(f.name, 75, !1), g.duration = g.description.duration, g.postedTime = f.features && f.features.postedTime ? I18n.t("tile.posted_time", {
						diff: f.features.postedTime
					}) : null;
					var n = f.show ? f.show.name : f.title;
					g.source = g.postedTime ? Hulu.Utils.Str.truncate(n, Hulu.Utils.Tile.sourceLen.shortLen) : Hulu.Utils.Str.truncate(n, Hulu.Utils.Tile.sourceLen.longLen);
				}
				b.tileType == Hulu.Controls.Render.Tile.TYPES.TYPE_LAST_NIGHT_EPISODE && (g.thumbnail = f.show.getThumbUrl("1x1"), g.headline = Hulu.Utils.Str.truncatePreserveWord(f.description, 75, !1), g.duration = g.description.duration, g.source = Hulu.Utils.Str.truncate(f.show.name, Hulu.Utils.Tile.sourceLen.longLen)), g.hoverTitle = f.title;
				break;
			case "streamSchedule":
				g.posterUrl = f.posterUrl, f.isLive() ? g.isLive = !0 : (g.startAtDate = f.startAtDate, g.startAtTime = f.startAtTime), g.description = {
					title: f.title
				};
				break;
			case "show":
				var i = a.isSubscriber !== undefined ? a.isSubscriber : Hulu.Behaviors.isSubscriber();
				!i && f.isSubscriberOnly && (g.subscriberBadge = !0, g.plusBadgeUrl = f.getPlusUrl()), !f.posterUrl || (g.posterUrl = f.posterUrl), g.showName = f.name, a.genre && (h[Hulu.Constants.QUERY_STRING_PARAMS.genre] = a.genre), b.trayMetaData.isWYW && f.hasNewEpisode() && (g.newEpisodeBage = !0), g.hoverTitle = f.name;
				break;
			case "ad":
				g.linkTitle = f.getTitle(), g.linkUrl = f.getLinkUrl();
				break;
			case "videoGame":
				g.posterUrl = f.posterUrl, g.isThumbnailTransparent = !0;
				break;
			case "offsiteVideo":
				g.showName = f.showName, g.videoTitle = f.title, g.linkUrl = f.pageUrl, g.description = f.getTileDescription(e, d), g.newWindow = !0, g.offsiteBadge = !0, g.offsiteBadgeDesc = f.getOffsiteBadgeDesc();
				break;
			case "offsitePlaceholder":
				g.description = {
					title: "On " + f.sourceSite,
					subTitle: f.typeStats
				}, g.frontThumb = f.thumbnailUrl[0] || f.getThumbUrl, g.middleThumb = f.thumbnailUrl[1], g.backThumb = f.thumbnailUrl[2];
				break;
			case "genre":
				g.id = f.name;
				break;
			case "featuredContent":
				g["size"] == "1x1" && (g.thumbnailText = f.getThumbText(), g.posterUrl = f.posterUrl, g.description = {
					title: f.title,
					subTitle: f.subTitle
				});
				break;
			default:
		}
		return g.linkUrl && (g.linkUrl = Hulu.Utils.Url.build(g.linkUrl, $.param(h).split("&"))), b.tileType == Hulu.Controls.Render.Tile.TYPES.TYPE_SURVEY && f.features && (f.features.description == "predicted" ? g.huluPredictedWinnerBadge = !0 : f.features.description == "winner" && (g.oscarWinnerBadge = !0)), g;
	}
},
function() {
	Hulu.Beacon = {
		TYPES: {
			SITE_TRACKING: "sitetracking",
			SITE_INTERACTION: "siteinteraction",
			AD_INTERACTION: "adinteraction",
			REVENUE: "revenue",
			SEARCH_TRACKING: "searchtracking",
			PLAYER_TRACKING: "playertracking",
			TEMPORARY: "temporary",
			ENGAGEMENT: "engagement",
			PLUS_TRACKING: "plustracking"
		},
		SITE_EVENTS: {
			AJAX_LOAD: "ajaxload",
			CLICK: "click",
			DATA_LOAD: "dataload",
			ASSET_LOAD: "sitetracking/assetload",
			HOVER_OPEN: "hover/open",
			THUMBNAIL_CLICK: "thumbnailclick",
			PAGE_LOAD: "pageload",
			PAGE_INFO_LOAD: "pageinfo/load",
			ENGAGEMENT_START: "engagement/start",
			ENGAGEMENT_BROWSE: "browse",
			PERF: "perf",
			RENDER_PERF: "renderperf",
			SESSION_STARTUP: "session",
			SHARE_SITE: "sharesite",
			PUBLISH: "publish",
			ASSET_IMPRESSION: "assetimpression",
			CREDENTIALS: "credentials",
			INLINE_PLAY: "inlineplay"
		},
		PLUS_TRACKING_EVENTS: {
			DRIVER_CLICK: "driverclick",
			DRIVER_LOAD: "driverload",
			CONVERSION: "conversion",
			FLOW: "flow"
		},
		SEARCH_EVENTS: {
			AUTOCOMPLETE: {
				IMPRESSION: "autocomplete/impression",
				CLICK: "autocomplete/click"
			},
			DIDYOUMEAN_SEARCH: {
				IMPRESSION: "didyoumean/impression",
				CLICK: "didyoumean/click"
			},
			RELATED_SEARCH: {
				IMPRESSION: "relatedsearch/impression",
				CLICK: "relatedsearch/click"
			},
			PROMO: {
				IMPRESSION: "promo/impression",
				SEARCH: "promo/search",
				CLICK: "promo/click"
			},
			GRID: {
				IMPRESSION: "grid/impression",
				SEARCH: "grid/search",
				CLICK: "grid/click"
			},
			OFFSITEPOPUP: {
				SEARCH: "offsitepopup/search",
				CLICK: "offsitepopup/click"
			}
		},
		PLAYER_EVENTS: {
			CRASH: "crash",
			USER_LEAVE: "userleave"
		},
		REGIONS: {
			BROWSE: {
				name: "browse",
				zone: -1
			},
			SHOW_KEYART: {
				name: "show-keyart",
				zone: -2
			},
			SMARTSTART: {
				name: "smartstart",
				zone: -3
			},
			FOOTER: {
				name: "footer",
				zone: -4
			},
			SOCIAL_DROPDOWN: {
				name: "social_dropdown",
				zone: -5
			},
			ACCOUNT_DROPDOWN: {
				name: "account_dropdown",
				zone: -6
			},
			QUEUE_DROPDOWN: {
				name: "queue_dropdown",
				zone: -7
			},
			TOP_NAV_PLUS: {
				name: "top-nav-plus",
				zone: -8
			},
			PLUS_UPSELL_BANNER: {
				name: "plus_upsell_banner",
				zone: -9
			},
			MASTHEAD: {
				name: "masthead",
				zone: -10
			},
			SEARCH: {
				name: "search",
				zone: -11
			},
			SEARCH_OFFSITE_VIDEO: {
				name: "search_offsite_video",
				zone: -12
			},
			SEARCH_GRID: {
				name: "search_grid",
				zone: -13
			},
			SEARCH_PROMO_TRAYS: {
				name: "search_promo_trays"
			},
			SHOW_TITLE: {
				name: "show-title",
				zone: -14
			},
			SEARCH_THUMBNAIL: {
				name: "search_thumbnail"
			},
			SEARCH_TITLE: {
				name: "search_title"
			},
			VIDEOS_BY_SEASON: {
				name: "videos_by_season",
				zone: -15
			},
			SHOW_NOTES: {
				name: "show-notes",
				zone: -16
			},
			PLUS_UPSELL_POPUP: {
				name: "plus-upsell-popup",
				zone: -17
			}
		},
		_realtimeBeaconTypes: [],
		_isInteracionBeacon: function(a, b) {
			if (_.contains([Hulu.Beacon.TYPES.SITE_INTERACTION, Hulu.Beacon.TYPES.AD_INTERACTION], a)) return !0;
			if (a == Hulu.Beacon.TYPES.SITE_TRACKING) {
				var c = [Hulu.Beacon.SITE_EVENTS.CLICK, Hulu.Beacon.SITE_EVENTS.HOVER_OPEN, Hulu.Beacon.SITE_EVENTS.THUMBNAIL_CLICK, Hulu.Beacon.SITE_EVENTS.PAGE_INFO_LOAD, Hulu.Beacon.SITE_EVENTS.SHARE_SITE, Hulu.Beacon.SITE_EVENTS.PUBLISH];
				return _.contains(c, b);
			}
			return !1;
		},
		trackStandardBeacon: function(a, b, c, d, e) {
			this._isInteracionBeacon(a, b) && Hulu.userEngagement.userInteract();
			try {
				Hulu.Utils.isBlank(c) && (c = {}), Hulu.Utils.isBlank(d) && (d = {});
				if (!Hulu.Beacon._beaconEventEnabled(a, b, c, d)) return !1;
				var f = this.constructBeaconUrl(a, b, c);
				this.sendBeacon(f, e);
			} catch (g) {
				Hulu.Utils.warn(g);
			}
			return !0;
		},
		constructBeaconUrl: function(a, b, c) {
			var d = {};
			d.beaconevent = b, _.extend(d, this.getCommonParams());
			var e = Hulu.Beacon.Spec.getBeaconSpec(a, b);
			e || Hulu.Utils.warn("ERROR: not defined spec " + [a, b]), Hulu.Beacon.Context.clearCache();
			for (var f in e) {
				var g = e[f][0],
					h = e[f][1],
					i = e[f][2];
				h == null || null == Hulu.Beacon.Context.getContextValue(h, i, c) ? c[f] != null ? d[f] = c[f] : e[f].length == 4 ? d[f] = e[f][3] : g && Hulu.Utils.warn(Hulu.Utils.Str.format("missing required beacon param {0} for beacon {1}/{2}", f, a, b)) : d[f] = Hulu.Beacon.Context.getContextValue(h, i, c);
			}
			for (var j in c) d[j.toLowerCase()] != null && d[j.toLowerCase()] != c[j] ? (Hulu.Utils.warn("custom beacon data override beacon spec " + j), d[j.toLowerCase()] = c[j]) : d[j.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")] == null && (d[j.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")] = c[j]);
			var k = Hulu.Beacon.Spec.getBeaconCustomSpec(a, b);
			k && _.each(k, function(a) {
				_.extend(d, Hulu.Beacon.Context.getContextValue(a[0], a[1], c));
			});
			var l = this._getEndPoint(a, b);
			return Hulu.Utils.Url.buildSortedUrl(l, d) + "&cb=" + (new Date).getTime();
		},
		sendBeacon: function(a, b) {
			b = b && $.client.browser != "Explorer", b ? $.ajax(a, {
				async: !1
			}) : Hulu.Utils.pingImage(a);
		},
		_getEndPoint: function(a, b) {
			var c = "",
				d = "";
			Hulu.Configuration.region() != "us" && (c = Hulu.Configuration.region().toLowerCase() + "/"), Hulu.Configuration.isStaging() ? d = "qa" : d = "im";
			var e = "http://";
			return /https/.test(window.location.protocol) && (e = "https://"), Hulu.Configuration.isPlusprod() && (e = "https://a248.e.akamai.net/"), _.indexOf(Hulu.Beacon._realtimeBeaconTypes, a) != -1 ? e += "t.hulu" + d + ".com/" + c + a + "/" + b : e += "t2.hulu" + d + ".com/v3/" + c + a + "/" + b, e;
		},
		getCommonParams: function() {
			var a = {};
			for (var b in Hulu.Beacon.Spec.common) a[b] = Hulu.Beacon.Context.getContextValue("common", b);
			return _.each(Hulu.Donut.assignments, function(b) {
				a["d" + b.flight_id] = b.treatment_id;
			}), a;
		},
		getCommonParamsForPlayer: function() {
			var a = {};
			return a.pagedesign = Hulu.Beacon.Context.getContextValue("common", "pagedesign"), a.codeversion = Hulu.Beacon.Context.getContextValue("common", "codeversion"), _.each(Hulu.Donut.assignments, function(b) {
				a["d" + b.flight_id] = b.treatment_id;
			}), a;
		},
		socialIdentityIds: function() {
			var a = 1;
			return Hulu.Behaviors.isFacebookConnected() ? [1] : [];
		},
		_beaconEventEnabled: function(a, b, c, d) {
			var e = Hulu.Beacon.Configuration.getBeaconConfig(a, b);
			if (e) {
				var f = !0;
				if (_.has(e, "conditions") && _.isString(e.conditions)) {
					var g = e.conditions.split("&&");
					_.each(g, function(a) {
						a.toLowerCase() == "nonplususeronly" && (f = f && !Hulu.Behaviors.isSubscriber()), a.toLowerCase() == "plususeronly" && (f = f && Hulu.Behaviors.isSubscriber());
					});
				}
				return f;
			}
			return !1;
		},
		calculateRegionName: function(a, b, c) {
			var d = "";
			if (!Hulu.Utils.isBlank(a)) d = a;
			else if (Hulu.Utils.isBlank(b)) d = c;
			else {
				var e = Hulu.Utils.Str.decamelize(b, "_").toUpperCase();
				_.include(["EDITORIAL", "RECOMMENDED_SHOWS_IN_GENRE", "EDITORIAL_MOVIE", "RECOMMENDED_EDITORIAL", "POPULAR_SHOWS", "POPULAR_MOVIES", "PLAYLIST", "VIDEOS", "SHOWS"], e) ? Hulu.Utils.isBlank(c) ? d = e : d = e + "_" + c : d = e;
			}
			return Hulu.Utils.Str.cleanupText((d || "no_name").toLowerCase().replace(/\s+/g, "_"));
		},
		_getDefinedRegionAttr: function(a, b, c) {
			var d = a.toUpperCase(),
				e = a,
				b = b;
			if (_.has(Hulu.Beacon.REGIONS, d)) {
				var f = Hulu.Beacon.REGIONS[d];
				e = f.name, Hulu.Utils.isBlank(f.zone) || (b = f.zone);
			}
			return Hulu.Utils.isBlank(c) ? {
				name: e,
				zone: b
			} : {
				name: e + "-" + c,
				zone: b
			};
		},
		formatRegionAttrs: function(a, b, c, d) {
			if (_.isNull(c) || _.isUndefined(c)) c = "";
			var e = this._getDefinedRegionAttr(a, b, c);
			return b = e.zone, a = e.name, Hulu.Utils.isBlank(b) && (Hulu.Utils.warn("zone params is empty ! name : " + a), b = -100), a = a.toLowerCase(), d == "htmlstring" ? Hulu.Utils.Str.format("beacon-attr-regionname='{0}' beacon-attr-zone='{1}' beacon-attr-scrollnumber=1", a, b) : d == "htmlattr" ? {
				"beacon-attr-regionname": a,
				"beacon-attr-zone": b,
				"beacon-attr-scrollnumber": 1
			} : {
				regionname: a,
				zone: b,
				scrollnumber: 1
			};
		},
		evalAttr: function(a) {
			if (!a) return "error";
			var b = a;
			if (a.indexOf("Hulu.Beacon") == 0) try {
					b = Hulu.Utils.getValueInChain(Hulu.Beacon, a.replace("Hulu.Beacon.", "").split("."));
					if (_.isNull(b) || _.isUndefined(b)) throw new Error("can't find the beacon constant");
			} catch (c) {
				Hulu.Utils.warn("beaconAttr Error : " + a), b = "error";
			}
			return b;
		}
	};
}.call(this), Hulu.Beacon.SearchTrack = {
	trackAutocompleteClick: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.AUTOCOMPLETE.CLICK, a);
	},
	trackDidYouMeanClick: function(a) {
		var b = $(a.target || a.srcElement),
			c = Hulu.interaction.getBeaconData(b),
			d = $("#serp-container");
		d.length > 0 && (c = _.extend(c, Hulu.interaction.getBeaconData($("#serp-container")))), c = _.extend(c, {
			timestamp: a.timeStamp
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.DIDYOUMEAN_SEARCH.CLICK, c);
	},
	trackRelatedSearchClick: function(a) {
		this._onClick(Hulu.Beacon.SEARCH_EVENTS.RELATED_SEARCH.CLICK, a);
	},
	trackRelatedSearchImpression: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.RELATED_SEARCH.IMPRESSION, a);
	},
	trackPromoSearch: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.PROMO.SEARCH, a);
	},
	trackPromoClick: function(a) {
		this._onClick(Hulu.Beacon.SEARCH_EVENTS.PROMO.CLICK, a);
	},
	trackPromoImpression: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.PROMO.IMPRESSION, a);
	},
	trackGridSearch: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.GRID.SEARCH, a);
	},
	trackGridImpression: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.GRID.IMPRESSION, a);
	},
	trackOffsitePopupSearch: function(a) {
		a = _.extend(a, {
			timestamp: (new Date).getTime()
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, Hulu.Beacon.SEARCH_EVENTS.OFFSITEPOPUP.SEARCH, a);
	},
	trackGridClick: function(a) {
		this._onClick(Hulu.Beacon.SEARCH_EVENTS.GRID.CLICK, a);
	},
	trackOffsitePopupClick: function(a) {
		this._onClick(Hulu.Beacon.SEARCH_EVENTS.OFFSITEPOPUP.CLICK, a);
	},
	_onClick: function(a, b) {
		var c = $(b.target || b.srcElement),
			d = Hulu.interaction.getBeaconData(c);
		d = _.extend(d, {
			timestamp: b.timeStamp
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SEARCH_TRACKING, a, d);
	}
}, Hulu.Beacon.Signup = {
	trackEmail: function(a) {
		Hulu.Beacon.trackStandardBeacon("sitetracking", "signupevent", _.extend({
			field: "email"
		}, a));
	},
	trackCard: function(a) {
		Hulu.Beacon.trackStandardBeacon("sitetracking", "signupevent", _.extend({
			field: "card"
		}, a));
	},
	trackStep2: function(a) {
		Hulu.Beacon.trackStandardBeacon("sitetracking", "signupevent", _.extend({
			field: "continue_s2"
		}, a));
	}
}, Hulu.Beacon.Spec = {
	getBeaconSpec: function(a, b) {
		return Hulu.Beacon.Spec._getNode("spec", a, b);
	},
	getBeaconCustomSpec: function(a, b) {
		return Hulu.Beacon.Spec._getNode("custom", a, b);
	},
	_getNode: function(a, b, c) {
		var d = Hulu.Beacon.Spec,
			e = null;
		if (d[b]) if (c.indexOf("/") != -1) {
				var f = c.split("/")[0],
					g = c.split("/")[1];
				e = Hulu.Utils.getValueInChain(d, [b, f, g, a]);
			} else e = Hulu.Utils.getValueInChain(d, [b, c, a]);
		return e;
	},
	common: {
		client: "client",
		computerguid: "computerguid",
		deviceid: "deviceid",
		distro: "distro",
		distroplatform: "distroplatform",
		language: "language",
		os: "os",
		pagedesign: "pagedesign",
		pagetype: "pagetype",
		pageurl: "pageurl",
		planid: "planid",
		region: "region",
		referrerurl: "referrerurl",
		sitesessionid: "sitesessionid",
		seq: "seq",
		socialidentities: "socialidentities",
		siteversion: "siteversion",
		codeversion: "codeversion",
		userid: "userid",
		visit: "visit"
	},
	player: {
		sessionguid: "sessionguid",
		playermode: "playermode",
		flash: "flash",
		player: "player",
		position: "position",
		bandwidth: "bandwidth",
		userbandwidth: "userbandwidth",
		embedurl: "embedurl",
		packageid: "packageid",
		totalmemory: "totalmemory",
		timepadding: "timepadding",
		packageavailability: "packageavailability",
		a: "a",
		auth: "auth"
	},
	sitetracking: {
		hover: {
			open: {
				spec: {
					regionname: [!0, null, null],
					zone: [!0, null, null],
					position: [!0, null, null],
					type: [!0, null, null],
					hoverid: [!0, null, null]
				}
			}
		},
		masthead: {
			click: {
				spec: {
					position: [!0, "masthead", "position"],
					location: [!0, "masthead", "location"],
					target: [!0, "masthead", "linkUrl"],
					mastheaditemid: [!0, "masthead", "mastheadItemId"],
					placementid: [!1, "masthead", "ad.creative.placementId"],
					reporting_type: [!0, "masthead", "reportingType"],
					reporting_subtype: [!1, "masthead", "reportingSubtype"],
					reporting_target: [!0, "masthead", "reportingTarget"],
					videoid: [!1, "masthead", "videoId"],
					total_count: [!0, "masthead", "totalCount"],
					seriesid: [!1, "masthead", "showId"],
					sessionid: [!0, "masthead", "sessionId"],
					track_localtime: [!0, "masthead", "trackLocalTime"],
					track_duration: [!0, "masthead", "trackDuration"],
					session_p: [!0, "masthead", "hasPersonalized"],
					item_p: [!0, "masthead", "isPersonalizedItem"],
					scroll: [!0, "masthead", "scrollType"],
					rec_track: [!0, "masthead", "recTrack"]
				}
			},
			load: {
				spec: {
					position: [!0, "masthead", "position"],
					location: [!0, "masthead", "location"],
					target: [!0, "masthead", "linkUrl"],
					mastheaditemid: [!0, "masthead", "mastheadItemId"],
					placementid: [!1, "masthead", "ad.creative.placementId"],
					reporting_type: [!0, "masthead", "reportingType"],
					reporting_subtype: [!1, "masthead", "reportingSubtype"],
					reporting_target: [!0, "masthead", "reportingTarget"],
					videoid: [!1, "masthead", "videoId"],
					total_count: [!0, "masthead", "totalCount"],
					seriesid: [!1, "masthead", "showId"],
					sessionid: [!0, "masthead", "sessionId"],
					track_localtime: [!0, "masthead", "trackLocalTime"],
					track_duration: [!0, "masthead", "trackDuration"],
					session_p: [!0, "masthead", "hasPersonalized"],
					item_p: [!0, "masthead", "isPersonalizedItem"],
					scroll: [!0, "masthead", "scrollType"],
					rec_track: [!0, "masthead", "recTrack"]
				}
			},
			init: {
				spec: {
					location: [!0, "masthead", "location"],
					sessionid: [!0, "masthead", "sessionId"],
					track_localtime: [!0, "masthead", "trackLocalTime"],
					track_duration: [!0, "masthead", "trackDuration"]
				}
			},
			start: {
				spec: {
					location: [!0, "masthead", "location"],
					sessionid: [!0, "masthead", "sessionId"],
					session_p: [!0, "masthead", "hasPersonalized"],
					total_count: [!0, "masthead", "totalCount"],
					seriesid: [!1, "masthead", "showId"],
					track_localtime: [!0, "masthead", "trackLocalTime"],
					track_duration: [!0, "masthead", "trackDuration"]
				}
			}
		},
		pageinfo: {
			load: {
				spec: {
					zone: [!0, null, null],
					regionname: [!0, null, null],
					layout: [!0, null, null],
					scrollnumber: [!0, null, null],
					tempoid: [!1, null, null]
				}
			}
		},
		pageload: {
			spec: {
				cmpid: [!0, "plus", "cmpid"]
			}
		},
		perf: {
			spec: {
				referrer: [!0, "common", "referrerurl"],
				domloadtime: [!1, null, null],
				windowloadtime: [!1, null, null],
				rendertime: [!1, null, null],
				swaptime: [!1, null, null],
				pageloadtime: [!1, null, null]
			}
		},
		renderperf: {
			spec: {
				start: [!0, null, null],
				end: [!0, null, null],
				time: [!0, null, null],
				perftype: [!0, null, null]
			}
		},
		signupevent: {
			spec: {
				event: [!0, null, null],
				field: [!0, null, null]
			}
		},
		session: {
			spec: {
				frequency: [!0, null, null]
			}
		},
		dataload: {
			spec: {
				result: [!0, null, null]
			}
		},
		thumbnailclick: {
			spec: {
				regionname: [!0, null, null],
				zone: [!0, null, null],
				position: [!0, null, null],
				type: [!0, null, null],
				clickid: [!0, null, null],
				hoversocial: [!0, "hover", "isSocial"],
				tempoid: [!1, null, null],
				sorting: [!1, null, null]
			}
		},
		publish: {
			spec: {
				publishtype: [!0, null, null],
				publisheditem: [!0, null, null],
				publishtarget: [!0, null, null],
				sitevideoid: [!1, null, null],
				siteseriesid: [!1, null, null],
				sitelink: [!1, null, null]
			},
			custom: [
				["player", null]
			]
		},
		credentials: {
			spec: {
				action: [!0, null, null],
				euserid: [!0, null, null]
			}
		},
		inlineplay: {
			spec: {
				position: [!0, null, null],
				itemindex: [!0, null, null],
				videoid: [!0, null, null],
				regionname: [!0, null, null],
				zone: [!0, null, null],
				scrollnumber: [!0, null, null],
				reason: [!0, null, null]
			}
		}
	},
	siteinteraction: {
		mastheadsponsorclick: {
			spec: {
				position: [!0, "masthead", "position"],
				location: [!0, "masthead", "location"],
				target: [!0, "masthead", "linkUrl"],
				mastheaditemid: [!0, "masthead", "mastheadItemId"],
				placementid: [!1, "masthead", "ad.creative.placementId"],
				reporting_type: [!0, "masthead", "reportingType"],
				reporting_subtype: [!1, "masthead", "reportingSubtype"],
				reporting_target: [!0, "masthead", "reportingTarget"],
				videoid: [!1, "masthead", "videoId"],
				total_count: [!0, "masthead", "totalCount"],
				seriesid: [!1, "masthead", "showId"],
				sessionid: [!0, "masthead", "sessionId"],
				track_localtime: [!0, "masthead", "trackLocalTime"],
				track_duration: [!0, "masthead", "trackDuration"],
				session_p: [!0, "masthead", "hasPersonalized"],
				item_p: [!0, "masthead", "isPersonalizedItem"]
			}
		}
	},
	adinteraction: {
		sharesite: {
			spec: {
				site: [!0, null, null],
				adunitid: [!0, "video", "id"],
				creativeid: [!0, "video", "creativeId"],
				placementid: [!0, "video", "placementId"]
			}
		},
		click: {
			spec: {
				type: [!0, null, null],
				placementid: [!1, "masthead", "ad.creative.placementId"],
				creativeid: [!1, "masthead", "ad.creative.creativeId"]
			},
			custom: [
				["masthead", "ad.auditParams"]
			]
		}
	},
	revenue: {
		assetimpression: {
			spec: {
				type: [!0, null, null],
				placementid: [!1, "masthead", "ad.creative.placementId"],
				creativeid: [!1, "masthead", "ad.creative.creativeId"]
			},
			custom: [
				["masthead", "ad.auditParams"]
			]
		}
	},
	searchtracking: {
		autocomplete: {
			click: {
				spec: {
					type: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					timestamp: [!0, null, null]
				}
			}
		},
		didyoumean: {
			impression: {
				spec: {
					query: [!0, null, null],
					data: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					timestamp: [!0, null, null]
				}
			},
			click: {
				spec: {
					query: [!0, null, null],
					relatedquery: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					timestamp: [!0, null, null]
				}
			}
		},
		relatedsearch: {
			impression: {
				spec: {
					query: [!0, null, null],
					data: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					timestamp: [!0, null, null]
				}
			},
			click: {
				spec: {
					query: [!0, null, null],
					relatedquery: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					searchid: [!0, null, null],
					timestamp: [!0, null, null]
				}
			}
		},
		promo: {
			impression: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					data: [!0, null, null],
					position: [!0, null, null],
					timestamp: [!0, null, null]
				}
			},
			search: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					data: [!0, null, null],
					timestamp: [!0, null, null]
				}
			},
			click: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					"promo-id": [!0, null, null],
					"promo-name": [!0, null, null],
					"promo-type": [!0, null, null],
					region: [!1, null, null],
					timestamp: [!0, null, null]
				}
			}
		},
		grid: {
			impression: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					data: [!0, null, null],
					timestamp: [!0, null, null]
				}
			},
			search: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					data: [!0, null, null],
					timestamp: [!0, null, null]
				}
			},
			click: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					clickid: [!0, null, null],
					position: [!0, null, null],
					type: [!0, null, null],
					timestamp: [!0, null, null]
				}
			}
		},
		offsitepopup: {
			search: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					data: [!0, null, null],
					timestamp: [!0, null, null]
				}
			},
			click: {
				spec: {
					query: [!0, null, null],
					searchid: [!0, null, null],
					userid: [!0, "common", "userid"],
					sessionid: [!0, "common", "sitesessionid"],
					clickid: [!0, null, null],
					position: [!0, null, null],
					type: [!0, null, null],
					timestamp: [!0, null, null]
				}
			}
		}
	},
	playertracking: {
		crash: {
			spec: {
				runningtime: [!0, null, null]
			}
		},
		userleave: {
			spec: {
				state: [!0, null, null],
				substate: [!0, null, null],
				contenttime: [!0, null, null],
				contentratio: [!0, null, null],
				statetime: [!0, null, null],
				wait: [!0, null, null],
				firstload: [!0, null, null]
			}
		}
	},
	plustracking: {
		driverload: {
			spec: {
				cmpid: [!0, "plus", "cmpid"],
				sessionreferrer: [!0, "plus", "sessionreferrer"],
				driverpage: [!0, "plus", "driverpage"],
				drivertype: [!0, null, null],
				driverid1: [!0, null, null],
				driverid2: [!0, null, null, ""],
				driverid3: [!0, null, null, ""]
			}
		},
		driverclick: {
			spec: {
				cmpid: [!0, "plus", "cmpid"],
				sessionreferrer: [!0, "plus", "sessionreferrer"],
				driverpage: [!0, "plus", "driverpage"],
				drivertype: [!0, null, null],
				driverid1: [!0, null, null],
				driverid2: [!0, null, null, ""],
				driverid3: [!0, null, null, ""]
			}
		},
		conversion: {
			spec: {
				cmpid: [!0, "plus", "cmpid"],
				sessionreferrer: [!0, "plus", "sessionreferrer"],
				driverpage: [!0, "plus", "driverpage", ""],
				drivertype: [!0, null, null, ""],
				driverid1: [!0, null, null, ""],
				driverid2: [!0, null, null, ""],
				driverid3: [!0, null, null, ""],
				subscriberid: [!0, null, null],
				subscriptionid: [!0, null, null],
				wasregistered: [!0, null, null]
			}
		},
		flow: {
			spec: {
				cmpid: [!0, "plus", "cmpid"],
				sessionreferrer: [!0, "plus", "sessionreferrer"],
				driverpage: [!0, "plus", "driverpage", ""],
				drivertype: [!0, null, null, ""],
				driverid1: [!0, null, null, ""],
				driverid2: [!0, null, null, ""],
				driverid3: [!0, null, null, ""],
				landingpage: [!0, null, null]
			}
		}
	},
	temporary: {
		sitetracking: {
			assetload: {
				spec: {
					asseturl: [!0, null, null],
					loadresult: [!0, null, null],
					type: [!0, null, null]
				}
			}
		},
		engagement: {
			start: {
				spec: {
					frequency: [!0, null, null]
				}
			}
		}
	},
	engagement: {
		browse: {
			spec: {
				duration: [!0, null, null],
				pagecount: [!0, null, null],
				watchpagecount: [!0, null, null],
				shortformcount: [!0, null, null],
				shortformduration: [!0, null, null],
				longformcount: [!0, null, null],
				longformduration: [!0, null, null],
				moviecount: [!0, null, null],
				movieduration: [!0, null, null]
			}
		}
	}
},
function() {
	var a = {};
	Hulu.Beacon.Configuration = {
		distro: "hulu",
		distroplatform: "hulu",
		getBeaconConfig: function(a, b) {
			var c = Hulu.Beacon.Configuration,
				d = null;
			if (c[a]) if (b.indexOf("/") != -1) {
					var e = b.split("/")[0],
						f = b.split("/")[1];
					d = Hulu.Utils.getValueInChain(c, [a, e, f]);
				} else d = Hulu.Utils.getValueInChain(c, [a, b]);
			return d;
		},
		test: {},
		contentinteraction: {
			sharesite: a
		},
		sitetracking: {
			ajaxload: a,
			pageload: a,
			controlload: a,
			pageswap: a,
			hover: {
				open: a
			},
			perf: a,
			renderperf: a,
			thumbnailclick: a,
			share: a,
			session: a,
			dataload: a,
			assetload: a,
			pageinfo: {
				load: a
			},
			masthead: {
				navigate: a,
				click: a,
				load: a,
				start: a,
				init: a
			},
			signupevent: a,
			publish: a,
			credentials: a,
			inlineplay: a
		},
		siteinteraction: {
			mastheadsponsorclick: a,
			mouseover: a,
			mouseout: a
		},
		plustracking: {
			driverload: {
				conditions: "nonPlusUserOnly"
			},
			driverclick: {
				conditions: "nonPlusUserOnly"
			},
			flow: {
				conditions: "nonPlusUserOnly"
			},
			conversion: a
		},
		searchtracking: {
			autocomplete: {
				click: a
			},
			didyoumean: {
				impression: a,
				click: a
			},
			relatedsearch: {
				impression: a,
				click: a
			},
			promo: {
				impression: a,
				search: a,
				click: a
			},
			grid: {
				impression: a,
				search: a,
				click: a
			},
			offsitepopup: {
				search: a,
				click: a
			}
		},
		adinteraction: {
			click: a,
			sharesite: a
		},
		revenue: {
			assetimpression: a
		},
		playertracking: {
			crash: a,
			userleave: a
		},
		temporary: {
			sitetracking: {
				assetload: a
			},
			engagement: {
				start: a
			}
		},
		engagement: {
			browse: a
		}
	};
}.call(this),
function() {
	Hulu.Beacon.Context = {
		getContextValue: function(a, b, c) {
			switch (a) {
				case "common":
					return Hulu.Beacon.Context._getCommonParams(a, b);
				case "plus":
					return Hulu.Beacon.PlusTrack.getPlusCommonParameters(b);
				case "video":
					var d = Hulu.Routers.VideoPlayer.getInstance().getActiveVideo();
					return Hulu.Utils.getValueInChain(d, a.split(".").slice(1).concat(b.split(".")));
				case "masthead":
					var e = this._cachedContextData.masthead;
					return !e && Hulu.getMasthead() && (e = Hulu.getMasthead().beaconData(c.position), this._cachedContextData.masthead = e), Hulu.Utils.getValueInChain(e, a.split(".").slice(1).concat(b.split(".")));
				case "player":
					return Hulu.videoPlayerApp.getPlayerCommonParameters(c.sitevideoid);
				case "hover":
					var f, g;
					Hulu.hoverBox && (g = Hulu.hoverBox._infoStore);
					if (c && g) {
						var h = g.get(c.type, c.clickid);
						h && (f = h[b]), f == null && b == "isSocial" && (f = !1);
					}
					return f;
			}
			return null;
		},
		_cachedContextData: {},
		_cachedPageType: {},
		clearCache: function() {
			this._cachedContextData = {};
		},
		_getCommonParams: function(a, b) {
			var c = Hulu.Beacon.Spec.common;
			switch (b) {
				case c.codeversion:
					return Hulu.Configuration.version();
				case c.siteversion:
					return "2.0.0";
				case c.client:
					return [$.client.browser, $.client.version].join(" ");
				case c.computerguid:
					return Hulu.Behaviors.getComputerGUID();
				case c.deviceid:
					return "";
				case c.distro:
					return Hulu.Beacon.Configuration.distro;
				case c.distroplatform:
					return Hulu.Beacon.Configuration.distroplatform;
				case c.language:
					return Hulu.Configuration.language().toLowerCase();
				case c.region:
					return Hulu.Configuration.region().toUpperCase();
				case c.os:
					return [$.client.os, $.client.osVersion].join(" ");
				case c.pagedesign:
					return "";
				case c.pagetype:
					var d = Hulu.Utils.Url.getPathName();
					if (this._cachedPageType[d]) return this._cachedPageType[d];
					var e = Hulu.Utils.Url.getPageType(d);
					return this._cachedPageType[d] = e, e;
				case c.pageurl:
					return Hulu.Utils.Url.getHref();
				case c.planid:
					return Hulu.Behaviors.getPlanId();
				case c.referrerurl:
					return Hulu.getReferrer();
				case c.sitesessionid:
					return Hulu.Behaviors.getSiteSessionId();
				case c.seq:
					return Hulu.Behaviors.getSiteBeaconSeq();
				case c.socialidentities:
					return Hulu.Beacon.socialIdentityIds().join(",");
				case c.userid:
					var f = Hulu.Behaviors.getUserId();
					return f > 0 ? f : 0;
				case c.visit:
					return "";
				default:
					throw new Error("invalid common parameter " + b);
			}
		}
	};
}.call(this), Hulu.Beacon.Perf = function(a) {
	this.defaultOption = a;
}, _.extend(Hulu.Beacon.Perf.prototype, Backbone.Events.prototype, {
	newSession: !1,
	_appReadyTime: -1,
	_domLoadTime: -1,
	_windowLoadTime: -1,
	_beforeSwapTime: -1,
	_afterSwapTime: -1,
	_pageLoadTime: -1,
	_dataLoadHistory: {},
	_timeStampStaticRecords: {},
	init: function() {
		var a = this;
		$(document).ready(function() {
			a._onDomLoaded();
		}), $(window).load(function() {
			a._onWindowLoaded();
		}), $(document).on(Hulu.Application.Events.READY, $.proxy(function() {
			this._appReadyTime = new Date, Hulu.Dispatcher.on(Hulu.Events.Masthead.LOAD, $.proxy(this._onMastheadLoad, this)), Hulu.Dispatcher.on(Hulu.Events.Masthead.DISPLAY, $.proxy(this._onMastheadDisplay, this)), Hulu.Dispatcher.on(Hulu.Events.Shelf.FIRST_LOADED, $.proxy(this._onFirstShelfLoad, this));
		}, this)), HuluRouter.Broadcaster.on(Hulu.Events.Router.BEFORE_NAVIGATE, this._onBeforeNavigate, this), HuluRouter.Broadcaster.on(Hulu.Events.Router.BEFORE_SWAP, this._onBeforeSwap, this), HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, this._onAfterSwap, this), HuluRouter.Broadcaster.on(Hulu.Events.Common.PAGE_READY, this._onPageReady, this), HuluRouter.Broadcaster.on(Hulu.Events.Common.PLAYER_STARTED, this._onPlayerFirstPlaying, this);
	},
	_onBeforeNavigate: function(a) {
		this._beforeNavigateTime = new Date;
	},
	_getTrackVariable: function(a) {
		return a;
	},
	_pageStartTime: function() {
		return window.HuluPerfStart;
	},
	_onDomLoaded: function() {
		this._domLoadTime = new Date;
	},
	_onWindowLoaded: function() {
		this._windowLoadTime = new Date;
		var a = this._getPerformanceMetrics();
		Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PERF, _.extend(a, {
			type: !Hulu.router || Hulu.router.isFirstLoad ? "firstload" : "swap",
			name: "init",
			domloadtime: this._domLoadTime - this._pageStartTime(),
			windowloadtime: this._windowLoadTime - this._pageStartTime(),
			corejs: window.jsLoaded.applicationCoreLoadedTime - this._pageStartTime(),
			frameworkjs: window.jsLoaded.applicationFrameWorkLoadedTime - this._pageStartTime(),
			applicationjs: window.jsLoaded.applicationLoadedTime - this._pageStartTime(),
			appready: this._appReadyTime - this._pageStartTime()
		})), Hulu.GA.trackPerf(this._getTrackVariable("domload"), this._pageStartTime(), this._domLoadTime, "firstload"), Hulu.GA.trackPerf(this._getTrackVariable("windowload"), this._pageStartTime(), this._windowLoadTime, "firstload"), Hulu.GA.trackPerf(this._getTrackVariable("appReady"), this._pageStartTime(), this._appReadyTime, "firstload"), a && a.starttime && Hulu.GA.trackPerf(this._getTrackVariable("nativedomload"), a.starttime, this._domLoadTime, "firstload");
	},
	_getPerformanceMetrics: function() {
		var a = {};
		try {
			var b = window.performance || window.webkitPerformance || {}, c = b.timing || {}, d = c.navigationStart;
			d > 0 && (_.each(c, function(b, c) {
				c && b > 0 && (a["navtive" + c.toLowerCase()] = b - d);
			}), a.starttime = d, a.dnstime = c.domainLookupEnd - c.domainLookupStart, a.downloadingtime = c.responseEnd - c.fetchStart);
			var e = b.navigation;
			if (e) {
				var f = "unknown";
				switch (e.type) {
					case 0:
						f = "navigate";
						break;
					case 1:
						f = "reload";
						break;
					case 2:
						f = "forward";
				}
				a.navigationtype = f;
			}
		} catch (g) {
			a = {};
		}
		return a;
	},
	_onBeforeSwap: function() {
		this._timeStampRecords = {}, this.recordTimeStamp("beforeSwap"), this._beforeSwapTime = new Date;
	},
	_onAfterSwap: function() {
		this._afterSwapTime = new Date, this._pageLoadTime = this._afterSwapTime - this._getNavigateStartTime(), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PAGE_LOAD);
	},
	_getNavigateStartTime: function() {
		var a = window.HuluPerfStart;
		return this._beforeNavigateTime != null && (a = this._beforeNavigateTime), a;
	},
	_onPageReady: function(a) {
		var b = this._getNavigateStartTime(),
			c = new Date;
		Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PERF, {
			type: Hulu.router.isFirstLoad ? "firstload" : "swap",
			name: "page",
			pageready: c - b,
			startswap: this._beforeSwapTime - b,
			afterswap: this._afterSwapTime - b
		});
	},
	_onMastheadLoad: function() {
		this.recordTimeStamp("mastheadload");
	},
	_onMastheadDisplay: function() {
		var a = this._getNavigateStartTime();
		this.recordTimeStamp("mastheaddisplay"), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PERF, {
			type: Hulu.router.isFirstLoad ? "firstload" : "swap",
			name: "masthead",
			startswap: this._beforeSwapTime - a,
			afterswap: this._afterSwapTime - a,
			mastheadload: this._timeStampRecords.mastheadload - a,
			mastheaddisplay: this._timeStampRecords.mastheaddisplay - a,
			corejs: window.jsLoaded.applicationCoreLoadedTime - this._pageStartTime(),
			frameworkjs: window.jsLoaded.applicationFrameWorkLoadedTime - this._pageStartTime(),
			applicationjs: window.jsLoaded.applicationLoadedTime - this._pageStartTime(),
			appready: this._appReadyTime - this._pageStartTime()
		}), _.each(_.keys(this._timeStampRecords), function(a) {
			var b = Hulu.perf._getTrackVariable(a),
				c = Hulu.perf._timeStampRecords[a];
			Hulu.router.isFirstLoad ? Hulu.GA.trackPerf(b, window.HuluPerfStart, c, "firstload") : Hulu.GA.trackPerf(b, Hulu.perf._beforeSwapTime, c, "swap");
		});
	},
	_onPlayerFirstPlaying: function() {
		HuluRouter.Broadcaster.off(Hulu.Events.Common.PLAYER_STARTED, this._onPlayerFirstPlaying, this);
		var a = this._getNavigateStartTime();
		Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PERF, {
			type: Hulu.router.isFirstLoad ? "firstload" : "swap",
			preloaded: Hulu.videoPlayerRouter.isPreload ? "preload" : "load",
			name: "player",
			startswap: this._beforeSwapTime - a,
			afterswap: this._afterSwapTime - a,
			loadplayer: Math.max(0, this.getTimeStamp("loadplayer") - a),
			requestplaying: Math.max(0, this.getTimeStamp("requestplaying") - a),
			playerready: Math.max(0, this.getTimeStamp("playerready") - a),
			loadingtime: this.getTimeStamp("playerready") - this.getTimeStamp("loadplayer"),
			watingtime: Math.max(0, this.getTimeStamp("playerready") - this.getTimeStamp("requestplaying")),
			frameworkjs: window.jsLoaded.applicationFrameWorkLoadedTime - this._pageStartTime()
		});
	},
	recordTimeStamp: function(a, b) {
		this._timeStampRecords && !b && (this._timeStampRecords[a] = new Date), b && (this._timeStampStaticRecords[a] = new Date);
	},
	getTimeStamp: function(a) {
		return (this._timeStampRecords ? this._timeStampRecords[a] : null) || this._timeStampStaticRecords[a];
	},
	getPageLoadTime: function() {
		return this._pageLoadTime;
	},
	_onFirstShelfLoad: function() {
		this.recordTimeStamp("firstshelfload");
	},
	trackRenderPerfBeacon: function(a, b, c) {
		c.start = a.getTime(), c.end = b.getTime(), c.time = b.getTime() - a.getTime(), c.perftype = "render";
	}
}), Hulu.Beacon.Perf.getInstance = function() {
	return Hulu.Beacon.Perf.__instance == null && (Hulu.Beacon.Perf.__instance = new Hulu.Beacon.Perf), Hulu.Beacon.Perf.__instance;
}, Hulu.perf = Hulu.Beacon.Perf.getInstance(), Hulu.perf.init(), Hulu.Beacon.Interaction = function(a) {
	this.defaultOption = a;
}, Hulu.Beacon.Interaction.DefaultClickBeacon = Hulu.Beacon.TYPES.SITE_INTERACTION + "," + Hulu.Beacon.SITE_EVENTS.CLICK, _.extend(Hulu.Beacon.Interaction.prototype, Backbone.Events.prototype, {
	init: function() {},
	onClick: function(a, b) {
		var c = this.getAnchorElement(a);
		if (!c) return !0;
		if (this._needClickBeacon(c)) {
			var d = this._getClickBeaconEvents(c);
			this._trackBeaconEvents(c, d, b);
		}
	},
	_trackBeaconEvents: function(a, b, c) {
		var d = this.getBeaconData(a);
		_.each(b, function(a) {
			var b = a.split(",")[0],
				e = a.split(",")[1];
			Hulu.Beacon.trackStandardBeacon(b, e, d, null, c);
		});
	},
	getAnchorElement: function(a) {
		var b = $(a.target || a.srcElement);
		if (b.is("a")) return b;
		var c = b.closest("a");
		return c.length > 0 ? c : null;
	},
	_needClickBeacon: function(a) {
		return a.hasClass("beacon-click");
	},
	getBeaconData: function(a) {
		var b = {}, c = a;
		while (c) {
			var d = c.getAttributes();
			for (key in d) if (key.indexOf("beacon-attr-") == 0 && key.split("beacon-attr-").length >= 2) {
					var e = key.split("beacon-attr-")[1];
					_.has(b, e) || (b[e] = d[key]);
				}
			if (c.is("body") || c.hasClass("beacon-root")) break;
			c = c.parent();
		}
		return b;
	},
	_getClickBeaconEvents: function(a) {
		return this._getBeaconEventFromTag(a.attr("click-event-type"), Hulu.Beacon.Interaction.DefaultClickBeacon);
	},
	_getBeaconEventFromTag: function(a, b) {
		return a ? _.compact(a.split(";")) : [b];
	}
}), Hulu.Beacon.Interaction.getInstance = function() {
	return Hulu.Beacon.Interaction.__instance == null && (Hulu.Beacon.Interaction.__instance = new Hulu.Beacon.Interaction), Hulu.Beacon.Interaction.__instance;
}, Hulu.interaction = Hulu.Beacon.Interaction.getInstance(), Hulu.interaction.init(), Hulu.Beacon.Masthead = {
	trackInit: function() {
		if (Hulu.isSwapping) return;
		Hulu.Beacon.trackStandardBeacon("sitetracking", "masthead/init");
	},
	trackStart: function() {
		if (Hulu.isSwapping) return;
		Hulu.Beacon.trackStandardBeacon("sitetracking", "masthead/start");
	},
	trackItemLoad: function(a) {
		if (Hulu.isSwapping) return;
		Hulu.Beacon.trackStandardBeacon("sitetracking", "masthead/load", {
			position: a
		});
	},
	trackBannerImpression: function() {
		if (Hulu.isSwapping) return;
		Hulu.Beacon.trackStandardBeacon("revenue", "assetimpression", {
			type: "banner"
		});
	},
	trackBannerClick: function() {
		Hulu.Beacon.trackStandardBeacon("adinteraction", "click", {
			type: "banner"
		}), Hulu.Beacon.trackStandardBeacon("siteinteraction", "mastheadsponsorclick", {
			type: "banner"
		});
	}
}, window.TrackingSources = {
	getSources: function(a) {
		var b = this._loadSources(),
			c = {
				r1: b[2] || "",
				c1: b[3] || "",
				r2: b[4] || "",
				c2: b[5] || ""
			};
		return a && (c.c0 = b[1] || ""), c;
	},
	_isFirstLoad: !0,
	onLoad: function() {
		try {
			var a = this._loadSources(),
				b = "";
			this._isFirstLoad ? (b = document.referrer && document.referrer.match(/:\/\/(.[^/?]+)/) ? document.referrer.match(/:\/\/(.[^/?]+)/)[1] : null, this._isFirstLoad = !1) : b = window.location.host;
			if (!b) var c = "blank",
			d = "referral", e = null, f = null;
			else if (!b.match(/\.hulu(qa)?\.com(:[0-9]+)?$/)) {
				var e = null,
					f = null,
					g = b.match(/[^\.]+\.[^\.]+$/),
					c = g ? g[0] : b,
					d = "";
				query_params = Hulu.activeController.params.query || [], query_params["fromsearch"] == "google" ? d = "googlesem" : query_params["fromsearch"] == "yahoo" ? d = "yahoosem" : query_params["ref"] != undefined ? d = query_params.ref.substr(0, 30) : d = "referral";
			} else var c = a[0],
			d = a[1], e = a[2], f = a[3];
			var h = Hulu.Beacon.Context.getContextValue("common", "pagetype"),
				i = null;
			a = [h, i, c, d, e, f], this._saveSources(a);
		} catch (j) {
			Hulu.Utils.warn("TrackingSources.onLoad Failure");
		}
	},
	setComponent: function(a) {
		var b = this._loadSources();
		b[1] = a, this._saveSources(b);
	},
	_sources: null,
	_loadSources: function() {
		if (!this._sources) {
			var a = Cookies.getCookieByKey("HULU_RCSOURCES");
			a = a ? a.split("|") : ["", "", "", "", "", ""], this._sources = a;
		}
		return this._sources;
	},
	_saveSources: function(a) {
		this._sources = a, Cookies.setCookieByKey("HULU_RCSOURCES", a.join("|"));
	}
}, $(document).ready(function() {
	HuluRouter.Broadcaster.on(Hulu.Events.Router.BEFORE_SWAP, TrackingSources.onLoad, TrackingSources);
}), Hulu.Beacon.Publish = {
	TYPE: {
		MANUAL_SITE: "manual-site",
		MANUAL_MASTHEAD: "manual-masthead",
		LIKE: "like"
	},
	TARGET: {
		EMAIL: "email",
		FACEBOOK: "facebook",
		OTHER: "other",
		TWITTER: "twitter"
	},
	ITEM: {
		VIDEO: "video",
		SHOW: "show",
		RATING: "rating",
		OTHER: "other",
		FAVORITE: "favorite"
	},
	trackPublish: function(a, b, c, d) {
		var e = {
			publishtype: a,
			publishtarget: b
		}, f = Hulu.Beacon.Publish.ITEM.OTHER,
			g = Hulu.Utils.Url.getPageType(d || Hulu.Utils.Url.getPathName());
		g == Hulu.Utils.Url.PAGE_TYPES.watch.pageType ? f = Hulu.Beacon.Publish.ITEM.VIDEO : g == "series" ? (e.siteseriesid = Hulu.Utils.Url.getSeriesName(d || Hulu.Utils.Url.getPathName()), f = Hulu.Beacon.Publish.ITEM.SHOW) : e.sitelink = d || Hulu.Utils.Url.getHref(), Hulu.Utils.isBlank(c) || (f = c), e.publisheditem = f, Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.PUBLISH, e);
	}
}, Hulu.Beacon.Credentials = {
	ACTION: {
		LOGIN_SUCCESS: "login_success",
		LOGIN_FAILURE: "login_failure",
		EMAIL_CHANGE: "email_change",
		PASSWORD_CHANGE: "password_change"
	},
	trackCrendentials: function(a, b) {
		a && b && Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.CREDENTIALS, {
			action: a,
			euserid: b
		});
	}
}, Hulu.Beacon.PlusTrack = {
	DRIVER_TYPES: {
		PLUS_PREVIEW: "90-second",
		NAV_ELEMENT: "nav-element",
		TILE_BADGE: "tile-badge"
	},
	getPlusCommonParameters: function(a) {
		switch (a) {
			case "sessionreferrer":
				return Hulu.Behaviors.getSessionReferrer();
			case "cmpid":
				return Hulu.Behaviors.getCMPId();
			case "driverpage":
				return Hulu.Utils.Url.isInternalPage() ? Hulu.Utils.Url.getCurrentPageType() : "";
			default:
				throw new Error("invalid plus parameter " + a);
		}
	},
	getDriverParams: function() {
		var a = {
			driverpage: Cookies.getCookieByKey("PLUS_DRIVER_PAGE"),
			drivertype: Cookies.getCookieByKey("PLUS_DRIVER_TYPE"),
			driverid1: Cookies.getCookieByKey("PLUS_DRIVER_ID_1"),
			driverid2: Cookies.getCookieByKey("PLUS_DRIVER_ID_2"),
			driverid3: Cookies.getCookieByKey("PLUS_DRIVER_ID_3")
		};
		return a;
	},
	setDriverParams: function(a, b, c, d) {
		Cookies.setCookieByKey("PLUS_DRIVER_PAGE", this.getPlusCommonParameters("driverpage")), Cookies.setCookieByKey("PLUS_DRIVER_TYPE", a), Cookies.setCookieByKey("PLUS_DRIVER_ID_1", b), Cookies.setCookieByKey("PLUS_DRIVER_ID_2", c || ""), Cookies.setCookieByKey("PLUS_DRIVER_ID_3", d || "");
	},
	trackDriverLoad: function(a, b, c) {
		this.setDriverParams(a, b, c);
		var d = this.getDriverParams();
		Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.PLUS_TRACKING, Hulu.Beacon.PLUS_TRACKING_EVENTS.DRIVER_LOAD, d);
	},
	trackDriverClick: function(a, b, c) {
		this.setDriverParams(a, b, c);
		var d = this.getDriverParams();
		Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.PLUS_TRACKING, Hulu.Beacon.PLUS_TRACKING_EVENTS.DRIVER_CLICK, d, null, !0);
	},
	trackFlowBeacon: function(a) {
		var b = this.getDriverParams();
		b.landingpage = a, Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.PLUS_TRACKING, Hulu.Beacon.PLUS_TRACKING_EVENTS.FLOW, b);
	},
	trackConversionBeacon: function(a, b, c) {
		var d = this.getDriverParams();
		$.extend(d, {
			subscriberid: a,
			subscriptionid: b,
			wasregistered: c
		}), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.PLUS_TRACKING, Hulu.Beacon.PLUS_TRACKING_EVENTS.CONVERSION, d, null, !0);
	}
},
function() {
	Hulu.Beacon.UserEngagement = function() {}, Hulu.Beacon.UserEngagement.getInstance = function() {
		return Hulu.Beacon.UserEngagement.__instance == null && (Hulu.Beacon.UserEngagement.__instance = new Hulu.Beacon.UserEngagement), Hulu.Beacon.UserEngagement.__instance;
	}, _.extend(Hulu.Beacon.UserEngagement.prototype, Backbone.Events.prototype, {
		newSession: !1,
		_pageDuration: 0,
		_pageCount: 0,
		_watchPageCount: 0,
		_shortFormCount: 0,
		_shortFormDuration: 0,
		_longFormCount: 0,
		_longFormDuration: 0,
		_movieCount: 0,
		_movieDuration: 0,
		_pageStartTime: null,
		_pageEndTime: null,
		_cramNotReadyDelay: 8e3,
		_localTimeChanged: -1,
		_unKnown: -2,
		_invalid: -3,
		init: function() {
			this._resetState();
		},
		_onBeforeExit: function(a, b) {
			this.leavePage(Hulu.Utils.Url.getHref()), this.trackEngagement(a, b);
		},
		_onBeforeEnter: function() {
			Hulu.Behaviors.getSiteSessionId(), this.newSession && (this.trackSessionStart(), this._resetState(), this.newSession = !1), Hulu.Comscore.track(), this.enterPage(Hulu.Utils.Url.getHref());
		},
		_getUserEngagement: function(a) {
			if (cram && cram.hasLoaded()) {
				var b = window.$.client.browser.split(" ").join("_"),
					c = window.$.client.version.toString().split(" ").join("_");
				return cram.get(b + "_" + c + a);
			}
			return null;
		},
		_setUserEngagement: function(a, b) {
			if (cram && cram.hasLoaded()) {
				var c = window.$.client.browser.split(" ").join("_"),
					d = window.$.client.version.toString().split(" ").join("_");
				cram.setAfterLoaded(c + "_" + d + a, b);
			}
		},
		trackSessionStart: function() {
			var a = Cookies.getCookieByKey("USER_ENGAGEMENT"),
				b = new Date,
				c = this._unKnown;
			if (!_.isNull(a) && parseInt(a) > 0) {
				var d = new Date(a * 1e3),
					e = b - d;
				if (e > 0) {
					var f = Math.round(e / 1e3);
					c = Math.round(f / 3600);
				} else c = this._localTimeChanged;
			} else _.isNull(a) ? c = this._unKnown : c = this._invalid;
			Cookies.setCookieByKey("USER_ENGAGEMENT", Math.round(b.getTime() / 1e3)), Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.SITE_TRACKING, Hulu.Beacon.SITE_EVENTS.SESSION_STARTUP, {
				frequency: c
			});
		},
		trackEngagement: function(a, b) {
			var c = Hulu.Behaviors.getComputerGUID();
			Hulu.Beacon.trackStandardBeacon(Hulu.Beacon.TYPES.ENGAGEMENT, Hulu.Beacon.SITE_EVENTS.ENGAGEMENT_BROWSE, {
				duration: this._pageDuration,
				pagecount: this._pageCount,
				watchpagecount: this._watchPageCount,
				shortformcount: this._shortFormCount,
				shortformduration: this._shortFormDuration,
				longformcount: this._longFormCount,
				longformduration: this._longFormDuration,
				moviecount: this._movieCount,
				movieduration: this._movieDuration,
				leave: b,
				type: Hulu.router.isFirstLoad ? "firstload" : "swap",
				swapping: Hulu.isSwapping
			}, null, a), this._resetState();
		},
		userInteract: function() {
			_.isNull(this._pageStartTime) || this.updatePageDuration();
		},
		enterPage: function(a) {
			this._pageStartTime = new Date, this._pageEndTime = null, this._pageCount += 1, Hulu.Utils.isWatchPage() && (this._watchPageCount += 1);
		},
		updatePageDuration: function() {
			this._pageEndTime = new Date;
			if (!_.isNull(this._pageStartTime)) {
				var a = Math.round((this._pageEndTime.getTime() - this._pageStartTime.getTime()) / 1e3);
				a > 0 && (a >= 600 && (a = 600), this._pageDuration += a);
			}
			this._pageStartTime = new Date;
		},
		leavePage: function(a) {
			this.updatePageDuration(), this._pageStartTime = null;
		},
		startWatchVideo: function(a, b, c) {
			var d = Hulu.Utils.Models.Video.getVideoGroup(c);
			d == "movie" ? this._movieCount += 1 : Hulu.Utils.Models.Video.isShortForm(c, b) ? this._shortFormCount += 1 : this._longFormCount += 1, this.updatePageDuration();
		},
		watchVideo: function(a, b, c, d) {
			if (b <= 0 || c <= 0) return;
			var e = Hulu.Utils.Models.Video.getVideoGroup(d);
			e == "movie" ? this._movieDuration += c : Hulu.Utils.Models.Video.isShortForm(d, b) ? this._shortFormDuration += c : this._longFormDuration += c, this.updatePageDuration();
		},
		_resetState: function() {
			this._pageCount = 0, this._pageDuration = 0, this._watchPageCount = 0, this._shortFormCount = 0, this._shortFormDuration = 0, this._longFormCount = 0, this._longFormDuration = 0, this._movieCount = 0, this._movieDuration = 0;
		}
	}), Hulu.userEngagement = Hulu.Beacon.UserEngagement.getInstance(), Hulu.userEngagement.init();
	var a = function() {
		Hulu.userEngagement._onBeforeExit(!0, !0);
	};
	$(window).bind("beforeunload", a), HuluRouter.Broadcaster.on(Hulu.Events.Router.BEFORE_NAVIGATE, function(b) {
		b.refresh && $(window).unbind("beforeunload", a), Hulu.userEngagement._onBeforeExit(b.refresh, !1);
	}), HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, function() {
		Hulu.userEngagement._onBeforeEnter();
	});
}.call(this), Hulu.MozartBatchApi = {
	ONE_SECOND: 1e3,
	MIN_WAITING_TIME: 1e3,
	MAX_WAITING_TIME: 3e4,
	MAX_RETRY_TIMES: 3,
	ERROR_CODE_TIMEOUT: 408,
	fetch: function(a, b, c) {
		var d = this._getFormattedRequestBody(a),
			e = [];
		this._request(d, e, b, c, 0);
	},
	_request: function(a, b, c, d, e) {
		var f = this,
			g = function(g, h, i) {
				if (c) if (g && g instanceof Array && g.length == a.length) {
						var j = !1;
						_.each(g, function(c) {
							var d = c.id;
							c.http_status != f.ERROR_CODE_TIMEOUT || !! b[d] && b[d].http_status != f.ERROR_CODE_TIMEOUT ? (c = f.processCollectionResponse(c), b[d] = c, a = _.reject(a, function(a) {
								return a.id == d;
							})) : (b[d] = {
								http_status: f.ERROR_CODE_TIMEOUT,
								data: [],
								total_count: -1
							}, j = !0);
						}), j ? ++e <= f.MAX_RETRY_TIMES ? setTimeout(function() {
							f._request(a, b, c, d, e);
						}, Hulu.Utils.Math.boundedNumber(f.MIN_WAITING_TIME, f.MAX_WAITING_TIME, f.ONE_SECOND << e)) : c(b) : c(b);
					} else d && d(i, h);
			}, h = function(a, b) {
				d && d(a, b);
			};
		return this.getFetchProxy().post("/mozart/batch", $.toJSON(a), {
			contentType: "application/json"
		}).done(g).fail(h);
	},
	getFetchProxy: function() {
		return Hulu.Collections.JsonResource;
	},
	_getFormattedRequestBody: function(a) {
		var b = [],
			c = 0;
		return _.each(a, function(a) {
			b[c] = {
				id: c++,
				method: "GET",
				relative_url: a
			};
		}), b;
	},
	processCollectionResponse: function(a) {
		if (a.http_status != 200) a.data = [], a.total_count = -1;
		else {
			try {
				a = $.parseJSON(a.body);
			} catch (b) {
				return a = {
					http_status: 500,
					data: [],
					total_count: -1
				}, a;
			}
			a.http_status = 200, a.total_count = a.data.length;
			for (var c = 0; c < a.total_count; c++) a.data[c] = Hulu.Collections.JsonResource.mapToModel(a.data[c]);
		}
		return a;
	}
}, Hulu.SearchTool = {
	getDidYouMean: function(a, b) {
		Hulu.Collections.JsonResource.get("sapi/search/didyoumean", {
			query: a,
			region: Hulu.Configuration.region(),
			language: Hulu.Configuration.language()
		}, {
			dataType: "text"
		}).done(function(c) {
			b(c, a);
		}).fail(function() {
			b("", a);
		});
	},
	getOffsiteSmartStart: function(a, b) {
		Hulu.Collections.JsonResource.get("sapi/search/offsmart", _.extend({
			region: Hulu.Configuration.region(),
			language: Hulu.Configuration.language()
		}, a)).done(function(a) {
			try {
				var c = a.data[0].offsite_video,
					d = new Hulu.Models.OffsiteVideo(c);
				b && b(d);
			} catch (e) {}
		}).fail(function() {
			b && b(null);
		});
	},
	getRelatedSearch: function(a, b) {
		Hulu.Collections.JsonResource.get("sapi/search/related", {
			query: a,
			region: Hulu.Configuration.region(),
			language: Hulu.Configuration.language()
		}, {
			dataType: "text"
		}).done(function(a) {
			b(a);
		}).fail(function() {
			b("");
		});
	}
},
function() {
	Hulu.GA = {
		trackPageview: function(a) {
			var b = Hulu.Utils.isBlank(a) ? Hulu.Utils.Url.getPathName() + Hulu.Utils.Url.getSearch() : a;
			typeof _gaq != "undefined" && _gaq && _gaq.push(["_trackPageview", b]);
		},
		trackEvent: function(a, b, c, d, e) {
			typeof _gaq != "undefined" && _gaq && _gaq.push(["_trackEvent", a, b, c, d, e]);
		},
		trackDataLoad: function(a, b, c, d) {
			this._trackTiming(a, b, c, d, "Dataload");
		},
		trackPerf: function(a, b, c, d) {
			this._trackTiming(a, b, c, d, "Performance");
		},
		_trackTiming: function(a, b, c, d, e) {
			if (typeof _gaq != "undefined" && _gaq && a && b > 0 && c > 0 && b < c && c - b < 12e4) {
				var f = Hulu.Configuration.isProduction() ? 30 : 100;
				_gaq.push(["_trackTiming", e, a, c - b, d, f]);
			}
		},
		setCustomVariable: function(a, b, c, d) {
			var e = ["_setCustomVar", a, b, c];
			d && e.push(d), typeof _gaq != "undefined" && _gaq && _gaq.push(e);
		},
		EVENTS: {
			FB_CONNECT: "fbconnect",
			SOCIAL_SHARE: "socialshare",
			CRITICAL_ERROR: "critical_error",
			SIGNUP: Hulu.Configuration.region() == "jp" ? "newsignup" : "signup"
		}
	};
}.call(this), HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, function() {
	if (Hulu.Utils.Url.getCurrentPageType() == "watch") {
		var a = Hulu.Utils.Url.getPathName(),
			b = Hulu.Utils.Url.getWatchId(a),
			c = Hulu.Context.findOne("VIDEO", b);
		c && c.show && !Hulu.Utils.isBlank(c.show.canonicalName) && (a = "/watch/" + c.show.canonicalName + "/" + b), a += Hulu.Utils.Url.getSearch(), Hulu.GA.trackPageview(a);
	} else Hulu.Utils.Url.isSignupPage() ? /^\/thanks/.test(Hulu.Utils.Url.getPathName()) ? Hulu.Behaviors.isSubscriber() ? Hulu.GA.trackPageview("/signup/plus/thanks" + Hulu.Utils.Url.getSearch()) : Hulu.GA.trackPageview("/signup/upgrade" + Hulu.Utils.Url.getSearch()) : Hulu.Behaviors.isLoggedIn() ? Hulu.GA.trackPageview("/signup/plus/payment" + Hulu.Utils.Url.getSearch()) : Hulu.GA.trackPageview("/signup" + Hulu.Utils.Url.getSearch()) : Hulu.GA.trackPageview();
}),
function() {
	Hulu.Affiliate = {
		set_cookies: function() {
			var a = Hulu.Utils.Url.getSearch().replace(/^\?/, ""),
				b = Hulu.Utils.Url.parseQueryString(a),
				c = b.partner,
				d = b.cmp;
			d && /^[0-9]+$/.test(d) && (Cookies.setCookieByKey("HULU_PLUS_CMP", d), Cookies.setCookieByKey("HULU_PLUS_CMP_URL", Hulu.Utils.Url.getHref()));
			if (c) {
				Cookies.setCookieByKey("HULU_PLUS_AFFILIATE", c);
				var e = null;
				c == "cj" ? e = [b.AID, b.PID, b.SHID].join("|") : c == "trialpay" ? e = [b.pubid, b.subid].join("|") : c == "yidio" ? e = b.aid : c == "tapjoy" && (e = b.sid), e && Cookies.setCookieByKey("PARTNER_PRODUCT", e);
			}
		},
		setJPAffiliateCMP: function(a, b) {
			if (Hulu.Behaviors.isLoggedIn()) return;
			if (!b && (!a || !a.from)) {
				a && a.f1 && Cookies.setCookieByKey("HULU_F1", a.f1, {
					sessionOnly: !0
				});
				return;
			}
			b ? Cookies.setCookieByKey("HULU_JP_CMP", b) : Cookies.eraseCookieByKey("HULU_JP_CMP");
			if (!a || !a.from) Cookies.eraseCookieByKey("HULU_FROM_FOR_SIGNUP");
			else if (a && a.from) if (a.expires_in > 0) {
					var c = a.expires_in * 24 * 3600;
					Cookies.setCookieByKey("HULU_FROM_FOR_SIGNUP", a.from, {
						seconds: c
					});
				} else Cookies.setCookieByKey("HULU_FROM_FOR_SIGNUP", a.from, {
						sessionOnly: !0
					});
				else a && a.f1 && Cookies.setCookieByKey("HULU_F1", a.f1, {
						sessionOnly: !0
					});
		}
	};
}.call(this), $(document).ready(function() {
	Hulu.Affiliate.set_cookies();
}),
function() {
	Hulu.CdnTest = {
		timeout_id: 0,
		tests_run: 0,
		CDNS: ["Akamai", "Level3", "Edgecast", "Limelight"],
		IMAGES: [{
				name: "128KB.png",
				bytes: 131073
			}, {
				name: "256KB.png",
				bytes: 262105
			}, {
				name: "512KB.png",
				bytes: 524319
			}, {
				name: "1MB.png",
				bytes: 1048637
			}, {
				name: "10MB.png",
				bytes: 10520142
			}
		],
		BEACON_VERSION: 2,
		test_urls: null,
		download_times: null,
		start_test_timer: function() {
			if (Math.random() > .05) return;
			Hulu.CdnTest.timeout_id > 0 && (clearTimeout(Hulu.CdnTest.timeout_id), Hulu.CdnTest.timeout_id = 0), !Hulu.Utils.isWatchPage() && !Hulu.Utils.Url.isSecurePage() && (Hulu.CdnTest.timeout_id = setTimeout(Hulu.CdnTest.measure_cdn_bandwidth, 18e5));
		},
		send_beacon: function() {
			$.ajax({
				url: "/_qos/cdn_test",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(Hulu.CdnTest.download_times)
			}).fail(function() {
				Hulu.Utils.warn("qos/cdn_test post error");
			});
		},
		measure_image_load_time: function(a, b) {
			var c, d = 0,
				e = !1;
			if (a >= Hulu.CdnTest.CDNS.length) {
				Hulu.CdnTest.send_beacon();
				return;
			}
			var f = Hulu.CdnTest.CDNS[a],
				g = Hulu.CdnTest.IMAGES[b].name,
				h = Hulu.CdnTest.test_urls[f][g],
				i = function() {
					clearTimeout(d);
					var f = (new Date).getTime() - c;
					f > 1e4 || b + 1 >= Hulu.CdnTest.IMAGES.length ? (Hulu.CdnTest.download_times[Hulu.CdnTest.CDNS[a]] = {
						bytes: Hulu.CdnTest.IMAGES[b].bytes,
						kbps: Math.round(Hulu.CdnTest.IMAGES[b].bytes / f)
					}, e || Hulu.CdnTest.measure_image_load_time(a + 1, 0)) : e || Hulu.CdnTest.measure_image_load_time(a, b + 1);
				}, j = function() {
					e = !0, Hulu.CdnTest.download_times[Hulu.CdnTest.CDNS[a]] = {
						bytes: Hulu.CdnTest.IMAGES[b].bytes,
						kbps: 0
					}, Hulu.CdnTest.measure_image_load_time(a + 1, 0);
				};
			c = (new Date).getTime(), $("<img>", {
				src: h
			}).load(i), d = setTimeout(j, 6e4);
		},
		measure_cdn_bandwidth: function() {
			Hulu.CdnTest.download_times = {
				v: Hulu.CdnTest.BEACON_VERSION
			};
			for (var a = Hulu.CdnTest.CDNS.length - 1; a > 0; a--) {
				var b = Math.floor(Math.random() * (a + 1)),
					c = Hulu.CdnTest.CDNS[b];
				Hulu.CdnTest.CDNS[b] = Hulu.CdnTest.CDNS[a], Hulu.CdnTest.CDNS[a] = c;
			}
			$.ajax({
				url: "/api/2.0/cdn_test_urls",
				type: "GET"
			}).success(function(a) {
				if (!a || typeof a != "object") return;
				var b = !0;
				$.each(Hulu.CdnTest.CDNS, function(c) {
					b = b && Hulu.CdnTest.CDNS[c] in a;
				});
				if (!b) return;
				Hulu.CdnTest.test_urls = a, Hulu.CdnTest.measure_image_load_time(0, 0);
			}).fail(function() {
				Hulu.Utils.warn("/api/2.0/cdn_test_urls get error");
			}), Hulu.CdnTest.tests_run += 1, Hulu.CdnTest.tests_run < 24 && (Hulu.CdnTest.timeout_id = setTimeout(Hulu.CdnTest.measure_cdn_bandwidth, 36e5));
		}
	};
}.call(this), !Hulu.Configuration.isPlusprod() && Hulu.Configuration.region() != "jp" && HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, Hulu.CdnTest.start_test_timer),
function() {
	Hulu.Comscore = {
		parameters: {
			c1: "2",
			c2: "3000007",
			c3: "3000007",
			c4: function() {
				return Hulu.Utils.Url.getHref().replace(/https?:\/\/(www.)?/, "");
			},
			c5: null,
			c6: null,
			c7: function() {
				return Hulu.Utils.Url.getHref();
			},
			c8: function() {
				return document.title;
			},
			c9: function() {
				return Hulu.getReferrer();
			},
			c10: function() {
				return [screen.width, screen.height].join("x");
			},
			c15: "",
			rn: function() {
				return (new Date).getTime();
			}
		},
		baseURL: "http://beacon.scorecardresearch.com/scripts/beacon.dll",
		update: function(a) {
			a.baseURL && (Hulu.Comscore.baseURL = a.baseURL, delete a.baseURL), Hulu.Comscore.parameters = Object.extend(Hulu.Comscore.parameters, a);
		},
		track: function() {
			var a = Hulu.Comscore.baseURL;
			/^https:/.test(Hulu.Utils.Url.getHref()) && (a = a.replace(/^http/, "https"));
			var b = [];
			_.each(_.keys(Hulu.Comscore.parameters), function(a) {
				var c = Hulu.Comscore.parameters[a];
				if (typeof c == "function") try {
						c = c.call();
				} catch (d) {
					c = "";
				}
				c == null && (c = ""), b.push([a, encodeURIComponent(c)].join("="));
			}), a = [a, b.join("&")].join("?"), Hulu.Utils.pingImage(a);
		}
	};
}(),
function() {
	Hulu.GDN = {
		loadInIframe: function(a, b) {
			var c = document.createElement("iframe");
			c.style.width = "0px", c.style.height = "0px", c.style.visibility = "hidden", a.append(c);
			var d = null;
			c.contentDocument ? d = c.contentDocument : c.contentWindow && c.contentWindow.document && (d = c.contentWindow.document);
			if (d == null) return;
			d.open().write(b), d.close();
		},
		trackConversion: function() {
			try {
				if (Hulu.Controls.MobileDevice.isMobile) return;
				var a = Hulu.Utils.renderTemplate("shared/gdn"),
					b = $("#gdn-container");
				if (b.length == 0) return;
				b.empty(), Hulu.GDN.loadInIframe(b, a);
			} catch (c) {
				Hulu.Utils.warn(c);
			}
		}
	};
}.call(this), !Hulu.Configuration.isPlusprod() && Hulu.Configuration.region() != "jp" && HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, Hulu.GDN.trackConversion),
function() {
	Hulu.SignupUrl = {
		init: function() {
			var a = Cookies.getCookieByKey("HULU_SIGNUP_URL");
			a || (a = document.referrer || document.location.href, Cookies.setCookieByKey("HULU_SIGNUP_URL", a));
		}
	};
}.call(this),
function() {
	var a = function(a) {
		return a != null && typeof a == "string" && a !== "";
	}, b = function(a, b) {
			if (a != b) {
				if (!(b instanceof Array)) return !1;
				if (b.length != a.length) return !1;
				for (var c = 0; c < b.length; c++) if (b[c] != a[c]) return !1;
			}
			return !0;
		}, c = function(a, b) {
			if (typeof a == "string") {
				if (!b.hasOwnProperty(a)) throw new Error("Hulu.Context: " + a + " is not defined on the given item");
				return b[a];
			}
			var c = b[a[0]].toString();
			for (var d = 1; d < a.length; d++) {
				if (!b.hasOwnProperty(a[d])) throw new Error("Hulu.Context: " + a[d] + " is not defined on the given item");
				c += "," + b[a[d]].toString();
			}
			return c;
		}, d = function(a, b) {
			var c = undefined;
			return a != null && (c = a.data, b && (a.touchedAt = (new Date).getTime())), c;
		}, e = function(a, b, c) {
			var d = 0,
				e = a.length - 1;
			while (d <= e) {
				var f = Math.floor((d + e) / 2),
					g = a[f][c];
				if (b < g) e = f - 1;
				else {
					if (!(b > g)) return f + 1;
					d = f + 1;
				}
			}
			return d;
		};
	Hulu.Context = {
		TABLE_EXISTED: "Table existed with different keys!",
		_tables: {},
		_getTable: function(a) {
			return this._tables[a];
		},
		registerType: function(c, d, e) {
			if (!a(c)) throw new Error("The type must be a non-empty string");
			var f = !0;
			if (d != null) if (d instanceof Array) {
					var g = d.length;
					if (g == 0) f = !1;
					else for (var h = 0; h < g; h++) {
							f = a(d);
							if (!f) break;
					}
				} else a(d) && (f = !1);
			if (f) throw new Error("The keys must be a non-empty string or array of non-empty strings");
			var i = this._tables[c];
			if (i != null) {
				if (!b(i.keys, d)) throw this.TABLE_EXISTED;
			} else i = {
					keys: d,
					data: {},
					length: 0,
					size: -1
			}, this._tables[c] = i;
			if (e != null) {
				parseInt(e.size) > 0 && (i.size = parseInt(e.size));
				if (e.modelClass != null) {
					if (!(e.modelClass instanceof Function && e.modelClass.__super__ != null && e.modelClass.__super__.constructor == Hulu.Models.Base)) throw new Error("modelClass must be sub class of Hulu.Model.Base");
					i.modelClass = e.modelClass;
				}
			}
		},
		isTypeRegistered: function(a) {
			return this._tables.hasOwnProperty(a);
		},
		findOne: function(a, b) {
			if (!this.isTypeRegistered(a)) throw new Error("Must register table before save to context");
			if (b == null) throw new Error("options cannot be null!");
			var c = null,
				e = this._getTable(a),
				f = e.data;
			if (typeof b == "string" || typeof b == "number" || b instanceof Array) c = d(f[b.toString()], !0);
			else {
				if (e.modelClass != null) for (var g in b) {
						var h = Hulu.Utils.Str.decamelize(g, "_");
						h != g && (b[h] = b[g], delete b[g]);
				}
				var i = _.find(f, function(a) {
					var c = !0,
						e = d(a);
					for (var f in b) c = c && e[f] == b[f];
					return c;
				});
				c = d(i, !0);
			}
			return c != null && e.modelClass != null && (c = new e.modelClass(c)), c;
		},
		save: function(a, b, d) {
			var e = d == null || d.overwrite == null || d.overwrite,
				f = this._validate(a, b);
			if (f) {
				var g = f.table;
				b = f.data;
				var h = c(g.keys, b);
				return this._saveData(g, b, h, e);
			}
		},
		remove: function(a, b) {
			var d = this._validate(a, b);
			if (d) {
				var e = d.table;
				b = d.data;
				var f = c(e.keys, b);
				return this._removeData(e, b, f);
			}
		},
		clean: function() {
			for (var a in this._tables) delete this._tables[a].data, this._tables[a].data = {};
		},
		_validate: function(a, b) {
			if (a == null || b == null) throw new Error("type and data cannot be null!");
			if (!this.isTypeRegistered(a)) throw new Error("Must register table before save to context");
			var c = this._getTable(a);
			if (c.modelClass != null) {
				var d = b;
				if (b instanceof Hulu.Models.Base) {
					if (!(b instanceof c.modelClass)) throw new Error("Saved data is not the type of registered model class!");
				} else Hulu.Utils.warn("Hulu.Context convert a non model object of " + a + " to corresponding model"), d = new c.modelClass(b);
				b = d.getAttributesForContextSaving();
			}
			return {
				table: c,
				data: b
			};
		},
		_removeData: function(a, b, c) {
			var d = a.data.hasOwnProperty(c);
			return d ? delete a.data[c] : !1;
		},
		_saveData: function(a, b, c, d) {
			var f = a.data.hasOwnProperty(c);
			f && !d ? a.data[c].touchedAt = (new Date).getTime() : a.data[c] = {
				data: b,
				touchedAt: (new Date).getTime()
			};
			if (f) return d;
			a.length++;
			if (a.size > 0 && a.length > a.size) {
				var g = [];
				for (var h in a.data) {
					var i = {
						key: h,
						touchedAt: a.data[h].touchedAt
					}, j = e(g, i.touchedAt, "touchedAt");
					g.splice(j, 0, i);
				}
				var k = Math.floor(g.length / 2);
				for (var l = k - 1; l >= 0; l--) delete a.data[g[l].key];
				a.length -= k;
			}
			return !0;
		}
	}, _.bindAll(Hulu.Context);
}.call(this), Hulu.Error = {
	Types: {
		SITE: "site",
		PLAYER: "player",
		DONUT: "donut"
	},
	SubTypes: {
		JAVASCRIPT: "javascript",
		AJAX: "ajax",
		ACTIONSCRIPT: "actionscript"
	},
	Severity: {
		LOW: "LOW",
		MEDIUM: "MEDIUM",
		HIGH: "HIGH"
	}
}, Hulu.Error.postAjaxError = function(a, b, c) {}, Hulu.Error.proxy = $.proxy, Hulu.Error.postError = function(a) {}, Hulu.Error.postScriptError = function(a, b) {}, Hulu.Error.trace = function(a, b, c) {},
function() {
	var a = function(a) {
		a = parseFloat(a);
		if (!isNaN(a) && a > 0) {
			var b = Hulu.Behaviors.getComputerGUID(),
				c = parseInt(b.substr(24), 16);
			if (c % 1e6 < a * 1e6) return !0;
		}
		return !1;
	}, b = parseFloat(Cookies.getCookieByKey("HULU_ERROR_SAMPLE_RATE"));
	isNaN(b) && (b = window.errorLogSampleRate ? window.errorLogSampleRate.sampleRate || 0 : 0);
	var c = !0;
	if (!a(b)) {
		c = !1;
		return;
	}
	Hulu.Error.postAjaxError = function(a, b, c) {
		if (b != null && a != null) {
			c = c != null ? c : "";
			var d = Hulu.Utils.Str.format("{0}:\nAJAX error: status {1} {2}, type {3}, url {4}", c, b.status, b.statusText, a.type, a.url),
				e = null;
			b.__stackTrace != null && (e = "The AJAX request is fired at:\n" + b.__stackTrace.join("\n"));
			var f = null,
				g = null;
			typeof a != "undefined" && (f = typeof a.url != "undefined" ? a.url : null, g = typeof a.type != "undefined" ? a.type : null);
			if (Hulu.Constants.DOPPLER_URLS.regex.exec(f) != null) return;
			var h = null,
				i = null;
			typeof b != "undefined" && (h = typeof b.status != "undefined" ? b.status : null, i = typeof b.statusText != "undefined" ? b.statusText : null), Hulu.Error.postError({
				type: Hulu.Error.Types.SITE,
				subType: Hulu.Error.SubTypes.AJAX,
				message: d,
				stackTrace: e,
				internalReceiver: "Hulu.Error.postAjaxError",
				details: {
					ajaxRequestURL: f,
					ajaxRequestType: g,
					ajaxStatus: h,
					ajaxStatusText: i
				}
			});
		}
	};
	var d = !($.browser.webkit && !window.chrome || $.browser.msie),
		e = !1,
		f = function(a, b) {
			if (a == null || a._posted) return;
			var c = a.toString();
			b != null && b != "" && (c = b + "\n" + c);
			var d = printStackTrace({
				e: a,
				guess: !0
			});
			d != null && (d = d.join("\n"));
			try {
				a._posted = !0;
			} catch (e) {}
			Hulu.Error.postError({
				type: Hulu.Error.Types.SITE,
				subType: Hulu.Error.SubTypes.JAVASCRIPT,
				message: c,
				stackTrace: d,
				internalReceiver: "logError"
			});
		}, g = function(a) {
			if (a == null) return !1;
			var b = ["uncaught error: can't load xregexp twice in the same frame", "setreturnvalue", "originalCreateNotification", "schema_generated_bindings", "miscellaneous_bindings", "conduitPage", /chrome:\/\//i, "http://www.superfish.com/", "http://www.google-analytics.com/ga.js", "_leaflycbfunc", /C:\/Users\//, "http://www.hulu.com/PIE.htc"];
			if (a.message != null && Hulu.Utils.isStringMatchPatterns(b, a.message.toString(), !0)) return !0;
			var c = ["http://www.superfish.com/", "http://www.google-analytics.com/ga.js", "http://s.hulu.com/gc", /^chrome:\/\//i, /^resource:\/\//i, /C:\/Users\//, /Users\/owner\//];
			return a.details != null && a.details.windowOnErrorURL != null && Hulu.Utils.isStringMatchPatterns(c, a.details.windowOnErrorURL.toString(), !0);
		}, h = !1,
		i = function(a) {
			return a != null && a.details != null && a.details.windowOnErrorMessage != null && a.details.windowOnErrorMessage.toString().toLowerCase() === "script error." && (a.details.windowOnErrorURL == null || a.details.windowOnErrorURL === "") && a.details.windowOnErrorLineNumber === 0;
		}, j = 5,
		k = 600,
		l = [],
		m = function() {
			var a = (new Date).getTime() - k * 1e3;
			while (l.length > 0 && l[0] < a) l.shift();
			return l.length >= j;
		};
	Hulu.Error.postError = function(b) {
		if (b == null) return;
		if (!c) return;
		if (i(b)) {
			if (h) return;
			h = !0;
		}
		if (m()) return;
		l.push((new Date).getTime());
		var d = "";
		d += window.jsLoaded.application ? "" : "application.js ", d += window.jsLoaded.applicationCore ? "" : "application_core.js ", d += window.jsLoaded.applicationFrameWork ? "" : "application_framework.js ", d += window.JST ? "" : "templates.js ", d += window.LoadPlayer ? "" : "load_player_h2o.js ", d += window.FB ? "" : "facebook";
		var e = Hulu.Beacon.getCommonParams();
		$.extend(e, {
			jqueryVersion: $.fn.jquery,
			playerVersion: _.values(deconcept.SWFObjectUtil.getPlayerVersion()).join("."),
			jsMissing: d,
			isCrawler: Hulu.Utils.Env.isCrawler()
		}), d && $.extend(b, {
			classification: "javascript_missing",
			severity: Hulu.Error.Severity.LOW
		});
		if (!Hulu.Configuration.isDevelopment() && !g(b)) {
			var f;
			Hulu.Configuration.region() == "jp" ? f = "jp" : Hulu.Configuration.isSmoke() ? f = "smoke" : f = "";
			var j = Hulu.Constants.DOPPLER_URLS.ingest;
			f != "" && (j += (/\?/.test(j) ? "&" : "?") + "source=" + f), $.ajax({
				type: "POST",
				url: j,
				data: {
					context: JSON.stringify(e),
					error: JSON.stringify(b)
				}
			}).fail(function() {
				Hulu.Utils.warn("Error log service should not fail!");
			}).done(function(b) {
				if (b != null && b["sampleRate"] != null) {
					var d = parseFloat(b.sampleRate);
					c = !isNaN(d) && a(d), isNaN(d) || Cookies.setCookieByKey("HULU_ERROR_SAMPLE_RATE", d);
				}
			});
		}
	}, Hulu.Error.trace = function(a, b, c) {
		Hulu.Error.postError({
			type: Hulu.Error.Types.SITE,
			subType: Hulu.Error.SubTypes.JAVASCRIPT,
			message: a,
			internalReceiver: "trace",
			classification: b,
			severity: Hulu.Error.Severity.LOW,
			details: c
		});
	}, Hulu.Error.postScriptError = function(a, b) {
		f(a, b);
	};
	if (d) {
		Hulu.Error.proxy = function(a, b) {
			return function() {
				b == null && (b = this);
				try {
					a.apply(b, arguments);
				} catch (c) {
					throw e || f(c), e = !0, c;
				}
			};
		};
		var n = window.setTimeout;
		window.setTimeout = function(a, b) {
			var c = a;
			return a instanceof Function && (c = Hulu.Error.proxy(a)), n.apply(this, [c].concat(_.rest(arguments)));
		};
		var o = $.fn.on;
		$.fn.on = function(a, b, c, d, e) {
			if (typeof a != "object") {
				var f = Array.prototype.slice.call(arguments),
					g = -1;
				return c == null && d == null ? g = 1 : d == null ? g = 2 : g = 3, g >= 0 && (f[g] = Hulu.Error.proxy(f[g])), o.apply(this, arguments);
			}
			return o.apply(this, arguments);
		};
		var p = $.fn.ready;
		$.fn.ready = function(a) {
			return a instanceof Function && (a = Hulu.Error.proxy(a)), p.call(this, a);
		};
	} else window.printStackTrace = function() {
			return null;
	};
	window.onerror = function(a, b, c) {
		typeof $ == "undefined" && ($ = jQuery);
		if (!e) {
			try {
				a instanceof ErrorEvent ? (b = a.filename, c = a.lineno, a = "ErrorEvent: " + a.message) : a instanceof Event && (a = "Event: " + a.type);
			} catch (d) {}
			Hulu.Error.postError({
				type: Hulu.Error.Types.SITE,
				subType: Hulu.Error.SubTypes.JAVASCRIPT,
				message: Hulu.Utils.Str.format("{0}; at: {1}, {2}", a, b, c),
				internalReceiver: "window.onerror",
				details: {
					windowOnErrorMessage: a,
					windowOnErrorURL: b,
					windowOnErrorLineNumber: c
				}
			});
		}
		e = !1;
	}, $(document).ajaxError(function(a, b, c, d) {
		!b.__failHandled && c.async && Hulu.Error.postAjaxError(c, b, "Unhandled AJAX error");
	}), $.ajaxSettings.error === undefined && ($.ajaxSettings.error = null);
	var q = $.ajax;
	$.ajax = function() {
		var a = q.apply(this, arguments),
			b = a.done,
			c = a.fail;
		return a.done = function(a) {
			if (arguments.length > 1) throw new ArgumentError("doneCallback", "deferred.done() only support one callback for now!");
			var c = a;
			return a != null && d && (a instanceof Function ? c = Hulu.Error.proxy(a, this) : Hulu.Utils.warn(".done() should get a function as callback")), b.call(this, c);
		}, a.fail = function() {
			return a.__failHandled = !0, c.apply(this, arguments);
		}, a.__failHandled = !1, a.__stackTrace = printStackTrace({
			guess: !1
		}), a;
	};
}.call(this),
function() {
	Hulu.GlobalHandler = {
		_hash: {},
		register: function(a, b, c) {
			this._hash[a] || (this._hash[a] = {
				handlers: []
			}, Hulu.Dispatcher.on(a, this._handlerMaster, this._hash[a])), this._addHandler(a, b, c);
		},
		unregister: function(a, b) {
			var c = this._findHandler(a, b);
			c && (this._hash[a].handlers = _.without(this._hash[a].handlers, c), this._checkHandlers(a));
		},
		unregisterOneoffHandlers: function(a) {
			var b = this._hash[a];
			if (b) {
				var c = _.filter(b.handlers, function(a) {
					return a.isOneOff;
				});
				_.each(c, function(b) {
					this.unregister(a, b.callback);
				}, this);
			}
		},
		clear: function() {
			Hulu.Dispatcher.off(null, this._handlerMaster), this._hash = {};
		},
		_findHandler: function(a, b) {
			var c = this._hash[a],
				d = null;
			return c && (d = _.find(c.handlers, function(a) {
				return a.callback == b;
			})), d;
		},
		_addHandler: function(a, b, c) {
			if (!this._findHandler(a, b)) {
				var d = this._hash[a],
					e = !0;
				c && c.isOneOff === !1 && (e = !1), d.handlers.push(_.extend({
					callback: b
				}, {
					isOneOff: e
				})), d.eventName = a;
			}
		},
		_handlerMaster: function() {
			var a = arguments;
			_.each(this.handlers, function(b, c) {
				b.callback instanceof Function && b.callback.apply(this, a), b.isOneOff && (this.handlers[c] = null);
			}, this), this.handlers = _.compact(this.handlers), Hulu.GlobalHandler._checkHandlers(this.eventName);
		},
		_checkHandlers: function(a) {
			var b = this._hash[a];
			b && _.isEmpty(b.handlers) && (Hulu.Dispatcher.off(a, this._handlerMaster, b), this._hash[a] = null, this._hash = _.compact(this._hash));
		}
	};
}.call(this),
function() {
	Hulu.Donut = {
		allocations: null,
		assignments: [],
		experiments: null,
		picker_flight: null,
		REFRESH_INTERVAL: 18e5,
		initialize: function() {
			window.donutAllocations == null ? Hulu.Donut.fetchAssignments() : (Hulu.Donut.allocations = window.donutAllocations, Hulu.Donut.generateAssignmentsFromAllocations());
		},
		update: function() {
			Hulu.Donut.fetchAssignments();
		},
		fetchAssignments: function(a, b) {
			a || (a = function() {}), b || (b = function() {});
			var c = {
				guid: Hulu.Behaviors.getComputerGUID(),
				scope_name: Hulu.Constants.DONUT_SCOPE,
				cb: (new Date).getTime()
			}, d = Hulu.Behaviors.getUserId();
			d > 0 && (c.user_id = d), Hulu.Collections.JsonResource.get("/donut/assign", c).done(function(b) {
				Hulu.Donut.assignments = [], _.each(b, function(a, b) {
					Hulu.Donut.assignments.push(a);
				}), a();
			}).fail(function(a) {
				Hulu.Error.postError({
					type: Hulu.Error.Types.DONUT,
					message: "unable to retrieve donut assignments",
					severity: Hulu.Error.Severity.HIGH
				}), b();
			});
		},
		fetchExperiments: function(a, b) {
			a || (a = function() {}), b || (b = function() {}), $.get("/api/2.0/kk_experiments").done(function(b) {
				Hulu.Donut.experiments = b, a();
			}).fail(b);
		},
		generateAssignmentsFromAllocations: function() {
			var a = Hulu.Donut.allocations,
				b = a.treatment_overrides,
				c = Hulu.Behaviors.getComputerGUID(),
				d = Hulu.Behaviors.getUserId();
			d <= 0 && (d = null);
			var e = _.map(a.flight_name_lookup_table, function(a, b) {
				return parseInt(b, 10);
			});
			_.each(e, function(b) {
				var e = a.flight_name_lookup_table[b];
				if (a.assignments.hasOwnProperty(b)) {
					var f = Hulu.Donut._get_bucket(c, d, b, a.salt);
					try {
						var g = Hulu.Donut._range_dict_get(a.assignments[b], f),
							h = $.extend(!0, {}, a.assignment_lookup_table[g]);
						Hulu.Donut.assignments.push(h);
					} catch (i) {
						Hulu.Donut.assignments.push(Hulu.Donut._get_control_group(b, e));
					}
				} else Hulu.Donut.assignments.push(Hulu.Donut._get_control_group(b, e));
			});
			var f = d || c;
			b && b[f] && _.each(Hulu.Donut.assignments, function(a, c, d) {
				if (b[f][a.flight_id]) {
					var e = b[f][a.flight_id];
					d[c].treatment_id = e.treatment_id, d[c].treatment_name = e.treatment_name, d[c].experiment_id = e.experiment_id, d[c].experiment_name = e.experiment_name;
				}
			});
		},
		getAssignment: function(a) {
			var b = "control";
			return _.each(Hulu.Donut.assignments, function(c) {
				c.flight_name == a && (b = c.treatment_name);
			}), b;
		},
		getExperimentAndAssignmentByFlight: function(a) {
			var b = "control",
				c = "control";
			return _.each(Hulu.Donut.assignments, function(d) {
				d.flight_name == a && (c = d.treatment_name, b = d.experiment_name);
			}), c == "control" ? "control" : b + " - " + c;
		},
		getTreatmentsGroupedByExperiments: function(a) {
			var b = Hulu.Donut.getAssignment(a),
				c = [{
						experiment: "control",
						treatments: [{
								treatment: "control",
								isCurrent: "control" == b,
								isScheduled: !0
							}
						]
					}
				];
			return _.each(Hulu.Donut.experiments, function(d) {
				if (d.flight_name == a && d.name != "control") {
					var e = !1,
						f = {
							experiment: d.name,
							treatments: _.map(d.treatments, function(a) {
								var c = _.any(a.treatment_schedules, function(a) {
									var b = (new Date).getTime();
									return parseTime = function(a) {
										var b = a.split(/\D/);
										return (new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5])).getTime();
									}, b > parseTime(a.start_time) && b < parseTime(a.end_time);
								});
								return e = e || c, {
									treatment: a.name,
									isCurrent: a.name == b,
									isScheduled: c
								};
							})
						};
					e && c.push(f);
				}
			}), c;
		},
		getFlights: function() {
			return _.map(Hulu.Donut.allocations.flight_name_lookup_table, function(a) {
				return a;
			});
		},
		getAssignmentsString: function() {
			return _.map(this.assignments, function(a) {
				return a.flight_name + ":" + a.treatment_name;
			}, this).join(",");
		},
		getControlGroup: function(a) {
			var b = Hulu.Donut.allocations.flight_id_lookup_table[a];
			return this._get_control_group(b, a);
		},
		getGroupFromExperiments: function(a, b) {
			if (b === "control") return Hulu.Donut.getControlGroup(a);
			var c = null;
			return _.each(Hulu.Donut.experiments, function(d) {
				d.flight_name == a && (treatment = _.find(d.treatments, function(a) {
					return a.name == b;
				}), treatment && (c = {
					flight_id: d.flight_id,
					flight_name: d.flight_name,
					experiment_id: d.id,
					experiment_name: d.name,
					treatment_id: treatment.id,
					treatment_name: treatment.name
				}));
			}), c;
		},
		cacheAssignment: function(a, b) {
			Hulu.Donut.assignments = _.reject(Hulu.Donut.assignments, function(b) {
				return b.flight_name == a;
			}), Hulu.Donut.assignments.push(b);
		},
		sendTreatmentOverride: function(a, b, c, d) {
			c || (c = function() {}), d || (d = function() {});
			var e = Hulu.Behaviors.getComputerGUID(),
				f = Hulu.Behaviors.getUserId();
			$.post("/donut/treatment_overrides_post_proxy", JSON.stringify({
				action: "add",
				scope_name: "h2o",
				user_id: f > 0 ? f : "",
				guid: e,
				flight_name: a,
				treatment_name_override: b
			})).done(c).fail(d);
		},
		switchAssignment: function(a, b) {
			var c = Hulu.Donut.getGroupFromExperiments(a, b);
			!c || (Hulu.Donut.cacheAssignment(a, c), Hulu.Context.clean(), Hulu.navigate(Hulu.Utils.Url.getPathName() + Hulu.Utils.Url.getSearch()));
		},
		_get_bucket: function(a, b, c, d) {
			var e = b || a,
				f = HMAC_SHA256_MAC(d, e.toString() + c.toString()),
				g = parseInt(f.substring(0, 8), 16) % 100;
			return g;
		},
		_get_control_group: function(a, b) {
			return {
				flight_id: a,
				flight_name: b,
				treatment_id: 0,
				treatment_name: "control",
				experiment_id: 0,
				experiment_name: "control"
			};
		},
		_range_dict_get: function(a, b) {
			var c = {
				name: "KeyError",
				message: "bad key: " + b
			};
			if (!$.isNumeric(b)) throw c;
			var d = null;
			_.each(a, function(a, c) {
				var e = c.split("-"),
					f = e[0],
					g = e[1];
				if ($.isNumeric(f) && $.isNumeric(g)) {
					var h = parseInt(f, 10),
						i = parseInt(g, 10);
					if (b >= h && b <= i) return d = a, !1;
				}
			});
			if (!d) throw c;
			return d;
		}
	};
}.call(this);

try {
	Hulu.Donut.initialize();
} catch (ex) {}

$(document).ready(function() {
	setInterval(function() {
		Hulu.Donut.update();
		var a = Hulu.Donut.getExperimentAndAssignmentByFlight(Hulu.Constants.H2O_FLIGHT);
		Hulu.GA.setCustomVariable(6, "DonutTreatment", a || "Control", 1);
	}, Hulu.Donut.REFRESH_INTERVAL);
}),
function() {
	Hulu.SourceAware = {
		_data: null,
		_historyIds: {},
		_queryTask: {},
		MAX_COUNT: 128,
		MAX_COUNT_REFRESH: 1280,
		MAX_COUNT_IN_PLAYER: 32,
		STATE: {
			PENDING: "pending",
			WORKING: "working",
			INVALID: "invalid"
		},
		saveShelfConfig: function(a, b, c, d) {
			d = d || {};
			if (this._data && this._data.config == a) {
				this._data.state = Hulu.SourceAware.STATE.PENDING, this._unbindCollectionEvent(), a.sourceAware != Hulu.Constants.SOURCE_AWARE.constant && (this._data.collection = b);
				return;
			}
			this.clear(), a = $.extend(!0, {}, a), a.shelfType = "TRAY", a.smartScroll = "enabled", a.behaviors = [], a.templateType = Hulu.Controls.TrayTemplate.TYPES.TYPE_S_ONE_ROW, a.displayName = a.displayName || I18n.t("tray_name.now_playing"), this.fallbackToFirstVideo = d.fallbackToFirstVideo;
			var e = {}, f = a.key.toString().toLowerCase();
			if (a.sourceAware == Hulu.Constants.SOURCE_AWARE.constant) {
				a.maxCount = Math.min(this.MAX_COUNT, a.maxCount || this.MAX_COUNT), a.itemsPerPage = this.MAX_COUNT;
				var g = Math.max(0, c - this.MAX_COUNT / 2),
					h = Math.min(g + this.MAX_COUNT, b.length(), a.maxCount);
				g = Math.min(g, Math.max(0, h - this.MAX_COUNT));
				var i = c - c % this.MAX_COUNT,
					j = Math.min(i + this.MAX_COUNT, b.length(), a.maxCount);
				if (!b.at(g) || !b.at(h - 1)) g = i, h = j;
				var k = b.slice(g, h);
				_.each(k, function(a, b) {
					e[b] = a;
				}), e.totalCount = h - g, e.isTotalCountReady = !0, e.metaData = {}, f += "," + g + "," + h;
			} else if (a.sourceAware == Hulu.Constants.SOURCE_AWARE.refresh || a.sourceAware == Hulu.Constants.SOURCE_AWARE.incremental) e = b.dump();
			a.sourceAware != Hulu.Constants.SOURCE_AWARE.refresh && (a.rawCollection = e);
			var l = {
				key: f,
				config: a,
				state: Hulu.SourceAware.STATE.PENDING,
				userPgid: Hulu.Behaviors.getUserPgid(),
				rawCollection: e
			};
			a.sourceAware != Hulu.Constants.SOURCE_AWARE.constant && (l.collection = b), this._data = l, this._historyIds = {};
		},
		updateCollection: function(a) {
			this._data && this._data.config.sourceAware != Hulu.Constants.SOURCE_AWARE.constant && (this._unbindCollectionEvent(), this._data.collection = a);
		},
		getShelfConfig: function(a, b, c) {
			var d = !1;
			return this._data && (this._data.state == Hulu.SourceAware.STATE.PENDING && (d = !0), Hulu.Utils.History.getGlobalState("source-tray-key") == this._data.key ? d = !0 : this._data.state == Hulu.SourceAware.STATE.WORKING && (d = a || this._historyIds[b] && !c)), b && d && (this._historyIds[b] = !0), d ? this._data : null;
		},
		isSameConfig: function(a) {
			return this._data && this._data.config ? Hulu.router.currentView.playerTrayConfigId && this._data.config.displayName == a.displayName ? !0 : Hulu.Utils.isSameConfig(this._data.config, a) : !1;
		},
		setState: function(a) {
			this._data && (this._data.state = a, a == Hulu.SourceAware.STATE.WORKING && Hulu.Utils.History.setGlobalState("source-tray-key", this._data.key));
		},
		getState: function() {
			return this._data ? this._data.state : "disabled";
		},
		clear: function() {
			this._unbindCollectionEvent(), this._data = null, this._historyIds = {};
		},
		fetchNextVideoIds: function(a, b) {
			this._queryTask = {
				id: a,
				callback: b
			};
			var c = this._data;
			return c ? (c.collection ? (c.collection.bind(Hulu.Events.CollectionBase.DATA_UPDATED, this._onCollectionDataUpdate, this), c.collection.bind(Hulu.Events.CollectionBase.DATA_ERROR, this._onCollectionDataError, this), this._onCollectionDataUpdate()) : c.rawCollection ? this._returnNextIdsFromCollection(a, c.rawCollection) : this._onCollectionDataError(), !0) : (this._onCollectionDataError(), !0);
		},
		init: function() {
			Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_IN, this._onLoggedInStatusChanged, this), Hulu.Dispatcher.on(Hulu.Events.Login.USER_LOGGED_OUT, this._onLoggedInStatusChanged, this);
		},
		_onLoggedInStatusChanged: function() {
			this.setState(Hulu.SourceAware.STATE.PENDING);
		},
		_unbindCollectionEvent: function() {
			this._data && this._data.collection && (this._data.collection.unbind(Hulu.Events.CollectionBase.DATA_UPDATED, this._onCollectionDataUpdate, this), this._data.collection.unbind(Hulu.Events.CollectionBase.DATA_ERROR, this._onCollectionDataError, this));
		},
		_onCollectionDataUpdate: function() {
			var a = this._data.collection.dump(),
				b = !1,
				c = -1;
			for (var d = 0; d < a.totalCount; ++d) {
				var e = a[d];
				if (!e) {
					c = c == -1 ? d : c;
					continue;
				}
				e.modelName == "video" && e.id == this._queryTask.id && (b = !0);
			}
			b ? (this._unbindCollectionEvent(), this._returnNextIdsFromCollection(this._queryTask.id, a)) : c >= 0 ? this._data.collection.fetch(c) : this.fallbackToFirstVideo ? (this._unbindCollectionEvent(), this._returnNextIdsFromCollection(null, a)) : this._onCollectionDataError();
		},
		_onCollectionDataError: function() {
			this._unbindCollectionEvent(), this._queryTask.callback({
				status: "error",
				current_id: this._queryTask.id
			});
		},
		_returnNextIdsFromCollection: function(a, b) {
			var c = [],
				d = !1,
				e = Hulu.Behaviors.getAuthType(),
				f = Hulu.Behaviors.isSubscriber(),
				g = Hulu.Behaviors.getUserPgid(),
				h = -1;
			for (var i = 0; i < b.totalCount && i < (this._data.config.maxCount || Number.MAX_VALUE); ++i) {
				var j = b[i];
				if (!j || j.modelName != "video") continue;
				if (j.id == a) {
					d = !0, h = i;
					continue;
				}
				if (!d) continue;
				var k = this._data.userPgid == g && !j.isExpired();
				this._data.userPgid != g && (k = !j.isSubscriberOnly || f && j.isSubscriberOnly || Hulu.Behaviors.getAuthType().indexOf((j.authName || "").toLowerCase()) >= 0), k && c.push(j.id);
			}!d && this.fallbackToFirstVideo && (h = b.totalCount, d = !0);
			if ((this._data.config.sourceAware == Hulu.Constants.SOURCE_AWARE.refresh || Hulu.router.currentView.replaySourceTrays) && d) for (i = 0; i < h; ++i) {
					var j = b[i];
					if (!j || j.modelName != "video") continue;
					c.push(j.id);
			}
			this._queryTask.callback({
				next_ids: c.slice(0, this.MAX_COUNT_IN_PLAYER).join("_"),
				current_id: this._queryTask.id,
				status: "success"
			});
		}
	}, HuluRouter.Broadcaster.on(Hulu.Events.Router.AFTER_SWAP, function() {
		Hulu.SourceAware.getState() == Hulu.SourceAware.STATE.WORKING || Hulu.SourceAware.getState() == Hulu.SourceAware.STATE.INVALID ? Hulu.SourceAware.setState(Hulu.SourceAware.STATE.INVALID) : Hulu.SourceAware.setState(Hulu.SourceAware.STATE.WORKING);
	});
}.call(this),
function() {
	Hulu.DarkLaunch = {
		test: function(a, b, c, d) {
			if (!a) return;
			c = parseInt(c) || 100;
			if (Math.random() * 100 > c && !Hulu.Configuration.isStaging()) return;
			var e = new Date,
				f = Hulu.Utils.Url.getPageType(Hulu.Utils.Url.getPathName());
			Hulu.Collections.JsonResource.get(a).always(function(a) {
				if (!b || !a) return;
				var c = a.status || 200,
					g = new Date,
					h = {
						response_time: g - e,
						status_code: c,
						page: f,
						cb: g
					};
				d instanceof Object && _.extend(h, d), Hulu.Collections.JsonResource.get(b, h);
			});
		}
	}, HuluRouter.Broadcaster.on(Hulu.Events.Common.PAGE_READY, function() {
		try {
			var a = Hulu.Utils.Url.getPageType(Hulu.Utils.Url.getPathName());
		} catch (b) {}
	});
}.call(this),
function() {
	var a = "#NoHuluAdsMask";
	$.client && $.client.browser == "Chrome" && window.setInterval(function() {
		var b = document.location;
		if (!/\/watch\/(\d+)/.test(b.pathname)) return;
		var c = $(a);
		c.length > 0 && c.remove();
	}, (new Date).getTime() % 2e3 + 2e3);
}.call(this),
function() {
	Hulu.Tempo = {
		apiVersion: '"v1"',
		client: '"h2o"',
		endpoints: [{
				key_pattern: "^/home$",
				endpoint: "home",
				enable: !0,
				api_path: "/tempo/v1/h2o/home"
			}, {
				key_pattern: "^/tv$",
				endpoint: "tv",
				enable: !0,
				api_path: "/tempo/v1/h2o/tv"
			}, {
				key_pattern: "^/movies$",
				endpoint: "movies",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies"
			}, {
				key_pattern: "^/adzone/",
				endpoint: "adzone",
				enable: !0,
				api_path: "/tempo/v1/h2o/adzone"
			}, {
				key_pattern: "^/kids$",
				endpoint: "kids",
				enable: !0,
				api_path: "/tempo/v1/h2o/kids"
			}, {
				key_pattern: "^/latino$",
				endpoint: "latino",
				enable: !0,
				api_path: "/tempo/v1/h2o/latino"
			}, {
				key_pattern: "^/videogames$",
				endpoint: "videogames",
				enable: !0,
				api_path: "/tempo/v1/h2o/videogames"
			}, {
				key_pattern: "^/show/.+",
				endpoint: "show",
				enable: !0,
				api_path: "/tempo/v1/h2o/show"
			}, {
				key_pattern: "^/watch/(videogame/)?\\d+.*",
				endpoint: "watch",
				enable: !0,
				api_path: "/tempo/v1/h2o/watch"
			}, {
				key_pattern: "^/watch/ad/.*",
				endpoint: "watch_ad",
				enable: !1,
				api_path: "/tempo/v1/h2o/watch_ad"
			}, {
				key_pattern: "^/watch_spotlight/.*",
				endpoint: "watch_spotlight",
				enable: !1,
				api_path: "/tempo/v1/h2o/watch_spotlight"
			}, {
				key_pattern: "^/spotlight/.*",
				endpoint: "spotlight",
				enable: !1,
				api_path: "/tempo/v1/h2o/spotlight"
			}, {
				key_pattern: "^/tv/popular$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/popular/shows$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/popular/episodes$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/popular/clips$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/new/shows$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/new/episodes$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/new$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/new/clips$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/popular$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/popular/films$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/popular/trailers$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/popular/clips$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/new$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/new/films$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/new/trailers$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/movies/new/clips$",
				endpoint: "browse",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse"
			}, {
				key_pattern: "^/tv/picks$",
				endpoint: "tv_picks",
				enable: !0,
				api_path: "/tempo/v1/h2o/tv_picks"
			}, {
				key_pattern: "^/tv/networks$",
				endpoint: "tv_networks",
				enable: !0,
				api_path: "/tempo/v1/h2o/tv_networks"
			}, {
				key_pattern: "^/tv/genres$",
				endpoint: "tv_genres",
				enable: !0,
				api_path: "/tempo/v1/h2o/tv_genres"
			}, {
				key_pattern: "^/movies/picks$",
				endpoint: "movies_picks",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_picks"
			}, {
				key_pattern: "^/movies/studios$",
				endpoint: "movies_studios",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_studios"
			}, {
				key_pattern: "^/movies/genres$",
				endpoint: "movies_genres",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_genres"
			}, {
				key_pattern: "^/movies/trailers$",
				endpoint: "movies_trailers",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_trailers"
			}, {
				key_pattern: "^/movies/documentaries$",
				endpoint: "movies_documentaries",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_documentaries"
			}, {
				key_pattern: "^/movies/criterion$",
				endpoint: "movies_criterion",
				enable: !0,
				api_path: "/tempo/v1/h2o/movies_criterion"
			}, {
				key_pattern: "^/tv/genres/[^/]+$",
				endpoint: "genre",
				enable: !0,
				api_path: "/tempo/v1/h2o/genre"
			}, {
				key_pattern: "^/tv/genres/.+/.+",
				endpoint: "subgenre",
				enable: !0,
				api_path: "/tempo/v1/h2o/subgenre"
			}, {
				key_pattern: "^/movies/genres/[^/]+$",
				endpoint: "genre",
				enable: !0,
				api_path: "/tempo/v1/h2o/genre"
			}, {
				key_pattern: "^/movies/genres/.+/.+",
				endpoint: "subgenre",
				enable: !0,
				api_path: "/tempo/v1/h2o/subgenre"
			}, {
				key_pattern: "^/browse/picks/.+",
				endpoint: "browse_picks",
				enable: !0,
				api_path: "/tempo/v1/h2o/browse_picks"
			}, {
				key_pattern: "^/videogames/.+",
				endpoint: "videogames",
				enable: !0,
				api_path: "/tempo/v1/h2o/videogames"
			}, {
				key_pattern: "^/live$",
				endpoint: "live",
				enable: !1,
				api_path: "/tempo/v1/h2o/live"
			}, {
				key_pattern: "^/company/.+",
				endpoint: "company",
				enable: !0,
				api_path: "/tempo/v1/h2o/company"
			}, {
				key_pattern: "^/grid/.+",
				endpoint: "seasons_grid",
				enable: !0,
				api_path: "/tempo/v1/h2o/seasons_grid"
			}
		],
		isEnabled: function(a) {
			var b = this.findEndpoint(a);
			return b && b.enable;
		},
		findEndpoint: function(a) {
			var b = _.find(this.endpoints, function(b) {
				var c = new RegExp(b.key_pattern);
				return c.test(a);
			}, this);
			return b;
		}
	};
}.call(this),
function() {
	Hulu.PageInfo = {
		SOURCE_LIST: {
			SITE: "source.site",
			TEMPO: "source.tempo"
		},
		API_TYPES: {
			API2: "api2",
			MOZART: "mozart",
			SAPI: "sapi"
		}
	}, Hulu.PageInfo.PageConfig = function() {
		this.type = null, this.metadata = {}, this.shelfConfigs = [];
	}, Hulu.PageInfo.Metadata = function() {
		this.urlPath = null, this.pageTitle = null, this.metaTags = {}, this.adzoneState = Hulu.Constants.ADZONE.defaultState;
	}, Hulu.PageInfo.ShelfConfig = function() {
		this.key = null, this.id = null, this.tempoHash = null, this.baseUrl = null, this.restParams = {}, this.dataAttributes = {}, this.name = null, this.displayName = null, this.className = null, this.shelfType = null, this.templateType = null, this.templateParams = null, this.tileType = null, this.moreLink = null, this.dropdownConfig = [], this.itemsPerPage = 32, this.rowCount = 0, this.maxCount = null, this.behaviors = null, this.hideCount = -1, this.columnCount = null, this.cache = !0, this.hasQueueButton = null, this.requireLogin = !1, this.smartScroll = !1, this.sourceAware = null, this.navTiles = null, this.isComponent = !1;
	}, Hulu.PageInfo.PageConfigStore = {
		get: function(a, b) {
			var c = null;
			b = b || this.getSource(a);
			if (Hulu.Context) {
				var d = Hulu.Context.findOne("PAGE_CONFIG", {
					key: a,
					source: b
				});
				d && (c = $.extend(!0, {}, d.config));
			} else Hulu.Utils.warn("Failed to find page config from context!");
			return c;
		},
		save: function(a, b, c) {
			c = c || this.getSource(a), b && Hulu.Context ? Hulu.Context.save("PAGE_CONFIG", {
				key: a,
				source: c,
				config: b
			}) : Hulu.Utils.warn("Page config hasn't saved to context for " + a);
		},
		saveFromRawConfig: function(a, b, c) {
			c = c || this.getSource(a), this.save(a, this._parseConfig(a, b, c), c);
		},
		fetch: function(a, b, c) {
			var d = this,
				e = this.getSource(a),
				f = Hulu.Configuration.tempoVersion(),
				g, h, i;
			e == Hulu.PageInfo.SOURCE_LIST.TEMPO && (g = Hulu.Tempo.findEndpoint(a), g ? (h = g.api_path, f && (h += "/" + f), i = c, $.extend(i, {
				scope_name: "h2o",
				user_id: Hulu.Behaviors.getUserId(),
				guid: Hulu.Behaviors.getComputerGUID()
			}), Hulu.Configuration.isSmoke() ? $.extend(i, {
				env: "smoke"
			}) : Hulu.Configuration.isDemo() && $.extend(i, {
				env: "demo"
			}), $.extend(i, {
				treatments: Hulu.Donut.getAssignmentsString()
			})) : Hulu.Utils.warn("Failed to find tempo endpoint for " + a)), h || (e = Hulu.PageInfo.SOURCE_LIST.SITE, h = "/api/2.0/page_config.json", g = Hulu.Tempo.findEndpoint(a), g ? $.extend(c, {
				page: g.endpoint
			}) : $.extend(c, {
				page: null
			}), i = {
				shelf_params: b,
				head_data_params: c
			});
			var j = $.Deferred(),
				k = Hulu.Collections.JsonResource.get(h, i).done(function(b) {
					if (b) {
						var c = d._parseConfig(a, b, e);
						d.save(a, c, e), j.resolve($.extend(!0, {}, c));
					} else j.reject();
				}).fail(function(b) {
					var c = !0;
					if (e == Hulu.PageInfo.SOURCE_LIST.TEMPO) {
						var f = d.get(a, Hulu.PageInfo.SOURCE_LIST.SITE);
						f && (j.resolve(f), c = !1);
					}
					c && j.reject(), Hulu.Error.postAjaxError(this, b, "Failed to load page config!");
				});
			return j.promise();
		},
		getSource: function(a) {
			return Hulu.Tempo.isEnabled(a) ? Hulu.PageInfo.SOURCE_LIST.TEMPO : Hulu.PageInfo.SOURCE_LIST.SITE;
		},
		_parseConfig: function(a, b, c) {
			var d = null;
			try {
				d = Hulu.PageInfo.ConfigConvertor.convertPageConfig(b, c);
			} catch (e) {
				Hulu.Utils.warn("Parse page config failed: " + e.message);
			}
			return d;
		}
	}, Hulu.PageInfo.ConfigConvertor = {
		_convert: function(a, b) {
			return _.each(a, function(c, d) {
				var c = b.get(d);
				c != null && (a[d] = c);
			}, this), _.clone(a);
		},
		convertPageConfig: function(a, b) {
			var c = b == Hulu.PageInfo.SOURCE_LIST.TEMPO ? "TempoPageConfigAdapter" : "SitePageConfigAdapter";
			return this._convert(new Hulu.PageInfo.PageConfig, new Hulu.PageInfo[c](a));
		},
		convertShelfConfig: function(a, b) {
			var c = b == Hulu.PageInfo.SOURCE_LIST.TEMPO ? "TempoShelfConfigAdapter" : "SiteShelfConfigAdapter";
			return this._convert(new Hulu.PageInfo.ShelfConfig, new Hulu.PageInfo[c](a));
		},
		convertComponentConfig: function(a) {
			return this._convert(new Hulu.PageInfo.ShelfConfig, new Hulu.PageInfo.ComponentConfigAdapter(a));
		},
		convertMetadata: function(a) {
			return this._convert(new Hulu.PageInfo.Metadata, new Hulu.PageInfo.MetadataAdapter(a));
		}
	}, Hulu.PageInfo.ConfigAdapter = function(a) {
		this.config = a || {};
	}, _.extend(Hulu.PageInfo.ConfigAdapter.prototype, {
		get: function(a) {
			if (a) {
				var b = this._getterFunc(a);
				if (_.isFunction(b)) return b.apply(this);
			}
			return this.config[a];
		},
		_getterFunc: function(a) {
			var b = "_get" + a.replace(/^./, function(a) {
				return a.toUpperCase();
			});
			return this[b];
		}
	}), Hulu.PageInfo.ConfigAdapter.extend = Backbone.Model.extend, Hulu.PageInfo.SitePageConfigAdapter = Hulu.PageInfo.ConfigAdapter.extend({
		_getMetadata: function() {
			return Hulu.PageInfo.ConfigConvertor.convertMetadata(this.config.metadata);
		},
		_getShelfConfigs: function() {
			var a = [];
			return _.each(this.config.shelf_configs, function(b) {
				a.push(Hulu.PageInfo.ConfigConvertor.convertShelfConfig(b, Hulu.PageInfo.SOURCE_LIST.SITE));
			}, this), a;
		}
	}), Hulu.PageInfo.TempoPageConfigAdapter = Hulu.PageInfo.ConfigAdapter.extend({
		_getMetadata: function() {
			return Hulu.PageInfo.ConfigConvertor.convertMetadata(this.config.metadata);
		},
		_getShelfConfigs: function() {
			var a = [];
			return _.each(this.config.collections, function(b) {
				b.component ? a.push(Hulu.PageInfo.ConfigConvertor.convertComponentConfig(b.component)) : a.push(Hulu.PageInfo.ConfigConvertor.convertShelfConfig(b.collection, Hulu.PageInfo.SOURCE_LIST.TEMPO));
			}, this), a;
		}
	}), Hulu.PageInfo.MetadataAdapter = Hulu.PageInfo.ConfigAdapter.extend({
		_getPageTitle: function() {
			return this.config.page_title || "";
		},
		_getMetaTags: function() {
			return this.config.meta_tags || {};
		},
		_getUrlPath: function() {
			return this.config.url_path || "";
		},
		_getAdzoneState: function() {
			return this.config.adzone_state || Hulu.Constants.ADZONE.defaultState;
		}
	}), Hulu.PageInfo.ShelfConfigAdapter = Hulu.PageInfo.ConfigAdapter.extend({
		_parseTemplateType: function(a) {
			var b = this.get("shelfType"),
				c = b == "GRID" ? Hulu.Controls.GridTemplate : Hulu.Controls.TrayTemplate;
			a || (a = b == "GRID" ? "TYPE_ONE_SPOTLIGHT" : "TYPE_S_ONE_ROW");
			if (b == "TRAY") {
				if (Hulu.Controls.MobileDevice.isMobile) return Hulu.Controls.TrayTemplate.TYPES.TYPE_S_MOBILE;
				if (Hulu.Utils.Env.isEmbed()) return Hulu.Controls.TrayTemplate.TYPES.TYPE_S_ONE_ROW;
				var d = this.get("hash"),
					e = Hulu.Utils.Views.Tray.TRAY_CONFIG_BY_HASH[d];
				e && e.templateType && (a = e.templateType);
			}
			return c.TYPES[a];
		},
		_parseTileType: function(a) {
			return a || (a = "TYPE_DEFAULT_OVERLAY"), Hulu.Controls.Render.Tile.TYPES[a];
		},
		_checkHideCount: function(a) {
			if (!_.isNumber(a)) {
				var b = this.get("baseUrl");
				Hulu.Utils.Url.isEditorialUrl(b) ? a = 3 : Hulu.Utils.Url.isRecommendationUrl(b) ? Hulu.Utils.Url.isWYWUrl(b, this.get("restParams")) ? a = 0 : a = 4 : a = null;
			}
			return a;
		},
		_getItemsPerPage: function() {
			return this._getSourceAware() ? this._getSourceAware() == Hulu.Constants.SOURCE_AWARE.refresh ? Hulu.SourceAware.MAX_COUNT_REFRESH : this._getSourceAware() == Hulu.Constants.SOURCE_AWARE.constant ? Hulu.SourceAware.MAX_COUNT : 32 : Hulu.Utils.Url.isMozartUrl(this.get("baseUrl")) ? 32 : this.config.itemsPerPage || 64;
		},
		_getRowCount: function() {
			return this.get("shelfType") == "GRID" ? Math.floor(this.get("itemsPerPage") / 6) : 0;
		},
		_getKey: function() {
			return [this.get("baseUrl"), $.param(this.get("restParams")).split("&").sort().toString()];
		}
	}), Hulu.PageInfo.SiteShelfConfigAdapter = Hulu.PageInfo.ShelfConfigAdapter.extend({
		_getId: function() {
			return Hulu.Beacon.calculateRegionName(null, this.get("name"), this.get("displayName"));
		},
		_getBehaviors: function() {
			var a = [];
			return _.each(this.get("dropdownConfig"), function(b) {
				var c = _.map(b.data, function(a) {
					return {
						metadata: {
							displayText: a.text
						},
						urlOptions: Hulu.Utils.Url.parseQueryString(a.value)
					};
				}, this);
				a.push({
					type: "sortby_dropdown",
					layout: {
						uiType: "dropdown"
					},
					options: c
				});
			}, this), a;
		},
		_getName: function() {
			return this.config.name ? Hulu.Utils.Str.camelize(this.config.name) : null;
		},
		_getDisplayName: function() {
			return this.config["displayName"] == null && this.get("name") ? I18n.t("tray_name." + Hulu.Utils.Str.decamelize(this.get("name"), "_")) : this.config.displayName;
		},
		_getBaseUrl: function() {
			return /PLUS_UPSELL/.test(this.get("shelfType")) ? "/banner/" + this.config.templateParams.prefix + "/" + this.config.templateParams.name : this.config.baseUrl || "";
		},
		_getRestParams: function() {
			return /PLUS_UPSELL/.test(this.get("shelfType")) ? {
				id: this.config.id
			} : this.config.restParams || {};
		},
		_getShelfType: function() {
			return (this.config.shelfType || "Tray").toUpperCase();
		},
		_getTemplateType: function() {
			return this._parseTemplateType(this.config.templateType);
		},
		_getTileType: function() {
			return this._parseTileType(this.config.tileType);
		},
		_getSourceAware: function() {
			return Hulu.Utils.Url.isEditorialUrl(this.get("baseUrl")) ? Hulu.Constants.SOURCE_AWARE.incremental : this.config.sourceAware;
		},
		_getHideCount: function() {
			return this._checkHideCount(this.config.hideCount);
		}
	}), Hulu.PageInfo.TempoShelfConfigAdapter = Hulu.PageInfo.ShelfConfigAdapter.extend({
		_dataSource: function() {
			return this.config.datasource || {};
		},
		_metaData: function() {
			return this.config.metadata || {};
		},
		_actions: function() {
			return this.config.actions || {};
		},
		_layout: function() {
			return this.config.layout || {};
		},
		_getBehaviors: function() {
			return _.map(this.config.behaviors || [], function(a) {
				return a.layout.uiType = a.layout.ui_type, delete a.layout.ui_type, _.each(a.options, function(a) {
					a.urlOptions = a.url_options, a.metadata && (a.metadata.displayText = a.metadata.display_text, delete a.metadata.display_text), delete a.url_options;
				}), a;
			});
		},
		_getTempoHash: function() {
			return this.config.hash;
		},
		_getBaseUrl: function() {
			return Hulu.Utils.Url.getSourcePath(this._dataSource());
		},
		_getDisplayName: function() {
			return this._metaData().display_text;
		},
		_getRestParams: function() {
			var a = this._dataSource().options || {};
			return a.url_options || {};
		},
		_getDataAttributes: function() {
			return this._metaData().data_attributes;
		},
		_getSmartScroll: function() {
			return this._actions().smart_scroll;
		},
		_getHasQueueButton: function() {
			return this._actions().has_queue_button;
		},
		_getTemplateType: function() {
			return this._parseTemplateType(this._layout().attributes.template_type);
		},
		_getShelfType: function() {
			return this._layout()["class"].toUpperCase();
		},
		_getTileType: function() {
			return this._parseTileType(this._layout().attributes.tile_type);
		},
		_getMoreLink: function() {
			return this._actions().more_link;
		},
		_getSourceAware: function() {
			return this._actions().source_aware;
		},
		_getMaxCount: function() {
			return this.get("restParams").max_count;
		},
		_getHideCount: function() {
			return this._checkHideCount(this._actions().hide_count);
		},
		_getColumnCount: function() {
			return this._actions().column_count;
		}
	}), Hulu.PageInfo.ComponentConfigAdapter = Hulu.PageInfo.TempoShelfConfigAdapter.extend({
		_getNavTiles: function() {
			return _.map(this.config.nav_tiles, function(a) {
				return Hulu.Collections.JsonResource._createModelByAttributes("featured_content", a.nav_tile.layout.attributes);
			});
		},
		_getIsComponent: function() {
			return !0;
		}
	});
}.call(this),
function() {
	Hulu.SecureJsonP = {
		pendingAjaxRequests: {},
		ajax: function(a) {
			var b = Math.round(Math.random() * 1e16 + 1),
				c = Hulu.Utils.Url.build(a.url, ["jsonp_request_id=" + b]);
			c = Hulu.Utils.Url.secureUrl(c);
			var d = a.data;
			typeof d == "object" && (d = $.param(d));
			var e = encodeURIComponent || escape,
				f = {
					value: e(d),
					path: _.last(/(?:hulu(?:qa)?\.com|^)(\/[^?]*)/.exec(c))
				}, g = a.done,
				h = a.fail,
				i = a.always;
			Hulu.SecureJsonP.pendingAjaxRequests[b] = {
				done: g === undefined ? function() {} : g,
				fail: h === undefined ? function() {} : h,
				always: i === undefined ? function() {} : i,
				cookie: f,
				path: c,
				id: b
			}, document.body.appendChild($("<script/>", {
				id: "jsonp_stage_1_tag_" + b,
				type: "text/javascript",
				src: c + "&jsonp_stage=1"
			})[0]);
		},
		ajaxStage1Callback: function(a) {
			var b = Hulu.SecureJsonP.pendingAjaxRequests[a.request_id];
			b !== undefined && (Cookies.setCookieByKey("JSONP_PARAMS", b.cookie.value, {
				path: b.cookie.path
			}), document.body.appendChild($("<script/>", {
				id: "jsonp_stage_2_tag_" + b.id,
				type: "text/javascript",
				src: b.path + "&jsonp_stage=2"
			})[0]), $("#jsonp_stage_1_tag_" + b.id).remove());
		},
		ajaxStage2Callback: function(a) {
			var b = Hulu.SecureJsonP.pendingAjaxRequests[a.request_id];
			if (b !== undefined) {
				delete Hulu.SecureJsonP.pendingAjaxRequests[a.request_id];
				var c = $.parseJSON(a.body);
				if (/200/.test(a.status)) try {
						b.done(c);
				} catch (d) {} else try {
						b.fail(c);
				} catch (d) {}
				try {
					b.always(c);
				} catch (d) {}
				$("#jsonp_stage_2_tag_" + b.id).remove();
			}
		}
	};
}.call(this),
function() {
	Hulu.Spotlight = {
		Tournament: {
			config: {
				bestinshow: {
					rounds: [{
							startDate: "2013-02-28",
							featureListId: "1507"
						}, {
							startDate: "2013-03-07",
							featureListId: "1508"
						}, {
							startDate: "2013-03-14",
							featureListId: "1515"
						}, {
							startDate: "2013-03-21",
							featureListId: "1516"
						}, {
							startDate: "2013-03-28",
							featureListId: "1517"
						}
					],
					endDate: "2013-04-04",
					votingKey: "bis2013-{0}",
					hasPartner: !0,
					itemType: "show"
				}
			},
			_activeCollection: {},
			_getActiveRoundIndex: function(a) {
				var b = 0;
				if (a && a.rounds) {
					var c = moment.utc();
					for (var d = 0; d < a.rounds.length; d++) {
						var e = a.rounds[d];
						if (e && e.startDate) {
							var f = moment(e.startDate).utc();
							if (c <= f) break;
							b = d;
						}
					}
				}
				return b;
			},
			_isActive: function(a) {
				var b = moment.utc(),
					c = !1;
				if (a && a.endDate) {
					var d = moment(a.endDate).utc();
					c = b < d;
				}
				return c;
			},
			getConfig: function(a) {
				var b = Hulu.Spotlight.Tournament.config[a];
				return b && (b.activeRoundIndex = Hulu.Spotlight.Tournament._getActiveRoundIndex(b), b.isActive = Hulu.Spotlight.Tournament._isActive(b)), b;
			},
			getActiveRoundItems: function(a, b) {
				var c = Hulu.Spotlight.Tournament.getConfig(a);
				if (c) {
					var d = c.activeRoundIndex,
						e = c.rounds[d].featureListId,
						f = {
							id: e
						};
					Hulu.Spotlight.Tournament._activeCollection[e] = new Hulu.Collections.CollectionBase(Hulu.Constants.MOZART_URLS.editorial, f, {
						itemsPerPage: "all"
					});
					var g = Hulu.Spotlight.Tournament._activeCollection[e],
						h = g.length();
					h <= 0 && (h = null);
					var i = function() {
						Hulu.Spotlight.Tournament._activeCollectionUpdated(e, b);
					};
					g.bind(Hulu.Events.CollectionBase.DATA_UPDATED, i), g.fetch(0, h);
				}
			},
			_activeCollectionUpdated: function(a, b) {
				var c = Hulu.Spotlight.Tournament._activeCollection[a];
				c && (c.saveToContext(), b && b(c));
			}
		}
	};
}.call(this),
function() {
	Hulu.AdobePass = {
		PROVIDERS: {
			CableOne: {
				displayName: "Cable One",
				introURL: "http://assets.huluim.com/prerolls/cableone_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["If you have any questions related to your account, check out ", "Cable One support", "."],
				supportURL: "http://www.cableone.net/Pages/tvefaqs.aspx"
			},
			Dish: {
				displayName: "DISH",
				introURL: "http://assets.huluim.com/prerolls/dish_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["Questions about your DISH account? ", "Chat now", " with a DISH agent."],
				supportURL: "http://www.dishnetwork.com/customerservice/contactus/live_chat/default.aspx?chat=tier2"
			},
			Verizon: {
				displayName: "Verizon",
				introURL: "http://assets.huluim.com/prerolls/verizon_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["Questions about your Verizon account? ", "Contact", " Verizon support."],
				supportURL: "http://www22.verizon.com/content/ContactUs"
			},
			Mediacom: {
				displayName: "Mediacom",
				introURL: "http://assets.huluim.com/prerolls/mediacom_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["If you have any questions related to your account, check out ", "Mediacom support", "."],
				supportURL: "http://mediacomcable.com/CustomerSupport/"
			},
			www_websso_mybrctv_com: {
				displayName: "Blue Ridge Communications",
				introURL: "http://assets.huluim.com/prerolls/blueridge_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["If you have any questions related to your account, check out ", "Blue Ridge Communications support", "."],
				supportURL: "http://www.brctv.com/support"
			},
			ATT: {
				displayName: "AT&T U-verse",
				introURL: "http://assets.huluim.com/prerolls/att_H264_650.flv",
				resourceID: "FBC-FOX",
				supportMsg: ["Questions about your AT&T U-verse account? ", "Contact", " AT&T support."],
				supportURL: "http://www.att.com/esupport/main.jsp?cv=813"
			},
			Suddenlink: {
				displayName: "Suddenlink",
				introURL: "http://assets.huluim.com/prerolls/suddenlink_H264_650.flv",
				resourceID: "usa",
				supportMsg: ["Questions about your SuddenLink account? ", "Contact", " SuddenLink support."],
				supportURL: "http://help.suddenlink.com/Pages/default.aspx"
			},
			"gvtc_auth-gateway_net": {
				displayName: "GVTC",
				resourceID: "FBC-FOX",
				supportMsg: ["Questions about your GVTC account? ", "Contact", " GVTC support."],
				supportURL: "http://www.gvtc.com/contactus/index.php"
			},
			auth_armstrongmywire_com: {
				displayName: "Armstrong",
				resourceID: "usa",
				supportMsg: ["Questions about your Armstrong account? ", "Contact", " Armstrong support."],
				supportURL: "http://armstrongonewire.com/contact.aspx"
			},
			Bend: {
				displayName: "BendBroadband",
				introURL: "http://assets.huluim.com/prerolls/bend_H264_650.flv",
				resourceID: "usa",
				supportMsg: ["Questions about your BendBroadband account? ", "Contact", " BendBroadband support."],
				supportURL: "http://help.bendbroadband.com/sp_contact_us.asp?pageID=bbbs&subID=cu"
			},
			Grande: {
				displayName: "Grande Communications",
				resourceID: "usa",
				supportMsg: ["Questions about your Grande account? ", "Contact", " Grande support."],
				supportURL: "http://mygrande.com/contactus/"
			},
			auth_surewest_net: {
				displayName: "SureWest",
				introURL: "http://assets.huluim.com/prerolls/surewest_H264_650.flv",
				resourceID: "usa",
				supportMsg: ["Questions about your SureWest account? ", "Contact", " SureWest support."],
				supportURL: "http://www.surewest.com/contact/"
			},
			Cablevision: {
				displayName: "Optimum",
				introURL: "http://assets.huluim.com/prerolls/optimum_H264_650.flv",
				resourceID: "usa",
				supportMsg: ["Questions about your Optimum account? ", "Contact", " Optimum support."],
				supportURL: "http://www.optimum.net/Support"
			},
			"consolidated_auth-gateway_net": {
				displayName: "Consolidated Communications",
				introURL: "http://assets.huluim.com/prerolls/consolidated_H264_650.flv",
				resourceID: "usa",
				supportMsg: ["Questions about your Consolidated Communications account? ", "Contact", " Consolidated Communications support."],
				supportURL: "http://www.consolidated.com/contact-us/"
			}
		},
		getProviders: function() {
			return Hulu.AdobePass.PROVIDERS;
		}
	};
}.call(this),
function() {
	Hulu.Twitter = {
		DEFAULT_SHORT_URL_LEN: 22,
		DEFAULT_SHORT_URL_LEN_HTTPS: 23,
		MAX_SHARE_TEXT_LEN: 140,
		TWITTER_CONFIG_URL: "https://api.twitter.com/1/help/configuration.json",
		_config: null,
		init: function(a) {
			this._config = a;
		},
		_getShortUrlLength: function(a) {
			var b = a && /^https:/.test(a),
				c = b ? this.DEFAULT_SHORT_URL_LEN_HTTPS : this.DEFAULT_SHORT_URL_LEN;
			return this._config && (b && this._config.short_url_length_https ? c = this._config.short_url_length_https : this._config.short_url_length && (c = this._config.short_url_length)), c;
		},
		calTruncateLen: function(a, b) {
			var c = this._getShortUrlLength(b) + a.length;
			return c > this.MAX_SHARE_TEXT_LEN ? c - this.MAX_SHARE_TEXT_LEN : 0;
		}
	};
}.call(this), $(document).ready(function() {
	$.ajax({
		url: Hulu.Twitter.TWITTER_CONFIG_URL,
		type: "get",
		dataType: "jsonp"
	}).done(function(a) {
		Hulu.Twitter.init(a);
	});
}), window.jsLoaded.applicationFrameWork = !0, window.jsLoaded.applicationFrameWorkLoadedTime = new Date;;