/**
 * Created by Alan on 9/22/2014.
 */


(function () {
    if (!window.aUtils) window.aUtils = {};

    aUtils.Url = {};
    aUtils.Url.getAll = function (url) {
        var search = location.search.replace('?', '');
        if (url) {
            search = url.split('?')[1];
        }
        if (!url) {
            throw  new Error('cannot find search parameter.');
        }

        var paras = search.split('&');
        var retParas = {};
        for (var i = 0; i < paras.length; i++) {
            var para = paras[i];
            var keyValues = para.split('=');
            var key = keyValues[0];
            var value = decodeURI(keyValues[1]);
            retParas[key] = value;
        }
        return retParas;
    };
    aUtils.Url.query = function(key, url){
        var params = aUtils.Url.getAll(url);
        return params[key];
    }
})();