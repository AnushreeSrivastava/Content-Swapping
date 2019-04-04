//Require item model
var item = require ('../model/item');

//Requires itemDB model
var itemDB=require('../model/itemDB');
var itemList =[];


/**
 *  addItem(itemCode,userID, itemName,catalogCategory,itemStatus,description, imageUrl) –
 *	this method adds new item to the database with the given params
 * @param itemCode
 * @param userID
 * @param itemName
 * @param catalogCategory
 * @param itemStatus
 * @param description
 * @param imageUrl
 */
module.exports.addItem = function addItem(itemCode,userID, itemName,catalogCategory,itemStatus,description, imageUrl){
var newItem = new item (
	{
	itemCode : itemCode,
	userID:userID,
	itemName : itemName,
	catalogCategory:catalogCategory,
	itemStatus:itemStatus,
	description:description,
	imageUrl:imageUrl
	});
newItem.save(function(err){if(err) throw err;})
}

/**
 *  addItem(item) –
 *	this method adds new item to the database with the given item object
 * @param item
  */
module.exports.addItem = function addItem(item){
	var itemObj = item;
 var newItem = new item (
	{
	itemCode : itemObj.itemCode,
	userID:itemObj.userID,
	itemName : itemObj.itemName,
	catalogCategory:itemObj.catalogCategory,
	itemStatus:itemObj.itemStatus,
	description:itemObj.description,
	imageUrl:itemObj.imageUrl
	});
newItem.save(function(err){if(err) throw err;})
}

/**
 *  getAllItems() –
 *	this method returns all the items in the database
 * @return item list object
  */
module.exports.getAllItems = function getAllItems(){
	try
	{
		return item.find({},function(err,data){itemList = data;})
	}
	catch(e){
		console.log("itemDB-getAllItems",e);
		throw e;
	}

}

/**
 *  getItem(itemCode) – Item code is the item unique identifier -
 *	this method returns the item object for the given item code
 * @param itemCode
 * @return item object
  */
module.exports.getItem=function (itemCode){
		var itemCodeVal = itemCode;
		try{
		return item.findOne({ itemCode:itemCodeVal })
		  }
		  catch(e){
		   console.log("itemDB-getItem",e);
		   throw e;
		}
	}

/**
 *  getOneUser(itemCode) – Item code is the item unique identifier -
 *	this method returns the user of which the item belongs to
  * @param itemCode
 * @return user ID
  */
module.exports.getOneUser=function getOneUser(itemCode){
try{
	return item.find({ itemCode:itemCode },{userID:1})
	}
 catch(e){
		   console.log("itemDB-getOneUser",e);
		   throw e;
		}
}


/**
 *  getUserItems(userID) – UserID is the user unique identifier -
 *	this method returns all the items of a given User (UserID)
 * @param userID
 * @return item list object
  */
module.exports.getUserItems=function getUserItems(userID){

	try{
		return item.find({userID:userID})
	}
	catch(e){
		console.log("itemDB-getUserItems",e);
		throw e;
	}
}

/**
 *  changeItemStatus(itemCode,itemStatus) – this method changes the current status of the item to the
 *	 given itemStatus
 * @param itemCode
 * @param itemStatus	
 */
module.exports.changeItemStatus = function changeItemStatus(itemCode,itemStatus)
{
  try{
		item.updateOne({itemCode:itemCode} ,{$set: {itemStatus:itemStatus}},function(err){});		
	}
	catch(e){
		console.log("itemDB-changeItemStatus",e);
		throw e;
	}
}


/**
 *  deleteItem(itemCode) – this method deletes the item of given item code.
 * @param itemCode
 */
module.exports.deleteItem = function deleteItem(itemCode)
{
  try{
		item.deleteOne({itemCode:itemCode},function(err){})
		//return true;
	}
	catch(e){
		console.log("itemDB-deleteItem",e);
		throw e;
	}
}


/**
 *  getCategories(categoryName) – this method returns all the categories, 
 *	if parameter "categoryName" is present then filters only that category
 * @param categoryName
 * @return category list object
 */
module.exports.getCategories=function getCategories(categoryName){ // Returns list of Categories

		try{
		    if(categoryName === undefined)
			   return item.distinct("catalogCategory")
			//else  if(itemCode === undefined)
			else
				return item.distinct("catalogCategory",{catalogCategory: categoryName});
			//else
			//	return item.distinct("catalogCategory",{$and:[{catalogCategory: categoryName},{itemCode:itemCode}]);

		}
		catch(e){
			console.log("itemDB-deleteItem",e);
			throw e;
		}
	}







