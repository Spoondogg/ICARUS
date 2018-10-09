/* eslint-disable no-undef */
/** @module */
import APP from './APP.js';
/**
    
    @name init Initializes the Application
    @description The id, user and dev parameters are defined in Views/Shared/_Layout
    <ul>
        <li>If a 'login' parameter exists, the login prompt is displayed</li>
        <li>If an 'id' parameter exists, the specified application id is loaded</li>
    </ul>
*/
var app = new APP(id, user, dev);
app.showLoginPrompt().main.load(id);
/* eslint-enable no-undef */