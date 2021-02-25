module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let query$ = require(`../queries/${opts.query}`);

	let query1$ = require(`../queries/refund-update`);

	let cUser = require('../helper/confirm-user');

	let mailMessage = require(`../mail/messages/${opts.third}`);

	let mailer = require('../mail/mail');

	let refundUpdateCol = require('./refund-update');

	let async = require('async');

	return {

		'entryUpdate$' : (req , res , next) => { let b = req.body;

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

			let plan = query1$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

 						cUser.$isOwnerRefund(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

 						if ($result && toHappen.run) {

						if ($result.stage == null) { return $rpd.handler(res , 400 , {'message' : `Entry need to be set on review before it can be updated by the system.`});	}

						if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be fulfilled more than once.`});	}

						if ($result.status == 'Rejected') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be rejected more than once.`});	}


						if ($result.stage && $result.stage._id == 2) {

							if ($result.status == 'Review' && b.stage == '2') {

								return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be at stage 2 more than once.`});	}	}


						if ($result.stage && $result.stage._id == 3) {

							if ($result.status == 'Review' && b.stage == '3') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be at stage 3 more than once.`});	}

							if ($result.status == 'Review' && b.stage == '6') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be at stage 6 until after stage 3 , 4 and 5.`}); } }


						if ($result.stage && $result.stage._id == 4) {

							if ($result.status == 'Review' && b.stage == '4') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be at stage 4 more than once.`});	}	}


						if ($result.stage && $result.stage._id == 5) {

							if ($result.status == 'Review' && b.stage == '5' && $result.signature && $result.signature.length >= 2) {

								return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be at stage 5 more than once.`});	}	}


						if ($result.stage && $result.stage._id == 6) {

							if ($result.status == 'Fulfilled') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be fulfilled more than once.`});	}

							if ($result.status == 'Rejected') { return $rpd.handler(res , 400 , {'message' : `${opts.word} entry cannot be rejected more than once.`});	}	}

							if ($result) {

								if (b.stage == '2') {

									if ($result.status1 == 'Rejected') {

										let plan_sub = query1$.entryUpdate2x$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

															let $entry = mailMessage.rejected(req , res , next);

															mailer.entryRejected(req , res , next , $result.author , $entry.title , $entry.message);	

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [$e] , (err , result_comment) => {

																if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

																if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

																if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

																	return $rpd.handler(res , 201 , $result); } });	}	});	}

										else if ($result.status1 == 'Fulfilled') {

										let plan_sub = query1$.entryUpdate2s$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [$e] , (err , result_comment) => {

																if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

																if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

																if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

																	return $rpd.handler(res , 201 , $result); } });	}	});	}	

										else { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden action, operation will not be allowed.`}); } }



									else if (b.stage == '3') {

										if ($result.status1 == 'Rejected') {

										let plan_sub = query1$.entryUpdate3x$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

															let $entry = mailMessage.rejected(req , res , next);

															mailer.entryRejected(req , res , next , $result.author , $entry.title , $entry.message);

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [] , (err , result_comment) => {

																if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

																if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

																if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

																	return $rpd.handler(res , 201 , $result); } });	}	});	}
										
										else if ($result.status1 == 'Fulfilled') {

										let plan_sub = query1$.entryUpdate3s$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [$e] , (err , result_comment) => {

														if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

														if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

														if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

															return $rpd.handler(res , 201 , $result); } });	}	});	}	

										else { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden action, operation will not be allowed.`}); } }



									else if (b.stage == '4') {

											let plan_sub_letter = query1$.entryLetterAdd$(req , res , {'entry' : $result});

											db.query(plan_sub_letter , [] , (err , result_letter) => {

												console.log(err);

													if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update letter entry. Please try again.`}); }

													if (result_letter.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

													if (result_letter.rowCount >= 1) { let $result_letter = result_letter.rows[0];

													let plan_sub = query1$.entryUpdate4s$(req , res , {'entry' : $result , 'letter' : $result_letter});

													db.query(plan_sub , [$e] , (err , result2) => {

														console.log(err);

															if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

															if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

															if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

																	let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

																	db.query(plan_comment , [$e] , (err , result_comment) => {

																		console.log(err);

																	if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve save or update comment entry. Please try again.`}); }

																	if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

																	if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

																		return $rpd.handler(res , 201 , $result); } });	}	});	}	});	}



									else if (b.stage == '5') { let member = {'voted' : false };

										if ($result.signature && $result.signature.length >= 1) {

											$result.signature.find((m) => {

												if (m._id == b.author) { member.voted = true;

														return true;	}	});
													
													if (member && member.voted) { return $rpd.handler(res , 400 , {'message' : `You can't make signature more than once for an entry.`});	}

															else {

										let plan_sub = query1$.entryUpdate5s$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

												let plan_signature = query1$.entrySignatureAdd$(req , res , {'entry' : $result});

												db.query(plan_signature , [] , (err , result_signature) => {

														if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update signature entry. Please try again.`}); }

														if (result_signature.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

														if (result_signature.rowCount >= 1) { let $result_signature = result_signature.rows[0];

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [$e] , (err , result_comment) => {

																if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

																if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

																if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

																	return $rpd.handler(res , 201 , $result); } });	} })	}	});	}	}  

														else {

												let plan_signature = query1$.entrySignatureAdd$(req , res , {'entry' : $result});

												db.query(plan_signature , [] , (err , result_signature) => {

														if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update signature entry. Please try again.`}); }

														if (result_signature.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

														if (result_signature.rowCount >= 1) { let $result_signature = result_signature.rows[0];

														let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

														db.query(plan_comment , [$e] , (err , result_comment) => {

														if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

														if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

														if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

															return $rpd.handler(res , 201 , $result); } });	} });	}	} 


									else if (b.stage == '6') {

										if ($result.signature && $result.signature.length < 2) { 

												return $rpd.handler(res , 400 , {'message' : 'Documents and letter need to be signed before being forwarded to the Bursary'});	}

										if ($result.status1 == 'Rejected') {

										let plan_sub = query1$.entryUpdate6x$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

														let $entry = mailMessage.rejected(req , res , next);

														mailer.entryRejected(req , res , next , $result.author , $entry.title , $entry.message);

										let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

										db.query(plan_comment , [$e] , (err , result_comment) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

												if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

												if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

													return $rpd.handler(res , 201 , $result); } });	}	});	}

									else if ($result.status1 == 'Fulfilled') {

										let plan_sub = query1$.entryUpdate6s$(req , res , {'entry' : $result});

										db.query(plan_sub , [$e] , (err , result2) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.word} entry. Please try again.`}); }

												if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

													if ($result2.status == 'Fulfilled') {

															let $entry = mailMessage.fulfilled(req , res , next);

															mailer.entryFulfilled(req , res , next , $result.author , $entry.title , $entry.message);	}

													if ($result.status == 'Rejected') { 

															let $entry = mailMessage.rejected(req , res , next);

															mailer.entryRejected(req , res , next , $result.author , $entry.title , $entry.message); }

										let plan_comment = query$.entryCommentAdd$(req , res , {'entry' : $result });

										db.query(plan_comment , [$e] , (err , result_comment) => {

												if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update comment entry. Please try again.`}); }

												if (result_comment.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

												if (result_comment.rowCount >= 1) { let $result_comment = result_comment.rows[0];

													return $rpd.handler(res , 201 , $result); } });	}	});	}	

										else { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden action, operation will not be allowed.`}); } }	}	} }	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }
			
		} 

	}

}