
/*
 * Author: Alan
 * Start Date: 2014-09-13
 * Last Update: 2014-09-13
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
    }

    /*http://stackoverflow.com/questions/563406/add-days-to-datetime*/
    aUtils.addDays = function (date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
})();



/*
Example:

(function () {
    if (!window.aUtils) window.aUtils = function () { };
})();
*/

