/**
    Represents the data object to be submitted to the server for validation.
    @param {IcarusForm} icarusForm An Icarus Form
*/
class IcarusFormPost {
    /**
        @param {IcarusForm} icarusForm A form
     */
    constructor(icarusForm) {
        this.__RequestVerificationToken = icarusForm.antiForgeryToken;
        this.id = icarusForm.el.getAttribute('id');
        this.label = icarusForm.el.getAttribute('name');

        // An ordered array of key/value pairs as they appear in the IcarusForm
        this.results = icarusForm.getResultsAsArray();

        this.message = '';
    }

    /**
        Serialize the form into a JSON object key/value
        @returns {object} Form Results as an Object
    */
    getResultsAsObject() {
        let obj = {};
        try {
            this.results.forEach(
                function (item, index) {
                    if (obj[item.name] === undefined) { // New
                        obj[item.name] = item.value || '';
                    } else {                            // Existing
                        if (!obj[item.name].push) {
                            obj[item.name] = [obj[item.name]];
                        }
                        obj[item.name].push(item.value || '');
                    }
                }
            );
        } catch (e) {
            console.log('Unable to parse FormPost into an object');
            console.log(e);
        }
        return obj;
    }
}