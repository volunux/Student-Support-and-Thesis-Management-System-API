module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/status`);

	return {

		'entryAdd' : (req , res , next) => {

			let plan = query$.entryAdd(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryUpdate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.second} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.second} id provided. Please provide a valid ${opt.second} id.`});	}

		} ,

	}

}