
//Require item DB
var itemDB = require ('../model/itemDB');

//Require User model
var User = require ('../model/User');

//Require offer model
var Offer = require('../model/offer');

//Require bcryptjs to salt/hash
var bcrypt = require('bcryptjs');

var userList =[];

/**
 *  getAllUsers() –
 *	this method returns all the Users in the database
 * @return User list object
  */
	module.exports.getAllUsers = function(){
		try{
			return User.find({})
		}
		catch(e){
			console.log("UserDB-getAllUsers",e);
			throw e;
		}
	}

/**
 *  getUser(userIDVal) –This method returns the user object(all user details) of the given userID
 *	@param userIDVal
 * @return User object
 */
	module.exports.getUser = function getUser(userIDVal){
		try{
			return  User.findOne ({ userID : userIDVal })
		}
		catch(e){
			console.log("UserDB-getAllUsers",e);
			throw e;
		}
	}


/**
 *  getUsersCount() –This method returns total number of Users in the users collection
 * @return User list object
 */
 module.exports.getUsersCount = function getUsersCount(){
		try{
			return User.find({}).count();
		}
		catch(e){
			console.log("UserDB-getUsersCount",e);
			throw e;
		}
	}

/**
 *  addUser(userID,email,password,firstName,lastName, address1, address2, City, State, postCode, Country) –
 *	This method returns adds new User in the users collection
 *	@param userID
 *	@param email
 *	@param password
 *	@param firstName
 *	@param lastname
 *	@param address1
 *	@param address2
 *	@param City
 *	@param state
 *	@param postCode
 *	@param Country
 */
	module.exports.addUser = function addUser(userID,email,password,firstName,lastName, address1, address2, City, State, postCode, Country){
		try{
			var newUser = new User(
			{
				userID:userID,
				email:email,
				password:password,
				firstName:firstName,
				lastName:lastName,
				address1:address1,
				address2:address2,
				City:City,
				State:State,
				postCode:postCode,
				Country:Country
			});

			bcrypt.genSalt(10,function(err,salt){
				bcrypt.hash(newUser.password,salt,function(err,hash){
					if(err){
						console.log(err);
					}
					newUser.password = hash;
					newUser.save(function(err){
							if(err) 
							{
								console.log(err);			
								throw err;
							}
							else
							{
								console.log('New User Saved!');
							}
						});
					});
				});

			}
			catch(e){
				console.log("UserDB-getAllUsers",e);
				throw e;
			}
	}

/**
 *  matchEmail(useremail) –This method checks if the given useremail is present in the user collection or not
 * @return User object of matched email
 */
	module.exports.matchEmail = function matchEmail(useremail){
		var query = {email:useremail};
		return User.findOne(query);
	}
