import {before,after} from "../src/decorators";

@before(Component2)
export class Component1 {

  async execute({ context, options, next }) {
    await next();
  }

}

@after(Component1)
export class Component2 {

  async execute({ context, options, next }) {
    await next();
  }

}

@after(Component2)
export class Component3 {

  async execute({ context, options, next }) {
    await next();
  }

}
