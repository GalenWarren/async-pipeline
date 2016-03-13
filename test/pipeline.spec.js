import chai from "chai";
import sinon from "sinon";
import {Pipeline,getComponentFactory,normalizeComponentSpec,getComponentDependencies} from "../src/pipeline";
import {Component1,Component2} from "./components";

const assert = chai.assert;
const expect = chai.expect;

describe('Pipeline', function() {

  describe('getComponentFactory()', function () {

    it('should use supplied factory', function () {

      const explicitFactory = sinon.spy();
      const factory = getComponentFactory({ factory: explicitFactory });
      factory(Component1);
      assert( explicitFactory.calledOnce );
      assert( explicitFactory.calledWith(Component1));

    });

    it('should use supplied container', function () {

      const explicitContainer = {
        get: sinon.spy()
      };
      const factory = getComponentFactory({ container: explicitContainer });
      factory(Component1);
      assert( explicitContainer.get.calledOnce );
      assert( explicitContainer.get.calledOn(explicitContainer));
      assert( explicitContainer.get.calledWith(Component1));

    });

    it('should fall back to calling constructor', function () {

      const Type = sinon.spy();
      const factory = getComponentFactory({});
      const instance = factory(Type);
      assert( Type.calledOnce );

    });

  });

  /*
  describe('create()', function () {

    it('should create expected pipeline in terse style', function () {

      val pipeline = Pipeline.create({
        components: [ Component1, Component2 ]
      });

    });

    it('should create expected pipeline in verbose style', function () {

      val pipeline = Pipeline.create({
        components: [
          {
            key: Component1,
            type: Component1,
            precedes: [Component2],
            useMetadata: true
          },
          {
            key: Component2,
            type: Component2,
            follows: [Component1],
            useMetadata: true
          }
        ]
      });

    });

  });
*/

})
