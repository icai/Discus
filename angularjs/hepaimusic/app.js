!function($, done) {
  $.module("dg", ["ngRoute", "ngTouch", "ngAnimate", "ngResource", "ngSanitize", "dgConfig", "dgCommon", "dgHome", "dgUser", "dgSearch", "dgMusic", "dgPage", "dgPost", "dgConnect", "dgSetting", "dgFeedback", "dgWizard", "dgTemplates", "l42y.match-path"]).controller("DragonCtrl", ["$scope", "$window", "$timeout", "$location", "G", "Like", "Flash", "Title", "Device", "Player", "Layout", "Tracker", "Session", "PlaybackState", function($rootScope, $window, $timeout, location, g, dataAndEvents, flash, 
  v, bowser, player, layoutParam, tracker, security, deepDataAndEvents) {
    var toggleMobileNav = this;
    security.requestCurrentUser();
    this.g = g;
    this.like = dataAndEvents;
    this.flash = flash;
    this.title = v;
    this.layout = layoutParam;
    this.device = bowser;
    this.player = player;
    this.session = security;
    this.tracker = tracker;
    /** @type {Object} */
    this.location = location;
    this.modernizr = Modernizr;
    this.playbackState = deepDataAndEvents;
    var transitionTimeout;
    var scrollY;
    var windowEl = $.element($window);
    windowEl.bind("scroll touchmove", function() {
      scrollY = windowEl[0].scrollY;
      $rootScope.$apply(function() {
        /** @type {boolean} */
        g.hideStickyElement = 0 >= scrollY ? false : true;
        $timeout.cancel(transitionTimeout);
        transitionTimeout = $timeout(function() {
          /** @type {boolean} */
          g.hideStickyElement = false;
        }, 500);
      });
    });
    /**
     * @param {boolean} result
     * @return {?}
     */
    this.toggleMobileNav = function(result) {
      return g.mobileNavExpanded = $.isDefined(result) ? result : !g.mobileNavExpanded, g.mobileNavExpanded;
    };
    /**
     * @return {undefined}
     */
    this.whatShouldIDo = function() {
      if (bowser.isDesktop()) {
        location.url("/");
      } else {
        toggleMobileNav.toggleMobileNav();
      }
    };
  }]);
  $.module("dgConfig", ["restangular", "dgSharing", "l42y.meta.title"]).constant("apiPrefix", "/v1").config(["SharingProvider", function(eventData) {
    /** @type {string} */
    eventData.settings.jiathisUid = "1373659662160721";
    eventData.settings.appKey = {
      tqq : "801186114",
      tsina : "3633818594",
      douban : "04ee4bdc9db6f50d0ecae395d924df27"
    };
  }]).config(["RestangularProvider", "apiPrefix", function(request, post_body) {
    request.setBaseUrl(post_body);
    request.requestParams.get = {
      per : 30
    };
  }]).config(["$httpProvider", "$locationProvider", function($httpProvider, $locationProvider) {
    /** @type {string} */
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $locationProvider.hashPrefix("!").html5Mode(true);
  }]).config(["TitleProvider", function(Y) {
    Y.config({
      name : "\u5408\u62cd",
      slogan : "\u4e00\u8d77\u505a\u597d\u97f3\u4e50",
      format : "%(page)s - %(name)s"
    });
  }]).factory("Cached", ["apiPrefix", "Restangular", function(value, Restangular) {
    return Restangular.withConfig(function(object) {
      object.setBaseUrl(value);
      object.setDefaultHttpFields({
        cache : true
      });
    });
  }]);
  $.module("dgConfig").config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
      title : {
        format : "%(name)s - %(slogan)s"
      },
      controller : "HomeCtrl as home",
      templateUrl : "views/home/home.html"
    }).when("/wizard", {
      redirectTo : "/wizard/profile"
    }).when("/wizard/profile", {
      title : {
        page : "\u5b8c\u5584\u8d44\u6599"
      },
      layout : "1col",
      controller : "WizardProfileCtrl as wizard",
      templateUrl : "views/wizard/profile.html",
      loginRequired : true
    }).when("/wizard/social", {
      title : {
        page : "\u6dfb\u52a0\u597d\u53cb"
      },
      layout : "1col",
      controller : "WizardSocialCtrl as wizardSocial",
      templateUrl : "views/wizard/social.html",
      loginRequired : true
    }).when("/explore", {
      title : {
        page : "\u63a2\u7d22"
      },
      controller : "ExploreCtrl as explore",
      templateUrl : "views/home/explore.html",
      loginRequired : true
    }).when("/about", {
      title : {
        page : "\u5173\u4e8e\u5408\u62cd"
      },
      layout : "1col",
      templateUrl : "views/page/about.html"
    }).when("/about/services", {
      title : {
        page : "\u97f3\u4e50\u5b75\u5316\u5668"
      },
      layout : "1col",
      controller : "ServicesCtrl as services",
      templateUrl : "views/page/services.html"
    }).when("/links", {
      title : {
        page : "\u53cb\u60c5\u94fe\u63a5"
      },
      controller : "LinkCtrl as link",
      templateUrl : "views/page/links.html"
    }).when("/404", {
      title : {
        page : "\u627e\u4e0d\u5230\u6b64\u9875\u9762"
      },
      layout : "1col",
      templateUrl : "views/page/404.html"
    }).when("/connect", {
      redirectTo : "/connect/like"
    }).when("/connect/message", {
      title : {
        page : "\u79c1\u4fe1"
      },
      controller : "MessageListCtrl",
      templateUrl : "views/connect/message/conversation.html",
      loginRequired : true
    }).when("/connect/message/:username", {
      title : {
        page : "\u79c1\u4fe1"
      },
      controller : "MessageDetailCtrl",
      templateUrl : "views/connect/message/message.html",
      loginRequired : true
    }).when("/connect/like", {
      title : {
        page : "\u8d5e"
      },
      controller : "NotificationCtrl",
      templateUrl : "views/connect/like.html",
      loginRequired : true
    }).when("/connect/follow", {
      title : {
        page : "\u5173\u6ce8"
      },
      controller : "NotificationCtrl",
      templateUrl : "views/connect/follow.html",
      loginRequired : true
    }).when("/connect/comment", {
      title : {
        page : "\u8bc4\u8bba"
      },
      controller : "NotificationCtrl",
      templateUrl : "views/connect/comment.html",
      loginRequired : true
    }).when("/signup", {
      title : {
        page : "\u6ce8\u518c"
      },
      controller : "AuthCtrl as signup",
      templateUrl : "views/user/auth/signup.html"
    }).when("/login", {
      title : {
        page : "\u767b\u5f55"
      },
      controller : "AuthCtrl as login",
      templateUrl : "views/user/auth/login.html"
    }).when("/password/lost", {
      title : {
        page : "\u5fd8\u8bb0\u5bc6\u7801"
      },
      layout : "1col",
      controller : "LostPasswordCtrl as lost",
      templateUrl : "views/user/auth/lost-password.html"
    }).when("/password/reset", {
      title : {
        page : "\u91cd\u7f6e\u5bc6\u7801"
      },
      layout : "1col",
      controller : "ResetPasswordCtrl as reset",
      templateUrl : "views/user/auth/reset-password.html"
    }).when("/search", {
      title : {
        page : "\u641c\u7d22"
      },
      controller : "SearchCtrl as search",
      templateUrl : "views/search/search.html"
    }).when("/music", {
      title : {
        page : "\u97f3\u4e50"
      },
      controller : "MusicListCtrl as music",
      templateUrl : "views/music/music-list.html"
    }).when("/music/new", {
      title : {
        page : "\u4e0a\u4f20\u97f3\u4e50"
      },
      controller : "MusicUploadingCtrl as uploading",
      templateUrl : "views/music/uploading.html",
      loginRequired : true
    }).when("/music/:musicId", {
      controller : "MusicCtrl",
      templateUrl : "views/music/music.html"
    }).when("/music/:musicId/update", {
      controller : "MusicUploadingCtrl as uploading",
      templateUrl : "views/music/uploading.html",
      loginRequired : true
    }).when("/posts", {
      title : {
        page : "\u5408\u4f5c\u4fe1\u606f"
      },
      controller : "PostsCtrl as posts",
      templateUrl : "views/post/posts.html"
    }).when("/posts/new", {
      title : {
        page : "\u53d1\u5e03\u5408\u4f5c\u4fe1\u606f"
      },
      controller : "NewPostCtrl as newPost",
      templateUrl : "views/post/new.html",
      loginRequired : true
    }).when("/posts/:postId", {
      controller : "PostCtrl",
      templateUrl : "views/post/post.html"
    }).when("/posts/:postId/update", {
      controller : "NewPostCtrl as newPost",
      templateUrl : "views/post/new.html",
      loginRequired : true
    }).when("/feedback", {
      title : {
        page : "\u53cd\u9988"
      },
      controller : "FeedbackCtrl",
      templateUrl : "views/feedback/feedback.html",
      loginRequired : true
    }).when("/settings", {
      redirectTo : "/settings/account"
    }).when("/settings/account", {
      title : {
        page : "\u8d26\u53f7\u8bbe\u7f6e"
      },
      controller : "SettingAccountCtrl as setting",
      templateUrl : "views/setting/account.html",
      loginRequired : true
    }).when("/settings/password", {
      title : {
        page : "\u5bc6\u7801\u8bbe\u7f6e"
      },
      controller : "SettingAccountCtrl as setting",
      templateUrl : "views/setting/password.html",
      loginRequired : true
    }).when("/settings/notifications", {
      title : {
        page : "\u90ae\u4ef6\u901a\u77e5\u8bbe\u7f6e"
      },
      controller : "SettingNotifCtrl as setting",
      templateUrl : "views/setting/notification.html",
      loginRequired : true
    }).when("/settings/profile", {
      title : {
        page : "\u4e2a\u4eba\u8d44\u6599\u8bbe\u7f6e"
      },
      controller : "SettingProfileCtrl as setting",
      templateUrl : "views/setting/profile.html",
      loginRequired : true
    }).when("/users", {
      title : {
        page : "\u7528\u6237"
      },
      controller : "UserListCtrl as users",
      templateUrl : "views/user/users.html"
    }).when("/:username", {
      controller : "UserActivityCtrl as userActivity",
      templateUrl : "views/user/profile/activity.html",
      caseInsensitiveMatch : true
    }).when("/:username/music", {
      controller : "UserMusicCtrl as userMusic",
      templateUrl : "views/user/profile/music.html",
      caseInsensitiveMatch : true
    }).when("/:username/posts", {
      controller : "UserPostsCtrl as userPosts",
      templateUrl : "views/user/profile/post.html",
      caseInsensitiveMatch : true
    }).when("/:username/info", {
      controller : "UserInfoCtrl as userInfo",
      templateUrl : "views/user/profile/info.html",
      caseInsensitiveMatch : true
    }).when("/:username/:type", {
      controller : "UserFollowCtrl as userFollow",
      templateUrl : "views/user/profile/follow.html",
      caseInsensitiveMatch : true
    }).otherwise({
      title : {
        page : "\u627e\u4e0d\u5230\u6b64\u9875\u9762"
      },
      layout : "1col",
      templateUrl : "views/page/404.html"
    });
  }]);
  $.module("dgCommon", ["gaiamagic", "dgDevice", "dgTreasure", "dgLayout", "dgQuery", "dgComment", "dgError", "dgAnalytics", "dgTracker", "dgLike", "dgFollow", "dgAction", "dgSharing", "dgTaxonomy", "dgNavigation", "dgConversation", "dgImage", "dgSlider", "dgFlash", "dgUpload"]);
  $.module("dgDevice", []).factory("Device", ["$window", function(win) {
    var helper = {
      /**
       * @return {?}
       */
      width : function() {
        return win.innerWidth || win.document.documentElement.clientWidth;
      },
      /**
       * @return {?}
       */
      isPhone : function() {
        return helper.width() < 768;
      },
      /**
       * @return {?}
       */
      isTablet : function() {
        return helper.width() >= 768 && helper.width() < 980;
      },
      /**
       * @return {?}
       */
      isDesktop : function() {
        return helper.width() >= 980;
      },
      pixelRatio : win.devicePixelRatio >= 1.5 ? 2 : 1
    };
    return helper;
  }]);
  $.module("dgTreasure", []).factory("G", ["$rootScope", "$location", function($rootScope, $location) {
    var params = {
      searchString : "",
      hideStickyElement : false,
      mobileNavExpanded : false
    };
    /** @type {string} */
    var prefix = "search";
    return $rootScope.$on("$locationChangeSuccess", function() {
      /** @type {boolean} */
      params.isSearchPage = "/search" === $location.path() ? true : false;
    }), $rootScope.$on("$routeChangeSuccess", function(dataAndEvents, deepDataAndEvents, target) {
      if ($.isDefined(target)) {
        /** @type {boolean} */
        params.mobileNavExpanded = false;
      }
      if ($location.path().substring(0, prefix.length) !== prefix) {
        /** @type {string} */
        params.searchString = "";
      }
    }), params;
  }]);
  $.module("dgLayout", []).run(["$rootScope", "Layout", function($rootScope, self) {
    $rootScope.$on("$routeChangeSuccess", function(dataAndEvents, settings) {
      self.current = settings.layout || self.defaultLayout;
    });
  }]).factory("Layout", function() {
    return{
      defaultLayout : "2cols"
    };
  });
  $.module("dgQuery", []).service("Query", ["$timeout", "Tracker", function(next, documentPart) {
    var objects = documentPart.objects;
    /**
     * @return {undefined}
     */
    var get = function() {
      var c = this;
      /** @type {number} */
      this.page = 1;
      /** @type {boolean} */
      this.paused = false;
      /**
       * @param {?} opt_attributes
       * @param {?} target
       * @return {undefined}
       */
      this.get = function(opt_attributes, target) {
        /** @type {boolean} */
        c.paused = true;
        if ($.isDefined(target)) {
          if (target) {
            /** @type {number} */
            c.page = 1;
            /** @type {Array} */
            opt_attributes.scope.objects = [];
            /** @type {boolean} */
            opt_attributes.scope.isDataEmpty = false;
          }
        }
        var cells = $.extend({
          page : c.page
        }, opt_attributes.extraParams);
        var msgPrefix = opt_attributes.thing.getList(cells).then(function(objects) {
          return opt_attributes.scope.objects = $.isDefined(opt_attributes.scope.objects) ? opt_attributes.scope.objects.concat(objects) : objects, objects.length > 0 && (c.page++, next(function() {
            /** @type {boolean} */
            c.paused = false;
          }, 1E3)), opt_attributes.scope.isDataEmpty = 0 === opt_attributes.scope.objects.length && 0 === objects.length ? true : false, objects;
        });
        objects.addPromise(msgPrefix);
      };
    };
    return{
      /**
       * @return {?}
       */
      getInstance : function() {
        return new get;
      }
    };
  }]);
  $.module("dgError", []).config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push(["$q", "Error", function($q, context) {
      return{
        /**
         * @param {Object} response
         * @return {?}
         */
        responseError : function(response) {
          return context.report(response.config.method + " " + response.config.url + " return " + response.status, {
            requestUrl : response.config.url,
            requestMethod : response.config.method
          }), $q.reject(response);
        }
      };
    }]);
  }]).factory("Error", ["$rootScope", function($rootScope) {
    var task = {
      /**
       * @param {Object} user
       * @return {undefined}
       */
      setUser : function(user) {
        if (user) {
          Raven.setUser(user);
          mixpanel.identify(user.id);
          mixpanel.name_tag(user.name + " (" + user.email + ")");
          mixpanel.people.set({
            $email : user.email,
            $created : user.created,
            $username : user.name,
            $first_name : user.nickname,
            $last_login : new Date
          });
        } else {
          Raven.setUser();
          mixpanel.cookie.remove();
        }
      },
      /**
       * @param {boolean} name
       * @param {?} opt_attributes
       * @return {undefined}
       */
      report : function(name, opt_attributes) {
        if (401 !== name) {
          if (404 !== name) {
            if ($.isString(name) || $.isNumber(name)) {
              Raven.captureMessage(name, {
                tags : opt_attributes
              });
            } else {
              Raven.captureException(name, {
                tags : opt_attributes
              });
            }
          }
        }
      }
    };
    return $rootScope.$on("auth:logoutSuccess", function() {
      task.setUser();
    }), $rootScope.$on("auth:currentUserLoaded", function(dataAndEvents, user) {
      task.setUser(user);
    }), task;
  }]);
  $.module("dgAnalytics", ["angulartics", "angulartics.ga", "angulartics.mixpanel"]);
  $.module("dgLike", []).factory("Like", ["$analytics", "Restangular", function($log, el) {
    return{
      /**
       * @param {Element} options
       * @return {undefined}
       */
      toggle : function(options) {
        var like_count = options.like_count;
        var $templateCache = el.one("user/liked/music", options.id);
        if (options.liked) {
          $templateCache.remove().then(function() {
            /** @type {boolean} */
            options.liked = false;
            if (options.like_count > like_count - 1) {
              /** @type {number} */
              options.like_count = options.like_count - 1;
            }
            $log.eventTrack("unlike", {
              category : "Music"
            });
          });
        } else {
          $templateCache.put().then(function() {
            /** @type {boolean} */
            options.liked = true;
            if (options.like_count < like_count + 1) {
              options.like_count = options.like_count + 1;
            }
            $log.eventTrack("like", {
              category : "Music"
            });
          });
        }
      }
    };
  }]);
  $.module("dgFollow", []).directive("dgFollow", ["$location", "Session", "$analytics", "Restangular", function(dataAndEvents, session, assert, row) {
    return{
      scope : {
        target : "=dgFollow"
      },
      replace : true,
      restrict : "EA",
      templateUrl : "views/partials/follow.html",
      /**
       * @param {Object} req
       * @return {undefined}
       */
      link : function(req) {
        req.session = session;
        var $templateCache = row.one("user/following", req.target.name);
        /**
         * @return {undefined}
         */
        req.toggleFollow = function() {
          if ($.isDefined(req.target.is_following)) {
            if (req.target.is_following) {
              $templateCache.remove().then(function() {
                assert.eventTrack("unfollow", {
                  category : "User"
                });
                /** @type {boolean} */
                req.target.is_following = !req.target.is_following;
                req.target.followers_count--;
              });
            } else {
              $templateCache.put().then(function() {
                assert.eventTrack("follow", {
                  category : "User"
                });
                /** @type {boolean} */
                req.target.is_following = !req.target.is_following;
                req.target.followers_count++;
              });
            }
          }
        };
      }
    };
  }]);
  $.module("dgTracker", ["ajoslin.promise-tracker"]).factory("Tracker", ["promiseTracker", function(callback) {
    return{
      session : callback("session"),
      objects : callback("objects")
    };
  }]).directive("dgTracker", ["$timeout", "promiseTracker", function(log, trim) {
    var self = {
      color : "#888",
      lines : 10,
      width : 2,
      length : 6,
      radius : 5,
      direction : -1
    };
    return{
      scope : true,
      replace : true,
      restrict : "EA",
      /**
       * @param {?} tElement
       * @param {Event} element
       * @return {?}
       */
      templateUrl : function(tElement, element) {
        return $.isDefined(element.type) ? "views/partials/tracker/" + element.type + ".html" : "views/partials/tracker/" + element.dgTracker + ".html";
      },
      /**
       * @param {Object} config
       * @param {Object} scope
       * @param {?} element
       * @return {undefined}
       */
      link : function(config, scope, element) {
        log(function() {
          (new Spinner(self)).spin(scope.find("i")[0]);
        }, 500);
        config.tracker = trim(element.dgTracker);
        config.tracker.on("start", function() {
          /** @type {boolean} */
          config.isHidden = false;
          /** @type {null} */
          config.onSuccess = null;
          /** @type {null} */
          config.onFailure = null;
        }).on("error", function() {
          /** @type {boolean} */
          config.onFailure = true;
        }).on("success", function(variables) {
          /** @type {boolean} */
          config.onSuccess = true;
          log(function() {
            /** @type {boolean} */
            config.onSuccess = false;
          }, 3E3);
          if ($.isArray(variables) && !variables.length) {
            /** @type {boolean} */
            config.onLastPage = true;
          } else {
            /** @type {boolean} */
            config.isHidden = true;
          }
        });
      }
    };
  }]);
  $.module("dgComment", []).directive("dgComment", ["Conversation", "Restangular", function(messages, args) {
    var params = {
      post : "posts",
      music : "music"
    };
    return{
      scope : {
        hostId : "@dgComment",
        hostType : "@"
      },
      replace : true,
      restrict : "EA",
      templateUrl : "views/partials/comment.html",
      /**
       * @param {Object} options
       * @return {undefined}
       */
      link : function(options) {
        var self = args.one(params[options.hostType], options.hostId).all("comments");
        options.$watch("hostId", function() {
          if ($.isDefined(options.hostId)) {
            if ("" !== options.hostId) {
              self.getList({
                flatten : true
              }).then(function(comments) {
                options.comments = comments;
              });
            }
          }
        });
        /**
         * @param {string} m
         * @return {undefined}
         */
        options.removeComment = function(m) {
          messages.removeMessage({
            type : "comment",
            host : {
              id : options.hostId,
              type : options.hostType
            },
            message : m,
            messages : options.comments
          });
        };
      }
    };
  }]);
  $.module("dgAction", []).factory("Action", ["Flash", "Restangular", function(dataAndEvents, that) {
    var data = {
      post : {
        url : "posts",
        name : "\u5408\u4f5c\u4fe1\u606f"
      },
      music : {
        url : "music",
        name : "\u97f3\u4e50"
      }
    };
    var iconsClassDictionary = {
      /**
       * @param {Element} handler
       * @param {Array} handlers
       * @param {?} x
       * @return {undefined}
       */
      remove : function(handler, handlers, x) {
        var selfObj = that.one(data[x].url, handler.id);
        selfObj.remove().then(function() {
          if (handlers) {
            handlers.splice(handlers.indexOf(handler), 1);
          }
          dataAndEvents.pushMessage(data[x].name + "\u5df2\u5220\u9664");
        }, function() {
          dataAndEvents.pushMessage(data[x].name + "\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");
        });
      }
    };
    return iconsClassDictionary;
  }]).controller("ActionCtrl", ["$scope", function(that) {
    var ev;
    /**
     * @param {string} name
     * @return {?}
     */
    var createProxy = function(name) {
      switch(name) {
        case "comment":
        ;
        case "sharing":
          return that.thing;
        case "reply":
          return that.object;
        default:
          throw "unknow actionType: " + name;;
      }
    };
    return that.dispatch = function(e, type) {
      /** @type {string} */
      that.actionType = e;
      that.actionTarget = $.extend(createProxy(e), {
        type : type || "music"
      });
      /** @type {boolean} */
      that.extendedStatus = e !== ev ? true : !that.extendedStatus;
      /** @type {string} */
      ev = e;
    }, that;
  }]);
  $.module("dgSharing", []).provider("Sharing", function() {
    var config = {
      appKey : {}
    };
    var settings = {
      settings : config,
      $get : ["$window", "$location", function(obj, $location) {
        return{
          /**
           * @param {Object} item
           * @return {?}
           */
          getLink : function(item) {
            var f = $.isDefined(item.url) ? item.url : $location.absUrl();
            var encodedValue = $.isDefined(item.title) ? item.title : obj.document.title;
            var charset = $.isDefined(item.pic);
            var star = $.isDefined(config.jiathisUid);
            var namespaceMatch = $.isDefined(item.summary);
            var text = config.appKey[item.service];
            var code = $.isDefined(text);
            /** @type {string} */
            var currLink = "http://www.jiathis.com/send/?webid=" + item.service + "&url=" + f + "&title=" + encodeURIComponent(encodedValue) + (charset ? "&pic=" + item.pic : "") + (star ? "&uid=" + config.jiathisUid : "") + (namespaceMatch ? "&summary=" + item.summary : "") + (code ? "&appkey=" + text : "");
            return currLink;
          }
        };
      }]
    };
    return settings;
  }).controller("SharingCtrl", ["$location", "Sharing", function($location, $scope) {
    var namespace = $location.protocol() + "://" + $location.host();
    /**
     * @param {string} opt_attributes
     * @param {Object} self
     * @param {?} wholeMatch
     * @return {?}
     */
    this.getLink = function(opt_attributes, self, wholeMatch) {
      var name;
      var attributes;
      var title;
      switch(wholeMatch) {
        case "post":
          name = self.title;
          attributes = {
            url : namespace + "/posts/" + self.id
          };
          /** @type {string} */
          title = "\u5206\u4eab\u5408\u4f5c\u4fe1\u606f\u300a" + name + "\u300b\u3002";
          break;
        case "user":
          name = self.nickname;
          attributes = {
            url : namespace + "/" + self.name,
            pic : self.avatars.origin
          };
          /** @type {string} */
          title = "\u5206\u4eab\u97f3\u4e50\u4eba " + name + "\u3002";
          break;
        default:
          name = self.name;
          attributes = {
            url : namespace + "/music/" + self.id,
            pic : self.covers.origin
          };
          /** @type {string} */
          title = "\u5206\u4eab " + self.user.nickname + " \u7684\u300a" + name + "\u300b\u3002";
      }
      switch(opt_attributes) {
        case "tsina":
          attributes = $.extend(attributes, {
            title : title + "\uff08\u6765\u81ea@\u5408\u62cd\u7f51\uff09"
          });
          break;
        case "tqq":
          attributes = $.extend(attributes, {
            title : title + "\uff08\u6765\u81ea @hepaimusic\uff09"
          });
          break;
        default:
          attributes = $.extend(attributes, {
            title : name,
            summary : title
          });
      }
      return attributes = $.extend(attributes, {
        service : opt_attributes
      }), $scope.getLink(attributes);
    };
  }]);
  $.module("dgTaxonomy", []).factory("Taxonomy", function() {
    var console = {
      /**
       * @param {Element} chunk
       * @param {string} arr
       * @return {?}
       */
      isTagActive : function(chunk, arr) {
        return arr ? -1 !== arr.indexOf(chunk) : false;
      },
      /**
       * @param {Element} b
       * @param {?} a
       * @return {?}
       */
      activeTag : function(b, a) {
        return a.multi_selectable ? a.activeTags.push(b) : a.activeTags = [b], a.activeTags;
      },
      /**
       * @param {Element} node
       * @param {?} c
       * @return {?}
       */
      deactiveTag : function(node, c) {
        var fromIndex = _.findIndex(c.activeTags, {
          id : node.id
        });
        return c.activeTags.splice(fromIndex, 1), c.activeTags;
      },
      /**
       * @param {Element} obj
       * @param {Array} names
       * @return {?}
       */
      deactiveTags : function(obj, names) {
        return names.forEach(function(resp) {
          resp.groups.forEach(function(dataAndEvents) {
            if (null !== dataAndEvents.activeTags) {
              /** @type {Array} */
              dataAndEvents.activeTags = [];
            }
          });
        }), _.find(names, {
          id : obj.id
        });
      },
      /**
       * @param {Element} s
       * @param {?} r
       * @return {?}
       */
      selectTag : function(s, r) {
        return r.activeTags = r.activeTags || [], r.activeTags = console.isTagActive(s, r.activeTags) ? console.deactiveTag(s, r) : console.activeTag(s, r), r.activeTags;
      },
      /**
       * @param {Element} node
       * @param {?} result
       * @param {?} contexts
       * @return {undefined}
       */
      initActiveTags : function(node, result, contexts) {
        if (contexts) {
          if (_.find(contexts, {
            id : node.id
          })) {
            result.activeTags = console.selectTag(node, result);
          }
        }
      },
      /**
       * @param {?} contexts
       * @return {?}
       */
      getTagIds : function(contexts) {
        /** @type {Array} */
        var r = [];
        return $.forEach(contexts, function(row) {
          $.forEach(row.activeTags, function(e) {
            r = r.concat(e.id);
          });
        }), r;
      }
    };
    return console;
  }).factory("Tag", ["$location", "$routeParams", function(el, node) {
    var self = {
      /**
       * @param {string} path
       * @return {?}
       */
      isActive : function(path) {
        return node.q ? -1 !== node.q.indexOf(path) : false;
      },
      /**
       * @param {string} val
       * @return {undefined}
       */
      append : function(val) {
        if (node.q && -1 !== node.q.indexOf("#")) {
          el.search("q", node.q + "+#" + val);
        } else {
          el.search("q", "#" + val);
        }
      },
      /**
       * @param {string} selector
       * @return {undefined}
       */
      remove : function(selector) {
        /** @type {string} */
        var key = "#" + selector;
        /** @type {boolean} */
        var e = node.q === key;
        /** @type {boolean} */
        var f = -1 === node.q.indexOf("+" + key);
        if (f) {
          if (e) {
            el.search("q", null);
          } else {
            el.search("q", node.q.replace(key + "+", ""));
          }
        } else {
          el.search("q", node.q.replace("+" + key, ""));
        }
      },
      /**
       * @param {string} className
       * @return {?}
       */
      toggle : function(className) {
        return self.isActive(className) ? self.remove(className) : self.append(className);
      }
    };
    return self;
  }]).directive("dgTaxonomy", ["G", "Tag", "Cached", function(g, self, $q) {
    return{
      restrict : "EA",
      controller : ["$scope", "$element", "$attrs", function(dataAndEvents, deepDataAndEvents, options) {
        var exports = this;
        exports.g = g;
        exports.tag = self;
        exports.taxonomyName = options.taxonomyName;
        $q.all(options.dgTaxonomy).getList().then(function(b) {
          return exports.taxonomies = b, b;
        });
      }],
      controllerAs : "taxonomy"
    };
  }]);
  $.module("dgNavigation", []).controller("NavCtrl", ["$location", "G", "Tracker", function($location, $scope, req) {
    this.g = $scope;
    this.tracker = req.session;
    /**
     * @return {undefined}
     */
    this.submit = function() {
      if ($scope.searchString) {
        if ("" !== $scope.searchString) {
          $location.path("/search").search("q", $scope.searchString);
        }
      }
    };
  }]).directive("dgNavPush", ["$animate", "G", function(classList, transclude) {
    return{
      restrict : "EA",
      /**
       * @param {Node} scope
       * @param {?} className
       * @param {?} tabCtrl
       * @return {undefined}
       */
      link : function(scope, className, tabCtrl) {
        scope.g = transclude;
        var clas = tabCtrl.dgNavPush;
        scope.$watch("g.mobileNavExpanded", function(dataAndEvents) {
          if (dataAndEvents) {
            classList.addClass(className, clas);
          } else {
            classList.removeClass(className, clas);
          }
        });
      }
    };
  }]).controller("SearchMatchingCtrl", ["$location", function(location) {
    /** @type {string} */
    this.location = location;
    /**
     * @param {?} component
     * @param {?} async
     * @return {?}
     */
    this.test = function(component, async) {
      return location.search()[component] === async;
    };
  }]);
  $.module("dgConversation", []).factory("Conversation", ["Flash", "$analytics", "Restangular", function(Css, $routeProvider, self) {
    var data = {
      post : "posts",
      music : "music"
    };
    return{
      /**
       * @param {Object} options
       * @return {?}
       */
      addMessage : function(options) {
        if (!options.message || !options.message.content) {
          return void Css.pushMessage("\u8bf7\u8f93\u5165\u5185\u5bb9", "warning");
        }
        if (options.require) {
          var cnl = options.message.content.length;
          var spaces = options.require.actionTarget.actor.name.length;
          if (cnl === spaces + 2) {
            return void Css.pushMessage("\u8bf7\u8f93\u5165\u56de\u590d", "warning");
          }
        }
        var attrs = {
          comment : self.one(data[options.host.type], options.host.id).all("comments"),
          message : self.all("messages/" + options.host.id),
          feedback : self.all("feedback")
        };
        attrs[options.type].post({
          content : options.message.content
        }).then(function(suite) {
          var category = options.type.charAt(0).toUpperCase() + options.type.slice(1);
          $routeProvider.eventTrack("create", {
            category : category,
            label : options.host.type
          });
          if (options.require) {
            /** @type {boolean} */
            options.require.extendedStatus = false;
          }
          options.messages.unshift(suite);
          /** @type {string} */
          options.message.content = "";
          options.messageForm.$setPristine();
        });
      },
      /**
       * @param {Object} message
       * @return {undefined}
       */
      removeMessage : function(message) {
        var o = {
          comment : self.one(data[message.host.type], message.host.id).one("comments", message.message.id),
          message : self.one("messages", message.host.id).one(message.message.id),
          conversation : self.one("messages", message.host.id)
        };
        o[message.type].remove().then(function() {
          message.messages.splice(message.messages.indexOf(message.message), 1);
        });
      }
    };
  }]).directive("dgNewMessage", ["Conversation", function(messages) {
    return{
      scope : {
        type : "@dgNewMessage",
        hostId : "=",
        hostType : "=",
        messages : "=",
        placeholder : "@"
      },
      replace : true,
      restrict : "EA",
      require : "?^ngController",
      templateUrl : "views/partials/conversation/message-new.html",
      /**
       * @param {Object} $scope
       * @param {Object} elm
       * @param {?} tabCtrl
       * @param {Object} target
       * @return {undefined}
       */
      link : function($scope, elm, tabCtrl, target) {
        var deep;
        var textarea = elm.find("textarea");
        $scope.message = {};
        if ($.isDefined(target)) {
          if ("reply" === target.actionType) {
            /** @type {Object} */
            deep = target;
            /** @type {string} */
            $scope.message.content = "@" + deep.actionTarget.actor.name + " ";
            textarea.focus();
          }
        }
        /**
         * @return {undefined}
         */
        $scope.addMessage = function() {
          messages.addMessage({
            type : $scope.type,
            host : {
              id : $scope.hostId,
              type : $scope.hostType
            },
            message : $scope.message,
            messages : $scope.messages,
            messageForm : $scope.messageForm,
            require : deep
          });
        };
      }
    };
  }]).directive("dgLinkify", ["$location", function($location) {
    return{
      restrict : "EA",
      /**
       * @param {?} scope
       * @param {Object} elm
       * @param {?} attrs
       * @return {undefined}
       */
      link : function(scope, elm, attrs) {
        attrs.$observe("ngHref", function(url) {
          elm.css("cursor", "pointer");
          elm.bind("click", function() {
            scope.$apply(function() {
              $location.path(url);
            });
          });
        });
      }
    };
  }]);
  $.module("dgImage", []).directive("dgImage", ["Device", function(data) {
    return{
      restrict : "EA",
      /**
       * @param {?} tabCtrl
       * @param {?} scope
       * @param {Object} attrs
       * @return {undefined}
       */
      link : function(tabCtrl, scope, attrs) {
        attrs.$observe("dgImage", function(dataAndEvents) {
          /** @type {string} */
          var toggleText = dataAndEvents + "?imageView/1/w/" + attrs.width * data.pixelRatio + "/h/" + attrs.height * data.pixelRatio + "/q/100/format/jpg";
          attrs.$set("src", toggleText);
        });
      }
    };
  }]).directive("dgIcon", function() {
    return{
      restrict : "A",
      /**
       * @param {?} tabCtrl
       * @param {Object} element
       * @param {?} settings
       * @return {undefined}
       */
      link : function(tabCtrl, element, settings) {
        element.addClass("i-" + settings.dgIcon);
        /** @type {string} */
        var activeClassName = "i-" + settings.dgIcon + "Active";
        element.bind("mouseenter focus", function() {
          element.addClass(activeClassName);
        });
        element.bind("mouseleave blur", function() {
          element.removeClass(activeClassName);
        });
        if (settings.iconSize) {
          element[0].style.cssText += ";width:" + settings.iconSize + "px;height:" + settings.iconSize + "px;";
        }
      }
    };
  });
  $.module("dgSlider", []).directive("dgSlider", [function() {
    /**
     * @param {Function} func
     * @param {number} wait
     * @param {boolean} isAsap
     * @return {?}
     */
    var debounce = function(func, wait, isAsap) {
      var that;
      var args;
      var timeout;
      var value;
      /** @type {number} */
      var previous = 0;
      /**
       * @return {undefined}
       */
      var later = function() {
        /** @type {Date} */
        previous = new Date;
        /** @type {null} */
        timeout = null;
        value = func.apply(that, args);
      };
      return function() {
        /** @type {Date} */
        var now = new Date;
        if (!previous) {
          if (!(isAsap !== false)) {
            /** @type {Date} */
            previous = now;
          }
        }
        /** @type {number} */
        var remaining = wait - (now - previous);
        return that = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), timeout = null, previous = now, value = func.apply(that, args)) : timeout || (timeout = setTimeout(later, remaining)), value;
      };
    };
    var foo = {
      bar : ".bar",
      handle : ".handle"
    };
    /**
     * @param {?} value
     * @param {Object} el
     * @param {string} x
     * @return {undefined}
     */
    var show = function(value, el, x) {
      value.width(x + "%");
      el.css({
        left : x + "%"
      });
    };
    return{
      restrict : "A",
      scope : {
        bar : "@sliderBar",
        handle : "@sliderHandle",
        sliderValue : "=",
        sliderChange : "&"
      },
      /**
       * @param {Function} scope
       * @param {Node} node
       * @return {undefined}
       */
      link : function(scope, node) {
        /** @type {Node} */
        var current = node;
        var udataCur = current.find(scope.bar || foo.bar);
        var handle = current.find(scope.handle || foo.handle);
        show(udataCur, handle, scope.sliderValue);
        var leftOffset;
        var b;
        var onRoute = debounce(function(event) {
          var h;
          /** @type {number} */
          var a = event.pageX - leftOffset;
          /** @type {number} */
          h = 0 > a ? 0 : a > b ? 100 : a / b * 100;
          show(udataCur, handle, h);
          scope.sliderChange({
            sliderValue : h
          });
          /** @type {number} */
          scope.sliderValue = Math.round(h);
          scope.$apply();
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          } else {
            if (document.selection) {
              document.selection.empty();
            }
          }
        }, 10);
        handle.on("mousedown", function(types) {
          types.preventDefault();
          leftOffset = current.offset().left;
          b = current.width();
          $.element(document).on("mousemove", onRoute);
          $.element(document).one("mouseup", function() {
            $.element(document).off("mousemove", onRoute);
          });
        });
      }
    };
  }]);
  $.module("dgFlash", []).factory("Flash", ["$rootScope", "$timeout", function(dataAndEvents, size) {
    var $scope = {
      messages : [],
      /**
       * @param {?} message
       * @return {undefined}
       */
      removeMessage : function(message) {
        $scope.messages.splice($scope.messages.indexOf(message), 1);
      },
      /**
       * @param {string} msg
       * @param {string} level
       * @param {number} opt_attributes
       * @return {undefined}
       */
      pushMessage : function(msg, level, opt_attributes) {
        var message = {
          content : msg,
          category : level || "info"
        };
        $scope.messages.push(message);
        size(function() {
          $scope.removeMessage(message);
        }, opt_attributes || 5E3);
      }
    };
    return $scope;
  }]);
  $.module("dgUpload", []).directive("dgUploader", ["$http", "$timeout", "Flash", "Error", "apiPrefix", function($templateCache, $sanitize, Css, params, dataAndEvents) {
    var data = {
      audio : {
        title : "\u8bf7\u9009\u62e9\u97f3\u9891\u6587\u4ef6",
        extensions : "mp3,wav,aac"
      },
      image : {
        title : "\u8bf7\u9009\u62e9\u56fe\u7247",
        extensions : "gif,jpg,jpeg,png"
      }
    };
    return{
      scope : {
        uploadType : "@",
        targetModel : "=?",
        uploadCallback : "&"
      },
      replace : true,
      restrict : "EA",
      transclude : true,
      /**
       * @param {?} tElement
       * @param {?} element
       * @return {?}
       */
      templateUrl : function(tElement, element) {
        return $.isDefined(element.templateName) ? "views/partials/uploading/" + element.templateName + ".html" : "views/partials/uploading/dragndrop.html";
      },
      controller : ["$scope", "$element", "$attrs", function($scope, container, params) {
        /** @type {string} */
        $scope.uploadState = "normal";
        $scope.uploadThing = params.uploadThing;
        $scope.supportFeatures = {
          dragndrop : Modernizr.draganddrop && !Modernizr.touch
        };
        $scope.getToken = $templateCache.get(dataAndEvents + "/upload/token?type=" + params.uploadType).then(function(response) {
          return $scope.uploader = new plupload.Uploader({
            url : "http://up.qbox.me:80/",
            runtimes : "flash,html5,html4",
            container : container[0],
            browse_button : container.find("a")[0],
            flash_swf_url : "/components/plupload/js/Moxie.swf",
            file_data_name : "file",
            multipart_params : {},
            filters : {
              mime_types : [data[params.uploadType]],
              max_file_size : "100mb"
            },
            init : {
              /**
               * @param {Object} up
               * @return {undefined}
               */
              FilesAdded : function(up) {
                up.settings.multipart_params = {
                  key : params.uploadFolder + "/" + uuid.v4(),
                  token : response.data.token
                };
                up.start();
              },
              /**
               * @param {Object} uploader
               * @return {undefined}
               */
              StateChanged : function(uploader) {
                if (uploader.state === plupload.STARTED) {
                  $scope.$apply(function() {
                    /** @type {string} */
                    $scope.uploadState = "uploading";
                  });
                }
              },
              /**
               * @param {?} dataAndEvents
               * @param {Object} progress
               * @return {undefined}
               */
              UploadProgress : function(dataAndEvents, progress) {
                $scope.$apply(function() {
                  /** @type {string} */
                  $scope.percentUploaded = progress.percent + "%";
                });
              },
              /**
               * @param {Object} target
               * @param {?} dataAndEvents
               * @param {Function} data
               * @return {undefined}
               */
              FileUploaded : function(target, dataAndEvents, data) {
                var response = $.fromJson(data.response);
                $scope.$apply(function() {
                  if (response.success) {
                    /** @type {string} */
                    $scope.uploadState = "success";
                    /** @type {string} */
                    $scope.targetModel = "https://" + response.domain + "/" + response.key;
                    if ($scope.uploadCallback) {
                      $scope.uploadCallback({
                        url : $scope.targetModel
                      });
                    }
                  } else {
                    /** @type {string} */
                    $scope.uploadState = "failed";
                  }
                  if ("image" === $scope.uploadType) {
                    $sanitize(function() {
                      /** @type {string} */
                      $scope.percentUploaded = "";
                      /** @type {string} */
                      $scope.uploadState = "normal";
                    }, 3E3);
                  }
                });
                target.refresh();
              },
              /**
               * @param {Object} context
               * @param {boolean} source
               * @return {undefined}
               */
              Error : function(context, source) {
                params.report(source);
                context.refresh();
              }
            }
          }), $scope.uploader.init(), response;
        }, function() {
          Css.pushMessage("\u975e\u5e38\u62b1\u6b49\uff0c\u7f51\u7ad9\u53d1\u751f\u9519\u8bef\uff0c\u6211\u4eec\u5df2\u7ecf\u8bb0\u5f55\u4e0b\u8fd9\u4e2a\u95ee\u9898\uff0c\u5982\u679c\u4f60\u6709\u7591\u95ee\u8bf7\u901a\u8fc7\u53cd\u9988\u8054\u7cfb\u6211\u4eec", "warning", 1E4);
          params.report("Failed to get uploading Token");
        });
      }]
    };
  }]);
  $.module("gaiamagic", ["gaiamagic.humanizeTime"]);
  $.module("dgHome", ["infinite-scroll"]).controller("HomeCtrl", ["$scope", "Session", function($scope, Session) {
    var context = this;
    $scope.session = Session;
    $scope.$watch("session.currentUser", function(isSelected) {
      /** @type {string} */
      context.templateName = isSelected ? "activity" : "explore";
    });
  }]).controller("ExploreCtrl", ["Query", "Restangular", function(ProgressIndicator, $q) {
    var context = this;
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : $q.all("recommendations")
      });
    };
  }]).controller("TimelineCtrl", ["Query", "Title", "Restangular", function(ProgressIndicator, ui, result) {
    var context = this;
    ui.set({
      page : "\u9996\u9875",
      format : "%(page)s - %(name)s"
    });
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : result.all("activities")
      });
    };
  }]);
  $.module("dgUser", ["dgUserAuth", "dgUserProfile", "dgUsers"]).factory("UserRestangular", ["$injector", "apiPrefix", "Restangular", function(ds, value, Restangular) {
    var self;
    return Restangular.withConfig(function(object) {
      object.setBaseUrl(value);
      /** @type {null} */
      object.requestParams.get = null;
      object.setResponseInterceptor(function(user) {
        return self = ds.get("Session"), self.currentUser = user, user;
      });
    });
  }]);
  $.module("dgUsers", []).controller("UserListCtrl", ["Query", "Restangular", function(ProgressIndicator, list) {
    this.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    this.getObjects = function() {
      this.query.get({
        scope : this,
        thing : list.all("users"),
        extraParams : {
          with_avatar : true
        }
      });
    };
  }]);
  $.module("dgUserAuth", ["dgUser", "dgConfig", "restangular", "http-auth-interceptor"]).factory("Session", ["$q", "$http", "$location", "$rootScope", "apiPrefix", "Restangular", function($q, $http, $location, $rootScope, base, row) {
    /**
     * @param {string} hash
     * @return {undefined}
     */
    function request(hash) {
      hash = hash || "/";
      $location.url(hash);
    }
    var security = {
      currentUser : null,
      /**
       * @return {undefined}
       */
      logout : function() {
        $http({
          url : base + "/users/logout",
          method : "DELETE"
        }).success(function() {
          $rootScope.$broadcast("auth:logoutSuccess");
          /** @type {null} */
          security.currentUser = null;
          $location.path("/");
        });
      },
      /**
       * @return {?}
       */
      requestCurrentUser : function() {
        return security.currentUser ? $q.when(security.currentUser) : row.one("user").withHttpConfig({
          tracker : "session",
          ignoreAuthModule : true
        }).get().then(function(user) {
          return $rootScope.$broadcast("auth:currentUserLoaded", user), security.currentUser = user, user;
        });
      },
      /**
       * @return {?}
       */
      isAuthenticated : function() {
        return!!security.currentUser;
      }
    };
    return $rootScope.$on("auth:currentUserLoaded", function(dataAndEvents, user) {
      security.currentUser = user;
    }), $rootScope.$on("auth:loginSuccess", function(dataAndEvents, hash) {
      request(hash);
    }), $rootScope.$on("event:auth-loginRequired", function() {
      $location.path("/login");
    }), $rootScope.$on("$routeChangeSuccess", function(deepDataAndEvents, dataAndEvents) {
      if (dataAndEvents.loginRequired) {
        security.requestCurrentUser().then(done, function(response) {
          $location.url("/login?returnUrl=" + $location.url());
          $q.reject(response);
        });
      }
    }), security;
  }]).controller("AuthCtrl", ["$q", "$http", "$location", "$analytics", "$rootScope", "$routeParams", "Flash", "Session", "apiPrefix", "authService", function($q, ajax, location, $location, $rootScope, user, _, security, base, authService) {
    var self = this;
    if (security.isAuthenticated() && security.requestCurrentUser().then(function(dataAndEvents) {
      return location.path("/"), dataAndEvents;
    }, function(response) {
      security.logout();
      $q.reject(response);
    }), user.by_sns) {
      /** @type {boolean} */
      self.bySns = true;
      self.user = {
        uid : user.uid,
        token : user.token,
        secret : user.secret,
        nickname : user.nickname,
        provider : user.provider
      };
      var $scope = {
        tqq : "\u817e\u8baf\u5fae\u535a",
        weibo : "\u65b0\u6d6a\u5fae\u535a",
        douban : "\u8c46\u74e3"
      };
      /** @type {string} */
      var that = "Hi, " + self.user.nickname + "\uff0c\u6b22\u8fce\u901a\u8fc7" + $scope[self.user.provider] + "\u767b\u5f55\u5408\u62cd\uff0c\u8bf7\u8fdb\u4e00\u6b65\u8865\u5168\u8d26\u53f7\u8d44\u6599\u3002";
      _.pushMessage(that, "info");
    }
    /**
     * @return {undefined}
     */
    self.submitLogin = function() {
      ajax({
        url : base + "/users/login",
        data : {
          email : self.user.email,
          password : self.user.password,
          remember_me : "1"
        },
        method : "POST",
        ignoreAuthModule : true
      }).success(function(oldUrl) {
        $location.eventTrack("login", {
          category : "User"
        });
        $rootScope.$broadcast("auth:loginSuccess", location.search().returnUrl);
        $rootScope.$broadcast("auth:currentUserLoaded", oldUrl);
        authService.loginConfirmed();
      }).error(function(result) {
        _.pushMessage(result.message);
        self.errors = result.errors;
      });
    };
    /**
     * @return {undefined}
     */
    self.submitSignup = function() {
      self.user = self.user || {};
      var options = {
        email : self.user.email,
        nickname : self.user.nickname,
        password : self.user.password,
        password_confirmation : self.user.password
      };
      if (self.bySns) {
        options.uid = self.user.uid;
        options.token = self.user.token;
        options.secret = self.user.secret;
        options.provider = self.user.provider;
        create(options);
      } else {
        next(options);
      }
    };
    /**
     * @param {string} task
     * @return {undefined}
     */
    var create = function(task) {
      ajax({
        url : base + "/users/sns_signup",
        data : task,
        method : "POST",
        ignoreAuthModule : true
      }).success(function(response) {
        success(response);
      }).error(function(result) {
        self.errors = result.errors;
      });
    };
    /**
     * @param {string} query
     * @return {undefined}
     */
    var next = function(query) {
      ajax({
        url : base + "/users",
        data : query,
        method : "POST",
        ignoreAuthModule : true
      }).success(function(response) {
        success(response);
      }).error(function(result) {
        self.errors = result.errors;
      });
    };
    /**
     * @param {?} response
     * @return {undefined}
     */
    var success = function(response) {
      $location.eventTrack("signup", {
        category : "User"
      });
      var destination = location.search().returnUrl || "/wizard/profile";
      $rootScope.$broadcast("auth:loginSuccess", destination);
      $rootScope.$broadcast("auth:currentUserLoaded", response);
      _.pushMessage("\u606d\u559c\uff01\u6ce8\u518c\u6210\u529f\u3002", "success");
      authService.loginConfirmed();
    };
  }]).controller("LostPasswordCtrl", ["$timeout", "Restangular", function($timeout, el) {
    var $scope = this;
    /** @type {RegExp} */
    var core_rnotwhite = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,6})$/;
    var AudioMimeTypes = {
      "qq.com" : "https://mail.qq.com",
      "163.com" : "http://mail.163.com",
      "sina.cn" : "https://mail.sina.com.cn",
      "sina.com" : "https://mail.sina.com.cn",
      "sohu.com" : "https://mail.sohu.com",
      "gmail.com" : "https://mail.google.com",
      "yahoo.com" : "https://mail.yahoo.com"
    };
    /**
     * @param {string} value
     * @param {boolean} d
     * @return {undefined}
     */
    $scope.submit = function(value, d) {
      var result = el.one("password");
      /** @type {string} */
      result.email = value;
      result.post().then(function(e) {
        if (e.success) {
          /** @type {boolean} */
          $scope.submitSucceed = true;
        }
        /** @type {boolean} */
        $scope.isSubmitAgain = d;
        $timeout(function() {
          /** @type {boolean} */
          $scope.isSubmitAgain = false;
        }, 5E3);
      }, function(response) {
        $scope.errors = response.data.errors;
      });
    };
    /**
     * @param {string} value
     * @return {?}
     */
    $scope.getEmailDomain = function(value) {
      var tmp = value.match(core_rnotwhite);
      var ext = tmp[1];
      return AudioMimeTypes[ext] || "http://" + ext;
    };
  }]).controller("ResetPasswordCtrl", ["$location", "$routeParams", "Flash", "Restangular", function($location, _config, _, el) {
    var $scope = this;
    return _config.reset_password_token ? void($scope.submit = function(settings) {
      var target = el.one("password");
      settings.reset_password_token = _config.reset_password_token;
      target = $.extend(target, settings);
      target.put().then(function() {
        _.pushMessage("\u91cd\u7f6e\u5bc6\u7801\u6210\u529f", "success");
        $location.url("/login");
      }, function(response) {
        _.pushMessage(response.data.message);
        $scope.errors = response.data.errors;
      });
    }) : void _.pushMessage("\u91cd\u7f6e\u5bc6\u7801\u94fe\u63a5\u9519\u8bef");
  }]);
  $.module("dgUserProfile", ["dgUserActivity", "dgUserMusic", "dgUserPosts", "dgUserInfo", "dgUserFollow"]);
  $.module("dgUserActivity", []).controller("UserActivityCtrl", ["$scope", "$location", "$routeParams", "Query", "Title", "Restangular", function(context, $location, settings, ProgressIndicator, ui, socket) {
    var self = this;
    socket.one("users", settings.username).get().then(function(user) {
      self.user = user;
      ui.set({
        page : user.nickname
      });
    }, function() {
      $location.url("/404");
    });
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : socket.one("users", settings.username).all("activities")
      });
    };
  }]);
  $.module("dgUserMusic", []).controller("UserMusicCtrl", ["$scope", "$location", "$routeParams", "Flash", "Query", "Music", "Title", "Restangular", function(context, dataAndEvents, settings, deepDataAndEvents, ProgressIndicator, music, ui, socket) {
    var self = this;
    socket.one("users", settings.username).get().then(function(user) {
      self.user = user;
      ui.set({
        page : user.nickname + " \u7684\u97f3\u4e50"
      });
    });
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : socket.one("users", settings.username).all("music")
      });
    };
    this.music = music;
  }]);
  $.module("dgUserPosts", []).controller("UserPostsCtrl", ["$scope", "$routeParams", "Query", "Title", "Action", "Restangular", function(dataAndEvents, settings, ProgressIndicator, ui, xs, socket) {
    var context = this;
    context.actions = xs;
    socket.one("users", settings.username).get().then(function(o) {
      context.user = o;
      ui.set({
        page : o.nickname + " \u7684\u5408\u4f5c\u4fe1\u606f"
      });
    });
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : socket.one("users", settings.username).all("posts"),
        extraParams : {
          without_owner : false
        }
      });
    };
  }]);
  $.module("dgUserInfo", []).controller("UserInfoCtrl", ["$scope", "$routeParams", "$location", "Flash", "Query", "Title", "Action", "EditPostUtils", "Restangular", function(dataAndEvents, settings, deepDataAndEvents, Auth, ignoreMethodDoesntExist, ui, count, data_user, socket) {
    var $scope = this;
    $scope.actions = count;
    socket.one("users", settings.username).get().then(function(user) {
      /** @type {Object} */
      $scope.user = user;
      ui.set({
        page : user.nickname + " \u7684\u8be6\u7ec6\u4fe1\u606f"
      });
    });
    /**
     * @return {undefined}
     */
    $scope.submit = function() {
      var res = socket.one("user");
      var details = {
        personal_page : $scope.user.personal_page
      };
      $.extend(res, details);
      res.put().then(function(user) {
        Auth.pushMessage("\u66f4\u65b0\u4e2a\u4eba\u8be6\u7ec6\u4fe1\u606f\u6210\u529f", "success");
        $scope.user = user;
        /** @type {boolean} */
        $scope.isEditing = false;
      }, function(response) {
        $scope.errors = response.data.errors;
      });
    };
    /**
     * @return {undefined}
     */
    $scope.editInfo = function() {
      /** @type {boolean} */
      $scope.isEditing = true;
    };
    /**
     * @param {?} elem
     * @param {string} dataAndEvents
     * @return {undefined}
     */
    $scope.insertImg = function(elem, dataAndEvents) {
      /** @type {string} */
      var camelKey = "\n![\u56fe\u7247](" + dataAndEvents + ")\n";
      var data = data_user.insertContent(elem, camelKey);
      $scope.user.personal_page = data;
    };
  }]);
  $.module("dgUserFollow", []).controller("UserFollowCtrl", ["$scope", "$location", "$routeParams", "Query", "Title", "Restangular", function(context, $location, self, ProgressIndicator, ui, socket) {
    var req = this;
    socket.one("users", self.username).get().then(function(user) {
      req.user = user;
      ui.set({
        page : user.nickname + " \u7684" + ("following" === self.type ? "\u5173\u6ce8" : "\u7c89\u4e1d")
      });
    });
    if (-1 === ["following", "followers"].indexOf(self.type)) {
      $location.url("/404");
    }
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : socket.one("users", self.username).all(self.type)
      });
    };
  }]);
  $.module("dgSearch", []).controller("SearchCtrl", ["$location", "$routeParams", "G", "Tag", "Query", "Cached", "Restangular", function($location, e, $scope, tag, ProgressIndicator, model, result) {
    var self = this;
    self.g = $scope;
    self.tag = tag;
    self.query = ProgressIndicator.getInstance();
    self.type = e.type;
    if ($location.search().q !== $scope.searchString) {
      $scope.searchString = $location.search().q;
    }
    /**
     * @return {?}
     */
    self.isTag = function() {
      return!!$scope.searchString && ("#" === $scope.searchString.charAt(0) && $scope.searchString.length > 1);
    };
    /**
     * @param {string} i
     * @return {?}
     */
    var create = function(i) {
      var params = {
        user : "users",
        post : "posts",
        music : "music"
      };
      var opts = {
        scope : self,
        thing : result.all(params[i])
      };
      return "user" === i && (opts.extraParams = {
        with_avatar : true
      }), self.query.get(opts);
    };
    /**
     * @param {string} _
     * @param {?} success
     * @param {?} key
     * @return {?}
     */
    var callback = function(_, success, key) {
      return self.query.get({
        scope : self,
        thing : result.one("tags").all("taggable"),
        extraParams : {
          type : _,
          "slugs[]" : success
        }
      }, key);
    };
    /**
     * @param {string} keepData
     * @param {string} eventType
     * @param {?} key
     * @return {?}
     */
    var remove = function(keepData, eventType, key) {
      return self.query.get({
        scope : self,
        thing : result.all("search"),
        extraParams : {
          q : keepData,
          type : eventType
        }
      }, key);
    };
    /**
     * @param {string} text
     * @return {?}
     */
    var ie = function(text) {
      /** @type {Array} */
      var eventPath = [];
      return $.forEach(text.split("+"), function(charsetPart) {
        if ("#" === charsetPart.charAt(0)) {
          eventPath.push(charsetPart.substring(1));
        }
      }), eventPath;
    };
    /**
     * @param {?} values
     * @return {?}
     */
    var init = function(values) {
      /** @type {Array} */
      var assigns = [];
      return $.forEach(values, function(parent) {
        model.one("tags", parent).get().then(function(vvar) {
          assigns.push(vvar);
        });
      }), assigns;
    };
    /**
     * @param {?} p
     * @return {undefined}
     */
    self.getObjects = function(p) {
      if ($scope.searchString) {
        if ($location.search("q", $scope.searchString), "#" === $scope.searchString.charAt(0)) {
          var value = ie(e.q);
          self.tags = init(value);
          callback(self.type, value, p);
        } else {
          remove($scope.searchString, self.type, p);
        }
      } else {
        create(self.type);
      }
    };
    this.getObjects();
  }]);
  $.module("dgMusic", ["dgMusicPlayer", "dgMusicUploading"]).factory("Music", ["$location", "Flash", "Action", "Restangular", function($location, Css, selfObj, el) {
    return{
      /**
       * @param {Element} that
       * @return {undefined}
       */
      publish : function(that) {
        var context = el.one("music", that.id);
        /** @type {boolean} */
        context.published = true;
        context.put().then(function(evt) {
          $location.path("/music/" + evt.data.id);
        }, function(response) {
          /** @type {Array} */
          var tagNameArr = [];
          $.forEach(response.data.errors, function(e) {
            tagNameArr.push(e.field + e.message);
          });
          Css.pushMessage(response.data.message + "\u3002" + tagNameArr.join("\uff0c"), "warning");
        });
      },
      remove : selfObj.remove
    };
  }]).controller("MusicCtrl", ["$scope", "$location", "$routeParams", "Music", "Title", "Restangular", function($scope, $location, options, count, ui, args) {
    $scope.actions = count;
    args.one("music", options.musicId).get().then(function(player) {
      return $scope.music = player, ui.set({
        page : player.user.nickname + " \u7684 " + player.name
      }), player;
    }, function(jqXHR) {
      if (404 === jqXHR.status) {
        $location.url("/404");
      }
    });
  }]).controller("MusicListCtrl", ["Query", "Restangular", function(ProgressIndicator, $q) {
    this.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    this.getObjects = function() {
      this.query.get({
        scope : this,
        thing : $q.all("music")
      });
    };
  }]);
  $.module("dgMusicPlayer", []).run(["Error", function(that) {
    soundManager.setup({
      url : "/components/soundmanager/swf/",
      wmode : "transparent",
      flashVersion : 9,
      /**
       * @param {number} statusCode
       * @return {undefined}
       */
      ontimeout : function(statusCode) {
        that.report("SoundManager 2 failed to start", {
          status : statusCode
        });
      }
    });
  }]).directive("progressBar", function() {
    return{
      scope : {
        percentLoaded : "=",
        percentPlayed : "=",
        onSeek : "&"
      },
      replace : true,
      restrict : "EA",
      templateUrl : "views/music/progress-bar.html",
      /**
       * @param {?} tabCtrl
       * @param {Object} element
       * @return {undefined}
       */
      link : function(tabCtrl, element) {
        /**
         * @param {Event} e
         * @return {undefined}
         */
        var onMouseMove = function(e) {
          /** @type {number} */
          var percentOffset = e.offsetX / e.currentTarget.clientWidth;
          tabCtrl.onSeek({
            percentOffset : percentOffset
          });
        };
        element.on("mousedown", function(completeEvent) {
          onMouseMove(completeEvent);
          element.on("mousemove", onMouseMove);
          $.element(document).one("mouseup", function() {
            element.off("mousemove", onMouseMove);
          });
        });
      }
    };
  }).factory("PlaybackState", function() {
    var self = {
      states : {
        paused : "paused",
        stopped : "stopped",
        playing : "playing"
      },
      sounds : {},
      expanded : false,
      lastMusic : null,
      /**
       * @return {?}
       */
      getLastSound : function() {
        return self.sounds[self.lastMusic.id];
      },
      /**
       * @param {?} name
       * @param {?} state
       * @return {undefined}
       */
      syncState : function(name, state) {
        if ($.isDefined(self.sounds[name])) {
          self.sounds[name].state = state;
        } else {
          self.sounds[name] = {
            state : state
          };
        }
      },
      /**
       * @return {undefined}
       */
      toggleExpandStatus : function() {
        /** @type {boolean} */
        self.expanded = !self.expanded;
      }
    };
    return self;
  }).factory("Player", ["$rootScope", "Restangular", "$analytics", "PlaybackState", function($rootScope, el, win, response) {
    var me = soundManager;
    /** @type {Object} */
    var data = response;
    var self = {
      events : {
        /**
         * @return {undefined}
         */
        onplay : function() {
          var head = this;
          data.syncState(head.id, data.states.playing);
        },
        /**
         * @return {undefined}
         */
        onstop : function() {
          var head = this;
          data.syncState(head.id, data.states.stopped);
        },
        /**
         * @return {undefined}
         */
        onpause : function() {
          var head = this;
          data.syncState(head.id, data.states.paused);
        },
        /**
         * @return {undefined}
         */
        onresume : function() {
          var head = this;
          data.syncState(head.id, data.states.playing);
        },
        /**
         * @return {undefined}
         */
        onfinish : function() {
          var options = this;
          $rootScope.$apply(function() {
            data.syncState(options.id, data.states.stopped);
            data.sounds[options.id].timePlayed = options.position;
          });
          if (data.lastMusic.$next) {
            self.play(data.lastMusic.$next);
          }
        },
        /**
         * @return {undefined}
         */
        whileloading : function() {
          var self = this;
          $rootScope.$apply(function() {
            /** @type {number} */
            data.sounds[self.id].percentLoaded = 100 * self.bytesLoaded / self.bytesTotal;
          });
        },
        /**
         * @return {undefined}
         */
        whileplaying : function() {
          var options = this;
          _.defer(function() {
            $rootScope.$apply(function() {
              /** @type {number} */
              data.sounds[options.id].percentPlayed = 100 * options.position / options.durationEstimate;
              data.sounds[options.id].timeTotal = options.durationEstimate;
              data.sounds[options.id].timeTotalHumanized = moment.duration(options.durationEstimate).minutes() + ":" + moment.duration(options.durationEstimate).seconds();
              data.sounds[options.id].timePlayedHumanized = moment.duration(options.position).minutes() + ":" + moment.duration(options.position).seconds();
            });
          });
        }
      },
      /**
       * @param {string} key
       * @param {string} _url
       * @param {Object} result
       * @return {?}
       */
      createSound : function(key, _url, result) {
        if ($.isUndefined(me.getSoundById(key))) {
          var defaults = {
            id : key,
            url : _url,
            type : $.isDefined(result) ? result : "audio/mpeg"
          };
          var keys = $.extend(defaults, self.events);
          return me.createSound(keys);
        }
        return me.sounds[key];
      },
      /**
       * @param {Object} options
       * @return {undefined}
       */
      addListenCount : function(options) {
        options.listen_count++;
        el.one("music", options.id).one("listen_count").put();
      },
      /**
       * @param {Object} options
       * @return {undefined}
       */
      play : function(options) {
        self.createSound(options.id, options.audio_file).play();
        self.addListenCount(options);
      },
      /**
       * @param {?} m
       * @return {undefined}
       */
      seek : function(m) {
        if (data.getLastSound().state === data.states.stopped) {
          me.play(data.lastMusic.id);
          me.pause(data.lastMusic.id);
        }
        /** @type {number} */
        var h = m * data.getLastSound().timeTotal;
        me.setPosition(data.lastMusic.id, h);
      },
      /**
       * @param {Object} options
       * @return {?}
       */
      toggle : function(options) {
        if (data.lastMusic = options, $.isDefined(data.sounds[options.id])) {
          var state = data.sounds[options.id].state;
          return state === data.states.stopped ? (me.pauseAll(), me.play(options.id), self.addListenCount(options)) : state === data.states.paused ? (me.pauseAll(), me.resume(options.id), win.eventTrack("play", {
            category : "Music"
          })) : state === data.states.playing && (me.pause(options.id), win.eventTrack("pause", {
            category : "Music"
          })), me.sounds[options.id];
        }
        return me.pauseAll(), self.play(options), win.eventTrack("play", {
          category : "Music"
        }), me.sounds[options.id];
      }
    };
    return Mousetrap.bind("space", function() {
      return data.lastMusic && $rootScope.$apply(function() {
        self.toggle(data.lastMusic);
      }), false;
    }), self;
  }]);
  $.module("dgMusicUploading", []).controller("MusicUploadingCtrl", ["$scope", "$location", "$routeParams", "Flash", "Restangular", "$analytics", "promiseTracker", function(dataAndEvents, $location, options, Css, wrapper, _, callback) {
    var o = this;
    if (wrapper.all("music/types").getList().then(function(lvl) {
      return o.types = lvl, lvl;
    }), wrapper.all("music/genres").getList().then(function(lvl) {
      return o.genres = lvl, lvl;
    }), o.inputTracker = callback("uploading"), o.objectsTracker = callback("objects"), $.isDefined(options.musicId)) {
      var r20 = wrapper.one("music", options.musicId).get().then(function(lvl) {
        return o.music = lvl, lvl;
      });
      this.objectsTracker.addPromise(r20);
    }
    /**
     * @return {?}
     */
    this.submit = function() {
      if ($.isUndefined(this.music)) {
        return void Css.pushMessage("\u8bf7\u4e0a\u4f20\u97f3\u4e50", "warning");
      }
      var promise;
      var options = o.music;
      var pointer = $.isDefined(options.id);
      var data = {
        name : options.name,
        audio : options.audio,
        cover : options.cover,
        lyric : options.lyric,
        type_id : options.type ? options.type.id : null,
        genre_id : options.genre ? options.genre.id : null,
        published : options.published
      };
      if (pointer) {
        var deep = wrapper.one("music", options.id);
        $.extend(deep, data);
        promise = deep.put();
      } else {
        var $$ = wrapper.one("music");
        $.extend($$, data);
        promise = $$.post();
      }
      promise.then(function(x) {
        return pointer || _.eventTrack("create", {
          category : "Music"
        }), o.music = x, $location.url("/music/" + x.id), x;
      }, function(response) {
        return o.errors = response.data.errors, response;
      });
      this.inputTracker.addPromise(promise);
    };
  }]);
  $.module("dgPost", []).factory("EditPostUtils", function() {
    return{
      /**
       * @param {?} content
       * @param {string} myValue
       * @return {?}
       */
      insertContent : function(content, myValue) {
        var startPos;
        var endPos;
        var sel;
        /** @type {(HTMLElement|null)} */
        var target = document.getElementById(content);
        var val = target.value;
        /** @type {boolean} */
        var bulk = "undefined" != typeof target.selectionStart && "undefined" != typeof target.selectionEnd;
        /** @type {boolean} */
        var length = "undefined" != typeof document.selection && "undefined" != typeof document.selection.createRange;
        return bulk ? (startPos = target.selectionStart, endPos = target.selectionEnd, target.value = val.slice(0, startPos) + myValue + val.slice(endPos), target.selectionStart = target.selectionEnd = startPos + myValue.length) : length ? (target.focus(), sel = document.selection.createRange(), sel.collapse(false), sel.text = myValue, sel.select()) : target.value += myValue, target.value;
      }
    };
  }).controller("PostsCtrl", ["Query", "Restangular", function(ProgressIndicator, _) {
    var context = this;
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : _.all("posts")
      });
    };
  }]).controller("PostCtrl", ["$scope", "$location", "$routeParams", "Title", "Restangular", function(a, $location, params, ui, assert) {
    assert.one("posts", params.postId).get().then(function(e) {
      return a.post = e, ui.set({
        page : e.title
      }), e;
    }, function(jqXHR) {
      if (404 === jqXHR.status) {
        $location.url("/404");
      }
    });
  }]).controller("NewPostCtrl", ["$location", "$routeParams", "Flash", "Taxonomy", "Restangular", "EditPostUtils", "promiseTracker", "$analytics", function($location, params, Css, transclude, view, jQuery, callback, _) {
    var scope = this;
    scope.taxonomy = transclude;
    var promise = view.all("posts/categories").getList();
    promise.then(function(data) {
      /** @type {Array} */
      scope.categories = data;
    });
    if (params.postId) {
      view.one("posts", params.postId).get().then(function(f) {
        return scope.post = f, promise.then(function(selected) {
          scope.activeCategory = _.find(selected, {
            id : f.category.id
          });
        }), f;
      });
    }
    /**
     * @param {?} html
     * @param {string} dataAndEvents
     * @return {undefined}
     */
    scope.insertImg = function(html, dataAndEvents) {
      /** @type {string} */
      var restoreScript = "\n![\u56fe\u7247](" + dataAndEvents + ")\n";
      var res = jQuery.insertContent(html, restoreScript);
      if (scope.post) {
        scope.post.content = res;
      } else {
        scope.post = {
          content : res
        };
      }
    };
    /**
     * @return {?}
     */
    scope.submit = function() {
      if (!scope.post) {
        return void Css.pushMessage("\u8bf7\u586b\u5199\u4fe1\u606f", "warning");
      }
      /** @type {Array} */
      var tag_ids = [];
      if (scope.activeCategory) {
        tag_ids = transclude.getTagIds(scope.activeCategory.groups);
      }
      var promise;
      var defaults = {
        title : scope.post.title,
        content : scope.post.content,
        tag_ids : tag_ids,
        category_id : scope.activeCategory ? scope.activeCategory.id : null
      };
      /**
       * @param {Element} post
       * @return {?}
       */
      var success = function(post) {
        return $location.path("/posts/" + post.id), _.eventTrack(params.postId ? "Edit" : "Create", {
          category : "Post"
        }), post;
      };
      /**
       * @param {MessageEvent} response
       * @return {?}
       */
      var error = function(response) {
        return scope.errors = response.data.errors, response;
      };
      if (params.postId) {
        var deep = view.one("posts", params.postId);
        $.extend(deep, defaults);
        promise = deep.put();
      } else {
        var $$ = view.one("posts");
        $.extend($$, defaults);
        promise = $$.post();
      }
      promise.then(success, error);
      callback("updating").addPromise(promise);
    };
  }]);
  $.module("dgConnect", ["dgConnectNotification", "dgConnectMessage"]);
  $.module("dgConnectMessage", []).controller("MessageListCtrl", ["$scope", "$routeParams", "Query", "Conversation", "Restangular", function(context, dataAndEvents, ProgressIndicator, messages, db) {
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : db.all("messages")
      });
    };
    /**
     * @param {string} output
     * @return {undefined}
     */
    context.removeConversation = function(output) {
      messages.removeMessage({
        type : "conversation",
        host : {
          id : output.target_user.name
        },
        message : output,
        messages : context.objects
      });
    };
  }]).controller("MessageDetailCtrl", ["$scope", "$routeParams", "Query", "Conversation", "Restangular", function($scope, result, ProgressIndicator, messages, el) {
    $scope.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    $scope.getObjects = function() {
      $scope.query.get({
        scope : $scope,
        thing : el.one("messages").all(result.username)
      });
    };
    $scope.username = result.username;
    /**
     * @param {string} opt_attributes
     * @return {undefined}
     */
    $scope.removeMessage = function(opt_attributes) {
      messages.removeMessage({
        type : "message",
        host : {
          id : result.username
        },
        message : opt_attributes,
        messages : $scope.objects
      });
    };
  }]);
  $.module("dgConnectNotification", []).factory("UnreadNotification", ["Restangular", function(result) {
    var self = {
      objects : [],
      /**
       * @return {?}
       */
      get : function() {
        return result.all("user/notifications").getList({
          page : 0,
          state : "unread"
        }).then(function(objects) {
          return self.objects = objects, objects;
        });
      },
      /**
       * @param {Array} obj
       * @return {undefined}
       */
      markAsRead : function(obj) {
        if ($.isUndefined(obj) || $.isString(obj)) {
          result.one("user/notifications", obj).put().then(function() {
            self.get();
          });
        } else {
          if ($.isArray(obj)) {
            var self = result.one("user/notifications");
            /** @type {Array} */
            self.ids = obj;
            self.put().then(function() {
              self.get();
            });
          }
        }
      }
    };
    return self;
  }]).directive("dgUnreadNotification", ["UnreadNotification", function(message) {
    return{
      replace : true,
      restrict : "EA",
      templateUrl : "views/connect/notification-unread.html",
      /**
       * @param {?} $scope
       * @param {?} tabCtrl
       * @param {Object} column
       * @return {undefined}
       */
      link : function($scope, tabCtrl, column) {
        /** @type {Object} */
        $scope.notification = message;
        $scope.notification.get();
        $scope.notificationLimit = column.limit;
        /**
         * @param {?} $location
         * @return {undefined}
         */
        $scope.setNotificationLimit = function($location) {
          $scope.notificationLimit = $location;
        };
        /**
         * @param {?} options
         * @return {?}
         */
        $scope.getIds = function(options) {
          /** @type {Array} */
          var workers = [];
          return $.forEach($scope.notification.objects.slice(0, options), function(worker) {
            workers.push(worker.id);
          }), workers;
        };
      }
    };
  }]).controller("NotificationCtrl", ["$scope", "Query", "Restangular", function(context, ProgressIndicator, res) {
    context.query = ProgressIndicator.getInstance();
    /**
     * @param {?} x
     * @return {undefined}
     */
    context.getObjects = function(x) {
      context.query.get({
        scope : context,
        thing : res.all("user/notifications"),
        extraParams : {
          "types[]" : x
        }
      });
    };
  }]);
  $.module("dgFeedback", []).controller("FeedbackCtrl", ["$scope", "$http", "apiPrefix", "Query", "Restangular", function(context, $http, markup, ProgressIndicator, elm) {
    context.query = ProgressIndicator.getInstance();
    /**
     * @return {undefined}
     */
    context.getObjects = function() {
      context.query.get({
        scope : context,
        thing : elm.all("feedback")
      });
    };
    /**
     * @param {Element} user
     * @return {undefined}
     */
    context.toggleVote = function(user) {
      if (user.voted) {
        $http({
          url : markup + "/feedback/" + user.id + "/vote",
          method : "DELETE"
        }).success(function() {
          /** @type {boolean} */
          user.voted = false;
          user.vote_count--;
        });
      } else {
        $http({
          url : markup + "/feedback/" + user.id + "/vote",
          method : "PUT"
        }).success(function() {
          /** @type {boolean} */
          user.voted = true;
          user.vote_count++;
        });
      }
    };
  }]);
  $.module("dgSetting", ["dgFlash", "dgUserAuth"]).controller("SettingProfileCtrl", ["$routeParams", "Flash", "Session", "Taxonomy", "Restangular", "UserRestangular", function(settings, test, data, Y, _, row) {
    var self = this;
    var t = {
      weibo : "\u65b0\u6d6a\u5fae\u535a",
      tqq : "\u817e\u8baf\u5fae\u535a",
      douban : "\u8c46\u74e3"
    };
    self.taxonomy = Y;
    self.success = settings.success;
    self.connected = settings.connected;
    self.disconnected = settings.disconnected;
    if ("1" === self.success) {
      if (t[self.connected]) {
        test.pushMessage("\u7ed1\u5b9a" + t[self.connected] + "\u6210\u529f", "success");
      } else {
        if (t[self.disconnected]) {
          test.pushMessage("\u89e3\u9664\u7ed1\u5b9a" + t[self.disconnected] + "\u6210\u529f", "success");
        }
      }
    } else {
      if ("0" === self.success) {
        test.pushMessage("\u7ed1\u5b9a\u793e\u4ea4\u5e10\u53f7\u5931\u8d25", "warning");
      }
    }
    /**
     * @param {string} term
     * @param {?} results
     * @return {?}
     */
    self.changeProvince = function(term, results) {
      return self.cities = _.find(results, {
        id : term
      }).cities, self.cities;
    };
    /**
     * @return {undefined}
     */
    self.resetSelectedCity = function() {
      if (self.user) {
        self.user.city = _.first(self.cities);
      }
    };
    /**
     * @param {Element} deepDataAndEvents
     * @param {Object} args
     * @return {undefined}
     */
    self.changeIdentity = function(deepDataAndEvents, args) {
      self.activeIdentity = self.taxonomy.deactiveTags(deepDataAndEvents, args);
    };
    /**
     * @param {string} deepDataAndEvents
     * @param {Object} details
     * @return {undefined}
     */
    self.changeIdentityClick = function(deepDataAndEvents, details) {
      self.changeIdentity(deepDataAndEvents, details);
      /** @type {Array} */
      self.user.domains = [];
    };
    var promise = _.all("areas").getList();
    var defer = _.all("users/identities").getList();
    data.requestCurrentUser().then(function(test) {
      return self.user = data.currentUser, promise.then(function(extra) {
        return self.areas = extra, null != test.province && self.changeProvince(test.province.id, extra), extra;
      }), defer.then(function(details) {
        return self.identities = details, null != test.identity && self.changeIdentity(test.identity, details), details;
      }), test;
    });
    var res = row.one("user");
    /**
     * @return {undefined}
     */
    self.submit = function() {
      var domain_ids;
      if (self.activeIdentity) {
        domain_ids = Y.getTagIds(self.activeIdentity.groups);
      }
      var config = {
        avatar : self.user.avatar,
        website : self.user.website,
        nickname : self.user.nickname,
        description : self.user.description,
        province_id : self.user.province ? self.user.province.id : null,
        city_id : self.user.city ? self.user.city.id : null,
        identity_id : self.activeIdentity ? self.activeIdentity.id : null,
        domain_ids : domain_ids
      };
      $.extend(res, config);
      res.put().then(function(dataAndEvents) {
        return test.pushMessage("\u66f4\u65b0\u4e2a\u4eba\u8d44\u6599\u6210\u529f", "success"), dataAndEvents;
      }, function(response) {
        self.errors = response.data.errors;
      });
    };
  }]).controller("SettingAccountCtrl", ["Flash", "Session", "Restangular", "UserRestangular", function(Auth, security, Company, row) {
    /**
     * @param {?} textStatus
     * @return {?}
     */
    function complete(textStatus) {
      return $scope.errors = null, Auth.pushMessage("\u66f4\u6539\u8bbe\u7f6e\u6210\u529f", "success"), textStatus;
    }
    /**
     * @param {MessageEvent} response
     * @return {undefined}
     */
    function error(response) {
      $scope.errors = response.data.errors;
    }
    var $scope = this;
    var res = row.one("user");
    Company.one("user/settings/notification").get().then(function(message) {
      return $scope.notification = message, message;
    });
    security.requestCurrentUser().then(function(user) {
      return $scope.user = user, user;
    });
    /**
     * @return {undefined}
     */
    $scope.submitNotif = function() {
      $scope.notification.put().then(complete, error);
    };
    /**
     * @param {?} cb
     * @return {undefined}
     */
    $scope.submit = function(cb) {
      var op = _.pick($scope.user, cb);
      $.extend(res, op);
      res.put().then(complete, error);
    };
  }]);
  $.module("dgPage", []).controller("LinkCtrl", ["Restangular", function(_) {
    var o = this;
    _.all("links").getList({
      with_image : true
    }).then(function(lvl) {
      return o.objectsWithImage = lvl, lvl;
    });
    _.all("links").getList({
      with_image : false
    }).then(function(lvl) {
      return o.objectsWithoutImage = lvl, lvl;
    });
  }]).controller("ServicesCtrl", ["$timeout", "Sharing", "Restangular", function($timeout, post, objects) {
    var self = this;
    var data = objects.one("contacts");
    var ret = objects.one("subscribes");
    self.successes = {};
    self.sharingLink = post.getLink({
      title : "\u97f3\u4e50\u5b75\u5316\u5668\uff1a",
      service : "tsina",
      summary : "\u97f3\u4e50\u4ece\u6b64\u5927\u4e0d\u540c\uff01\u4ece\u53f0\u524d\u5230\u5e55\u540e\uff0c\u4ece\u65b0\u4eba\u5230\u5de8\u661f\uff0c\u4ece\u827a\u672f\u5230\u79d1\u6280\uff0c\u4ece\u7ebf\u4e0a\u5230\u7ebf\u4e0b\uff0c\u4ece\u4e0a\u6e38\u5230\u4e0b\u6e38\u3002\u65b0\u6a21\u5f0f\uff0c\u5927\u6574\u5408\uff0c\u97f3\u4e50\u4eba\u670d\u52a1\u5e73\u53f0\u3002\uff08\u6765\u81ea@\u5408\u62cd\u7f51\uff09"
    });
    /**
     * @param {?} args
     * @return {undefined}
     */
    this.subscribe = function(args) {
      ret = $.extend(ret, args);
      ret.post().then(function() {
        /** @type {boolean} */
        self.successes.subscribe = true;
        $timeout(function() {
          /** @type {boolean} */
          self.successes.subscribe = false;
        }, 5E3);
      }, function(response) {
        self.errors.subscribe = response.data.errors;
      });
    };
    /**
     * @param {(Function|number)} res
     * @return {undefined}
     */
    this.contact = function(res) {
      data = $.extend(data, res);
      data.post().then(function() {
        /** @type {null} */
        res = null;
        /** @type {boolean} */
        self.successes.contact = true;
        $timeout(function() {
          /** @type {boolean} */
          self.successes.contact = false;
        }, 5E3);
      }, function(response) {
        self.errors.contact = response.data.errors;
      });
    };
  }]);
  $.module("dgTemplates", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("views/connect/comment.html", '<div class="streams" infinite-scroll="getObjects([\'comment\', \'mention\', \'reply\']);" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'comment\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><article class="thing thing-conversation"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar avatar-medium" width="50" height="50" dg-image="{{ object.actor.avatars.origin }}"></a><div class="u-textTruncate" ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> <span ng-switch-when="comment" ng-switch="object.notifiable.type">\u8bc4\u8bba\u4e86\u4f60\u7684 <a ng-switch-when="music" ng-href="/music/{{ object.notifiable.id }}" ng-bind-template="{{ object.notifiable.content }}"></a> <a ng-switch-when="post" ng-href="/posts/{{ object.notifiable.id }}" ng-bind-template="{{ object.notifiable.content }}"></a></span> <span ng-switch-when="mention">\u5728\u8bc4\u8bba\u4e2d\u63d0\u5230\u4e86\u4f60</span> <span ng-switch-when="reply">\u56de\u590d\u4e86\u4f60\u7684\u8bc4\u8bba</span><time class="u-colorGray" datetime="{{ object.created_at }}"></time><div class="thing-content u-textBreak" ng-bind="object.notifiable.comment_content"></div></div></article></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/connect/follow.html", '<div class="streams" infinite-scroll="getObjects(\'follow\')" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'follow\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a> <i class="u-pullRight" dg-follow="object.actor"></i><div class="thing-info"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> \u5173\u6ce8\u4e86\u4f60<time class="u-colorGray" datetime="{{ object.created_at }}"></time><dl class="separated list-inline"><dt ng-if="object.actor.city || object.actor.province"><dfn>\u5730\u5740</dfn>\uff1a</dt><dd ng-if="object.actor.city || object.actor.province" ng-bind="object.actor.city.name || object.actor.province.name"></dd><dt ng-if="object.actor.identity.name" ng-show="object.actor.identity.name"><dfn>\u8eab\u4efd</dfn>\uff1a</dt><dd ng-if="object.actor.identity.name" ng-bind="object.actor.identity.name"></dd></dl></div></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/connect/like.html", '<div class="streams" infinite-scroll="getObjects(\'like\')" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'like\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol><li class="activity u-cf" ng-repeat="object in objects"><a class="thing-highlight" ng-href="/{{ object.actor.name }}"><img class="avatar" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a><div class="thing-info" ng-switch="object.notifiable.type"><a ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> \u8d5e\u4e86\u4f60\u7684 <span ng-switch-default="">\u97f3\u4e50</span><time class="u-colorGray" datetime="{{ object.created_at }}"></time><div class="thing-content"><a ng-bind="object.notifiable.content" ng-href="/music/{{ object.notifiable.id }}" ng-switch-default=""></a></div></div></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/connect/message/conversation.html", '<div class="streams" infinite-scroll="getObjects();" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'messageList\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><ol class="conversations"><li class="activity" ng-repeat="object in objects"><article class="thing thing-conversation u-cf"><div class="thing-highlight"><a title="{{ object.target_user.nickname }}" ng-href="/{{ object.target_user.name }}"><img class="avatar" alt="{{ object.target_user.nickname }}" width="40" height="40" dg-image="{{ object.target_user.avatars.origin }}"></a></div><div class="thing-well"><div dg-linkify="" ng-href="/connect/message/{{ object.target_user.name }}"><div class="headline u-colorGray">\u548c <a title="{{ object.target_user.nickname }}" ng-href="/{{ object.target_user.name }}" ng-bind="object.target_user.nickname"></a> <span class="u-colorGray" ng-bind-template="\u5171 {{ object.messages_count }} \u6761\u6709\u5f80\u6765\u4fe1\u606f"></span></div><div class="thing-content u-textBreak" ng-bind-html="object.last_message.content"></div></div><footer class="u-cf"><div class="u-pullLeft"><time class="u-colorGray" datetime="{{ object.updated_at }}"></time></div><div class="u-pullRight"><a ng-click="removeConversation(object)">\u5ffd\u7565</a></div></footer></div></article></li></ol><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/connect/message/message.html", '<div class="streams" infinite-scroll="getObjects();" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div ng-include="\'views/connect/navigation.html\'"></div><div class="conversation-outer"><i host-id="username" messages="objects" placeholder="\u8f93\u5165\u65b0\u6d88\u606f" dg-new-message="message"></i><ol class="conversation" ng-if="objects.length"><li class="message" ng-repeat="object in objects"><article class="u-cf"><div class="thing-highlight"><a title="{{ object.actor.nickname }}" ng-href="/{{ object.actor.name }}"><img class="avatar" alt="{{ object.actor.nickname }}" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a></div><div class="thing-well"><a title="{{ object.actor.nickname }}" ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a><div class="thing-content u-textBreak" ng-bind-html="object.content_html"></div><footer class="u-cf"><div class="u-pullLeft"><time class="u-colorGray" datetime="{{ object.updated_at }}"></time></div><div class="u-pullRight"><a ng-show="object.own" ng-click="removeMessage(object)">\u5220\u9664</a></div></footer></div></article></li></ol></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/connect/navigation.html", '<div class="tabs-outer tabs-4cols u-cf"><a class="tab" href="/connect/like" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-thumbs-up"></i>\u8d5e</a> <a class="tab" href="/connect/follow" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-eye"></i>\u5173\u6ce8</a> <a class="tab" href="/connect/comment" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-comment"></i>\u8bc4\u8bba</a> <a class="tab" href="/connect/message" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-mail"></i>\u79c1\u4fe1 <a></a></a></div>');
    $templateCache.put("views/connect/notification-unread.html", '<div class="notifications Box Box--small" ng-show="notification.objects"><div class="Box-header u-bgBlue" ng-bind-template="{{ notification.objects.length }} \u6761\u65b0\u901a\u77e5"></div><ol><li class="Box-item u-cf" ng-repeat="object in notification.objects | limitTo:notificationLimit"><div ng-include="\'views/partials/notification.html\'"></div></li></ol><div class="Box-footer u-cf"><a class="u-pullLeft" ng-show="notification.objects.length > notificationLimit" ng-click="setNotificationLimit(notification.objects.length)" ng-bind-template="\u663e\u793a\u5168\u90e8 {{ notification.objects.length }} \u6761\u65b0\u901a\u77e5"></a> <a class="u-pullRight" ng-if="notification.objects.length <= notificationLimit" ng-click="notification.markAsRead()">\u5ffd\u7565\u5168\u90e8</a> <a class="u-pullRight" ng-if="notification.objects.length > notificationLimit" ng-click="notification.markAsRead(getIds(notificationLimit))" ng-bind-template="\u5ffd\u7565\u4ee5\u4e0a {{ notificationLimit }} \u6761"></a></div></div>');
    $templateCache.put("views/feedback/feedback.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1"><div class="conversation-outer"><i dg-new-message="feedback" messages="objects" placeholder="\u7528\u5f97\u9ad8\u5174\u4e0d\u9ad8\u5174\uff0c\u90fd\u544a\u8bc9\u6211\u4eec\u3002"></i><ol><li class="activity u-cf" ng-repeat="object in objects"><article class="thing thing-feedback"><div class="thing-info u-borderB u-cf"><a class="thing-highlight"><img class="avatar" width="40" height="40" dg-image="{{ object.owner.avatars.origin }}"></a><div><a title="{{ object.owner.nickname }}" ng-href="/{{ object.owner.name }}" ng-bind="object.owner.nickname"></a><div class="thing-content u-textBreak" ng-bind="object.content"></div></div></div><footer class="thing-actions u-cf"><a class="btn btn-large btn-like thing-action" ng-click="toggleVote(object)" ng-class="{\'btn-unlike\': object.voted}"><i class="icon-thumbs-up"></i> <small ng-bind="object.vote_count"></small></a></footer></article></li></ol></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/home/activity.html", '<div class="streams" ng-controller="TimelineCtrl as timeline" infinite-scroll="timeline.getObjects()" infinite-scroll-disabled="timeline.query.paused" infinite-scroll-distance="1"><i class="u-marginBl" dg-unread-notification="" limit="5"></i><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="timeline.isDataEmpty" ng-init="hintType = \'home\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity-outer" ng-repeat="object in timeline.objects"><div ng-include="\'views/partials/activity.html\'"></div></div></div><i ng-if="!timeline.isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/home/banner.html", '<a href="https://itunes.apple.com/cn/app/you-yan-chu-yin-le-yan-chu/id521415660?mt=8" title="\u4e0b\u8f7d\u6709\u6f14\u51fa iOS App"><img src="/images/banner/iOS-App-yyc.29e24358.png" alt="\u6709\u6f14\u51fa iOS App"></a>');
    $templateCache.put("views/home/explore.html", '<div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div ng-controller="ExploreCtrl as explore"><div ng-include="\'views/partials/explore-recommend.html\'"></div></div>');
    $templateCache.put("views/home/home.html", '<div class="u-marginBl" ng-if="dg.device.isDesktop()"><div ng-include="\'views/home/banner.html\'"></div></div><div class="home" ng-include="\'views/home/\' + home.templateName + \'.html\'"></div>');
    $templateCache.put("views/music/music-list.html", '<div class="u-marginBl" ng-if="dg.device.isDesktop()"><div ng-include="\'views/home/banner.html\'"></div></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="music.getObjects()" infinite-scroll-disabled="music.query.paused" infinite-scroll-distance="1"><div class="Box u-marginTm" dg-taxonomy="music/types" taxonomy-name="\u7c7b\u578b" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div><div class="Box u-marginTm" dg-taxonomy="music/genres" taxonomy-name="\u66f2\u98ce" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div><div class="cards u-cf"><article class="card" ng-init="music = object" ng-repeat="object in music.objects"><div ng-include="\'views/partials/card/music.html\'"></div></article></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/music/music.html", '<div class="streams"><div ng-if="music"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft"><a class="u-pullLeft u-marginRm" title="{{ music.user.nickname }}" ng-href="/{{ music.user.name }}"><img class="avatar" alt="{{ music.user.nickname }}" width="40" height="40" dg-image="{{ music.user.avatars.origin }}"></a><div class="u-pullLeft"><p class="u-colorGray">\u7531 <a title="{{ music.user.nickname }}" ng-bind="music.user.nickname" ng-href="/{{ music.user.name }}"></a> <span ng-if="music.published">\u53d1\u5e03</span> <span ng-if="!music.published">\u4e0a\u4f20</span> <span class="u-colorPink" ng-if="!music.published">(\u672a\u516c\u5f00)</span></p><time class="u-colorGray" datetime="{{ music.created_at }}"></time></div></div><div class="activity-actions"><span class="u-inlineBlock u-colorGray"><i class="icon-headphone"></i> <small ng-bind="music.listen_count"></small></span> <span class="u-paddingLm" ng-if="music.own"><a class="btn btn-small" ng-if="!music.published" ng-click="actions.publish(music)">\u516c\u5f00</a> <a class="btn btn-small" ng-if="dg.device.isDesktop()" ng-href="/music/{{ music.id }}/update">\u7f16\u8f91</a></span></div></div><div class="thing-outer" ng-if="music" ng-init="thing = music; hideExtraButton = true;"><div ng-include="\'views/partials/thing/music.html\'"></div></div><dl class="separated Box u-bgBlue u-paddingAs u-marginTl list-inline"><dt><dfn>\u6b4c\u624b</dfn>\uff1a</dt><dd><a ng-href="/{{ music.user.name }}" ng-bind="music.user.nickname"></a></dd><dt><dfn>\u6807\u7b7e</dfn>\uff1a</dt><dd><a ng-href="/search?q=%23{{ music.type.slug }}" ng-bind="music.type.name"></a></dd><dd><a ng-href="/search?q=%23{{ music.genre.slug }}" ng-bind="music.genre.name"></a></dd></dl><div class="thing-content u-paddingVm u-borderB u-textBreak" ng-if="music.lyric_html" ng-bind-html="music.lyric_html"></div><div class="Box u-marginTl" ng-if="music.published" ng-init="sharingThing = music; sharingThing.$type = \'music\';"><div ng-include="\'views/partials/sharing.html\'"></div></div><ol class="thing-fans u-paddingVm u-borderB" ng-if="music.likers.length > 0"><li class="u-inlineBlock" ng-repeat="user in music.likers | limitTo:10"><a ng-href="/{{ user.name }}"><img class="avatar avatar-small u-marginRs" alt="{{ user.nickname }}" width="30" height="30" dg-image="{{ user.avatars.origin }}"></a></li><li class="u-inlineBlock u-colorGray"><span ng-if="music.likers.length > 10">\u7b49</span> <span ng-bind-template="{{ music.likers.length }} \u4eba\u8d5e\u4e86"></span></li></ol><div class="conversation-outer" ng-if="music.published"><i dg-comment="{{ music.id }}" host-type="music"></i></div></div></div>');
    $templateCache.put("views/music/progress-bar.html", '<div class="player-progress-area"><div class="player-progress progress-outer"><div class="progress progress-loading" ng-style="{\'width\': percentLoaded + \'%\'}"></div><div class="progress progress-playing" ng-style="{\'width\': percentPlayed + \'%\'}"></div></div></div>');
    $templateCache.put("views/music/uploading.html", '<div class="streams"><form name="uploadingForm" ng-hide="uploading.objectsTracker.active()" ng-submit="uploading.submit()"><div class="form-field u-cf"><label class="u-pullLeft uploader-cover"><i dg-uploader="" upload-type="image" upload-thing="\u5c01\u9762" target-model="uploading.music.cover" upload-folder="covers"><img class="image-original" width="240" height="240" dg-image="{{ uploading.music.cover || uploading.music.covers.origin ||\n                                   \'https://dn-storm-image.qbox.me/default/cover.png\' }}" ng-model="uploading.music.cover"></i> <span class="input-message input-error" ng-if="uploading.errors.cover" ng-bind="uploading.errors.cover.message"></span></label><label class="u-pullLeft"><i dg-uploader="" upload-type="audio" upload-thing="\u97f3\u4e50" target-model="uploading.music.audio" upload-folder="music"></i> <span class="input-message input-error" ng-if="uploading.errors.audio" ng-bind="uploading.errors.audio.message"></span></label></div><input type="hidden" name="audio" ng-model="uploading.music.audio" ng-change="uploading.errors.audio = null"><input type="hidden" name="cover" ng-model="uploading.music.cover" ng-change="uploading.errors.cover = null"><label class="form-field">\u6b4c\u540d\uff1a <span class="input-message input-error" ng-if="uploading.errors.name" ng-bind="uploading.errors.name.message"></span><input name="name" type="text" ng-model="uploading.music.name" ng-change="uploading.errors.name = null"></label><label class="form-field">\u66f2\u98ce\uff1a<select ng-model="uploading.music.genre.id" ng-options="genre.id as genre.name for genre in uploading.genres"></select></label><label class="form-field">\u7c7b\u578b\uff1a<select ng-model="uploading.music.type.id" ng-options="type.id as type.name for type in uploading.types"></select></label><div class="form-field form-textarea Box--small"><label class="textarea-header Box-header u-bgBlue u-cf" for="lyric">\u6b4c\u8bcd\uff1a</label><textarea name="lyric" id="lyric" rows="10" cols="10" ng-model="uploading.music.lyric">\n            </textarea></div><label class="form-field u-borderB"><input name="published" type="checkbox" ng-model="uploading.music.published">\u516c\u5f00</label><div class="u-paddingTl"><span class="btn-outer"><button class="btn btn-reverse btn-medium u-paddingHl" type="submit" ng-disabled="uploading.inputTracker.active()">\u4fdd\u5b58</button> <i dg-tracker="uploading" type="input"></i></span></div></form><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/page/404.html", '<div class="page-404" ng-controller="NavCtrl as nav"><div class="page-404-vertical"><div class="page-404-image"><img class="page-404-image-banner" src="/images/404-banner.60cd5b93.png"> <img src="/images/404-shadow.66fe84f7.png"></div><div><p class="u-fontSizeXXL u-colorBlue">Oops, \u9875\u9762\u51fa\u9519\u4e86\uff01</p><p>\u4f60\u53ef\u4ee5\u8c03\u6574\u641c\u7d22\u5173\u952e\u8bcd\uff0c\u627e\u5230\u4f60\u60f3\u8981\u7684\u5185\u5bb9</p><form class="u-marginVm" ng-submit="nav.submit()"><input class="page-404-searchinput u-inlineBlock u-marginRm" name="search" type="text" ng-model="nav.g.searchString"><button class="btn btn-medium btn-reverse u-paddingHl" type="submit">\u641c\u7d22</button></form><p>\u6216 <a href="/">\u8fd4\u56de\u9996\u9875</a></p></div></div></div>');
    $templateCache.put("views/page/about.html", '<div class="u-widthDesktop u-alignCenter"><header class="about-header u-paddingLl u-cf"><a class="about-logo u-pullLeft" href="/"><img src="/images/about/logo.e9f19912.png"></a><div class="u-pullRight u-cf"><a class="about-header-link u-block u-pullLeft u-textCenter" href="/about" l42y-match-path="" ng-class="{\'current\': l42y.isPathMatched}">\u5173\u4e8e\u5408\u62cd</a> <a class="about-header-link u-block u-pullLeft u-textCenter" ng-href="/signup?returnUrl={{ dg.location.host() }}">\u767b\u5f55/\u6ce8\u518c</a></div></header><img class="u-marginBl" src="/images/about/banner.d6bdadb3.png"><div class="about-main" ng-class="{\'u-paddingHl\': !dg.device.isDesktop()}"><div class="u-paddingVl u-marginBl u-borderB"><h2 class="u-fontSizeXXL u-fontNormal u-colorBlue">\u91cd\u65b0\u8fde\u63a5\u6bcf\u4e00\u4f4d\u97f3\u4e50\u4eba</h2><div class="u-marginTm u-fontSizeL u-marginBl"><p>\u8fd9\u662f\u4e00\u4e2a\u53ea\u5c5e\u4e8e\u97f3\u4e50\u548c\u97f3\u4e50\u4eba\u7684\u793e\u533a\uff0c\u6ca1\u6709\u591a\u4f59\u7684\u55a7\u56a3\u548c\u7eb7\u6270\u3002</p><p>\u97f3\u4e50\u662f\u6211\u4eec\u5171\u540c\u7684\u7ebd\u5e26\uff0c\u65e0\u8bba\u4f55\u65f6\u3001\u4f55\u5730\u3001\u4f55\u79cd\u98ce\u683c\uff0c\u8fd9\u91cc\u6709\u6700\u61c2\u97f3\u4e50\u7684\u542c\u4f17\u3002</p><p>\u97f3\u4e50\u4e5f\u662f\u6211\u4eec\u6700\u72c2\u70ed\u7684\u8ffd\u6c42\uff0c\u4ece\u7ed3\u8bc6\u5230\u5408\u4f5c\u3001\u4ece\u5f55\u97f3\u5230\u6f14\u51fa\uff0c\u8fd9\u91cc\u8ba9\u76f8\u8ddd\u5343\u91cc\u7684\u68a6\u60f3\u4e00\u62cd\u5373\u5408\uff01</p></div></div><div class="u-paddingTl u-borderB"><h2 class="u-marginBl u-fontSizeXXL u-fontNormal u-colorBlue">\u5728\u5408\u62cd\u4f60\u53ef\u4ee5</h2><ul class="u-cf u-marginBl"><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/badass.928b6b02.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">\u9047\u89c1\u8d35\u4eba\uff0c\u8bf7\u6559\u5927\u725b</h3><div class="u-fontSizeL u-textLeft">\u8fd9\u91cc\u6709\u884c\u4e1a\u7684\u4ece\u4e1a\u4eba\u58eb\uff0c\u53ea\u8981\u6562\u79c0\uff0c\u5c31\u80fd\u6362\u5f97\u5f55\u97f3\uff0c\u6f14\u51fa\uff0c\u7b7e\u7ea6\u7684\u673a\u4f1a\uff01 \u8fd9\u91cc\u4e5f\u6709\u73a9\u8f6c\u4e50\u5668\u7684\u5404\u8def\u5927\u725b\uff0c\u53ea\u8981\u6562\u95ee\uff0c\u5c31\u4f1a\u8ba9\u4f60\u83b7\u76ca\u532a\u6d45\u3002</div></li><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/friends.d0980fb9.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">\u7ed3\u8bc6\u4f19\u4f34\uff0c\u4ea4\u6d41\u521b\u4f5c</h3><div class="u-fontSizeL u-textLeft">\u4e0d\u7ba1\u8eab\u5904\u54ea\u4e2a\u57ce\u5e02\u3001\u73a9\u7740\u4ec0\u4e48\u98ce\u683c\uff0c\u8fd9\u91cc\u603b\u6709\u4f60\u7684\u540c\u9053\u4e2d\u4eba\uff01 \u4ea4\u6d41\u5b66\u4e60\uff0c\u5171\u540c\u534f\u4f5c\uff0c\u8fd9\u624d\u662f\u73a9\u513f\u97f3\u4e50\u7684\u4e50\u8da3\u3002</div></li><li class="u-textCenter u-paddingVl" ng-class="{\'u-pullLeft u-paddingHl u-size1of3\': !dg.device.isPhone()}"><img src="/images/about/fans.cfefacdb.png"><h3 class="u-marginVm u-fontNormal u-fontSizeXL u-colorBlue">\u8d62\u5f97\u6b4c\u8ff7\uff0c\u5d2d\u9732\u5934\u89d2</h3><div class="u-fontSizeL u-textLeft">\u53ea\u8981\u4f60\u7684\u97f3\u4e50\u591f\u9177\uff0c\u5c31\u4f1a\u51fa\u73b0\u5728\u5408\u62cd\u63a8\u8350\u9996\u9875\u3001\u97f3\u4e50\u4eba\u653b\u7565\u548c\u5404\u5927\u5a92\u4f53\u7f51\u7ad9\uff01 \u8ba9\u66f4\u591a\u4eba\u542c\u5230\uff0c\u5438\u5f15\u66f4\u591a\u7684\u6b4c\u8ff7\uff0c\u4ece\u6b64\u5f00\u59cb\u4f60\u7684\u97f3\u4e50\u751f\u6daf\u3002</div></li></ul></div><div class="u-paddingVl"><h3 class="u-fontSizeXXL u-fontNormal u-colorBlue">\u73a9\u8f6c\u5408\u62cd</h3><ul class="u-cf" ng-class="{\'u-textCenter\': !dg.device.isDesktop()}"><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u4e0a\u4f20\u97f3\u4e50</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u4e0d\u8bba\u539f\u521b\u3001\u7ffb\u5531\u3001\u6539\u7f16\u3001\u6df7\u97f3\uff0c\u4e0a\u4f20\u5c01\u9762\u3001\u9009\u62e9\u98ce\u683c\u3001\u6dfb\u52a0\u6b4c\u8bcd\uff0c\u8f7b\u677e\u5efa\u7acb\u4f60\u7684\u97f3\u4e50\u540d\u7247\uff01</div></div><img src="/images/about/music.5d5f23b3.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u53d1\u5e03\u4fe1\u606f</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u7ec4\u5efa\u4e50\u961f\u3001\u6f14\u51fa\u7b7e\u7ea6\u3001\u4e8c\u624b\u4e50\u5668\u3001\u8bcd\u66f2\u4ea4\u6613\uff0c\u70b9\u70b9\u9f20\u6807\u5c31\u6709\u4f60\u60f3\u8981\u7684\uff01</div></div><img src="/images/about/post.24f7da60.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u63a2\u7d22\u63a8\u8350</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u4e13\u4e1a\u7684\u97f3\u4e50\u4eba\u793e\u533a\u6709\u6700\u96ea\u4eae\u7684\u773c\u775b\uff0c\u6bcf\u65e5\u63a8\u8350\u97f3\u4e50\u548c\u97f3\u4e50\u4eba\uff0c\u5f15\u7206\u4f60\u7684\u539f\u521b\uff01</div></div><img src="/images/about/explore.386ed698.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u5feb\u901f\u641c\u7d22</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u7535\u5b50\uff1f\u563b\u54c8\uff1f\u6447\u6eda\uff1f\u4e00\u4e2a\u5173\u952e\u5b57\uff0c\u76f4\u8fbe\u4f60\u60f3\u8981\u7684\u5185\u5bb9\u3002</div></div><img src="/images/about/search.489a8fd4.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u7ed1\u5b9a\u793e\u4ea4\u5e10\u53f7</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u8ba9\u4f60\u7684\u670b\u53cb\u77e5\u9053\u4f60\u5728\u5408\u62cd\uff0c\u4e00\u952e\u5206\u4eab\u62d3\u5c55\u4eba\u8109\u3002</div></div><img src="/images/about/social.58b469a7.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullRight u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">iPhone\u3001iPad \u81ea\u9002\u5e94</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u5168\u65b0\u7684\u7f51\u7ad9\u8bbe\u8ba1\uff0c\u5728\u5404\u79cd\u8bbe\u5907\u4e0a\u90fd\u6709\u8d85\u51e1\u7684\u6d4f\u89c8\u4f53\u9a8c\u3002</div></div><img src="/images/about/responsive.11c1a50f.png" ng-class="{\'u-pullLeft\': !dg.device.isPhone()}"></li><li class="u-paddingTl u-marginTl u-paddingHl u-borderB u-cf"><div ng-class="{\'u-pullLeft u-size2of5\': !dg.device.isPhone()}"><h3 class="u-fontSizeXL u-fontNormal u-colorBlue">\u79fb\u52a8 App\uff0c\u968f\u65f6\u968f\u5730\u5408\u62cd</h3><div class="u-fontSizeL" ng-class="{\'u-marginVm\': dg.device.isPhone()}">\u6355\u6349\u8f6c\u77ac\u5373\u901d\u7684\u521b\u4f5c\u7247\u6bb5\uff0c\u968f\u65f6\u968f\u5730\u63a5\u6536\u5408\u62cd\u6d88\u606f\u3002</div></div><img src="/images/about/coming-soon.f2862b5a.png" ng-class="{\'u-pullRight\': !dg.device.isPhone()}"></li></ul></div></div><footer class="u-marginTl u-paddingBl u-textCenter"><h2 class="u-fontSizeXXL u-fontNormal u-colorBlue">\u9a6c\u4e0a\u52a0\u5165\u5408\u62cd</h2><div class="u-marginTl"><a class="btn btn-medium btn-reverse btn-widthL u-marginRl" ng-href="/login?returnUrl={{ dg.location.host() }}">\u767b\u5f55</a> <a class="btn btn-medium btn-reverse btn-widthL" ng-href="/signup?returnUrl={{ dg.location.host() }}">\u6ce8\u518c</a></div><p class="u-marginTl">\u6216\u8005\u4f60\u53ef\u4ee5\uff0c <a href="/">\u5148\u53bb\u901b\u901b >></a></p></footer></div>');
    $templateCache.put("views/page/links.html", '<div class="streams"><div class="u-marginBxxxl"><p class="u-marginBl u-paddingBs u-borderB u-fontSizeM u-fontBold">\u5408\u62cd</p><ul class="u-alignBottom u-fontSizeS"><li class="u-inlineBlock u-marginRxxl"><img class="u-marginBm" src="/images/page/logo120x60.745f6cc2.jpg"><p>logo\u5927\u5c0f: 120 x 60</p></li><li class="u-inlineBlock u-marginRxxl"><img class="u-marginBm" src="/images/page/logo80x30.a9196adf.jpg"><p>logo\u5927\u5c0f: 80 x 30</p></li><li class="u-inlineBlock"><p>\u6587\u5b57\u94fe\u63a5: <a href="http://hepaimusic.com/">\u5408\u62cd(hepaimusic.com) \u97f3\u4e50\u4eba\u793e\u533a</a></p></li></ul></div><div><p class="u-marginBl u-paddingBs u-borderB u-fontSizeM">\u53cb\u60c5\u94fe\u63a5</p><ul class="u-cf"><li class="links-link u-marginRxl u-marginBxl u-inlineBlock" ng-repeat="object in link.objectsWithImage"><a title="{{ object.name }}" ng-href="{{ object.url }}"><img width="84" height="30" dg-image="{{ object.images.origin }}"></a></li></ul><ul class="u-cf u-fontSizeS"><li class="links-link u-marginRxl u-marginBxl u-inlineBlock u-textTruncate" ng-repeat="object in link.objectsWithoutImage"><a title="{{ object.name }}" ng-href="{{ object.url }}" ng-bind="object.name"></a></li></ul></div></div>');
    $templateCache.put("views/page/services.html", '<article class="Services"><header class="Arrange Arrange--middle Services-header u-cf"><div class="Arrange-sizeFill"><h1 class="Services-logo"><span class="u-isHiddenVisually">\u97f3\u4e50\u5b75\u5316\u5668</span></h1></div><div class="Arrange-sizeFit"><a class="Logo--services" href="/" title="\u5408\u62cd"><span class="u-isHiddenVisually">\u56de\u5230\u9996\u9875</span></a></div></header><div class="Services-intro u-cf"><div class="Services-slogan"></div><form class="Services-subscribe" name="subscribeForm" ng-submit="services.subscribe(subscribe)"><label>\u8ba2\u9605\u52a8\u6001\uff0c\u8fd1\u8ddd\u79bb\u5173\u6ce8\u6bcf\u4e00\u4e2a\u6fc0\u52a8\u4eba\u5fc3\u7684\u65f6\u523b\uff1a <span class="input-message input-success" ng-if="services.successes.subscribe">\u8ba2\u9605\u6210\u529f</span> <span class="input-message input-error" ng-if="services.errors.subscribe.email">{{ services.errors.subscribe.email.message }}</span><input class="u-sm-sizeFull" type="email" name="email" ng-model="subscribe.email" ng-change="services.errors.subscribe.email = null" placeholder="\u8bf7\u8f93\u5165\u4f60\u7684\u90ae\u7bb1"><button class="btn btn-reverse btn-medium Button--services" type="submit">\u8ba2\u9605</button></label></form></div><div class="Services-joining"><h2>\u6210\u4e3a\u53c2\u4e0e\u8005</h2><h4>\u4e0d\u8bba\u4f60\u5728\u4ec0\u4e48\u57ce\u5e02\uff0c\u89c4\u6a21\u591a\u5927\uff0c\u53ea\u8981\u4f60\u662f\u4ee5\u4e0b\u673a\u6784\uff0c\u6211\u4eec\u90fd\u6b22\u8fce\u4f60\u53c2\u4e0e</h4><ul class="Grid Services-partners"><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--1"><span class="u-isHiddenVisually">\u5382\u724c</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--2"><span class="u-isHiddenVisually">\u5531\u7247\u516c\u53f8</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--3"><span class="u-isHiddenVisually">\u97f3\u4e50\u8282</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--4"><span class="u-isHiddenVisually">\u6f14\u51fa\u573a\u5730</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--5"><span class="u-isHiddenVisually">\u97f3\u4e50\u54c1\u724c</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--6"><span class="u-isHiddenVisually">\u6f14\u51fa\u4e3b\u529e\u65b9</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--7"><span class="u-isHiddenVisually">\u7efc\u827a\u8282\u76ee</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--8"><span class="u-isHiddenVisually">\u89c6\u9891\u7f51\u7ad9</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--9"><span class="u-isHiddenVisually">\u6392\u7ec3\u5ba4</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--10"><span class="u-isHiddenVisually">\u97f3\u4e50\u5a92\u4f53</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--11"><span class="u-isHiddenVisually">\u7ecf\u7eaa\u4eba</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--12"><span class="u-isHiddenVisually">\u4f17\u7b79\u7f51\u7ad9</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--13"><span class="u-isHiddenVisually">\u8bba\u575b</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--14"><span class="u-isHiddenVisually">\u6587\u5316\u6295\u8d44\u673a\u6784</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--15"><span class="u-isHiddenVisually">\u97f3\u4e50\u56ed\u533a</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--16"><span class="u-isHiddenVisually">\u6570\u5b57\u97f3\u4e50\u7f51\u7ad9 App</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--17"><span class="u-isHiddenVisually">\u54c1\u724c\u5e7f\u544a\u65b9</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--18"><span class="u-isHiddenVisually">\u53d1\u884c\u516c\u53f8</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--19"><span class="u-isHiddenVisually">\u97f3\u4e50\u6e38\u620f</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--20"><span class="u-isHiddenVisually">\u97f3\u4e50\u57f9\u8bad</span></li><li class="u-sm-size1of3 u-md-size1of6 u-lg-size1of6 Grid-cell Services-partner Services-partner--21"><span class="u-isHiddenVisually">\u8fd8\u6709\u4f60\uff01(And you!)</span></li></ul></div><form class="Services-contact u-cf" name="contactForm" ng-submit="services.contact(contact)"><h3>\u8054\u7cfb\u6211\u4eec</h3><div class="input-message input-success u-textCenter" ng-class="{\'u-isVisible\': services.successes.contact,\n                       \'u-isInvisible\': !services.successes.contact}">\u53d1\u9001\u6210\u529f\uff01</div><div class="u-cf"><label class="u-sm-sizeFull u-pullLeft">\u540d\u79f0\uff1a <span class="input-message input-error" ng-if="services.errors.contact.name">{{ services.errors.contact.name.message }}</span><input class="u-sizeFull" id="name" type="text" name="name" ng-model="contact.name" ng-change="services.errors.contact.name = null" placeholder="\u8bf7\u8f93\u5165\u4f60\u7684\u540d\u79f0"></label><label class="u-sm-sizeFull u-pullRight">\u90ae\u7bb1\uff1a <span class="input-message input-error" ng-if="services.errors.contact.email">{{ services.errors.contact.email.message }}</span><input class="u-sizeFull" type="email" name="email" ng-model="contact.email" ng-change="services.errors.contact.email = null" placeholder="\u8bf7\u8f93\u5165\u4f60\u7684\u90ae\u7bb1"></label></div><label class="u-sizeFull">\u7b80\u4ecb\uff1a <span class="input-message input-error" ng-if="services.errors.contact.content">{{ services.errors.contact.content.message }}</span><textarea class="u-sizeFull" rows="10" cols="30" name="intro" ng-model="contact.content" ng-change="services.errors.contact.content = null" placeholder="\u8bf7\u8f93\u5165\u4f60\u8981\u53d1\u9001\u7684\u5185\u5bb9">\n            </textarea></label><div class="u-textCenter"><button class="btn btn-medium btn-reverse Button--services" type="submit">\u53d1\u9001</button></div></form><div class="Services-share u-textCenter"><div class="Services-shareInner u-cf"><div class="u-md-sizeFit u-lg-sizeFit"><div class="Services-qr"></div></div><div class="Services-weibo u-md-sizeFitAlt u-lg-sizeFitAlt">\u626b\u4e00\u626b\u5206\u4eab<br>\u8ba9\u66f4\u591a\u4eba\u53c2\u4e0e\uff01<br>\u6216<br><a class="Services-weiboButton" target="_blank" ng-href="{{ services.sharingLink }}"><i class="icon-weibo"></i> \u5206\u4eab\u5230\u5fae\u535a</a></div></div></div><footer class="Services-footer u-cf"><a class="Services-gaiamagic" href="http://gaiamagic.com" target="_blank"><span class="u-isHiddenVisually">Gaia Magic</span></a><dl class="Services-brands u-cf"><dt class="Services-brandsLabel">\u65d7\u4e0b\u54c1\u724c</dt><dd><a class="Services-musicianguide" href="http://musicianguide.cn" target="_blank"><span class="u-isHiddenVisually">\u97f3\u4e50\u4eba\u653b\u7565</span></a></dd><dd><a class="Services-hepai" href="/"><span class="u-isHiddenVisually">\u5408\u62cd</span></a></dd><dd><a class="Services-youyanchu" href="http://youyanchu.com" target="_blank"><span class="u-isHiddenVisually">\u6709\u6f14\u51fa</span></a></dd></dl></footer></article>');
    $templateCache.put("views/partials/activity.html", '<div class="activity" ng-init="thing = object.target;\n              thing.$prev = objects[$index - 1];\n              thing.$next = objects[$index + 1];" ng-controller="ActionCtrl"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft" ng-init="actor = object.actors[0]"><a class="u-marginRm u-pullLeft" title="{{ actor.nickname }}" ng-if="actor" target="_blank" ng-href="/{{ actor.name }}"><img class="avatar" alt="{{ actor.nickname }}" width="40" height="40" dg-image="{{ actor.avatars.origin }}"></a><div class="u-pullLeft"><p><a title="{{ actor.nickname }}" ng-if="actor" ng-bind="actor.nickname" target="_blank" ng-href="/{{ actor.name }}"></a> <span ng-if="object.action == \'like\'">\u8d5e\u4e86\u4e00\u9996\u97f3\u4e50</span> <span ng-if="object.action == \'create\'">\u53d1\u5e03\u4e86\u4e00\u9996\u97f3\u4e50</span></p><time class="u-block u-colorGray" datetime="{{ object.created_at }}"></time></div></div><div class="activity-actions"><span class="u-inlineBlock u-colorGray"><i class="icon-headphone"></i> <small ng-bind="object.target.listen_count"></small></span></div></div><div class="thing-outer" ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="Box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div>');
    $templateCache.put("views/partials/aside.html", '<div class="aside" ng-controller="NavCtrl as nav"><nav class="nav-aside"><form class="nav-item nav-item-search" ng-hide="dg.g.isSearchPage" ng-submit="nav.submit()"><div class="input-outer u-sizeFull"><input class="input-reverse u-sizeFull" id="s" type="text" name="s" ng-model="nav.g.searchString"><button class="icon-search input-icon" type="submit"></button></div></form><ul class="nav" ng-hide="nav.tracker.active()"><li class="nav-item nav-item-user" ng-if="dg.session.currentUser"><a class="nav-item-link u-block u-textTruncate" ng-href="/{{ dg.session.currentUser.name }}" l42y-match-path="" ng-class="{\'nav-current\': l42y.isPathMatched}"><img class="avatar avatar-small u-marginRs" alt="{{ dg.session.currentUser.nickname }}" width="30" height="30" dg-image="{{ dg.session.currentUser.avatars.origin }}"> <span ng-bind="dg.session.currentUser.nickname"></span></a></li><li class="nav-item" ng-if="dg.modernizr.history"><a class="nav-item-link" href="/" l42y-match-path="true" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-home"></i> \u9996\u9875</a></li><li class="nav-item" ng-if="!dg.modernizr.history"><a class="nav-item-link" l42y-match-path="true" ng-click="dg.location.url(\'/\')" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-home"></i> \u9996\u9875</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" ng-href="/explore" l42y-match-path="true" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-stats"></i> \u63a2\u7d22</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" href="/connect" l42y-match-path="" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-mail"></i> \u901a\u77e5 / \u79c1\u4fe1</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" href="/settings/account" l42y-match-path="true" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-cog"></i> \u8bbe\u7f6e</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" href="/feedback" l42y-match-path="true" ng-class="{\'nav-current\': l42y.isPathMatched}"><i class="icon-edit"></i> \u610f\u89c1\u53cd\u9988</a></li><li class="nav-item" ng-if="dg.session.currentUser"><a class="nav-item-link" ng-click="dg.session.logout()"><i class="icon-exit"></i> \u9000\u51fa\u767b\u5f55</a></li><li class="nav-item-btn-signup" ng-if="!dg.session.currentUser"><a class="btn btn-reverse btn-medium u-sizeFull" href="/signup"><i class="icon-person"></i> \u6ce8\u518c</a></li><li class="nav-item-login" ng-if="!dg.session.currentUser">\u5df2\u6709\u5e10\u53f7\uff1f <a href="/login">\u76f4\u63a5\u767b\u5f55</a></li></ul><i dg-tracker="session"></i></nav><div class="nav-aside nav-bottom u-paddingBl"><a class="nav-item-link u-paddingVn" href="/links">\u53cb\u60c5\u94fe\u63a5</a> <span class="u-paddingVn u-fontSizeS">\u00a9 2013 \u4f5b\u5c71\u5e02\u76d6\u4e9a\u9b54\u529b\u7f51\u7edc\u6709\u9650\u516c\u53f8</span> <a class="nav-item-link u-paddingVn u-fontSizeS" target="_blank" ref="nofollow" href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action">\u7ca4ICP\u590712059236\u53f7-2</a></div></div>');
    $templateCache.put("views/partials/card/music.html", '<div class="card-main"><a ng-href="/music/{{ music.id }}" target="_blank"><img class="cover" dg-image="{{ music.covers.origin }}" width="220" height="220" alt="{{ music.name }}"></a><header class="card-music u-textTruncate"><a title="{{ music.name }}" class="u-colorWhite" ng-bind="music.name" ng-href="/music/{{ music.id }}" target="_blank"></a> <a class="u-table u-colorBlue" ng-href="/{{ music.user.name }}" target="_blank" ng-bind="music.user.nickname"></a><div class="u-pullRight player"><a class="thing-play-right u-circle icon-outer icon-outer-small" ng-click="dg.player.toggle(music)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\': dg.playbackState.sounds[music.id].state\n                             == dg.playbackState.states.playing}"></i></a></div></header><div class="card-music-bg"></div></div>');
    $templateCache.put("views/partials/card/post.html", '<div class="card-main card-post"><div class="u-textTruncate"><a class="thing-title" title="{{ post.title }}" ng-href="/posts/{{ post.id }}" target="_blank" ng-bind="post.title"></a></div><div><a class="u-colorGray" ng-href="/{{ post.user.name }}" target="_blank" ng-bind="post.user.nickname"></a></div><div class="card-content"><div ng-bind-html="post.content_html"></div></div></div>');
    $templateCache.put("views/partials/card/user.html", '<div class="card-main u-textCenter"><a ng-href="/{{ user.name }}" target="_blank"><img class="avatar u-inlineBlock u-marginTs" dg-image="{{ user.avatars.origin }}" width="110" height="110" alt="{{ user.nickname }}"></a><header class="card-section u-textTruncate"><a ng-href="/{{ user.name }}" target="_blank" ng-bind="user.nickname"></a><ul class="list-inline separated u-colorGray"><li ng-if="user.city || user.province"><a ng-href="/search?q=%23{{ user.city.slug || user.province.slug }}" ng-bind="user.city.name || user.province.name"></a></li><li ng-if="user.domains" class="separated" ng-repeat="tag in user.domains"><a ng-href="/search?q=%23{{ tag.slug }}" ng-bind="tag.name"></a></li></ul></header><i class="card-section" dg-follow="user"></i></div>');
    $templateCache.put("views/partials/comment.html", '<div class="comments"><i dg-new-message="comment" messages="comments" host-id="hostId" host-type="hostType" placeholder="\u8f93\u5165\u65b0\u8bc4\u8bba"></i><ol class="conversation"><li class="message" ng-repeat="object in comments" ng-controller="ActionCtrl"><article class="u-cf"><header class="thing-highlight"><a title="{{ object.actor.nickname }}" target="_blank" ng-href="/{{ object.actor.name }}"><img class="avatar avatar-medium" alt="{{ object.actor.nickname }}" width="40" height="40" dg-image="{{ object.actor.avatars.origin }}"></a></header><div class="thing-well"><div class="comment-content"><a title="{{ object.actor.nickname }}" target="_blank" ng-href="/{{ object.actor.name }}" ng-bind="object.actor.nickname"></a> <span class="u-colorGray u-fontSizeS">@{{ object.actor.name }}</span><div class="thing-content u-textBreak" ng-bind-html="object.content_html"></div></div><footer class="u-cf"><div class="u-pullLeft"><time class="u-colorGray" datetime="{{ object.created_at }}"></time></div><div class="u-pullRight"><a ng-class="{\'u-marginRm\': object.own}" ng-click="dispatch(\'reply\')">\u56de\u590d</a> <a ng-show="object.own" ng-click="removeComment(object)">\u5220\u9664</a></div></footer></div><div ng-if="extendedStatus"><i dg-new-message="comment" messages="comments" host-id="hostId" host-type="hostType" placeholder="\u8f93\u5165\u65b0\u8bc4\u8bba"></i></div></article></li></ol></div>');
    $templateCache.put("views/partials/conversation/message-new.html", '<form name="messageForm" class="form-message form-inline u-cf" ng-submit="addMessage()"><div><textarea name="content" rows="1" cols="100" class="textarea-message-new" ng-model="message.content" placeholder="{{ placeholder }}"></textarea></div><input type="submit" value="\u53d1\u5e03" class="btn btn-medium btn-reverse u-paddingHl"></form>');
    $templateCache.put("views/partials/explore-nav.html", '<div class="tabs-outer tabs-4cols" ng-controller="SearchMatchingCtrl as match"><a class="tab" href="/" ng-if="!dg.session.currentUser" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-stats"></i> \u63a8\u8350</a> <a class="tab" href="/explore" ng-if="dg.session.currentUser" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-stats"></i> \u63a8\u8350</a> <a class="tab" href="/search?type=music" ng-class="{\'tab-current\': match.test(\'type\', \'music\')}"><i class="icon-music"></i> \u97f3\u4e50</a> <a class="tab" href="/search?type=user" ng-class="{\'tab-current\': match.test(\'type\', \'user\')}"><i class="icon-person"></i> \u7528\u6237</a> <a class="tab" href="/search?type=post" ng-class="{\'tab-current\': match.test(\'type\', \'post\')}"><i class="icon-post"></i> \u5408\u4f5c\u4fe1\u606f</a></div>');
    $templateCache.put("views/partials/explore-recommend.html", '<div class="cards-outer u-cf" infinite-scroll="explore.getObjects()" infinite-scroll-disabled="explore.query.paused" infinite-scroll-distance="1"><div class="cards u-cf"><article class="card" ng-class="{\'card-2x\': object.size == \'large\'}" ng-repeat="object in explore.objects"><div class="card-outer" ng-if="object.target.klass == \'Music\'" ng-init="music = object.target"><div ng-include="\'views/partials/card/music.html\'"></div></div><div class="card-outer" ng-if="object.target.klass == \'User\'" ng-init="user = object.target"><div ng-include="\'views/partials/card/user.html\'"></div></div><div class="card-outer" ng-if="object.target.klass == \'Post\'" ng-init="post = object.target"><div ng-include="\'views/partials/card/post.html\'"></div></div><div class="card-extra u-colorGray" ng-if="object.target.klass == \'Music\' && object.size == \'large\'"><ul class="card-stats u-cf"><li class="card-stat u-textLeft"><i class="icon-thumbs-up"></i> <span ng-bind="object.target.like_count"></span></li><li class="card-stat u-textCenter"><i class="icon-comment"></i> <span ng-bind="object.target.comments_count"></span></li><li class="card-stat u-textRight"><i class="icon-headphone"></i> <span ng-bind="object.target.listen_count"></span></li></ul><dl class="card-section list-inline separated"><dt><dfn>\u6807\u7b7e</dfn>\uff1a</dt><dd ng-bind="object.target.genre.name"></dd><dd ng-bind="object.target.type.name"></dd></dl><dl class="list-inline"><dt><dfn>\u4f5c\u8005</dfn>\uff1a</dt><dd><a ng-href="/{{ object.target.user.name }}" ng-bind="object.target.user.nickname"></a></dd></dl><dl class="card-section card-section-recommend list-inline" ng-if="object.reason"><dd ng-bind="object.reason"></dd></dl></div><div class="card-extra u-colorGray" ng-if="object.target.klass == \'User\' && object.size == \'large\'"><ul class="card-stats u-cf"><li class="card-stat u-textLeft"><i class="icon-music"></i> <span ng-bind="object.target.music_count"></span></li><li class="card-stat u-textCenter"><i class="icon-person"></i> <span ng-bind="object.target.following_count"></span></li><li class="card-stat u-textRight"><i class="icon-people"></i> <span ng-bind="object.target.followers_count"></span></li></ul><dl class="card-section list-inline u-textTruncate" ng-if="object.target.description"><dt><dfn>\u7b80\u4ecb</dfn>\uff1a</dt><dd ng-bind="object.target.description"></dd></dl><dl class="card-section card-section-recommend list-inline" ng-if="object.reason"><dd ng-bind="object.reason"></dd></dl></div></article></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/partials/flashing.html", "<div ng-class=\"dg.layout.current=='2cols' &&\n              'main-outer flash flash-' + flash.category ||\n              'flash flash-' + flash.category\" ng-repeat=\"flash in dg.flash.messages\"><span ng-bind=\"flash.content\"></span></div>");
    $templateCache.put("views/partials/follow.html", '<a class="btn btn-small btn-follow" ng-hide="session.currentUser.id == target.id" ng-click="toggleFollow()" ng-class="{\'btn-reverse\': !target.is_following, \'btn-unfollow\': target.is_following}"></a>');
    $templateCache.put("views/partials/header-1col.html", '<header class="u-marginBl u-textCenter"><a class="logo u-circle u-inlineBlock" href="/"></a></header>');
    $templateCache.put("views/partials/hint/hint-comment.html", '<p>\u6ca1\u6709\u65b0\u901a\u77e5, \u53bb <a href="/music/new">\u4e0a\u4f20\u97f3\u4e50</a> , \u83b7\u5f97\u66f4\u591a\u7684\u8bc4\u8bba\uff01</p>');
    $templateCache.put("views/partials/hint/hint-follow.html", '<p>\u6ca1\u6709\u65b0\u901a\u77e5, \u53bb <a href="/music/new">\u4e0a\u4f20\u97f3\u4e50</a> , \u83b7\u5f97\u66f4\u591a\u5173\u6ce8\uff01</p>');
    $templateCache.put("views/partials/hint/hint-home.html", '<div><p>\u4f60\u8fd8\u6ca1\u6709\u5173\u6ce8\u4efb\u4f55\u4eba\uff0c</p><p>\u5feb\u5230\u63a2\u7d22\u9875\uff0c\u53d1\u73b0\u66f4\u591a\u7cbe\u5f69\u5427\uff01</p><a class="btn btn-medium btn-reverse u-marginTm btn-widthL" href="/explore">\u8fdb\u5165\u63a2\u7d22</a></div>');
    $templateCache.put("views/partials/hint/hint-like.html", '<p>\u6ca1\u6709\u65b0\u901a\u77e5, \u53bb <a href="/music/new">\u4e0a\u4f20\u97f3\u4e50</a> , \u83b7\u5f97\u66f4\u591a\u7684\u8d5e\uff01</p>');
    $templateCache.put("views/partials/hint/hint-messageList.html", "<p>\u6ca1\u6709\u65b0\u901a\u77e5</p>");
    $templateCache.put("views/partials/hint/hint-search.html", '<div class="u-textBreak"><i class="icon-eye u-colorBlue"></i> \u62b1\u6b49\uff0c\u672a\u627e\u5230\u4e0e\u641c\u7d22\u6761\u4ef6\u76f8\u5173\u7684\u5185\u5bb9</div>');
    $templateCache.put("views/partials/hint/hint-userActivity.html", '<p>\u6ca1\u6709\u66f4\u591a\u5185\u5bb9 <span ng-if="dg.session.currentUser.id === ctrl.user.id">, \u53bb <a href="/explore">\u8d5e</a> \u66f4\u591a\u97f3\u4e50\u5427\uff01</span></p>');
    $templateCache.put("views/partials/hint/hint-userFollow.html", "<p>\u6ca1\u6709\u66f4\u591a\u5185\u5bb9</p>");
    $templateCache.put("views/partials/hint/hint-userInfo.html", '<div ng-if="dg.session.currentUser.id != ctrl.user.id"><p class="u-colorGray u-textCenter" ng-if="!ctrl.user.personal_page">\u8be5\u7528\u6237\u8fd8\u6ca1\u586b\u5199\u8be6\u7ec6\u4fe1\u606f</p><p ng-if="ctrl.user.personal_page" ng-bind-html="ctrl.user.personal_page_html"></p></div><div ng-if="dg.session.currentUser.id == ctrl.user.id"><div ng-if="!ctrl.isEditing"><p class="u-colorGray u-textCenter" ng-if="!ctrl.user.personal_page">\u9a6c\u4e0a <a ng-click="ctrl.editInfo()">\u7f16\u8f91\u8be6\u7ec6\u4fe1\u606f</a>\uff0c\u8ba9\u522b\u4eba\u4e86\u89e3\u4f60\u66f4\u591a</p><p ng-if="ctrl.user.personal_page" ng-bind-html="ctrl.user.personal_page_html"></p></div></div>');
    $templateCache.put("views/partials/hint/hint-userMusic.html", '<p>\u6ca1\u6709\u66f4\u591a\u5185\u5bb9 <span ng-if="dg.session.currentUser.id === ctrl.user.id">, \u53bb <a href="/music/new">\u4e0a\u4f20\u97f3\u4e50</a> \u5427\uff01</span></p>');
    $templateCache.put("views/partials/hint/hint-userPosts.html", '<p>\u6ca1\u6709\u66f4\u591a\u5185\u5bb9 <span ng-if="dg.session.currentUser.id === ctrl.user.id">, \u53bb <a href="/posts/new">\u53d1\u5e03\u4fe1\u606f</a> \u5427\uff01</span></p>');
    $templateCache.put("views/partials/notification.html", '<div class="u-cf" ng-switch="object.operation"><div class="thing u-cf"><span class="thing-highlight" ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-click="notification.markAsRead(object.id)" ng-switch-when="follow"><img class="avatar" alt="{{ object.actor.nickname }}" width="30" height="30" dg-image="{{ object.actor.avatars.origin }}"></a> <a ng-href="/{{ object.actor.name }}" ng-switch-default=""><img class="avatar" alt="{{ object.actor.nickname }}" width="30" height="30" dg-image="{{ object.actor.avatars.origin }}"></a></span><div class="thing-well"><span ng-switch="object.operation"><a ng-href="/{{ object.actor.name }}" ng-switch-when="follow" ng-click="notification.markAsRead(object.id)"><span ng-bind="object.actor.nickname"></span></a> <a ng-href="/{{ object.actor.name }}" ng-switch-default=""><span ng-bind="object.actor.nickname"></span></a></span> <span ng-switch-when="message">\u79c1\u4fe1\u4e86\u4f60\uff1a <a ng-href="/connect/message/{{ object.actor.name }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="follow">\u5173\u6ce8\u4e86\u4f60</span> <span ng-switch-when="like" ng-switch="object.notifiable.type">\u8d5e\u4e86\u4f60\u7684 <span ng-switch-when="music">\u97f3\u4e50\uff1a <a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch="object.notifiable.type" ng-switch-when="comment">\u8bc4\u8bba\u4e86\u4f60\u7684 <span ng-switch-when="music">\u97f3\u4e50\uff1a <a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post">\u5408\u4f5c\u4fe1\u606f\uff1a <a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch-when="mention" ng-switch="object.notifiable.type">\u5728\u8bc4\u8bba\u4e2d\u63d0\u5230\u4e86\u4f60\uff1a <span ng-switch-when="music"><a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post"><a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span> <span ng-switch-when="reply" ng-switch="object.notifiable.type">\u56de\u590d\u4e86\u4f60\u7684\u8bc4\u8bba\uff1a <span ng-switch-when="music"><a ng-href="/music/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span> <span ng-switch-when="post"><a ng-href="/posts/{{ object.notifiable.id }}" ng-bind="object.notifiable.content" ng-click="notification.markAsRead(object.id)"></a></span></span></div></div></div>');
    $templateCache.put("views/partials/player-global.html", '<div class="main-outer" ng-init="state = dg.playbackState"><div class="player-current u-cf" ng-show="state.expanded"><a class="thing-highlight" title="{{ state.lastMusic.name }}" ng-href="/music/{{ state.lastMusic.id }}"><img class="cover" alt="state.lastMusic.name" width="80" height="80" dg-image="{{ state.lastMusic.covers.origin }}"></a><div class="u-textTruncate"><a class="thing-title" title="{{ state.lastMusic.name }}" ng-href="/music/{{ state.lastMusic.id }}" ng-bind="state.lastMusic.name"></a> <a class="u-table" title="{{ state.lastMusic.user.nickname }}" ng-href="/{{ state.lastMusic.user.name }}" ng-bind="state.lastMusic.user.nickname"></a></div><a class="player-like icon-outer icon-outer-large" ng-click="dg.like.toggle(state.lastMusic)"><i class="icon-circle"></i> <i class="icon-thumbs-up-small" ng-class="{\'u-colorBlue\': state.lastMusic.liked}"></i></a></div><progress-bar percent-loaded="state.getLastSound().percentLoaded" percent-played="state.getLastSound().percentPlayed" on-seek="dg.player.seek(percentOffset)"></progress-bar><div class="player-actions u-cf"><div class="player-controls u-pullLeft"><a class="player-play icon-outer icon-outer-large" ng-class="{\'player-playing\': state.getLastSound().state\n                         == state.states.playing}" ng-click="dg.player.toggle(state.lastMusic)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\':\n                             state.getLastSound().state ==\n                             state.states.playing}"></i></a></div><div class="u-pullRight"><a class="player-expand icon-outer icon-outer-large" ng-click="state.toggleExpandStatus()"><i class="icon-circle"></i> <i class="icon-list" ng-class="{\'u-colorBlue\': state.expanded}"></i></a></div></div></div>');
    $templateCache.put("views/partials/publishing.html", '<a class="btn btn-reverse btn-medium" href="/music/new" l42y-match-path="true" ng-hide="l42y.isPathMatched" ng-if="dg.device.isDesktop()"><i class="icon-music"></i>\u4e0a\u4f20\u97f3\u4e50</a><a class="btn btn-medium" href="/posts/new" l42y-match-path="true" ng-hide="l42y.isPathMatched"><i class="icon-post"></i>\u53d1\u5e03\u4fe1\u606f</a>');
    $templateCache.put("views/partials/sharing.html", '<div class="Arrange Arrange--middle u-paddingVs u-paddingHm" ng-controller="SharingCtrl as sharing"><span class="Arrange-sizeFit u-inline u-colorGray">\u5206\u4eab\u5230\uff1a</span> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'tsina\', sharingThing, sharingThing.$type) }}" dg-icon="weibo" icon-size="26"></a> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'douban\', sharingThing, sharingThing.$type) }}" dg-icon="douban" icon-size="26"></a> <a class="u-inlineBlock u-marginRm Arrange-sizeFit" target="_blank" ng-href="{{ sharing.getLink(\'tqq\', sharingThing, sharingThing.$type) }}" dg-icon="tqq" icon-size="26"></a></div>');
    $templateCache.put("views/partials/taxonomy/category.html", '<dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn ng-bind="taxonomy.taxonomyName"></dfn>\uff1a</dt><dd class="tag-item" ng-repeat="category in taxonomy.taxonomies"><a class="btn-tag" ng-bind="category.name" ng-click="taxonomy.g.activeCategory = category" ng-class="{\'btn-tag-active\': category.id == taxonomy.g.activeCategory.id}"></a></dd></dl><div ng-if="taxonomy.g.activeCategory"><dl class="u-borderB u-paddingLm u-cf" ng-repeat="group in taxonomy.g.activeCategory.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn>\uff1a</dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-click="taxonomy.tag.toggle(tag.slug)" ng-class="{\'btn-tag-active\': taxonomy.tag.isActive(tag.slug)}"></a></dd></dl></div>');
    $templateCache.put("views/partials/taxonomy/tag-group.html", '<dl class="u-paddingLm u-cf"><dt class="tag-header"><dfn ng-bind="taxonomy.taxonomyName"></dfn>\uff1a</dt><dd class="tag-item" ng-repeat="tag in taxonomy.taxonomies"><a class="btn-tag" ng-bind="tag.name" ng-click="taxonomy.tag.toggle(tag.slug)" ng-class="{\'btn-tag-active\': taxonomy.tag.isActive(tag.slug)}"></a></dd></dl>');
    $templateCache.put("views/partials/thing/music.html", '<article class="thing thing-music u-cf"><div class="u-relative u-pullLeft" ng-class="{\'cover-small u-marginRm\': dg.device.isPhone(),\n                   \'cover-medium\': !dg.device.isPhone()}"><a ng-href="/music/{{ thing.id }}" target="_blank"><img class="cover cover-medium" alt="{{ thing.name }}" width="120" height="120" ng-if="!dg.device.isPhone()" dg-image="{{ thing.covers.origin }}"> <img class="cover cover-small" alt="{{ thing.name }}" width="80" height="80" ng-if="dg.device.isPhone()" dg-image="{{ thing.covers.origin }}"></a><div class="player"><a class="thing-play u-circle icon-outer icon-outer-large" ng-click="dg.player.toggle(thing)"><i class="icon-circle"></i> <i class="icon-play" ng-class="{\'icon-pause u-colorBlue\': dg.playbackState.sounds[thing.id].state\n                             == dg.playbackState.states.playing}"></i></a></div></div><div ng-class="{\'thing-well\': !dg.device.isPhone()}"><header class="thing-info thing-separator u-borderB"><div class="u-textTruncate"><a class="thing-title" ng-href="/music/{{ thing.id }}" target="_blank" ng-bind="thing.name"></a></div><div class="u-textTruncate"><a ng-href="/{{ thing.user.name }}" target="_blank" ng-bind="thing.user.nickname"></a></div></header><footer class="thing-actions u-cf" ng-if="thing.published"><a class="btn btn-action btn-large btn-like thing-action" ng-click="dg.like.toggle(thing)" ng-class="{\'btn-unlike\': thing.liked}"><i class="icon-thumbs-up"></i> <small ng-bind="thing.like_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-if="!hideExtraButton" ng-class="{\'btn-highlight\': actionType === \'comment\' && extendedStatus === true}" ng-click="dispatch(\'comment\')"><i class="icon-comment"></i> <span ng-hide="thing.comments_count">\u8bc4\u8bba</span> <small ng-show="thing.comments_count" ng-bind="thing.comments_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-if="!hideExtraButton" ng-class="{\'btn-highlight\': actionType === \'sharing\' && extendedStatus === true}" ng-click="dispatch(\'sharing\')"><i class="icon-share"></i>\u5206\u4eab</a></footer></div></article>');
    $templateCache.put("views/partials/thing/post-excerpt.html", '<article class="thing thing-post u-cf"><div class="thing-info u-borderB"><header class="u-cf"><div class="u-pullLeft"><a class="thing-title" ng-href="/posts/{{ thing.id }}" target="_blank" ng-bind="thing.title"></a><ul class="separated u-colorGray"><li class="u-inline" ng-repeat="tag in thing.tags"><a ng-href="/search?q=%23{{ tag.slug }}" ng-bind="tag.name"></a></li></ul></div></header><div class="thing-content post-content-excerpt u-marginTl u-textBreak" ng-bind="thing.content"></div></div><footer><div class="thing-actions" ng-if="!hideExtraButton"><a class="btn btn-large btn-action thing-action" ng-class="{\'btn-highlight\': actionType === \'comment\' && extendedStatus === true}" ng-click="dispatch(\'comment\', \'post\')"><i class="icon-comment"></i> <span ng-hide="thing.comments_count">\u8bc4\u8bba</span> <small ng-show="thing.comments_count" ng-bind="thing.comments_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-class="{\'btn-highlight\': actionType === \'sharing\' && extendedStatus === true}" ng-click="dispatch(\'sharing\', \'post\')"><i class="icon-share"></i>\u5206\u4eab</a></div></footer></article>');
    $templateCache.put("views/partials/thing/post.html", '<article class="thing thing-post u-cf"><div class="thing-info u-borderB"><header class="u-cf"><div class="u-pullLeft"><a class="thing-title" ng-href="/posts/{{ thing.id }}" target="_blank" ng-bind="thing.title"></a><ul class="separated u-colorGray"><li class="u-inline" ng-repeat="tag in thing.tags"><a ng-href="/search?q=%23{{ tag.slug }}" ng-bind="tag.name"></a></li></ul></div></header><div class="thing-content u-marginTl u-textBreak" ng-bind-html="thing.content_html"></div></div><footer><div class="thing-actions" ng-if="!hideExtraButton"><a class="btn btn-large btn-action thing-action" ng-class="{\'btn-highlight\': actionType === \'comment\' && extendedStatus === true}" ng-click="dispatch(\'comment\', \'post\')"><i class="icon-comment"></i> <span ng-hide="thing.comments_count">\u8bc4\u8bba</span> <small ng-show="thing.comments_count" ng-bind="thing.comments_count"></small></a> <a class="btn btn-action btn-large thing-action" ng-class="{\'btn-highlight\': actionType === \'sharing\' && extendedStatus === true}" ng-click="dispatch(\'sharing\', \'post\')"><i class="icon-share"></i>\u5206\u4eab</a></div></footer></article>');
    $templateCache.put("views/partials/thing/user.html", '<article class="thing thing-user u-cf"><a class="thing-highlight" ng-href="/{{ thing.name }}" target="_blank"><img class="avatar" width="40" height="40" dg-image="{{ thing.avatars.origin }}"></a> <i class="u-pullRight" dg-follow="thing"></i><div class="thing-info"><a ng-href="/{{ thing.name }}" target="_blank" ng-bind="thing.nickname"></a><dl class="list-inline"><dt ng-if="thing.city || thing.province"><dfn>\u5730\u533a</dfn>\uff1a</dt><dd ng-if="thing.city || thing.province"><a ng-href="/search?q=%23{{ thing.city.slug || thing.province.slug }}" ng-bind="thing.city.name || thing.province.name"></a></dd></dl><dl class="thing-user-domains-separated list-inline"><dt ng-if="thing.identity || thing.domains"><dfn>\u8eab\u4efd</dfn>\uff1a</dt><dd ng-if="thing.identity && !thing.domains.length>0"><a ng-href="/search?q=%23{{ thing.identity.slug }}" ng-bind="thing.identity.name"></a></dd><dd ng-if="thing.domains" ng-repeat="tag in thing.domains"><a ng-href="/search?q=%23{{ tag.slug }}" ng-bind="tag.name"></a></dd></dl></div></article>');
    $templateCache.put("views/partials/tracker/input.html", '<div class="tracker-input"><i class="tracker-spinner" ng-show="tracker.active()" ng-show="!isHidden"></i> <span class="icon-ok-circle u-colorGreen" ng-show="onSuccess"></span> <span class="icon-cancel-circle u-colorRed" ng-show="onFailure"></span></div>');
    $templateCache.put("views/partials/tracker/objects.html", '<div class="tracker" ng-hide="isHidden"><i class="tracker-spinner spinner" ng-show="tracker.active()"></i><div class="tracker-notice" ng-show="onLastPage">\u5df2\u7ecf\u5230\u6700\u540e\u4e00\u9875\u5566</div></div>');
    $templateCache.put("views/partials/tracker/session.html", '<div class="tracker" ng-hide="isHidden"><i class="tracker-spinner spinner" ng-show="tracker.active()"></i></div>');
    $templateCache.put("views/partials/uploading/dragndrop.html", '<div class="uploading"><div class="uploading-dnd u-cf" dg-uploader-dnd=""><div ng-transclude="" ng-show="uploadState==\'normal\'"></div><div class="uploading-info"><div class="uploading-message" ng-if="uploadType == \'audio\'"><div class="uploading-icon" ng-class="\'uploading-icon-\' + uploadType"></div></div><div class="uploading-message-outer u-isHidden" ng-show="uploadState==\'normal\'"><div class="uploading-message-bg"></div><div class="uploading-message"><span class="u-colorGray"><span ng-if="supportFeatures.dragndrop">\u5c06\u6587\u4ef6\u62d6\u653e\u5230\u8fd9\u91cc\u6216</span> \u70b9\u51fb\u4e0b\u65b9\u7684\u6309\u94ae\u4e0a\u4f20\u6587\u4ef6</span><p class="u-colorGray" ng-if="uploadType == \'image\'">\u8bf7\u4e0a\u4f20\u5c3a\u5bf8\u5927\u4e8e 240x240 \u7684\u56fe\u7247</p></div></div><div class="progress-outer uploading-progress" ng-show="uploadState==\'uploading\'"><div class="progress"></div><div class="progress progress-playing" ng-style="{\'width\': percentUploaded}"></div></div><span class="uploading-message u-colorGray" ng-if="uploadState==\'success\' || uploadState==\'failed\'"><div class="uploading-message-success" ng-if="uploadState==\'success\'"><div class="uploading-icon"></div><span ng-bind-template="{{ uploadThing }}\u4e0a\u4f20\u6210\u529f\uff01"></span></div><div class="uploading-message-fail" ng-if="uploadState==\'failed\'"><div class="uploading-icon uploading-icon-fail"></div><span ng-bing-template="{{ uploadThing }}\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u4e0a\u4f20"></span></div></span></div></div><div class="uploading-select"><a class="btn btn-medium btn-reverse" ng-hide="uploadState==\'uploading\'" ng-bind-template="\u4e0a\u4f20{{ uploadThing }}"></a> <span class="btn btn-medium" ng-if="uploadState==\'uploading\'" ng-bind-template="\u4e0a\u4f20{{ uploadThing }}\u4e2d"></span></div></div>');
    $templateCache.put("views/partials/uploading/insert.html", '<span class="icon-image btn-right"><a ng-hide="uploadState==\'uploading\'">\u63d2\u5165\u56fe\u7247</a> <span ng-if="uploadState==\'uploading\'">\u4e0a\u4f20\u56fe\u7247\u4e2d {{percentUploaded}}</span> <span ng-if="uploadState==\'failed\'">\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u4e0a\u4f20</span></span>');
    $templateCache.put("views/partials/user-info.html", '<div class="u-textCenter" itemscope="" itemtype="http://schema.org/Person"><a title="{{ ctrl.user.nickname }}" ng-href="/{{ ctrl.user.name }}"><img class="avatar avatar-large u-marginBm" alt="{{ ctrl.user.nickname }}" width="80" height="80" itemprop="image" dg-image="{{ ctrl.user.avatars.origin }}"><div class="u-fontSizeL u-marginBm" itemprop="name" ng-bind="ctrl.user.nickname"></div></a><div class="u-marginBm" ng-if="ctrl.user"><i dg-follow="ctrl.user"></i> <a class="btn btn-small btn-message u-marginLm" ng-href="/connect/message/{{ ctrl.user.name }}" ng-if="dg.session.currentUser && dg.session.currentUser.id != ctrl.user.id">\u79c1\u4fe1</a></div><div class="u-marginBm" ng-if="ctrl.user"><a class="btn btn-small" href="/settings/profile" ng-if="dg.session.currentUser.id == ctrl.user.id"><i class="icon-profile"></i>\u66f4\u6539\u4e2a\u4eba\u8d44\u6599</a></div><ul class="separated list-inline"><li ng-if="ctrl.user.city || ctrl.user.province"><a itemprop="addressLocality" ng-if="ctrl.user.city || ctrl.user.province" ng-href="/search?q=%23{{ ctrl.user.city.slug || ctrl.user.province.slug }}" ng-bind="ctrl.user.city.name || ctrl.user.province.name"></a></li><li ng-if="ctrl.user.identity && !ctrl.user.domains.length>0"><a ng-href="/search?q=%23{{ ctrl.user.identity.slug }}" ng-bind="ctrl.user.identity.name"></a></li><li ng-if="ctrl.user.domains" ng-repeat="tag in ctrl.user.domains" class="separated"><a ng-href="/search?q=%23{{ tag.slug }}" ng-bind="tag.name"></a></li></ul><ul class="separated list-inline"><li itemprop="description" ng-if="ctrl.user.description" ng-bind="ctrl.user.description"></li></ul><dl class="separated list-inline"><dt ng-if="ctrl.user.following_count"><dfn>\u5173\u6ce8</dfn>\uff1a</dt><dd ng-if="ctrl.user.following_count"><a ng-href="/{{ ctrl.user.name }}/following" ng-bind="ctrl.user.following_count"></a></dd><dt ng-if="ctrl.user.followers_count"><dfn>\u7c89\u4e1d</dfn>\uff1a</dt><dd ng-if="ctrl.user.followers_count"><a ng-href="/{{ ctrl.user.name }}/followers" ng-bind="ctrl.user.followers_count"></a></dd><dt ng-if="ctrl.user.music_count"><dfn>\u97f3\u4e50</dfn>\uff1a</dt><dd ng-if="ctrl.user.music_count"><a ng-href="/{{ ctrl.user.name }}/music" ng-bind="ctrl.user.music_count"></a></dd></dl><ul class="ButtonGroup ButtonGroup--hz u-marginTm"><li class="ButtonGroup-item" ng-if="ctrl.user.sns.weibo"><a class="Button" ng-href="{{ ctrl.user.sns.weibo.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="weibo" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="ctrl.user.sns.douban"><a class="Button" ng-href="{{ ctrl.user.sns.douban.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="douban" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="ctrl.user.sns.tqq"><a class="Button" ng-href="{{ ctrl.user.sns.tqq.link }}" rel="nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="tqq" icon-size="30"></i></a></li><li class="ButtonGroup-item" ng-if="ctrl.user.website"><a class="Button" itemprop="url" ng-href="{{ ctrl.user.website }}" rel="me nofollow" target="_blank"><i class="u-inlineBlock" dg-icon="link" icon-size="30"></i></a></li></ul></div>');
    $templateCache.put("views/post/new.html", '<form class="streams" name="postForm" ng-submit="newPost.submit()"><label class="form-field">\u6807\u9898\uff1a <span class="input-message input-error" ng-if="newPost.errors.title" ng-bind="newPost.errors.title.message"></span><input class="u-sizeFull" type="text" name="title" ng-model="newPost.post.title" ng-change="newPost.errors.title = null" ng-maxlength="40" placeholder="\u8bf7\u8f93\u5165 40 \u5b57\u4ee5\u5185\u7684\u6807\u9898"></label><div class="form-field form-textarea Box--small"><label class="textarea-header Box-header u-bgBlue" for="content">\u6b63\u6587\uff1a <span class="input-message input-error" ng-if="newPost.errors.content" ng-bind="newPost.errors.content.message"></span><dg-uploader template-name="insert" upload-type="image" upload-callback="newPost.insertImg(\'content\', url)" upload-folder="posts"></dg-uploader></label><textarea id="content" cols="10" rows="15" name="content" ng-model="newPost.post.content" ng-change="newPost.errors.content = null">\n        </textarea></div><div class="form-field Box u-paddingBn"><dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn>\u5206\u7c7b</dfn>\uff1a <span class="input-message input-error" ng-if="newPost.errors.category" ng-bind="newPost.errors.category.message"></span></dt><dd class="tag-item" ng-repeat="category in newPost.categories"><a class="btn-tag" ng-bind="category.name" ng-click="newPost.activeCategory = category;newPost.errors.category = null" ng-class="{\'btn-tag-active\': category.id == newPost.activeCategory.id}"></a></dd></dl><dl class="u-borderB u-paddingLm u-cf" ng-init="group.activeTags = []" ng-repeat="group in newPost.activeCategory.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn> <span ng-if="group.multi_selectable">\uff08\u591a\u9009\uff09</span>\uff1a <span class="input-message input-error" ng-if="newPost.errors.tags && !group.activeTags.length" ng-bind="newPost.errors.tags.message"></span></dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-init="newPost.taxonomy.initActiveTags(tag, group, newPost.post.tags)" ng-click="newPost.taxonomy.selectTag(tag, group)" ng-class="{\'btn-tag-active\': newPost.taxonomy.isTagActive(tag, group.activeTags)}"></a></dd></dl></div><div class="u-paddingTl"><span class="btn-outer"><button class="btn btn-medium btn-reverse u-paddingHl" type="submit">\u63d0\u4ea4</button> <i dg-tracker="updating" type="input"></i></span></div></form>');
    $templateCache.put("views/post/post.html", '<div class="streams" ng-if="post"><div class="u-marginBm u-relative u-cf"><div class="activity-context u-pullLeft"><a class="u-pullLeft u-marginRm" title="{{ post.user.nickname }}" ng-href="/{{ post.user.name }}"><img class="avatar" width="40" height="40" dg-image="{{ post.user.avatars.origin }}"></a><div class="u-pullLeft u-colorGray"><p>\u7531 <a title="{{ post.user.nickname }}" ng-bind="post.user.nickname" ng-href="/{{ post.user.name }}"></a> \u53d1\u5e03</p><time datetime="{{ post.created_at }}"></time></div></div><div class="activity-actions" ng-if="post.own"><a class="btn btn-small" ng-href="/posts/{{ post.id }}/update">\u7f16\u8f91</a></div></div><div class="thing-outer" ng-if="post" ng-init="thing = post; hideExtraButton = true;"><div ng-include="\'views/partials/thing/post.html\'"></div></div><div class="Box u-marginTl" ng-init="sharingThing = post; sharingThing.$type = \'post\';" ng-include="\'views/partials/sharing.html\'"></div><div class="conversation-outer"><i dg-comment="{{ post.id }}" host-type="post"></i></div></div>');
    $templateCache.put("views/post/posts.html", '<div class="u-marginBl" ng-if="dg.device.isDesktop()"><div ng-include="\'views/home/banner.html\'"></div></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="posts.getObjects()" infinite-scroll-disabled="posts.query.paused" infinite-scroll-distance="1"><div class="Box u-marginTm" dg-taxonomy="posts/categories" taxonomy-name="\u5206\u7c7b" ng-include="\'views/partials/taxonomy/category.html\'"></div><div class="cards u-cf"><article class="card" ng-init="post = object" ng-repeat="object in posts.objects"><div ng-include="\'views/partials/card/post.html\'"></div></article></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/search/filter.html", '<div class="tabs-outer tabs-4cols" ng-controller="SearchMatchingCtrl as match"><a class="tab" ng-if="!search.g.searchString" ng-href="{{ dg.session.currentUser ? \'/explore\' : \'/\' }}" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-stats"></i> \u63a8\u8350</a> <a class="tab" ng-if="search.g.searchString" ng-click="match.location.search(\'type\', null);\n                 search.g.activeCategory = null" ng-class="{\'tab-current\': match.test(\'type\')}"><i class="icon-stats"></i> \u5168\u90e8</a> <a class="tab" ng-click="match.location.search(\'type\', \'music\');\n                 search.g.activeCategory = null" ng-class="{\'tab-current\': match.test(\'type\', \'music\')}"><i class="icon-music"></i> \u97f3\u4e50</a> <a class="tab" ng-click="match.location.search(\'type\', \'user\');\n                 search.g.activeCategory = null" ng-class="{\'tab-current\': match.test(\'type\', \'user\')}"><i class="icon-person"></i> \u7528\u6237</a> <a class="tab" ng-click="match.location.search(\'type\', \'post\');\n                 search.g.activeCategory = null" ng-class="{\'tab-current\': match.test(\'type\', \'post\')}"><i class="icon-post"></i> \u5408\u4f5c\u4fe1\u606f</a></div>');
    $templateCache.put("views/search/search.html", '<div class="streams" infinite-scroll="search.getObjects()" infinite-scroll-disabled="search.query.paused" infinite-scroll-distance="1"><div ng-include="\'views/search/filter.html\'"></div><form class="u-marginTm" id="searchForm" ng-submit="search.getObjects(true)"><input class="u-sizeFull" id="q" type="text" name="q" placeholder="\u8f93\u5165\u641c\u7d22\u5b57\u8bcd\u5e76\u56de\u8f66" x-webkit-speech="" x-webkit-grammar="builtin:translate" ng-if="!search.isTag()" ng-model="search.g.searchString"><div class="input-search u-cf" ng-if="search.isTag()"><span class="Tag Tag--blue Tag--input u-marginRm u-marginTm" ng-click="search.tag.remove(tag.slug)" ng-repeat="tag in search.tags">{{ tag.name }} <small>x</small></span></div></form><div ng-if="search.type == \'music\'"><div class="Box u-marginTm"><div dg-taxonomy="music/types" taxonomy-name="\u7c7b\u578b" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div><div class="u-borderT" dg-taxonomy="music/genres" taxonomy-name="\u66f2\u98ce" ng-include="\'views/partials/taxonomy/tag-group.html\'"></div></div></div><div ng-if="search.type == \'user\'"><div class="Box u-marginTm" dg-taxonomy="users/identities" taxonomy-name="\u5206\u7c7b" ng-include="\'views/partials/taxonomy/category.html\'"></div></div><div ng-if="search.type == \'post\'"><div class="Box u-marginTm" dg-taxonomy="posts/categories" taxonomy-name="\u5206\u7c7b" ng-include="\'views/partials/taxonomy/category.html\'"></div></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="search.isDataEmpty" ng-init="hintType = \'search\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="u-marginVl" ng-repeat="thing in search.objects" ng-controller="ActionCtrl"><div class="Box u-paddingAm" ng-if="thing.klass == \'User\' || search.type == \'user\'"><div ng-include="\'views/partials/thing/user.html\'"></div></div><div ng-if="thing.klass == \'Post\' || search.type == \'post\'" class="thing-outer"><div ng-include="\'views/partials/thing/post-excerpt.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="Box u-marginTl" ng-init="sharingThing = actionTarget; sharingThing.$type = \'post\'" ng-include="\'views/partials/sharing.html\'"></div></div></div></div><div class="thing-outer" ng-if="thing.klass == \'Music\' || search.type == \'music\'"><div ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="Box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!search.isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/setting/account.html", '<div class="streams"><form class="form-field u-borderB u-paddingTm" name="notifForm" ng-submit="setting.submitNotif()">\u90ae\u4ef6\u901a\u77e5\u8bbe\u7f6e\uff1a<label class="input-outer"><input class="u-marginRs" type="checkbox" name="followed_notification" ng-model="setting.notification.followed_notification">\u65b0\u7684\u5173\u6ce8</label><label class="input-outer"><input class="u-marginRs" type="checkbox" name="message_notification" ng-model="setting.notification.message_notification">\u65b0\u7684\u79c1\u4fe1</label><label class="input-outer"><input class="u-marginRs" type="checkbox" name="comment_notification" ng-model="setting.notification.comment_notification">\u65b0\u7684\u8bc4\u8bba</label><button class="btn btn-medium btn-reverse u-marginTm" type="submit">\u66f4\u6539\u90ae\u4ef6\u901a\u77e5\u8bbe\u7f6e</button></form><form class="form-field u-borderB u-paddingTm" name="nameForm" ng-submit="setting.submit(\'name\')"><label>\u4e2a\u6027\u57df\u540d\uff1a <span class="input-message input-error" ng-if="setting.errors.name" ng-bind="setting.errors.name.message"></span><div class="input-outer"><input id="name" type="text" name="name" ng-model="setting.user.name" ng-change="setting.errors.name = null" ng-required="true"></div></label><label class="u-colorGray" for="name" ng-bind-template="{{ dg.location.host() }}/{{ setting.user.name }}"></label><button class="btn btn-medium btn-reverse" type="submit">\u66f4\u6539\u4e2a\u6027\u57df\u540d</button></form><form class="form-field u-borderB u-paddingTm" name="emailForm" ng-submit="emailForm.$valid && setting.submit([\'email\',\'current_password\'])"><label>\u66f4\u6539\u90ae\u7bb1\uff1a <span class="input-message input-error" ng-if="setting.errors.email" ng-bind="setting.errors.email.message"></span><div class="input-outer"><input type="email" name="email" placeholder="\u8bf7\u8f93\u5165\u65b0\u90ae\u7bb1" ng-model="setting.user.email" ng-change="setting.errors.email = null"></div></label><div ng-show="emailForm.$dirty"><label class="input-outer">\u5f53\u524d\u5bc6\u7801\uff1a <span class="input-message input-error" ng-if="setting.errors.current_password" ng-bind="setting.errors.current_password.message"></span><input type="password" name="current_password" ng-model="setting.user.current_password" ng-change="setting.errors.current_password = null" placeholder="\u9a8c\u8bc1\u5f53\u524d\u5bc6\u7801\u540e\u5373\u53ef\u66f4\u6539\u90ae\u7bb1"></label><div class="u-paddingTl"><button class="btn btn-medium btn-reverse" type="submit">\u66f4\u6539\u90ae\u7bb1</button></div></div></form><form class="form-field u-paddingTm" name="passwordForm" ng-submit="setting.submit([\'password\',\'password_confirmation\',\'current_password\'])"><label>\u66f4\u6539\u5bc6\u7801\uff1a <span class="input-message input-error" ng-if="setting.errors.password" ng-bind="setting.errors.password.message"></span><div class="input-outer"><input type="password" name="password" ng-model="setting.user.password" ng-change="setting.errors.password = null" placeholder="\u8bf7\u8f93\u5165\u65b0\u5bc6\u7801"></div></label><div ng-show="passwordForm.$dirty"><label class="input-outer">\u786e\u8ba4\u65b0\u5bc6\u7801\uff1a <span class="input-message input-error" ng-if="setting.errors.password_confirmation" ng-bind="setting.errors.password_confirmation.message"></span><input type="password" name="password_confirmation" ng-model="setting.user.password_confirmation" ng-change="setting.errors.password = null" placeholder="\u518d\u6b21\u8f93\u5165\u65b0\u5bc6\u7801"></label><label class="input-outer">\u5f53\u524d\u5bc6\u7801\uff1a <span class="input-message input-error" ng-if="setting.errors.current_password" ng-bind="setting.errors.current_password.message"></span><input type="password" name="current_password" ng-model="setting.user.current_password" ng-change="setting.errors.current_password = null" placeholder="\u9a8c\u8bc1\u5f53\u524d\u5bc6\u7801\u540e\u5373\u53ef\u66f4\u6539\u5bc6\u7801"></label><div class="u-paddingTl"><button class="btn btn-medium btn-reverse" type="submit">\u66f4\u6539\u5bc6\u7801</button></div></div></form><i dg-tracker="session"></i></div>');
    $templateCache.put("views/setting/profile.html", '<div class="streams"><form class="setting" name="profile" ng-submit="setting.submit()"><label class="form-field u-cf u-table"><i dg-uploader="" upload-type="image" upload-folder="avatars" upload-thing="\u5934\u50cf" target-model="setting.user.avatar"><img class="image-original" width="240" height="240" dg-image="{{ setting.user.avatar || setting.user.avatars.origin }}" ng-model="setting.user.avatar"></i></label><input class="u-isHidden" type="text" name="avatar" ng-model="setting.user.avatar"><label class="form-field">\u7528\u6237\u6635\u79f0\uff1a <span class="input-messages"><span class="input-message input-error" ng-if="setting.errors.nickname" ng-bind="setting.errors.nickname.message"></span></span><div class="input-outer"><input type="text" name="nickname" ng-required="true" ng-model="setting.user.nickname" ng-change="setting.errors.nickname = null"></div></label><label class="form-field">\u4e2a\u4eba\u7f51\u7ad9\uff1a <span class="input-messages"><span class="input-message input-error" ng-show="profile.website.$error.url"></span></span><div class="input-outer"><input type="text" name="website" ng-model="setting.user.website"></div></label><label class="form-field">\u4e2a\u4eba\u7b80\u4ecb\uff1a<div class="input-outer"><input type="text" name="description" ng-model="setting.user.description"></div></label><div class="form-field user-area"><div class="input-outer">\u5730\u533a\uff1a</div><select name="province" ng-model="setting.user.province.id" ng-change="setting.changeProvince(setting.user.province.id, setting.areas);\n                               setting.resetSelectedCity()" ng-options="area.id as area.name\n                                for area in setting.areas"></select><select name="city" ng-if="setting.cities" ng-model="setting.user.city.id" ng-options="city.id as city.name\n                                for city in setting.cities"></select></div><div class="form-field Box u-paddingBn"><dl class="u-borderB u-paddingLm u-cf"><dt class="tag-header"><dfn>\u8eab\u4efd</dfn>\uff1a</dt><dd class="tag-item" ng-repeat="identity in setting.identities"><a class="btn-tag" ng-bind="identity.name" ng-click="setting.changeIdentityClick(identity, setting.identities)" ng-class="{\'btn-tag-active\': identity.id == setting.activeIdentity.id}"></a></dd></dl><dl class="u-borderB u-paddingLm u-cf" ng-repeat="group in setting.activeIdentity.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn> <span ng-if="group.multi_selectable">\uff08\u591a\u9009\uff09</span>\uff1a</dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-init="setting.taxonomy.initActiveTags(tag, group, setting.user.domains)" ng-click="setting.taxonomy.selectTag(tag, group)" ng-class="{\'btn-tag-active\': setting.taxonomy.isTagActive(tag, group.activeTags)}"></a></dd></dl></div><div class="u-paddingTl u-borderT"><button class="btn btn-medium btn-reverse" type="submit">\u63d0\u4ea4\u66f4\u6539</button></div></form><div class="u-marginTl u-marginBs">\u7ed1\u5b9a\u8d26\u53f7\uff1a</div><ul class="list-sns" ng-if="setting.user"><li class="u-paddingVm u-borderB u-cf"><i class="u-inlineBlock u-alignMiddle u-marginRs" dg-icon="weibo" icon-size="20"></i> <a ng-if="!setting.user.sns.weibo" ng-href="/users/auth/weibo" target="_self">\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\u5e10\u53f7</a> <span ng-if="setting.user.sns.weibo">\u5df2\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\u5e10\u53f7 <a class="u-pullRight" ng-href="/accounts/authentications/unbind/weibo" target="_self">\u53d6\u6d88\u7ed1\u5b9a</a></span></li><li class="u-paddingVm u-borderB u-cf"><i class="u-inlineBlock u-alignMiddle u-marginRs" dg-icon="tqq" icon-size="20"></i> <a ng-if="!setting.user.sns.tqq" ng-href="/users/auth/tqq" target="_self">\u7ed1\u5b9a\u817e\u8baf\u5fae\u535a\u5e10\u53f7</a> <span ng-if="setting.user.sns.tqq">\u5df2\u7ed1\u5b9a\u817e\u8baf\u5fae\u535a\u5e10\u53f7 <a class="u-pullRight" ng-href="/accounts/authentications/unbind/tqq" target="_self">\u53d6\u6d88\u7ed1\u5b9a</a></span></li><li class="u-paddingVm u-borderB u-cf"><i class="u-inlineBlock u-alignMiddle u-marginRs" dg-icon="douban" icon-size="20"></i> <a ng-if="!setting.user.sns.douban" ng-href="/users/auth/douban" target="_self">\u7ed1\u5b9a\u8c46\u74e3\u5e10\u53f7</a> <span ng-if="setting.user.sns.douban">\u5df2\u7ed1\u5b9a\u8c46\u74e3\u5e10\u53f7 <a class="u-pullRight" ng-href="/accounts/authentications/unbind/douban" target="_self">\u53d6\u6d88\u7ed1\u5b9a</a></span></li></ul><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/user/auth/login.html", '<form class="streams" name="loginForm" novalidate="" ng-submit="login.submitLogin()"><label class="form-field">\u90ae\u7bb1 <span class="input-message input-error" ng-if="login.errors.email" ng-bind="login.errors.email.message"></span><input type="email" ng-model="login.user.email" ng-change="login.errors.email = null"></label><label class="form-field">\u5bc6\u7801 <span class="input-message input-error" ng-if="signup.errors.password" ng-bind="signup.errors.password"></span><input type="password" ng-model="login.user.password" ng-change="signup.errors.password = null"></label><button class="btn btn-medium btn-reverse u-paddingHl" type="submit">\u767b\u5f55</button> <a class="u-colorGray u-fontSizeS u-marginLm btn-medium" href="/password/lost">\u5fd8\u8bb0\u5bc6\u7801\uff1f</a><ul class="list-sns u-marginTl" ng-include="\'views/user/auth/social-login.html\'"></ul></form>');
    $templateCache.put("views/user/auth/lost-password.html", '<div class="Layout--1col"><div ng-include="\'views/partials/header-1col.html\'"></div><div class="Box Box--large"><div class="Box-header u-fontSizeXL u-paddingVm">\u5fd8\u8bb0\u5bc6\u7801</div><form class="Box-item" ng-if="!lost.submitSucceed" ng-submit="lost.submit(lost.email)">\u6211\u4eec\u5c06\u5411\u4f60\u7684\u6ce8\u518c\u90ae\u7bb1\u53d1\u9001\u786e\u8ba4\u90ae\u4ef6\uff0c\u70b9\u51fb\u90ae\u4ef6\u4e2d\u7684\u94fe\u63a5\uff0c\u786e\u8ba4\u90ae\u4ef6\u3002<label class="u-marginTs">\u90ae\u7bb1\uff1a <span class="input-message input-error" ng-if="lost.errors.email" ng-bind="lost.errors.email.message"></span><input type="email" name="email" placeholder="\u8bf7\u8f93\u5165\u6ce8\u518c\u90ae\u7bb1" ng-model="lost.email" ng-change="lost.errors.email = null"></label><button class="btn btn-reverse btn-medium u-marginTl u-paddingHl">\u53d1\u9001\u90ae\u4ef6</button></form><div class="Box-item" ng-if="lost.submitSucceed"><div class="u-borderB u-marginBl">\u91cd\u7f6e\u5bc6\u7801\u90ae\u4ef6\u5df2\u7ecf\u53d1\u9001\u5230 {{ lost.email }}, \u8bf7\u6309\u90ae\u4ef6\u4e2d\u7684\u6307\u5f15\u91cd\u7f6e\u4f60\u7684\u5bc6\u7801\u3002<br><a class="btn btn-reverse btn-medium u-paddingHl u-marginVl" ng-href="{{ lost.getEmailDomain(lost.email) }}" target="_blank">\u8fdb\u5165\u90ae\u7bb1</a></div><p>\u6ca1\u6709\u6536\u5230\uff1f <a ng-click="lost.submit(lost.email, true)">\u91cd\u65b0\u53d1\u9001</a> <span class="u-colorGray" ng-if="lost.isSubmitAgain">(\u5df2\u91cd\u65b0\u53d1\u9001)</span></p><p>\u90ae\u7bb1\u8f93\u5165\u9519\u8bef\uff1f <a ng-click="lost.submitSucceed = false">\u8fd4\u56de\u4e0a\u4e00\u6b65</a> \u5e76\u91cd\u65b0\u8f93\u5165\u90ae\u7bb1</p></div><div class="Box-footer u-paddingVs"><a href="/login">\u8fd4\u56de\u767b\u5f55</a></div></div></div>');
    $templateCache.put("views/user/auth/reset-password.html", '<div class="Layout--1col"><div ng-include="\'views/partials/header-1col.html\'"></div><div class="Box Box--large"><div class="Box-header u-fontSizeXL u-paddingVm">\u91cd\u7f6e\u5bc6\u7801</div><form class="Box-item" ng-submit="reset.submit(reset.submitModel)"><label class="u-marginBm">\u65b0\u5bc6\u7801\uff1a <span class="input-message input-error" ng-if="reset.errors.password" ng-bind="reset.errors.password.message"></span><input type="password" name="password" placeholder="\u8bf7\u8f93\u5165\u81f3\u5c11 6 \u4e2a\u5b57\u7b26\u957f\u5ea6\u7684\u65b0\u5bc6\u7801" ng-model="reset.submitModel.password" ng-change="reset.errors.password = null" ng-minlength="6"></label><label class="u-marginBl">\u786e\u8ba4\u5bc6\u7801\uff1a<input type="password" name="password_confirmation" placeholder="\u8bf7\u786e\u8ba4\u4f60\u7684\u65b0\u5bc6\u7801" ng-model="reset.submitModel.password_confirmation" ng-minlength="6"></label><button class="btn btn-reverse btn-medium u-paddingHl" type="submit">\u4fee\u6539\u5bc6\u7801</button></form></div></div>');
    $templateCache.put("views/user/auth/signup.html", '<form class="streams" name="signupForm" novalidate="" ng-submit="signup.submitSignup()"><label class="form-field">\u90ae\u7bb1 <span class="input-message input-error" ng-if="signup.errors.email" ng-bind="signup.errors.email.message"></span><input type="email" name="email" ng-model="signup.user.email" ng-change="signup.errors.email = null"></label><label class="form-field">\u6635\u79f0 <span class="input-message input-error" ng-if="signup.errors.nickname" ng-bind="signup.errors.nickname.message"></span><input type="text" name="nickname" ng-model="signup.user.nickname" ng-change="signup.errors.nickname = null"></label><label class="form-field">\u5bc6\u7801 <span class="input-message input-error" ng-if="signup.errors.password" ng-bind="signup.errors.password.message"></span><input type="password" name="password" ng-model="signup.user.password" ng-change="signup.errors.password = null"></label><button class="btn btn-medium btn-reverse u-paddingHl" type="submit">\u6ce8\u518c</button><ul class="list-sns u-marginTl" ng-include="\'views/user/auth/social-login.html\'"></ul></form>');
    $templateCache.put("views/user/auth/social-login.html", '<li class="u-paddingVm u-borderB"><i class="icon-weibo"></i> <a href="/users/auth/weibo" target="_self">\u65b0\u6d6a\u5fae\u535a\u5e10\u53f7\u767b\u5f55</a></li><li class="u-paddingVm u-borderB"><i class="icon-tqq"></i> <a href="/users/auth/tqq" target="_self">\u817e\u8baf\u5fae\u535a\u5e10\u53f7\u767b\u5f55</a></li><li class="u-paddingVm u-borderB"><i class="icon-douban"></i> <a href="/users/auth/douban" target="_self">\u8c46\u74e3\u5e10\u53f7\u767b\u5f55</a></li>');
    $templateCache.put("views/user/profile/activity.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1" ng-init="ctrl = userActivity"><div class="Box u-paddingVl u-marginBl" ng-if="ctrl.user"><div ng-include="\'views/partials/user-info.html\'"></div></div><div ng-if="ctrl.user"><div ng-include="\'views/user/profile/nav.html\'"></div></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'userActivity\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity-outer" ng-repeat="object in objects"><div ng-include="\'views/partials/activity.html\'"></div></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/user/profile/follow.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1" ng-init="ctrl = userFollow"><div class="Box u-paddingVl u-marginBl" ng-include="\'views/partials/user-info.html\'"></div><div class="tabs-outer tabs-2cols u-cf"><a class="tab" ng-href="/{{ ctrl.user.name }}/following" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path=""><i class="icon-eye"></i>\u5173\u6ce8</a> <a class="tab" ng-href="/{{ ctrl.user.name }}/followers" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path=""><i class="icon-people"></i>\u7c89\u4e1d</a></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'userFollow\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activity" ng-repeat="thing in objects"><div class="thing-outer" ng-include="\'views/partials/thing/user.html\'"></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/user/profile/info.html", '<div class="streams" ng-init="ctrl = userInfo"><div class="Box u-paddingVl u-marginBl" ng-include="\'views/partials/user-info.html\'"></div><div ng-include="\'views/user/profile/nav.html\'"></div><form class="form-field form-textarea Box--small u-marginTl" name="infoForm" ng-submit="userInfo.submit()" ng-show="userInfo.isEditing"><label class="Box-header textarea-header u-bgBlue" for="content">\u7f16\u8f91\u8be6\u7ec6\u4fe1\u606f\uff1a<dg-uploader template-name="insert" upload-type="image" upload-callback="ctrl.insertImg(\'content\', url)" upload-folder="user"></dg-uploader></label><textarea id="content" cols="10" rows="15" name="content" ng-model="userInfo.user.personal_page">\n        </textarea><div class="u-paddingTl u-borderT"><button class="btn btn-medium btn-reverse" type="submit">\u4fdd\u5b58</button></div></form><div class="Box Box--small u-marginTl" ng-init="hintType = \'userInfo\'" ng-show="!userInfo.isEditing"><div class="Box-header u-bgBlue u-cf"><span ng-if="ctrl.user.personal_page">\u8be6\u7ec6\u4fe1\u606f\uff1a</span> <a class="u-pullRight" ng-if="dg.session.currentUser.id == ctrl.user.id && ctrl.user.personal_page" ng-click="ctrl.editInfo()"><i class="icon-edit"></i> \u7f16\u8f91\u8be6\u7ec6\u4fe1\u606f</a></div><div class="u-paddingAm" ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div></div>');
    $templateCache.put("views/user/profile/music.html", '<div class="streams" infinite-scroll="getObjects()" infinite-scroll-disabled="query.paused" infinite-scroll-distance="1" ng-init="ctrl = userMusic"><div class="Box u-paddingVl u-marginBl" ng-include="\'views/partials/user-info.html\'"></div><div ng-include="\'views/user/profile/nav.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="isDataEmpty" ng-init="hintType = \'userMusic\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity" ng-repeat="object in objects" ng-init="thing = object;\n                      thing.$prev = objects[$index - 1];\n                      thing.$next = objects[$index + 1];" ng-controller="ActionCtrl"><div class="u-marginBm u-relative"><div class="activity-context u-colorGray"><time datetime="{{ object.created_at }}"></time></div><div class="activity-actions"><span class="u-inlineBlock u-colorGray"><i class="icon-headphone"></i> <small ng-bind="object.listen_count"></small></span> <span class="u-paddingLm" ng-if="object.own"><a class="btn btn-small" ng-if="!object.published" ng-click="userMusic.music.publish(object)">\u516c\u5f00</a> <a class="btn btn-small" ng-if="dg.device.isDesktop()" ng-href="/music/{{ object.id }}/update">\u7f16\u8f91</a> <a class="btn btn-small" ng-click="userMusic.music.remove(object, objects, \'music\')">\u5220\u9664</a></span></div></div><div class="thing-outer" ng-include="\'views/partials/thing/music.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="Box u-marginTl" ng-init="sharingThing = actionTarget" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/user/profile/nav.html", '<div class="tabs-outer tabs-4cols u-cf"><a class="tab" ng-href="/{{ ctrl.user.name }}" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path="true"><i class="icon-stats"></i>\u52a8\u6001</a> <a class="tab" ng-href="/{{ ctrl.user.name }}/music" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path=""><i class="icon-music"></i>\u97f3\u4e50</a> <a class="tab" ng-href="/{{ ctrl.user.name }}/posts" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path=""><i class="icon-post"></i>\u5408\u4f5c\u4fe1\u606f</a> <a class="tab" ng-href="/{{ ctrl.user.name }}/info" ng-class="{\'tab-current\': l42y.isPathMatched}" l42y-match-path=""><i class="icon-profile"></i>\u8be6\u7ec6\u4fe1\u606f</a></div>');
    $templateCache.put("views/user/profile/post.html", '<div class="streams" infinite-scroll="userPosts.getObjects()" infinite-scroll-disabled="userPosts.query.paused" infinite-scroll-distance="1" ng-init="ctrl = userPosts"><div class="Box u-paddingVl u-marginBl" ng-include="\'views/partials/user-info.html\'"></div><div ng-include="\'views/user/profile/nav.html\'"></div><div class="Box u-textCenter u-marginVl u-paddingAxl" ng-if="userPosts.isDataEmpty" ng-init="hintType = \'userPosts\'"><div ng-include="\'views/partials/hint/hint-\' + hintType + \'.html\'"></div></div><div class="activities"><div class="activity" ng-repeat="object in userPosts.objects" ng-init="thing = object;" ng-controller="ActionCtrl"><div class="u-marginBm u-relative"><div class="activity-context u-colorGray"><time datetime="{{ object.created_at }}"></time></div><div class="activity-actions u-pullRight" ng-if="object.own"><a class="btn btn-small" ng-href="/posts/{{ object.id }}/update">\u7f16\u8f91</a> <a class="btn btn-small" ng-click="userPosts.actions.remove(object, userPosts.objects, \'post\')">\u5220\u9664</a></div></div><div class="thing-outer" ng-include="\'views/partials/thing/post.html\'"></div><div class="action-outer" ng-if="extendedStatus" ng-switch="" on="actionType"><div ng-switch-when="comment"><div class="conversation-outer" dg-comment="{{ actionTarget.id }}" host-type="{{ actionTarget.type }}"></div></div><div ng-switch-when="sharing"><div class="Box u-marginTl" ng-init="sharingThing = actionTarget; sharingThing.$type = \'post\'" ng-include="\'views/partials/sharing.html\'"></div></div></div></div></div><i ng-if="!userPosts.isDataEmpty" dg-tracker="objects"></i></div>');
    $templateCache.put("views/user/users.html", '<div class="u-marginBl" ng-if="dg.device.isDesktop()"><div ng-include="\'views/home/banner.html\'"></div></div><div class="cards-outer" ng-include="\'views/partials/explore-nav.html\'"></div><div class="cards-outer u-cf" infinite-scroll="users.getObjects()" infinite-scroll-disabled="users.query.paused" infinite-scroll-distance="1"><div class="Box u-marginTm" dg-taxonomy="users/identities" taxonomy-name="\u5206\u7c7b" ng-include="\'views/partials/taxonomy/category.html\'"></div><div class="cards u-cf"><article class="card" ng-init="user = object" ng-repeat="object in users.objects"><div ng-include="\'views/partials/card/user.html\'"></div></article></div><i dg-tracker="objects"></i></div>');
    $templateCache.put("views/wizard/profile.html", '<div class="wizard-outer Layout--1col"><div ng-include="\'views/partials/header-1col.html\'"></div><div class="u-paddingVxl u-paddingHxl Box u-cf"><form name="profile" ng-submit="wizard.submit()"><div class="u-cf"><div class="wizard-profile-avatar u-pullLeft u-paddingTm u-marginRxxl u-marginTl u-textCenter"><label class="form-field u-table"><i dg-uploader="" upload-type="image" upload-folder="avatars" upload-thing="\u5934\u50cf" target-model="wizard.user.avatar"><img dg-image="{{ wizard.user.avatar || wizard.user.avatars.origin }}" width="160" height="160" ng-model="wizard.user.avatar"></i></label><input type="hidden" name="avatar" ng-model="wizard.user.avatar"><span class="u-colorGray u-fontSizeS u-inlineBlock avatar-info">\u652f\u6301JPG/PNG/GIF\u683c\u5f0f\u3002</span></div><div class="u-pullLeft wizard-profile-info"><label class="form-field">\u6635\u79f0\uff1a <span class="input-message input-error" ng-if="wizard.errors.nickname" ng-bind="wizard.errors.nickname.message"></span><div class="input-outer"><input type="text" name="nickname" ng-model="wizard.user.nickname" ng-required="true"></div></label><label class="form-field">\u7528\u6237\u540d\uff1a <span class="input-message input-error" ng-if="wizard.errors.name" ng-bind="wizard.errors.name.message"></span><div class="input-outer"><span class="u-colorGray name-icon">@</span><input type="text" name="name" class="name-input" ng-model="wizard.user.name" ng-required="true"></div><span class="u-colorGray">hepaimusic.com/{{wizard.user.name}}</span></label><div class="form-field user-area"><div class="input-outer">\u5730\u533a\uff1a <span class="input-message input-error" ng-if="wizard.errors.province" ng-bind="wizard.errors.province.message"></span> <span class="input-message input-error" ng-if="wizard.errors.city" ng-bind="wizard.errors.city.message"></span></div><select name="province" ng-model="wizard.user.province.id" ng-change="wizard.changeProvince(wizard.user.province.id, wizard.areas);\n                                           wizard.resetSelectedCity()" ng-options="area.id as area.name for area in wizard.areas"></select><select name="city" ng-if="wizard.province.cities" ng-model="wizard.user.city.id" ng-options="city.id as city.name for city in wizard.province.cities"></select></div><label class="form-field">\u4e00\u53e5\u8bdd\u7b80\u4ecb\uff1a <span class="u-colorGray">\uff0850\u5b57\u4ee5\u5185\uff09</span> <span class="input-message input-error" ng-if="wizard.errors.description" ng-bind="wizard.errors.description.message"></span><div class="input-outer"><textarea name="description" class="textarea-desc" rows="2" type="text" ng-model="wizard.user.description">\n                            </textarea></div></label><div class="form-field"><div class="input-outer">\u8eab\u4efd\uff1a <span class="input-message input-error" ng-if="wizard.errors.identity" ng-bind="wizard.errors.identity.message"></span></div><div class="form-choosers u-cf"><label class="btn btn-medium u-paddingHl" ng-class="{\'btn-reverse\': identity.id == wizard.activeIdentity.id}" ng-repeat="identity in wizard.identities"><input type="radio" name="identity" value="{{ identity.id }}" ng-model="wizard.user.identity.id" ng-change="wizard.activeIdentity = wizard.changeIdentity(identity.id, wizard.identities)"><span ng-bind="identity.name"></span></label></div><div class="form-field Box u-paddingBn tag-group" ng-if="wizard.activeIdentity"><dl class="u-borderB u-paddingLm u-cf" ng-repeat="group in wizard.activeIdentity.groups"><dt class="tag-header"><dfn ng-bind="group.name"></dfn> <span ng-if="group.multi_selectable">\uff08\u591a\u9009\uff09</span>\uff1a</dt><dd class="tag-item" ng-repeat="tag in group.tags"><a class="btn-tag" ng-bind="tag.name" ng-init="wizard.taxonomy.initActiveTags(tag, group, wizard.user.domains)" ng-click="wizard.taxonomy.selectTag(tag, group)" ng-class="{\'btn-tag-active\': wizard.taxonomy.isTagActive(tag, group.activeTags)}"></a></dd></dl></div></div></div></div><div class="u-paddingTl u-textCenter"><button class="btn btn-medium btn-reverse" type="submit">\u4e0b\u4e00\u6b65</button></div></form></div><div></div></div>');
    $templateCache.put("views/wizard/social.html", '<div class="wizard-outer Layout--1col"><div ng-include="\'views/partials/header-1col.html\'"></div><div class="u-paddingAxl Box"><div class="u-marginBl u-paddingBs u-borderB"><p class="u-fontSizeL u-fontNormal u-marginBs">\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\uff0c</p><p class="u-fontSizeL u-fontNormal u-marginBs">\u627e\u670b\u53cb\uff0c\u4e5f\u8ba9\u670b\u53cb\u627e\u5230\u4f60\uff0c</p><p class="u-fontSizeL u-fontNormal u-marginBs">\u8ba9\u4f60\u5728\u97f3\u4e50\u9886\u57df\u7684\u7cbe\u5f69\u5728\u8fd9\u91cc\u5f00\u59cb\uff1a</p><p class="u-paddingTs u-marginBl"><a ng-href="/users/auth/weibo?returnUrl={{ dg.location.host() }}/wizard/social" ng-if="!wizardSocial.weiboBound" class="btn btn-medium btn-sns-bind" target="_self"><i class="icon-weibo"></i> \u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a</a> <a ng-href="/accounts/authentications/unbind/weibo?returnUrl={{ dg.location.host() }}/wizard/social" ng-if="wizardSocial.weiboBound" class="btn btn-medium u-colorRed" target="_self"><i class="icon-weibo"></i> \u5df2\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a</a></p><div class="u-cf u-paddingBs" ng-if="wizardSocial.users.friends"><h3 class="u-fontSizeL u-fontNormal u-pullLeft">\u4f60\u7684\u5fae\u535a\u670b\u53cb\uff1a</h3><label class="u-pullRight u-isActionable">\u5168\u9009<input name="published" type="checkbox" ng-checked="wizardSocial.isAllSeleted(\'friends\')" ng-click="wizardSocial.toggleAll(\'friends\')"></label></div><ul class="wizard-social-user-card-outer" ng-if="wizardSocial.users.friends"><li ng-repeat="user in wizardSocial.users.friends" ng-click="wizardSocial.toggleSelected(\'friends\', user)" class="wizard-social-user-card Box u-inlineBlock u-paddingAm"><article><header class="thing-highlight u-block avatar-medium"><img dg-image="{{ user.avatars.origin }}" class="avatar avatar-medium u-inlineBlock u-borderA u-alignTop" width="50" height="50"></header></article><div class="thing-well"><p class="wizard-social-user-card-desc">{{user.nickname}}</p><dl class="wizard-social-user-card-desc list-inline u-textTruncate"><dd ng-if="user.city || user.province">{{user.city.name || user.province.name}}</dd><dd ng-if="user.city || user.province">/</dd><dd>{{user.identity.name}}</dd></dl><i class="wizard-social-selected u-fontSizeL u-colorBlue icon-ok-circle" ng-hide="wizardSocial.isNotSelected(\'friends\', user)"></i></div></li></ul></div><div class="u-cf u-paddingBs" ng-if="wizardSocial.users.recommended"><h3 class="u-fontSizeL u-fontNormal u-pullLeft">\u6211\u4eec\u4e3a\u4f60\u63a8\u8350\uff1a</h3><label class="u-pullRight u-isActionable">\u5168\u9009<input name="published" type="checkbox" ng-checked="wizardSocial.isAllSeleted(\'recommended\')" ng-click="wizardSocial.toggleAll(\'recommended\')"></label></div><ul class="wizard-social-user-card-outer" ng-if="wizardSocial.users.recommended"><li ng-repeat="user in wizardSocial.users.recommended" ng-click="wizardSocial.toggleSelected(\'recommended\', user)" class="wizard-social-user-card Box u-inlineBlock u-paddingAm"><article><header class="thing-highlight u-block avatar-medium"><img dg-image="{{ user.avatars.origin }}" class="avatar avatar-medium u-inlineBlock u-borderA u-alignTop" width="50" height="50"></header></article><div class="thing-well"><p class="wizard-social-user-card-desc">{{user.nickname}}</p><dl class="wizard-social-user-card-desc list-inline u-textTruncate"><dd ng-if="user.city || user.province">{{user.city.name || user.province.name}}</dd><dd ng-if="user.city || user.province">/</dd><dd>{{user.identity.name}}</dd></dl><i class="wizard-social-selected u-fontSizeL u-colorBlue icon-ok-circle" ng-hide="wizardSocial.isNotSelected(\'recommended\', user)"></i></div></li></ul><div class="u-textCenter u-marginTl"><a ng-click="wizardSocial.followThem()" class="btn btn-reverse btn-medium">\u5173\u6ce8\u5e76\u5b8c\u6210</a> <a href="/explore" class="wizard-skip-social u-colorGray u-fontSizeS btn-medium">\u8df3\u8fc7\u8fd9\u4e00\u6b65\uff0c\u5f00\u59cb\u63a2\u7d22</a></div></div><div></div></div>');
  }]);
  $.module("dgWizard", ["dgWizardProfile", "WizardSocial"]);
  $.module("dgWizardProfile", []).controller("WizardProfileCtrl", ["$location", "Session", "Taxonomy", "Restangular", "UserRestangular", function($location, security, t, _, row) {
    var data = this;
    data.taxonomy = t;
    /**
     * @param {string} term
     * @param {?} extra
     * @return {undefined}
     */
    data.changeProvince = function(term, extra) {
      data.province = _.find(extra, {
        id : term
      });
    };
    /**
     * @return {undefined}
     */
    data.resetSelectedCity = function() {
      if (data.user) {
        data.user.city = _.first(data.province.cities);
      }
    };
    /**
     * @param {string} deepDataAndEvents
     * @param {Object} args
     * @return {?}
     */
    data.changeIdentity = function(deepDataAndEvents, args) {
      var suiteView = _.find(args, {
        id : deepDataAndEvents
      });
      return data.taxonomy.deactiveTags(suiteView, args);
    };
    var promise = _.all("areas").getList();
    var defer = _.all("users/identities").getList();
    security.requestCurrentUser().then(function(user) {
      return data.user = user, promise.then(function(key) {
        data.areas = key;
        if (user.province) {
          data.province = _.find(key, {
            id : user.province.id
          });
        }
      }), defer.then(function(key) {
        data.identities = key;
        if (user.identity) {
          data.activeIdentity = _.find(key, {
            id : user.identity.id
          });
        }
      }), user;
    });
    /**
     * @return {undefined}
     */
    data.submit = function() {
      var domain_ids;
      if (data.activeIdentity) {
        domain_ids = t.getTagIds(data.activeIdentity.groups);
      }
      var props = {
        avatar : data.user.avatar,
        nickname : data.user.nickname,
        name : data.user.name,
        description : data.user.description,
        province_id : data.user.province ? data.user.province.id : null,
        city_id : data.user.city ? data.user.city.id : null,
        identity_id : data.user.identity ? data.user.identity.id : null,
        domain_ids : domain_ids
      };
      var res = row.one("user");
      $.extend(res, props);
      res.put().then(function() {
        $location.path("/wizard/social");
      }, function(response) {
        window.scrollTo(0, 0);
        data.errors = response.data.errors;
      });
    };
  }]);
  $.module("WizardSocial", []).controller("WizardSocialCtrl", ["$location", "$routeParams", "Flash", "Session", "Restangular", function($location, settings, test, security, row) {
    var self = this;
    self.selectedIds = {
      friends : [],
      recommended : []
    };
    self.users = {
      friends : [],
      recommended : []
    };
    if ("1" === settings.success) {
      if (settings.connected) {
        test.pushMessage("\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\u6210\u529f", "success");
      } else {
        if (settings.disconnected) {
          test.pushMessage("\u89e3\u9664\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\u6210\u529f", "success");
        }
      }
    } else {
      if ("0" === settings.success) {
        test.pushMessage("\u7ed1\u5b9a\u65b0\u6d6a\u5fae\u535a\u5931\u8d25", "warning");
      }
    }
    security.requestCurrentUser().then(function(Socialite) {
      /** @type {boolean} */
      self.weiboBound = !!Socialite.sns.weibo;
      if (self.weiboBound) {
        row.all("user/weibo_friends").getList().then(function(friends) {
          self.users.friends = friends;
          self.toggleAll("friends");
        });
      }
    });
    row.all("users/recommended").getList().then(function(dataAndEvents) {
      self.users.recommended = dataAndEvents;
      self.toggleAll("recommended");
    });
    /**
     * @param {?} event
     * @param {Element} f
     * @return {undefined}
     */
    self.toggleSelected = function(event, f) {
      if (self.isNotSelected(event, f)) {
        self.selectedIds[event].push(f.id);
      } else {
        var fromIndex = self.selectedIds[event].indexOf(f.id);
        self.selectedIds[event].splice(fromIndex, 1);
      }
    };
    /**
     * @param {?} index
     * @param {Element} element
     * @return {?}
     */
    self.isNotSelected = function(index, element) {
      return-1 === self.selectedIds[index].indexOf(element.id);
    };
    /**
     * @param {?} name
     * @return {undefined}
     */
    self.toggleAll = function(name) {
      if (self.isAllSeleted(name)) {
        /** @type {Array} */
        self.selectedIds[name] = [];
      } else {
        $.forEach(self.users[name], function(wrapper) {
          if (self.isNotSelected(name, wrapper)) {
            self.selectedIds[name].push(wrapper.id);
          }
        });
      }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    self.isAllSeleted = function(name) {
      return self.users[name].length === self.selectedIds[name].length;
    };
    /**
     * @return {undefined}
     */
    self.followThem = function() {
      var contents = self.selectedIds.recommended.concat(self.selectedIds.friends);
      if (contents.length) {
        var node = row.one("user/following/batch");
        node.ids = contents;
        node.put().then(function() {
          $location.path("/");
        });
      } else {
        $location.path("/");
      }
    };
  }]);
}(window.angular);
