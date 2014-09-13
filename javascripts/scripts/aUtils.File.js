///require aUtils.js
///require jquery.js
/*
* Author: Alan
* Start Date: 2014-09-13
* Last Update: 2014-09-13
* */


(function () {
    if (!window.aUtils) window.aUtils = function () {
    };
    aUtils.File = function () {};

    /*
    * fileInput:    input[type=file] element
    * url:          upload url
    * */
    aUtils.File.upload = function (fileInput, url) {
        if (!url) {
            throw new Error('url error.');
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

    /*
    * event:        event type
    * url:          upload url
    * test:         test upload
    * testImage:    test upload image url
    * */
    aUtils.File.watch = function (fileInput, userOpt) {
        var defOpt = {
            event: 'change',
            url: undefined,
            test: false,
            testImage: ''
        };
        $.extend(defOpt, userOpt, $(fileInput).data());

        $(fileInput).on(defOpt.event, function () {

            var $input = $(this);

            if (defOpt.test) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                $input.trigger('upload.file.autils', promise);
                promise.done(function(data){
                    $input.trigger('complete.upload.file.autils', [data, promise]);
                });
                deferred.resolve({upload: true, msg: defOpt.testImage});

            } else {
                var promise = aUtils.File.upload($input[0], defOpt.url);
                $input.trigger('upload.file.autils', promise);

                if (promise) {
                    promise.success(function (data) {
                        $input.trigger('complete.upload.file.autils', [data, promise]);
                    });
                    promise.fail(function () {
                        $input.trigger('fail.upload.file.autils', ['server fail', promise]);
                    });
                } else {
                    $input.trigger('fail.upload.file.autils', ['no files']);
                }
            }
        });


    };

    /*
    * imgClass:         uploade image class
    * inputClass:       input[type=file] class
    * acceptMimeType:   input can accepted mime type
    * resetBtn:         show reset button when uploaded
    * resetBtnClass:    reset button class
    * resetBtnText:     reset button text
    * */
    aUtils.File.initial = function (element, userOpt) {
        var defOpt = {
            imgClass: 'mask',
            inputClass: 'mask',
            acceptMimeType: 'image/*',
            resetBtn: false,
            resetBtnClass: 'reset',
            resetBtnText: 'Reset',
            handleData: function (svrRetrunData) {
                return svrRetrunData;
            },
            complete: function (data, wrapper) {
            }
        };
        var $wrapper = $(element);
        $.extend(defOpt, userOpt, $wrapper.data());

        //image upload complete
        $wrapper.on('complete.file.autils', function (e, data) {
            var imgSrc = defOpt.handleData(data);
            if (imgSrc) {
                //replace input with image
                var $input = $wrapper.find('input.' + defOpt.inputClass);
                var $img = $('<img />').attr('src', imgSrc).addClass(defOpt.imgClass);
                $input.replaceWith($img);

                if (defOpt.resetBtn) {
                    var $resetBtn = $('<button />')
                        .attr({
                            'class': defOpt.resetBtnClass
                        })
                        .text(defOpt.resetBtnText);
                    $resetBtn.on('click', function () {
                        $wrapper.trigger('reset.file.autils');
                    });
                    $wrapper.append($resetBtn);
                }
            }
            defOpt.complete(data, $wrapper);
            $wrapper.trigger('completed.file.autils', [data]);

        });

        //reset component
        $wrapper.on('reset.file.autils', function () {
            //clear elements
            $wrapper.find('img.' + defOpt.imgClass.split(' ')[0]).remove();
            $wrapper.find('input.' + defOpt.inputClass.split(' ')[0]).remove();
            $wrapper.find('button.' + defOpt.resetBtnClass.split(' ')[0]).remove();

            //create input[type=file]
            var $input = $('<input type="file" />')
                .attr({
                    'class': defOpt.inputClass,
                    'accept': defOpt.acceptMimeType
                });
            $input.data(defOpt);        //transfer parameter
            $wrapper.append($input);    //append input
            aUtils.File.watch($input[0]);

            $input.on('complete.upload.file.autils', function (e, data) {
                $wrapper.trigger('complete.file.autils', [data]);
            });

        });

        $wrapper.trigger('reset.file.autils');
    }
})();

