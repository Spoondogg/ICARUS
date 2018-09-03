/**
    Icarus
    @description A Single Page Web Application Engine
    @version 0.5.1.20180830
    @author Ryan Dunphy <ryan@spoonmedia.ca>
*/
console.log('Icarus.main.js');
"use strict";

console.log('Icarus.Index.cshtml > viewInit');

const DEBUGMODE = true; // If true, debug outputs are shown
const TESTING = false; // If true, tests are ran and results are shown in the console.

import './StringMethods.js';
import './DebugMethods.js';
import './DomMethods.js';

import CONTAINERFACTORY from './model/el/container/CONTAINERFACTORY.js';
import MAIN from './model/el/container/main/MAIN.js';

var token = document.getElementsByName('__RequestVerificationToken')[0];
try {
    token.parentNode.removeChild(token);
} catch (e) {
    debug('Failed to remove TOKEN from BODY');
    debug(e);
}

var factory = new CONTAINERFACTORY();



// Set application URL and forward to return URL if required
var app = new MAIN();
app.url = new URL(window.location.href);
let returnUrl = app.url.searchParams.get('ReturnUrl');
if (returnUrl) {
    returnUrl = app.url.origin + returnUrl;
    location.href = returnUrl;
}

console.log('This sentence should be camelcased'.camelcase());
console.log('GUID: ' + new String().guid());
debug('This is debugger output.');

console.log('App ID: ' + app.id + '(From main.js)');

let isLogin = app.url.searchParams.get('login');
if (isLogin) {
    if (user === 'Guest') {
        app.login();
    }
}

app.load(appId);