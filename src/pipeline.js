import _ from "lodash";
import toposort from "toposort";
import Promise from "any-promise";
//import {precedesTypes,followsTypes} from "./decorators";

/**
* The default execute function, does nothing, serves as end of pipeline
*/
async function terminator() {}

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
    precedes: [],
    follows: [],
    useMetadata: true
  });

}

/**
* Helper to get the dependency relationships from metadata for a type
*/
export function getComponentDependencies( /*componentSpec*/ ) {
  return [];
}

/**

* The main pipeline component
*/
export class Pipeline {

  /**
  * @constructor
  * @param {object} components          Array of components
  */
  constructor({ components }) {

    // store the components
    this.components = components;

    /**
    * @method
    * @param {object} context           The context object on which the pipeline operates
    */
    this.execute = _(components).reduceRight( ( innerExecute, component  ) => {

      return context => Promise.resolve( component.execute( context, () => innerExecute( context )));

    }, terminator );

  }

  /**
  * Creates a pipeline from a set of component types using the provided container
  * @method
  */
  static create({ components, factory, container }) {

    // determine the factory function to use
    const componentFactory = getComponentFactory({ factory, container });

    // normalize component specs
    const normalizedSpecs = _.map( components, normalizeComponentSpec );

    // get all dependencies (edge nodes)
    const dependencies = _.flatMap( normalizedSpecs, getComponentDependencies );

    // get the components in sorted order -- kgw!
    const sortedSpecs = toposort.array( normalizedSpecs, dependencies ).reverse();

    // create all the component objects -- must key on type!
    const componentInstances = _.map( sortedSpecs, spec => componentFactory( spec.type ));

    // create the pipeline
    return new Pipeline({ components: componentInstances });

  }

}
