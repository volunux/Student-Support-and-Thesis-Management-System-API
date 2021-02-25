let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/payment-type');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

			else if (q.name) { $sq = sQuery.name(req , res , {}); }

			else if (q.abbreviation) { $sq = sQuery.abbreviation(req , res , {}); }

		}

		let query = `SELECT pt.name , pt.abbreviation , pt.updated_on , pt.payment_type_no AS num , pt.slug , gs.word AS status

									FROM PAYMENT_TYPE AS pt

									INNER JOIN STATUS AS gs ON gs.status_id = pt.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY pt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM PAYMENT_TYPE

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

		let query = `INSERT INTO PAYMENT_TYPE (`;

		query += b.name ? `name , ` : '';

		query += b.abbreviation ? `abbreviation , ` : '';

		query += b.description ? `description , ` : '';

		query += `payment_type_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.abbreviation ? `$$${b.abbreviation}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS _id , pt.name , pt.abbreviation , pt.updated_on , pt.description , gs.word AS status

									FROM PAYMENT_TYPE AS pt

									LEFT JOIN STATUS AS gs ON gs.status_id = pt.status_id

									WHERE pt.slug = $1

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

																		FROM (SELECT pt.name , pt.abbreviation , pt.description , pt.slug , pt.status_id AS status

																			FROM PAYMENT_TYPE AS pt

																			WHERE pt.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'general');

		let query = `UPDATE PAYMENT_TYPE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT pt.slug , pt.name , pt.abbreviation , gs.word AS status

									FROM PAYMENT_TYPE AS pt

									LEFT JOIN STATUS AS gs ON gs.status_id = pt.status_id

									WHERE pt.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_TYPE

									WHERE slug = $1 

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM PAYMENT_TYPE

									WHERE payment_type_no IN (${et})

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM PAYMENT_TYPE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_TYPE

									RETURNING name , abbreviation , slug`;

		return query;

	} ,


}