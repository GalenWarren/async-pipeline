(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "lodash", "aurelia-metadata", "toposort", "any-promise", "./decorators"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("lodash"), require("aurelia-metadata"), require("toposort"), require("any-promise"), require("./decorators"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.aureliaMetadata, global.toposort, global.anyPromise, global.decorators);
    global.pipeline = mod.exports;
  }
})(this, function (exports, _lodash, _aureliaMetadata, _toposort, _anyPromise, _decorators) {
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

  var asyncNoop = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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

    return function asyncNoop() {
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
      before: [],
      after: [],
      useMetadata: true
    });
  }

  /**
  * Helper to get the dependency relationships from metadata for a type
  */
  function getComponentDependencies(componentSpec) {

    // dependencies from before relationships
    var beforeDependencies = (0, _lodash2.default)(componentSpec.before).concat(_aureliaMetadata.metadata.get(_decorators.beforeTypes, componentSpec.type) || []).flatMap(function (beforeType) {
      return [[beforeType, componentSpec.key], [beforeType, componentSpec.type]];
    });

    // dependencies from after relationships
    var afterDependencies = (0, _lodash2.default)(componentSpec.after).concat(_aureliaMetadata.metadata.get(_decorators.afterTypes, componentSpec.type) || []).flatMap(function (afterType) {
      return [[componentSpec.key, afterType], [componentSpec.type, afterType]];
    });

    // return all dependencies
    return beforeDependencies.concat(afterDependencies).value();
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
      var _ref2$before = _ref2.before;
      var before = _ref2$before === undefined ? asyncNoop : _ref2$before;
      var _ref2$after = _ref2.after;
      var after = _ref2$after === undefined ? asyncNoop : _ref2$after;

      _classCallCheck(this, Pipeline);

      // store the components
      this.components = components;

      /**
      * @method                           Uses named parameters
      * @param {object} context           The context object on which the pipeline operates
      * @param {object} options           The options object for this run
      */
      this.execute = (0, _lodash2.default)(components).reduceRight(function (innerExecute, component) {

        return function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref3) {
            var context = _ref3.context;
            var options = _ref3.options;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return _anyPromise2.default.resolve((options.before || before)({
                      component: component,
                      context: context,
                      options: options
                    }));

                  case 2:
                    _context2.next = 4;
                    return _anyPromise2.default.resolve(component.execute({
                      context: context,
                      options: options,
                      next: function next() {
                        return innerExecute({ context: context, options: options });
                      }
                    }));

                  case 4:
                    _context2.next = 6;
                    return _anyPromise2.default.resolve((options.after || after)({
                      component: component,
                      context: context,
                      options: options
                    }));

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function (_x) {
            return ref.apply(this, arguments);
          };
        }();
      }, asyncNoop);
    }

    /**
    * Creates a pipeline from a set of component types using the provided container
    * @method
    */


    _createClass(Pipeline, null, [{
      key: "create",
      value: function create(_ref4) {
        var components = _ref4.components;
        var factory = _ref4.factory;
        var container = _ref4.container;
        var _ref4$before = _ref4.before;
        var before = _ref4$before === undefined ? asyncNoop : _ref4$before;
        var _ref4$after = _ref4.after;
        var after = _ref4$after === undefined ? asyncNoop : _ref4$after;


        // determine the factory function to use
        var componentFactory = getComponentFactory({ factory: factory, container: container });

        // normalize component specs
        var normalizedComponentSpecs = _lodash2.default.map(components, normalizeComponentSpec);

        // get all dependencies (edge nodes)
        var componentDependencies = _lodash2.default.flatMap(normalizedComponentSpecs, getComponentDependencies);

        // get the components in sorted order -- kgw!
        var sortedComponentSpecs = _toposort2.default.array(normalizedComponentSpecs, componentDependencies).reverse();

        // create all the component objects -- must key on type!
        var componentInstances = _lodash2.default.map(sortedComponentSpecs, function (spec) {
          return componentFactory(spec.type);
        });

        // create the pipeline
        return new Pipeline({ components: componentInstances, before: before, after: after });
      }
    }]);

    return Pipeline;
  }();
});
//# sourceMappingURL=pipeline.js.map
