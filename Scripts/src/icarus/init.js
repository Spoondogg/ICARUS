/* eslint-disable no-undef */
/** @module */
import APP from './controller/APP.js';
/** Initializes the Application
    @description The id, user and dev parameters are defined in Views/Shared/_Layout
    <ul>
        <li>If a 'login' parameter exists, the login prompt is displayed</li>
        <li>If a 'provider' and 'returnUrl' exists, the external login prompt is loaded
        <li>If an 'id' parameter exists, the specified application id is loaded</li>
    </ul>
*/
$(document).ready(() => {
	const app = new APP(id, user, dev);
	//let login = app.url.searchParams.get('login');
	//let provider = app.url.searchParams.get('provider');
	//let returnUrl = app.url.searchParams.get('returnUrl');
	//app.showLoginPrompt().showExternalLoginPrompt().main.load(id);
	//app.main.showLoginPrompt().load(id);
	//app.main.load(id);
	app.debug();
});
/*eslint-enable no-undef */