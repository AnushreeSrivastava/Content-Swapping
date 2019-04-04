/**
 *users – create the model "users" to store and get user details.
 */
// require mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create User schema
var userSchema = new Schema ({

	userID :
	{
	type : String
	},
	email :{
		type: String,
		// required: true
	},
	password : {
		type: String,
		// required: true
	},
	firstName: {
		type: String,
		// required: true
	},
	lastName: {
		type: String,
		//required: true
	},
	address1 : {
		type: String		
	},
	address2: {
		type: String,
		//required: true
	},
	City: {
		type: String,
		default: 'Charlotte'
	},
	State: {
		type: String,
		default: 'NC'
	},
	postCode: {
		type: String,
		default: '28203'
	},
	Country :{
		type: String,
		default: 'USA'
	}

});

module.exports = mongoose.model('users', userSchema);

