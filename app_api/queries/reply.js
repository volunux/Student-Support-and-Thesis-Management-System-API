let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-three/reply');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT ry.reply_id AS _id , ry.updated_on , ry.reply_no AS num , ry.slug , gs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = grc.user_id) AS u ) AS author

									FROM REPLY AS ry

									INNER JOIN STATUS AS gs ON gs.status_id = ry.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY ry.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT reply_id AS _id , true AS exists 

									FROM REPLY

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

		let query = `SELECT ry.updated_on , ry.text , ry.slug , gs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = ry.user_id) AS u ) AS author

									FROM REPLY AS ry

									LEFT JOIN STATUS AS gs ON gs.status_id = ry.status_id

									WHERE ry.slug = $1

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

		let query = `SELECT ry.slug , ry.text , gs.word AS status

									FROM REPLY AS ry

									LEFT JOIN STATUS AS gs ON gs.status_id = ry.status_id

									WHERE ry.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM REPLY

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

									FROM REPLY

									WHERE reply_no IN (${et})

									RETURNING slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM REPLY

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM REPLY

									RETURNING slug`;

		return query;

	} ,


}