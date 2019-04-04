/**
 *offers – create the model "offers" to store and get offers made by users and made to user.
 */
// require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create offer Schema
var offerSchema = new Schema ({

	userID : String,
	itemCodeOwn: String,
	itemCodeWant: String,
	offerID :String,
});

module.exports = mongoose.model('offers', offerSchema);