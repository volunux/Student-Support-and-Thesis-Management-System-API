let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/account-change-message-template');

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

		let query = `SELECT acmt.title , acmt.updated_on , acmt.account_change_message_template_no AS num , acmt.slug , gs.word AS status

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

									INNER JOIN STATUS AS gs ON gs.status_id = acmt.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY acmt.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT title , true AS exists 

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE

									WHERE slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Status' , (SELECT json_agg(row_to_json(gs)) FROM (SELECT status_id AS _id , word FROM STATUS) AS gs ) ,

									'EntryType' , (SELECT json_agg(row_to_json(acmtt)) FROM (SELECT account_change_message_template_type_id AS _id , title FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE) AS acmtt )

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

		let query = `INSERT INTO ACCOUNT_CHANGE_MESSAGE_TEMPLATE (`;

		query += b.title ? `title , ` : '';

		query += b.body ? `body , ` : '';

		query += b.entry_type ? `account_change_message_template_type_id , ` : '';

		query += `account_change_message_template_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.title ? `$$${b.title}$$ , ` : '';

		query += b.body ? `$$${b.body}$$ , ` : '';

		query += b.entry_type ? `$$${b.entry_type}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING title , slug `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT acmt.account_change_message_template_id AS _id , acmt.title , acmt.body , acmt.updated_on , acmt.slug , gs.word AS status , acmtt.title AS type 

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

									INNER JOIN ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt ON acmtt.account_change_message_template_type_id = acmt.account_change_message_template_type_id

									LEFT JOIN STATUS AS gs ON gs.status_id = acmt.status_id

									WHERE acmt.slug = $1

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

											'EntryType' , (SELECT json_agg(row_to_json(acmtt))

																		FROM (SELECT account_change_message_template_type_id AS _id , title

																			FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE) AS acmtt ) ,

											'Entry' , (SELECT row_to_json(et) 

																		FROM (SELECT acmt.title , acmt.body , acmt.slug , acmt.status_id AS status , account_change_message_template_type_id AS entry_type

																			FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

																			WHERE acmt.slug = $1

																			LIMIT 1) AS et)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let builder$ = queryBuilder.update$(b , 'accountChangeMessageTemplate');

		let query = `UPDATE ACCOUNT_CHANGE_MESSAGE_TEMPLATE

									SET ${builder$}

									WHERE slug = $1 

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT acmt.slug , acmt.title , acmt.account_change_message_template_type_id AS entry_type , gs.word AS status

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

									LEFT JOIN STATUS AS gs ON gs.status_id = acmt.status_id

									WHERE acmt.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE

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

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE

									WHERE account_change_message_template_no IN (${et})

									RETURNING title , slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT slug

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE

									WHERE slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE

									RETURNING title , slug

								`;

		return query;

	} ,


}