/**
    A helper class for debugging
 */
export default class DEBUG {
    constructor() {

    }

    /**
        Logs output to the console   
        @param {string} output A string or an exception
    */
    static log(output) {
        //if (DEBUGMODE) {
            console.log(output);
        //}
    }
}