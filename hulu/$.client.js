(function(){
	var a = {
		init: function() {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version", this.OS = this.searchString(this.dataOS) || "an unknown OS", this.OSVersion = this.parseVersion(navigator.userAgent) || "an unknown OS Version";
		},
		searchString: function(a) {
			for (var b = 0; b < a.length; b++) {
				var c = a[b].string,
					d = a[b].prop;
				this.versionSearchString = a[b].versionSearch || a[b].identity;
				if (c) {
					if (c.indexOf(a[b].subString) != -1) return a[b].identity;
				} else if (d) return a[b].identity;
			}
		},
		searchVersion: function(a) {
			var b = a.indexOf(this.versionSearchString);
			if (b == -1) return;
			return parseFloat(a.substring(b + this.versionSearchString.length + 1));
		},
		parseVersion: function(a) {
			var b = null;
			if (/^Mozilla\/\d+\.\d+ \(([^)]+)\)/.test(a)) {
				var c = RegExp.$1;
				/Windows NT ([^;]+)/.test(c) ? b = RegExp.$1 : /Mac OS X ([^;]+)/.test(c) ? b = RegExp.$1 : b = c;
			}
			return b;
		},
		dataBrowser: [{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			}, {
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			}, {
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			}, {
				prop: window.opera,
				identity: "Opera"
			}, {
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			}, {
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			}, {
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			}, {
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			}, {
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			}, {
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			}, {
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			}, {
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS: [{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			}, {
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			}, {
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
			}, {
				string: navigator.userAgent,
				subString: "iPad",
				identity: "iPad"
			}, {
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
	};
	a.init(), window.$.client = {
		os: a.OS,
		osVersion: a.OSVersion,
		browser: a.browser,
		version: a.version
	};
})()