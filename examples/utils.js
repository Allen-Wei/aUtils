/// <reference path="jquery-1.9.1.js" />

/**
 * JavaScript 实用函数
 * 
 */

if (!Array.prototype.reduce) {
    /**
     * 数组迭代
     * @param {function} callback (prev, current, currentIndex)
     */
    Array.prototype.reduce = function (callback /*, initialValue*/) {
        'use strict';
        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}


/**
 * format string
 * @example
 * "Hello {fn}. My full name is {my}.".templ({fn:"Alan", ln:"Wei", my:function(){return this.fn + " " + this.ln;}}); 
 * "Hello Alan. My full name is Alan Wei."
 * 
 * */
String.prototype.templ = function (json) {
    var args = arguments;
    var paras = Array.prototype.splice.call(args, 1, args.length - 1);

    var fnReg = /\{\{([\w\s\+\.\(\)'\-";]+)\}\}/g;
    var fnText = this.replace(fnReg, function (g0, g1) {
        var innerFunction = new Function(g1);
        return innerFunction.apply(json, paras);
    });

    var placeHoldReg = /\{(\w+|\d*|_*)\}/g;
    return fnText.replace(placeHoldReg, function (g0, g1) {
        var value = json[g1];
        return typeof (value) === "function" ? value.apply(json, paras) : value;
    });
};

/**
 * 将日期字符串转换成日期(如果有formatter参数, 最后返回格式化后的日期字符串)
 * 支持格式: 
 * /Date(1467648000000)/
 * 
 */
String.prototype.dateParse = function (formatter) {
    //var regex = /^\/Date\((\d+)\)\/$/;
    var regex = undefined,
        date = undefined,
        numbers = undefined;
    if ((regex = /^\/Date\(-\d+\)\/$/).test(this)) {
        //format: /Date(-1467648000000)/
        date = new Date(0);
    } else if ((regex = /^\/Date\((\d+)\)\/$/).test(this)) {
        //format: /Date(1467648000000)/
        numbers = parseFloat(regex.exec(this)[1]);
        date = new Date(numbers);
    } else if ((regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/).test(this)) {
        //format: 8/26/2016
        numbers = this.split("/");
        var month = parseInt(numbers[0]) - 1,
            day = parseInt(numbers[1]),
            year = parseInt(numbers[2]);
        date = new Date(year, month, day);
    } else if ((regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/).test(this)) {
        //format: 2016/8/26
        numbers = this.split("/");
        var month = parseInt(numbers[1]) - 1,
            day = parseInt(numbers[2]),
            year = parseInt(numbers[0]);
        date = new Date(year, month, day);
    } else {
        date = new Date(this);
        if (date.toString() === "Invalid Date") {
            console.warn("error date string");
            return this;
        }
    }

    if (date && arguments.length > 0) {
        return date.dateParse(formatter);
    }
    return date;
};


/**
 * 字符串是否以某个字符开始
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (char) {
        if (this.length === 0) return false;
        if (typeof char !== "string") return false;
        if (this.length < char.length) return false;
        if (this.indexOf(char) === -1) return false;

        return this.indexOf(char) === 0;
    };
}
/**
 * 字符串是否以某个字符结束
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (char) {
        if (this.length === 0) return false;
        if (typeof char !== "string") return false;
        if (this.length < char.length) return false;
        if (this.indexOf(char) === -1) return false;

        return this.indexOf(char) === (this.length - char.length);
    };
}
/**
 * 
 * 递归去除首尾字符串
 * @example String.trimChars("row char.", ".", "r") => "ow cha"
 * @param {string} str 原始字符串
 * @returns {} 
 * 
 */
String.trimChars = function (str) {
    if (typeof str !== "string") return str;
    if (arguments.length < 2) return str;

    var chars = Array.prototype.slice.apply(arguments, [1, arguments.length]);
    $.each(chars, function (index, char) {
        if (typeof char !== "string") return;

        while (str.startsWith(char)) {
            str = str.substr(char.length, str.length - 1);
        }
        while (str.endsWith(char)) {
            str = str.substr(0, str.length - char.length);
        }
    });

    return str;
};


/**
 * 日期格式化
 * new Date(2016, 6, 7, 8, 9, 10).dateParse("{years}-{months}-{days} {hours}:{minutes}:{seconds}")   =>  "2016-07-04 08:09:10"
 * new Date(2016, 6, 7, 8, 9, 10).dateParse("{year}-{month}-{day} {hour}:{minute}:{second}")        =>  "16-7-4 8:9:10"
 * 
 */
Date.prototype.dateParse = function (formatter) {

    var data = {
        year: this.getFullYear().toString().substr(2, 2),
        month: this.getMonth() + 1,
        day: this.getDate(),
        hour: this.getHours(),
        minute: this.getMinutes(),
        second: this.getSeconds()
    };
    $.each(["month", "day", "hour", "minute", "second"], function (index, key) {
        //data.months = data.month.toString().length === 1 ? "0" + data.month : data.month;
        //data.days = data.day.toString().length === 1 ? "0" + data.day : data.day;
        //data.hours = data.hour.toString().length === 1 ? "0" + data.hour : data.hour;
        //data.minutes = data.minute.toString().length === 1 ? "0" + data.minute : data.minute;
        //data.seconds = data.second.toString().length === 1 ? "0" + data.second : data.second;
        data[key + "s"] = data[key].toString().length === 1 ? "0" + data[key] : data[key];
    });
    data.years = this.getFullYear();

    return (formatter || "").templ(data);
};

/**
 * jQuery元素迭代
 */
$.fn.reduce = function (callback, initial) {
    return $(this.toArray().reduce(callback, initial));
};

/**
 * 函数节流
 * 
 */
Function.prototype.throttle = function (delay) {
    var fn = this,
        timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn();
        }, delay);
    };
};
/**
 * 函数节流 (立即执行)
 * 
 */
Function.prototype.throttleInstance = function (delay) {
    this.throttle(delay)();
};

/**
 * 借助animate.css实现的动画效果
 * @param {string} animationName 动画的名称, 多个以空格分隔
 * @returns {} 
 */
$.fn.animateCss = function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
    });
};

