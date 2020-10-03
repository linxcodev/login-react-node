//Native Node
const fs = require('fs');
const http = require('http');

//3rd party
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

//Our Packages
const utils = require('./utilz.js');
const mongo = require('./mongo.js');

const app = express();
      app.use(cors());

/*  Rest Response Codes
	- 701, Authentication Success
	- 702, Verified JWT
	- 703, Valid Articles Request
	- 704, Successful Authors Request

	- 601, Failed Auth
	- 602, JWT Verification failed
*/

http.createServer(app).listen(4000, () => {
  utils.logData('Express Server Listening Port 4000...');

	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
  app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	    next();
	});


	app.get('/', (req,res) => {
		res.send('API Nodemy');
	});

  app.post('/login', async (req,res) => {
    let user = await mongo.AuthenticationUser(req.body.payload);
		if(user !== false && user !== null) {
			user['password'] = 'F00';
			let token = await utils.GenerateJwt(user);
			res.status(200).send({ access_token: token, user, Code: 701 });
		} else {
			res.status(401).send({ Error: ['Failed Authentication'], Code: 601 });
		}
	});

  app.get('/verify', async(req, res) => {
    let auth = req.header('authorization').split('Bearer ');
    let verified = await utils.VerfifyJwt(auth[1]);

    switch (verified) {
      case true:
        console.log('Valid JWT');
        res.status(200).send({ success_message: ['Valid Stored JWT'], Code: 702 });
        break;
      case false:
        console.log('Crappy JWT');
        res.status(401).send({ success_message: ['JWT Verification failed'], Code: 602 });
        break;
      default:
        break;
    }
  })
})
