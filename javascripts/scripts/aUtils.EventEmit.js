/*
 * Author: Alan Wei
 * Email: Alan.Wei@live.com
 * 
 * Support IE6+
 * Create: 2015-09-11 18:32:32
 * Update: 2015-09-11 18:32:39
*/

(function () {
	if (!window.aUtils) window.aUtils = function () { };

	var eventStore = {
		exampleEventName: [{
			id: "用于监听标识, 主要用于注销事件.",
			callback: function () { /*回调*/ },
			current: {}, /*回调执行时的当前对象*/
			one: false /*是否是一次性监听*/
		}]
	};

	aUtils.EventEmit = {
		getEventStore: function () {
			return eventStore;
		},
		/*
		 * 触发事件
		 * eventName: 事件名称
		 * current: 设置回调的this对象
		 * 
		 * 剩余的参数将会被依次传递到回调函数里
		*/
		emit: function (eventName, current) {
			var events = eventStore[eventName];
			if (!events || events.length <= 0) { return; }
			for (var i = 0; i < events.length; i++) {
				var evt = events[i];
				var callabck = evt.callback || function () { };
				var args = Array.prototype.slice.call(arguments, 2, arguments.length);
				/*如果注册时事件传递了current, 则回调函数的当前对象为注册时传递的current*/
				try {
					callabck.apply(evt.current || current, args);
				} catch (ex) { }
				if (evt.one) {
					events.splice(i, 1);
				}
			}
		},

		/*
		 * 监听事件
		 * eventName: 事件名称
		 * callback: 事件触发时执行的回调
		 * id: 事件唯一标识(主要用于off注销事件时使用, 可选)
		 * current: 注册时传递的当前对象(可选)
		 * isOne: 是否是一次性事件(可选)
		*/
		on: function (eventName, callback, eventId, current, isOne) {
			if (eventStore[eventName] === undefined) {
				eventStore[eventName] = [];
			}
			var events = eventStore[eventName];
			if (eventId) {
				/* 如果传递了 eventId, 通过赋值的方式注册事件, 这意味着在事件的注册表里, 同一个事件标识只能出现一次. */
				for (var i = 0; i < events.length; i++) {
					if (events[i]["id"] === eventId) {
						events[i] = {
							id: eventId,
							callback: callback,
							current: current,
							one: !!isOne
						};
						return;
					}
				}

			}
			events.push({
				id: eventId || Date.now(),
				callback: callback,
				current: current,
				one: !!isOne
			});
		},

		/*
		 * 一次性监听事件
		*/
		one: function (eventName, callback, eventId, current) {
			this.on(eventName, callback, eventId, current, true);
		},
		/*
		 * 注销事件
		 * eventName: 事件名称
		 * eventId: 事件Id(on注册事件时传递的唯一值)
		*/
		off: function (eventName, eventId) {
			var events = eventStore[eventName];
			if (!events || events.length <= 0) { return; }
			if (arguments.length == 1) {
				/*如果没有传递eventId, 表示注销所有事件.*/
				eventStore[eventName] = [];
				return;
			}

			for (var i = 0; i < events.length; i++) {
				var evt = events[i];
				if (evt["id"] === eventId) {
					events.splice(i, 1);
				}
			}
		},
		isExist: function (eventName, eventId) {
			var events = eventStore[eventName] || [];
			for (var i = 0; i < events.length; i++) {
				var found = events[i]["id"] === eventId;
				if (found) { return true; }
			}
			return false;
		}
	};

	//example
	aUtils.EventEmit.on("exempleEvent", function (firstName, lastName) {
		console.log("this1", this);
		console.log("Hello " + firstName + " " + lastName);
	}, "greet1");

	aUtils.EventEmit.on("exempleEvent", function (firstName, lastName) {
		console.log("this2", this);
		console.log("Hello " + firstName + " " + lastName);
	}, "greet2");

	aUtils.EventEmit.on("exempleEvent", function (firstName, lastName) {
		console.log("this2-2", this);
		console.log("Hello " + firstName + " " + lastName);
	}, "greet2");

	aUtils.EventEmit.on("exempleEvent", function (firstName, lastName) {
		console.log("this random", this);
		console.log("Hello " + firstName + " " + lastName);
	}, undefined, { random: true });



	aUtils.EventEmit.one("exempleEvent", function (firstName, lastName) {
		console.log("thisOne", this);
		console.log("Hello " + firstName + " " + lastName);
	}, "greetone");

	//aUtils.EventEmit.emit("exempleEvent", {});
})();
