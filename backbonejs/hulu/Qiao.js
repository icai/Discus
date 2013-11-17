var Qiao = function() {
    var b = this,
        a = function(d, c) {
            return (d && d.hasOwnProperty && (d instanceof c))
        };
    if (!(a(b, Qiao))) {
        b = new Qiao()
    } else {
        b._init()
    }
    return b
};
(function() {
    var e, h = Array.prototype.slice,
        d = Object.prototype.toString,
        f = ".",
        b = {
            mods: {},
            _attached: {},
            _loaded: {},
            _events: {}
        };

    function c(j) {
        return function() {
            throw new Error("need to implement " + j)
        }
    }
    function a(l, k, j) {
        j.fire = j.fire || function(m) {
            var n = Array.prototype.slice.call(arguments);
            n.unshift(k);
            l.fire.apply(l, n)
        };
        j.on = j.on || function(m, n) {
            l.on(k, m, n)
        }
    }
    e = {
        _init: function() {
            var m = this,
                j = "Qiao_" + (+new Date()).toString(16),
                l = b._attached,
                k = b._events;
            m.id = j;
            l[j] = {};
            k[j] = {}
        },
        define: function(j, m, l) {
            var k = {
                name: j
            };
            if (!l) {
                l = m;
                m = []
            }
            m = m || [];
            k.fn = l;
            k.requires = m;
            b.mods[j] = k
        },
        use: function() {
            var k = h.call(arguments, 0),
                s = k[k.length - 1],
                p = b.mods,
                o = this,
                m, j, n = [];
            if (d.call(s) === "[object Function]") {
                k.pop()
            } else {
                s = null
            }
            if (d.call(k[0]) === "[object Array]") {
                k = k[0]
            }
            for (m = 0, j = k.length; m < j; m++) {
                n.push(k[m])
            }
            if (o._attach(n)) {
                s(o)
            }
        },
        _attach: function(y) {
            var u = this,
                x = b.mods,
                k = b._attached,
                n = k[u.id],
                m, w, v, t, s, r, o = y.length,
                p;
            for (s = 0; s < o; s++) {
                m = y[s];
                if (n[m]) {
                    continue
                }
                p = u._namespace(m);
                w = x[m];
                if (!w) {
                    continue
                }
                n[m] = true;
                v = w && w.requires;
                if (v) {
                    for (r = 0;
                    (t = v[r]); r++) {
                        if (!n[t]) {
                            if (!u._attach(v)) {
                                return false
                            }
                            break
                        }
                    }
                }
                if (w.fn) {
                    a(u, m, p);
                    w.fn(u, p);
                    if (p.interfaces && d.call(p.interfaces) == "[object Array]") {
                        for (r = 0; t = p.interfaces[r]; r++) {
                            p[t] = c(t)
                        }
                    }
                }
            }
            return true
        },
        _namespace: function() {
            var n = arguments,
                t, r = 0,
                m, p, s, k;
            for (m = n.length; r < m; r++) {
                t = this;
                k = n[r];
                if (k.indexOf(f) > -1) {
                    s = k.split(f);
                    for (p = (s[0].toLowerCase() == "qiao") ? 1 : 0; p < s.length; p++) {
                        t[s[p]] = t[s[p]] || {};
                        t = t[s[p]]
                    }
                } else {
                    t[k] = t[k] || {};
                    t = t[k]
                }
            }
            return t
        },
        implement: function(n, m) {
            var j = n.interfaces || [],
                k, l;
            for (k = 0; l = j[k]; k++) {
                if (m[l]) {
                    n[l] = m[l]
                }
            }
        },
        fire: function(n, j) {
            var p = this,
                m, o, k = Array.prototype.slice.call(arguments),
                l = b._events[p.id];
            l = l[n] || {};
            l = l[j] || [];
            k.splice(0, 2);
            for (m = 0; o = l[m]; m++) {
                o.apply(null, k)
            }
        },
        on: function(l, j, n) {
            var m = this,
                k = b._events[m.id];
            k = k[l] ? k[l] : (k[l] = {});
            k = k[j] ? k[j] : (k[j] = []);
            k.push(n)
        }
    };
    Qiao.prototype = e;
    Qiao.define = e.define;
    Qiao.cb = {}
}());