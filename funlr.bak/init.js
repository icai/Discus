if (typeof(FUNLR) == "undefined" || !FUNLR) {
    var FUNLR = function() {
            var a = {},
                b = [];
            a.version = "2.0";
            a.debug = false;
            a.noop = function() {};
            a.returnFn = function(v) {
                return v;
            };
            a.inc = function(a, b) {
                return !0
            };
            a.isEmptyObject = function(O) {
                for (var x in O) {
                    return false;
                }
                return true;
            };
            a.isFunction = function(object) {
                return Object.prototype.toString.call(object) === '[object Function]';
            }
            a.isArray = function (arr) {
                return Object.prototype.toString.call(arr) == "[object Array]";
            }
            a.namespace = function(c, d) {
                var e = c.split("."),
                    f = a,
                    g = null;
                while (g = e.shift()) if (e.length) {
                    f[g] === undefined && (f[g] = {});
                    f = f[g]
                } else if (f[g] === undefined) try {
                    f[g] = d(a)
                } catch (h) {
                    b.push(h)
                }
            };
            a.extend = function(c, d) {
                var e = c.split("."),
                    f = a,
                    g = null,k;
                while (g = e.shift()) if (e.length) {
                    f[g] === undefined && (f[g] = {});
                    f = f[g]
                } else if (f[g] === undefined) {
                    f[g] = {};
                    a.isFunction(d) && (d = d(a));
                    for (var i in d) {
                        if (f[g][i] == undefined) {
                            f[g][i] = a.isFunction(d[i]) ? d[i](a) : d[i];
                        }
                    }
                } else if (a.isFunction(f[g]) || !a.isEmptyObject(f[g])) {
                    if(a.isFunction(d)){
                        k = d(a);
                        for (var i in k) {
                            if (f[g][i] == undefined) {
                                f[g][i] =  k[i];
                            }
                        }
                    }else if(!a.isEmptyObject(d)){
                        for (var i in d) {
                            if (f[g][i] == undefined) {
                                f[g][i] =  a.isFunction(d[i]) ? d[i](a) : d[i];
                            }
                        }
                    } 

                }
            };
            a.ua = navigator.userAgent;
            a._o_ = /Opera/i.test(a.ua);
            a._ms_ = /msie/i.test(a.ua);
            a._moz_ = /(?:Firefox|Gecko\/)/i.test(a.ua);
            a._webkit_ = /(?:Chrome|Safari|AppleWebKit)/i.test(a.ua);
            a.IE6 = a._ms_ && /msie 6\.0/.test(a.ua);
            a.IE7 = a._ms_ && /msie 7\.0/.test(a.ua);
            a.IE8 = a._ms_ && /msie 8\.0/.test(a.ua);
            a.IE9 = a._ms_ && /msie 9\.0/.test(a.ua);
            a.random =  function(a, b) {
                return Math.floor(Math.random() * (b - a + 1) + a)
            };
            a.debugtime = function(){
                if(a.debug){
                    return '?'+(new Date).getTime();
                }
                return "";
            };
            a.timer = function (){
                this.startTime = + new Date;
            };
            a.timer.prototype.stop = function(){
                return + new Date - this.startTime;
            };
            a.E = function(a) {
                return typeof a == "string" ? document.getElementById(a) : a
            };
            a.elog = function(a) {
                b.push("[" + (new Date).getTime() % 1e5 + "]: " + a)
            };
            a.showErrorLog = function(a) {
                return b.splice(0, a || b.length)
            };
            return a
        }();

}



