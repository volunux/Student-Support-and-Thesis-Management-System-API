let db = require('../../database/db');

let $rpd = require('../helper/responder');

let async = require('async');

module.exports = (opts) => {

	let query$ = require(`../queries/request-type`);

	return {

		'entryAdd' : (req , res , next) => {

			async.parallel({

												'Unit' : (callback) => { db.query(query$.unit$(req , res , {}) , [] , callback); } ,

												'Status' : (callback) => { db.query(query$.status$(req , res , {}) , [] , callback) }

			} , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (!result) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result.Unit.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

					if (result.Status.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Status entries does not exists in the record or is not available.`});	}

					if (result) { let $r$b = {};

								$r$b['Unit'] = result.Unit.rows;

								$r$b['Status'] = result.Status.rows;

								return $rpd.handler(res , 200 , $r$b);	}	});

		} ,

		'entryUpdate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

				async.parallel({

												'Unit' : (callback) => { db.query(query$.unit$(req , res , {}) , [] , callback); } ,

												'Status' : (callback) => { db.query(query$.status$(req , res , {}) , [] , callback) }

				} , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (!result2) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result2.Unit && result2.Unit.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

					if (result2.Status && result2.Status.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Status entries does not exists in the record or is not available.`});	}

					if (result2) { let $r$b = {};

							$r$b['Unit'] = result2.Unit.rows;

							$r$b['Status'] = result2.Status.rows;

							$r$b['RequestType'] = $result;

								return $rpd.handler(res , 200 , $r$b);	}	});	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

	}

}