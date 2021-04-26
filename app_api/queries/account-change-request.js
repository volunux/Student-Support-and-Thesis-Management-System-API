let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/account-change-request');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'entryExists' : (req , res , opts) => {

		let query = `SELECT acr.account_change_request_id AS _id , slug , true AS exists 

								FROM ACCOUNT_CHANGE_REQUEST AS acr

								WHERE acr.slug = $1

								LIMIT 1

								`;

		return query;

	} ,

	'entries' : (req , res , opts) => {

		let b = req.body;

		let q = req.query;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let $sq = sQuery.user(req , res , {});

		if (q) { 

			if (q.application_number) { $sq = sQuery.appNumber(req , res , {}); }

			else if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT acr.application_number , acr.updated_on , acr.account_change_request_no AS num , acr.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u

											WHERE u.user_id = acr.user_id) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY acr.updated_on DESC

									LIMIT 11 OFFSET ${p}

								`;

		return query;
	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT true as permitted

								`;

		return query;
	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO

									ACCOUNT_CHANGE_REQUEST (message , account_change_request_no , slug , application_number , user_id , status_id)

									SELECT $$${b.message}$$ , ${c} , $$${s}$$ , $$${uuidv4()}$$ , $$${b.author}$$ , grs.general_request_status_id

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE grs.word = 'Pending'

									RETURNING account_change_request_id AS _id , account_change_request_no , slug

									`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let u = req.user;

		let query = `SELECT acr.account_change_request_id AS _id , acr.message , acr.application_number , acr.updated_on , acr.slug , grs.word AS status , acr.status_id AS other_status_id ,

									acr.account_change_request_no AS num ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = acr.user_id) AS u ) AS author ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.user_id AS _id , hl.first_name || ' ' || hl.last_name AS full_name 

											FROM USERS AS hl

											WHERE hl.user_id = acr.handler_id) AS hl ) AS entry_handler

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReview' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT acr.account_change_request_id AS _id , acr.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id

											FROM USERS AS u

											WHERE u.user_id = acr.user_id) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryTimeline' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT acr.account_change_request_id AS _id , acr.application_number , acr.message , acr.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id FROM USERS AS u WHERE u.user_id = acr.user_id) AS u ) AS author ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.email_address , hl.user_id AS _id FROM USERS AS hl WHERE hl.user_id = acr.handler_id) AS hl ) AS entry_handler ,

									(SELECT json_agg(row_to_json(c))

										FROM (SELECT text , slug , updated_on , user_id AS author , 

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name , u.user_id AS _id 

											FROM USERS AS u 

											WHERE u.user_id = c.user_id) AS u ) AS author ,

									(SELECT json_agg(row_to_json(ry))

										FROM (SELECT text , comment_author_name , 

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name , u.user_id AS _id 

											FROM USERS AS u 

												WHERE u.user_id = ry.user_id) AS u ) AS author 

											FROM ACCOUNT_CHANGE_REQUEST_REPLY AS ry 

											WHERE ry.comment_id = c.account_change_request_comment_id) AS ry ) AS replies

											FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS c WHERE c.entry_id = acr.account_change_request_id) AS c ) AS timeline

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryStatus' : (req , res , opts) => {

		let u = req.user;

		let query = `SELECT acr.account_change_request_id AS _id , acr.updated_on , acr.slug , grs.word AS status , acr.status_id AS other_status_id ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id

											FROM USERS AS u

											WHERE u.user_id = acr.user_id) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdateRole' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT 

										json_build_object(

											'Role' , (SELECT json_agg(row_to_json(rl)) 

																		FROM (SELECT role_id AS _id , word 

																			FROM ROLE) AS rl ) ,

											'Entry' , (SELECT row_to_json(acr) 

																		FROM (SELECT acr.account_change_request_id AS _id , rl.word AS role , rl.role_id AS previous_role , u.slug

																			FROM ACCOUNT_CHANGE_REQUEST AS acr

																			INNER JOIN USERS AS u ON u.user_id = acr.user_id

																			LEFT JOIN ROLE AS rl ON rl.role_id = u.role_id

																			WHERE acr.slug = $1

																			LIMIT 1) AS acr)

											) AS result

								`;

		return query;

	} ,

	'entryUpdateRole$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE USERS AS u

									SET role_id = $$${b.new_role}$$

									WHERE u.slug = $1

									RETURNING u.user_id AS _id , u.email_address

								`;

		return query;

	} ,

	'entryUpdateUnit' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT 

										json_build_object(

											'Unit' , (SELECT json_agg(row_to_json(ut)) 

																		FROM (SELECT unit_id AS _id , name 

																			FROM UNIT) AS ut ) ,

											'Entry' , (SELECT row_to_json(acr) 

																		FROM (SELECT acr.account_change_request_id AS _id , ut.name AS unit , ut.unit_id AS previous_unit , u.slug

																			FROM ACCOUNT_CHANGE_REQUEST AS acr

																			INNER JOIN USERS AS u ON u.user_id = acr.user_id

																			LEFT JOIN UNIT AS ut ON ut.unit_id = u.unit_id

																			WHERE acr.slug = $1

																			LIMIT 1) AS acr)

											) AS result

								`;

		return query;

	} ,

	'entryUpdateUnit$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE USERS AS u

									SET unit_id = $$${b.new_unit}$$

									WHERE u.slug = $1

									RETURNING u.user_id AS _id , u.email_address

								`;

		return query;

	} ,

	'entryUpdateSendMail$' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT acr.account_change_request_id AS _id , u.email_address

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN USERS AS u ON u.user_id = acr.user_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdateMessageType' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT account_change_message_template_type_id AS _id , title 

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE AS acmtt

								`;

		return query;

	} ,

	'entryUpdateMessageTypeList' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT account_change_message_template_id AS _id , title 

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

									WHERE acmt.account_change_message_template_type_id = $1

								`;

		return query;

	} ,

	'entryUpdateMessageTypeDetail' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT account_change_message_template_type_id AS _id , title , body

									FROM ACCOUNT_CHANGE_MESSAGE_TEMPLATE AS acmt

									WHERE acmt.account_change_message_template_id = $1

								`;

		return query;

	} ,

	'entryCommentAdd$s' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		let query = `INSERT

									INTO ACCOUNT_CHANGE_REQUEST_COMMENT(text , slug , account_change_request_comment_no , entry_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING account_change_request_comment_id AS _id , slug , entry_id

									`;

		return query;

	} ,

	'entryCommentReplyAdd$s' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		b.comment_author_name = b.comment_author_name ? b.comment_author_name : 'Anonymous';

		let query = `INSERT

									INTO ACCOUNT_CHANGE_REQUEST_REPLY(text , comment_author_name , slug , reply_no , entry_id , comment_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${b.comment_author_name}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${opts.comment._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING reply_id AS _id , slug

									`;
		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT acr.account_change_request_id AS _id , acr.slug , acr.user_id AS author , 

									acr.status_id , grs.word AS status , grs1.word AS status1

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs1 ON grs1.general_request_status_id = $$${b.status}$$

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE ACCOUNT_CHANGE_REQUEST AS acr

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$

									FROM GENERAL_REQUEST_STATUS AS grs 

									WHERE acr.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${opts.entry.status_id}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = $$${b.status}$$ ) ,

																						'author' , (SELECT row_to_json(u) AS user 

																												FROM (SELECT email_address FROM USERS AS u

																												INNER JOIN ACCOUNT_CHANGE_REQUEST AS acr ON acr.user_id = u.user_id

																												WHERE acr.slug = $1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryCommentAdd' : (req , res , opts) => {

		let query = `SELECT acr.message , acr.slug , grs.word AS status , grs.general_request_status_id AS status_id , 

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = acr.user_id LIMIT 1) ) ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentAdd$' : (req , res , opts) => {

		let query = `	SELECT acr.account_change_request_id AS _id , acr.slug , acr.status_id AS status_id , acr.handler_id AS entry_handler , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = acr.user_id LIMIT 1) ) ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

								`;

		return query;

	} ,

	'entryAddReplytoComment' : (req , res , opts) => {

		let query = `	SELECT acr.account_change_request_id AS _id , acr.slug , acr.status_id AS status_id , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = acr.user_id LIMIT 1) ) ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

								`;

		return query;

	} ,

	'entryCommentDetail' : (req , res , opts) => {

		let query = `	SELECT acrc.account_change_request_comment_id AS _id , acrc.text , acrc.slug , acrc.entry_id AS entry_id , 

									acrc.status_id AS status_id , acrc.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = acrc.user_id LIMIT 1) AS u ) AS author

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS acrc

									INNER JOIN STATUS AS s ON s.status_id = acrc.status_id

									INNER JOIN ACCOUNT_CHANGE_REQUEST AS acr ON acr.slug = $1

									WHERE acrc.slug = $2 AND acrc.entry_id = acr.account_change_request_id

								`;

		return query;

	} ,

	'entryCommentDetailReplyAdd' : (req , res , opts) => {

		let query = `SELECT acrc.account_change_request_comment_id AS _id , acrc.slug , acrc.status_id AS status_id , s.word AS status ,

									(SELECT json_agg(row_to_json(r)) FROM (SELECT slug FROM ACCOUNT_CHANGE_REQUEST_REPLY AS r WHERE r.comment_id = acrc.account_change_request_comment_id LIMIT 2) AS r) AS replies

									FROM ACCOUNT_CHANGE_REQUEST_COMMENT AS acrc

									INNER JOIN STATUS AS s ON s.status_id = acrc.status_id

									INNER JOIN ACCOUNT_CHANGE_REQUEST AS acr ON acr.slug = $1

									WHERE acrc.slug = $2 AND acrc.entry_id = acr.account_change_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment1$' : (req , res , opts) => {

		let query = `	SELECT acr.account_change_request_id AS _id , acr.slug , acr.status_id AS status_id , acr.handler_id AS entry_handler ,

									grs.word AS status , (SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = acr.user_id) ) ) AS author

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = acr.status_id

									WHERE acr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT acr.slug , acr.account_change_request_id AS _id

									FROM ACCOUNT_CHANGE_REQUEST AS acr 

									WHERE acr.slug = $1

									LIMIT 1

									`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									WHERE acr.slug = $1

									RETURNING acr.message , acr.slug

									`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									WHERE account_change_request_no IN (${et})

									RETURNING acr.slug

									`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT acr.slug

									FROM ACCOUNT_CHANGE_REQUEST AS acr

									WHERE acr.slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE FROM ACCOUNT_CHANGE_REQUEST

									RETURNING slug
								
								`;

		return query;

	} ,

	'status$' : (req , res , opts) => {

		let query = `SELECT general_request_status_id AS _id , other_name AS name

									FROM GENERAL_REQUEST_STATUS

								`;

		return query;
	
	} ,

}