module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let $user = require('../helper/user');

	let $secure = require('../helper/security')

	let async = require('async');

	let crypto = require('crypto');

	let passport = require('passport');

	let query$ = require(`../queries/authentication`);

	let mailMessage = require(`../mail/messages/user`);

	let mailer = require('../mail/sendgrid');

	return {

		'signUp' : (req , res , next) => {

				async.parallel({

				'Country' : (callback) => { db.query(query$.country$(req , res , {}) , [] , callback); } ,

				} , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (!result) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result.Country && result.Country.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`}); }

					if (result) { let $result = {};

							$result['Country'] = result.Country.rows;

						return $rpd.handler(res , 200 , $result);	}	});

		} ,

		'signUp$' : (req , res , next) => {

			let b = req.body;

			async.parallel({

				'Email' : (callback) => {

					let $e = b.email_address;

				 db.query(query$.verifyEmail(req , res , {}) , [$e] , callback); } ,

				'Username' : (callback) => { 

					let $e = b.username;

					db.query(query$.verifyUsername(req , res , {}) , [$e] , callback); } ,

			} , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (!result) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result.Email && result.Email.rowCount >= 1) {

						return $rpd.handler(res , 404 , {'message' : `E-mail Address already exists in the record and is not avaialable to new a user.`}); }

					if (result.Username && result.Username.rowCount >= 1) {

						return $rpd.handler(res , 404 , {'message' : `Username already exists in the record and is not avaialable to new a user.`}); }

					if (result.Email.rowCount < 1 && result.Username.rowCount < 1) {

						let $pass = $user.setPassword(b.password);

						let plan2 = query$.entryAdd$(req , res , {'sec' : $pass});

						db.query(plan2 , [] , (err , result2) => {

								if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

								if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record.`}); }

								if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

		 							let $entry = {'title' : mailMessage.create2().title , 'message' : mailMessage.create2().message };

									let payload = {'user' : {'email_address' : b.email_address} , 'title' : $entry.title , 'message' : $entry.message };

									mailer.send(payload);

									let $u = $result2._id;

									let token = $user.generateJwt($result2);

									$secure.encryptor(req , res , token , $u); }	});	}	});
		} ,

		'signIn$' : (req , res , next) => {

				return passport.authenticate('local' , (err , user , info) => {
					
					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (user) {

						let $u = user._id;

						let token = $user.generateJwt(user);

						$secure.encryptor(req , res , token , $u); }
					
				else { return $rpd.handler(res , 401 , info); } })(req , res , next);

		} ,

		'signOut' : (req, res) => { let token = req.cookies.sid && req.cookies.s_id;

				if (token == false) {	return $rpd.handler(res , 401 , {'message' : 'Please provide credentials.'}); }

				res.clearCookie('sid');

				res.clearCookie('s_id');

				$rpd.handler(res , 200 , {'message' : 'Successfully signed out.'});
		}

	}

}