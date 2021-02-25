let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-two/user-role');

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

		let query = `SELECT rl.name , rl.word , rl.updated_on , rl.role_no AS num , rl.slug , gs.word AS status

									FROM ROLE AS rl

									INNER JOIN STATUS AS gs ON gs.status_id = rl.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY rl.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM ROLE

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

		let query = `INSERT INTO ROLE (`;

		query += b.name ? `name , ` : '';

		query += b.word ? `word , ` : '';

		query += b.description ? `description , ` : '';

		query += `role_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.word ? `$$${b.word}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT rl.role_id AS _id , rl.name , rl.word , rl.updated_on , rl.description , gs.word AS status

									FROM ROLE AS rl

									LEFT JOIN STATUS AS gs ON gs.status_id = rl.status_id

									WHERE rl.slug = $1

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

																		FROM (SELECT rl.name , rl.word , rl.description , rl.slug , rl.status_id AS status

																			FROM ROLE AS rl

																			WHERE rl.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'general2');

		let query = `UPDATE ROLE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT rl.slug , rl.name , rl.word , gs.word AS status

									FROM ROLE AS rl

									LEFT JOIN STATUS AS gs ON gs.status_id = rl.status_id

									WHERE rl.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM ROLE

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

									FROM ROLE

									WHERE role_no IN (${et})

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM ROLE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM ROLE

									RETURNING name , word , slug`;

		return query;

	} ,


}