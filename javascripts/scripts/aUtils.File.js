///require aUtils.js
///require jquery.js
/*
 * Author: Alan
 * Start Date: 2014-09-13
 * Last Update: 2015-03-16

 * events:
 * upload.autils            => Start uploading file
 * complete.upload.autils   => Upload file completed
 * fail.upload.autils       => Upload file failed
 * reset.upload.autils      => Reset
 * */


(function () {

    if (!window.aUtils) window.aUtils = function () { };
    aUtils.File = function () { };


    aUtils.File.uploadCore = function (files, url) {
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            data.append(file.name, file);
        }
        return $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: false,
            processData: false,
            cache: false
        });
    };

    aUtils.File.upload = function (fileInput, url) {
        if (!url) {
            throw new Error('url error at aUtils.File.upload().');
        }
        if (fileInput.files.length) {
            return aUtils.File.uploadCore(fileInput.files, url);
            /*
             var data = new FormData();
             var files = fileInput.files;
             for (var i = 0; i < files.length; i++) {
             var file = files[i];
             data.append(file.name, file);
             }
             return $.ajax({
             type: 'POST',
             url: url,
             data: data,
             contentType: false,
             processData: false,
             cache: false
             });
             */
        } else {
            return false;
        }
    };


})();