define('init',function() {

    FUNLR.namespace('md5',function(a){
        var hexcase=0;var b64pad="";function hex_md5(s){return rstr2hex(rstr_md5(str2rstr_utf8(s)))}function rstr_md5(s){return binl2rstr(binl_md5(rstr2binl(s),s.length*8))}function rstr2hex(input){try{hexcase}catch(e){hexcase=0}var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++){x=input.charCodeAt(i);output+=hex_tab.charAt(x>>>4&15)+hex_tab.charAt(x&15)}return output}
function rstr2binl(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++)output[i]=0;for(var i=0;i<input.length*8;i+=8)output[i>>5]|=(input.charCodeAt(i/8)&255)<<i%32;return output}function binl2rstr(input){var output="";for(var i=0;i<input.length*32;i+=8)output+=String.fromCharCode(input[i>>5]>>>i%32&255);return output}
function str2rstr_utf8(input){var output="";var i=-1;var x,y;while(++i<input.length){x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(55296<=x&&x<=56319&&56320<=y&&y<=57343){x=65536+((x&1023)<<10)+(y&1023);i++}if(x<=127)output+=String.fromCharCode(x);else if(x<=2047)output+=String.fromCharCode(192|x>>>6&31,128|x&63);else if(x<=65535)output+=String.fromCharCode(224|x>>>12&15,128|x>>>6&63,128|x&63);else if(x<=2097151)output+=String.fromCharCode(240|x>>>18&7,128|x>>>12&63,128|x>>>
6&63,128|x&63)}return output}
function binl_md5(x,len){x[len>>5]|=128<<len%32;x[(len+64>>>9<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,
d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,
b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,
a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,
d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,
c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd)}return Array(a,b,c,d)}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}function md5_ff(a,b,c,d,x,s,t){return md5_cmn(b&c|~b&d,a,b,x,s,t)}
function md5_gg(a,b,c,d,x,s,t){return md5_cmn(b&d|c&~d,a,b,x,s,t)}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|~d),a,b,x,s,t)}function safe_add(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return msw<<16|lsw&65535}function bit_rol(num,cnt){return num<<cnt|num>>>32-cnt};

        return {
            hex_md5:hex_md5
        }
    })


    FUNLR.namespace("string.encodeHTML", function(a) {
        return function(a) {
            if (typeof a != "string") throw "encodeHTML need a string as parameter";
            return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        }
    });
    FUNLR.namespace("string.decodeHTML", function(a) {
        return function(a) {
            if (typeof a != "string") throw "decodeHTML need a string as parameter";
                var c = a.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
                return c.replace(/&#([\d]+);/g, function(a, b) {
                    return String.fromCharCode(parseInt(b, 10))
                })
        }
    });

    FUNLR.namespace("encodeHTML", function(a) {
        return function(b) {
            return a.string.encodeHTML(b);

        }
    });

    FUNLR.namespace("decodeHTML", function(a) {
        return function(b) {
            return a.string.decodeHTML(b);
        }
    });
    FUNLR.namespace('fn.jsonlen',function(a){
        return function(arr){
            if(a.isArray(arr)){
                return arr.length;
            }else if(arr == null){
                return 0;
            }
        }
    });
    FUNLR.namespace("log", function(a) {
        return function(args) {
            if (a.debug && window.console) {
                var aa, bb;
                if (arguments.length == 2) {
                    if (typeof arguments[0] == "number") {
                        aa = arguments[0];
                        bb = arguments[1];
                        if (console.log) {
                            console.log('Line' + aa + ':----------start----------- ');
                            console.log(bb);
                            console.log('Line' + aa + ':-----------end------------ ');
                        } else {
                            alert(bb);
                        }
                    }
                } else if (arguments.length == 1) {
                    aa = arguments[0];
                    if (console.log) {
                        console.log(aa);
                    } else {
                        alert(aa);
                    }
                }
            } else try {} catch (e) {}
        }
    });


    FUNLR.namespace("warn", function(a) {
        return function(line, expr) {
            if (a.debug && window.console) {
                if (console.warn) {
                    console.warn('Line' + line + ': ' + expr);
                } else {
                    alert(expr);
                }
            } else try {} catch (e) {}
        }
    });

    FUNLR.namespace('console', function(a) {
        return function(expr) {
            if (a.debug && window.console) {
                if (console.log) {
                    console.log(expr);
                } else {
                    alert(expr);
                }
            } else {
                return true;

            }
        }
    });

    FUNLR.namespace('fn.getHeadFace', function(a) {
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000);
        }
        return function(headImg, size) {
            var isformat = new RegExp(size + '\.png$');
            if (headImg == "") {
                return  THEME_SERVER_URL+'/image/default/' + size + '.jpg';
            }
            if (isformat.test(headImg)) {
                return headImg;
            }
            var fileName = headImg.substr(0, 15);
            var times = headImg.substr(0, 10);
            var d = getLocalTime(times);
            var monthday = (d.getMonth() * 1 + 1) + "";
            var monthday = monthday.length > 1 ? monthday : "0" + monthday;
            var dateday = d.getDate().toString().length > 1 ? d.getDate() : "0" + d.getDate();
            var localdate = d.getFullYear() + "" + monthday + "" + dateday;
            var md5date = a.md5.hex_md5(localdate);
            var headerface =  DOMAIN_URL + "/uimages/" + md5date + "/" + fileName + "_" + size + ".jpg";
            return headerface;
        }
    })


    FUNLR.namespace('fn.loadCss',function(a){
        return function(urls /*,callback*/) {
            var arg = arguments,urls = urls;
            function cb(){
                var callback = arg[1];
                if(callback && typeof callback == "function"){
                    callback();
                }
            }
            function isloaded(n){
                var links = document.getElementsByTagName('link');
                for(var i = 0; i < links.length; i++){

                    if(links[i].getAttribute('data-loaded') == n){
                        return 1;
                    }
                }
                return 0;
            }
            function  loadone(name){

                if(isloaded(name)){
                    cb();
                    return;
                }
                var baseurl = THEME_SERVER_URL +'/style/css/',
                    link = document.createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = baseurl+name+'.css'+ a.debugtime();
                    link.setAttribute('data-loaded',name);
                    document.getElementsByTagName("head")[0].appendChild(link);
                    if((a.isArray(urls) && !urls.length) || typeof urls == "string"){
                        cb();
                    }
            }
            if(a.isArray(urls)){
                var url = "",g = null;
                while(g = urls.shift()){
                    loadone(g);
                }
            }else{
                loadone(urls);
            }
             
        }
    })
    function xlog(r) {
        FUNLR.console(r);
    }

    function getHeadFace(headImg, size) {
        return FUNLR.fn.getHeadFace(headImg, size);
    }

    (function(a,b) {
        a.getHeadFace = b.fn.getHeadFace;
        a.xlog = b.xlog;
        a.loadCss = b.fn.loadCss;
    })(window,FUNLR)


    return FUNLR
})


