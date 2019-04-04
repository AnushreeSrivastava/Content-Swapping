/**
 *offerfeedbacks – create the model "offerfeedbacks" to store and get users' feedback into and from the database:
 */
// require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create offer feedback schema
var offerFeedbackSchema = new Schema ({
	
	userID1: String, 
	userID2: String, 
	rating: String,
});

module.exports = mongoose.model('offerfeedbacks', offerFeedbackSchema);