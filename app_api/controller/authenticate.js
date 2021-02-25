module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let AuthRepo = require(`../queries/authenticate`).AuthenticateRepository;

	let query$ = new AuthRepo();

	return {

		'verifyEmail' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.verifyEmail(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 200 , {'isAvailable' : true , 'emailAddress' : $e});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 404 , {'isAvailable' : false , 'emailAddress' : $e}); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'verifyUsername' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.verifyUsername(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 200 , {'isAvailable' : true , 'username' : $e});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 404 , {'isAvailable' : false , 'username' : $e}); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryExists(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		}

	}

}