(function() {


    function linq2js(array) {

        let _data = array;
        let generators = [function* initialize() {
            for (let item of _data) {
                yield item;
            }
        }];


        this.select = this.map = function(callback) {

            var lastGenerator = this.getLastGenerator();
            generators.push(function* select() {
                let index = 0;
                for (let item of lastGenerator()) {
                    yield callback(item, index++);
                }
            });
            return this.clone();
        };
        this.where = this.filter = function(callback) {

            var lastGenerator = this.getLastGenerator();

            generators.push(function* where() {
                let index = 0;
                for (let item of lastGenerator()) {
                    if (callback(item, index++)) yield item;
                }
            });

            return this.clone();
        };

        this.skip = function(skipNumber) {
            return this.where(function skip(item, index) {
                return index++ > skipNumber;
            });
        };

        this.take = function(takeNumber) {
            return this.where(function take(item, index) {
                return index++ < takeNumber;
            });
        };
        this.flat = function(key) {
            this.map(function flattern(item, index) {
                return item[key];
            });
            return this;
        };

        // this.aggregate = this.reduce = function(callback, initializeValue) {
        //     var prevItem = initializeValue;
        //     this.select(function(item, index) {
        //     });
        //     if (initializeValue === undefined) {}
        //     var lastGenerator = this.getLastGenerator();
        //     generators.push(function* aggregate() {
        //         let index = 0;
        //         for (let item of lastGenerator()) {
        //         }
        //     });
        // };

        this.orderBy = this.sort = function(keyOrCompare) {
            var lastGenerator = this.getLastGenerator();
            generators.push(function* sort() {
                let index = 0;
                var compare = typeof keyOrCompare === "function" ? keyOrCompare : function(prev, next, i) {
                    if (prev[keyOrCompare] > next[keyOrCompare]) return 1;
                    if (prev[keyOrCompare] < next[keyOrCompare]) return -1;
                    return 0;
                };
                var items = [];
                for (let item of lastGenerator()) {
                    items.push(item);
                }
                items.sort(compare);
                for (let item of items) {
                    yield item;
                }
            });
            return this.clone();
        };

        this.getLastGenerator = function() {
            return generators[generators.length - 1];
        };
        this.forEach = function(callback) {
            let index = 0;
            for (let item of this.getLastGenerator()()) {
                callback(item, index++);
            }
        };
        this.toArray = function() {
            var items = [];
            for (let item of this.getLastGenerator()()) {
                items.push(item);
            }
            return items;
        };
        this.toJson = function() {
            return JSON.stringify(this.toArray());
        };
        this.clone = function() {
            return Object.create(this);
        }
    };


    linq2js.ajax = function(url, options) {
        var promise = new Promise(function(resolve, reject) {
            fetch(url, options || {}).then(function(response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    reject(response);
                }
            }).then(function(response) {
                resolve(response)
            });
        });

        return promise;
    };

    linq2js.async = function(generator) {
        var it = generator();
        (function toNext(val) {
            var promise = it.next(val).value;
            if (promise && promise.then) {
                promise.then(function(response) {
                    toNext(response);
                }, function() {
                    it.throw();
                });
            } else {
                setTimeout(function() {
                    it.next(val);
                }, 0);
            }
        })();
    };

    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        //for nodejs
        module.exports = linq2js;
    } else if (typeof define === "function" && typeof require === "function") {
        //for requirejs
        define(linq2js);
    } else {
        window.linq2js = linq2js;
    }

})();
