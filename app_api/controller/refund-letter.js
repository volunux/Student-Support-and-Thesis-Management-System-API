module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/refund-letter`);

	let cUser = require('../helper/confirm-user');

	return {

		'entryWriteLetter' : (req , res , next) => {

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryWriteLetter(req , res , {});

			let u = req.user;

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

							cUser.$isOwnerRefund(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

						if ($result != null && toHappen.run) {

							if ($result.letter != null) { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden action, operation will not be allowed.`}); }

								if ($result.stage == null || $result.stage != 3) { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden action, operation will not be allowed.`});  }

								if ($result.stage != null && $result.stage == 3) {

			let plan_letter = query$.entryLetterSample(req , res , {});

			db.query(plan_letter , [] , (err , result_letter) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve letter entry from the record. Please try again.`}); }

					if (result_letter.rowCount < 1) { return $rpd.handler(res , 200 , $result);	}

					if (result_letter.rowCount >= 1) { let $result_letter = result_letter.rows[0]; 

						$result.Letter = $result_letter;

						return $rpd.handler(res , 200 , $result); } });	}

						else { return $rpd.handler(res , 200 , $result);	} }	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryLetter' : (req , res , next) => {

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryLetter(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

 						cUser.$isOwnerRefund(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

 						if ($result && toHappen.run) {

							if (!$result.letter) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry letter does not exists in the record or is not available.`}); }

								return $rpd.handler(res , 200 , $result ); } }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

	}

}