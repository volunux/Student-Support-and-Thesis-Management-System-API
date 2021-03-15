module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/others`);

	return {

		'manageStatus' : (req , res , next) => {

			opts.word = 'Request Status';

			let plan = query$.requestStatus$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						let $r$b = {};

						$r$b.Status = $result;

						return $rpd.handler(res , 200 , $r$b); }	});

		} ,

		'manageMessageTemplate' : (req , res , next) => {

			opts.word = 'Message Template';

			let plan = query$.messageTemplate$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						let $r$b = {};

						$r$b.MessageTemplate = $result;

						return $rpd.handler(res , 200 , $r$b); }	});

		} ,

		'messageTemplateEntryDetail' : (req , res , next) => {

			opts.word = 'Message Template';

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.messageTemplateEntryDetail(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

	}

}