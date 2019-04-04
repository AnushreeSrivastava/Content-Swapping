/**
 *items – create the model "items" to store and get item details.
 */
// require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create item schema
var itemSchema = new Schema ({

	itemCode : String,
	userID: String, 
	itemName: String,
	catalogCategory: String,
	itemStatus : String,
	description :String,
	imageUrl : String
});

module.exports = mongoose.model('items', itemSchema);
