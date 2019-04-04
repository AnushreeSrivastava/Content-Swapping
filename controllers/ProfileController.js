var User = require ('../model/User');
var UserDB = require('../model/UserDB');
var itemDB=require('../model/itemDB');
var feedbackDB = require('../model/feedbackDB');
var offerDB = require('../model/offerDB');
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var htmlencode = require('htmlencode');
const { check, validationResult} = require('express-validator/check'); 


var allItems =itemDB.getAllItems();
var cantDelete = 0; 
var message = "";

module.exports = function(app){
	
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//Define @isAuthenticated and @currentProfile parameteres across the controller
app.use(function(req,res,next){ 
	try{	
		if(req.session.theUser){
			req.session.currentProfile = req.session.theUser;
			req.isAuthenticated = "1";
		}
		next();
	}
	catch (e) {
		console.log(e);  
	}
});

//-------------------------   LOGIN ROUTE ----------------------------------------------------
app.get('/login',async function(req,res){ 	
	try{
		message = "";
		res.render('login',{message:message,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	}
	catch (e) {
		console.log(e);  
	}
});

/**
*Login Post route
*Checks for email and password the validations
*If validation fails displays message to user
**/
app.post('/login',async function(req,res){

    message = "";
	var itemRating = [];
	var useremail = req.body.useremail;
	var password = req.body.password;	

	req.checkBody('email','Email format is Incorrect').isEmail();
    req.checkBody('password','Password is required').notEmpty();
		let errors = req.validationErrors();
		if(errors)
		{
			message = errors.msg;
		}
		var theUser =await UserDB.matchEmail(useremail);
		if(theUser)
		{
			var isPwd = await bcrypt.compare(password,theUser.password);
			if(!isPwd)
			{
			message = "Password Incorrect!";
			htmlencode.htmlEncode(message);
			res.render('login',{message:message,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
		
			}
			else
			{
				req.session.theUser =await UserDB.getUser(theUser.userID);
				req.session.currentProfile = req.session.theUser;
				req.isAuthenticated = "1";
				if(req.session.theUser)
						renderMyItems(req,res);
			}
		}
		else
		{
			message = "No User Found!";
			htmlencode.htmlEncode(message);
			res.render('login',{message:message,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
		}
	});

//-------------------------   REGISTER ROUTE ----------------------------------------------------
app.get('/register',async function(req,res){ 	
	try{
		res.render('register',{isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	}
	catch (e) {
		console.log(e);  
	}
});


//Register post request
//Check all validations
//Post to login page on success
app.post('/register',urlencodedParser,[
check('email')
    .custom(async email => {
     return await UserDB.matchEmail(email).then(data => {
        if (data === null) {
          return true
        } else {
          return false
        }
      })
    }).withMessage('Email already exists!Try with another email.')], async function(req,res){

const firstName = req.body.firstName;
const lastName = req.body.lastName;
const address1 = req.body.address1;
const address2= req.body.address2 ;
const city= req.body.city ;
const state= req.body.state ;
const postCode= req.body.postCode ;
const country= req.body.country ;
const email= req.body.email ;
const password= req.body.password ;
const confirmPassword= req.body.confirmPassword ;

req.checkBody('firstName','First Name is required').notEmpty();
req.checkBody('lastName','Last Name is required').notEmpty();
req.checkBody('address1','Address line 1 is required').notEmpty();
req.checkBody('city','City Name is required').notEmpty();
req.checkBody('state','State is required').notEmpty();
req.checkBody('postCode','Post Code is required').notEmpty();
req.checkBody('country','country is required').notEmpty();
req.checkBody('email','Email is not valid').isEmail();
req.checkBody('password','Password is required').notEmpty();
req.checkBody('password','Password length must be minimum of 6 characters').isLength({min:6});
req.checkBody('confirmPassword','Passwords do not match').equals(req.body.password);
//let err.msg="";
var errors = req.validationErrors();

if(errors)
{
	res.render('register',{errors:errors,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
}

else
{
	var count = await UserDB.getUsersCount();
	var userID = count + 1001;
   await UserDB.addUser(userID,email,password,firstName,lastName,address1,address2,city,state,postCode,country);
	req.flash('success','You are now registered and can log in!');
	res.render('login',{message:message,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
}

});
//-------------------------   LOGOUT ROUTE ----------------------------------------------------

/*Destroys the session variable and reset the sign in link*/
app.get('/logout',function(req,res,next){ 
	try{
		req.session.destroy(function(err)
		{
			req.isAuthenticated = "0";
			res.redirect('/');
		});
	}
	catch (e) {
		console.log(e);  
	}
});

//-------------------------   MY ITEMS ROUTE ----------------------------------------------------
//Renders My Items page
app.get('/myItems',actionParam,async function(req,res,next){ 
	try{
		renderMyItems(req,res);
	 	}
	 
	 catch (e) {
	 	console.log(e);  
	 }
});
//-------------------------- ADD NEW ITEM ROUTE ---------------------------------------------------

//Renders page to upload new item
app.get('/newItem',actionParam,async function(req,res,next){ 
	try{
		res.render('newItem',{isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});		
	 	}
	 
	 catch (e) {
	 	console.log(e);  
	 }
});

//-------------------------   MY SWAPS GET ROUTE ----------------------------------------------------
//Renders My Swaps page - displays all the offers user made or user received
app.get('/mySwaps',actionParam,async function(req,res,next){ 

		// If there are pending status items in user profile dispatch to mySwaps with those items else 
		//   show message "no items"
		try{
			var swapTable =[];

			if(req.session.currentProfile)
			{
				var currentUserID = req.session.currentProfile.userID;
				swapTable =await getOffers(currentUserID);
			}
			if(typeof(req.session.currentProfile) === "undefined" || swapTable.length === 0)
				res.render('noItemToDisplay',{isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
			else
				res.render('mySwaps',{swapTable:swapTable,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});		
		}
		catch (e) {
			console.log(e);  
		}
	});


//-------------------------  MY SWAPS POST ROUTE ----------------------------------------------------

/*Post method to initiate an offer, user selects one of his item to swapand clicks on confirm swap
*adds new offer to offers collection
*changes statuses of both the items from available to pending
*/
app.post('/mySwaps',urlencodedParser,async function(req,res){
	try{
		var swapTable =[];
		var userID = req.session.currentProfile.userID;
		var availItemCode = {theItem:req.body.radioSwap};
		var toSwapItemCode = {theItem:req.body.toSwapItemCode};
		//----------------------On click of confirm swap--------------------------
		//Add offer to offers collection and change status of items to pending
		await offerDB.addOffer(userID,availItemCode.theItem,toSwapItemCode.theItem);
		await itemDB.changeItemStatus(availItemCode.theItem ,'pending');
		await itemDB.changeItemStatus(toSwapItemCode.theItem ,'pending');	

		if(req.session.currentProfile)
		{
			var currentUserID = req.session.currentProfile.userID;
			swapTable =await getOffers(currentUserID); // Populate all the updated offers
		}

		res.render('mySwaps',{swapTable:swapTable,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	}
	catch (e) {
		console.log(e);  
	}
});


//-------------------------  SWAPS ROUTE ----------------------------------------------------

/* Renders swap route
Checks for user's available items
*/
app.get('/swap',async function(req,res){
	try{
		var isAvailable=0;
		var theItem = req.query.theItem;
		var oneItem= await itemDB.getItem(theItem);
		var OtherUserItems =[];
		var availableItems = [];
		var itemStatus = 0;
		if(typeof(req.session.currentProfile) !== "undefined")
		{
			var currentUserID = req.session.currentProfile.userID;
			var UserItems = await itemDB.getUserItems(currentUserID);	

			for(var i=0; i< UserItems.length;i++)
			{
				if(UserItems[i].itemStatus === 'available')
				{
					isAvailable = 1;
					availableItems.push(UserItems[i]);
				}
			}

		if(isAvailable === 0){  //If no available items in User Items
			res.render('item', {theItem:oneItem,itemStatus:itemStatus,isAvailable:isAvailable,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
		}
		else
		{
			res.render('swap',{theItem:oneItem,availableItems:availableItems,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
		}
	}
	else
		res.render('swap',{theItem:oneItem,availableItems:availableItems,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
}
catch (e) {
	console.log(e);  
}
});

};


//-------------------------- MIDDLEWARE FOR ACTION PARAMETER -----------------------------------
/*
Checks if incoming action is accept, reject, withdraw or delete
Accordingly item statuses are changed
*/
async function actionParam(req,res,next){
	
	try{	

		var param = req.query.action;
		var theItem = req.query.theItem;
		var offerItem = req.query.offerItem;
		var offerID = req.query.offerID;

		if(typeof(req.session.currentProfile) !== "undefined")
		{	
			var currentUserID = req.session.currentProfile.userID;
			var UserItems = await itemDB.getUserItems(currentUserID);

			for(var i=0; i< UserItems.length;i++)
			{
				if(UserItems[i].itemStatus === 'pending')
				{

					if(param === 'reject' || param === 'withdraw')
					{  
						await itemDB.changeItemStatus(theItem ,'available');
						await itemDB.changeItemStatus(offerItem ,'available');	
						await offerDB.deleteOffer(offerID);	

					}
					else if(param === 'accept')
					{
						await itemDB.changeItemStatus(theItem ,'swapped');
						await itemDB.changeItemStatus(offerItem ,'swapped');
						await offerDB.deleteOffer(offerID);
					}		
				}


				if(param === 'delete' && theItem === UserItems[i].itemCode){
					if(UserItems[i].itemStatus === 'pending')
						cantDelete = 1;
					else
					{
						cantDelete = 0;
						await itemDB.deleteItem(UserItems[i].itemCode);
					}
				}

			}

		}
		next();
	}
	catch (e) {
		console.log(e);  
	}	
}


/*Generates theh My Swaps table of the offers 
which logged in User received or offered
*/
async function getOffers(currentUserID)
{
	try{
		var swapTable =[];

		var UserItems = await itemDB.getUserItems(currentUserID);

		var myData =await offerDB.getItemsOfferedByMe(currentUserID);
		var otherUserData =await offerDB.getItemsOfferedToMe(currentUserID);

		for(var i=0; i < myData.length;i++)
		{
			var oName = await itemDB.getItem(myData[i].offerData.itemCodeOwn);
			var wName = await itemDB.getItem(myData[i].offerData.itemCodeWant);
			swapTable.push(oName.itemCode);
			swapTable.push(oName.itemName);
			swapTable.push(wName.itemCode);
			swapTable.push(wName.itemName);
			swapTable.push(myData[i].isMyOffer);	
			swapTable.push(myData[i].offerData._id);
		}

		for(var j=0; j < otherUserData.length;j++)
		{

			var oName = await itemDB.getItem(otherUserData[j].offerData.itemCodeOwn);
			var wName = await itemDB.getItem(otherUserData[j].offerData.itemCodeWant);		  
			swapTable.push(wName.itemCode);
			swapTable.push(wName.itemName);
			swapTable.push(oName.itemCode);
			swapTable.push(oName.itemName);
			swapTable.push(otherUserData[j].isMyOffer);	
			swapTable.push(otherUserData[j].offerData._id);
		}
		return swapTable;
	}
	catch (e) {
		console.log(e);  
	}
}

/* Renders My Items view
* If user is not logged in, displays proper message
*gets the rating of all the user items
*/
async function renderMyItems(req,res)
{
	var itemRating = [];
		if(req.session.currentProfile)
		{
	 		//var sessionProfile = req.session.sessionProfile;
	 		var currentUserID = req.session.currentProfile.userID;
	 		var UserItems = await itemDB.getUserItems(currentUserID);	
	 		if(UserItems.length === 0)
	 			res.render('noItemToDisplay',{isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	 		else
	 		{
	 			for(var i=0; i< UserItems.length; i++)
	 			{
	 				var id = UserItems[i].itemCode;
	 				var rating = await feedbackDB.getItemFeedback(id);
	 				itemRating.push(rating[0].rating);
	 			}	

	 			res.render('myItems',{userItems:UserItems,itemRating:itemRating,cantDelete:cantDelete,isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	 			cantDelete =0;
	 		}

	 	}
	 	else
	 		res.render('noItemToDisplay',{isAuthenticated:req.isAuthenticated,currentProfile:req.session.currentProfile});
	 	
}
