/**
    Testing JS Module Injection and Dependencies
*/
import { APPLE } from './APPLE.js';
console.log('Injector.main()');
var fruit = new APPLE();
console.log('Fruit Type: ' + fruit.type);
