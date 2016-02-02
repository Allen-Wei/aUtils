# aUtils
aUtils for JavaScript
### 2015-09-11 新增EventEmit事件发布订阅
 事件发布订阅插件 [EventEmit](https://raw.githubusercontent.com/Allen-Wei/aUtils/gh-pages/javascripts/scripts/aUtils.EventEmit.js) 
2015-09-12 利用EventEmit插件写的一个数据双向绑定的demo [TwoWayDataBind](http://allen-wei.github.io/aUtils/examples/TwoWayDataBind.html). 
EventEmit事件插件和双向绑定demo都是使用原生JS写的, 不需要依赖jQuery等库. 不过有一定兼容性问题(其实在这个例子里稍微修改一下代码就可以兼容IE6+).

### 2016-02-02 18:21:54 更新发布订阅插件
新增一个函数的 [aUtils.EventBase](https://raw.githubusercontent.com/Allen-Wei/aUtils/gh-pages/javascripts/scripts/aUtils.EventBase.js), 这个新的发布订阅是一个函数, 可以被用来继承, 类似于NodeJS里的EventEmit.

	var component = function(){
		/*在这里做一些其它事情*/

		var exportsFn = function(){};
		aUtils.EventBase.implement(exports);//这样exports拥有的on/emit的发布订阅能力了, 能够提高组件的低耦合.

		var exports = new exportsFn();
		exports.emit("update", this, "else arguments");
		exports.on("change", function(arg1, arg2){
			//这是外部来的事件.
		});


		return new exports();
	}
