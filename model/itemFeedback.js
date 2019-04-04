/**
 *itemFeedback – create the model "itemFeedback" to store and get item's feedback into and from the database:
 */
// require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create item Feedback Schema
var itemFeedbackSchema = new Schema ({
	itemCode : String,
	userID: String, 
	rating: String,
});

module.exports = mongoose.model('itemfeedbacks', itemFeedbackSchema);