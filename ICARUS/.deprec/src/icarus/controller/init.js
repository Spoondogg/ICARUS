/* eslint-disable no-undef */
console.log('init.js');
/**
    @module
*/
import APP from './APP.js';
/**
    @name init Initializes the Application
    @description 
    <ul>
        <li>If a 'login' parameter exists, the login prompt is displayed</li>
        <li>If an 'id' parameter exists, the specified application id is loaded</li>
    </ul>
*/
var app = new APP(id, user, dev);
app.showLoginPrompt().main.load(id);
/* eslint-enable no-undef */