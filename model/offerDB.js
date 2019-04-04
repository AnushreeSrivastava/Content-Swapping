// Require offer model
var offer = require ('../model/offer');

//Require item model
var item = require ('../model/item');


/**
 *  getAllOffers() –
 *	this method returns all the offers in the database
 * @return offer list object
  */
module.exports.getAllOffers = function getAllOffers(){
	try
	{
		return offer.find({})
	}
	catch(e){
		console.log("offerDB-getAllOffers",e);
		throw e;
	}

}

/**
 *  addOffer(userID,itemCodeOwn,itemCodeWant) – this method adds an offer to the database. The userID
 *  here refers to the user that is making the offer and itemCodeOwn is the itemCode that this user owns and
 *  itemCodeWant is the item code they would like to get.
 * @param userId
 * @param itemCodeOwn
 * @param itemCodeWant
 */
module.exports.addOffer = function addOffer(userID,itemCodeOwn,itemCodeWant){
try 
	{
		var newOffer = new offer(
			{
			userID:userID,
			itemCodeOwn : itemCodeOwn,
			itemCodeWant:itemCodeWant
			});
		newOffer.save(function(err){if(err) throw err;});
	}
catch(e)
	{
		console.log("offerDB-addOffer",e);
		throw e;
	}
}

/**
 *  updateOffer(offerID) - This method updates the offerID of an offer
 *	@param offerID
  */
module.exports.updateOffer = function updateOffer(offerID){
try{

	return offer.findOneAndUpdate({_id : offerID});
	}
catch(e)
	{
		console.log("offerDB-addOffer",e);
		throw e;
	}
}

/**
 *  deleteOffer(offerID) - This method deletes the offer of a given offerID
 *	@param offerID
  */
module.exports.deleteOffer = function deleteOffer(offerID){

	try{
		return offer.deleteOne({_id : offerID},function(err){});
	}
	catch(e)
	{
		console.log("offerDB-deleteOffer",e);
		throw e;
	}
}



/**
 *  getItemsOfferedByMe(userID) - This method returns all the items which user offered
 *	@param userID
 * @return item list object
  */
module.exports.getItemsOfferedByMe = function getItemsOfferedByMe(userID){
	
try{
	return item.aggregate([
  { "$match": { "userID": userID } },
  { "$lookup": {
    "localField": "itemCode",
    "from": "offers",
    "foreignField": "itemCodeOwn",
    "as": "offerData"
  } },
  { "$unwind": "$offerData"},
  { "$project": {
    "isMyOffer":'1',
    "offerData._id":1,
    "offerData.itemCodeOwn": 1,
    "offerData.itemCodeWant": 1,
  } }
])
}
 catch(e){
		   console.log("offerDB-getItemsOfferedByMe",e);
		   throw e;
		}
	
}

/**
 *  getItemsOfferedToMe(userID) - This method returns all the items which are offered to user
 *	@param userID
 * @return item list object
  */
module.exports.getItemsOfferedToMe = function getItemsOfferedToMe(userID){
	
try{
	return item.aggregate([
  { "$match": { "userID": userID } },
  { "$lookup": {
    "localField": "itemCode",
    "from": "offers",
    "foreignField": "itemCodeWant",
    "as": "offerData"
  } },
  { "$unwind": "$offerData"},
  { "$project": {
    "isMyOffer":'0',
    "offerData._id":1,
    "offerData.itemCodeOwn": 1,
    "offerData.itemCodeWant": 1,
  } }
])
}
 catch(e){
		   console.log("offerDB-getItemsOfferedByMe",e);
		   throw e;
		}
	
}