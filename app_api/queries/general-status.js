let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-two/general-status');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.name) { $sq = sQuery.name(req , res , {}); }

		}

		let query = `SELECT gs.name , gs.word , gs.updated_on , gs.status_no AS num , gs.slug 

									FROM STATUS AS gs

									${Object.values($sq.condition).join(' ')}

									ORDER BY gs.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT name , true AS exists 

									FROM STATUS

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

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO STATUS (`;

		query += b.name ? `name , ` : '';

		query += b.word ? `word , ` : '';

		query += b.description ? `description , ` : '';

		query += `status_no , slug , user_id ) `;

		query += ` VALUES (`;

		query += b.name ? `$$${b.name}$$ , ` : '';

		query += b.word ? `$$${b.word}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ ) `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT gs.status_id AS _id , gs.name , gs.word , gs.updated_on , gs.description 

									FROM STATUS AS gs

									WHERE gs.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT json_build_object(

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT gs.status_id AS _id , gs.name , gs.word , gs.description , gs.slug

																			FROM STATUS AS gs

																			WHERE gs.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'general2');

		let query = `UPDATE STATUS

									SET ${builder$}

									WHERE slug = $1 

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT gs.slug , gs.name , gs.word 

									FROM STATUS AS gs

									WHERE gs.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM STATUS

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

									FROM STATUS

									WHERE status_no IN (${et})

									RETURNING name , word , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM STATUS

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM STATUS

									RETURNING name , word , slug`;

		return query;

	} ,


}