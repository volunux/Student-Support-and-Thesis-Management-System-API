
module.exports = (opts) => {

		let db = require('../../database/db');

		let $rpd = require('../helper/responder');

		let query$ = require('../queries/request-credential');

		let mailMessage = require(`../mail/messages/internet-credential`);

		let mailer = require('../mail/mail');

	return {

	'createCredential' : (req , res , next) => {

		let username = req.body.username ? req.body.username.toLowerCase().replace(/\s+/g , '') : 'david';

		let arr = [10 , 100 , 1000 , 10000 , 100000];

		function generateCredential() {

		let n_username = username + Math.floor(Math.random() * (arr[Math.floor(Math.random() * arr.length)] + 1));

		let n_password = Math.random().toString(36).substr(2, 9);

		let plan = query$.entryVerifyCred$(req , res , {});

		return db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry to record. Please try again.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

							return $rpd.handler(res , 200 , $result); }

					if (result.rowCount < 1) {

		let plan2 = query$.entryAddCred$(req , res , {});

		return db.query(plan2 , [n_username] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

					if (result2.rowCount >= 1) { return generateCredential(); }

					if (result2.rowCount < 1) { let $result2 = result.rows[0];

							let plan3 = query$.entryAddCred$s(req , res , {'cred' : {'username' : n_username , 'password' : n_password } });

							return db.query(plan3 , [] , (err , result3) => {

									if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry or entries to record. Please try again.`}); }

									if (result3.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record.`}); }

									if (result3.rowCount >= 1) { let $result3 = result3.rows[0];

										let $entry = mailMessage.fulfilled(req , res , next , {'cred' : {'username' : n_username , 'password' : n_password } });

										mailer.entryFulfilled(req , res , next , $result3 , $entry.title , $entry.message);

										return $rpd.handler(res , 200 , $result3); } }); } }); } });

			}	
						
			return generateCredential();

		} ,

	'createUniqueNumber' : (req , res , next) => {

			let createID = () => {
	
						return Array(16)
	
						.fill(0)
	
						.map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
	
						.join('') + 
	
						Date.now().toString(24); }
		} ,

	'createPassword' : (req , res , next) => {

		let plan = query$.entryAddCred$s(req , res , {});

		db.query(plan , [] , (err , result) => {

				if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry or entries to record. Please try again.`}); }

				if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record.`}); }

				if (result.rowCount >= 1) { let $result = result.rows[0];

					let $entry = mailMessage.fulfilled(req , res , next , {'cred' : {'username' : n_username , 'password' : n_password } });

					mailer.entryFulfilled(req , res , next , $result , $entry.title , $entry.message);

					return $rpd.handler(res , 200 , $result); } });


	}
}

}
