module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let $user = require('../helper/user');

	let async = require('async');

	let crypto = require('crypto');

	let query$ = require(`../queries/index`);

	let mailer = require('../mail/mail');

	return {

		'entryforgotPassword$' : (req , res , next) => {

				async.waterfall([
					
					(done) => {	crypto.randomBytes(20 , (err , buf) => { let token = buf.toString('hex');
															
											done(err , token); });	} ,

					(token , done) => {

			let plan = query$.entryforgotPassword$(req , res , {});

			let $e = req.body.email_address

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `No account or profile with that email address exists in the record.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

					let $t = token;

					let plan2 = query$.entryforgotPassword$s(req , res , {});

					db.query(plan2 , [$t] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to save or update entry to record.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							done(err , token , $result);	}	});	}	}); } ,

				(token , user , done) => { mailer.forgotPassword(req , res , next , token , user , done);	

					done(null , user); } ] ,

				(err , user) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`});	}

					return $rpd.handler(res , 200 , {'message' : `A message to be able to reset your profile password have been sent to your email address`}); });
		} ,

		'resetPassword' : (req , res , next) => {

			if (req.params && req.params.token) {

			let plan = query$.resetPassword(req , res , {});

			let $t = req.params.token;

			db.query(plan , [$t] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Password reset token is invalid or has expired. Kindly request for another password reset token.`});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `${opt.second} password reset token successfully retrieved.`} ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'resetPassword$' : (req , res , next) => { let token = req.params.token;

				async.waterfall([
						
					(done) => {

			let plan = query$.resetPassword$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { done(err , result.rows[0]); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Password reset token is invalid or has expired. Kindly request request for another password reset token.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

					let $pass = $user.setPassword(req.body);

					let plan2 = query$.resetPassword$s(req , res , {'pass' : $pass});

					db.query(plan2 , [] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `No account or profile with that email address exists in the record.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							done(err , token , $result);	}	});	}	}); } ,
					
					(user , done) => { mailer.successfulReset(req , res , next , user , done);	

						done(null , user); } ] ,

					(err) => {

						if (err) { return $rpd.handler(res , 400 , {'message' : `Password reset token is invalid or has expired. Kindly request request for another password reset token`});	}

							else { return $rpd.handler(res , 200 , {'message' : `Password successfully changed and updated.`});	}	});
		}

	}

}