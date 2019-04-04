// Require item feedback model
var itemFeedback = require('../model/itemFeedback');
// Require offer feedback model
var offerFeedback = require('../model/offerFeedback');



/**
 *  getItemFeedback(itemCodeVal) – this method fetches the item rating of given item code.
 *  itemCodeVal here refers to the item code which is passed as parameter
 * @param itemCodeVal
 * @returns itemFeedback document
 */
module.exports.getItemFeedback = function getItemFeedback(itemCodeVal)
{
	try{
		return itemFeedback.find({ itemCode:itemCodeVal })
	}
	catch(e)
	{
		console.log("feedbackDB-getItemFeedback",e);
		throw e;
	}
}

/**
 *  updateItemFeedback(itemCode,rating) – this method updates the item rating of given item code and rating.
 *  itemCode here refers to the unique item code.
 *	rating refers to the new rating given by user
 * @param itemCode
 * @param rating
 */
module.exports.updateItemFeedback = function updateItemFeedback(itemCode,rating){
	try{
		itemFeedback.findOneAndUpdate({"itemCode":itemCode},{"rating":rating},function(e){
			if(e) throw e;
		 });
	}
		catch(e)
		{
        console.log("feedbackDB-updateItemFeedback",e);
		throw e;

		}
}

/**
 *  addItemFeedback(itemCode,userID,rating) – this method adds the item rating of given item code and rating.
 *  itemCode here refers to the unique item code, rating refers to the new rating given by user and userID is the
 *	ID of logged in user
 * @param itemCode
  * @param userID
 * @param rating
 */
module.exports.addItemFeedback = function addItemFeedback(itemCode,userID, rating){

	try{var newItemFeedback = new itemFeedback (
		{
			itemCode : itemCode,
			userID:userID,
			rating:rating
		});

	newItemFeedback.save(function(err){if(err) throw err;})
}
catch(e)
{
	console.log("feedbackDB-addItemFeedback",e);
	throw e;
}
}


/**
 *  addOfferFeedback(userID1,userID2,rating) – this method adds the user2's rating given by User1.
 *  rating is the new rating
 * @param userID1
 * @param userID2
 * @param rating
 */
module.exports.addOfferFeedback = function addOfferFeedback(userID1, userID2, rating) 
{
	try{
		var newOfferFeedback = new offerFeedback (
				{
					userID1:userID1,
					userID2:userID2,
					rating:rating
				});

	 newOfferFeedback.save(function(err){if(err) throw err;})
	}
	catch(e)
{
	console.log("feedbackDB-addItemFeedback",e);
	throw e;
}
}
