///require aUtils.js
///require jquery.js


(function($) {
    if (!window.aUtils) window.aUtils = function () { };
    aUtils.jQuery = function () { }


    //Encapsulation ajax method
    $.ePost = function (url, data) {
        return $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contetntType: 'application/json',
            dataType: 'json'
        });
    };

    $.eJsonReq = function (userOpt) {
        var ajaxOpt = {
            contentType: 'application/json',
            dataType: 'json'
        };
        $.extend(ajaxOpt, userOpt);
        return $.ajax(ajaxOpt);
    };

    $.alanAjax = function (userOpt) {
        var options = {
            url: '',
            contentType: 'application/json',
            dataType: 'json',
            data: {},
            type: 'POST',
            done: function (data) { },
            fail: function () { }
        };

        if (userOpt) $.extend(options, userOpt);
        $.ajax(options)
            .done(options.done)
            .fail(options.fail);
    };



    $.fn.pagination = function (userOpt) {
        var defOpt = {
            id: 'pagination',
            klass: 'pagination',
            first: 'first',
            last: 'last',
            total: 5,
            selectedNumber: 1
        };

        $.extend(defOpt, userOpt);

        var $pages = $('<ul />').attr({
            'class': defOpt.klass,
            id: defOpt.id
        });
        if (defOpt.first) {
            $pages.append('<li class="' + defOpt.first + '"><a href="#">&laquo;</a></li>');
        }
        for (var i = 1; i < defOpt.total + 1; i++) {
            var $li = $('<li><a href="#">' + i + '</a></li>');
            if (i == defOpt.selectedNumber) {
                $li.addClass('active');
            }
            $li.data('page-number', i);
            $li.find('a').data('page-number', i);
            $pages.append($li);
        }
        if (defOpt.last) {
            $pages.append('<li class="' + defOpt.last + '"><a href="#">&raquo;</a></li>');
        }
        $pages.on('click', 'li', function () {
            var $li = $(this);
            $li.addClass('active').siblings('li').removeClass('active');

            if ($li.is(defOpt.first)) {
                $pages.trigger('first.pagination');
                return;
            }
            if ($li.is(defOpt.last)) {
                $pages.trigger('last.pagination');
                return;
            }
            var pageNumber = $li.data('page-number');
            $pages.trigger('page.pagination', [pageNumber]);
        });
        $('#' + defOpt.id).remove();
        this.append($pages);

        return this;
    };


    //move jquery object to screen center
    //html is optional parameter.
    $.prototype.moveCenter = function (html) {
        var $this = $(this);
        if (html) {
            $this.html(html);
        }
        var docW = $(window).width();
        var docH = $(window).height();
        var eleW = $this.outerWidth();
        var eleH = $this.outerHeight();

        var top = (docH - eleH) / 2;
        top = top >= 0 ? top : 0;
        var left = (docW - eleW) / 2;
        left = left >= 0 ? left : 0;
        $this.css({ position: 'fixed', 'left': left + 'px', 'top': top + 'px' });

        return this;
    };
    //show tips
    //html: inner html; duration: show time
    $.prototype.toTip = function (html, duration) {
        var $this = this;
        $this.moveCenter(html);
        this.fadeIn('slow', function () {
            if (!duration) duration = 1000;
            setTimeout(function () {
                $this.fadeOut('slow');
            }, duration);
        });
        return this;
    };

    //input validate
    $.prototype.alanValidate = function (userOpt) {
        var options = {
            initialValidate: false,
            regPosition: 'reg-exp',  //regular express position
            notPassClass: 'not-pass',    //not pass class name
            errorClass: 'error',     //not pass error class name
            rightClass: 'right',    //pass class name
            selector: 'input[type=text]',   //input selector
            errorNamePos: 'name',
            errorMsgPos: 'error-msg',
            keyup: true,            //listener keyup event
            blur: true,             //listener blur event
            validate: function (ele) {
                var $ele = $(ele);
                var regString = $ele.attr(this.regPosition);
                var value = $ele.val();
                var right = this.validateFn(regString, value, ele);

                if (!right) {
                    $ele.addClass(this.notPassClass).removeClass(this.rightClass);
                    if (this.initialValidate) $ele.addClass(this.errorClass);
                } else {
                    $ele.removeClass(this.errorClass).removeClass(this.notPassClass).addClass(this.rightClass);
                }

            },
            validateFn: function (regString, value, ele) {   //validate value
                try {
                    var reg = new RegExp(regString);
                    return reg.test(value)
                } catch (ex) {
                    return false;
                }
            }
        };

        if (userOpt) $.extend(options, userOpt);
        var $this = $(this);
        var inputs = $this.find(options.selector);

        inputs.each(function (index, ele) {
            var $input = $(ele);
            if ($input.attr(options.regPosition) != '') {
                //if (options.initialValidate) 
                options.validate(ele);

                if (options.keyup) {
                    //bind key up event
                    $input.bind('keyup', function () {
                        options.validate($(this));
                    });
                }
                if (options.blur) {
                    //bind key up event
                    $input.bind('blur', function () {
                        options.validate($(this));
                    });
                }
            }
        });

        options.initialValidate = true;

        return {
            ele: $this,
            'options': options,
            toValid: function () {
                var $notPassEles = this.ele.find('.' + this.options.notPassClass);
                var errorMsg = [];
                $notPassEles.each(function () {
                    errorMsg.push(String.format('{0}: {1}', $(this).attr(options.errorNamePos) || 'Input', $(this).attr(options.errorMsgPos) || 'Invalid'));
                });

                if ($notPassEles.length <= 0) return { valid: true, errors: $notPassEles, msg: [] };
                else return { valid: false, errors: $notPassEles, msg: errorMsg };
            }
        };
    }



    $.prototype.collectInfo = function (userOpt) {
        var option = {
            attr: 'name',
            selector: 'input'
        };
        $.extend(option, userOpt);

        var $this = this;
        var obj = {};
        $this.find(option.selector).each(function () {
            var $input = $(this);
            obj[$input.attr(option.attr)] = $input.val();
        });
        return obj;
    };
    $.prototype.fillInfo = function (info, userOpt) {
        var $this = $(this);
        var options = {
            attr: 'name',
            selector: 'input[type=text], select'
        };
        if ($.isPlainObject(userOpt)) $.extend(options, userOpt)
        $this.find(options.selector).each(function () {
            var name = $(this).attr(options.attr);
            var val = info[name];
            if (val) {
                $(this).val(info[name]);
            }
        });
        return this;
    };



    $.random = function (prefix) {
        var random = Math.random().toString().replace('.', '');
        return prefix + random;
    };
    $.toTip = function (html, duration, style, callback) {
        var defaultStyle = {
            display: 'none',
            padding: '10px',
            position: 'absolute',
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white',
            'font-family': 'sans-serif',
            fontSize: '15px',
            textAlign: 'center',
            'z-index': '999'
        };
        var $div = $('<div>');
        if (style) {
            if ($.isPlainObject(style)) $.extend(defaultStyle, style);      //style is json, rewrite style
            else $div.addClass(style);                                      //style is string(class name), add class
        }

        return $div.html(html).attr('id', $.random('id')).css(defaultStyle).appendTo('body').moveCenter().fadeIn('slow', function () {
            var timer = 1000;
            if ($.isNumeric(duration)) timer = parseFloat(duration);
            if (!isNaN(duration) && duration == -1) return;
            var $this = $(this);
            setTimeout(function () {
                $this.fadeOut('slow', function () {
                    $(this).remove();
                    if ($.isFunction(callback)) callback();
                });
            }, timer);
        });
    };
    $.prototype.popUpV1 = function (userOpt) {
        var option = {
            bgId: $.random('id'),
            bgClass: 'bgCurtain',
            duration: 0,
            style: {
                top: '0px',
                left: '0px',
                margin: '0px',
                display: 'none',
                width: '100%',
                height: '100%',
                position: 'fixed',
                backgroundColor: '#333',
                opacity: '.9',
                'z-index': '997'
            }
        };
        if ($.isPlainObject(userOpt)) $.extend(true, option, userOpt);

        var $thisContent = this;                        //popup form
        var $bg = $('<div>');                           //curtain

        //store position
        var $position = $(String.format('<div style="display: none;" id="{0}"></div>', $.random('id')));
        $thisContent.before($position);

        //store original css
        var oldCss = {
            display: $thisContent.css('display'),
            position: $thisContent.css('position'),
            left: $thisContent.css('left'),
            right: $thisContent.css('right'),
            'z-index': $thisContent.css('z-index')
        }


        if ($.isPlainObject(option.style)) $bg.css(option.style);        //option.style is json, rewrite style
        else $bg.addClass(option.style);                                //option.style is string(class name), $bg add class

        $thisContent.hide();
        $bg.append($thisContent).appendTo('body').addClass(option.bgClass).fadeIn(function () {
            $thisContent.css({ 'z-index': '998' }).moveCenter().fadeIn().bind('click.hide', function (event) {
                //$bg.trigger('click');
                event.stopPropagation();
                //return false;
            });

            //automatic remove
            if (option.duration) {
                setTimeout(function () {
                    $bg.trigger('click');
                }, option.duration);
            }

        }).one('click', function (event) {
            console.log(event.target);
            $thisContent.unbind('click.hide');
            $bg.fadeOut(function () {
                $thisContent.css(oldCss).hide().insertBefore($position);
                if (oldCss.display != 'none') $thisContent.fadeIn();
                $position.remove();
                $bg.remove();
            });
        });

        return this;
    };

    $.prototype.popUp = function (userOpt) {
        var option = {
            bgId: $.random('id'),
            bgClass: 'bgCurtain',
            duration: 0,
            canBubble: 'bubble',
            style: {
                top: '0px',
                left: '0px',
                margin: '0px',
                display: 'none',
                width: '100%',
                height: '100%',
                position: 'fixed',
                backgroundColor: '#333',
                opacity: '.9',
                'z-index': '997'
            }
        };
        if ($.isPlainObject(userOpt)) $.extend(true, option, userOpt);

        var $thisContent = this;                        //popup form
        var $bg = $('<div>');                           //curtain

        //store position
        var $position = $(String.format('<div style="display: none;" id="{0}"></div>', $.random('id')));
        $thisContent.before($position);

        //store original css
        var oldCss = {
            display: $thisContent.css('display'),
            position: $thisContent.css('position'),
            left: $thisContent.css('left'),
            right: $thisContent.css('right'),
            'z-index': $thisContent.css('z-index')
        }


        if ($.isPlainObject(option.style)) $bg.css(option.style);        //option.style is json, rewrite style
        else $bg.addClass(option.style);                                //option.style is string(class name), $bg add class

        $thisContent.hide();
        $bg.append($thisContent).appendTo('body').addClass(option.bgClass).fadeIn(function () {
            $thisContent.css({ 'z-index': '998' }).moveCenter().fadeIn();/*.bind('click.hide', function (event) {
                //$bg.trigger('click');
                //event.stopPropagation();
                //return false;
            });*/

            //automatic remove
            if (option.duration) {
                setTimeout(function () {
                    $bg.trigger('click');
                }, option.duration);
            }

        }).bind('click', function (event) {
            var $target = $(event.target);
            if ($target.hasClass(option.canBubble) || $target.is($bg)) {
                //$thisContent.unbind('click.hide');
                $bg.fadeOut(function () {
                    $thisContent.css(oldCss).hide().insertBefore($position);
                    if (oldCss.display != 'none') $thisContent.fadeIn();
                    $position.remove();
                    $bg.remove();
                });
            }
        });

        return this;
    };
    $.prototype.popUpClone = function (userOpt) {
        var option = {
            bgId: $.random('id'),
            bgClass: 'bgCurtain',
            style: {
                top: '0px',
                margin: '0px',
                left: '0px',
                display: 'none',
                width: '100%',
                height: '100%',
                position: 'fixed',
                backgroundColor: '#333',
                opacity: '.9',
                'z-index': '997'
            },
            fadeInTime: 1000,
            bgInCall: function () { },
            imgInCall: function () { },
            duration: 0
        }
        if ($.isPlainObject(userOpt)) $.extend(true, option, userOpt);


        var $thisContent = this.clone();                        //popup form
        var $bg = $('<div>');                           //curtain


        if ($.isPlainObject(option.style)) $bg.css(option.style);        //option.style is json, rewrite style
        else $bg.addClass(option.style);                                //option.style is string(class name), $bg add class

        $thisContent.hide();
        $bg.append($thisContent)
            .appendTo('body')
            .addClass(option.bgClass)
            .fadeIn(option.fadeInTime, function () {
                $thisContent
                    .css({ 'z-index': '998' })
                    .moveCenter()
                    .fadeIn(option.fadeInTime, function () { option.imgInCall(); })
                    .bind('click.hide', function (event) {
                        $bg.trigger('click');
                        return false;
                    });

                //automatic remove
                if (option.duration) {
                    setTimeout(function () {
                        $bg.trigger('click');
                    }, option.duration);
                }
                option.bgInCall($bg);
            }).one('click', function () {
                $thisContent.unbind('click.hide');
                $bg.fadeOut(function () {
                    $thisContent.remove();
                    $bg.remove();
                });
            });
        return this;    //if you want use $bg to do something, you can use like this: $(form).popUp().parent()....
    };

})(jQuery)