/* ----------fixed or extend function-----------*/

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(elt /*, from*/ ) {
        var len = this.length;
        var from = Number(arguments[1]);
        if (isNaN(from)) {
            from = len - 1;
        } else {
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) from += len;
            else if (from >= len) from = len - 1;
        }
        for (; from > -1; from--) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}
if (!Array.prototype.uniq) {
    Array.prototype.uniq = function() {
        var a = [],
            o = {},
            i, v, cv, len = this.length;
        if (len < 2) {
            return this;
        }
        for (i = 0; i < len; i++) {
            v = this[i];
            cv = 0 + v;
            if (!o[cv]) {
                a.push(v);
                o[cv] = true;
            }
        }
        return a;
    }
}



if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}
Function.prototype.construct = function(args) {
    construct(this, args);
}


if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope || this, this[i], i, this);
        }
    }
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */ ) {
        "use strict";
        if (this == null) throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function") throw new TypeError();
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t)) res.push(val);
            }
        }
        return res;
    };
}

function imgURL(size, path) {
    return IMAGE_SERVER_URL + '/Cache/' + size + '/' + path;
	//return IMAGE_SERVER_URL + '/Upload/' + path;
}

function dirImgUrl(path) {
    return IMAGE_SERVER_URL + '/Upload/' + path;
}
