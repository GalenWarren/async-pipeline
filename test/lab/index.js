import {Pipeline,before,after} from "../src/index";

@before(Component2)
class Component1 {

  async execute( context ) {

  }

}

@after(Component1)
class Component2 {

  async execute( context ) {

  }

}

val pipeline = Pipeline.create({

  components: [
    {
      key: Component1,
      type: Component1,
      before: [Component2],
      useMetadata: true
    },
    {
      key: Component2,
      type: Component2,
      after: [Component1],
      useMetadata: true
    }
  ],

  after: ({ component, context, options }) => {
    console.log( context );
  }

});

pipeline.execute({ context: {}, options: {} });
