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

    aUtils.File.upload = function (fileInput, url) {
        if (!url) {
            throw new Error('url error at aUtils.File.upload().');
        }
        if (fileInput.files.length) {
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
        } else {
            return false;
        }
    };


    aUtils.File.watch = function (fileInput, userOpt) {
        var defOpt = {
            event: 'change',
            uploadUrl: undefined
        };
        $.extend(defOpt, userOpt, $(fileInput).data());

        $(fileInput).on(defOpt.event, function () {
            var $input = $(this);

            var promise = undefined;
            if (defOpt.test) {
                var deferred = $.Deferred();
                promise = deferred.promise();
                var images = defOpt.testImages;
                if (!$.isArray(images)) {
                    images = images.split(',');
                }
                deferred.resolve(images);

            } else {
                promise = aUtils.File.upload($input[0], defOpt.uploadUrl);
            }

            $input.trigger('upload.autils', promise);

            if (promise) {
                promise.then(function (data) {
                    $input.trigger('complete.upload.autils', [data]);
                }, function () {
                    $input.trigger('fail.upload.autils', [promise]);
                });
            } else {
                $input.trigger('fail.upload.autils', ['no files']);
            }
        });

    };

    aUtils.File.initial = function (element, userOpt) {
        var defOpt = {
            imgClass: 'mask',
            inputClass: 'mask',
            acceptMimeType: 'image/*',
            multiple: true,
            uploadUrl: '',

            resetBtn: false,
            resetBtnClass: 'reset',
            resetBtnText: 'Reset',

            test: false,
            testImages: [],

            getImages: function (svrRetrunData, options) {
                return svrRetrunData;
            },

            complete: function (data, wrapper) { }
        };
        if (!element) {
            throw 'error html element at aUtils.File.initial().';
        }
        var $wrapper = $(element);
        $.extend(defOpt, userOpt, $wrapper.data());

        //image upload complete
        $wrapper.on('complete.upload.autils', function (e, data) {

            var images = defOpt.getImages(data, defOpt);
            if (images) {
                //replace input with image
                $wrapper.find('input.' + defOpt.inputClass).remove();
                $(images).find('img').addClass(defOpt.imgClass);
                $wrapper.append($(images));

                if (defOpt.resetBtn) {
                    var $resetBtn = $('<button />')
                        .attr({
                            'class': defOpt.resetBtnClass
                        })
                        .text(defOpt.resetBtnText);
                    $resetBtn.on('click', function () {
                        $wrapper.trigger('reset.upload.autils');
                    });
                    $wrapper.append($resetBtn);
                }
            } else {
                throw 'error images source.';
            }
            defOpt.complete(data, $wrapper);

            $wrapper.trigger('done.file.autils', [data]);
        });

        //reset component
        $wrapper.on('reset.upload.autils', function () {
            //clear elements
            $wrapper.empty();

            //create input[type=file]
            var $input = $('<input type="file" />')
                .attr({
                    'class': defOpt.inputClass,
                    'accept': defOpt.acceptMimeType,
                    'multiple': defOpt.multiple
                });
            $input.data(defOpt);        //transfer parameter
            $wrapper.append($input);    //append input
            aUtils.File.watch($input[0]);

            $wrapper.trigger('reseted.upload.autils');

        });

        $wrapper.trigger('reset.upload.autils');

        return $wrapper;
    }

})();
