
/*
 * Author: Alan
 * Start Date: 2014-09-13
 * Last Update: 2015-10-30 15:14:46
 * */


(function () {
    if (!window.aUtils) window.aUtils ={ };

    aUtils.queryHeader = function (headers, key) {
        var reg = new RegExp(key + ': (.+)', 'i');
        var query = headers.match(reg);
        if (query && query[1]) {
            return query[1];
        } else {
            return null;
        }
    };

    aUtils.guid = function(version){
        var version1 = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        var version2 = function() {
            var value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return value;
        };
        if(version == 2) {return version2();}
        return version1();
    };


    String.format = function () {
        //String.format('name:{0}, age:{1}', 'alan', 'hehe')
        if (arguments.length == 0) return 'Are you kidding me?';
        if (arguments.length == 1) return arguments[0];
        var string = arguments[0];
        if (arguments.length >= 2) {
            var reg = /{(\d)}/g;
            var matched = string.match(reg);
            for (var i = 0; i < matched.length; i++) {
                var singleMatch = matched[i];
                var index = parseInt(singleMatch.substring(1, singleMatch.length - 1));
                string = string.replace(singleMatch, arguments[index + 1]);
            }
            return string;
        }
    };

    /*http://stackoverflow.com/questions/563406/add-days-to-datetime*/
    aUtils.addDays = function (date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    };

	aUtils.getValueBySafe = function(obj){
		if(!obj){ return obj; };
		var value = obj;
		for(var i = 1; i < arguments.length; i++){
			var propertyName = arguments[i];
			value = value[propertyName] || {};
		}
		return value;
	};

	/*
	 * 2015-10-20 14:59:38
	 * format string
	 * use:
	 * "Hello {fn}. My full name is {my}.".templ({fn:"Alan", ln:"Wei", my:function(){return this.fn + " " + this.ln;}}); 
	 * "Hello Alan. My full name is Alan Wei."
	 * */
	String.prototype.templ = function (json) {
        var args = arguments;
        var paras = Array.prototype.splice.call(args, 1, args.length - 1);

        var fnReg = /\{\{([\w\s\+\.\(\)'\-";]+)\}\}/g;
        var fnText = this.replace(fnReg, function(g0, g1) {
          var innerFunction =  new Function(g1);
          return innerFunction.apply(json, paras);
        });

        var placeHoldReg= /\{(\w+|\d*|_*)\}/g;
        return fnText.replace(placeHoldReg, function (g0, g1) {
            var value = json[g1];
            return typeof (value) === "function" ? value.apply(json, paras) : value;
        });
    };

	/*
	 * 2015-10-28 11:06:01
	 * Html Encode/Decode
	 * references: http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
	 * */
	String.htmlEncode = function(html){
		var element = document.createElement("div");
		var text = document.createTextNode(html);
		element.appendChild(text);
		return element.innerHTML;
	};
	
	String.htmlDecode = function(encodedHtml){
        var element = document.createElement("div");
        element.innerHTML = encodedHtml;
        return element.innerText;
	};
	
    String.getText = function(html) {
        var element = document.createElement("div");
        element.innerHTML = html;
        return element.innerText;
    };
})();

