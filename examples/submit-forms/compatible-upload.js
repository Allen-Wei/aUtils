


/**
 * 
 * 兼容IE8的文件上传
 * 
 * html
 * <form id="form" action="/UploadFileUrl" enctype="multipart/form-data" method="post">
 *      <input type="file" name="name-is-required" />
 * </form>
 * 
 * javascript
 * var hook = CompatibleUpload("#form");
 * hook.upload().then(function(response){
 *      //handle resposne content
 * });
 * 
 * note
 * 1. 表单action的响应的Content-Type最好是text/plain(也就是IE可以解析显示的), 不可以是application/json, 这个低版本的IE下会提示下载.
 * 2. 一般情况下会把上传绑定到一个按钮上, 这个按钮最好不要是button或者一个input[type=button/submit]之类的, 这会触发浏览器的默认提交表单.
 */

(function (global) {
    var component = function (form) {

        var $form = $(form);

        var hook = {
            upload: function () {

                var defer = $.Deferred();

                var $iframeContainer = $("<div />");
                var iframeName = "upload-" + Date.now();
                var $iframe = $("<iframe class='for-upload' name='" + iframeName + "' />");
                $iframe.prop("allowtransparancy", true);
                $iframeContainer.append($iframe);
                $form.append($iframeContainer);
                $iframeContainer.hide();

                $form.attr({
                    target: iframeName
                });

                $iframe.on("load", function () {
                    var text = $.trim($iframe[0].contentDocument.body.innerText);
                    if (text) {
                        $form.trigger("response", [{ response: text }]);
                        defer.resolve(text);
                    } else {
                        defer.reject();
                    }
                    $iframeContainer.remove();
                });

                $form.submit();
                return defer.promise();
            }
        };


        return hook;
    };

    if (global.define && global.define.amd) {
        define(["require", "exports"], function (require, exports) {
            return component;
        });
    } else {
        global.CompatibleUpload = component;
    }

})(window);
