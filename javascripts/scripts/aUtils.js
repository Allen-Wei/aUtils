
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

})();



/*
Example:

(function () {
    if (!window.aUtils) window.aUtils = function () { };
})();
*/

