let db = require('../../database/db');

let $rpd = require('../helper/responder');

module.exports = (opts) => {

	let query$ = require(`../queries/${opts.query}`);

	return {

		'user' : (req , res , next) => {

			let plan = query$.user(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'userEntries' : (req , res , next) => {

			let plan = query$.userEntries(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'generalInternalOne' : (req , res , next) => {

			let plan = query$.generalInternalOne(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'generalInternalTwo' : (req , res , next) => {

			let plan = query$.generalInternalTwo(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'generalInternalThree' : (req , res , next) => {

			let plan = query$.generalInternalThree(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'generalInternalFour' : (req , res , next) => {

			let plan = query$.generalInternalFour(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'other' : (req , res , next) => {

			let plan = query$.other(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

							return $rpd.handler(res , 200 , $result);	}	});
		} 

	}

}