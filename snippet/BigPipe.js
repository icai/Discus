(function(m, l, k, h) {
    function f(x) {
        var o, y, a, b, d, c;
        o = F[x];
        if (!o) throw Error('Requiring unknown module "' + x + '"');
        if (o.hasOwnProperty("exports")) return o.exports;
        o.exports = x = {};
        y = o.deps;
        c = y.length;
        d = -1;
        for (b = []; ++d < c;) a = y[d], b.push("module" === a ? o : "exports" === a ? x : f(a));
        if ((y = o.factory.apply(null, b)) !== h) o.exports = x = y;
        return x
    }
    function b(a, o, y) {
        o = ["global", "require", "module", "exports"].concat(o);
        F[a] = {
            factory: y,
            deps: o
        }
    }
    function e(a, o, y) {
        var b = Array.prototype.slice;
        e = function(o, a, y) {
            var x = b.call(arguments,
            1);
            return b.apply(o, x)
        };
        return e.apply(this, e(arguments, 0))
    }
    function c(a, o) {
        o = o || k;
        return o.getElementById(a)
    }
    function d(a) {
        for (var a = a || {}, o = arguments, b = o.length, d = 0, c, E; ++d < b;) for (E in c = o[d], c) c.hasOwnProperty(E) && (a[E] = c[E]);
        return a
    }
    function a(b, o, y) {
        var c;
        this instanceof a ? (this.constructor = b, d(this, y)) : (c = a.prototype, a.prototype = o.prototype, b.prototype = new a(b, o, y), a.prototype = c)
    }
    function g() {
        function a() {
            for (var c = -1, x; ++c < d;) x = o[c], x[0].apply(x[1], x[2]), delete o[c];
            o = [];
            d = 0;
            b = null
        }
        var o = [],
            b = null,
            d = 0;
        g = function(c, E, j) {
            if (!c) return g;
            o.push([c, E || this, e(arguments, 2)]);
            d++;
            null === b && (b = setTimeout(a, 0));
            return b
        };
        return g.apply(this, e(arguments, 0))
    }
    function i(a) {
        var b, c = k.getElementsByTagName("head");
        b = c.length && c[0] || k.body;
        i = function(a) {
            b.appendChild(a)
        };
        return i(a)
    }
    function p(a, b) {
        var c = n(a) ? [] : {};
        "function" != typeof b && (b = b === h ? function(a, b) {
            return !!b
        } : function(a, c) {
            return c == b
        });
        q(a, function(a, d) {
            b(a, d) && (c[a] = d)
        });
        return c
    }
    function A(a, b, c) {
        var d, e;
        d = k.createElement(a);
        e = d.style;
        b && q(b, function(a, b) {
            d[a] = b
        });
        e && c && q(c, function(a, b) {
            e[a] = b
        });
        return d
    }
    function q(a, b) {
        B(a, function(a, c) {
            b(a, c);
            return !1
        })
    }
    function B(a, b) {
        var c;
        c = a.length;
        return (c === h || z(a) ? function(a, b) {
            for (var c in a) if (a.hasOwnProperty(c) && b(c, a[c])) return !0;
            return !1
        } : function(a, b) {
            var d;
            for (d = 0; d < c; d++) if (b(d, a[d])) return !0;
            return !1
        })(a, b)
    }
    function t(a) {
        for (var b = "Boolean,Number,String,Function,Array,Date,RegExp,Object".split(","), c = b.length, d = Object.prototype.toString, e = {}, j; c--;) j = b[c], e["[object " + j + "]"] = j.toLowerCase();
        t = function(a) {
            return null == a ? "" + a : e[d.call(a)] || "object"
        };
        return t(a)
    }
    function z(a) {
        return "function" === t(a)
    }
    function n(a) {
        function b(a) {
            return "array" === t(a)
        }
        n = Array.isArray || b;
        return n(a)
    }
    function z(a) {
        return "[object Function]" == Object.prototype.toString.call(a)
    }
    function j(a, b) {
        return u(a, b, e(arguments, 2))
    }
    function u(a, b, c) {
        w.push([a, b, c]);
        if (!C) {
            for (C = !0; a = w.length;) {
                for (b = 0; b < a; b++) c = w[b], c[0].apply(c[1], c[2]);
                w.splice(0, a)
            }
            C = !1
        }
    }
    var F = {};
    F.global = {
        exports: m
    };
    F.require = {
        exports: f
    };
    var D = {
        addHandler: function(a, b, c) {
            a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c
        },
        getEvent: function(a) {
            return a ? a : l.event
        },
        getTarget: function(a) {
            return a.target || a.srcElement
        },
        preventDefault: function(a) {
            a.preventDefault ? a.preventDefault() : a.returnValue = !1
        },
        stopPropagation: function(a) {
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
        },
        removeHandler: function(a, b, c) {
            a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent ? a.detachEvent("on" + b, c) : a["on" + b] = null
        }
    }, w = [],
        C = !1;
    b("Arbiter", ["global"], function(a, b) {
        function c(a) {
            this._listenerMap = {};
            this._setup(a || [])
        }
        function j(a, b) {
            var c = a[0],
                d = a[1],
                b = a[2].concat(b);
            try {
                return c.apply(d, b)
            } catch (e) {
                setTimeout(function() {
                    throw e;
                }, 0)
            }
        }
        a = b("global");
        d(c.prototype, {
            _setup: function(a) {
                for (var b = a.length, c = this._listenerMap; b--;) c[a[b]] = {
                    args: null,
                    cbs: []
                }
            },
            on: function(b, c, d) {
                var j = this._listenerMap[b],
                    g, s;
                if (!j) return !1;
                d = d || a;
                g = e(arguments, 3);
                (s = j.args) ? u(c, d, g.concat(s)) : j.cbs.push([c, d, g]);
                return !0
            },
            done: function(a, b) {
                var c = this._listenerMap[a],
                    d, j, s;
                if (!c) return !0;
                j = c.cbs;
                s = j.length;
                b = e(arguments, 1);
                c.args = b;
                d = this.emit.apply(this, arguments);
                c.cbs = j.slice(s);
                return d
            },
            emit: function(a, b) {
                var c = this._listenerMap[a],
                    d, g, s;
                if (!c) throw Error(a + " has not listened");
                b = e(arguments, 1);
                c = c.cbs;
                d = c.length;
                g = -1;
                for (s = !0; ++g < d;) s = !1 !== j(c[g], b) && s;
                return !!s
            },
            undo: function(a) {
                a = this._listenerMap[a];
                if (!a) return !1;
                a.args = null
            }
        });
        return c
    });
    b("Resource", ["Arbiter", "CSSLoader", "JSLoader"], function(b,
    c) {
        function e(a, b) {
            if (this instanceof e) k.call(this, r), this.id = a, this.deps = b, this.loaded = !1, this.state = v;
            else return g(a)
        }
        function g(a) {
            var b, c;
            if (!(b = n[a])) throw Error('resource "' + a + '" unknow.');
            if (!(c = b._handler)) c = b._handler = new e(a, b.deps || []), b._loaded && (c.loaded = !0);
            return c
        }
        function f(a, b) {
            G[a] = b
        }
        function i(a, b) {
            var c;
            if (b !== h) c = n[a] || {}, d(c, b), n[a] = c;
            else for (a in b = a, b) i(a, b[a])
        }
        var k = c("Arbiter"),
            n = {}, G = {}, s = {}, r = ["load", "resolve"],
            v = 1;
        a(e, k, {
            load: function() {
                function a() {
                    --d || (f = !0, v && this.done("resolve"))
                }
                function b() {
                    v = !0;
                    this.done("load");
                    f && this.done("resolve")
                }
                var c, d, r, s, g, v, f;
                if (2 <= this.state) return !1;
                this.state = 2;
                v = this.loaded;
                f = !0;
                c = this.deps;
                r = d = c.length;
                if (0 < r) {
                    f = !1;
                    for (s = -1; ++s < r;) g = e(c[s]), g.on("resolve", a, this), g.load()
                }
                j(function() {
                    var a;
                    if (v) j(b, this);
                    else {
                        a = this.id;
                        var c, d, r;
                        c = n[a];
                        d = c.type;
                        if (!(r = G[d])) throw Error('unknow type "' + d + '"');
                        a = new r(a, c);
                        a.on("load", b, this);
                        a.load()
                    }
                }, this)
            }
        });
        d(e, {
            setResourceMap: i,
            setModuleMap: function(a) {
                d(s, a)
            },
            setResourceLoaded: function(a) {
                var b;
                for (b = a.length; b--;) i(a[b], {
                    _loaded: !0
                })
            },
            moudelToResource: function(a) {
                var b = s[a];
                if (!b) throw Error('module "' + a + '" unknow.');
                return g(b)
            }
        });
        f("css", c("CSSLoader"));
        f("js", c("JSLoader"));
        return e
    });
    b("Pagelet", ["Arbiter", "Resource"], function(b, e) {
        function j(a) {
            if (this instanceof j) f.call(this, n), this.id = a, this.root = null === a, this.state = h;
            else {
                var b;
                if (null === a) return new j(a);
                b = k[a];
                b || (b = new j(a), k[a] = b);
                return b
            }
        }
        var f = e("Arbiter"),
            i = e("Resource"),
            n = "arrive,beforeload,cssresolved,jsresolved,beforedisplay,display,load,afterload,resolved,beforeunload,unload,afterunload".split(","),
            h = 0,
            k = {}, G = {};
        a(j, f, {
            arrive: function(a) {
                d(this, {
                    html: a.html || "",
                    css: a.css || [],
                    js: a.js || [],
                    parent: a.parent || null,
                    children: a.children || [],
                    state: 1
                });
                this.afterload = !1;
                this.done("arrive");
                this.emit("beforeload") ? this.load() : (this.afterload = !0, this.done("afterload"))
            },
            load: function() {
                function a() {
                    j(this.parent).on("display", b, this)
                }
                function b() {
                    this.emit("beforedisplay") && this.display()
                }
                if (2 <= this.state) return !1;
                this.state = 2;
                this.on("cssresolved", this.parent ? a : b, this);
                this._resolve(this.css, "cssresolved");
                this._resolve(this.js, "jsresolved")
            },
            setState: function() {
                if (3 > this.state) return !1;
                this.state = 4;
                var a, b, c, d;
                a = this.children;
                b = a.length;
                c = -1;
                if (b) for (; ++c < b;) d = a[c], d = j(d), d.setState()
            },
            doUnload: function() {
                function a() {
                    --b || this.emit("beforeunload") && this.unload()
                }
                var b, c, d, e, g;
                c = this.children;
                d = b = c.length;
                e = -1;
                if (d) for (; ++e < d;) g = c[e], g = j(g), g.on("unload", a, this), g.doUnload();
                else this.emit("beforeunload") && this.unload()
            },
            remove: function() {
                if (4 == this.state) return !1;
                this.setState();
                this.on("unload",
                this.destroy, this);
                this.doUnload()
            },
            unload: function() {
                this.done("unload")
            },
            destroy: function() {
                var a, b, c, d;
                a = this.children;
                b = a.length;
                c = -1;
                if (b) for (; ++c < b;) d = a[c], d = j(d), d.destroy();
                delete k[this.id];
                this.state = h;
                g(this.done, this, "afterunload")
            },
            isUnloading: function() {
                return 4 == this.state
            },
            _resolve: function(a, b) {
                function c() {
                    --d || this.done(b)
                }
                var d, e, j, g;
                e = d = a.length;
                j = -1;
                if (e) for (; ++j < e;) g = i(a[j]), g.on("resolve", c, this), g.load();
                else this.done(b)
            },
            display: function() {
                if (3 <= this.state) return !1;
                this.state = 3;
                this.root || (c(this.id).innerHTML = this.html);
                this.done("display");
                this.on("jsresolved", function() {
                    this.done("load");
                    this.afterload || this.done("afterload")
                }, this)
            },
            get: function(a, b) {
                return G[a] || b
            },
            set: function(a, b) {
                G[a] = b
            }
        });
        d(j, {
            hasPagelet: function(a) {
                return !!k[a]
            }
        });
        return j
    });
    b("BigPipe", ["Resource", "Emulator", "Arbiter", "Requestor"], function(b, c) {
        function d() {
            g.call(this);
            this.hooks = {}
        }
        var e = c("Resource"),
            j = c("Emulator"),
            g = c("Arbiter"),
            f = c("Requestor"),
            i = !1;
        a(d, g, {
            init: function(a) {
                if (i) throw Error("BigPipe has been initialized.");
                i = !0;
                this.emulator = j();
                this.emulator.listen();
                this.emulator.on("request", this.request, this);
                this.requestor = new f(a)
            },
            onPageletArrive: function(a) {
                var b = a.callback,
                    c, d, j, g, f, i, k = this.hooks;
                if (b) {
                    c = a.hook || {};
                    for (var h in b) {
                        d = b[h];
                        j = -1;
                        g = d.length;
                        for (f = c[h] || []; ++j < g;) i = d[j], f.push(k[i]), delete k[i];
                        c[h] = f
                    }
                    a.hook = c
                }
                e.setResourceMap(a.map || {});
                e.setModuleMap(a.mods || {});
                this.requestor.arrive(a)
            },
            request: function(a, b) {
                this.requestor.request(a, b)
            },
            sessionStart: function(a) {
                this.requestor.start(a)
            },
            sessionEnd: function(a) {
                this.requestor.end(a)
            },
            loadModule: function(a, b) {
                var c = e.moudelToResource(a);
                c.on("resolve", b);
                c.load()
            },
            loadedResource: function(a) {
                e.setResourceLoaded(a)
            },
            log: function() {}
        });
        return d
    });
    b("CSSLoader", ["Arbiter"], function(b, c) {
        function d(a, b) {
            r.call(this, v);
            this.id = a;
            this.url = b.src;
            this.state = F
        }
        function e(a) {
            w || (w = k.createElement("meta"), i(w));
            C = a || C;
            w.className = C.join(" ")
        }
        function j(a) {
            return !a ? !1 : (a = l.getComputedStyle ? getComputedStyle(a, null) : a.currentStyle) && 1 < parseInt(a.height, 10)
        }
        function f() {
            var a, b, c, d, g, i, r, h, k,
            n, v, u;
            b = 2 < C.length ? j(w) : !0;
            c = 0;
            d = [];
            g = !1;
            i = +new Date;
            for (a in q) {
                r = q[a];
                h = r[0];
                k = !1;
                b && j(h) && (k = !0);
                for (v = 1, n = r.length; v < n; v++) u = r[v], k ? u[1].call(u[2], !0) : u[0] < i && (u[1].call(u[2], !1), r.splice(v, 1), v--, n--);
                k || 1 == n ? (h.parentNode.removeChild(h), delete q[a], g = !0) : (d.push("css_" + a), c++)
            }
            c ? (g && e(d), setTimeout(f, 20)) : (C = [], w && (w.parentNode.removeChild(w), w = null), t = !1)
        }
        function h(a, b, c, d) {
            var j, r;
            if (!(j = q[a])) r = "css_" + a, j = k.createElement("meta"), j.className = r, i(j), j = [j], q[a] = j, C.push(r), e();
            b = +new Date + b;
            j.push([b, c, d]);
            t || (t = !0, g(f))
        }
        function n(a) {
            this.state = a ? m : D;
            this.done("load", a)
        }
        function u() {
            var a = this.id,
                b = this.url,
                c = k.createElement("link");
            c.rel = "stylesheet";
            c.type = "text/css";
            c.href = b;
            i(c);
            h(a, B, n, this)
        }
        function s() {
            for (var a = this.id, b = this.url, c = p.length, d = c, j; d--;) if (31 > p[d].length) {
                j = z[d];
                break
            }
            0 > d && (j = k.createStyleSheet(), z.push(j), p.push([]), d = c);
            j.addImport(b);
            p[d].push(b);
            h(a, B, n, this)
        }
        var r = c("Arbiter"),
            v = ["load"],
            F = 1,
            m = 3,
            D = 4,
            B = 5E3,
            t = !1,
            p = [],
            z = [],
            q = {}, C = [],
            w = null;
        a(d, r, {
            load: function() {
                2 > this.state && (this.state = 2, this._load())
            },
            _load: k.createStyleSheet ? s : u
        });
        return d
    });
    b("JSLoader", ["Arbiter"], function(b, c) {
        function d(a, b) {
            j.call(this, e);
            this.id = a;
            this.url = b.src;
            this.state = f
        }
        var j = c("Arbiter"),
            e = ["load"],
            f = 1,
            n = 3,
            u = 4;
        a(d, j, {
            load: function() {
                function a(e) {
                    if (!(b.state >= n)) {
                        b.state = e ? n : u;
                        b.done("load");
                        l[c] = d;
                        if (d === h) try {
                            delete l[c]
                        } catch (f) {}
                        g(function() {
                            j.onerror = null;
                            j.parentNode && j.parentNode.removeChild(j);
                            j = null
                        })
                    }
                }
                var b = this,
                    c, d;
                if (!(2 <= this.state)) {
                    this.state = 2;
                    var j = k.createElement("script");
                    j.src = this.url;
                    j.async = !0;
                    j.onerror = function() {
                        a(!1)
                    };
                    c = "js_" + this.id;
                    d = l[c];
                    l[c] = a;
                    i(j)
                }
            }
        });
        return d
    });
    b("Emulator", ["Arbiter"], function(b, c) {
        function d(a) {
            var b = !1;
            if (a && (a = ("" + a).replace(/(^\s*)|(\s*$)/g, ""))) b = p(a.split(" "), function(a, b) {
                return !!("" + b).replace(/(^\s*)|(\s*$)/g, "")
            });
            return b
        }
        function j(a) {
            var b, c;
            for (b = "A"; a && a.nodeName != b;) a = a.parentNode;
            if (!a) return !1;
            if (!this.emit("beforetrigger", a)) return !0;
            b = a.href;
            if (!b) return !1;
            b = b == i || 0 == b.indexOf(i + "/") ? b.substring(h) || "/" : !1;
            if (!b) return !1;
            (a = a.rel) && (c = d(a));
            if (!c) return !1;
            this.emit("request", b, c);
            return !0
        }
        function e() {
            if (this instanceof e) g.call(this, n);
            else return f || (f = new e), f
        }
        var g = c("Arbiter"),
            f, i, h, n = ["beforetrigger", "request"];
        i = [location.protocol, "//", location.host].join("");
        h = i.length;
        a(e, g, {
            listen: function() {
                var a = this;
                D.addHandler(k.documentElement, "click", function(b) {
                    var c, b = D.getEvent(b);
                    c = D.getTarget(b);
                    j.call(a, c) && D.preventDefault(b)
                })
            }
        });
        return e
    });
    b("Requestor", ["Arbiter", "Controller"], function(b, c) {
        function j(a) {
            e.call(this,
            f);
            d(this, {
                ajaxKey: a.ajaxKey,
                separator: a.separator,
                sessionKey: a.sessionKey
            });
            h || this.init()
        }
        var e = c("Arbiter"),
            g = c("Controller"),
            f = ["arrive", "allarrived"],
            i = {}, h = !1,
            n = !1,
            u = 0;
        a(j, e, {
            init: function() {
                h = !0;
                this.sessionState = this.state = 0;
                this.controller = new g;
                this.controller.on("arrived", this._onItemArrived, this);
                this.on("allarrived", this._onSessionEnd, this);
                this.refCount = 0
            },
            start: function(a) {
                this.sessionID = a;
                switch (this.sessionState) {
                    case 1:
                    case 2:
                    case 3:
                        this.sessionState = 2;
                        break;
                    case 0:
                        this.sessionState = 1
                }
            },
            end: function() {
                this.sessionState = 3;
                0 == this.refCount && this._onSessionEnd()
            },
            arrive: function(a) {
                var b = this.sessionID,
                    c = this.sessionState;
                i[b - 1] && (i[b - 1] = null);
                2 == c || 3 == c ? (i[b] = i[b] || [], i[b].push(a)) : (++this.refCount, this.controller.handdleArrive(a))
            },
            request: function(a, b) {
                u++;
                this._ajaxRequest([a, /.*\?.*/.test(a) ? "&" : "?", this.ajaxKey, b ? "=" + b.join(this.separator) : "", "&", this.sessionKey, "=", u].join(""))
            },
            _onSessionEnd: function() {
                this.sessionState = 0;
                var a = i[this.sessionID],
                    b = this;
                a && q(a, function(a,
                c) {
                    b.refCount++;
                    b.controller.handdleArrive(c)
                })
            },
            _onItemArrived: function() {
                !--this.refCount && 3 == this.sessionState && this.emit("allarrived")
            },
            _ajaxRequest: function(a) {
                switch (this.state) {
                    case 1:
                        var b = this._ajaxIframe;
                        b && b.parentNode && b.parentNode.removeChild(b);
                        this._initAjaxIframe(a);
                        break;
                    case 0:
                        this._initAjaxIframe(a), this.state = 1
                }
            },
            _initAjaxIframe: function(a) {
                var b = this;
                this._ajaxIframe = A("iframe", {
                    src: a
                }, {
                    display: "none"
                });
                k.body.appendChild(this._ajaxIframe);
                clearTimeout(n);
                D.addHandler(this._ajaxIframe, "load", function() {
                    1 == b.state && (n = setTimeout(function() {
                        var a = b._ajaxIframe;
                        a && a.parentNode && a.parentNode.removeChild(a);
                        b.state = 0
                    }, 100))
                })
            }
        });
        return j
    });
    b("Controller", ["Arbiter", "Pagelet", "Resource"], function(b, d) {
        function j() {
            g.call(this, i)
        }
        function e(a, b) {
            var d = c(a, b),
                j;
            if (!(j = d.firstChild) || 8 !== j.nodeType) return null;
            j = j.nodeValue;
            d.parentNode.removeChild(d);
            j = j.slice(1, - 1);
            return j.replace(/--\\>/g, "--\>")
        }
        var g = d("Arbiter"),
            f = d("Pagelet");
        d("Resource");
        var i = ["arrived"];
        a(j, g, {
            handdleArrive: function(a) {
                var b,
                c;
                c = a.id;
                f.hasPagelet(c) && (b = f(c), b.remove());
                if (f.hasPagelet(c)) if (b = f(c), b.isUnloading()) b.on("afterunload", this._doArrive, this, a);
                else throw Error("unbeliveble");
                else this._doArrive(a)
            },
            _doArrive: function(a) {
                var c, d, j, g, i, h, n, k;
                c = a.id || null;
                d = a.content ? a.content : a.container_id ? e(a.container_id, a.doc) : null;
                a.html = d;
                d = f(c);
                if (j = a.hook) for (g in j) {
                    i = j[g];
                    n = i.length;
                    for (h = -1; ++h < n;) {
                        k = i[h];
                        try {
                            d.on(g, z(k) ? k : new Function("pagelet", k), b, d)
                        } catch (u) {
                            throw Error("Error on add script:" + i[h]);
                        }
                    }
                }
                d.arrive(a);
                d.on("afterload", function(a) {
                    this.emit("arrived", a)
                }, this, c)
            }
        });
        return j
    });
    var H = f("BigPipe");
    m.BigPipe = new H
})(this, window, document);