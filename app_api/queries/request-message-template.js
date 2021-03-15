let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/request-message-template');

module.exports = {

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = {'join' : {'one' : ''} , 'condition' : {'one' : ''} };

		if (req.query) { 

			if (q.status) { $sq = sQuery.status(req , res , {}); }

			else if (q.title) { $sq = sQuery.title(req , res , {}); }

		}

		let query = `SELECT rmt.title , rmt.updated_on , rmt.request_message_template_no AS num , rmt.slug , gs.word AS status

									FROM REQUEST_MESSAGE_TEMPLATE AS rmt

									INNER JOIN STATUS AS gs ON gs.status_id = rmt.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY rmt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT title , true AS exists 

									FROM REQUEST_MESSAGE_TEMPLATE

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

		let query = `INSERT INTO REQUEST_MESSAGE_TEMPLATE (`;

		query += b.title ? `title , ` : '';

		query += b.body ? `body , ` : '';

		query += `request_message_template_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.title ? `$$${b.title}$$ , ` : '';

		query += b.body ? `$$${b.body}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING title , slug `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT rmt.request_message_template_id AS _id , rmt.title , rmt.body , rmt.updated_on , gs.word AS status

									FROM REQUEST_MESSAGE_TEMPLATE AS rmt

									LEFT JOIN STATUS AS gs ON gs.status_id = rmt.status_id

									WHERE rmt.slug = $1

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

																		FROM (SELECT rmt.title , rmt.body , rmt.slug , rmt.status_id AS status

																			FROM REQUEST_MESSAGE_TEMPLATE AS rmt

																			WHERE rmt.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'requestMessageTemplate');

		let query = `UPDATE REQUEST_MESSAGE_TEMPLATE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT rmt.slug , rmt.title , gs.word AS status

									FROM REQUEST_MESSAGE_TEMPLATE AS rmt

									LEFT JOIN STATUS AS gs ON gs.status_id = rmt.status_id

									WHERE rmt.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_MESSAGE_TEMPLATE

									WHERE slug = $1 

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM REQUEST_MESSAGE_TEMPLATE

									WHERE request_message_template_no IN (${et})

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM REQUEST_MESSAGE_TEMPLATE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_MESSAGE_TEMPLATE

									RETURNING title , slug`;

		return query;

	} ,


}