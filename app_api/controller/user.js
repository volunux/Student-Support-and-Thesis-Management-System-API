module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let $user = require('../helper/user');

	let async = require('async');

	let crypto = require('crypto');

	let query$ = require(`../queries/${opts.query}`);

	let mailMessage = require(`../mail/messages/user`);

	let mailer = require('../mail/sendgrid');

	let $object = require('../helper/object');

	return {

		'entryExists' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryExists(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDetail' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryDetail(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						if ($result.User == null) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

						if ($result.Country != null && $result.Country.length < 1) { return $rpd.handler(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`});	}

						if ($result.Level != null && $result.Level.length < 1) { return $rpd.handler(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`});	}

						return $rpd.handler(res , 200 , $result);	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryUpdate$(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 201 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeactivate' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryDeactivate(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Active') {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

						return $rpd.handler(res , 200 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeactivate$' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryDeactivate$(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Active') {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

					let plan2 = query$.entryDeactivate$s(req , res , {});

					db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							return $rpd.handler(res , 201 , $result2);	}	});	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReactivate' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryReactivate(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Deactivated') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

						return $rpd.handler(res , 200 , $result); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReactivate$' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryReactivate$(req , res , {});

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Deactivated') {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

					let plan2 = query$.entryReactivate$s(req , res , {});

					db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							return $rpd.handler(res , 201 , $result2);	}	});	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdatePassword$' : (req , res , next) => {

			if (req.user) {

			let plan = query$.entryUpdatePassword$(req , res , {});

			let b = req.body;

			let $e = req.user._id;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

				if ($user.validPassword(b.password , $result) == false) { return $rpd.handler(res , 400 , {'message' : `The current password is incorrect and operation cannot not be fulfilled.`}); }

					let $pass = $user.setPassword(b.new_password);

					let plan2 = query$.entryUpdatePassword$s(req , res , {'pass' : $pass });

					db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							let $entry = mailMessage.passwordUpdate(req , res , next);

							let payload = {'user' : {'email_address' : $result.email_address} , 'title' : $entry.title , 'message' : $entry.message };

							mailer.send(payload);

							return $rpd.handler(res , 201 , $result2);	}	});	}	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'updatePhoto$' : (req , res , next) => {

			if (req.user) {

			let $e = req.user._id;

			let plan = query$.entryDeletePhoto$(req , res , {});

			let plan2 = query$.entryUpdatePhoto$(req , res , {'_id' : $e });

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to remove ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { 

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						return $rpd.handler(res , 201 , $result2); } }); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						$object.objectDeleteServer({'bucket' : opts.bucket , 'key' : $result.key}); 

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						return $rpd.handler(res , 201 , $result2); } }); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'updateSignature$' : (req , res , next) => {

			if (req.user) {

			let $e = req.user._id;

			let plan = query$.entryDeleteSignature$(req , res , {});

			let plan2 = query$.entryUpdateSignature$(req , res , {'_id' : $e });

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to remove ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { 

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						return $rpd.handler(res , 201 , $result2); } }); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						$object.objectDeleteServer({'bucket' : opts.bucket , 'key' : $result.key}); 

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						return $rpd.handler(res , 201 , $result2); } }); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		}

	}

}