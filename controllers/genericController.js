
var mongoose = require('mongoose');
var item = require ('../model/item');
var itemDB=require('../model/itemDB');
var UserDB = require('../model/UserDB');
var feedbackDB = require('../model/feedbackDB');
var htmlencode = require('htmlencode');

var allItems =itemDB.getAllItems();

var currentProfile;
var isAuthenticated;

module.exports = function(app){

	//Define @isAuthenticated and @currentProfile parameteres across the controller
	app.use(function(req,res,next){
	isAuthenticated = (req.session.theUser !== undefined) ? "1" :"0";
	currentProfile = (req.session.theUser !== undefined) ? req.session.theUser : undefined;
	next();
	});

// get route for home
	app.get('/home',function(req,res){
		res.render('index',{isAuthenticated:isAuthenticated, currentProfile :req.session.currentProfile}); 
	});

//get route for home
	app.get('/',async function(req,res){	
		res.render('index',{isAuthenticated:isAuthenticated ,currentProfile : req.session.currentProfile});
	 });

/**
 * Renders item view of an item.
 * gets item code from query string.
 * fetches the item info from the item code
 * fetches the rating info from item feedback
 * Checks if user has any available item to swap
 */
	app.get('/item',async function(req,res){
   	    var allItems = await itemDB.getAllItems();
    	
		var theItem = req.query.theItem;
		var oneItem= await itemDB.getItem(theItem);
		var rating = await feedbackDB.getItemFeedback(theItem);
		var isAvailable = await checkItemAvailability(req,res);
			res.render('item', {theItem:oneItem,itemRating:rating[0].rating,isAvailable:isAvailable,isAuthenticated:isAuthenticated,currentProfile:req.session.currentProfile});
	});

/**
 * Renders item view of an item.
 * gets item code from query string.
 * get rating from post request, update it to database
 * fetches the item info from the item code
 * fetches the rating info from item feedback
 * Checks if user has any available item to swap
 */
	app.post('/item',async function(req,res){
		var theItem = req.query.theItem;
		var rating = req.body.ratingValue;
		await feedbackDB.updateItemFeedback(theItem,rating);
		var oneItem= await itemDB.getItem(theItem);
		var rating = await feedbackDB.getItemFeedback(theItem);
		var isAvailable = await checkItemAvailability(req,res);
			res.render('item', {theItem:oneItem,itemRating:rating[0].rating,isAvailable:isAvailable,isAuthenticated:isAuthenticated,currentProfile:req.session.currentProfile});
	});

/**
 * Renders catalog view
 * gets all the categories
 * fetches items that belongs to logged in user
 */
	app.get('/categories',async function(req,res){

		var categories =await itemDB.getCategories();
		var allItems =await filteredItems(req,res);
			var data = {
				items: allItems,
				categories: categories,
			};
		res.render('categories', {data:data,isAuthenticated:isAuthenticated,currentProfile : req.session.currentProfile});		
	});

/**
 * Renders catalog view for a given category
 * gets all the categories
 * fetches items that belongs to logged in user
 */
 app.get('/categories/:catalogCategory',async function (req, res) {
   
     var catagoryName = req.params.catalogCategory;
       var categories =await itemDB.getCategories(catagoryName); 
       if(categories.length === 0)
       {
       	 categories =await itemDB.getCategories(); 
       }  
        	var allItems =await filteredItems(req,res);
        	 var data = {
				items: allItems,
				categories: categories,
			};
		res.render('categories', {data:data,isAuthenticated:isAuthenticated,currentProfile : req.session.currentProfile});		
	});


/**
 * Renders item view for a given category and particular item code
 and if there is no item code, returns the catalog view
 * gets all the categories
 * fetches items that belongs to logged in user
 */
 app.get('/categories/:catalogCategory/:itemCode',async function (req, res) {
   
     var catagoryName = req.params.catalogCategory;
     var itemCode =  req.params.itemCode;
    var oneItem= await itemDB.getItem(itemCode);
	var isAvailable = await checkItemAvailability();
	if(oneItem === null)
	{
		var categories =await itemDB.getCategories();
		var allItems =await filteredItems(req,res);
			var data = {
				items: allItems,
				categories: categories,
			};
		res.render('categories', {data:data,isAuthenticated:isAuthenticated,currentProfile : req.session.currentProfile});		
	}
	else
	  res.render('item', {theItem:oneItem,isAvailable:isAvailable,isAuthenticated:isAuthenticated,currentProfile:req.session.currentProfile});
	});


//get route for About Us
 	app.get('/aboutUs',function(req,res){ res.render('aboutUs',{isAuthenticated:isAuthenticated, currentProfile :req.session.currentProfile}); });
	

//get route for Contact
	app.get('/contact',function(req,res){ res.render('contact',{isAuthenticated:isAuthenticated, currentProfile :req.session.currentProfile}); });

};


//***Function to return all the 
//***items which are not of users'
async function filteredItems(req,res){
	var allItems =await itemDB.getAllItems();
		var notUserItems = allItems.slice();
	

		if(typeof(req.session.currentProfile) !== "undefined")
		{
			var currentUserID = req.session.currentProfile.userID;
			var UserItems =await itemDB.getUserItems(currentUserID);
			for(var i=0; i< UserItems.length; i++){
				for(var j=0;j < notUserItems.length ;j++){
					if(notUserItems[j].itemCode === UserItems[i].itemCode)
					{
						notUserItems.splice(j,1);
					}
				}
			}
			allItems = notUserItems.slice();
		}
		return allItems;
}


//***Function to check if user has any item available for swapping
async function checkItemAvailability(req,res)
{
	var isAvailable=0;
		if(currentProfile){
		var currentUserID = req.session.currentProfile.userID;
		var UserItems = await itemDB.getUserItems(currentUserID);		
		for(var i=0; i< UserItems.length ;i++){
			if(UserItems[i].itemStatus === 'available')
					isAvailable=1;
		 }	
		}
	return isAvailable;
}