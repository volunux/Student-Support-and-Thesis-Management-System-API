let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-three/request-password');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT rp.password , rp.updated_on , password_no AS num , rp.slug , gs.word AS status ,

										(SELECT row_to_json(u)

									FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

										FROM USERS AS u 

										WHERE u.user_id = rp.user_id) AS u ) AS author

									FROM REQUEST_PASSWORD AS rc

									INNER JOIN STATUS AS gs ON gs.status_id = rp.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY rp.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT slug , true AS exists 

								FROM REQUEST_PASSWORD

								WHERE slug = $1

								`;

		return query;

	} ,

	'entryVerifyCred$' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT password

								FROM REQUEST_PASSWORD

								WHERE entry_id = $$${b.entry}$$

								`;

		return query;

	} ,

	'entryAddCred$' : (req , res , opts) => {

		let query = `SELECT slug , true AS exists

								FROM REQUEST_PASSWORD

								WHERE username = $1

								`;

		return query;

	} ,

	'entryAddCred$s' : (req , res , opts) => {

		let b = nuller.general(req , res , opts);

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b2 = req.body;

		let query = `INSERT INTO

									REQUEST_PASSWORD(password , password_no , slug , entry_id , user_id , handler_id , status_id)

									SELECT $$${opts.cred.password}$$ , $$${c}$$ , $$${s}$$ , $$${b2.entry}$$ , $$${b2.user}$$ , $$${b2.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING password , slug , (SELECT email_address FROM USERS WHERE user_id = $$${b2.user}$$ LIMIT 1)

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM REQUEST_PASSWORD

									WHERE password_no IN (${et})

									RETURNING password , slug`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT password

									FROM REQUEST_PASSWORD

									WHERE slug IS NOT NULL

									LIMIT 1`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_PASSWORD

									RETURNING password , slug`;

		return query;

	} ,


}