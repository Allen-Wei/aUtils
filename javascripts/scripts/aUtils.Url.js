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
        if (!search) {
            console.log('cannot find search parameter.');
            return {};
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
    aUtils.Url.query = function (key, url) {
        var params = aUtils.Url.getAll(url);
        return params[key];
    }
    aUtils.Url.path = function (index) {
        var urls = location.href
            .replace('http://' + location.host, '')
            .replace(location.search, '')
            .replace(location.hash, '')
            .split('/');

        var array = [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (url) {
                array.push(url);
            }
        }
        if (index === 0 || index) {
            if (index >= 0) {
                return array[index];
            }
            if (index < 0) {
                return array[array.length + index];
            }
            throw new Error('index is error');
        }
        return array;
    };
})();