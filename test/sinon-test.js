(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon", {

        ".deepEqual": {
            "passes null": function () {
                assert(sinon.deepEqual(null, null));
            },

            "fails null and object": function () {
                assert.isFalse(sinon.deepEqual(null, {}));
            },

            "fails object and null": function () {
                assert.isFalse(sinon.deepEqual({}, null));
            },

            "fails error and object": function () {
                assert.isFalse(sinon.deepEqual(new Error(), {}));
            },

            "fails object and error": function () {
                assert.isFalse(sinon.deepEqual({}, new Error()));
            },

            "fails regexp and object": function () {
                assert.isFalse(sinon.deepEqual(/.*/, {}));
            },

            "fails object and regexp": function () {
                assert.isFalse(sinon.deepEqual({}, /.*/));
            },

            "passes primitives": function () {
                assert(sinon.deepEqual(1, 1));
            },

            "passes same object": function () {
                var object = {};

                assert(sinon.deepEqual(object, object));
            },

            "passes same function": function () {
                var func = function () {};

                assert(sinon.deepEqual(func, func));
            },

            "passes same array": function () {
                var arr = [];

                assert(sinon.deepEqual(arr, arr));
            },

            "passes same regexp": function () {
                var regexp = /foo/;

                assert(sinon.deepEqual(regexp, regexp));
            },

            "passes equal arrays": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                assert(sinon.deepEqual(arr1, arr2));
            },

            "passes equal arrays with custom properties": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                arr1.foo = "bar";
                arr2.foo = "bar";

                assert(sinon.deepEqual(arr1, arr2));
            },

            "fails arrays with unequal custom properties": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                arr1.foo = "bar";
                arr2.foo = "not bar";

                assert.isFalse(sinon.deepEqual(arr1, arr2));
            },

            "passes equal regexps": function () {
                var regexp1 = /foo/;
                var regexp2 = /foo/;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps": function () {
                var regexp1 = /foo/;
                var regexp2 = /bar/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));

            },

            "passes equal regexps with same ignoreCase flags": function () {
                var regexp1 = /foo/i;
                var regexp2 = /foo/i;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps with different ignoreCase flags": function () {
                var regexp1 = /foo/i;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));

            },

            "passes equal regexps with same multiline flags": function () {
                var regexp1 = /foo/m;
                var regexp2 = /foo/m;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps with different multiline flags": function () {
                var regexp1 = /foo/m;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes equal regexps with same global flags": function () {
                var regexp1 = /foo/g;
                var regexp2 = /foo/g;

                assert(sinon.deepEqual(regexp1, regexp2));
            },

            "fails unequal regexps with different global flags": function () {
                var regexp1 = /foo/g;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes equal regexps with multiple flags": function () {
                var regexp1 = /bar/im;
                var regexp2 = /bar/im;

                assert(sinon.deepEqual(regexp1, regexp2));
            },

            "fails unequal regexps with multiple flags": function () {
                var regexp1 = /bar/im;
                var regexp2 = /bar/ig;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes NaN and NaN": function () {
                assert(sinon.deepEqual(NaN, NaN));
            },

            "passes equal objects": function () {
                var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
                var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

                assert(sinon.deepEqual(obj1, obj2));
            },

            "fails unequal objects with undefined properties with different names": function () {
                var obj1 = {a: 1, b: 2, c: 3};
                var obj2 = {a: 1, b: 2, foo: undefined};

                assert.isFalse(sinon.deepEqual(obj1, obj2));
            },

            "fails unequal objects with undefined properties with different names (different arg order)": function () {
                var obj1 = {a: 1, b: 2, foo: undefined};
                var obj2 = {a: 1, b: 2, c: 3};

                assert.isFalse(sinon.deepEqual(obj1, obj2));
            },

            "passes equal dates": function () {
                var date1 = new Date(2012, 3, 5);
                var date2 = new Date(2012, 3, 5);

                assert(sinon.deepEqual(date1, date2));
            },

            "fails different dates": function () {
                var date1 = new Date(2012, 3, 5);
                var date2 = new Date(2013, 3, 5);

                assert.isFalse(sinon.deepEqual(date1, date2));
            },

            "in browsers": {
                requiresSupportFor: {
                    "document object": typeof document !== "undefined"
                },

                "passes same DOM elements": function () {
                    var element = document.createElement("div");

                    assert(sinon.deepEqual(element, element));
                },

                "fails different DOM elements": function () {
                    var element = document.createElement("div");
                    var el = document.createElement("div");

                    assert.isFalse(sinon.deepEqual(element, el));
                },

                "does not modify DOM elements when comparing them": function () {
                    var el = document.createElement("div");
                    document.body.appendChild(el);
                    sinon.deepEqual(el, {});

                    assert.same(el.parentNode, document.body);
                    assert.equals(el.childNodes.length, 0);
                }
            },

            "passes deep objects": function () {
                var func = function () {};

                var obj1 = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: "hey",
                    e: "there",
                    f: func,
                    g: {
                        a1: [1, 2, "3", {
                            prop: [func, "b"]
                        }]
                    }
                };

                var obj2 = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: "hey",
                    e: "there",
                    f: func,
                    g: {
                        a1: [1, 2, "3", {
                            prop: [func, "b"]
                        }]
                    }
                };

                assert(sinon.deepEqual(obj1, obj2));
            },

            "passes object without prototype compared to equal object with prototype": function () {
                var obj1 = Object.create(null);
                obj1.a = 1;
                obj1.b = 2;
                obj1.c = "hey";

                var obj2 = { a: 1, b: 2, c: "hey" };

                assert(sinon.deepEqual(obj1, obj2));
            },

            "passes object with prototype compared to equal object without prototype": function () {
                var obj1 = { a: 1, b: 2, c: "hey" };

                var obj2 = Object.create(null);
                obj2.a = 1;
                obj2.b = 2;
                obj2.c = "hey";

                assert(sinon.deepEqual(obj1, obj2));
            },

            "passes equal objects without prototypes": function () {
                var obj1 = Object.create(null);
                obj1.a = 1;
                obj1.b = 2;
                obj1.c = "hey";

                var obj2 = Object.create(null);
                obj2.a = 1;
                obj2.b = 2;
                obj2.c = "hey";

                assert(sinon.deepEqual(obj1, obj2));
            },

            "passes equal objects that override hasOwnProperty": function () {
                var obj1 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };
                var obj2 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };

                assert(sinon.deepEqual(obj1, obj2));
            }
        },

        "Function.prototype.toString": {
            "returns function's displayName property": function () {
                var fn = function () {};
                fn.displayName = "Larry";

                assert.equals(sinon.functionToString.call(fn), "Larry");
            },

            "guesses name from last call's this object": function () {
                var obj = {};
                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            },

            "guesses name from any call where property can be located": function () {
                var obj = {};
                var otherObj = { id: 42 };

                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();
                obj.doStuff.call(otherObj);

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            }
        },

        ".getConfig": {
            "gets copy of default config": function () {
                var config = sinon.getConfig();

                refute.same(config, sinon.defaultConfig);
                assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
                assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
                assert.equals(config.properties, sinon.defaultConfig.properties);
                assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
                assert.equals(config.useFakeServer, sinon.defaultConfig.useFakeServer);
            },

            "should override specified properties": function () {
                var config = sinon.getConfig({
                    properties: ["stub", "mock"],
                    useFakeServer: false
                });

                refute.same(config, sinon.defaultConfig);
                assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
                assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
                assert.equals(config.properties, ["stub", "mock"]);
                assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
                assert.isFalse(config.useFakeServer);
            }
        },

        ".log": {
            "does nothing gracefully": function () {
                refute.exception(function () {
                    sinon.log("Oh, hiya");
                });
            }
        },

        ".createStubInstance": {
            "stubs existing methods": function () {
                var Class = function () {};
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                stub.method.returns(3);
                assert.equals(3, stub.method());
            },

            "doesn't stub fake methods": function () {
                var Class = function () {};

                var stub = sinon.createStubInstance(Class);
                assert.exception(function () {
                    stub.method.returns(3);
                });
            },

            "doesn't call the constructor": function () {
                var Class = function (a, b) {
                    var c = a + b;
                    throw c;
                };
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                refute.exception(function () {
                    stub.method(3);
                });
            },

            "retains non function values": function () {
                var TYPE = "some-value";
                var Class = function () {};
                Class.prototype.type = TYPE;

                var stub = sinon.createStubInstance(Class);
                assert.equals(TYPE, stub.type);
            },

            "has no side effects on the prototype": function () {
                var proto = {
                    method: function () {
                        throw "error";
                    }
                };
                var Class = function () {};
                Class.prototype = proto;

                var stub = sinon.createStubInstance(Class);
                refute.exception(stub.method);
                assert.exception(proto.method);
            },

            "throws exception for non function params": function () {
                var types = [{}, 3, "hi!"];

                for (var i = 0; i < types.length; i++) {
                    // yes, it's silly to create functions in a loop, it's also a test
                    assert.exception(function () { // eslint-disable-line no-loop-func
                        sinon.createStubInstance(types[i]);
                    });
                }
            }
        },

        ".restore": {
            "restores all methods of supplied object": function () {
                var methodA = function () {};
                var methodB = function () {};
                var obj = { methodA: methodA, methodB: methodB };

                sinon.stub(obj);
                sinon.restore(obj);

                assert.same(obj.methodA, methodA);
                assert.same(obj.methodB, methodB);
            },

            "only restores restorable methods": function () {
                var stubbedMethod = function () {};
                var vanillaMethod = function () {};
                var obj = { stubbedMethod: stubbedMethod, vanillaMethod: vanillaMethod };

                sinon.stub(obj, "stubbedMethod");
                sinon.restore(obj);

                assert.same(obj.stubbedMethod, stubbedMethod);
            },

            "restores a single stubbed method": function () {
                var method = function () {};
                var obj = { method: method };

                sinon.stub(obj);
                sinon.restore(obj.method);

                assert.same(obj.method, method);
            }
        }
    });
}(this));
