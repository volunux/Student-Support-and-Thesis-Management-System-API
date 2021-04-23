module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/${opts.query}`);

	let cUser = require('../helper/confirm-user');

	let mailMessage = require(`../mail/messages/general-request`);

	let mailer = require('../mail/sendgrid');

	return {

		'entries' : (req , res , next) => {

			let plan = query$.entries(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryExists(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.row[0];

						return $rpd.handler(res , 200 , $result); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryAdd' : (req , res , next) => {

			let plan = query$.entryAdd(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to retrieve data. Please try again.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});
		} ,

		'entryAdd$' : (req , res , next) => {

			let plan = query$.entryAdd$(req , res , {});

			let b = req.body;

			db.query(plan , [] , (err , result) => {

					if (err) {

					 return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record. This usually happens as a result of invalid data.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];
						
						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryDetail' : (req , res , next) => {

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryDetail(req , res , {});

			let u = req.user;

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

							cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

						if ($result && toHappen.run) {

						return $rpd.handler(res , 200 , $result); }	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReview$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryReview(req , res , {});

			let $e = req.params.entry;

			let b = req.body;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review more than once.`}); }

						if ($result.status !=	'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be updated at this stage.`}); }

					let plan2 = query$.entryReview$(req , res , {});

					db.query(plan2 , [$e] , (err , result2) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to set ${opts.word} entry on review. Please try again.`}); }

							if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

							if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

		 							let $entry = {'title' : mailMessage.review().title , 'message' : mailMessage.review().message };

									let payload = {'user' : {'email_address' : $result.author.email_address} , 'title' : $entry.title , 'message' : $entry.message };

									mailer.send(payload);

							b.text = $entry.message;

							let plan3 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

							db.query(plan3 , [] , (err , result3) => {

									if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} comment. Please try again.`}); }

									if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

									if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

											return $rpd.handler(res , 201 , $result2);	}	});	}	});	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryTimeline' : (req , res , next) => {

				if (req.params && req.params.entry) { let toHappen = null; 

			let plan = query$.entryTimeline(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

					 cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);	}	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryStatus' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryStatus(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateRole' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateRole(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve User Role entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Role entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateRole$' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateRole$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateUnit' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateUnit(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve User Unit entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Unit entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0].result;

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateUnit$' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateUnit$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateMessageType' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateMessageType(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve Message Type entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Message Type entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateMessageTypeList' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateMessageTypeList(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve Message Type entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Message Type entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateMessageTypeDetail' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateMessageTypeDetail(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve Message Type entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Message Type entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdateSendMail$' : (req , res , next) => {

				if (req.params && req.params.entry) {

			let plan = query$.entryUpdateSendMail$(req , res , {});

			let $e = req.params.entry;

			let b = req.body;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

					let payload = {'user' : {'email_address' : $result.email_address} , 'title' : b.title , 'message' : b.body };

							mailer.send(payload);

						return $rpd.handler(res , 200 , {'message' : `Mail Message delivered to the receipient of the entry`}); }	});	}

					else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1 && toHappen.run) { let $result = result.rows[0];

						cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , cUser.successReponse , opts.leastPrivilege , cUser.successReponse); 

						if (toHappen.run) {

							if ($result.status1 == 'Transferred') { return $rpd.handler(res , 403 , {'message' : `${opts.word} cannot be transferred.`}); }

		if ($result.status == 'Pending') {

	if ($result.status ==	'Pending' && $result.status1 == 'Pending') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to pending more than once.`}); }
	
			}

		if ($result.status == 'Review') {

if ($result.status == 'Review' && $result.status1 == 'Review') {	return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be set to review more than once.`});	}

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

																let payload = {'user' : {'email_address' : $result2.author.email_address} , 'title' : $entry.title , 'message' : $entry.message };

																mailer.send(payload); }

														if ($result2.status == 'Rejected') { let $entry = mailMessage.rejected(req , res , next);

																let payload = {'user' : {'email_address' : $result2.author.email_address} , 'title' : $entry.title , 'message' : $entry.message };

																mailer.send(payload); }

				let plan3 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

			db.query(plan3 , [] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

								return $rpd.handler(res , 200 , $result);	}	});	}	}	}); }	} }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

	'entryAddComment' : (req , res , next) => {

		if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryCommentAdd(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

					cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

					if ($result && toHappen.run) {

					if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is fulfilled.`});	}

					if ($result.status == 'Rejected') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is rejected.`}); }

							return $rpd.handler(res , 200 , $result);	}	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }
		} ,

		'entryAddComment$' : (req , res , next) => {

				if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryCommentAdd$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

					 cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse); 

					if ($result && toHappen.run) {

					if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is fulfilled.`}); }

					if ($result.status == 'Rejected') {	return $rpd.handler(res , 400 , {'message' : `Comment entry cannot be added once ${opts.word} entry is rejected.`}); }

					let plan2 = query$.entryCommentAdd$s(req , res , {'entry' : $result });

					db.query(plan2 , [] , (err , result2) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

							if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

							if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

									return $rpd.handler(res , 201 , $result);	}	});	}	}	});	 }

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryAddReplytoComment' : (req , res , next) => {

				if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryAddReplytoComment(req , res , {});

			let $e = req.params.entry;

			let $c = req.params.comment;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse); 

					if ($result && toHappen.run) {

						if ($result.status == 'Fulfilled') {	return $rpd.handler(res , 400 , {'message' : `Reply cannot be added once ${opts.word} entry is fulfilled.`});	}

						if ($result.status == 'Rejected') {		return $rpd.handler(res , 400 , {'message' : `Reply cannot be added once ${opts.word} entry is rejected.`});	}

					let plan2 = query$.entryCommentDetail(req , res , {});

					db.query(plan2 , [$e , $c] , (err , result2) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve comment entry from the record. Please try again.`}); }

							if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Comment entry does not exists in the record or is not available.`});	}

							if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

								let $entryReply = {	'Entry' : $result , 'Comment' : $result2	};

									return $rpd.handler(res , 200 , $entryReply);	} });	}	}	});	}
					
				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryAddReplytoComment$' : (req , res , next) => {

				if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query$.entryAddReplytoComment1$(req , res , {});

			let $e = req.params.entry;

			let $c = req.params.comment;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						cUser.$isOwnerAccountChangeRequest(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse); 

					if ($result && toHappen.run) {

					if (req.params && req.params.comment) {

			let plan2 = query$.entryCommentDetailReplyAdd(req , res , {});

			db.query(plan2 , [$e , $c] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve comment entry from the record. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Comment entry does not exists in the record or is not available.`}); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						if ($result2.replies && $result2.replies.length >= 1) { return $rpd.handler(res , 400 , {'message' : `You can only reply once after been requested to respond by the system.`}); }
					
					if ($result2) {

			let plan3 = query$.entryCommentReplyAdd$s(req , res , {'entry' : $result , 'comment' : $result2});

			db.query(plan3 , [] , (err , result3) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

					if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

						let $entryReply = {	[opts.first] : $result , 'comment' : $result2 , 'reply' : $result3 };

							return $rpd.handler(res , 201 , $entryReply);	}	});	}	 } });	}
					
						else {	return $rpd.handler(res , 404 , {'message' : `No comment id provided. Please provide a valid comment id.`});	}	}	}	});	}
						
						else {	return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}
		} ,

		'entryDelete' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDelete(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDelete$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDelete$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 204 , $result ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeleteAll' : (req , res , next) => {

			let plan = query$.entryDeleteAll(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows;

						return $rpd.handler(res , 200 , $result); }	});

		} ,

		'entryDeleteAll$' : (req , res , next) => {

			let plan = query$.entryDeleteAll$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry or entries from the record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `Entries successfully removed from the record.`} ); }	});

		} ,
	}

}