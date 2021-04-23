module.exports = (opts) => {

	let $rpd = require('../helper/responder');

	let db = require('../../database/db');

	let cUser = require('../helper/confirm-user');

	let query$ = require(`../queries/${opts.query}`);

	let axios = require('axios');

	let mailMessage = require(`../mail/messages/payment`);

	let mailer = require('../mail/sendgrid');

	let mySecretKey = process.env.paystack;

	let payVerificationCount = 0;

	let payment = {

		'initializeTransaction' : (req , res , next) => { let url = 'https://api.paystack.co/transaction/initialize';

			axios.defaults.headers.common['Authorization'] = mySecretKey;

			let b = req.body;

			let $p = b.metadata.payment_type;

			let $s = b.metadata.payment_session;

			let $u = req.user._id;

			let plan = query$.checkPaymentTypeAndSession(req , res , {});

			db.query(plan , [$p , $s] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) {

			let plan2 = query$.proceedEntryCreate$(req , res , {});

			db.query(plan2 , [$p , $s , $u] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result2.rowCount < 1) {

				let options = {

								'Authorization' : 'Bearer ' + mySecretKey ,

								'Content-Type': 'application/json' ,

								'Cache-Control': 'no-cache' };

				let callback = (err , res , body) => { return mycallback(err , body);	}

					axios({	'method': 'post' , 'url' : url , 'data' : req.body , 'headers' : options })

					.then((pResult) => {

					let $p = b.payment_type;

					let $s = b.payment_session;

					let plan3 = query$.proceedEntryCreate$3(req , res , {'entry' : pResult.data});

					db.query(plan3, [$p , $s] , (err , result3) => {

							if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

							if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

							if (result3.rowCount >= 1) { let $result3 = pResult.data;

								return $rpd.handler(res , 200 , $result3); } }); })
			
						.catch((err) => {

							return $rpd.handler(res , 400 , {'message' : 'Network Error'}); }); }

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

						return $rpd.handler(res , 200 , $result2); } }); } }); 

		} ,

		'verifyTransaction' : (req , res , next) => { 

			let ref = req.query != null && req.query.reference ? req.query.reference : '91xyq7sahjsa';

			let url = 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref);

			let options = {

						'Authorization' : 'Bearer ' + mySecretKey,
				
						'Content-Type': 'application/json',
				
						'Cache-Control': 'no-cache'	};

			let callback = (error, response, body) => {	return mycallback(error , body); }

			return axios({ 'method': 'get' , 'url' : url , 'headers' : options })

				.then((result) => { let $result = result.data.data;

					if ($result.status == 'success') {

			let plan = query$.entryUpdateStatusSuccess$(req , res , {});

				db.query(plan , [ref] , (err , result1) => {

						if (err) { return $rpd.handler(res , 400 , {'message' : `An Error occured while trying to update record. Please try again.`}); }

						if (result1.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

						if (result1.rowCount >= 1) { let $result1 = result1.rows[0];

								let $entry = mailMessage.fulfilled(req , res , next , $result1);

								let payload = {'user' : {'email_address' : $result1.email_address} , 'title' : $entry.title , 'message' : $entry.message };

								mailer.send(payload);

							return $rpd.handler(res , 200 , $result1); } }); }

				else if ($result.status == 'failed') {

			let plan = query$.entryUpdateStatusFailed$(req , res , {});

				db.query(plan , [ref] , (err , result1) => {

						if (err) { return $rpd.handler(res , 400 , {'message' : `An Error occured while trying to update record. Please try again.`}); }

						if (result1.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

						if (result1.rowCount >= 1) { let $result1 = result1.rows[0];

								let $entry = mailMessage.rejected(req , res , next , $result1);

								let payload = {'user' : {'email_address' : $result1.email_address} , 'title' : $entry.title , 'message' : $entry.message };

								mailer.send(payload);

							return $rpd.handler(res , 200 , $result1); } }); }

			else { return $rpd.handler(res , 400 , {'message' : `Request is forbidden and invalid.`}); } })
				
				.catch((err) => { let $err = null;

					if (err) $err = err.response;

					if ($err && $err != null && $err.data != null && $err.data.status == false) {

					return $rpd.handler(res , 404 , {'message' : 'Transaction reference cannot be found. Please check the reference string and try again.'}); }

					if (payVerificationCount < 3) { payVerificationCount++;

						payment.verifyTransaction(req , res , next); }

					else { return $rpd.handler(res , 400 , {'message' : 'Error has occured. Please try again.'}); } });
	
		} ,

	 'refundTransaction' : (req , res , next) => { let url = 'https://api.paystack.co/refund';

 			let toHappen = {'run' : true};

	 		let $e = req.params.entry;

	 		let b = req.body;

			let plan = query$.entryRefundCheck(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];
	
						cUser.$canRefundPayment(req , res , next , $result , toHappen , opts.normalPrivilege , opts.superPrivilege , opts.leastPrivilege , cUser.successReponse);

					if (toHappen.run) {

						let amount = (40 / 100) * $result.amount;

						let payment_reference = {'transaction' : b.transaction , 'amount' : amount};

			let options = {

				'Authorization' : 'Bearer ' + mySecretKey ,

				'Content-Type': 'application/json',
				
				'Cache-Control': 'no-cache' };

			let callback = (error , response , body) => { return mycallback(error , body); }

				axios({	'method': 'post' , 'url' : url , 'data' : payment_reference , 'headers' : options })

				.then((result) => {

			let $r = b.transaction;

			let plan = query$.entryUpdateRefund$(req , res , {});

			db.query(plan , [$r] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.pt} entry from record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.pt} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	}); })
				
				.catch((err) => {	

					return $rpd.handler(res , 400 , {'message' : 'An Error has occured and the request cannot be fulfilled.'}); }); } } });

	 } 

}

return payment;

}