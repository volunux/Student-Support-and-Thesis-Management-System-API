let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/request-type');

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

		let query = `SELECT rt.name , rt.abbreviation , rt.updated_on , rt.request_type_no AS num , rt.slug , gs.word AS status

									FROM REQUEST_TYPE AS rt

									INNER JOIN STATUS AS gs ON gs.status_id = rt.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY rt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM REQUEST_TYPE

									WHERE slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Status' , (SELECT json_agg(row_to_json(gs)) FROM (SELECT status_id AS _id , word FROM STATUS) AS gs ) ,

									'Unit' , (SELECT json_agg(row_to_json(ut)) FROM (SELECT unit_id AS _id , name FROM UNIT) AS ut ) 

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

		let query = `INSERT INTO REQUEST_TYPE (`;

		query += b.name ? `name , ` : '';

		query += b.abbreviation ? `abbreviation , ` : '';

		query += b.description ? `description , ` : '';

		query += b.title ? `title , ` : '';

		query += b.unit ? `unit_id , ` : '';

		query += `request_type_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.abbreviation ? `$$${b.abbreviation}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += b.title ? `$$${b.title}$$ , ` : '';

		query += b.unit ? `$$${b.unit}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING slug`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT rt.request_type_id AS _id , rt.name , rt.abbreviation , rt.slug , rt.title , rt.updated_on , rt.description , gs.word AS status , ut.name AS unit 

									FROM REQUEST_TYPE AS rt

									LEFT JOIN STATUS AS gs ON gs.status_id = rt.status_id

									LEFT JOIN UNIT AS ut ON ut.unit_id = rt.unit_id

									WHERE rt.slug = $1

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

											'Unit' , (SELECT json_agg(row_to_json(ut)) 

																		FROM (SELECT unit_id AS _id , name

																			FROM UNIT) AS ut ) ,

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT rt.name , rt.abbreviation , rt.description , rt.title , rt.slug , rt.status_id AS status , rt.unit_id AS unit

																			FROM REQUEST_TYPE AS rt

																			WHERE rt.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'requestType');

		let query = `UPDATE REQUEST_TYPE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT rt.slug , rt.name , rt.abbreviation , gs.word AS status

									FROM REQUEST_TYPE AS rt

									LEFT JOIN STATUS AS gs ON gs.status_id = rt.status_id

									WHERE rt.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_TYPE

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

									FROM REQUEST_TYPE

									WHERE request_type_no IN (${et})

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM REQUEST_TYPE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_TYPE

									RETURNING name , abbreviation , slug`;

		return query;

	} ,


}