import { FRUIT } from './FRUIT.js';
/**
    An APPLE
*/
export class APPLE extends FRUIT {
    /**
        Constructs a Fruit of type: Apple
    */
    constructor() {
        super();
        this.type = 'Apple';
    }
}
//export { APPLE };
/**
    An abstract FRUIT Class
*/
export class FRUIT {
    /**
        Constructs a Fruit with no type
    */
    constructor() {
        this.type = 'Unknown';
    }
}
//export { FRUIT };