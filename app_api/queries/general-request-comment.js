let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-three/general-request-comment');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT grc.general_request_comment_id AS _id , grc.updated_on , grc.general_request_comment_no AS num , grc.slug , gs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = grc.user_id) AS u ) AS author

									FROM GENERAL_REQUEST_COMMENT AS grc

									INNER JOIN STATUS AS gs ON gs.status_id = grc.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY grc.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT general_request_comment_id AS _id , true AS exists 

									FROM GENERAL_REQUEST_COMMENT

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

		let query = `SELECT grc.updated_on , grc.text , grc.slug , gs.word AS status , ut.name AS unit ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = grc.user_id) AS u ) AS author

									FROM GENERAL_REQUEST_COMMENT AS grc

									LEFT JOIN STATUS AS gs ON gs.status_id = grc.status_id

									INNER JOIN UNIT AS ut ON ut.unit_id = grc.unit_id

									WHERE grc.slug = $1

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

		let query = `SELECT grc.slug , grc.text , gs.word AS status

									FROM GENERAL_REQUEST_COMMENT AS grc

									LEFT JOIN STATUS AS gs ON gs.status_id = grc.status_id

									WHERE grc.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_REQUEST_COMMENT

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

									FROM GENERAL_REQUEST_COMMENT

									WHERE general_request_comment_no IN (${et})

									RETURNING slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM GENERAL_REQUEST_COMMENT

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_REQUEST_COMMENT

									RETURNING slug

								`;

		return query;

	} ,


}