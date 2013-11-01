angular.module("dg", ["ngRoute", "ngTouch", "ngAnimate", "ngResource", "ngSanitize", "dgConfig", "dgCommon", "dgHome", "dgUser", "dgSearch", "dgMusic", "dgPage", "dgPost", "dgConnect", "dgSetting", "dgFeedback", "dgWizard", "dgTemplates"]).controller("DragonCtrl", ["$scope", "$window", "$timeout", "$location", "G", "Meta", "Like", "Flash", "Device", "Player", "Layout", "Tracker", "Session", "PlaybackState",
	function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
		"use strict"; 
		m.requestCurrentUser(), this.g = e, this.meta = f, this.like = g, this.flash = h, this.layout = k, this.device = i, this.player = j, this.session = m, this.location = d, this.modernizr = Modernizr, this.playbackState = n;
		var o, p, q = angular.element(b);
		q.bind("scroll touchmove", function() {
			p = q[0].scrollY, a.$apply(function() {
				e.hideStickyElement = 0 >= p ? !1 : !0, c.cancel(o), o = c(function() {
					e.hideStickyElement = !1
				}, 500)
			})
		}), this.toggleMobileNav = function(a) {
			return e.mobileNavExpanded = angular.isDefined(a) ? a : !e.mobileNavExpanded, e.mobileNavExpanded
		}, this.whatShouldIDo = function() {
			i.isDesktop() ? d.url("/") : this.toggleMobileNav()
		}
	}
]), angular.module("dg").config(["$httpProvider", "$routeProvider", "$locationProvider",
	function(a, b, c) {
		"use strict";
		a.defaults.headers.common["Content-Type"] = "application/json", c.hashPrefix("!").html5Mode(!0), b.when("/", {
			controller: "HomeCtrl as home",
			templateUrl: "views/home/home.html"
		}).when("/wizard", {
			redirectTo: "/wizard/profile"
		}).when("/wizard/profile", {
			title: "完善资料",
			layout: "1col",
			controller: "WizardProfileCtrl as wizard",
			templateUrl: "views/wizard/profile.html",
			loginRequired: !0
		}).when("/wizard/social", {
			title: "添加好友",
			layout: "1col",
			controller: "WizardSocialCtrl as wizardSocial",
			templateUrl: "views/wizard/social.html",
			loginRequired: !0
		}).when("/explore", {
			title: "探索",
			controller: "ExploreCtrl as explore",
			templateUrl: "views/home/explore.html",
			loginRequired: !0
		}).when("/about", {
			title: "关于合拍",
			layout: "1col",
			templateUrl: "views/page/about.html"
		}).when("/links", {
			title: "友情链接",
			controller: "LinkCtrl as link",
			templateUrl: "views/page/links.html"
		}).when("/404", {
			title: "找不到此页面",
			layout: "1col",
			templateUrl: "views/page/404.html"
		}).when("/connect", {
			redirectTo: "/connect/like"
		}).when("/connect/message", {
			title: "私信",
			controller: "MessageListCtrl",
			templateUrl: "views/connect/message/conversation.html",
			loginRequired: !0
		}).when("/connect/message/:username", {
			title: "私信",
			controller: "MessageDetailCtrl",
			templateUrl: "views/connect/message/message.html",
			loginRequired: !0
		}).when("/connect/like", {
			title: "赞",
			controller: "NotificationCtrl",
			templateUrl: "views/connect/like.html",
			loginRequired: !0
		}).when("/connect/follow", {
			title: "关注",
			controller: "NotificationCtrl",
			templateUrl: "views/connect/follow.html",
			loginRequired: !0
		}).when("/connect/comment", {
			title: "评论",
			controller: "NotificationCtrl",
			templateUrl: "views/connect/comment.html",
			loginRequired: !0
		}).when("/signup", {
			title: "注册",
			controller: "AuthCtrl as signup",
			templateUrl: "views/user/auth/signup.html"
		}).when("/login", {
			title: "登录",
			controller: "AuthCtrl as login",
			templateUrl: "views/user/auth/login.html"
		}).when("/search", {
			title: "搜索",
			controller: "SearchCtrl as search",
			templateUrl: "views/search/search.html"
		}).when("/music", {
			title: "音乐",
			controller: "MusicListCtrl as music",
			templateUrl: "views/music/music-list.html"
		}).when("/music/new", {
			title: "上传音乐",
			controller: "MusicUploadingCtrl as uploading",
			templateUrl: "views/music/uploading.html",
			loginRequired: !0
		}).when("/music/:musicId", {
			controller: "MusicCtrl",
			templateUrl: "views/music/music.html"
		}).when("/music/:musicId/update", {
			controller: "MusicUploadingCtrl as uploading",
			templateUrl: "views/music/uploading.html",
			loginRequired: !0
		}).when("/posts", {
			title: "合作信息",
			controller: "PostsCtrl as posts",
			templateUrl: "views/post/posts.html"
		}).when("/posts/new", {
			title: "发布合作信息",
			controller: "NewPostCtrl as newPost",
			templateUrl: "views/post/new.html",
			loginRequired: !0
		}).when("/posts/:postId", {
			controller: "PostCtrl",
			templateUrl: "views/post/post.html"
		}).when("/posts/:postId/update", {
			controller: "NewPostCtrl as newPost",
			templateUrl: "views/post/new.html",
			loginRequired: !0
		}).when("/tags/:tagId", {
			controller: "TagCtrl as tag",
			templateUrl: "views/search/tag.html"
		}).when("/feedback", {
			title: "反馈",
			controller: "FeedbackCtrl",
			templateUrl: "views/feedback/feedback.html",
			loginRequired: !0
		}).when("/settings", {
			redirectTo: "/settings/account"
		}).when("/settings/account", {
			title: "账号设置",
			controller: "SettingAccountCtrl as setting",
			templateUrl: "views/setting/account.html",
			loginRequired: !0
		}).when("/settings/password", {
			title: "密码设置",
			controller: "SettingAccountCtrl as setting",
			templateUrl: "views/setting/password.html",
			loginRequired: !0
		}).when("/settings/notifications", {
			title: "邮件通知设置",
			controller: "SettingNotifCtrl as setting",
			templateUrl: "views/setting/notification.html",
			loginRequired: !0
		}).when("/settings/profile", {
			title: "个人资料设置",
			controller: "SettingProfileCtrl as setting",
			templateUrl: "views/setting/profile.html",
			loginRequired: !0
		}).when("/users", {
			title: "用户",
			controller: "UserListCtrl as users",
			templateUrl: "views/user/users.html"
		}).when("/:username", {
			controller: "UserActivityCtrl",
			templateUrl: "views/user/profile/activity.html",
			caseInsensitiveMatch: !0
		}).when("/:username/music", {
			controller: "UserMusicCtrl as userMusic",
			templateUrl: "views/user/profile/music.html",
			caseInsensitiveMatch: !0
		}).when("/:username/posts", {
			controller: "UserPostsCtrl as userPosts",
			templateUrl: "views/user/profile/post.html",
			caseInsensitiveMatch: !0
		}).when("/:username/:type", {
			controller: "UserFollowCtrl",
			templateUrl: "views/user/profile/follow.html",
			caseInsensitiveMatch: !0
		}).otherwise({
			title: "找不到此页面",
			layout: "1col",
			templateUrl: "views/page/404.html"
		})
	}
]), angular.module("dgConfig", ["restangular", "dgSharing"]).constant("sessionPrefix", "/users").constant("apiPrefix", "/v1").config(["SharingProvider",
	function(a) {
		"use strict";
		a.settings.jiathisUid = "1373659662160721", a.settings.appKey = {
			tqq: "801186114",
			tsina: "3633818594",
			douban: "04ee4bdc9db6f50d0ecae395d924df27"
		}
	}
]).config(["RestangularProvider", "apiPrefix",
	function(a, b) {
		"use strict";
		a.setBaseUrl(b), a.requestParams.get = {
			per: 30
		}
	}
]), angular.module("dgCommon", ["gaiamagic", "dgMeta", "dgDevice", "dgTreasure", "dgLayout", "dgQuery", "dgComment", "dgError", "dgAnalytics", "dgTracker", "dgLike", "dgFollow", "dgAction", "dgSharing", "dgTaxonomy", "dgNavigation", "dgConversation", "dgImage", "dgSlider", "dgFlash", "dgUpload"]), angular.module("dgMeta", []).factory("Meta", ["$rootScope",
	function(a) {
		"use strict";
		var b = "合拍",
			c = "连接每一位音乐人",
			d = " - ",
			e = {
				title: b + d + c,
				description: "真正属于音乐人的垂直音乐社交网站，不论幕前幕后、曲风、水平、地区都能找到你所需要的。来上传作品，发布合作信息，认识新朋友，扩展机会，让所有可能性在你手中展开。",
				setTitle: function(a) {
					e.title = a + d + b
				},
				setDescription: function(a) {
					e.description = a
				}
			};
		return a.$on("$routeChangeSuccess", function(a, b) {
			angular.isDefined(b.title) && e.setTitle(b.title)
		}), e
	}
]), angular.module("dgDevice", []).factory("Device", ["$window",
	function(a) {
		"use strict";
		var b = {
			width: function() {
				return a.innerWidth || a.document.documentElement.clientWidth
			},
			isPhone: function() {
				return b.width() < 768
			},
			isTablet: function() {
				return b.width() >= 768 && b.width() < 980
			},
			isDesktop: function() {
				return b.width() >= 980
			},
			pixelRatio: a.devicePixelRatio >= 1.5 ? 2 : 1
		};
		return b
	}
]), angular.module("dgTreasure", []).factory("G", ["$rootScope", "$location",
	function(a, b) {
		"use strict";
		var c = {
			searchString: "",
			hideStickyElement: !1,
			mobileNavExpanded: !1
		}, d = "search";
		return a.$on("$routeChangeSuccess", function() {
			b.path().substring(0, d.length) !== d && (c.searchString = "")
		}), a.$on("$locationChangeSuccess", function() {
			c.isSearchPage = "/search" === b.path() ? !0 : !1
		}), a.$on("$routeChangeSuccess", function(a, b, d) {
			angular.isDefined(d) && (c.mobileNavExpanded = !1)
		}), c
	}
]), angular.module("dgLayout", []).run(["$rootScope", "Layout",
	function(a, b) {
		"use strict";
		a.$on("$routeChangeSuccess", function(a, c) {
			b.current = c.layout || b.defaultLayout
		})
	}
]).factory("Layout", function() {
	"use strict";
	return {
		defaultLayout: "2cols"
	}
}), angular.module("dgQuery", []).service("Query", ["$timeout", "Tracker",
	function(a, b) {
		"use strict";
		var c = b.objects,
			d = function() {
				var b = this;
				this.page = 1, this.paused = !1, this.get = function(d, e) {
					b.paused = !0, angular.isDefined(e) && e && (b.page = 1, d.scope.objects = [], d.scope.isDataEmpty = !1);
					var f = angular.extend({
						page: b.page
					}, d.extraParams),
						g = d.thing.getList(f).then(function(c) {
							return d.scope.objects = angular.isDefined(d.scope.objects) ? d.scope.objects.concat(c) : c, c.length > 0 && (b.page++, a(function() {
								b.paused = !1
							}, 1e3)), d.scope.isDataEmpty = 0 === d.scope.objects.length && 0 === c.length ? !0 : !1, c
						});
					c.addPromise(g)
				}
			};
		return {
			getInstance: function() {
				return new d
			}
		}
	}
]), angular.module("dgError", []).config(["$httpProvider",
	function(a) {
		"use strict";
		a.interceptors.push(["$q", "Error",
			function(a, b) {
				return {
					responseError: function(c) {
						return b.report(c.config.method + " " + c.config.url + " return " + c.status, {
							requestUrl: c.config.url,
							requestMethod: c.config.method
						}), a.reject(c)
					}
				}
			}
		])
	}
]).factory("Error", ["$rootScope",
	function(a) {
		"use strict";
		var b = {
			setUser: function(a) {
				a ? (Raven.setUser(a), mixpanel.identify(a.id), mixpanel.name_tag(a.name + " (" + a.email + ")"), mixpanel.people.set({
					$email: a.email,
					$created: a.created,
					$username: a.name,
					$first_name: a.nickname,
					$last_login: new Date
				})) : (Raven.setUser(), mixpanel.cookie.remove())
			},
			report: function(a, b) {
				401 !== a && 404 !== a && (angular.isString(a) || angular.isNumber(a) ? Raven.captureMessage(a, {
					tags: b
				}) : Raven.captureException(a, {
					tags: b
				}))
			}
		};
		return a.$on("auth:logoutSuccess", function() {
			b.setUser()
		}), a.$on("auth:currentUserLoaded", function(a, c) {
			b.setUser(c)
		}), b
	}
]), angular.module("dgAnalytics", ["angulartics", "angulartics.ga", "angulartics.mixpanel"]), angular.module("dgLike", []).factory("Like", ["$analytics", "Restangular",
	function(a, b) {
		"use strict";
		return {
			toggle: function(c) {
				var d = c.like_count,
					e = b.one("user/liked/music", c.id);
				c.liked ? e.remove().then(function() {
					c.liked = !1, c.like_count > d - 1 && (c.like_count = c.like_count - 1), a.eventTrack("unlike", {
						category: "Music"
					})
				}) : e.put().then(function() {
					c.liked = !0, c.like_count < d + 1 && (c.like_count = c.like_count + 1), a.eventTrack("like", {
						category: "Music"
					})
				})
			}
		}
	}
]), angular.module("dgFollow", []).directive("dgFollow", ["$location", "Session", "$analytics", "Restangular",
	function(a, b, c, d) {
		"use strict";
		return {
			scope: {
				target: "=dgFollow"
			},
			replace: !0,
			restrict: "EA",
			templateUrl: "views/partials/follow.html",
			link: function(a) {
				a.session = b;
				var e = d.one("user/following", a.target.name);
				a.toggleFollow = function() {
					angular.isDefined(a.target.is_following) && (a.target.is_following ? e.remove().then(function() {
						c.eventTrack("unfollow", {
							category: "User"
						}), a.target.is_following = !a.target.is_following, a.target.followers_count--
					}) : e.put().then(function() {
						c.eventTrack("follow", {
							category: "User"
						}), a.target.is_following = !a.target.is_following, a.target.followers_count++
					}))
				}
			}
		}
	}
]), angular.module("dgTracker", ["ajoslin.promise-tracker"]).factory("Tracker", ["promiseTracker",
	function(a) {
		"use strict";
		return {
			session: a("session"),
			objects: a("objects")
		}
	}
]).directive("dgTracker", ["$timeout", "promiseTracker",
	function(a, b) {
		"use strict";
		var c = {
			color: "#888",
			lines: 10,
			width: 2,
			length: 6,
			radius: 5,
			direction: -1
		};
		return {
			scope: !0,
			replace: !0,
			restrict: "EA",
			templateUrl: function(a, b) {
				return angular.isDefined(b.type) ? "views/partials/tracker/" + b.type + ".html" : "views/partials/tracker/" + b.dgTracker + ".html"
			},
			link: function(d, e, f) {
				a(function() {
					new Spinner(c).spin(e.find("i")[0])
				}, 500), d.tracker = b(f.dgTracker), d.tracker.on("start", function() {
					d.isHidden = !1, d.onSuccess = null, d.onFailure = null
				}).on("error", function() {
					d.onFailure = !0
				}).on("success", function(b) {
					d.onSuccess = !0, a(function() {
						d.onSuccess = !1
					}, 3e3), angular.isArray(b) && !b.length ? d.onLastPage = !0 : d.isHidden = !0
				})
			}
		}
	}
]), angular.module("dgComment", []).directive("dgComment", ["Conversation", "Restangular",
	function(a, b) {
		"use strict";
		var c = {
			post: "posts",
			music: "music"
		};
		return {
			scope: {
				hostId: "@dgComment",
				hostType: "@"
			},
			replace: !0,
			restrict: "EA",
			templateUrl: "views/partials/comment.html",
			link: function(d) {
				var e = b.one(c[d.hostType], d.hostId).all("comments");
				d.$watch("hostId", function() {
					angular.isDefined(d.hostId) && "" !== d.hostId && e.getList().then(function(a) {
						d.comments = a
					})
				}), d.removeComment = function(b) {
					a.removeMessage({
						type: "comment",
						host: {
							id: d.hostId,
							type: d.hostType
						},
						message: b,
						messages: d.comments
					})
				}
			}
		}
	}
]), angular.module("dgAction", []).factory("Action", ["Flash", "Restangular",
	function(a, b) {
		"use strict";
		var c = {
			post: {
				url: "posts",
				name: "合作信息"
			},
			music: {
				url: "music",
				name: "音乐"
			}
		}, d = {
				remove: function(d, e, f) {
					var g = b.one(c[f].url, d.id);
					g.remove().then(function() {
						e && e.splice(e.indexOf(d), 1), a.pushMessage(c[f].name + "已删除")
					}, function() {
						a.pushMessage(c[f].name + "删除失败，请重试")
					})
				}
			};
		return d
	}
]).controller("ActionCtrl", ["$scope",
	function(a) {
		"use strict";
		var b, c = function(b) {
				switch (b) {
					case "comment":
					case "sharing":
						return a.thing;
					case "reply":
						return a.object;
					default:
						throw "unknow actionType: " + b
				}
			};
		return a.dispatch = function(d, e) {
			a.actionType = d, a.actionTarget = angular.extend(c(d), {
				type: e || "music"
			}), a.extendedStatus = d !== b ? !0 : !a.extendedStatus, b = d
		}, a
	}
]), angular.module("dgSharing", []).provider("Sharing", function() {
	"use strict";
	var a = {
		appKey: {}
	}, b = {
			settings: a,
			$get: ["$window", "$location",
				function(b, c) {
					return {
						getLink: function(d) {
							var e = angular.isDefined(d.url) ? d.url : c.absUrl(),
								f = angular.isDefined(d.title) ? d.title : b.document.title,
								g = angular.isDefined(d.pic),
								h = angular.isDefined(a.jiathisUid),
								i = angular.isDefined(d.summary),
								j = a.appKey[d.service],
								k = angular.isDefined(j),
								l = "http://www.jiathis.com/send/?webid=" + d.service + "&url=" + e + "&title=" + f + (g ? "&pic=" + d.pic : "") + (h ? "&uid=" + a.jiathisUid : "") + (i ? "&summary=" + d.summary : "") + (k ? "&appkey=" + j : "");
							return l
						}
					}
				}
			]
		};
	return b
}).controller("SharingCtrl", ["$location", "Sharing",
	function(a, b) {
		"use strict";
		var c = a.protocol() + "://" + a.host();
		this.getLink = function(a, d, e) {
			var f, g, h;
			switch (e) {
				case "post":
					f = d.title, g = {
						url: c + "/posts/" + d.id
					}, h = "分享合作信息《" + f + "》。";
					break;
				case "user":
					f = d.nickname, g = {
						url: c + "/" + d.name,
						pic: d.avatars.origin
					}, h = "分享音乐人 " + f + "。";
					break;
				default:
					f = d.name, g = {
						url: c + "/music/" + d.id,
						pic: d.covers.origin
					}, h = "分享 " + d.user.nickname + " 的《" + f + "》。"
			}
			switch (a) {
				case "tsina":
					g = angular.extend(g, {
						title: h + "（来自@合拍网）"
					});
					break;
				case "tqq":
					g = angular.extend(g, {
						title: h + "（来自 @hepaimusic）"
					});
					break;
				default:
					g = angular.extend(g, {
						title: f,
						summary: h
					})
			}
			return g = angular.extend(g, {
				service: a
			}), b.getLink(g)
		}
	}
]), angular.module("dgTaxonomy", []).factory("Taxonomy", function() {
	"use strict";
	var a = {
		isTagActive: function(a, b) {
			return b ? -1 !== b.indexOf(a) : !1
		},
		activeTag: function(a, b) {
			return b.multi_selectable ? b.activeTags.push(a) : b.activeTags = [a], b.activeTags
		},
		deactiveTag: function(a, b) {
			var c = _.findIndex(b.activeTags, {
				id: a.id
			});
			return b.activeTags.splice(c, 1), b.activeTags
		},
		selectTag: function(b, c) {
			return c.activeTags = c.activeTags || [], c.activeTags = a.isTagActive(b, c.activeTags) ? a.deactiveTag(b, c) : a.activeTag(b, c), c.activeTags
		},
		initActiveTags: function(b, c, d) {
			d && _.find(d, {
				id: b.id
			}) && (c.activeTags = a.selectTag(b, c))
		},
		getTagIds: function(a) {
			var b = [];
			return angular.forEach(a, function(a) {
				angular.forEach(a.activeTags, function(a) {
					b = b.concat(a.id)
				})
			}), b
		}
	};
	return a
}).directive("dgTaxonomy", ["Restangular",
	function(a) {
		"use strict";
		return {
			restrict: "EA",
			controller: ["$scope", "$element", "$attrs",
				function(b, c, d) {
					var e = this;
					e.taxonomyName = d.taxonomyName, a.all(d.dgTaxonomy).getList().then(function(a) {
						return e.taxonomies = a, a
					})
				}
			],
			controllerAs: "taxonomy"
		}
	}
]), angular.module("dgNavigation", []).controller("NavCtrl", ["$location", "G", "Tracker",
	function(a, b, c) {
		"use strict";
		this.g = b, this.tracker = c.session, this.submit = function() {
			a.path("/search").search("q", b.searchString)
		}
	}
]).directive("dgNavPush", ["$animate", "G",
	function(a, b) {
		"use strict";
		return {
			restrict: "EA",
			link: function(c, d, e) {
				c.g = b;
				var f = e.dgNavPush;
				c.$watch("g.mobileNavExpanded", function(b) {
					b ? a.addClass(d, f) : a.removeClass(d, f)
				})
			}
		}
	}
]).directive("dgMatchPath", ["$location",
	function(a) {
		"use strict";
		return {
			scope: !0,
			restrict: "EA",
			link: function(b, c, d) {
				var e = function(a, b, c) {
					return c ? a === b : a.substring(0, b.length) === b
				};
				b.testPathMatching = function() {
					d.$observe("href", function(c, f) {
						c !== f && (b.pathMatched = e(a.path(), c, d.strict))
					})
				}, b.testPathMatching(), b.$on("$routeChangeSuccess", function() {
					b.testPathMatching()
				})
			}
		}
	}
]).controller("SearchMatchingCtrl", ["$location",
	function(a) {
		"use strict";
		this.location = a, this.test = function(b, c) {
			return a.search()[b] === c
		}
	}
]), angular.module("dgConversation", []).factory("Conversation", ["Flash", "$analytics", "Restangular",
	function(a, b, c) {
		"use strict";
		var d = {
			post: "posts",
			music: "music"
		};
		return {
			addMessage: function(e) {
				if (!e.message || !e.message.content) return a.pushMessage("请输入内容", "warning"), void 0;
				if (e.require) {
					var f = e.message.content.length,
						g = e.require.actionTarget.actor.name.length;
					if (f === g + 2) return a.pushMessage("请输入回复", "warning"), void 0
				}
				var h = {
					comment: c.one(d[e.host.type], e.host.id).all("comments"),
					message: c.all("messages/" + e.host.id),
					feedback: c.all("feedback")
				};
				h[e.type].post({
					content: e.message.content
				}).then(function(a) {
					var c = e.type.charAt(0).toUpperCase() + e.type.slice(1);
					b.eventTrack("create", {
						category: c,
						label: e.host.type
					}), e.require && (e.require.extendedStatus = !1), e.messages.unshift(a), e.message.content = "", e.messageForm.$setPristine()
				})
			},
			removeMessage: function(a) {
				var b = {
					comment: c.one(d[a.host.type], a.host.id).one("comments", a.message.id),
					message: c.one("messages", a.host.id).one(a.message.id),
					conversation: c.one("messages", a.host.id)
				};
				b[a.type].remove().then(function() {
					a.messages.splice(a.messages.indexOf(a.message), 1)
				})
			}
		}
	}
]).directive("dgNewMessage", ["Conversation",
	function(a) {
		"use strict";
		return {
			scope: {
				type: "@dgNewMessage",
				hostId: "=",
				hostType: "=",
				messages: "=",
				placeholder: "@"
			},
			replace: !0,
			restrict: "EA",
			require: "?^ngController",
			templateUrl: "views/partials/conversation/message-new.html",
			link: function(b, c, d, e) {
				var f, g = c.find("textarea");
				b.message = {}, angular.isDefined(e) && "reply" === e.actionType && (f = e, b.message.content = "@" + f.actionTarget.actor.name + " ", g.focus()), b.addMessage = function() {
					a.addMessage({
						type: b.type,
						host: {
							id: b.hostId,
							type: b.hostType
						},
						message: b.message,
						messages: b.messages,
						messageForm: b.messageForm,
						require: f
					})
				}
			}
		}
	}
]).directive("dgLinkify", ["$location",
	function(a) {
		"use strict";
		return {
			restrict: "EA",
			link: function(b, c, d) {
				d.$observe("ngHref", function(d) {
					c.css("cursor", "pointer"), c.bind("click", function() {
						b.$apply(function() {
							a.path(d)
						})
					})
				})
			}
		}
	}
]), angular.module("dgImage", []).directive("dgImage", ["Device",
	function(a) {
		"use strict";
		return {
			restrict: "EA",
			link: function(b, c, d) {
				d.$observe("dgImage", function(b) {
					var c = b + "?imageView/1/w/" + d.width * a.pixelRatio + "/h/" + d.height * a.pixelRatio + "/q/100/format/jpg";
					d.$set("src", c)
				})
			}
		}
	}
]).directive("dgIcon", function() {
	"use strict";
	return {
		restrict: "A",
		link: function(a, b, c) {
			b.addClass("i-" + c.dgIcon);
			var d = "i-" + c.dgIcon + "Active";
			b.bind("mouseenter focus", function() {
				b.addClass(d)
			}), b.bind("mouseleave blur", function() {
				b.removeClass(d)
			}), c.iconSize && (b[0].style.cssText += ";width:" + c.iconSize + "px;height:" + c.iconSize + "px;")
		}
	}
}), angular.module("dgSlider", []).directive("dgSlider", [
	function() {
		"use strict";
		var a = function(a, b, c) {
			var d, e, f, g, h = 0,
				i = function() {
					h = new Date, f = null, g = a.apply(d, e)
				};
			return function() {
				var j = new Date;
				h || c !== !1 || (h = j);
				var k = b - (j - h);
				return d = this, e = arguments, 0 >= k ? (clearTimeout(f), f = null, h = j, g = a.apply(d, e)) : f || (f = setTimeout(i, k)), g
			}
		}, b = {
				bar: ".bar",
				handle: ".handle"
			}, c = function(a, b, c) {
				a.width(c + "%"), b.css({
					left: c + "%"
				})
			};
		return {
			restrict: "A",
			scope: {
				bar: "@sliderBar",
				handle: "@sliderHandle",
				sliderValue: "=",
				sliderChange: "&"
			},
			link: function(d, e) {
				var f = e,
					g = f.find(d.bar || b.bar),
					h = f.find(d.handle || b.handle);
				c(g, h, d.sliderValue);
				var i, j, k = a(function(a) {
						var b, e = a.pageX - i;
						b = 0 > e ? 0 : e > j ? 100 : 100 * (e / j), c(g, h, b), d.sliderChange({
							sliderValue: b
						}), d.sliderValue = Math.round(b), d.$apply(), window.getSelection ? window.getSelection().removeAllRanges() : document.selection && document.selection.empty()
					}, 10);
				h.on("mousedown", function(a) {
					a.preventDefault(), i = f.offset().left, j = f.width(), angular.element(document).on("mousemove", k), angular.element(document).one("mouseup", function() {
						angular.element(document).off("mousemove", k)
					})
				})
			}
		}
	}
]), angular.module("dgFlash", []).factory("Flash", ["$rootScope", "$timeout",
	function(a, b) {
		"use strict";
		var c = {
			messages: [],
			removeMessage: function(a) {
				c.messages.splice(c.messages.indexOf(a), 1)
			},
			pushMessage: function(a, d, e) {
				var f = {
					content: a,
					category: d || "info"
				};
				c.messages.push(f), b(function() {
					c.removeMessage(f)
				}, e || 5e3)
			}
		};
		return c
	}
]), angular.module("dgUpload", []).directive("dgUploader", ["$http", "$timeout", "Flash", "Error", "apiPrefix",
	function(a, b, c, d, e) {
		"use strict";
		var f = {
			audio: {
				title: "请选择音频文件",
				extensions: "mp3,wav,aac"
			},
			image: {
				title: "请选择图片",
				extensions: "gif,jpg,jpeg,png"
			}
		};
		return {
			scope: {
				uploadType: "@",
				targetModel: "=?",
				uploadCallback: "&"
			},
			replace: !0,
			restrict: "EA",
			transclude: !0,
			templateUrl: function(a, b) {
				return angular.isDefined(b.templateName) ? "views/partials/uploading/" + b.templateName + ".html" : "views/partials/uploading/dragndrop.html"
			},
			controller: ["$scope", "$element", "$attrs",
				function(g, h, i) {
					g.uploadState = "normal", g.uploadThing = i.uploadThing, g.supportFeatures = {
						dragndrop: Modernizr.draganddrop && !Modernizr.touch
					}, g.getToken = a.get(e + "/upload/token?type=" + i.uploadType).then(function(a) {
						return g.uploader = new plupload.Uploader({
							url: "http://up.qbox.me:80/",
							runtimes: "flash,html5,html4",
							container: h[0],
							browse_button: h.find("a")[0],
							flash_swf_url: "/components/plupload/js/Moxie.swf",
							file_data_name: "file",
							multipart_params: {},
							filters: {
								mime_types: [f[i.uploadType]],
								max_file_size: "100mb"
							},
							init: {
								FilesAdded: function(b) {
									b.settings.multipart_params = {
										key: i.uploadFolder + "/" + uuid.v4(),
										token: a.data.token
									}, b.start()
								},
								StateChanged: function(a) {
									a.state === plupload.STARTED && g.$apply(function() {
										g.uploadState = "uploading"
									})
								},
								UploadProgress: function(a, b) {
									g.$apply(function() {
										g.percentUploaded = b.percent + "%"
									})
								},
								FileUploaded: function(a, c, d) {
									var e = angular.fromJson(d.response);
									g.$apply(function() {
										e.success ? (g.uploadState = "success", g.targetModel = "https://" + e.domain + "/" + e.key, g.uploadCallback && g.uploadCallback({
											url: g.targetModel
										})) : g.uploadState = "failed", "image" === g.uploadType && b(function() {
											g.percentUploaded = "", g.uploadState = "normal"
										}, 3e3)
									}), a.refresh()
								},
								Error: function(a, b) {
									d.report(b), a.refresh()
								}
							}
						}), g.uploader.init(), a
					}, function() {
						c.pushMessage("非常抱歉，网站发生错误，我们已经记录下这个问题，如果你有疑问请通过反馈联系我们", "warning", 1e4), d.report("Failed to get uploading Token")
					})
				}
			]
		}
	}
]), angular.module("gaiamagic", ["gaiamagic.humanizeTime"]), angular.module("dgHome", ["infinite-scroll"]).controller("HomeCtrl", ["$scope", "Session",
	function(a, b) {
		"use strict";
		var c = this;
		a.session = b, a.$watch("session.currentUser", function(a) {
			c.templateName = a ? "activity" : "explore"
		})
	}
]).controller("ExploreCtrl", ["Query", "Restangular",
	function(a, b) {
		"use strict";
		var c = this;
		c.query = a.getInstance(), c.getObjects = function() {
			c.query.get({
				scope: c,
				thing: b.all("recommendations")
			})
		}
	}
]).controller("TimelineCtrl", ["Meta", "Query", "Restangular",
	function(a, b, c) {
		"use strict";
		var d = this;
		a.setTitle("首页"), d.query = b.getInstance(), d.getObjects = function() {
			d.query.get({
				scope: d,
				thing: c.all("activities")
			})
		}
	}
]), angular.module("dgUser", ["dgUserAuth", "dgUserProfile", "dgUsers"]).factory("UserRestangular", ["$injector", "apiPrefix", "Restangular",
	function(a, b, c) {
		"use strict";
		var d;
		return c.withConfig(function(c) {
			c.setBaseUrl(b), c.requestParams.get = null, c.setDefaultHttpFields({
				tracker: "session",
				ignoreAuthModule: !0
			}), c.setResponseInterceptor(function(b) {
				return d = a.get("Session"), d.currentUser = b, b
			})
		})
	}
]), angular.module("dgUsers", []).controller("UserListCtrl", ["Query", "Restangular",
	function(a, b) {
		"use strict";
		this.query = a.getInstance(), this.getObjects = function() {
			this.query.get({
				scope: this,
				thing: b.all("users"),
				extraParams: {
					with_avatar: !0
				}
			})
		}
	}
]), angular.module("dgUserAuth", ["dgUser", "dgConfig", "restangular", "http-auth-interceptor"]).factory("Session", ["$q", "$http", "$location", "$rootScope", "sessionPrefix", "UserRestangular",
	function(a, b, c, d, e, f) {
		"use strict";

		function g(a) {
			a = a || "/", c.url(a)
		}
		var h = {
			currentUser: null,
			logout: function() {
				b({
					url: e + "/sign_out.json",
					method: "DELETE"
				}).success(function() {
					d.$broadcast("auth:logoutSuccess"), h.currentUser = null, c.path("/")
				})
			},
			requestCurrentUser: function() {
				return h.currentUser ? a.when(h.currentUser) : f.one("user").get().then(function(a) {
					return d.$broadcast("auth:currentUserLoaded", a), h.currentUser = a, a
				})
			},
			isAuthenticated: function() {
				return !!h.currentUser
			}
		};
		return d.$on("auth:currentUserLoaded", function(a, b) {
			h.currentUser = b
		}), d.$on("auth:loginSuccess", function(a, b) {
			g(b)
		}), d.$on("event:auth-loginRequired", function() {
			c.path("/login")
		}), d.$on("$routeChangeSuccess", function(b, d) {
			d.loginRequired && h.requestCurrentUser().then(void 0, function(b) {
				c.url("/login?returnUrl=" + c.url()), a.reject(b)
			})
		}), h
	}
]).controller("AuthCtrl", ["$q", "$http", "$location", "$rootScope", "Flash", "Session", "authService", "$analytics", "sessionPrefix",
	function(a, b, c, d, e, f, g, h, i) {
		"use strict";
		var j = this;
		f.isAuthenticated() && f.requestCurrentUser().then(function(a) {
			return c.path("/"), a
		}, function(b) {
			f.logout(), a.reject(b)
		}), j.submitLogin = function() {
			b({
				url: i + "/sign_in.json",
				data: {
					user: {
						email: j.user.email,
						password: j.user.password,
						remember_me: "1"
					}
				},
				method: "POST",
				ignoreAuthModule: !0
			}).success(function(a) {
				h.eventTrack("login", {
					category: "User"
				}), d.$broadcast("auth:loginSuccess", c.search().returnUrl), d.$broadcast("auth:currentUserLoaded", a), g.loginConfirmed()
			}).error(function(a) {
				e.pushMessage(a.message), j.errors = a.errors
			})
		}, j.submitSignup = function() {
			b({
				url: i + ".json",
				data: {
					user: {
						name: j.user.name,
						email: j.user.email,
						password: j.user.password,
						password_confirmation: j.user.password
					}
				},
				method: "POST",
				ignoreAuthModule: !0
			}).success(function(a) {
				h.eventTrack("signup", {
					category: "User"
				}), d.$broadcast("auth:loginSuccess", c.search().returnUrl), d.$broadcast("auth:currentUserLoaded", a), e.pushMessage("恭喜！注册成功。", "success"), g.loginConfirmed()
			}).error(function(a) {
				j.errors = a.errors
			})
		}
	}
]), angular.module("dgUserProfile", ["dgUserActivity", "dgUserMusic", "dgUserPosts", "dgUserFollow"]), angular.module("dgUserActivity", []).controller("UserActivityCtrl", ["$scope", "$location", "$routeParams", "Meta", "Query", "Restangular",
	function(a, b, c, d, e, f) {
		"use strict";
		f.one("users", c.username).get().then(function(b) {
			a.user = b, d.setTitle(b.nickname)
		}, function() {
			b.url("/404")
		}), a.query = e.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: f.one("users", c.username).all("activities")
			})
		}
	}
]), angular.module("dgUserMusic", []).controller("UserMusicCtrl", ["$scope", "$location", "$routeParams", "Meta", "Flash", "Query", "Music", "Restangular",
	function(a, b, c, d, e, f, g, h) {
		"use strict";
		h.one("users", c.username).get().then(function(b) {
			a.user = b, d.setTitle(b.nickname + " 的音乐")
		}), a.query = f.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: h.one("users", c.username).all("music")
			})
		}, this.music = g
	}
]), angular.module("dgUserPosts", []).controller("UserPostsCtrl", ["$scope", "$routeParams", "Meta", "Query", "Action", "Restangular",
	function(a, b, c, d, e, f) {
		"use strict";
		var g = this;
		g.actions = e, f.one("users", b.username).get().then(function(b) {
			a.user = b, c.setTitle(b.nickname + " 的合作信息")
		}), g.query = d.getInstance(), g.getObjects = function() {
			g.query.get({
				scope: g,
				thing: f.one("users", b.username).all("posts"),
				extraParams: {
					without_owner: !1
				}
			})
		}
	}
]), angular.module("dgUserFollow", []).controller("UserFollowCtrl", ["$scope", "$location", "$routeParams", "Meta", "Query", "Restangular",
	function(a, b, c, d, e, f) {
		"use strict";
		f.one("users", c.username).get().then(function(b) {
			a.user = b, d.setTitle(b.nickname + ("following" === c.type ? " 的关注" : " 的粉丝"))
		}), -1 === ["following", "followers"].indexOf(c.type) && b.url("/404"), a.query = e.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: f.one("users", c.username).all(c.type)
			})
		}
	}
]), angular.module("dgSearch", ["dgTag"]).controller("SearchCtrl", ["$location", "$routeParams", "G", "Query", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		this.g = c, a.search().q !== c.searchString && (c.searchString = a.search().q), this.query = d.getInstance(), this.getObjects = function(d) {
			angular.isUndefined(c.searchString) || "" === c.searchString || (this.query.get({
				scope: this,
				thing: e.all("search"),
				extraParams: {
					q: c.searchString,
					c: b.type
				}
			}, d), a.search("q", c.searchString), this.lastSearchString = c.searchString)
		}, this.getObjects()
	}
]), angular.module("dgTag", []).controller("TagCtrl", ["$location", "$routeParams", "Query", "Restangular",
	function(a, b, c, d) {
		"use strict";
		var e = this;
		d.one("tags", b.tagId).get().then(function(a) {
			return e.object = a, a
		}), e.query = c.getInstance(), e.getObjects = function() {
			e.query.get({
				scope: this,
				thing: d.one("tags").all("taggable"),
				extraParams: {
					type: b.type,
					"slugs[]": b.tagId
				}
			})
		}
	}
]), angular.module("dgMusic", ["dgMusicPlayer", "dgMusicUploading"]).factory("Music", ["$location", "Flash", "Action", "Restangular",
	function(a, b, c, d) {
		"use strict";
		return {
			publish: function(c) {
				var e = d.one("music", c.id);
				e.published = !0, e.put().then(function(b) {
					a.path("/music/" + b.data.id)
				}, function(a) {
					var c = [];
					angular.forEach(a.data.errors, function(a) {
						c.push(a.field + a.message)
					}), b.pushMessage(a.data.message + "。" + c.join("，"), "warning")
				})
			},
			remove: c.remove
		}
	}
]).controller("MusicCtrl", ["$scope", "$location", "$routeParams", "Meta", "Music", "Restangular",
	function(a, b, c, d, e, f) {
		"use strict";
		a.actions = e, f.one("music", c.musicId).get().then(function(b) {
			return a.music = b, d.setTitle(b.name), b
		}, function(a) {
			404 === a.status && b.url("/404")
		})
	}
]).controller("MusicListCtrl", ["Query", "Restangular",
	function(a, b) {
		"use strict";
		this.query = a.getInstance(), this.getObjects = function() {
			this.query.get({
				scope: this,
				thing: b.all("music")
			})
		}
	}
]), angular.module("dgMusicPlayer", []).run(["Error",
	function(a) {
		"use strict";
		soundManager.setup({
			url: "/components/soundmanager/swf/",
			wmode: "transparent",
			preferFlash: !1,
			flashVersion: 9,
			ontimeout: function(b) {
				a.report("SoundManager 2 failed to start", {
					status: b
				})
			}
		})
	}
]).directive("progressBar", function() {
	"use strict";
	return {
		scope: {
			percentLoaded: "=",
			percentPlayed: "=",
			onSeek: "&"
		},
		replace: !0,
		restrict: "EA",
		templateUrl: "views/music/progress-bar.html",
		link: function(a, b) {
			var c = function(b) {
				var c = b.offsetX / b.currentTarget.clientWidth;
				a.onSeek({
					percentOffset: c
				})
			};
			b.on("mousedown", function(a) {
				c(a), b.on("mousemove", c), angular.element(document).one("mouseup", function() {
					b.off("mousemove", c)
				})
			})
		}
	}
}).factory("PlaybackState", function() {
	"use strict";
	var a = {
		states: {
			paused: "paused",
			stopped: "stopped",
			playing: "playing"
		},
		sounds: {},
		expanded: !1,
		lastMusic: null,
		getLastSound: function() {
			return a.sounds[a.lastMusic.id]
		},
		syncState: function(b, c) {
			angular.isDefined(a.sounds[b]) ? a.sounds[b].state = c : a.sounds[b] = {
				state: c
			}
		},
		toggleExpandStatus: function() {
			a.expanded = !a.expanded
		}
	};
	return a
}).factory("Player", ["$rootScope", "Restangular", "$analytics", "PlaybackState",
	function(a, b, c, d) {
		"use strict";
		var e = soundManager,
			f = d,
			g = {
				events: {
					onplay: function() {
						var a = this;
						f.syncState(a.id, f.states.playing), b.one("music", a.id).one("listen_count").put()
					},
					onstop: function() {
						var a = this;
						f.syncState(a.id, f.states.stopped)
					},
					onpause: function() {
						var a = this;
						f.syncState(a.id, f.states.paused)
					},
					onresume: function() {
						var a = this;
						f.syncState(a.id, f.states.playing)
					},
					onfinish: function() {
						var b = this;
						a.$apply(function() {
							f.syncState(b.id, f.states.stopped), f.sounds[b.id].timePlayed = b.position
						}), f.lastMusic.$next && g.play(f.lastMusic.$next)
					},
					whileloading: function() {
						var b = this;
						a.$apply(function() {
							f.sounds[b.id].percentLoaded = 100 * b.bytesLoaded / b.bytesTotal
						})
					},
					whileplaying: function() {
						var b = this;
						_.defer(function() {
							a.$apply(function() {
								f.sounds[b.id].percentPlayed = 100 * b.position / b.durationEstimate, f.sounds[b.id].timeTotal = b.durationEstimate, f.sounds[b.id].timeTotalHumanized = moment.duration(b.durationEstimate).minutes() + ":" + moment.duration(b.durationEstimate).seconds(), f.sounds[b.id].timePlayedHumanized = moment.duration(b.position).minutes() + ":" + moment.duration(b.position).seconds()
							})
						})
					}
				},
				createSound: function(a, b, c) {
					if (angular.isUndefined(e.getSoundById(a))) {
						var d = {
							id: a,
							url: b,
							type: angular.isDefined(c) ? c : "audio/mpeg"
						}, f = angular.extend(d, g.events);
						return e.createSound(f)
					}
					return e.sounds[a]
				},
				play: function(a) {
					g.createSound(a.id, a.audio_file).play(), a.listen_count++
				},
				seek: function(a) {
					f.getLastSound().state === f.states.stopped && (e.play(f.lastMusic.id), e.pause(f.lastMusic.id));
					var b = a * f.getLastSound().timeTotal;
					e.setPosition(f.lastMusic.id, b)
				},
				toggle: function(a) {
					if (f.lastMusic = a, angular.isDefined(f.sounds[a.id])) {
						var b = f.sounds[a.id].state;
						return b === f.states.stopped ? (e.pauseAll(), e.play(a.id)) : b === f.states.paused ? (e.pauseAll(), e.resume(a.id), c.eventTrack("play", {
							category: "Music"
						})) : b === f.states.playing && (e.pause(a.id), c.eventTrack("pause", {
							category: "Music"
						})), e.sounds[a.id]
					}
					return e.pauseAll(), g.play(a), c.eventTrack("play", {
						category: "Music"
					}), e.sounds[a.id]
				}
			};
		return Mousetrap.bind("space", function() {
			return f.lastMusic && a.$apply(function() {
				g.toggle(f.lastMusic)
			}), !1
		}), g
	}
]), angular.module("dgMusicUploading", []).controller("MusicUploadingCtrl", ["$scope", "$location", "$routeParams", "Flash", "Restangular", "$analytics", "promiseTracker",
	function(a, b, c, d, e, f, g) {
		"use strict";
		var h = this;
		if (e.all("music/types").getList().then(function(a) {
			return h.types = a, a
		}), e.all("music/genres").getList().then(function(a) {
			return h.genres = a, a
		}), h.inputTracker = g("uploading"), h.objectsTracker = g("objects"), angular.isDefined(c.musicId)) {
			var i = e.one("music", c.musicId).get().then(function(a) {
				return h.music = a, a
			});
			this.objectsTracker.addPromise(i)
		}
		this.submit = function() {
			if (angular.isUndefined(this.music)) return d.pushMessage("请上传音乐", "warning"), void 0;
			var a, c = h.music,
				g = angular.isDefined(c.id),
				i = {
					name: c.name,
					audio: c.audio,
					cover: c.cover,
					lyric: c.lyric,
					type_id: c.type ? c.type.id : null,
					genre_id: c.genre ? c.genre.id : null,
					published: c.published
				};
			if (g) {
				var j = e.one("music", c.id);
				angular.extend(j, i), a = j.put()
			} else {
				var k = e.one("music");
				angular.extend(k, i), a = k.post()
			}
			a.then(function(a) {
				return g || f.eventTrack("create", {
					category: "Music"
				}), h.music = a, b.url("/music/" + a.id), a
			}, function(a) {
				return h.errors = a.data.errors, a
			}), this.inputTracker.addPromise(a)
		}
	}
]), angular.module("dgPost", []).factory("EditPostUtils", function() {
	"use strict";
	return {
		insertContent: function(a, b) {
			var c, d, e, f = document.getElementById(a),
				g = f.value,
				h = "undefined" != typeof f.selectionStart && "undefined" != typeof f.selectionEnd,
				i = "undefined" != typeof document.selection && "undefined" != typeof document.selection.createRange;
			return h ? (c = f.selectionStart, d = f.selectionEnd, f.value = g.slice(0, c) + b + g.slice(d), f.selectionStart = f.selectionEnd = c + b.length) : i ? (f.focus(), e = document.selection.createRange(), e.collapse(!1), e.text = b, e.select()) : f.value += b, f.value
		}
	}
}).controller("PostsCtrl", ["Query", "Restangular",
	function(a, b) {
		"use strict";
		var c = this;
		c.query = a.getInstance(), c.getObjects = function() {
			c.query.get({
				scope: c,
				thing: b.all("posts")
			})
		}
	}
]).controller("PostCtrl", ["$scope", "$location", "$routeParams", "Meta", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		e.one("posts", c.postId).get().then(function(b) {
			return a.post = b, d.setTitle(b.title), b
		}, function(a) {
			404 === a.status && b.url("/404")
		})
	}
]).controller("NewPostCtrl", ["$location", "$routeParams", "Flash", "Taxonomy", "Restangular", "EditPostUtils", "promiseTracker", "$analytics",
	function(a, b, c, d, e, f, g, h) {
		"use strict";
		var i = this;
		i.taxonomy = d;
		var j = e.all("posts/categories").getList();
		j.then(function(a) {
			i.categories = a
		}), b.postId && e.one("posts", b.postId).get().then(function(a) {
			return i.post = a, j.then(function(b) {
				i.activeCategory = _.find(b, {
					id: a.category.id
				})
			}), a
		}), i.insertImg = function(a, b) {
			var c = "\n![图片](" + b + ")\n",
				d = f.insertContent(a, c);
			i.post ? i.post.content = d : i.post = {
				content: d
			}
		}, i.submit = function() {
			if (!i.post) return c.pushMessage("请填写信息", "warning"), void 0;
			var f = [];
			i.activeCategory && (f = d.getTagIds(i.activeCategory.groups));
			var j, k = {
					title: i.post.title,
					content: i.post.content,
					tag_ids: f,
					category_id: i.activeCategory ? i.activeCategory.id : null
				}, l = function(c) {
					return a.path("/posts/" + c.id), h.eventTrack(b.postId ? "Edit" : "Create", {
						category: "Post"
					}), c
				}, m = function(a) {
					return i.errors = a.data.errors, a
				};
			if (b.postId) {
				var n = e.one("posts", b.postId);
				angular.extend(n, k), j = n.put()
			} else {
				var o = e.one("posts");
				angular.extend(o, k), j = o.post()
			}
			j.then(l, m), g("updating").addPromise(j)
		}
	}
]), angular.module("dgConnect", ["dgConnectNotification", "dgConnectMessage"]), angular.module("dgConnectMessage", []).controller("MessageListCtrl", ["$scope", "$routeParams", "Query", "Conversation", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		a.query = c.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: e.all("messages")
			})
		}, a.removeConversation = function(b) {
			d.removeMessage({
				type: "conversation",
				host: {
					id: b.target_user.name
				},
				message: b,
				messages: a.objects
			})
		}
	}
]).controller("MessageDetailCtrl", ["$scope", "$routeParams", "Query", "Conversation", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		a.query = c.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: e.one("messages").all(b.username)
			})
		}, a.username = b.username, a.removeMessage = function(c) {
			d.removeMessage({
				type: "message",
				host: {
					id: b.username
				},
				message: c,
				messages: a.objects
			})
		}
	}
]), angular.module("dgConnectNotification", []).factory("UnreadNotification", ["Restangular",
	function(a) {
		"use strict";
		var b = {
			objects: [],
			get: function() {
				return a.all("user/notifications").getList({
					page: 0,
					state: "unread"
				}).then(function(a) {
					return b.objects = a, a
				})
			},
			markAsRead: function(c) {
				if (angular.isUndefined(c) || angular.isString(c)) a.one("user/notifications", c).put().then(function() {
					b.get()
				});
				else if (angular.isArray(c)) {
					var d = a.one("user/notifications");
					d.ids = c, d.put().then(function() {
						b.get()
					})
				}
			}
		};
		return b
	}
]).directive("dgUnreadNotification", ["UnreadNotification",
	function(a) {
		"use strict";
		return {
			replace: !0,
			restrict: "EA",
			templateUrl: "views/connect/notification-unread.html",
			link: function(b, c, d) {
				b.notification = a, b.notification.get(), b.notificationLimit = d.limit, b.setNotificationLimit = function(a) {
					b.notificationLimit = a
				}, b.getIds = function(a) {
					var c = [];
					return angular.forEach(b.notification.objects.slice(0, a), function(a) {
						c.push(a.id)
					}), c
				}
			}
		}
	}
]).controller("NotificationCtrl", ["$scope", "Query", "Restangular",
	function(a, b, c) {
		"use strict";
		a.query = b.getInstance(), a.getObjects = function(b) {
			a.query.get({
				scope: a,
				thing: c.all("user/notifications"),
				extraParams: {
					"types[]": b
				}
			})
		}
	}
]), angular.module("dgFeedback", []).controller("FeedbackCtrl", ["$scope", "$http", "apiPrefix", "Query", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		a.query = d.getInstance(), a.getObjects = function() {
			a.query.get({
				scope: a,
				thing: e.all("feedback")
			})
		}, a.toggleVote = function(a) {
			a.voted ? b({
				url: c + "/feedback/" + a.id + "/vote",
				method: "DELETE"
			}).success(function() {
				a.voted = !1, a.vote_count--
			}) : b({
				url: c + "/feedback/" + a.id + "/vote",
				method: "PUT"
			}).success(function() {
				a.voted = !0, a.vote_count++
			})
		}
	}
]), angular.module("dgSetting", ["dgFlash", "dgUserAuth"]).controller("SettingProfileCtrl", ["$routeParams", "Flash", "Session", "Taxonomy", "Restangular", "UserRestangular",
	function(a, b, c, d, e, f) {
		"use strict";
		var g = this,
			h = {
				weibo: "新浪微博",
				tqq: "腾讯微博",
				douban: "豆瓣"
			};
		g.taxonomy = d, g.success = a.success, g.connected = a.connected, g.disconnected = a.disconnected, "1" === g.success ? h[g.connected] ? b.pushMessage("绑定" + h[g.connected] + "成功", "success") : h[g.disconnected] && b.pushMessage("解除绑定" + h[g.disconnected] + "成功", "success") : "0" === g.success && b.pushMessage("绑定社交帐号失败", "warning"), g.changeProvince = function(a, b) {
			return g.cities = _.find(b, {
				id: a
			}).cities, g.cities
		}, g.changeIdentity = function(a, b) {
			g.activeIdentity = _.find(b, {
				id: a.id
			})
		};
		var i = e.all("areas").getList(),
			j = e.all("users/identities").getList();
		c.requestCurrentUser().then(function(a) {
			return g.user = c.currentUser, i.then(function(b) {
				return g.areas = b, null != a.province && g.changeProvince(a.province.id, b), b
			}), j.then(function(b) {
				return g.identities = b, null != a.identity && g.changeIdentity(a.identity, b), b
			}), a
		});
		var k = f.one("user");
		g.submit = function() {
			var a;
			g.activeIdentity && (a = d.getTagIds(g.activeIdentity.groups));
			var c = {
				avatar: g.user.avatar,
				website: g.user.website,
				nickname: g.user.nickname,
				description: g.user.description,
				province_id: g.user.province ? g.user.province.id : null,
				city_id: g.user.city ? g.user.city.id : null,
				identity_id: g.activeIdentity ? g.activeIdentity.id : null,
				domain_ids: a
			};
			angular.extend(k, c), k.put().then(function(a) {
				return b.pushMessage("更新个人资料成功", "success"), a
			}, function(a) {
				g.errors = a.data.errors
			})
		}
	}
]).controller("SettingAccountCtrl", ["Flash", "Session", "Restangular", "UserRestangular",
	function(a, b, c, d) {
		"use strict";

		function e(b) {
			return g.errors = null, a.pushMessage("更改设置成功", "success"), b
		}

		function f(a) {
			g.errors = a.data.errors
		}
		var g = this,
			h = d.one("user");
		c.one("user/settings/notification").get().then(function(a) {
			return g.notification = a, a
		}), b.requestCurrentUser().then(function(a) {
			return g.user = a, a
		}), g.submitNotif = function() {
			g.notification.put().then(e, f)
		}, g.submit = function(a) {
			var b = _.pick(g.user, a);
			angular.extend(h, b), h.put().then(e, f)
		}
	}
]), angular.module("dgPage", []).controller("LinkCtrl", ["Restangular",
	function(a) {
		"use strict";
		var b = this;
		a.all("links").getList({
			with_image: !0
		}).then(function(a) {
			return b.objectsWithImage = a, a
		}), a.all("links").getList({
			with_image: !1
		}).then(function(a) {
			return b.objectsWithoutImage = a, a
		})
	}
]), angular.module("dgTemplates", []).run(["$templateCache",
	function(a) {
		a.put("views/connect/comment.html", '<div class="streams" infinite-scroll="getObjects([\'comment\', \'mention\', \'reply\']);" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'comment\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><article class="thing thing-conversation"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar avatar-medium" width="50" height="50" dg-image="{{ object.actor.avatars.origin }}"></a><div class="u-textTruncate" ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> <span ng-switch-when="comment" ng-switch="object.notifiable.type">评论了你的 <a ng-switch-when="music" ng-href="/music/{{ object.notifiable.id }}" ng-bind-template="{{ object.notifiable.content }}"></a> <a ng-switch-when="post" ng-href="/posts/{{ object.notifiable.id }}" ng-bind-template="{{ object.notifiable.content }}"></a></span> <span ng-switch-when="mention">在评论中提到了你</span> <span ng-switch-when="reply">回复了你的评论</span><time class="muted" datetime="{{ object.created_at }}"></time><div class="thing-content u-textBreak" ng-bind="object.notifiable.comment_content"></div></div></article></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/connect/follow.html", '<div class="streams" infinite-scroll="getObjects(\'follow\')" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'follow\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a> <i class="u-pullRight" dg-follow="object.actor"></i><div class="thing-info"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> 关注了你<time class="muted" datetime="{{ object.created_at }}"></time><dl class="separated list-inline"><dt ng-if="object.actor.city.name" ng-show="object.actor.city.name"><dfn>地址</dfn>：</dt><dd ng-if="object.actor.city.name" ng-bind="object.actor.city.name"></dd><dt ng-if="object.actor.identity.name" ng-show="object.actor.identity.name"><dfn>身份</dfn>：</dt><dd ng-if="object.actor.identity.name" ng-bind="object.actor.identity.name"></dd></dl></div></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/connect/like.html", '<div class="streams" infinite-scroll="getObjects(\'like\')" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'like\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a><div class="thing-info" ng-switch="object.notifiable.type"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> 赞了你的 <span ng-switch-default="">音乐</span><time class="muted" datetime="{{ object.created_at }}"></time><div class="thing-content"><a ng-bind="object.notifiable.content" ng-href="/music/{{ object.notifiable.id }}" ng-switch-default=""></a></div></div></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/connect/message/conversation.html", '<div class="streams" infinite-scroll="getObjects();" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'messageList\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol class="conversations"><li class="activity" ng-repeat="object in objects"><article class="thing thing-conversation u-cf"><div class="thing-highlight"><a title="{{ object.target_user.nickname }}" ng-href="/{{ object.target_user.name }}"><img class="avatar" alt="{{ object.target_user.nickname }}" width="40" height="40" dg-image="{{ object.target_user.avatars.origin }}"></a></div><div class="thing-well"><div dg-linkify="" ng-href="/connect/message/{{ object.target_user.name }}"><div class="headline muted">和 <a title="{{ object.target_user.nickname }}" ng-href="/{{ object.target_user.name }}" ng-bind="object.target_user.nickname"></a> <span class="muted" ng-bind-template="共 {{ object.messages_count }} 条有往来信息"></span></div><div class="thing-content u-textBreak" ng-bind-html="object.last_message.content"></div></div><footer class="u-cf"><div class="u-pullLeft"><time class="muted" datetime="{{ object.updated_at }}"></time></div><div class="u-pullRight"><a ng-click="removeConversation(object)">忽略</a></div></footer></div></article></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/connect/message/message.html", '<div class="streams" infinite-scroll="getObjects();" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="conversation-outer"><i host-id="username" messages="objects" placeholder="输入新消息" dg-new-message="message"></i><ol class="conversation" ng-if="objects.length"><li class="message" ng-repeat="object in objects"><article class="u-cf"><div class="thing-highlight"><a title="{{ object.actor.nickname }}" ng-href="/{{ object.actor.name }}"><img class="avatar" alt="{{ object.actor.nickname }}" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a></div><div class="thing-well"><a title="{{ object.actor.nickname }}" ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a><div class="thing-content u-textBreak" ng-bind-html="object.content_html"></div><footer class="u-cf"><div class="u-pullLeft"><time class="muted" datetime="{{ object.updated_at }}"></time></div><div class="u-pullRight"><a ng-show="object.own" ng-click="removeMessage(object)">删除</a></div></footer></div></article></li></ol></div><i dg-tracker="objects"></i></div>'), a.put("views/connect/navigation.html", '<div class="tabs-outer tabs-4cols u-cf"><a class="tab" href="/connect/like" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-thumbs-up"></i>赞</a> <a class="tab" href="/connect/follow" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-eye"></i>关注</a> <a class="tab" href="/connect/comment" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-comment"></i>评论</a> <a class="tab" href="/connect/message" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-mail"></i>私信 <a></a></a></div>'), a.put("views/connect/notification-unread.html", '<div class="notifications box" ng-show="notification.objects"><div class="box-header" ng-bind-template="{{ notification.objects.length }} 条新通知"></div><ol class="box-main"><li class="box-item u-cf" ng-repeat="object in notification.objects | limitTo:notificationLimit"><div ng-include="\'views/partials/notification.html\'"></div></li></ol><div class="box-footer u-cf"><a class="u-pullLeft" ng-show="notification.objects.length > notificationLimit" ng-click="setNotificationLimit(notification.objects.length)" ng-bind-template="显示全部 {{ notification.objects.length }} 条新通知"></a> <a class="u-pullRight" ng-if="notification.objects.length <= notificationLimit" ng-click="notification.markAsRead()">忽略全部</a> <a class="u-pullRight" ng-if="notification.objects.length > notificationLimit" ng-click="notification.markAsRead(getIds(notificationLimit))" ng-bind-template="忽略以上 {{ notificationLimit }} 条"></a></div></div>'), a.put("views/feedback/feedback.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div class="conversation-outer"><i dg-new-message="feedback" messages="objects" placeholder="用得高兴不高兴，都告诉我们。"></i><ol><li class="activity u-cf" ng-repeat="object in objects"><article class="thing thing-feedback"><div class="thing-info u-borderB u-cf"><a class="thing-highlight"><img class="avatar" width="40" height="40" dg-image="{{ object.owner.avatars.origin }}"></a><div><a title="{{ object.owner.nickname }}" ng-href="/{{ object.owner.name }}" ng-bind="object.owner.nickname"></a><div class="thing-content u-textBreak" ng-bind="object.content"></div></div></div><footer class="thing-actions u-cf"><a class="btn btn-large btn-like thing-action" ng-click="toggleVote(object)" ng-class="{\'btn-unlike\': object.voted}"><i class="icon-thumbs-up"></i> <small ng-bind="object.vote_count"></small></a></footer></article></li></ol></div><i dg-tracker="objects"></i></div>'), a.put("views/home/activity.html", '<div class="streams" ng-controller="TimelineCtrl as timeline" infinite-scroll="timeline.getObjects()" infinite-scroll-disabled="timeline.query.paused" infinite-scroll-distance="1"><i class="u-marginBl" dg-unread-notification="" limit="5"></i><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="timeline.isDataEmpty" ng-init="hintType = \'home\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity-outer" ng-repeat="object in timeline.objects"><div ng-include="\'views/partials/activity.html\'"></div></div></div><i ng-if="!timeline.isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/home/banner.html", '<div class="home-banner-left home-banner-half-width home-banner-half-height u-pullLeft"></div><div class="home-banner-right home-banner-half-width home-banner-half-height u-pullRight"><div class="home-banner-right-text"><p>来自山川湖海，擅长吹拉弹唱。</p><p>晒作品，找搭档，搞演出，谈合作，</p><p>混录你的音乐生涯。</p></div><div class="home-banner-right-text"><p>不论新人或者大牛，</p><p>我们重新连接每一位音乐人。</p></div><a class="btn btn-reverse btn-medium btn-widthL u-fontSizeS" ng-href="/login?returnUrl={{ dg.location.host() }}">开始你的音乐生涯</a> <a class="u-marginLm" href="/about">关于合拍</a></div>'), a.put("views/home/explore.html", '<div class="home-banner-outer cards-outer" ng-if="!dg.session.currentUser"><span ng-include="\'views/home/banner.html\'"></span></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div ng-controller="ExploreCtrl as explore"><div ng-include="\'views/partials/explore-recommend.html\'"></div></div>'), a.put("views/home/home.html", "<div class=\"home\" ng-include=\"'views/home/' + home.templateName + '.html'\"></div>"), a.put("views/music/music-list.html", '<div class="home-banner-outer cards-outer" ng-if="!dg.session.currentUser"><span ng-include="\'views/home/banner.html\'"></span></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="music.getObjects()" infinite-scroll-disabled="music.query.paused" infinite-scroll-distance="1"><div class="box u-marginTm" dg-taxonomy="music/types" taxonomy-name="类型" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div><div class="box u-marginTm" dg-taxonomy="music/genres" taxonomy-name="曲风" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div><div class="cards u-cf"><article class="card" ng-init="music = object" ng-repeat="object in music.objects"><div ng-include="\'views/partials/card/music.html\'"></div></article></div><i dg-tracker="objects"></i></div>'), a.put("views/music/music.html", '<div class="streams"><div ng-if="music"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft"><a class="u-pullLeft u-marginRm" title="{{ music.user.nickname }}" ng-href="/{{ music.user.name }}"><img class="avatar" alt="{{ music.user.nickname }}" width="40" height="40" dg-image="{{ music.user.avatars.origin }}"></a><div class="u-pullLeft"><p class="muted">由 <a title="{{ music.user.nickname }}" ng-bind="music.user.nickname" ng-href="/{{ music.user.name }}"></a> <span ng-if="music.published">发布</span> <span ng-if="!music.published">上传</span> <span class="notice" ng-if="!music.published">(未公开)</span></p><time class="muted" datetime="{{ music.created_at }}"></time></div></div><div class="activity-actions"><span class="u-inlineBlock muted"><i class="icon-headphone"></i> <small ng-bind="music.listen_count"></small></span> <span class="u-paddingLm" ng-if="music.own"><a class="btn btn-small" ng-if="!music.published" ng-click="actions.publish(music)">公开</a> <a class="btn btn-small" ng-if="dg.device.isDesktop()" ng-href="/music/{{ music.id }}/update">编辑</a></span></div></div><div class="thing-outer" ng-if="music" ng-init="thing = music; hideExtraButton = true;"><div ng-include="\'views/partials/thing/music.html\'"></div></div><dl class="thing-involved separated box box-header list-inline"><dt><dfn>歌手</dfn>：</dt><dd><a ng-href="/{{ music.user.name }}" ng-bind="music.user.nickname"></a></dd><dt><dfn>标签</dfn>：</dt><dd><a ng-href="/tags/{{ music.type.slug }}" ng-bind="music.type.name"></a></dd><dd><a ng-href="/tags/{{ music.genre.slug }}" ng-bind="music.genre.name"></a></dd></dl><div class="thing-content u-paddingVm u-borderB u-textBreak" ng-if="music.lyric_html" ng-bind-html="music.lyric_html"></div><div class="box u-marginTl" ng-if="music.published" ng-init="sharingThing = music; sharingThing.$type = \'music\';"><div ng-include="\'views/partials/sharing.html\'"></div></div><ol class="thing-fans u-paddingVm u-borderB" ng-if="music.likers.length > 0"><li class="u-inlineBlock" ng-repeat="user in music.likers | limitTo:10"><a ng-href="/{{ user.name }}"><img class="avatar avatar-small u-marginRs" alt="{{ user.nickname }}" width="30" height="30" dg-image="{{ user.avatars.origin }}"></a></li><li class="u-inlineBlock muted"><span ng-if="music.likers.length > 10">等</span> <span ng-bind-template="{{ music.likers.length }} 人赞了"></span></li></ol><div class="conversation-outer" ng-if="music.published"><i dg-comment="{{ music.id }}" host-type="music"></i></div></div></div>'), a.put("views/music/progress-bar.html", '<div class="player-progress-area"><div class="player-progress progress-outer"><div class="progress progress-loading" ng-style="{\'width\': percentLoaded + \'%\'}"></div><div class="progress progress-playing" ng-style="{\'width\': percentPlayed + \'%\'}"></div></div></div>'), a.put("views/music/uploading.html", '<div class="streams"><form name="uploadingForm" ng-hide="uploading.objectsTracker.active()" ng-submit="uploading.submit()"><div class="form-field u-cf"><label class="u-pullLeft uploader-cover"><i dg-uploader="" upload-type="image" upload-thing="封面" target-model="uploading.music.cover" upload-folder="covers"><img class="image-original" width="240" height="240" dg-image="{{ uploading.music.cover || uploading.music.covers.origin ||\n                                   \'https://dn-storm-image.qbox.me/default/cover.png\' }}" ng-model="uploading.music.cover"></i> <span class="input-message input-error" ng-if="uploading.errors.cover" ng-bind="uploading.errors.cover.message"></span></label><label class="u-pullLeft"><i dg-uploader="" upload-type="audio" upload-thing="音乐" target-model="uploading.music.audio" upload-folder="music"></i> <span class="input-message input-error" ng-if="uploading.errors.audio" ng-bind="uploading.errors.audio.message"></span></label></div><input type="hidden" name="audio" ng-model="uploading.music.audio" ng-change="uploading.errors.audio = null"><input type="hidden" name="cover" ng-model="uploading.music.cover" ng-change="uploading.errors.cover = null"><label class="form-field">歌名： <span class="input-message input-error" ng-if="uploading.errors.name" ng-bind="uploading.errors.name.message"></span><input name="name" type="text" ng-model="uploading.music.name" ng-change="uploading.errors.name = null"></label><label class="form-field">曲风：<select ng-model="uploading.music.genre.id" ng-options="genre.id as genre.name for genre in uploading.genres"></select></label><label class="form-field">类型：<select ng-model="uploading.music.type.id" ng-options="type.id as type.name for type in uploading.types"></select></label><div class="form-field form-textarea"><label class="textarea-header box-header u-cf" for="lyric">歌词：</label><textarea name="lyric" id="lyric" rows="10" cols="10" ng-model="uploading.music.lyric">\n            </textarea></div><label class="form-field u-borderB"><input name="published" type="checkbox" ng-model="uploading.music.published">公开</label><div class="form-actions"><span class="btn-outer"><button class="btn btn-reverse btn-medium btn-action" type="submit" ng-disabled="uploading.inputTracker.active()">保存</button> <i dg-tracker="uploading" type="input"></i></span></div></form><i dg-tracker="objects"></i></div>'), a.put("views/page/404.html", '<div class="page-404" ng-controller="NavCtrl as nav"><div class="page-404-vertical"><div class="page-404-image"><img class="page-404-image-banner" src="/images/404-banner.da0d3c9c.png"> <img src="/images/404-shadow.66fe84f7.png"></div><div><p class="u-fontSizeXXL u-colorBlue">Oops, 页面出错了！</p><p>你可以调整搜索关键词，找到你想要的内容</p><form class="u-marginVm" ng-submit="nav.submit()"><input class="page-404-searchinput u-inlineBlock u-marginRm" name="search" type="text" ng-model="nav.g.searchString"><button class="btn btn-medium btn-reverse btn-action u-inlineBlock" type="submit">搜索</button></form><p>或 <a href="/">返回首页</a></p></div></div></div>'), a.put("views/page/about.html", '<div class="u-widthDesktop u-alignCenter"><header class="about-header u-paddingLl u-cf"><a class="about-logo u-pullLeft" href="/"><img src="/images/about/logo.56aff0f0.png"></a><div class="u-pullRight u-cf"><a class="about-header-link u-block u-pullLeft u-textCenter" href="/about" dg-match-path="" ng-class="{\'current\': pathMatched}">关于合拍</a> <a class="about-header-link u-block u-pullLeft u-textCenter" ng-href="/signup?returnUrl={{ dg.location.host() }}">登录/注册</a></div></header><img class="u-marginBl" src="/images/about/banner.66ac5959.png"><div class="about-main" ng-class="{\'u-paddingHl\': !dg.device.isDesktop()}"><div class="u-paddingVl u-marginBl u-borderB"><h2 class="u-fontSizeXXL u-fontNormal u-colorBlue">重新连接每一位音乐人</h2><div class="u-marginTm u-fontSizeL u-marginBl"><p>这是一个只属于音乐和音乐人的社区，没有多余的喧嚣和纷扰。</p><p>音乐是我们共同的纽带，无论何时、何地、何种风格，这里有最懂音乐的听众。</p><p>音乐也是我们最狂热的追求，从结识到合作、从录音到演出，这里让相距千里的梦想一拍即合！</p></div></div><div class="u-paddingTl u-borderB"><h2 class="u-marginBl u-fontSizeXXL u-fontNormal u-colorBlue">在合拍你可以</h2><ul class="u-cf u-marginBl"><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/badass.d9aa7c0b.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">遇见贵人，请教大牛</h3><div class="u-fontSizeL u-textLeft">这里有行业的从业人士，只要敢秀，就能换得录音，演出，签约的机会！ 这里也有玩转乐器的各路大牛，只要敢问，就会让你获益匪浅。</div></li><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/friends.d23ba5f9.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">结识伙伴，交流创作</h3><div class="u-fontSizeL u-textLeft">不管身处哪个城市、玩着什么风格，这里总有你的同道中人！ 交流学习，共同协作，这才是玩儿音乐的乐趣。</div></li><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/fans.2c0fcfde.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">赢得歌迷，崭露头角</h3><div class="u-fontSizeL u-textLeft">只要你的音乐够酷，就会出现在合拍推荐首页、音乐人攻略和各大媒体网站！ 让更多人听到，吸引更多的歌迷，从此开始你的音乐生涯。</div></li></ul></div><div class="u-paddingVl"><h3 class="u-fontSizeXXL u-fontNormal u-colorBlue">玩转合拍</h3><ul class="u-cf" ng-class="{\'u-textCenter\': !dg.device.isDesktop()}"><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">上传音乐</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">不论原创、翻唱、改编、混音，上传封面、选择风格、添加歌词，轻松建立你的音乐名片！</div></div><img src="/images/about/music.b8d25fa0.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">发布信息</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">组建乐队、演出签约、二手乐器、词曲交易，点点鼠标就有你想要的！</div></div><img src="/images/about/post.b9ecfb1d.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">探索推荐</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">专业的音乐人社区有最雪亮的眼睛，每日推荐音乐和音乐人，引爆你的原创！</div></div><img src="/images/about/explore.93bf4d76.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">快速搜索</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">电子？嘻哈？摇滚？一个关键字，直达你想要的内容。</div></div><img src="/images/about/search.3c756770.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">绑定社交帐号</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">让你的朋友知道你在合拍，一键分享拓展人脉。</div></div><img src="/images/about/social.7e25d02a.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">iPhone、iPad 自适应</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">全新的网站设计，在各种设备上都有超凡的浏览体验。</div></div><img src="/images/about/responsive.ade97a30.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">移动 App，随时随地合拍</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">捕捉转瞬即逝的创作片段，随时随地接收合拍消息。</div></div><img src="/images/about/coming-soon.44658416.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li></ul></div></div><footer class="u-marginTl u-paddingBl u-textCenter"><h2 class="u-fontSizeXXL u-fontNormal u-colorBlue">马上加入合拍</h2><div class="u-marginTl"><a class="btn btn-medium btn-reverse btn-widthL u-marginRl" ng-href="/login?returnUrl={{ dg.location.host() }}">登录</a> <a class="btn btn-medium btn-reverse btn-widthL" ng-href="/signup?returnUrl={{ dg.location.host() }}">注册</a></div><p class="u-marginTl">或者你可以， <a href="/">先去逛逛 >></a></p></footer></div>'), a.put("views/page/links.html", '<div class="streams"><div class="u-marginBxxxl"><p class="u-marginBl u-paddingBs u-borderB u-fontSizeM u-fontBold">合拍</p><ul class="u-alignBottom u-fontSizeS"><li class="u-inlineBlock u-marginRxxl"><img class="u-marginBm" src="/images/page/logo120x60.19457a52.jpg"><p>logo大小: 120 x 60</p></li><li class="u-inlineBlock u-marginRxxl"><img class="u-marginBm" src="/images/page/logo80x30.01cdfcaf.jpg"><p>logo大小: 80 x 30</p></li><li class="u-inlineBlock"><p>文字链接: <a href="http://hepaimusic.com/">合拍(hepaimusic.com) 音乐人社区</a></p></li></ul></div><div><p class="u-marginBl u-paddingBs u-borderB u-fontSizeM">友情链接</p><ul class="u-cf"><li class="links-link u-marginRxl u-marginBxl u-inlineBlock" ng-repeat="object in link.objectsWithImage"><a title="{{ object.name }}" ng-href="{{ object.url }}"><img width="84" height="30" dg-image="{{ object.images.origin }}"></a></li></ul><ul class="u-cf u-fontSizeS"><li class="links-link u-marginRxl u-marginBxl u-inlineBlock u-textTruncate" ng-repeat="object in link.objectsWithoutImage"><a title="{{ object.name }}" ng-href="{{ object.url }}" ng-bind="object.name"></a></li></ul></div></div>'), a.put("views/partials/activity.html", '<div class="activity" ng-init="thing = object.target;\n              thing.$prev = objects[$index - 1];\n              thing.$next = objects[$index + 1];" ng-controller="ActionCtrl"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft" ng-init="actor = object.actors[0]"><a class="u-marginRm u-pullLeft" title="{{ actor.nickname }}" ng-if="actor" target="_blank" ng-href="/{{ actor.name }}"><img class="avatar" alt="{{ actor.nickname }}" width="40" height="40" dg-image="{{ actor.avatars.origin }}"></a><div class="u-pullLeft"><p><a title="{{ actor.nickname }}" ng-if="actor" ng-bind="actor.nickname" target="_blank" ng-href="/{{ actor.name }}"></a> <span ng-if="object.action == \'like\'">赞了一首音乐</span> <span ng-if="object.action == \'create\'">发布了一首音乐</span></p><time class="muted u-block" datetime="{{ object.created_at }}"></time></div></div><div class="activity-actions"><span class="u-inlineBlock muted"><i class="icon-headphone"></i> <small ng-bind="object.target.listen_count"></small></span></div></div><div class="thing-outer" ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div>'), a.put("views/partials/aside.html", '<div class="aside" ng-controller="NavCtrl as nav"><nav class="nav-aside"><form class="nav-item nav-item-search" ng-hide="dg.g.isSearchPage" ng-submit="nav.submit()"><div class="input-outer u-sizeFull"><input class="input-reverse u-sizeFull" id="s" type="text" name="s" ng-model="nav.g.searchString"><button class="icon-search input-icon" type="submit"></button></div></form><ul class="nav" ng-hide="nav.tracker.active()"><li class="nav-item nav-item-user" ng-if="dg.session.currentUser"><a class="nav-item-link u-block u-textTruncate" ng-href="/{{ dg.session.currentUser.name }}" dg-match-path="" ng-class="{\'nav-current\': pathMatched}"><img class="avatar avatar-small u-marginRs" alt="{{ dg.session.currentUser.nickname }}" width="30" height="30" dg-image="{{ dg.session.currentUser.avatars.origin }}"> <span ng-bind="dg.session.currentUser.nickname"></span></a></li><li class="nav-item" ng-if="dg.modernizr.history"><a class="nav-item-link" href="/" dg-match-path="" strict="true" ng-class="{\'nav-current\': pathMatched}"><i class="icon-home"></i> 首页</a></li><li class="nav-item" ng-if="!dg.modernizr.history"><a class="nav-item-link" dg-match-path="" strict="true" ng-click="dg.location.url(\'/\')" ng-class="{\'nav-current\': pathMatched}"><i class="icon-home"></i> 首页</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" ng-href="/explore" dg-match-path="" strict="true" ng-class="{\'nav-current\': pathMatched}"><i class="icon-stats"></i> 探索</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" href="/connect" dg-match-path="" ng-class="{\'nav-current\': pathMatched}"><i class="icon-mail"></i> 通知 / 私信</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" href="/settings/account" dg-match-path="" strict="true" ng-class="{\'nav-current\': pathMatched}"><i class="icon-cog"></i> 设置</a></li><li class="nav-item"><a class="nav-item-link" href="/feedback" dg-match-path="" strict="true" ng-class="{\'nav-current\': pathMatched}"><i class="icon-edit"></i> 意见反馈</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" ng-click="dg.session.logout()"><i class="icon-exit"></i> 退出登录</a></li><li class="nav-item-btn-signup" ng-if="!dg.session.currentUser"><a class="btn btn-reverse btn-medium u-sizeFull" href="/signup"><i class="icon-person"></i> 注册</a></li><li class="nav-item-login" ng-if="!dg.session.currentUser">已有帐号？ <a href="/login">直接登录</a></li></ul><i dg-tracker="session"></i></nav><div class="nav-aside nav-bottom u-paddingBl"><a class="nav-item-link" href="/links">友情链接</a></div></div>'), a.put("views/partials/card/music.html", '<div class="card-main"><a ng-href="/music/{{ music.id }}" target="_blank"><img class="cover" dg-image="{{ music.covers.origin }}" width="220" height="220" alt="{{ music.name }}"></a><header class="card-music u-textTruncate"><a title="{{ music.name }}" class="u-colorWhite" ng-bind="music.name" ng-href="/music/{{ music.id }}" target="_blank"></a> <a class="muted u-table u-colorBlue" ng-href="/{{ music.user.name }}" target="_blank" ng-bind="music.user.nickname"></a><div class="u-pullRight player"><a class="thing-play-right img-circle icon-outer icon-outer-small" ng-click="dg.player.toggle(music)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\': dg.playbackState.sounds[music.id].state\n                             == dg.playbackState.states.playing}"></i></a></div></header><div class="card-music-bg"></div></div>'), a.put("views/partials/card/post.html", '<div class="card-main card-post"><div class="u-textTruncate"><a class="thing-title" title="{{ post.title }}" ng-href="/posts/{{ post.id }}" target="_blank" ng-bind="post.title"></a></div><div><a class="muted" ng-href="/{{ post.user.name }}" target="_blank" ng-bind="post.user.nickname"></a></div><div class="card-content"><div ng-bind-html="post.content_html"></div></div></div>'), a.put("views/partials/card/user.html", '<div class="card-main card-user"><a ng-href="/{{ user.name }}" target="_blank"><img class="avatar" dg-image="{{ user.avatars.origin }}" width="110" height="110" alt="{{ user.nickname }}"></a><header class="card-section u-textTruncate"><a ng-href="/{{ user.name }}" target="_blank" ng-bind="user.nickname"></a><ul class="list-inline separated muted"><li ng-if="user.city"><a ng-href="/tags/{{ user.city.slug }}" target="_blank" ng-bind="user.city.name"></a></li><li ng-if="user.identity"><a ng-href="/tags/{{ user.identity.slug }}" target="_blank" ng-bind="user.identity.name"></a></li></ul></header><i class="card-section" dg-follow="user"></i></div>'), a.put("views/partials/comment.html", '<div class="comments"><i dg-new-message="comment" messages="comments" host-id="hostId" host-type="hostType" placeholder="输入新评论"></i><ol class="conversation"><li class="message" ng-repeat="object in comments" ng-controller="ActionCtrl"><article class="u-cf"><header class="thing-highlight"><a title="{{ object.actor.nickname }}" target="_blank" ng-href="/{{ object.actor.name }}"><img class="avatar avatar-medium" alt="{{ object.actor.nickname }}" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a></header><div class="thing-well"><div class="comment-content"><a title="{{ object.actor.nickname }}" target="_blank" ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> <span class="muted u-fontSizeS">@{{ object.actor.name }}</span><div class="thing-content u-textBreak" ng-bind-html="object.content_html"></div></div><footer class="u-cf"><div class="u-pullLeft"><time class="muted" datetime="{{ object.created_at }}"></time></div><div class="u-pullRight"><a ng-class="{\'u-marginRm\': object.own}" ng-click="dispatch(\'reply\')">回复</a> <a ng-show="object.own" ng-click="removeComment(object)">删除</a></div></footer></div><div ng-if="extendedStatus"><i dg-new-message="comment" messages="comments" host-id="hostId" host-type="hostType" placeholder="输入新评论"></i></div></article></li></ol></div>'), a.put("views/partials/conversation/message-new.html", '<form name="messageForm" class="form-message form-inline u-cf" ng-submit="addMessage()"><div><textarea name="content" rows="1" cols="100" class="textarea-message-new" ng-model="message.content" placeholder="{{ placeholder }}"></textarea></div><input type="submit" value="发布" class="btn btn-medium btn-reverse btn-action"></form>'), a.put("views/partials/explore-nav.html", '<div class="tabs-outer tabs-4cols"><a class="tab" href="/" ng-if="!dg.session.currentUser" ng-class="{\'tab-current\': pathMatched}" strict="true" dg-match-path=""><i class="icon-stats"></i> 推荐</a> <a class="tab" href="/explore" ng-if="dg.session.currentUser" ng-class="{\'tab-current\': pathMatched}" strict="true" dg-match-path=""><i class="icon-stats"></i> 推荐</a> <a class="tab" href="/music" ng-class="{\'tab-current\': pathMatched}" strict="true" dg-match-path=""><i class="icon-music"></i> 音乐</a> <a class="tab" href="/users" ng-class="{\'tab-current\': pathMatched}" strict="true" dg-match-path=""><i class="icon-person"></i> 用户</a> <a class="tab" href="/posts" ng-class="{\'tab-current\': pathMatched}" strict="true" dg-match-path=""><i class="icon-post"></i> 合作信息</a></div>'), a.put("views/partials/explore-recommend.html", '<div class="cards-outer u-cf" infinite-scroll="explore.getObjects()" infinite-scroll-disabled="explore.query.paused" infinite-scroll-distance="1"><div class="cards u-cf"><article class="card" ng-class="{\'card-2x\': object.size == \'large\'}" ng-repeat="object in explore.objects"><div class="card-outer" ng-if="object.target.klass == \'Music\'" ng-init="music = object.target"><div ng-include="\'views/partials/card/music.html\'"></div></div><div class="card-outer" ng-if="object.target.klass == \'User\'" ng-init="user = object.target"><div ng-include="\'views/partials/card/user.html\'"></div></div><div class="card-outer" ng-if="object.target.klass == \'Post\'" ng-init="post = object.target"><div ng-include="\'views/partials/card/post.html\'"></div></div><div class="card-extra muted" ng-if="object.target.klass == \'Music\' && object.size == \'large\'"><ul class="card-stats u-cf"><li class="card-stat u-textLeft"><i class="icon-thumbs-up"></i> <span ng-bind="object.target.like_count"></span></li><li class="card-stat u-textCenter"><i class="icon-comment"></i> <span ng-bind="object.target.comments_count"></span></li><li class="card-stat u-textRight"><i class="icon-headphone"></i> <span ng-bind="object.target.listen_count"></span></li></ul><dl class="card-section list-inline separated"><dt><dfn>标签</dfn>：</dt><dd ng-bind="object.target.genre.name"></dd><dd ng-bind="object.target.type.name"></dd></dl><dl class="list-inline"><dt><dfn>作者</dfn>：</dt><dd><a ng-href="/{{ object.target.user.name }}" ng-bind="object.target.user.nickname"></a></dd></dl><dl class="card-section card-section-recommend list-inline" ng-if="object.reason"><dd ng-bind="object.reason"></dd></dl></div><div class="card-extra muted" ng-if="object.target.klass == \'User\' && object.size == \'large\'"><ul class="card-stats u-cf"><li class="card-stat u-textLeft"><i class="icon-music"></i> <span ng-bind="object.target.music_count"></span></li><li class="card-stat u-textCenter"><i class="icon-person"></i> <span ng-bind="object.target.following_count"></span></li><li class="card-stat u-textRight"><i class="icon-people"></i> <span ng-bind="object.target.followers_count"></span></li></ul><dl class="card-section list-inline u-textTruncate" ng-if="object.target.description"><dt><dfn>简介</dfn>：</dt><dd ng-bind="object.target.description"></dd></dl><dl class="card-section card-section-recommend list-inline" ng-if="object.reason"><dd ng-bind="object.reason"></dd></dl></div></article></div><i dg-tracker="objects"></i></div>'), a.put("views/partials/flashing.html", '<div class="main-outer flash" ng-class="\'flash-\' + flash.category" ng-repeat="flash in dg.flash.messages"><span ng-bind="flash.content"></span></div>'), a.put("views/partials/follow.html", '<a class="btn btn-small btn-follow" ng-hide="session.currentUser.id == target.id" ng-click="toggleFollow()" ng-class="{\'btn-reverse\': !target.is_following, \'btn-unfollow\': target.is_following}"></a>'), a.put("views/partials/hint/hint-comment.html", '<p>没有新通知, 去 <a href="/music/new">上传音乐</a> , 获得更多的评论！</p>'), a.put("views/partials/hint/hint-follow.html", '<p>没有新通知, 去 <a href="/music/new">上传音乐</a> , 获得更多关注！</p>'), a.put("views/partials/hint/hint-home.html", '<div><p>你还没有关注任何人，</p><p>快到探索页，发现更多精彩吧！</p><a class="btn btn-medium btn-reverse u-marginTm btn-widthL" href="/explore">进入探索</a></div>'), a.put("views/partials/hint/hint-like.html", '<p>没有新通知, 去 <a href="/music/new">上传音乐</a> , 获得更多的赞！</p>'), a.put("views/partials/hint/hint-messageList.html", "<p>没有新通知</p>"), a.put("views/partials/hint/hint-search.html", '<div><i class="icon-eye u-colorBlue"></i> 抱歉，未找到与"{{ search.lastSearchString }}"相关的内容<p>或者可以看看以下推荐</p></div>'), a.put("views/partials/hint/hint-userActivity.html", '<p>没有更多内容 <span ng-if="dg.session.currentUser.id === user.id">, 去 <a href="/explore">赞</a> 更多音乐吧！</span></p>'), a.put("views/partials/hint/hint-userFollow.html", "<p>没有更多内容</p>"), a.put("views/partials/hint/hint-userMusic.html", '<p>没有更多内容 <span ng-if="dg.session.currentUser.id === user.id">, 去 <a href="/music/new">上传音乐</a> 吧！</span></p>'), a.put("views/partials/hint/hint-userPosts.html", '<p>没有更多内容 <span ng-if="dg.session.currentUser.id === user.id">, 去 <a href="/posts/new">发布信息</a> 吧！</span></p>'), a.put("views/partials/notification.html", '<div class="u-cf" ng-switch="object.operation"><div class="thing u-cf"><span class="thing-highlight" ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-click="notification.markAsRead(object.id)" ng-switch-when="follow"><img class="avatar" alt="{{ object.actor.nickname }}" width="30" height="30" dg-image="{{ object.actor.avatars.origin }}"></a> <a ng-href="/{{ object.actor.name }}" ng-switch-default=""><img class="avatar" alt="{{ object.actor.nickname }}" width="30" height="30" dg-image="{{ object.actor.avatars.origin }}"></a></span><div class="thing-well"><span ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-switch-when="follow" ng-click="notification.markAsRead(object.id)"><span ng-bind="object.actor.nickname"></span></a> <a ng-href="/{{ object.actor.name }}" ng-switch-default=""><span ng-bind="object.actor.nickname"></span></a></span> <span ng-switch-when="message">私信了你： <a ng-href="/connect/message/{{ object.actor.name }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="follow">关注了你</span> <span ng-switch-when="like" ng-switch="object.notifiable.type">赞了你的 <span ng-switch-when="music">音乐： <a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch="object.notifiable.type" ng-switch-when="comment">评论了你的 <span ng-switch-when="music">音乐： <a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post">合作信息： <a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch-when="mention" ng-switch="object.notifiable.type">在评论中提到了你： <span ng-switch-when="music"><a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post"><a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch-when="reply" ng-switch="object.notifiable.type">回复了你的评论： <span ng-switch-when="music"><a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post"><a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span></div></div></div>'), a.put("views/partials/player-global.html", '<div class="main-outer" ng-init="state = dg.playbackState"><div class="player-current u-cf" ng-show="state.expanded"><a class="thing-highlight" title="{{ state.lastMusic.name }}" ng-href="/music/{{ state.lastMusic.id }}"><img class="cover" alt="state.lastMusic.name" width="80" height="80" dg-image="{{ state.lastMusic.covers.origin }}"></a><div class="u-textTruncate"><a class="thing-title" title="{{ state.lastMusic.name }}" ng-href="/music/{{ state.lastMusic.id }}" ng-bind="state.lastMusic.name"></a> <a class="u-table" title="{{ state.lastMusic.user.nickname }}" ng-href="/{{ state.lastMusic.user.name }}" ng-bind="state.lastMusic.user.nickname"></a></div><a class="player-like icon-outer icon-outer-large" ng-click="dg.like.toggle(state.lastMusic)"><i class="icon-circle"></i> <i class="icon-thumbs-up-small" ng-class="{\'u-colorBlue\': state.lastMusic.liked}"></i></a></div><progress-bar percent-loaded="state.getLastSound().percentLoaded" percent-played="state.getLastSound().percentPlayed" on-seek="dg.player.seek(percentOffset)"></progress-bar><div class="player-actions u-cf"><div class="player-controls u-pullLeft"><a class="player-play icon-outer icon-outer-large" ng-class="{\'player-playing\': state.getLastSound().state\n                         == state.states.playing}" ng-click="dg.player.toggle(state.lastMusic)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\':\n                             state.getLastSound().state ==\n                             state.states.playing}"></i></a></div><div class="u-pullRight"><a class="player-expand icon-outer icon-outer-large" ng-click="state.toggleExpandStatus()"><i class="icon-circle"></i> <i class="icon-list" ng-class="{\'u-colorBlue\': state.expanded}"></i></a></div></div></div>'), a.put("views/partials/publishing.html", '<a class="btn btn-reverse btn-medium" href="/music/new" dg-match-path="" strict="true" ng-hide="pathMatched" ng-if="dg.device.isDesktop()"><i class="icon-music"></i>上传音乐</a><a class="btn btn-medium" href="/posts/new" dg-match-path="" strict="true" ng-hide="pathMatched"><i class="icon-post"></i>发布信息</a>'), a.put("views/partials/sharing.html", '<div class="Arrange Arrange--middle u-paddingVs u-paddingHm" ng-controller="SharingCtrl as sharing"><span class="Arrange-sizeFit u-inline muted">分享到：</span> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'tsina\', sharingThing, sharingThing.$type) }}" dg-icon="weibo" icon-size="26"></a> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'douban\', sharingThing, sharingThing.$type) }}" dg-icon="douban" icon-size="26"></a> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'tqq\', sharingThing, sharingThing.$type) }}" dg-icon="tqq" icon-size="26"></a></div>'), a.put("views/partials/taxonomy/category.html", '<dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn ng-bind="taxonomy.taxonomyName"></dfn>：</dt><dd class="tag-item" ng-repeat="category in taxonomy.taxonomies"><a class="btn-tag" ng-bind="category.name" ng-click="taxonomy.activeCategory = category" ng-class="{\'btn-tag-active\': category == taxonomy.activeCategory}"></a></dd></dl><div ng-if="taxonomy.activeCategory"><dl class="u-borderB u-paddingLm u-cf" ng-repeat="group in taxonomy.activeCategory.groups"><dt class="tag-header" ng-bind="group.name"></dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-href="/tags/{{ tag.slug }}" target="_blank" ng-bind="tag.name"></a></dd></dl></div>'), a.put("views/partials/taxonomy/tag-group.html", '<dl class="u-paddingLm u-cf"><dt class="tag-header"><dfn ng-bind="taxonomy.taxonomyName"></dfn>：</dt><dd class="tag-item" ng-repeat="tag in taxonomy.taxonomies"><a class="btn-tag" ng-href="/tags/{{ tag.slug }}" ng-bind="tag.name"></a></dd></dl>'), a.put("views/partials/thing/music.html", '<article class="thing thing-music u-cf"><div class="thing-cover u-pullLeft" ng-class="{\'cover-small u-marginRm\': dg.device.isPhone(),\n                   \'cover-medium\': !dg.device.isPhone()}"><a ng-href="/music/{{ thing.id }}" target="_blank"><img class="cover cover-medium" alt="{{ thing.name }}" width="120" height="120" ng-if="!dg.device.isPhone()" dg-image="{{ thing.covers.origin }}"> <img class="cover cover-small" alt="{{ thing.name }}" width="80" height="80" ng-if="dg.device.isPhone()" dg-image="{{ thing.covers.origin }}"></a><div class="player"><a class="thing-play img-circle icon-outer icon-outer-large" ng-click="dg.player.toggle(thing)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\': dg.playbackState.sounds[thing.id].state\n                             == dg.playbackState.states.playing}"></i></a></div></div><div ng-class="{\'thing-well\': !dg.device.isPhone()}"><header class="thing-info thing-separator u-borderB"><div class="u-textTruncate"><a class="thing-title" ng-href="/music/{{ thing.id }}" target="_blank" ng-bind="thing.name"></a></div><div class="u-textTruncate"><a ng-href="/{{ thing.user.name }}" target="_blank" ng-bind="thing.user.nickname"></a></div></header><footer class="thing-actions u-cf" ng-if="thing.published"><a class="btn btn-action btn-large btn-like thing-action" ng-click="dg.like.toggle(thing)" ng-class="{\'btn-unlike\': thing.liked}"><i class="icon-thumbs-up"></i> <small ng-bind="thing.like_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-if="!hideExtraButton" ng-class="{\'btn-highlight\': actionType === \'comment\' && extendedStatus === true}" ng-click="dispatch(\'comment\')"><i class="icon-comment"></i> <span ng-hide="thing.comments_count">评论</span> <small ng-show="thing.comments_count" ng-bind="thing.comments_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-if="!hideExtraButton" ng-class="{\'btn-highlight\': actionType === \'sharing\' && extendedStatus === true}" ng-click="dispatch(\'sharing\')"><i class="icon-share"></i>分享</a></footer></div></article>'), a.put("views/partials/thing/post.html", '<article class="thing thing-post u-cf"><div class="thing-info u-borderB"><header class="u-cf"><div class="u-pullLeft"><a class="thing-title" ng-href="/posts/{{ thing.id }}" target="_blank" ng-bind="thing.title"></a><ul class="separated muted"><li class="u-inline" ng-repeat="tag in thing.tags"><a ng-href="/tags/{{ tag.slug }}" target="_blank" ng-bind="tag.name"></a></li></ul></div></header><div class="thing-content-html u-textBreak" ng-bind-html="thing.content_html"></div></div><footer><div class="thing-actions" ng-if="!hideExtraButton"><a class="btn btn-large btn-action thing-action" ng-class="{\'btn-highlight\': actionType === \'comment\' && extendedStatus === true}" ng-click="dispatch(\'comment\', \'post\')"><i class="icon-comment"></i> <span ng-hide="thing.comments_count">评论</span> <small ng-show="thing.comments_count" ng-bind="thing.comments_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-class="{\'btn-highlight\': actionType === \'sharing\' && extendedStatus === true}" ng-click="dispatch(\'sharing\', \'post\')"><i class="icon-share"></i>分享</a></div></footer></article>'), a.put("views/partials/thing/user.html", '<article class="thing thing-user u-cf"><a class="thing-highlight" ng-href="/{{ thing.name }}" target="_blank"><img class="avatar" width="40" height="40" dg-image="{{ thing.avatars.origin }}"></a> <i class="u-pullRight" dg-follow="thing"></i><div class="thing-info"><a ng-href="/{{ thing.name }}" target="_blank" ng-bind="thing.nickname"></a><dl class="list-inline"><dt ng-if="thing.city"><dfn>地区</dfn>：</dt><dd ng-if="thing.city"><a ng-href="/tags/{{ thing.city.slug }}" target="_blank" ng-bind="thing.city.name"></a></dd></dl><dl class="list-inline"><dt ng-if="thing.identity"><dfn>身份</dfn>：</dt><dd ng-if="thing.identity"><a ng-href="/tags/{{ thing.identity.slug }}" target="_blank" ng-bind="thing.identity.name"></a></dd></dl></div></article>'), a.put("views/partials/tracker/input.html", '<div class="tracker-input"><i class="tracker-spinner" ng-show="tracker.active()" ng-show="!isHidden"></i> <span class="icon-ok-circle u-colorGreen" ng-show="onSuccess"></span> <span class="icon-cancel-circle u-colorRed" ng-show="onFailure"></span></div>'), a.put("views/partials/tracker/objects.html", '<div class="tracker" ng-hide="isHidden"><i class="tracker-spinner spinner" ng-show="tracker.active()"></i><div class="tracker-notice" ng-show="onLastPage">已经到最后一页啦</div></div>'), a.put("views/partials/tracker/session.html", '<div class="tracker" ng-hide="isHidden"><i class="tracker-spinner spinner" ng-show="tracker.active()"></i></div>'), a.put("views/partials/uploading/dragndrop.html", '<div class="uploading"><div class="uploading-dnd u-cf" dg-uploader-dnd=""><div ng-transclude="" ng-show="uploadState==\'normal\'"></div><div class="uploading-info"><div class="uploading-message" ng-if="uploadType == \'audio\'"><div class="uploading-icon" ng-class="\'uploading-icon-\' + uploadType"></div></div><div class="uploading-message-outer u-isHidden" ng-show="uploadState==\'normal\'"><div class="uploading-message-bg"></div><div class="uploading-message"><span class="muted"><span ng-if="supportFeatures.dragndrop">将文件拖放到这里或</span> 点击下方的按钮上传文件</span><p class="muted" ng-if="uploadType == \'image\'">请上传尺寸大于 240x240 的图片</p></div></div><div class="progress-outer uploading-progress" ng-show="uploadState==\'uploading\'"><div class="progress"></div><div class="progress progress-playing" ng-style="{\'width\': percentUploaded}"></div></div><span class="uploading-message muted" ng-if="uploadState==\'success\' || uploadState==\'failed\'"><div class="uploading-message-success" ng-if="uploadState==\'success\'"><div class="uploading-icon"></div><span ng-bind-template="{{ uploadThing }}上传成功！"></span></div><div class="uploading-message-fail" ng-if="uploadState==\'failed\'"><div class="uploading-icon uploading-icon-fail"></div><span ng-bing-template="{{ uploadThing }}上传失败，请重新上传"></span></div></span></div></div><div class="uploading-select"><a class="btn btn-medium btn-reverse" ng-hide="uploadState==\'uploading\'" ng-bind-template="上传{{ uploadThing }}"></a> <span class="btn btn-medium" ng-if="uploadState==\'uploading\'" ng-bind-template="上传{{ uploadThing }}中"></span></div></div>'), a.put("views/partials/uploading/insert.html", '<span class="icon-image btn-right"><a ng-hide="uploadState==\'uploading\'">插入图片</a> <span ng-if="uploadState==\'uploading\'">上传图片中 {{percentUploaded}}</span> <span ng-if="uploadState==\'failed\'">失败，请重试上传</span></span>'), a.put("views/partials/user-info.html", '<div class="u-textCenter" itemscope="" itemtype="http://schema.org/Person"><a title="{{ user.nickname }}" ng-href="/{{ user.name }}"><img class="avatar avatar-large user-section" alt="{{ user.nickname }}" width="80" height="80" itemprop="image" dg-image="{{ user.avatars.origin }}"><div class="user-nickname user-section" itemprop="name" ng-bind="user.nickname"></div></a><div class="user-section" ng-if="user"><i dg-follow="user"></i> <a class="btn btn-small btn-message u-marginLm" ng-href="/connect/message/{{ user.name }}" ng-if="dg.session.currentUser && dg.session.currentUser.id != user.id">私信</a></div><div class="user-section" ng-if="user"><a class="btn btn-small" href="/settings/profile" ng-if="dg.session.currentUser.id == user.id"><i class="icon-profile"></i>更改个人资料</a></div><dl class="separated list-inline"><dt ng-if="user.city.name"><dfn>地址</dfn>：</dt><dd ng-if="user.city"><a itemprop="addressLocality" ng-href="/tags/{{ user.city.slug }}" ng-bind="user.city.name"></a></dd><dt ng-if="user.identity"><dfn>身份</dfn>：</dt><dd ng-if="user.identity"><a ng-href="/tags/{{ user.identity.slug }}" ng-bind="user.identity.name"></a></dd><dt ng-if="user.description"><dfn>简介</dfn>：</dt><dd itemprop="description" ng-if="user.description" ng-bind="user.description"></dd></dl><dl class="separated list-inline"><dt ng-if="user.following_count"><dfn>关注</dfn>：</dt><dd ng-if="user.following_count"><a ng-href="/{{ user.name }}/following" ng-bind="user.following_count"></a></dd><dt ng-if="user.followers_count"><dfn>粉丝</dfn>：</dt><dd ng-if="user.followers_count"><a ng-href="/{{ user.name }}/followers" ng-bind="user.followers_count"></a></dd><dt ng-if="user.music_count"><dfn>音乐</dfn>：</dt><dd ng-if="user.music_count"><a ng-href="/{{ user.name }}/music" ng-bind="user.music_count"></a></dd></dl><ul class="ButtonGroup"><li class="ButtonGroup-item" ng-if="user.sns.weibo"><a class="Button" ng-href="{{ user.sns.weibo.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="weibo" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="user.sns.douban"><a class="Button" ng-href="{{ user.sns.douban.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="douban" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="user.sns.tqq"><a class="Button" ng-href="{{ user.sns.tqq.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="tqq" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="user.website"><a class="Button" itemprop="url" ng-href="{{ user.website }}" rel="me nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="link" icon-size="30"></i></a></li></ul></div>'), a.put("views/partials/wizard/header.html", '<header class="u-marginBl u-textCenter"><a href="/"><img src="/images/logo.f264d1ff.png"></a></header>'), a.put("views/post/new.html", '<form class="streams" name="postForm" ng-submit="newPost.submit()"><label class="form-field">标题： <span class="input-message input-error" ng-if="newPost.errors.title" ng-bind="newPost.errors.title.message"></span><input class="u-sizeFull" type="text" name="title" ng-model="newPost.post.title" ng-change="newPost.errors.title = null" ng-maxlength="40" placeholder="请输入 40 字以内的标题"></label><div class="form-field form-textarea"><label class="textarea-header box-header" for="content">正文： <span class="input-message input-error" ng-if="newPost.errors.content" ng-bind="newPost.errors.content.message"></span><dg-uploader template-name="insert" upload-type="image" upload-callback="newPost.insertImg(\'content\', url)" upload-folder="posts"></dg-uploader></label><textarea id="content" cols="10" rows="15" name="content" ng-model="newPost.post.content" ng-change="newPost.errors.content = null">\n        </textarea></div><div class="form-field box u-paddingBn"><dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn>分类</dfn>： <span class="input-message input-error" ng-if="newPost.errors.category" ng-bind="newPost.errors.category.message"></span></dt><dd class="tag-item" ng-repeat="category in newPost.categories"><a class="btn-tag" ng-bind="category.name" ng-click="newPost.activeCategory = category;newPost.errors.category = null" ng-class="{\'btn-tag-active\': category.id == newPost.activeCategory.id}"></a></dd></dl><dl class="u-borderB u-paddingLm u-cf" ng-init="group.activeTags = []" ng-repeat="group in newPost.activeCategory.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn> <span ng-if="group.multi_selectable">（多选）</span>： <span class="input-message input-error" ng-if="newPost.errors.tags && !group.activeTags.length" ng-bind="newPost.errors.tags.message"></span></dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-init="newPost.taxonomy.initActiveTags(tag, group, newPost.post.tags)" ng-click="newPost.taxonomy.selectTag(tag, group)" ng-class="{\'btn-tag-active\': newPost.taxonomy.isTagActive(tag, group.activeTags)}"></a></dd></dl></div><div class="form-actions"><span class="btn-outer"><button class="btn btn-medium btn-reverse btn-action" type="submit">提交</button> <i dg-tracker="updating" type="input"></i></span></div></form>'), a.put("views/post/post.html", '<div class="streams" ng-if="post"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft"><a class="u-pullLeft u-marginRm" title="{{ post.user.nickname }}" ng-href="/{{ post.user.name }}"><img class="avatar" width="40" height="40" dg-image="{{ post.user.avatars.origin }}"></a><div class="u-pullLeft muted"><p>由 <a title="{{ post.user.nickname }}" ng-bind="post.user.nickname" ng-href="/{{ post.user.name }}"></a> 发布</p><time datetime="{{ post.created_at }}"></time></div></div><div class="activity-actions" ng-if="post.own"><a class="btn btn-small" ng-href="/posts/{{ post.id }}/update">编辑</a></div></div><div class="thing-outer" ng-if="post" ng-init="thing = post; hideExtraButton = true;"><div ng-include="\'views/partials/thing/post.html\'"></div></div><div class="box u-marginTl" ng-init="sharingThing = post; sharingThing.$type = \'post\';" ng-include="\'views/partials/sharing.html\'"></div><div class="conversation-outer"><i dg-comment="{{ post.id }}" host-type="post"></i></div></div>'), a.put("views/post/posts.html", '<div class="home-banner-outer cards-outer" ng-if="!dg.session.currentUser"><span ng-include="\'views/home/banner.html\'"></span></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="posts.getObjects()" infinite-scroll-disabled="posts.query.paused" infinite-scroll-distance="1"><div class="box u-marginTm" dg-taxonomy="posts/categories" taxonomy-name="分类" ng-include="\'views/partials/taxonomy/category.html\'"></div><div class="cards u-cf"><article class="card" ng-init="post = object" ng-repeat="object in posts.objects"><div ng-include="\'views/partials/card/post.html\'"></div></article></div><i dg-tracker="objects"></i></div>'), a.put("views/search/filter.html", "<div class=\"tabs-outer tabs-4cols\" ng-controller=\"SearchMatchingCtrl as match\"><a class=\"tab\" ng-click=\"match.location.search('type', null)\" ng-class=\"{'tab-current': match.test('type')}\">全部</a> <a class=\"tab\" ng-click=\"match.location.search('type', 'music')\" ng-class=\"{'tab-current': match.test('type', 'music')}\">音乐</a> <a class=\"tab\" ng-click=\"match.location.search('type', 'user')\" ng-class=\"{'tab-current': match.test('type', 'user')}\">用户</a> <a class=\"tab\" ng-click=\"match.location.search('type', 'post')\" ng-class=\"{'tab-current': match.test('type', 'post')}\">合作信息</a></div>"), a.put("views/search/search.html", '<div class="streams" infinite-scroll="search.getObjects()" infinite-scroll-disabled="search.query.paused" infinite-scroll-distance="1"><div ng-include="\'views/search/filter.html\'"></div><form class="u-marginTm" id="searchForm" ng-submit="search.getObjects(true)"><input class="u-sizeFull" id="q" type="text" name="q" autofocus="true" placeholder="输入搜索字词并回车" x-webkit-speech="" x-webkit-grammar="builtin:translate" ng-model="search.g.searchString"></form><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="search.isDataEmpty" ng-init="hintType = \'search\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div ng-if="search.isDataEmpty" ng-controller="ExploreCtrl as explore"><div ng-include="\'views/partials/explore-recommend.html\'"></div></div><div class="activity" ng-repeat="thing in search.objects" ng-controller="ActionCtrl"><div ng-if="thing.klass == \'User\'"><div ng-include="\'views/partials/thing/user.html\'"></div></div><div ng-if="thing.klass == \'Post\'" class="thing-outer"><div ng-include="\'views/partials/thing/post.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget; sharingThing.$type = \'post\'" ng-include="\'views/partials/sharing.html\'"></div></div></div></div><div class="thing-outer" ng-if="thing.klass == \'Music\'"><div ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!search.isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/search/tag.html", '<div class="streams" infinite-scroll="tag.getObjects()" infinite-scroll-disabled="tag.query.paused" infinite-scroll-distance="1"><div ng-include="\'views/search/filter.html\'"></div><div class="box u-paddingHl u-paddingVs u-marginTm">已选标签： <a ng-href="/tags/{{ tag.object.slug }}" ng-bind="tag.object.name"></a></div><div class="activity" ng-repeat="thing in tag.objects" ng-controller="ActionCtrl"><div ng-if="thing.klass == \'User\'"><div ng-include="\'views/partials/thing/user.html\'"></div></div><div ng-if="thing.klass == \'Post\'" class="thing-outer"><div ng-include="\'views/partials/thing/post.html\'"></div></div><div class="thing-outer" ng-if="thing.klass == \'Music\'"><div ng-include="\'views/partials/thing/music.html\'"></div></div><div class="action-outer" ng-if="extendedStatus" ng-switch="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div><i ng-if="!tag.isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/setting/account.html", '<div class="streams"><form class="form-field u-borderB u-paddingTm" name="notifForm" ng-submit="setting.submitNotif()">邮件通知设置：<label class="input-outer"><input class="u-marginRs" type="checkbox" name="followed_notification" ng-model="setting.notification.followed_notification">新的关注</label><label class="input-outer"><input class="u-marginRs" type="checkbox" name="message_notification" ng-model="setting.notification.message_notification">新的私信</label><label class="input-outer"><input class="u-marginRs" type="checkbox" name="comment_notification" ng-model="setting.notification.comment_notification">新的评论</label><button class="btn btn-medium btn-reverse u-marginTm" type="submit">更改邮件通知设置</button></form><form class="form-field u-borderB u-paddingTm" name="nameForm" ng-submit="setting.submit(\'name\')"><label>个性域名： <span class="input-message input-error" ng-if="setting.errors.name" ng-bind="setting.errors.name.message"></span><div class="input-outer"><input id="name" type="text" name="name" ng-model="setting.user.name" ng-change="setting.errors.name = null" ng-required="true"></div></label><label class="muted" for="name" ng-bind-template="{{ dg.location.host() }}/{{ setting.user.name }}"></label><button class="btn btn-medium btn-reverse" type="submit">更改个性域名</button></form><form class="form-field u-borderB u-paddingTm" name="emailForm" ng-submit="emailForm.$valid && setting.submit([\'email\',\'current_password\'])"><label>更改邮箱： <span class="input-message input-error" ng-if="setting.errors.email" ng-bind="setting.errors.email.message"></span><div class="input-outer"><input type="email" name="email" placeholder="请输入新邮箱" ng-model="setting.user.email" ng-change="setting.errors.email = null"></div></label><div ng-show="emailForm.$dirty"><label class="input-outer">当前密码： <span class="input-message input-error" ng-if="setting.errors.current_password" ng-bind="setting.errors.current_password.message"></span><input type="password" name="current_password" ng-model="setting.user.current_password" ng-change="setting.errors.current_password = null" placeholder="验证当前密码后即可更改邮箱"></label><div class="form-actions"><button class="btn btn-medium btn-reverse" type="submit">更改邮箱</button></div></div></form><form class="form-field u-paddingTm" name="passwordForm" ng-submit="setting.submit([\'password\',\'password_confirmation\',\'current_password\'])"><label>更改密码： <span class="input-message input-error" ng-if="setting.errors.password" ng-bind="setting.errors.password.message"></span><div class="input-outer"><input type="password" name="password" ng-model="setting.user.password" ng-change="setting.errors.password = null" placeholder="请输入新密码"></div></label><div ng-show="passwordForm.$dirty"><label class="input-outer">确认新密码： <span class="input-message input-error" ng-if="setting.errors.password_confirmation" ng-bind="setting.errors.password_confirmation.message"></span><input type="password" name="password_confirmation" ng-model="setting.user.password_confirmation" ng-change="setting.errors.password = null" placeholder="再次输入新密码"></label><label class="input-outer">当前密码： <span class="input-message input-error" ng-if="setting.errors.current_password" ng-bind="setting.errors.current_password.message"></span><input type="password" name="current_password" ng-model="setting.user.current_password" ng-change="setting.errors.current_password = null" placeholder="验证当前密码后即可更改密码"></label><div class="form-actions"><button class="btn btn-medium btn-reverse" type="submit">更改密码</button></div></div></form><i dg-tracker="session"></i></div>'), a.put("views/setting/profile.html", '<div class="streams"><form class="setting" name="profile" ng-submit="setting.submit()"><label class="form-field u-cf u-table"><i dg-uploader="" upload-type="image" upload-folder="avatars" upload-thing="头像" target-model="setting.user.avatar"><img class="image-original" width="240" height="240" dg-image="{{ setting.user.avatar || setting.user.avatars.origin }}" ng-model="setting.user.avatar"></i></label><input class="u-isHidden" type="text" name="avatar" ng-model="setting.user.avatar"><label class="form-field">用户昵称： <span class="input-messages"><span class="input-message input-error" ng-if="setting.errors.nickname" ng-bind="setting.errors.nickname.message"></span></span><div class="input-outer"><input type="text" name="nickname" ng-model="setting.user.nickname" ng-change="setting.errors.nickname = null"></div></label><label class="form-field">个人网站： <span class="input-messages"><span class="input-message input-error" ng-show="profile.website.$error.url"></span></span><div class="input-outer"><input type="text" name="website" ng-model="setting.user.website"></div></label><label class="form-field">个人简介：<div class="input-outer"><input type="text" name="description" ng-model="setting.user.description"></div></label><label class="form-field">省份：<div class="input-outer"><select name="province" ng-model="setting.user.province.id" ng-change="setting.changeProvince(setting.user.province.id, setting.areas)" ng-options="area.id as area.name\n                                    for area in setting.areas"></select></div></label><label class="form-field">城市：<div class="input-outer"><select name="city" ng-model="setting.user.city.id" ng-options="city.id as city.name\n                                    for city in setting.cities"></select></div></label><div class="form-field box u-paddingBn"><dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn>身份</dfn>：</dt><dd class="tag-item" ng-repeat="identity in setting.identities"><a class="btn-tag" ng-bind="identity.name" ng-click="setting.changeIdentity(identity, setting.identities)" ng-class="{\'btn-tag-active\': identity.id == setting.activeIdentity.id}"></a></dd></dl><dl class="u-borderB u-paddingLm u-cf" ng-repeat="group in setting.activeIdentity.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn> <span ng-if="group.multi_selectable">（多选）</span>：</dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-init="setting.taxonomy.initActiveTags(tag, group, setting.user.domains)" ng-click="setting.taxonomy.selectTag(tag, group)" ng-class="{\'btn-tag-active\': setting.taxonomy.isTagActive(tag, group.activeTags)}"></a></dd></dl></div><div class="form-actions u-borderT"><button class="btn btn-medium btn-reverse" type="submit">提交更改</button></div></form><ul class="list-sns"><li class="u-paddingVm u-borderB"><i class="icon-weibo"></i> <a ng-if="!setting.user.sns.weibo" ng-href="/users/auth/weibo" target="_self">绑定新浪微博帐号</a> <a ng-if="setting.user.sns.weibo" ng-href="/accounts/authentications/unbind/weibo" ng-bind-template="已绑定新浪微博帐号 {{ setting.user.sns.weibo.name }}" target="_self"></a></li><li class="u-paddingVm u-borderB"><i class="icon-tqq"></i> <a ng-if="!setting.user.sns.tqq" ng-href="/users/auth/tqq" target="_self">绑定腾讯微博帐号</a> <a ng-if="setting.user.sns.tqq" ng-href="/accounts/authentications/unbind/tqq" ng-bind-template="已绑定腾讯微博帐号 {{ setting.user.sns.tqq.name }}" target="_self"></a></li><li class="u-paddingVm u-borderB"><i class="icon-douban"></i> <a ng-if="!setting.user.sns.douban" ng-href="/users/auth/douban" target="_self">绑定豆瓣帐号</a> <a ng-if="setting.user.sns.douban" ng-href="/accounts/authentications/unbind/douban" ng-bind-template="已绑定豆瓣帐号 {{ setting.user.sns.douban.name }}" target="_self"></a></li></ul><i dg-tracker="objects"></i></div>'), a.put("views/user/auth/login.html", '<form class="streams" name="loginForm" novalidate="" ng-submit="login.submitLogin()"><label class="form-field">邮箱 <span class="input-message input-error" ng-if="login.errors.email" ng-bind="login.errors.email.message"></span><input type="email" ng-model="login.user.email" ng-change="login.errors.email = null"></label><label class="form-field">密码 <span class="input-message input-error" ng-if="signup.errors.password" ng-bind="signup.errors.password"></span><input type="password" ng-model="login.user.password" ng-change="signup.errors.password = null"></label><button class="btn btn-medium btn-reverse btn-action" type="submit">登录</button> <a href="/users/password/new" class="muted u-fontSizeS u-marginLm btn-medium" target="_self">忘记密码？</a><ul class="list-sns" ng-include="\'views/user/auth/social-login.html\'"></ul></form>'), a.put("views/user/auth/signup.html", '<form class="streams" name="signupForm" novalidate="" ng-submit="signup.submitSignup()"><label class="form-field">邮箱 <span class="input-message input-error" ng-if="signup.errors.email" ng-bind="signup.errors.email.message"></span><input type="email" name="email" ng-model="signup.user.email" ng-change="signup.errors.email = null"></label><label class="form-field">用户名 <span class="input-message input-error" ng-if="signup.errors.name" ng-bind="signup.errors.name.message"></span><input type="text" name="name" ng-model="signup.user.name" ng-change="signup.errors.name = null" ng-minlength="2" ng-maxlength="44"></label><label class="form-field">密码 <span class="input-message input-error" ng-if="signup.errors.password" ng-bind="signup.errors.password.message"></span><input type="password" name="password" ng-model="signup.user.password" ng-change="signup.errors.password = null"></label><button class="btn btn-medium btn-reverse btn-action" type="submit">注册</button><ul class="list-sns" ng-include="\'views/user/auth/social-login.html\'"></ul></form>'), a.put("views/user/auth/social-login.html", '<li class="u-paddingVm u-borderB"><i class="icon-weibo"></i> <a href="/users/auth/weibo" target="_self">新浪微博帐号登录</a></li><li class="u-paddingVm u-borderB"><i class="icon-tqq"></i> <a href="/users/auth/tqq" target="_self">腾讯微博帐号登录</a></li><li class="u-paddingVm u-borderB"><i class="icon-douban"></i> <a href="/users/auth/douban" target="_self">豆瓣帐号登录</a></li>'), a.put("views/user/profile/activity.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div class="user-outer" ng-if="user"><div ng-include="\'views/partials/user-info.html\'"></div></div><div ng-if="user"><div ng-include="\'views/user/profile/nav.html\'"></div></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'userActivity\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity-outer" ng-repeat="object in objects"><div ng-include="\'views/partials/activity.html\'"></div></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/user/profile/follow.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div class="user-outer" ng-include="\'views/partials/user-info.html\'"></div><div class="tabs-outer tabs-2cols u-cf"><a class="tab" ng-href="/{{ user.name }}/following" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-eye"></i>关注</a> <a class="tab" ng-href="/{{ user.name }}/followers" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-people"></i>粉丝</a></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'userFollow\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activity" ng-repeat="thing in objects"><div class="thing-outer" ng-include="\'views/partials/thing/user.html\'"></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/user/profile/music.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div class="user-outer" ng-include="\'views/partials/user-info.html\'"></div><div ng-include="\'views/user/profile/nav.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="isDataEmpty" ng-init="hintType = \'userMusic\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity" ng-repeat="object in objects" ng-init="thing = object;\n                      thing.$prev = objects[$index - 1];\n                      thing.$next = objects[$index + 1];" ng-controller="ActionCtrl"><div class="u-marginBm u-relative"><div class="activity-context muted"><time datetime="{{ object.created_at }}"></time></div><div class="activity-actions"><span class="u-inlineBlock muted"><i class="icon-headphone"></i> <small ng-bind="object.listen_count"></small></span> <span class="u-paddingLm" ng-if="object.own"><a class="btn btn-small" ng-if="!object.published" ng-click="userMusic.music.publish(object)">公开</a> <a class="btn btn-small" ng-if="dg.device.isDesktop()" ng-href="/music/{{ object.id }}/update">编辑</a> <a class="btn btn-small" ng-click="userMusic.music.remove(object, objects, \'music\')">删除</a></span></div></div><div class="thing-outer" ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/user/profile/nav.html", '<div class="tabs-outer tabs-3cols u-cf"><a class="tab" ng-href="/{{ user.name }}" strict="true" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-stats"></i>动态</a> <a class="tab" ng-href="/{{ user.name }}/music" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-music"></i>音乐</a> <a class="tab" ng-href="/{{ user.name }}/posts" ng-class="{\'tab-current\': pathMatched}" dg-match-path=""><i class="icon-post"></i>合作信息</a></div>'), a.put("views/user/profile/post.html", '<div class="streams" infinite-scroll="userPosts.getObjects()" infinite-scroll-disabled="userPosts.query.paused" infinite-scroll-distance="1"><div class="user-outer" ng-include="\'views/partials/user-info.html\'"></div><div ng-include="\'views/user/profile/nav.html\'"></div><div class="box u-textCenter u-marginVl u-paddingVxl" ng-if="userPosts.isDataEmpty" ng-init="hintType = \'userPosts\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity" ng-repeat="object in userPosts.objects" ng-init="thing = object;" ng-controller="ActionCtrl"><div class="u-marginBm u-relative"><div class="activity-context muted"><time datetime="{{ object.created_at }}"></time></div><div class="activity-actions u-pullRight" ng-if="object.own"><a class="btn btn-small" ng-href="/posts/{{ object.id }}/update">编辑</a> <a class="btn btn-small" ng-click="userPosts.actions.remove(object, userPosts.objects, \'post\')">删除</a></div></div><div class="thing-outer" ng-include="\'views/partials/thing/post.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="box u-marginTl" ng-init="sharingThing = actionTarget; sharingThing.$type = \'post\'" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!userPosts.isDataEmpty" dg-tracker="objects"></i></div>'), a.put("views/user/users.html", '<div class="home-banner-outer cards-outer" ng-if="!dg.session.currentUser"><span ng-include="\'views/home/banner.html\'"></span></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="users.getObjects()" infinite-scroll-disabled="users.query.paused" infinite-scroll-distance="1"><div class="box u-marginTm" dg-taxonomy="users/identities" taxonomy-name="分类" ng-include="\'views/partials/taxonomy/category.html\'"></div><div class="cards u-cf"><article class="card" ng-init="user = object" ng-repeat="object in users.objects"><div ng-include="\'views/partials/card/user.html\'"></div></article></div><i dg-tracker="objects"></i></div>'), a.put("views/wizard/profile.html", '<div class="wizard-outer u-alignCenter"><div ng-include="\'views/partials/wizard/header.html\'"></div><div class="u-paddingVxl u-paddingHxl box u-cf"><form name="profile" ng-submit="wizard.submit()"><div class="u-cf"><div class="wizard-profile-avatar u-pullLeft u-paddingTm u-marginRxxl"><label class="form-field u-table"><i dg-uploader="" upload-type="image" upload-folder="avatars" upload-thing="头像" target-model="wizard.user.avatar"><img dg-image="{{ wizard.user.avatar || wizard.user.avatars.origin }}" width="160" height="160" ng-model="wizard.user.avatar"></i></label><input type="hidden" name="avatar" ng-model="wizard.user.avatar"></div><div class="u-pullLeft"><label class="form-field">用户昵称： <span class="input-message input-error" ng-if="wizard.errors.nickname" ng-bind="wizard.errors.nickname.message"></span><div class="input-outer"><input type="text" name="nickname" ng-model="wizard.user.nickname" ng-required="true"></div></label><label class="form-field">个人简介： <span class="input-message input-error" ng-if="wizard.errors.description" ng-bind="wizard.errors.description.message"></span><div class="input-outer"><input name="description" type="text" ng-model="wizard.user.description"></div></label><label class="form-field">省份： <span class="input-message input-error" ng-if="wizard.errors.province" ng-bind="wizard.errors.province.message"></span><div class="input-outer"><select name="province" ng-model="wizard.user.province.id" ng-change="wizard.province = wizard.changeProvince(wizard.user.province.id, wizard.areas)" ng-options="area.id as area.name for area in wizard.areas"></select></div></label><label class="form-field">城市： <span class="input-message input-error" ng-if="wizard.errors.city" ng-bind="wizard.errors.city.message"></span><div class="input-outer"><select name="city" ng-model="wizard.user.city.id" ng-options="city.id as city.name for city in wizard.province.cities"></select></div></label><div class="form-field"><div class="input-outer">身份： <span class="input-message input-error" ng-if="wizard.errors.identity" ng-bind="wizard.errors.identity.message"></span></div><div class="form-choosers u-cf"><label class="btn btn-medium btn-action" ng-class="{\'btn-reverse\': identity.id == wizard.activeIdentity.id}" ng-repeat="identity in wizard.identities"><input type="radio" name="identity" value="{{ identity.id }}" ng-model="wizard.user.identity.id" ng-change="wizard.activeIdentity = wizard.changeIdentity(identity.id, wizard.identities)"><span ng-bind="identity.name"></span></label></div></div></div></div><div class="form-actions u-textCenter"><button class="btn btn-medium btn-reverse" type="submit">下一步</button></div></form></div><div></div></div>'), a.put("views/wizard/social.html", '<div class="wizard-outer u-alignCenter"><div ng-include="\'views/partials/wizard/header.html\'"></div><div class="u-paddingVxl u-paddingHxl box"><div class="u-marginBl u-paddingBs u-borderB"><p class="u-fontSizeL u-fontNormal u-marginBs">绑定新浪微博，</p><p class="u-fontSizeL u-fontNormal u-marginBs">找朋友，也让朋友找到你，</p><p class="u-fontSizeL u-fontNormal u-marginBs">让你在音乐领域的精彩在这里开始：</p><p class="u-paddingTs u-marginBl"><a ng-href="/users/auth/weibo?returnUrl={{ dg.location.host() }}/wizard/social" ng-if="!wizardSocial.weiboBound" class="btn btn-medium btn-sns-bind" target="_self"><i class="icon-weibo"></i> 绑定新浪微博</a> <a ng-href="/accounts/authentications/unbind/weibo?returnUrl={{ dg.location.host() }}/wizard/social" ng-if="wizardSocial.weiboBound" class="btn btn-medium btn-sns-bound" target="_self"><i class="icon-weibo"></i> 已绑定新浪微博</a></p><div class="u-cf u-paddingBs" ng-if="wizardSocial.users.friends"><h3 class="u-fontSizeL u-fontNormal u-pullLeft">你的微博朋友：</h3><label class="u-pullRight u-isActionable">全选<input name="published" type="checkbox" ng-checked="wizardSocial.isAllSeleted(\'friends\')" ng-click="wizardSocial.toggleAll(\'friends\')"></label></div><ul class="wizard-social-user-card-outer" ng-if="wizardSocial.users.friends"><li ng-repeat="user in wizardSocial.users.friends" ng-click="wizardSocial.toggleSelected(\'friends\', user)" class="wizard-social-user-card box u-inlineBlock u-paddingAm"><article><header class="thing-highlight u-block avatar-medium"><img dg-image="{{ user.avatars.origin }}" class="avatar avatar-medium u-inlineBlock u-borderA u-alignTop" width="50" height="50"></header></article><div class="thing-well"><p class="wizard-social-user-card-desc">{{user.nickname}}</p><dl class="wizard-social-user-card-desc list-inline u-textTruncate"><dd ng-if="user.city">{{user.city.name}}</dd><dd ng-if="user.city">/</dd><dd>{{user.identity.name}}</dd></dl><i class="wizard-social-selected u-fontSizeL u-colorBlue icon-ok-circle" ng-hide="wizardSocial.isNotSelected(\'friends\', user)"></i></div></li></ul></div><div class="u-cf u-paddingBs" ng-if="wizardSocial.users.recommended"><h3 class="u-fontSizeL u-fontNormal u-pullLeft">我们为你推荐：</h3><label class="u-pullRight u-isActionable">全选<input name="published" type="checkbox" ng-checked="wizardSocial.isAllSeleted(\'recommended\')" ng-click="wizardSocial.toggleAll(\'recommended\')"></label></div><ul class="wizard-social-user-card-outer" ng-if="wizardSocial.users.recommended"><li ng-repeat="user in wizardSocial.users.recommended" ng-click="wizardSocial.toggleSelected(\'recommended\', user)" class="wizard-social-user-card box u-inlineBlock u-paddingAm"><article><header class="thing-highlight u-block avatar-medium"><img dg-image="{{ user.avatars.origin }}" class="avatar avatar-medium u-inlineBlock u-borderA u-alignTop" width="50" height="50"></header></article><div class="thing-well"><p class="wizard-social-user-card-desc">{{user.nickname}}</p><dl class="wizard-social-user-card-desc list-inline u-textTruncate"><dd ng-if="user.city">{{user.city.name}}</dd><dd ng-if="user.city">/</dd><dd>{{user.identity.name}}</dd></dl><i class="wizard-social-selected u-fontSizeL u-colorBlue icon-ok-circle" ng-hide="wizardSocial.isNotSelected(\'recommended\', user)"></i></div></li></ul><div class="u-textCenter u-marginTl"><a ng-click="wizardSocial.followThem()" class="btn btn-reverse btn-medium">关注并完成</a> <a href="/explore" class="wizard-skip-social muted u-fontSizeS btn-medium">跳过这一步，开始探索</a></div></div><div></div></div>')
	}
]), angular.module("dgWizard", ["dgWizardProfile", "WizardSocial"]), angular.module("dgWizardProfile", []).controller("WizardProfileCtrl", ["$location", "Session", "Restangular",
	function(a, b, c) {
		"use strict";
		var d = this;
		d.changeProvince = function(a, b) {
			return _.find(b, {
				id: a
			})
		}, d.changeIdentity = function(a, b) {
			return _.find(b, {
				id: a
			})
		};
		var e = c.all("areas").getList(),
			f = c.all("users/identities").getList();
		b.requestCurrentUser().then(function(a) {
			return d.user = a, e.then(function(b) {
				d.areas = b, a.province && (d.province = _.find(b, {
					id: a.province.id
				}))
			}), f.then(function(b) {
				d.identities = b, a.identity && (d.activeIdentity = _.find(b, {
					id: a.identity.id
				}))
			}), a
		}), d.submit = function() {
			var b = {
				avatar: d.user.avatar,
				nickname: d.user.nickname,
				description: d.user.description,
				province_id: d.user.province ? d.user.province.id : null,
				city_id: d.user.city ? d.user.city.id : null,
				identity_id: d.user.identity ? d.user.identity.id : null
			}, e = c.one("user");
			angular.extend(e, b), e.put().then(function() {
				a.path("/wizard/social")
			}, function(a) {
				d.errors = a.data.errors
			})
		}
	}
]), angular.module("WizardSocial", []).controller("WizardSocialCtrl", ["$location", "$routeParams", "Flash", "Session", "Restangular",
	function(a, b, c, d, e) {
		"use strict";
		var f = this;
		f.selectedIds = {
			friends: [],
			recommended: []
		}, f.users = {
			friends: [],
			recommended: []
		}, "1" === b.success ? b.connected ? c.pushMessage("绑定新浪微博成功", "success") : b.disconnected && c.pushMessage("解除绑定新浪微博成功", "success") : "0" === b.success && c.pushMessage("绑定新浪微博失败", "warning"), d.requestCurrentUser().then(function(a) {
			f.weiboBound = !! a.sns.weibo, f.weiboBound && e.all("user/weibo_friends").getList().then(function(a) {
				f.users.friends = a, f.toggleAll("friends")
			})
		}), e.all("users/recommended").getList().then(function(a) {
			f.users.recommended = a, f.toggleAll("recommended")
		}), f.toggleSelected = function(a, b) {
			if (f.isNotSelected(a, b)) f.selectedIds[a].push(b.id);
			else {
				var c = f.selectedIds[a].indexOf(b.id);
				f.selectedIds[a].splice(c, 1)
			}
		}, f.isNotSelected = function(a, b) {
			return -1 === f.selectedIds[a].indexOf(b.id)
		}, f.toggleAll = function(a) {
			f.isAllSeleted(a) ? f.selectedIds[a] = [] : angular.forEach(f.users[a], function(b) {
				f.isNotSelected(a, b) && f.selectedIds[a].push(b.id)
			})
		}, f.isAllSeleted = function(a) {
			return f.users[a].length === f.selectedIds[a].length
		}, f.followThem = function() {
			var b = f.selectedIds.recommended.concat(f.selectedIds.friends);
			if (b.length) {
				var c = e.one("user/following/batch");
				c.ids = b, c.put().then(function() {
					a.path("/")
				})
			} else a.path("/")
		}
	}
]);