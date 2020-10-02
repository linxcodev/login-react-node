//Native Packages
const bcrypt = require('bcrypt');

//3rd party
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

//Our Packages
const utils = require('./utilz.js');

MongoClient.connect("mongodb://localhost:27017/api", { useUnifiedTopology: true, useNewUrlParser: true }, ConfigureAPI);

/* Internal Configuration */
let api = null;
let admin = null;
function ConfigureAPI(err, db) {
	if(!err) {
		api = db.db('api');
		//admin = db.db('admin').admin();

		utils.logData("Mongo Connected & API Configured...");
	} else if(err) { utils.logData('Mongo Not Connected'); console.log(err); return; }
}

async function AuthenticationUser(upObj) {
	let col = api.collection('users');
	let u = utils.decodeBase64(upObj['user']);
	let p = utils.decodeBase64(upObj['password']);

	let find = {
		$or: [
      { email : u },
      { alias:  u }
		]
	}

	try {
   	let user = await col.findOne(find);
   	if(user !== null) {
			let vp = await utils.bcryptValidatePassword(p, user['password']);
	    switch(vp) {
		    case true:
		    	return user;
		    	break;
		    case false:
		    default:
		    	return false;
	    }
   	} else { console.log('Error: @Mongo, User Not Found.'); return false; }
 	} catch(error) {
	   console.log('Error: @Mongo, Something Went Horribly Wrong.');
	   return false;
 	}
}

module.exports = {
	AuthenticationUser
};
