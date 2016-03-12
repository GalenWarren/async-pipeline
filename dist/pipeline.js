(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "lodash", "toposort", "any-promise", "./decorators"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("lodash"), require("toposort"), require("any-promise"), require("./decorators"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.toposort, global.anyPromise, global.decorators);
    global.pipeline = mod.exports;
  }
})(this, function (exports, _lodash, _toposort, _anyPromise, _decorators) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Pipeline = undefined;

  var _lodash2 = _interopRequireDefault(_lodash);

  var _toposort2 = _interopRequireDefault(_toposort);

  var _anyPromise2 = _interopRequireDefault(_anyPromise);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new _anyPromise2.default(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return _anyPromise2.default.resolve(value).then(function (value) {
              return step("next", value);
            }, function (err) {
              return step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var pipelineTerminator = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(context) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function pipelineTerminator(_x) {
      return ref.apply(this, arguments);
    };
  }();

  var Pipeline = exports.Pipeline = function () {

    /**
    * @constructor
    * @param {object} components          Name->type map for components in map
    */

    function Pipeline(_ref) {
      var components = _ref.components;

      _classCallCheck(this, Pipeline);

      /**
      * @method
      * @param {object} context           The context object on which the pipeline operates
      */
      this.execute = (0, _lodash2.default)(components).reverse().reduce(function (innerExecute, component) {

        return function (context) {
          return component.execute(context, function () {
            return innerExecute(context);
          });
        };
      }, pipelineTerminator);
    }

    /**
    * Creates a pipeline from a set of component types using the provided container
    * @method
    */


    _createClass(Pipeline, null, [{
      key: "createComponents",
      value: function createComponents(_ref2) {
        var components = _ref2.components;
        var factory = _ref2.factory;
        var container = _ref2.container;


        // get the factory function
        var componentFactory = factory || function (ComponentType) {
          return container.get(ComponentType);
        } || function (ComponentType) {
          return new ComponentType();
        };

        // get all dependencies (edge nodes)
        var dependencies = _lodash2.default.flatMap(components, getDependencies);

        // get the components in sorted order -- kgw!
        var sortedComponentTypes = _toposort2.default.array(componentTypes, dependencies).reverse();

        // create all the component objects
        return _lodash2.default.map(sortedComponentTypes, componentFactory);
      }
    }]);

    return Pipeline;
  }();
});
//# sourceMappingURL=pipeline.js.map
