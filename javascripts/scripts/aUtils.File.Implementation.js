/**
 * Created by lenovo on 2015/4/15.
 * Author Alan Way
 * Email alan.wei@live.com
 */


//require aUtils.File.js


(function () {
    //Upload all images with

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

    aUtils.File.immediatelyUpload= function (element, userOpt) {
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
            $input.data(defOpt); //transfer parameter
            $wrapper.append($input); //append input
            aUtils.File.watch($input[0]);

            $wrapper.trigger('reseted.upload.autils');

        });

        $wrapper.trigger('reset.upload.autils');

        return $wrapper;
    };






    //Upload all images or iterator upload
    $.fn.aUtilsUpload = function (customerOption) {
        var $container = $(this);
        var option = {
            url: undefined,
            fileInput: 'input[type=file]',
            eachBtn: '.upload-each',
            allBtn: '.upload-all',
            fileGroup: '.upload-files',

            generateFileList: function (files) {
                var $group = $('<ul />').addClass('list-group');
                for (var i = 0; i < files.length; i++) {
                    var $file = $('<li />').addClass('list-group-item').append($('<span />').text(files[i].name));
                    $file.append($('<i />').addClass('btn btn-default btn-xs fa fa-remove pull-right').text('')).data('index', i);
                    $group.append($file);
                }
                return $group;
            }
        };
        $.extend(option, customerOption, $container.data());

        if(!option.url){throw 'Error option.url';}
        
        var uploadFiles = [];

        $container.on('change', option.fileInput, function () {
            uploadFiles = [];
            for (var i = 0; i < this.files.length; i++) {
                uploadFiles.push(this.files[i]);
            }
            console.log(uploadFiles);
            $(option.fileGroup).empty().append(option.generateFileList(uploadFiles));

        }).on('removefile.files', function (e, fileIds) {
            if (!fileIds || !$.isArray(fileIds)) {
                throw 'Error parameter at listen removefile.files event.';
            }
            var willRemovedIndex = [];
            for (var i = 0; i < uploadFiles.length; i++) {
                for (var j = 0; j < fileIds.length; j++) {
                    var id = fileIds[j];
                    var match = false;
                    if ($.isNumeric(id)) {
                        if (i === id) { match = true; }
                    } else {
                        if (uploadFiles[i].name === id) { match = true; }

                    }
                    if (match) {
                        willRemovedIndex.push(i);
                    }
                }
            }
            var temporaryFiles = [];
            for (i = 0; i < uploadFiles.length; i++) {
                if (willRemovedIndex.indexOf(i) === -1) {
                    temporaryFiles.push(uploadFiles[i]);
                }
            }
            uploadFiles = temporaryFiles;
        }).on('click', option.allBtn, function () {
            var promise = aUtils.File.uploadCore(uploadFiles, option.url);
            $(this).trigger('allupload.upload', [promise, uploadFiles, option]);
        }).on('click', option.eachBtn, function () {

            for (var i = 0; i < uploadFiles.length; i++) {
                var promise = aUtils.File.uploadCore([uploadFiles[i]], option.url);
                $(this).trigger('eachupload.upload', [promise, i, uploadFiles, option]);
            }

        });

        return this;

    };
})();
