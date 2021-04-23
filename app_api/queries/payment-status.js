let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-two/payment-status');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

			else if (q.name) { $sq = sQuery.name(req , res , {}); }

		}

		let query = `SELECT ps.name , ps.word , ps.updated_on , ps.payment_status_no AS num , ps.slug , gs.word AS status

									FROM PAYMENT_STATUS AS ps

									INNER JOIN STATUS AS gs ON gs.status_id = ps.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY ps.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM PAYMENT_STATUS

									WHERE slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Status' , (SELECT json_agg(row_to_json(gs)) FROM (SELECT status_id AS _id , word FROM STATUS) AS gs ) ,

									) AS result

								`;

		return query;
	} ,

	'entryAdd2' : (req , res , opts) => {

		let query = `SELECT true AS permitted
								
								`;

		return query;

	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO PAYMENT_STATUS (`;

		query += b.name ? `name , ` : '';

		query += b.word ? `word , ` : '';

		query += b.description ? `description , ` : '';

		query += `payment_status_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.word ? `$$${b.word}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING slug`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT ps.payment_status_id AS _id , ps.name , ps.word , ps.slug , ps.updated_on , ps.description , gs.word AS status

									FROM PAYMENT_STATUS AS ps

									LEFT JOIN STATUS AS gs ON gs.status_id = ps.status_id

									WHERE ps.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT json_build_object(

											'Status' , (SELECT json_agg(row_to_json(gs)) 

																		FROM (SELECT status_id AS _id , word 

																			FROM STATUS) AS gs ) ,

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT ps.name , ps.word , ps.description , ps.slug , ps.status_id AS status

																			FROM PAYMENT_STATUS AS ps

																			WHERE ps.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'general2');

		let query = `UPDATE PAYMENT_STATUS

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT ps.slug , ps.name , ps.word , gs.word AS status

									FROM PAYMENT_STATUS AS ps

									LEFT JOIN STATUS AS gs ON gs.status_id = ps.status_id

									WHERE ps.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_STATUS

									WHERE slug = $1 

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM PAYMENT_STATUS

									WHERE payment_status_no IN (${et})

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM PAYMENT_STATUS

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_STATUS

									RETURNING name , word , slug

								`;

		return query;

	} ,


}