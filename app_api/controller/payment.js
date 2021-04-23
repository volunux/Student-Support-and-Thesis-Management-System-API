module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/${opts.query}`);

	let cUser = require('../helper/confirm-user');

	let mailMessage = require(`../mail/messages/${opts.third}`);

	let mailer = require('../mail/sendgrid');

	return {

		'managePayment' : (req , res , next) => {

			let plan = query$.managePayment(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryPayment' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let plan = query$.entryPayment(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} Type id provided. Please provide a valid ${opts.pt} id.`}); }

		} ,

		'entries' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let plan = query$.entries(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows); }	}); }

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} Type id provided. Please provide a valid ${opts.pt} id.`}); }

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.entryExists(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); } }); }			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryCheckStatus' : (req , res , next) => {

			if (req.body && req.body.payment_reference) {

			let plan = query$.entryCheckStatus(req , res , {});

			let $e = req.body.payment_reference;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); } }); }			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} reference provided. Please provide a valid ${opts.word} reference.`});	}

		} ,


		'entryAdd' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let plan = query$.entryAdd(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} Type id provided. Please provide a valid ${opts.pt} id.`}); }

		} ,

		'checkPayment' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let $p = req.body.payment_type;

			let $s = req.body.payment_session;

			let $u = req.user._id;

			let plan = query$.checkPaymentTypeAndSession(req , res , {});

			db.query(plan , [$p , $s] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) {

					let plan2 = query$.checkPayment(req , res , {});

					db.query(plan2 , [$p , $s , $u] , (err , result2) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

							if (result2.rowCount < 1) {

							let plan3 = query$.proceedEntryCreate(req , res , {});

							db.query(plan3 , [$p , $s] , (err , result3) => {

									if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve payment type entry. Please try again.`}); }

									if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

									if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

											return $rpd.handler(res , 200 , $result3); } }); }

							if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

								return $rpd.handler(res , 200 , $result2); }	});	} }); }

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} Type id provided. Please provide a valid ${opts.pt} id.`}); }

		} ,

		'entryAdd$' : (req , res , next) => {

			
		} ,

		'entryDetail' : (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.entryDetail(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

					cUser.$isOwnerPayment(req , res , next , $result , null , ['student' , ...opts.normalPrivilege] , opts.leastPrivilege , cUser.successReponse ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.params && req.query.payment && req.params.entry) {

			let plan = query$.entryUpdate$(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 201 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryRefund$' : (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.entryUpdateRefund$(req , res , {});

			let $p = req.params.payment;

			let $e = req.params.entry;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} Type id provided. Please provide a valid ${opts.pt} id.`}); }

		} ,

		'entryDelete' : (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.entryDelete(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDelete$' : (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.entryDelete$(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 204, $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeleteMany$' : (req , res , next) => {

			if (req.params && req.params.payment) {

	 		let b = req.body;

			if (b.entries && b.entries.length > 0) {

			let plan = query$.entryDeleteMany$(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry or entries. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 204 , result.rows ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeleteAll' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let plan = query$.entryDeleteAll(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeleteAll$' : (req , res , next) => {

			if (req.params && req.params.payment) {

			let plan = query$.entryDeleteAll$(req , res , {});

			let $p = req.params.payment;

			db.query(plan , [$p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entries. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `Entries successfully removed from the record.`} ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.pt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,



	}

}