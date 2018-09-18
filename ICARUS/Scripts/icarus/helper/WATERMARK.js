/**
    @module
*/
/**
    A Console Output Watermark
    @class
    @description Prints the spoonMEDIA.ca watermark to the console because its cool 
    @see http://ascii.co.uk/text
    @todo Consider if this needs to be a class or a static method
*/
export default class WATERMARK {
	constructor() {
		console.log("\n\n");
		console.log(".-----.-----.-----.-----.-----.--------.-----.--|  |__|.---.-.  .----.---.-.");
		console.log("|__ --|  _  |  _  |  _  |     |        |  -__|  _  |  ||  _  |__|  __|  _  |");
		console.log("|_____|   __|_____|_____|__|__|__|__|__|_____|_____|__||___._|__|____|___._|");
		console.log("      |__|                                                                  ");
		console.log("\n\n");
	}
}