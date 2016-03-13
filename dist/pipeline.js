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
  exports.getComponentFactory = getComponentFactory;
  exports.normalizeComponentSpec = normalizeComponentSpec;
  exports.getComponentDependencies = getComponentDependencies;

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

  var terminator = function () {
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

    return function terminator(_x) {
      return ref.apply(this, arguments);
    };
  }();

  /**
  * Gets a component factory
  */
  function getComponentFactory(_ref) {
    var factory = _ref.factory;
    var container = _ref.container;


    if (factory) {
      return factory;
    } else if (container) {
      return function (ComponentType) {
        return container.get(ComponentType);
      };
    } else {
      return function (ComponentType) {
        return new ComponentType();
      };
    }
  }

  /**
  * Helper to normalize a component spec
  */
  function normalizeComponentSpec(componentSpec) {

    // expand bare constructor references into spec objects
    var normalizedSpec = componentSpec;
    if (_lodash2.default.isFunction(normalizedSpec)) {
      normalizedSpec = {
        type: componentSpec
      };
    }

    // fill in defaults
    return _lodash2.default.defaults({}, normalizedSpec, {
      key: normalizedSpec.type,
      precedes: [],
      follows: [],
      useMetadata: true
    });
  }

  /**
  * Helper to get the dependency relationships from metadata for a type
  */
  function getComponentDependencies(componentSpec) {
    return [];
  }

  /**
  
  * The main pipeline component
  */

  var Pipeline = exports.Pipeline = function () {

    /**
    * @constructor
    * @param {object} components          Array of components
    */

    function Pipeline(_ref2) {
      var components = _ref2.components;

      _classCallCheck(this, Pipeline);

      // store the components
      this.components = components;

      /**
      * @method
      * @param {object} context           The context object on which the pipeline operates
      */
      this.execute = (0, _lodash2.default)(components).reduceRight(function (innerExecute, component) {

        return function (context) {
          return _anyPromise2.default.resolve(component.execute(context, function () {
            return innerExecute(context);
          }));
        };
      }, terminator);
    }

    /**
    * Creates a pipeline from a set of component types using the provided container
    * @method
    */


    _createClass(Pipeline, null, [{
      key: "create",
      value: function create(_ref3) {
        var components = _ref3.components;
        var factory = _ref3.factory;
        var container = _ref3.container;


        // determine the factory function to use
        var componentFactory = getComponentFactory({ factory: factory, container: container });

        // normalize component specs
        var normalizedSpecs = _lodash2.default.map(components, normalizeComponentSpec);

        // get all dependencies (edge nodes)
        var dependencies = _lodash2.default.flatMap(normalizedSpecs, getComponentDependencies);

        // get the components in sorted order -- kgw!
        var sortedSpecs = _toposort2.default.array(normalizedSpecs, dependencies).reverse();

        // create all the component objects -- must key on type!
        var componentInstances = _lodash2.default.map(sortedSpecs, function (spec) {
          return componentFactory(spec.type);
        });

        // create the pipeline
        return new Pipeline({ components: componentInstances });
      }
    }]);

    return Pipeline;
  }();
});
//# sourceMappingURL=pipeline.js.map
