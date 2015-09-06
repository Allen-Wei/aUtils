/**
 * Created by Alan on 9/22/2014.
 */


(function () {
    if (!window.aUtils) window.aUtils = {};

    aUtils.Url = {
		  info: function (url) {

            var href = url || location.href;

            var result = {
                host: location.host,
                hash: location.hash.replace("#", ""),
                paths: [],
                absoluteUrl: "",
                hashValue: "",
                searchString: "",
                searchStrings: "",
                params: {}
            };
            var httpRegex = new RegExp("^http(s)?://");
            href = href.replace(httpRegex, "");   //去除协议
            var hostEndIndex = href.indexOf("/");
            if (hostEndIndex >= 0) {
                result.host = href.substr(0, hostEndIndex);
            } else {
                result.host = href;
                return result;
            }

            var hostRegex = new RegExp("^" + result.host + "/");
            var noHostAddress = href.replace(hostRegex, "");

            //absolute URL
            var questionMaskPosition = noHostAddress.indexOf("?");  //问号的位置
            if (questionMaskPosition >= 0) {
                result.absoluteUrl = noHostAddress.substr(0, questionMaskPosition);
            }
            result.paths = result.absoluteUrl.split("/");

            //Hash
            var hashPosition = noHostAddress.indexOf("#");
            if (hashPosition >= 0) {
                result.hashValue = noHostAddress.substr(hashPosition + 1, noHostAddress.length - 1);
            }

            //search
            if (questionMaskPosition >= 0) {
                result.searchString = noHostAddress.substring(questionMaskPosition + 1, hashPosition === -1 ? noHostAddress.length - 1 : hashPosition);
            }
            result.searchStrings = result.searchString.split("&");
            for (var i = 0; i < result.searchStrings.length; i++) {
                var keyValue = result.searchStrings[i].split("=");
                result.params[keyValue[0].toLowerCase()] = decodeURIComponent(keyValue[1]);
            }

            return result;
        },
        getAll: function (url) {
            return this.info(url).params;
        },
        query: function (key, url) {
            key = (key || "").toLowerCase();
            var params = this.getAll(url);
            return params[key];
        },
        path: function (index, inUrl) {
            var array = this.info(inUrl).paths;

            if (index === 0 || index) {
                if (index >= 0) {
                    return array[index];
                }
                if (index < 0) {
                    return array[array.length + index];
                }
                throw new Error("index is error");
            }
            return array;
        }
	};
})();
