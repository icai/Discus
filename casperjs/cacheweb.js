
var DateUtil = (function(){
var REG = /\d+/g;
	return {
		format:function(date,str) {
			var _fn = this;
			if(typeof date == 'string'){
				date = this.parse(date);
			}
		    var fn = date;
		    var wk = this.setting.dayNames, 
		        map={y:"getYear",Y:"getFullYear",M:"getMonth",d:"getDate",h:"getHours",m:"getMinutes",s:"getSeconds",D:"getDay"};
		    var val,p1f;
		    var _re =  /([yYMdhmsD]{1,4})/g;
		    return str.replace(_re,function(match,p1,offset,s){
		        p1f = p1.charAt(0);
		        if(!map[p1f]) return match;
		        val = fn[map[p1f]]();
		        p1f == 'y' && (val %= 100);
		        (p1f.toLowerCase() == 'y') && (p1.length == 4) && (val = fn[map['Y']]())
		        p1f == 'M' && val++;
		        p1f == 'D' && (val = wk[val]);
		        return val < 10 && p1.length > 1 ? _fn.fillLength(val,2) : String(val);
		    })
		},
		isDate: function(v) {
			if (v instanceof Date) {
				return true;
			}
			return false;
		},
	    stringify: function(v) {
	        if (!this.isDate(v)) return null;
	        return v.getFullYear() + '-' + this.filled(v.getMonth() * 1 + 1) + '-' + this.filled(v.getDate());
	    },
	    siblings: function(v, n) {
	        v = v.match(REG);
	        return this.stringify(new Date(v[0], v[1] - 1, v[2] * 1 + n * 1));
	    },
	    siblingsMonth: function(v, n) {
	        return new Date(v.getFullYear(), v.getMonth() * 1 + n);
	    },
	    filled: function(v) {
	        return String(v).replace(/^(\d)$/, '0$1');
	    },
	    parse: function(v) {
	        v = v.match(REG);
	        return v ? new Date(v[0], v[1] - 1, v[2]) : null;
	    },
	    differ: function(v1, v2) {
	        return parseInt(Math.abs(this.parse(v1) - this.parse(v2)) / 24 / 60 / 60 / 1000);
	    },
	    between:function(v1, v2){
	        return parseInt((this.parse(v1) - this.parse(v2)) / 24 / 60 / 60 / 1000);
	    }
	}
})();



var cacheLine = [
// task1
	{from:"BBB",to:"CAN"}, // 北京  广州
	{from:"CAN",to:"BBB"}, // 广州 北京
	{from:"CAN",to:"SSS"}, //      上海
	{from:"CAN",to:"WNZ"},  //     温州 
	{from:"CAN",to:"HGH"},  //      杭州
	{from:"HGH",to:"BBB"},

//task2
	{from:"HGH",to:"SZX"},
	{from:"SZX",to:"CSX"},
	{from:"SZX",to:"CKG"},
	{from:"SZX",to:"XMN"},
	{from:"SZX",to:"CTU"},
	{from:"SSS",to:"CAN"},
	{from:"WNZ",to:"CAN"},
	{from:"HGH",to:"CAN"},

// task3
	{from:"CAN",to:"BBB"},
	{from:"BBB",to:"CAN"},
	{from:"SZX",to:"BBB"},
	{from:"BBB",to:"SZX"}
],

cacheDate = (function(start,end){
	var cDate = [],len = DateUtil.between(end,start);
	for (var i = 0; i <= len; i++) {
		cDate[i] = DateUtil.siblings(start,i)
	};
	return cDate;
})("2013-11-1","2013-11-30");




var casper = require('casper').create({
	   //clientScripts:['http://code.jquery.com/jquery-1.9.1.js'],
	   waitTimeout: 10000
});


function isFunction(obj) {
    return typeof obj === 'function';
};

function formatText(msg, values, filter) {
    var pattern = /\{([\w\s\.\(\)"',-\[\]]+)?\}/g;
    return msg.replace(pattern, function(match, key) {
        var value = values[key] || eval('(values.' + key + ')');
        return isFunction(filter) ? filter(value, key) : value;
    });
}


var baseurl = "http://flight.itour.cn/0_{from}_{to}_{date}________1.html";
var pic = 0;


function openPage(line,date,callback){
	var url = formatText(baseurl,{
		from:line.from,
		to:line.to,
		date:date
	});
	
	casper.thenOpen(url,function(response){
		this.echo(url);
		this.echo(this.getTitle());
		this.capture("capture/"+ DateUtil.stringify(new Date) +"/task1/"+ (++pic) +'.png')
	});

	// casper.waitFor(function(){
	// 	    return this.evaluate(function() {
	// 	        return document.querySelector('#divContent').children.length > 0;
	// 	    });
	//    },function(){
	//    	this.captureSelector("capture/"+ line.from +"-" line.to + "-"+date +'.png', 'body')
	//    },function(){
	//    	this.echo("!timeout,I can't haz my screenshot.")
	//    });
}

function runQueen(line,date,before,callback){
	before();
	//var alltask = [];
	for (var i = 0; i < line.length; i++) {
		for (var j = 0; j < date.length; j++) {
			// alltask[i*j] = {
			// 	from:line[i].from,
			// 	to:line[i].to,
			// 	date:date[j],
			// 	url:formatText(baseurl,{
			// 		from:line[i].from,
			// 		to:line[i].to,
			// 		date:date[j]
			// 	})
			// }
			// console.log(alltask[i*j]);
			openPage(line[i],date[j])
		};
	};
	callback();
}




runQueen(cacheLine,cacheDate,function(){
		casper.start();
	},function(){
	//console.log(data);

	// casper.start().eachThen(data, function(response) {
	// 	this.thenOpen(response.data.url, function(response) {

	// 		casper.waitFor(function check() {
	// 			    return this.evaluate(function() {
	// 			        return $('#divContent').children().length > 0;
	// 			    })
	// 			},function then(){
	// 		    	this.captureSelector("capture/"+ line.from +"-" line.to + "-"+date +'.png', 'body')
	// 		    },function timeout(){
	// 		    	this.echo("!timeout,I can't haz my screenshot.")
	// 		    });
	// 	});
	// });
	casper.run();
})





