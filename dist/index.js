(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./pipeline", "./decorators"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./pipeline"), require("./decorators"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pipeline, global.decorators);
    global.index = mod.exports;
  }
})(this, function (exports, _pipeline, _decorators) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "Pipeline", {
    enumerable: true,
    get: function () {
      return _pipeline.Pipeline;
    }
  });
  Object.keys(_decorators).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _decorators[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
