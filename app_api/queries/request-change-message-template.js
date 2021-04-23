let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/request-change-message-template');

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

		let query = `SELECT rcmt.title , rcmt.updated_on , rcmt.request_change_message_template_no AS num , rcmt.slug , gs.word AS status

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									INNER JOIN STATUS AS gs ON gs.status_id = rcmt.status_id

									${Object.values($sq.join).join(' ')}

									WHERE rcmt.user_id = $1 ${Object.values($sq.condition).join(' ')}

									ORDER BY rcmt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT title , true AS exists 

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									WHERE slug = $1 AND rcmt.user_id = $2

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Status' , (SELECT json_agg(row_to_json(gs)) FROM (SELECT status_id AS _id , word FROM STATUS) AS gs ) ,

									'EntryType' , (SELECT json_agg(row_to_json(rcmtt)) FROM (SELECT request_change_message_template_type_id AS _id , title FROM REQUEST_CHANGE_MESSAGE_TEMPLATE_TYPE) AS rcmtt )

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

		let query = `INSERT INTO REQUEST_CHANGE_MESSAGE_TEMPLATE (`;

		query += b.title ? `title , ` : '';

		query += b.body ? `body , ` : '';

		query += b.entry_type ? `request_change_message_template_type_id , ` : '';

		query += `request_change_message_template_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.title ? `$$${b.title}$$ , ` : '';

		query += b.body ? `$$${b.body}$$ , ` : '';

		query += b.entry_type ? `$$${b.entry_type}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING title , slug `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT rcmt.rcmt_id AS _id , rcmt.title , rcmt.body , rcmt.updated_on , rcmt.slug , gs.word AS status , rcmtt.title AS type 

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									INNER JOIN REQUEST_CHANGE_MESSAGE_TEMPLATE_TYPE AS rcmtt ON rcmtt.request_change_message_template_type_id = rcmt.request_change_message_template_type_id

									LEFT JOIN STATUS AS gs ON gs.status_id = rcmt.status_id

									WHERE rcmt.slug = $1 AND rcmt.user_id = $2

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

											'EntryType' , (SELECT json_agg(row_to_json(rcmtt))

																		FROM (SELECT request_change_message_template_type_id AS _id , title

																			FROM REQUEST_CHANGE_MESSAGE_TEMPLATE_TYPE) AS rcmtt ) ,

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT rcmt.title , rcmt.body , rcmt.slug , rcmt.status_id AS status , request_change_message_template_type_id AS entry_type

																			FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

																			WHERE rcmt.slug = $1 AND rcmt.user_id = $2

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'requestChangeMessageTemplate');

		let query = `UPDATE REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									SET ${builder$}

									WHERE slug = $1 AND rcmt.user_id = $2

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT rcmt.slug , rcmt.title , rcmt.request_change_message_template_type_id AS entry_type , gs.word AS status

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									LEFT JOIN STATUS AS gs ON gs.status_id = rcmt.status_id

									WHERE rcmt.slug = $1 AND rcmt.user_id = $2

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									WHERE slug = $1 AND rcmt.user_id = $2

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									WHERE rcmt.user_id = $1 AND request_change_message_template_no IN (${et})

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									RETURNING title , slug

								`;

		return query;

	} ,


}