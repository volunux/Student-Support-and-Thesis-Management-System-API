let db = require('../../database/db');

let $rpd = require('./responder');

let async = require('async');

let crypto = require('crypto');

let query$ = require(`../queries/admin`);

let jwt = require('jsonwebtoken');

module.exports = {

	'setPassword' : (password) => {

		let $pass = {};
	
		$pass.salt = crypto.randomBytes(16).toString('hex');
	
		$pass.hash = crypto
								
								.pbkdf2Sync(password , $pass.salt , 1000 , 64 , 'sha512')

								.toString('hex');

			return $pass;

	} ,

	'validPassword' : (password , user) => {
	
	 	let hash = crypto
							
							.pbkdf2Sync(password , user.salt , 1000 , 64 , 'sha512')
							
							.toString('hex');

			return user.hash === hash;

	} ,

	'generateJwt' : (u) => {
	
		let expiry = new Date();

		expiry.setDate(expiry.getDate() + 7);

		console.log('Trying to confirm Key');

		console.log(process.env.JWT_SECRET);

		console.log('Trying to confirm Key');

		return jwt.sign({

			'_id' : u._id ,

			'email_address' : u.email_address ,

			'username' : u.username ,

			'role' : u.role , 

			'department' : u.department ,

			'faculty' : u.faculty ,

			'unit' : u.unit ? u.unit : null ,

			'status' : u.status ,

			'exp' : parseInt(expiry.getTime() / 1000 , 10) /*parseInt(Date.now() / 1000) + 1 * 60* 1 denote minute*/ ,

			} , process.env.JWT_SECRET );
	
	} ,

	'userUpdateFields' : (req , res , next) => {

			return ['unit' , 'department' , 'faculty' , 'password' , 'hash' , 'salt' , 'status' , 'role' , 'lastLoggedIn' , 'reset_password_token' , 'reset_password_expires' ,

							'username' , 'email_address' , 'identity_number' , 'jamb_registration_number' , 'matriculation_number' ];
		} ,

	'update$p$p$s$' : (req , res , next) => {

		return ['first_name' , 'last_name' , 'identity_number' , 'country' , 'level' , 'unit' , 'department' , 'faculty' , 'password' , 'hash' , 

						'salt' , 'status' , 'role' , 'username' , 'reset_password_token' , 'reset_password_expires' ,

						'email_address' , 'last_logged_in' , 'crearted_on' , 'updated_on' , 'matriculation_number' , 'jambRegistrationNumber' , 'about']

	} ,

	'adminUserUpdate' : (req , res , next) => {

		return ['password' , 'hash' , 'salt' , 'username' , 'email_address'];

	} ,

	'checkUsernameAndEmail' : (req , res , next) => {

		let b = req.body;

		async.parallel({

			'Email' : (callback) => { db.query(query$.verifyEmail(req , res , {}) , [] , callback); } ,

			'Username' : (callback) => { db.query(query$.verifyUsername(req , res , {}) , [] , callback); } ,

		} , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (!result2) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result2.Email && result2.Email.rowCount >= 1) { return $rpd.handler(res , 400 , {'message' : `E-mail Address already exists in the record.`}); }

					if (result2.Username && result2.Username.rowCount >= 1) { return $rpd.handler(res , 400 , {'message' : `Username already exists in the record.`}); }

					if (result2.Email.rowCount < 1 && result2.Username.rowCount < 1) { return next(); } });
		} ,

}