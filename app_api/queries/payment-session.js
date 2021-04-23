let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/payment-session');

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

		let query = `SELECT pses.name , pses.updated_on , pses.payment_session_no AS num , pses.slug , pses.amount , pt.name AS type , gs.word AS status

									FROM PAYMENT_SESSION AS pses

									INNER JOIN STATUS AS gs ON gs.status_id = pses.status_id

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = pses.payment_type_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY pses.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM PAYMENT_SESSION

									WHERE slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Status' , (SELECT json_agg(row_to_json(gs)) FROM (SELECT status_id AS _id , word FROM STATUS) AS gs ) ,

									'EntryType' , (SELECT json_agg(row_to_json(pt)) FROM (SELECT payment_type_id AS _id , name FROM PAYMENT_TYPE) AS pt )

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

		let query = `INSERT INTO PAYMENT_SESSION (`;

		query += b.name ? `name , ` : '';

		query += b.amount ? `amount , ` : '';

		query += b.entry_type ? `payment_type_id , ` : '';

		query += `payment_session_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.amount ? `$$${b.amount}$$ , ` : '';

		query += b.entry_type ? `$$${b.entry_type}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING slug`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT pses.payment_session_id AS _id , pses.amount , pses.name , pses.slug , pses.updated_on , gs.word AS status , pt.name AS payment_type

									FROM PAYMENT_SESSION AS pses

									LEFT JOIN STATUS AS gs ON gs.status_id = pses.status_id

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = pses.payment_type_id

									WHERE pses.slug = $1

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

											'EntryType' , (SELECT json_agg(row_to_json(pt)) 

																		FROM (SELECT payment_type_id AS _id , name 

																			FROM PAYMENT_TYPE) AS pt ) ,

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT pses.name , pses.slug , pses.status_id AS status , pses.amount , pses.payment_type_id AS entry_type 

																			FROM PAYMENT_SESSION AS pses

																			WHERE pses.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'paymentSession');

		let query = `UPDATE PAYMENT_SESSION

									SET ${builder$}

									WHERE slug = $1

									RETURNING name , amount , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT pses.slug , pses.name , pses.amount , gs.word AS status

									FROM PAYMENT_SESSION AS pses

									LEFT JOIN STATUS AS gs ON gs.status_id = pses.status_id

									WHERE pses.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_SESSION

									WHERE slug = $1 

									RETURNING name , amount , slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM PAYMENT_SESSION

									WHERE payment_session_no IN (${et})

									RETURNING name , amount , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM PAYMENT_SESSION

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM PAYMENT_SESSION

									RETURNING name , amount , slug

									`;

		return query;

	} ,


}