//修改 underscore 模板匹配
if (_) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
}

/**
 * 异步表单提交请求下载文件
 * @param {userOpt} userOpt {url: 下载地址, method: get/post, inputs: 表单, parameters: 参数}
 * @example 
 *      $.formDownload({url: "/Api/SingleFileDownload"});
 *      $.formDownload({url: "/Api/DownloadWithParameters", method:"post", parameters: {Year: 2016, Month: 15, ContractNum: "2309480345jiafe"}});
 *      $.formDownload({url: "/Api/DownloadWithParameters", method:"post", inputs: ".other-form input, .other-form select"});
 * 
 */
$.formDownload = function (userOpt) {
    var defOpt = {
        url: undefined,             // ajax url
        method: "post",
        inputs: undefined,          // input selector
        parameters: undefined       // plain object
    };
    var appendParas = {
        _isExportExcel: true,
        begin: 1,
        end: 30000
    };

    $.extend(defOpt, userOpt);

    if (!defOpt.url) throw "下载请求地址不能为空";
    var $form = $("<form />").attr({
        method: defOpt.method,
        action: defOpt.url
    }).css({
        display: "none"
    });


    if (defOpt.inputs) {
        $(defOpt.inputs).each(function () {
            var name = $(this).attr("name");
            var value = $.trim($(this).val());
            if ($(this).is("select") && value === "-1") { return; }
            $("<input />").attr("name", name).val(value).appendTo($form);
        });
    }
    if (defOpt.parameters) {
        for (var key in defOpt.parameters) {
            $("<input />").attr("name", key).val(defOpt.parameters[key]).appendTo($form);
        }
    }
    for (var append in appendParas) {
        $("<input />").attr("name", append).val(appendParas[append]).appendTo($form);
    }

    $form.appendTo("body")
        .asyncSubmitForm()
        .then(function (response) {
            if (String.trimChars(response, " ")) {
                alert(response);
            }
            $form.remove();
        });
};


/*
 * 异步提交表单(兼容IE 8)
 * 
 */
$.fn.asyncSubmitForm = function () {
    var $form = $(this);
    if (!$form.is("form")) throw "$.fn.asyncSubmitForm: error element.";

    if (!$form.attr("method")) console.warn("form no method");
    if (!$form.attr("enctype")) console.warn("form no enctype");
    if (!$form.attr("action")) console.warn("form no action");

    var defer = $.Deferred();

    var frameName = "iframe" + Date.now();
    var $iframe = $("<iframe />").attr({ "name": frameName, "id": frameName }).hide();
    $form.append($iframe);
    $form.attr({ "target": frameName });
    $form.submit();

    $iframe.on("load", function () {
        var text = $iframe[0].contentWindow.document.body.innerText;
        defer.resolve(text);
        setTimeout(function () {
            try {
                $iframe.remove();
            } catch (ex) {
                console.warn("iframe remove failed.");
            }

        }, 500);
    });
    return defer.promise();
};