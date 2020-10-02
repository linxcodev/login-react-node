const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');

function logData(message) {
	var d = new Date();
	var time =  '[' + d.getHours() + ':' + d.getMinutes() + ':' +d.getSeconds() + '] ';

	console.log(time + message)
}

async function bcryptValidatePassword(p,h) {
	return await bcrypt.compare(p,h);
}

function decodeBase64(data) {
	let buff = Buffer.from(data, 'base64');
	let text = buff.toString('ascii');

	return text;
}

async function GenerateJwt(user) {
  const token = jwt.sign(user, '123456');

	return token;
}

async function VerfifyJwt(token) {
	// try {
	// 	var legit = jwt.verify(token, jwtPublicKey, system_configuration['security']['verify_options']);
	// 	console.log("\nJWT verification result: " + JSON.stringify(legit));
	// 	return true;
	// } catch(err) {
	// 	console.log(err)
	// 	return false;
	// }
	return false;
}

module.exports = {
  logData,
  GenerateJwt,
  decodeBase64,
  bcryptValidatePassword,
}
