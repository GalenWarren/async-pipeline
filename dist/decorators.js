(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "aurelia-metadata"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("aurelia-metadata"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.aureliaMetadata);
    global.decorators = mod.exports;
  }
})(this, function (exports, _aureliaMetadata) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.afterTypes = exports.beforeTypes = undefined;
  exports.before = before;
  exports.after = after;


  // symbols for tracking metadata
  /* global Symbol */
  var beforeTypes = exports.beforeTypes = Symbol();
  var afterTypes = exports.afterTypes = Symbol();

  /**
  * A decorator that indicates types that should come before
  */
  function before() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    return function (target) {
      _aureliaMetadata.metadata.define(beforeTypes, types, target);
    };
  }

  /**
  * A decorator that indicates that a type follows another type
  */
  function after() {
    for (var _len2 = arguments.length, types = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      types[_key2] = arguments[_key2];
    }

    return function (target) {
      _aureliaMetadata.metadata.define(afterTypes, types, target);
    };
  }
});
//# sourceMappingURL=decorators.js.map
