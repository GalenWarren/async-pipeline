import _ from "lodash";
import {metadata} from "aurelia-metadata";
import toposort from "toposort";
import Promise from "any-promise";
import {beforeTypes,afterTypes} from "./decorators";

/**
* The default execute function, does nothing, serves as end of pipeline
*/
async function asyncNoop() {}

/**
* Gets a component factory
*/
export function getComponentFactory({ factory, container }) {

  if (factory) {
    return factory;
  }
  else if (container) {
    return ComponentType => container.get(ComponentType);
  }
  else {
    return ComponentType => new ComponentType();
  }

}

/**
* Helper to normalize a component spec
*/
export function normalizeComponentSpec( componentSpec ) {

  // expand bare constructor references into spec objects
  let normalizedSpec = componentSpec;
  if (_.isFunction( normalizedSpec )) {
    normalizedSpec = {
      type: componentSpec
    };
  }

  // fill in defaults
  return _.defaults( {}, normalizedSpec, {
    key: normalizedSpec.type,
    before: [],
    after: [],
    useMetadata: true
  });

}

/**
* Helper to get the dependency relationships from metadata for a type
*/
export function getComponentDependencies( componentSpec ) {

  // get the component types
  const componentTypes = _([ componentSpec.key, componentSpec.type ]).uniq();

  // dependencies from before relationships
  let allBeforeTypes = _(componentSpec.before);
  if (componentSpec.useMetadata) {
    allBeforeTypes = allBeforeTypes.concat( metadata.get( beforeTypes, componentSpec.type ) || [] );
  }
  const beforeDependencies = allBeforeTypes.flatMap( beforeType =>
    componentTypes.map( thisType => [ thisType, beforeType ]).value()
  ).value();

  // dependencies from after relationships
  let allAfterTypes = _(componentSpec.after);
  if (componentSpec.useMetadata) {
    allAfterTypes = allAfterTypes.concat( metadata.get( afterTypes, componentSpec.type ) || [] );
  }
  const afterDependencies = allAfterTypes.flatMap( afterType =>
    componentTypes.map( thisType => [ afterType, thisType ]).value()
  ).value();

  // return all dependencies
  return _.concat( beforeDependencies, afterDependencies );
}

/**

* The main pipeline component
*/
export class Pipeline {

  /**
  * @constructor
  * @param {object} components          Array of components
  */
  constructor({ components, before= asyncNoop, after = asyncNoop }) {

    // store the components
    this.components = components;

    /**
    * @method                           Uses named parameters
    * @param {object} context           The context object on which the pipeline operates
    * @param {object} options           The options object for this run
    */
    this.execute = _(components).reduceRight( ( innerExecute, component  ) => {

      return async function({ context, options }) {

        // call the before hook
        await Promise.resolve( (options.before || before)({
          component,
          context,
          options
        }));

        // call the component
        await Promise.resolve( component.execute({
          context: context,
          options: options,
          next: () => innerExecute({ context, options })
        }));

        // call the after hook
        await Promise.resolve( (options.after || after)({
          component,
          context,
          options
        }));

      };

    }, asyncNoop );

  }

  /**
  * Creates a pipeline from a set of component types using the provided container
  * @method
  */
  static create({ components, factory, container, before = asyncNoop, after = asyncNoop }) {

    // determine the factory function to use
    const componentFactory = getComponentFactory({ factory, container });

    // normalize component specs
    const normalizedComponentSpecs = _.map( components, normalizeComponentSpec );

    // get all dependencies (edge nodes)
    const componentDependencies = _.flatMap( normalizedComponentSpecs, getComponentDependencies );

    // get the components in sorted order -- kgw!
    const sortedComponentSpecs = toposort.array( normalizedComponentSpecs, componentDependencies ).reverse();

    // create all the component objects -- must key on type!
    const componentInstances = _.map( sortedComponentSpecs, spec => componentFactory( spec.type ));

    // create the pipeline
    return new Pipeline({ components: componentInstances, before: before, after: after });

  }

}
