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
            event: "change",
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
                    images = images.split(",");
                }
                deferred.resolve(images);

            } else {
                promise = aUtils.File.upload($input[0], defOpt.uploadUrl);
            }

            $input.trigger("upload.autils", promise);

            if (promise) {
                promise.then(function (data) {
                    $input.trigger("complete.upload.autils", [data]);
                }, function () {
                    $input.trigger("fail.upload.autils", [promise]);
                });
            } else {
                $input.trigger("fail.upload.autils", ["no files"]);
            }
        });

    };

    aUtils.File.immediatelyUpload = function (element, userOpt) {
        var defOpt = {
            imgClass: "mask",
            inputClass: "mask",
            acceptMimeType: "image/*",
            multiple: true,
            uploadUrl: "",

            resetBtn: false,
            resetBtnClass: "reset",
            resetBtnText: "Reset",

            test: false,
            testImages: [],

            getImages: function (svrRetrunData, options) {
                return svrRetrunData;
            },

            complete: function (data, wrapper) { }
        };
        if (!element) {
            throw "error html element at aUtils.File.initial().";
        }
        var $wrapper = $(element);
        $.extend(defOpt, userOpt, $wrapper.data());

        //image upload complete
        $wrapper.on("complete.upload.autils", function (e, data) {

            var images = defOpt.getImages(data, defOpt);
            if (images) {
                //replace input with image
                $wrapper.find("input." + defOpt.inputClass).remove();
                $(images).find("img").addClass(defOpt.imgClass);
                $wrapper.append($(images));

                if (defOpt.resetBtn) {
                    var $resetBtn = $("<button />")
                        .attr({
                            'class': defOpt.resetBtnClass
                        })
                        .text(defOpt.resetBtnText);
                    $resetBtn.on("click", function () {
                        $wrapper.trigger("reset.upload.autils");
                    });
                    $wrapper.append($resetBtn);
                }
            } else {
                throw "error images source.";
            }
            defOpt.complete(data, $wrapper);

            $wrapper.trigger("done.file.autils", [data]);
        });

        //reset component
        $wrapper.on("reset.upload.autils", function () {
            //clear elements
            $wrapper.empty();

            //create input[type=file]
            var $input = $("<input type=\"file\" />")
                .attr({
                    'class': defOpt.inputClass,
                    'accept': defOpt.acceptMimeType,
                    'multiple': defOpt.multiple
                });
            $input.data(defOpt); //transfer parameter
            $wrapper.append($input); //append input
            aUtils.File.watch($input[0]);

            $wrapper.trigger("reseted.upload.autils");
        });

        $wrapper.trigger("reset.upload.autils");

        return $wrapper;
    };


    //Upload all images or iterator upload
    $.fn.aUtilsUpload = function (customerOption) {
        var $container = $(this);
        var option = {
            url: undefined,
            fileInput: "input[type=file]",
            fileGroup: ".upload-files",

            generateFileList: function (files) {
                var groupList = [];
                for (var i = 0; i < files.length; i++) {
                    var $file = $("<li />")
                        .addClass("list-group-item")
                        .data({ 'index': i, fileName: files[i].name })
                        .attr("title", files[i].name);

                    var $removeIcon = $("<i />").addClass("btn btn-danger btn-xs fa fa-remove");
                    $file.append($removeIcon);

                    (function (file, $ele) {
                        var reader = new FileReader();
                        var img = document.createElement("img");
                        img.title = file.name;
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            img.src = reader.result;
                        };
                        $ele.append(img);
                    })(files[i], $file);

                    groupList.push($file);
                }
                return groupList;
            }
        };
        $.extend(option, customerOption, $container.data());

        if (!option.url) { throw "Error option.url"; }

        //获取文件上传Url
        var getUploadUrl = function () {
            if ($.isFunction(option.url)) {
                return option.url();
            }
            return option.url;
        };


        var exportModule = {
            _files: [],
            getFiles: function () {
                return this._files;
            },
            addFile: function (f) {
                this._files.push(f);
                return this;
            },
            removeFile: function (fileName) {
                for (var i = 0; i < this._files.length; i++) {
                    if (this._files[i].name === fileName) {
                        this._files.splice(i, 1);
                    }
                }
                return this;
            },
            removeFiles: function (fileNames) {
                fileNames = fileNames || [];
                for (var i = 0; i < fileNames.length; i++) {
                    this.removeFile(fileNames[i]);
                }
                return this;
            },
            removeAll: function () {
                this._files = [];
            },
            eachUpload: function (callback) {
                var files = this.getFiles();
                for (var i = 0; i < files.length; i++) {
                    var promise = aUtils.File.uploadCore([files[i]], getUploadUrl());
                    callback(promise, i, files, option);
                }
            },
            allUpload: function (callback) {
                var files = this.getFiles();
                var promise = aUtils.File.uploadCore(files, getUploadUrl());
                callback(promise, files, option);
            }
        };
        this.aUtilsExport = exportModule;


        $container
            .on("change", option.fileInput, function () {
                exportModule.removeAll();
                for (var i = 0; i < this.files.length; i++) {
                    exportModule.addFile(this.files[i]);
                }
                $(option.fileGroup).empty().append(option.generateFileList(exportModule.getFiles()));
            })
            //移除文件
            .on("removefile.files", function (e, fileIds) {
                exportModule.removeFiles(fileIds);
            })
            //上传所有文件
            .on("uploadall.files", function () {
                exportModule.allUpload(function () {
                    $container.trigger("all.upload", arguments);
                });
            })
            //单独上传
            .on("uploadeach.files", function () {
                exportModule.eachUpload(function () {
                    $container.trigger("each.upload", arguments);
                });
            });

        return this;

    };

})();
