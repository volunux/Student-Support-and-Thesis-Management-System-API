module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let cUser = require('../helper/confirm-user');

	let query$ = require(`../queries/${opts.query}`);

	let mailMessage = require(`../mail/messages/${opts.third}`);

	let mailer = require('../mail/mail');

	let $object = require('../helper/object');

	return {

		'manageStatus' : (req , res , next) => {

			let plan = query$.status$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						let $r$b = {};

						$r$b.Status = $result;

						return $rpd.handler(res , 200 , $r$b); }	});

		} ,

		'manageRequest' : (req , res , next) => {

			let plan = query$.manageRequest(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryRequest' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entryRequest(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.rt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.rt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} Type id provided. Please provide a valid ${opts.rt} id.`}); }

		} ,

		'entries' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entries(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} Type id provided. Please provide a valid ${opts.rt} id.`}); }

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) {

			let plan = query$.entryExists(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryAdd' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entryAdd(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.rt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.rt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} Type id provided. Please provide a valid ${opts.rt} id.`}); }

		} ,

		'entryAdd$' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entryAdd$(req , res , {});

			let $r = req.params.request;

			let b = req.body;

			db.query(plan , [$r] , (err , result) => {

					if (err) {

						if (b.documents && b.documents.length > 0) { $object.deleteMany(b.documents , {'query$' : query$ , 'bucket' : opts.bucket});

							return $rpd.handler(res , 400 , {'message' : `Unable to remove documents entry from record. Please try again.`});	}

						return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record. This usually happens as a result of invalid data.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if (b.documents && b.documents.length > 0) {

							let $e = $result._id;

							let plan2 = query$.entryAddDocument$(req , res , {});

							db.query(plan2 , [$e] , (err , result2) => {

									if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save document entry to record. Please try again.`}); }

									if (result2.rowCount < 1) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save document entry to record. Please try again.`}); }

									if (result2.rowCount >= 1) { return $rpd.handler(res , 201 , $result); } });	} 

						else { return $rpd.handler(res , 200 , $result); } }	}); }

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} Type id provided. Please provide a valid ${opts.rt} id.`}); }

		} ,

		'entryDetail' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = null;

			let plan = query$.entryDetail(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReview$' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryReview(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			let b = req.body;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$checkUnit(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail$);

						if (toHappen.run) {

						if ($result.status == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review more than once.`}); }

						if ($result.status !=	'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be updated at this stage.`}); }

			let plan2 = query$.entryReview$(req , res , {'entry' : $result });

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							let $entry = { 'title' : mailMessage.review().title , 'text' : mailMessage.review().message };

							mailer.entryReview(req , res , next , $result.author , $entry.title , $entry.text);

							b.text = $entry.text;

			let plan3 = query$.entryCommentAdd$s(req , res , {'entry' : $result});

			db.query(plan3 , [$r] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

							return $rpd.handler(res , 201 , $result2);	}	});	}	}); }	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryTimeline' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) { let toHappen = null; 

			let plan = query$.entryTimeline(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail);	} }); } 
					
					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1 && toHappen.run) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail$); 

						if (toHappen.run) {

							if ($result.status1 == 'Transferred') { return $rpd.handler(res , 403 , {'message' : `${opts.word} cannot be transferred through this channel.`}); }

		if ($result.status == 'Pending') {

	if ($result.status ==	'Pending' && $result.status1 == 'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to pending more than once.`}); }

	if ($result.status ==	'Pending' && $result.status1 == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review through this channel.`}); }

	if ($result.status ==	'Pending' && $result.status1 == 'Update') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry has to be set in review before it can be updated.`}); }

if ($result.status ==	'Pending' && $result.status1 == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry has to be set in review before it can be fulfilled.`});	}

if ($result.status ==	'Pending' && $result.status1 == 'Rejected') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry has to be set in review before it can be rejected.`});	}
	
			}

		if ($result.status == 'Review') {

if ($result.status == 'Review' && $result.status1 == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review more than once and through this channel.`});	}

if ($result.status ==	'Review' && $result.status1 == 'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to pending once review starts.`});	}

			}

		if ($result.status == 'Update')	{

if ($result.status == 'Update' && $result.status1 == 'Update') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to update more than once.`}); }

if ($result.status == 'Update' && $result.status1 == 'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to pending once review starts.`});	}

	if ($result.status == 'Update' && $result.status1 == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review more than once.`}); }
	
			}

		if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to fulfilled more than once.`}); }

		if ($result.status == 'Rejected') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to rejected more than once.`}); }

									if ($result) { let plan2 = query$.entryUpdate$(req , res , {'entry' : $result });

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0].result;

												if ($result2) {

														if ($result2.status == 'Fulfilled') {	let $entry = mailMessage.fulfilled(req , res , next);

																mailer.entryFulfilled(req , res , next , $result2.author , $entry.title , $entry.message); }

														if ($result2.status == 'Rejected') { let $entry = mailMessage.rejected(req , res , next);

																mailer.entryRejected(req , res , next , $result2.author , $entry.title , $entry.message);	}

				let plan3 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

			db.query(plan3 , [$r] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

								return $rpd.handler(res , 200 , $result);	}	});	}	}	}); }	} }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryTransfer' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryTransfer(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

					if ($result.Entry == null) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

				cUser.$isOwnerGR(req , res , next , $result.Entry , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail$);

						if ($result && toHappen.run) {

							if ($result.status ==	'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred once it is fulfilled.`});	}

							if ($result.status ==	'Rejected' ) { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred once it is rejected.`}); }

									return $rpd.handler(res , 200 , $result); }	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryTransfer$' : (req , res , next) => { let b = req.body;

			if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryTransfer$(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

				if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

				if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

				if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail$); 

					if (toHappen.run) {

					if ($result.status ==	'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred once it is fulfilled.`});	}

					if ($result.status ==	'Rejected') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred once it is rejected.`});	}

					if ($result.unit == b.unit) { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred more than once to the same unit.`});	}

				if (($result.status == 'Transferred') && $result.unit == b.unit) {

					return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be transferred more than once to the same unit.`});	}

										if ($result) {

			let plan2 = query$.entryTransfer$s(req , res , {});

			db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to transfer ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						let plan3 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

					db.query(plan3 , [$r] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save comment entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save comment entry.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

							return $rpd.handler(res , 201 , $result2);	}	});	}	});	} }	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

	'entryAddComment' : (req , res , next) => {

		if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryCommentAdd(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0]; 

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); 

					if ($result && toHappen.run) {

					if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is fulfilled.`}); }

					if ($result.status == 'Rejected') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is rejected.`}); }

					if ($result.status != 'Update' && $result.status != 'Transferred') {

							return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added if ${opts.word} entry is not yet updated.`});	}

						return $rpd.handler(res , 200 , $result);	}	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }
	} ,

		'entryAddComment$' : (req , res , next) => {

				if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryCommentAdd$(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail);

					if ($result && toHappen.run) {

					if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is fulfilled.`}); }

					if ($result.status == 'Rejected') {	return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is rejected.`}); }

					if ($result.status != 'Update' && $result.status != 'Transferred') {

						return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added if ${opts.word} entry is not yet updated.`});	}

					let plan2 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

					db.query(plan2 , [$r] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save comment entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save comment entry.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							return $rpd.handler(res , 201 , $result);	}	});	}	}	});	 }

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }
		} ,

		'entryAddReplytoComment' : (req , res , next) => {

				if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryAddReplytoComment(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			let $c = req.params.comment;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						  cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); 

					if ($result && toHappen.run) {

						if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `Reply cannot be added once ${opts.word} entry is fulfilled.`}); }

						if ($result.status == 'Rejected') {	return $rpd.handler(res , 400 , {'message' : `Reply cannot be added once ${opts.word} entry is rejected.`}); }

					let plan2 = query$.entryCommentDetail(req , res , {});

					db.query(plan2 , [$e , $r , $c] , (err , result2) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve comment entry from record.`}); }

							if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Comment entry does not exists in the record or is not available.`}); }

							if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

								let $entryReply = {	'Entry' : $result , 'Comment' : $result2	};

									return $rpd.handler(res , 200 , $entryReply);	} });	}	}	});	}

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryAddReplytoComment$' : (req , res , next) => {

				if (req.params && req.params.request && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryAddReplytoComment$(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			let $c = req.params.comment;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

							 cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); 

					if ($result && toHappen.run) {

					if (req.params && req.params.comment) {

			let plan2 = query$.entryAddReplytoComment2$(req , res , {});

			db.query(plan2 , [$e , $r , $c] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve comment entry from record. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Comment entry does not exists in the record or is not available.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						if ($result2.replies && $result2.replies.length >= 1) { return $rpd.handler(res , 400 , {'message' : `You can only reply once after been requested to respond by the system.`}); }
					
					if ($result2) {

			let plan3 = query$.entryCommentReplyAdd$(req , res , {'entry' : $result , 'comment' : $result2});

			db.query(plan3 , [$r] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save reply entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

						let $entryReply = {	[opts.first] : $result , 'comment' : $result2 , 'reply' : $result3 };

							return $rpd.handler(res , 201 , $entryReply);	}	});	}	 } }); }

						else { return $rpd.handler(res , 404 , {'message' : `No comment id provided. Please provide a valid comment id.`});	}	}	}	});	}

						else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryDelete' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = null;

			let plan = query$.entryDelete(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDelete$' : (req , res , next) => {

			if (req.params && req.params.request && req.params.entry) { let toHappen = null;

			let plan = query$.entryDelete$(req , res , {});

			let $e = req.params.entry;

			let $r = req.params.request;

			db.query(plan , [$e , $r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerGR(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , opts.entryDetail); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeleteMany$' : (req , res , next) => {

			if (req.params && req.params.request) {

	 		let b = req.body;

			if (b.entries && b.entries.length > 0) {

			let plan = query$.entryDeleteMany$(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry or entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry or entries does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 204 , result.rows ); }	}); } 

			else { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); } }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeleteAll' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entryDeleteAll(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry or entries from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry or entries does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeleteAll$' : (req , res , next) => {

			if (req.params && req.params.request) {

			let plan = query$.entryDeleteAll$(req , res , {});

			let $r = req.params.request;

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `Entries successfully removed from the record.`} ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.rt} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,



	}

}