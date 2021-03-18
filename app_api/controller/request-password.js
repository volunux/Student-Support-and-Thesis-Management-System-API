
module.exports = (opts) => {

		let db = require('../../database/db');

		let $rpd = require('../helper/responder');

		let query$ = require('../queries/request-password');

		let mailMessage = require(`../mail/messages/internet-password`);

		let mailer = require('../mail/mail');

	return {

		'createPassword' : (req , res , next) => {

			let b = req.body;

			let plan = query$.entryAddCred$s(req , res , {'cred' : {'password' : b.password } });

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry or entries to record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						let $entry = mailMessage.fulfilled(req , res , next , {});

						mailer.entryFulfilled(req , res , next , $result , $entry.title , $entry.message);

						return $rpd.handler(res , 200 , $result); } });


	}
}

}
