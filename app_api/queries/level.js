let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/level');

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

		let query = `SELECT ll.name , ll.abbreviation , ll.updated_on , ll.level_no AS num , ll.slug , gs.word AS status

									FROM LEVEL AS ll

									INNER JOIN STATUS AS gs ON gs.status_id = ll.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY ll.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM LEVEL

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

		let query = `INSERT INTO LEVEL (`;

		query += b.name ? `name , ` : '';

		query += b.abbreviation ? `abbreviation , ` : '';

		query += b.description ? `description , ` : '';

		query += `level_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.abbreviation ? `$$${b.abbreviation}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING slug`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT ll.level_id AS _id , ll.name , ll.abbreviation , ll.updated_on , ll.slug , ll.description , gs.word AS status

									FROM LEVEL AS ll

									LEFT JOIN STATUS AS gs ON gs.status_id = ll.status_id

									WHERE ll.slug = $1

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

																		FROM (SELECT ll.name , ll.abbreviation , ll.description , ll.slug , ll.status_id AS status

																			FROM LEVEL AS ll

																			WHERE ll.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'general');

		let query = `UPDATE LEVEL

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT ll.slug , ll.name , ll.abbreviation , gs.word AS status

									FROM LEVEL AS ll

									LEFT JOIN STATUS AS gs ON gs.status_id = ll.status_id

									WHERE ll.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM LEVEL

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

									FROM LEVEL

									WHERE level_no IN (${et})

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM LEVEL

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM LEVEL

									RETURNING name , abbreviation , slug

								`;

		return query;

	} ,


}