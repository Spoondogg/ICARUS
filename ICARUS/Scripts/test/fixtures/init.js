console.log('Testing init.js');
/**
    @module
*/
import APP from '../../controller/APP.js';
//import JUMBOTRON, { MODEL } from '../../model/el/container/jumbotron/JUMBOTRON.js';
/**
    @name init Initializes the Application
    @description 
    <ul>
        <li>If a 'login' parameter exists, the login prompt is displayed</li>
        <li>If an 'id' parameter exists, the specified application id is loaded</li>
    </ul>
*/
//var app = new APP(id, user, dev).showLoginPrompt().main.load(id);
//var app = new APP(1, 'Guest', true).showLoginPrompt().main.load(id);
var app = new APP(1, 'Guest', true);
//var jt = new JUMBOTRON(document.body, new MODEL());