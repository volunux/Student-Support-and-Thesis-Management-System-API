let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/account-change-message-template-type');

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

		let query = `SELECT acmtt.title , acmtt.updated_on , acmtt.account_change_message_template_type_no AS num , acmtt.slug , gs.word AS status

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt

									INNER JOIN STATUS AS gs ON gs.status_id = acmtt.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY acmtt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT title , true AS exists 

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

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

		let query = `INSERT INTO ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE (`;

		query += b.title ? `title , ` : '';

		query += b.description ? `description , ` : '';

		query += `account_change_message_template_type_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.title ? `$$${b.title}$$ , ` : '';

		query += b.description ? `$$${b.description}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING slug`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT acmtt.account_change_message_template_type_id AS _id , acmtt.title , acmtt.updated_on , acmtt.description , acmtt.slug , gs.word AS status

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt

									LEFT JOIN STATUS AS gs ON gs.status_id = acmtt.status_id

									WHERE acmtt.slug = $1

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

																		FROM (SELECT acmtt.title , acmtt.description , acmtt.slug , acmtt.status_id AS status

																			FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt

																			WHERE acmtt.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'accountChangeMessageTemplateType');

		let query = `UPDATE ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT acmtt.slug , acmtt.title , gs.word AS status

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt

									LEFT JOIN STATUS AS gs ON gs.status_id = acmtt.status_id

									WHERE acmtt.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

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

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

									WHERE account_change_message_template_type_no IN (${et})

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE

									RETURNING title , slug

								`;

		return query;

	} ,


}