let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-three/account-change-request-comment');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT acrc.account_change_request_comment_id AS _id , acrc.updated_on , acrc.account_change_request_comment_no AS num , acrc.slug , gs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = acrc.user_id) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS acrc

									INNER JOIN STATUS AS gs ON gs.status_id = acrc.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY acrc.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT account_change_request_comment_id AS _id , true AS exists 

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT

									WHERE slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryAdd2' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryAdd$' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT acrc.updated_on , acrc.text , acrc.slug , gs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = acrc.user_id) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS acrc

									LEFT JOIN STATUS AS gs ON gs.status_id = acrc.status_id

									WHERE acrc.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT acrc.slug , acrc.text , gs.word AS status

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS acrc

									LEFT JOIN STATUS AS gs ON gs.status_id = acrc.status_id

									WHERE acrc.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT

									WHERE slug = $1 

									RETURNING slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT

									WHERE account_change_request_comment_no IN (${et})

									RETURNING slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT

									RETURNING slug

								`;

		return query;

	} ,


}