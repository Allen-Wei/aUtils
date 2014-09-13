
/*
 * Author: Alan
 * Start Date: 2014-09-13
 * Last Update: 2014-09-13
 * */


(function () {
    if (!window.aUtils) window.aUtils = function () { };

    aUtils.queryHeader = function (headers, key) {
        var reg = new RegExp(key + ': (.+)', 'i');
        var query = headers.match(reg);
        if (query && query[1]) {
            return query[1];
        } else {
            return null;
        }
    };

})();



/*
Example:

(function () {
    if (!window.aUtils) window.aUtils = function () { };
})();
*/

