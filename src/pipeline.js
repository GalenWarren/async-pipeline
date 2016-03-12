import _ from "lodash";
import toposort from "toposort";
import Promise from "any-promise";
import {precedesTypes,followsTypes} from "./decorators";

/**
* The default execute function, does nothing, serves as end of pipeline
*/
async function pipelineTerminator( context ) {}

/**
* The main pipeline component
*/
export class Pipeline {

  /**
  * @constructor
  * @param {object} components          Name->type map for components in map
  */
  constructor({ components }) {

    /**
    * @method
    * @param {object} context           The context object on which the pipeline operates
    */
    this.execute = _(components).reverse().reduce( ( innerExecute, component  ) => {

      return context => component.execute( context, () => innerExecute( context ));

    }, pipelineTerminator );

  }

  /**
  * Creates a pipeline from a set of component types using the provided container
  * @method
  */
  static createComponents({ components, factory, container }) {

    // get the factory function
    const componentFactory = factory ||
      ( ComponentType => container.get(ComponentType)) ||
      ( ComponentType => new ComponentType());

    // get all dependencies (edge nodes)
    const dependencies = _.flatMap(components, getDependencies );

    // get the components in sorted order -- kgw!
    const sortedComponentTypes = toposort.array( componentTypes, dependencies ).reverse();

    // create all the component objects
    return _.map( sortedComponentTypes, componentFactory );

  }
}
