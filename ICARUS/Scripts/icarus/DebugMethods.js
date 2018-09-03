/**
 * If application is set to debug mode, debug details
 * are logged to the console.
 * 
 * @param {string} output A string or an exception
 */
function debug(output) {
    if (DEBUGMODE) {
        console.log(output);
    }
}