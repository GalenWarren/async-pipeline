import {precedes,follows} from "../src/decorators";

@precedes(Component2)
class Component1 {

  async execute( context ) {
  }

}

@follows(Component1)
class Component2 {

  async execute( context ) {
  }

}
