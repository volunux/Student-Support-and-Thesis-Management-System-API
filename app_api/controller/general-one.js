let db = require('../../database/db');

let $rpd = require('../helper/responder');

module.exports = (opts) => {

	let query$ = require(`../queries/${opts.query}`);

	return {

		'entries' : (req , res , next) => {

			let plan = query$.entries(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry or entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry or entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows); }	});

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryExists(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryAdd' : (req , res , next) => {

			let plan = query$.entryAdd(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

							return $rpd.handler(res , 200 , $result);	}	});

		} ,

		'entryAdd2' : (req , res , next) => {

			let plan = query$.entryAdd2(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result);	}	});

		} ,

		'entryAdd$' : (req , res , next) => {

			let plan = query$.entryAdd$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save entry to record. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }});

		} ,

		'entryDetail' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryDetail(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryUpdate(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result);	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryUpdate$(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 201 , $result); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDelete' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryDelete(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

					 return $rpd.handler(res , 200 , $result); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDelete$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryDelete$(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 204, $result); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeleteMany$' : (req , res , next) => {

	 		let b = req.body;

			let plan = query$.entryDeleteMany$(req , res , {});

			if (b.entries && b.entries.length > 0) {

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry or entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 204 , result.rows); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

		} ,

		'entryDeleteAll' : (req , res , next) => {

			let plan = query$.entryDeleteAll(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry or entries does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows); } });

		} ,

		'entryDeleteAll$' : (req , res , next) => {

			let plan = query$.entryDeleteAll$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `Entries successfully removed from the record.`} ); } });

		} ,

	}

}