let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-request');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'manageRequest' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rt.name , rt.slug

									FROM REQUEST_TYPE AS rt

									ORDER BY rt.updated_on DESC

									`;

		return query;
	} ,

	'entryRequest' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rt.name , rt.abbreviation , rt.description , rt.request_type_no AS num , rt.slug

									FROM REQUEST_TYPE AS rt

									WHERE rt.slug = $1

									LIMIT 1

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT gr.general_request_id AS _id , rt.name , true AS exists 

								FROM GENERAL_REQUEST AS gr

								INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

								WHERE gr.slug = $1

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

		let query = `SELECT gr.application_number , gr.updated_on , gr.general_request_no AS num , gr.slug , 

									grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , u.identity_number , ll.name AS level

											FROM USERS AS u 

											INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id

											WHERE u.user_id = gr.user_id) AS u ) AS author

									FROM GENERAL_REQUEST AS gr

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $1

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id 

									${Object.values($sq.join).join(' ')}

									WHERE rt.request_type_id = gr.request_type_id ${Object.values($sq.condition).join(' ')}

									ORDER BY gr.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT rt.request_type_id AS request_type , rt.name AS request_type_name , rt.title , ut.unit_id AS unit , ut.name as unit_name

									FROM REQUEST_TYPE AS rt

									INNER JOIN UNIT AS ut ON ut.unit_id = rt.unit_id

									WHERE rt.slug = $1

									LIMIT 1
								
								`;

		return query;
	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO 

									GENERAL_REQUEST(message , general_request_no , slug , application_number , user_id , unit_id , request_type_id , status_id)

									SELECT $$${b.message}$$ , $$${c}$$ , $$${s}$$ , $$${uuidv4()}$$ , $$${b.author}$$ , $$${b.unit}$$ , $$${b.request_type}$$ , grs.general_request_status_id

									FROM REQUEST_TYPE AS rt

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.word = 'Pending'

									WHERE rt.slug = $1 AND rt.request_type_id = ${b.request_type} AND rt.unit_id = ${b.unit} 

									RETURNING general_request_id AS _id , general_request_no AS num , slug ,

										(SELECT name 

											FROM REQUEST_TYPE AS rt 

											WHERE rt.request_type_id = ${b.request_type} 

											LIMIT 1) AS request_type

								`;

		return query;

	} ,

	'entryAddDocument$' : (req , res , opts) => {

		let b = req.body;

 		let docs = b.documents && b.documents.length > 0 ? b.documents : [];

 		let et = docs.map((item) => { return `$$${item.key}$$`; }).join(' , ');

		let query = `UPDATE ATTACHMENT AS atth

									SET entry_id = $1

									WHERE key IN (${et})

									RETURNING key
								
								`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT gr.general_request_id AS _id , gr.message , gr.application_number , gr.request_username , gr.request_password , gr.updated_on , gr.slug , 

									gr.general_request_no AS num , gr.unit_id AS unit , ut.name AS unit_name ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , dt.name AS department , ft.name AS faculty , ll.name AS level

											FROM USERS AS u 

											INNER JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id 

											INNER JOIN FACULTY AS ft ON ft.faculty_id = u.faculty_id

											INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id

											WHERE u.user_id = gr.user_id) AS u ) AS author ,

									(SELECT json_agg(row_to_json(upl))

										FROM (SELECT location

											FROM ATTACHMENT AS atth 

											WHERE entry_id = gr.general_request_id) AS upl ) AS documents ,

									(SELECT json_agg(row_to_json(est))

										FROM (SELECT grs1.general_request_status_id AS _id , grs1.other_name AS name

											FROM GENERAL_REQUEST_STATUS AS grs1

											) AS est ) AS entry_statuses ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.user_id AS _id , hl.first_name || ' ' || hl.last_name AS full_name 

											FROM USERS AS hl

											WHERE hl.user_id = gr.handler_id) AS hl ) AS entry_handler ,

									grs.word AS status , rt.name AS request_type

									FROM GENERAL_REQUEST AS gr

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReview' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT gr.general_request_id AS _id , gr.slug , gr.unit_id AS unit , gr.request_type_id AS request_type , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id 

											FROM USERS AS u

											WHERE u.user_id = gr.user_id) AS u ) AS author

									FROM GENERAL_REQUEST AS gr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReview$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE GENERAL_REQUEST AS gr

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE gr.slug = $1 AND grs.word = 'Review'

									RETURNING gr.slug , grs.word AS status

								`;

		return query;

	} ,

	'entryTimeline' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT gr.general_request_id AS _id , gr.application_number , gr.message , gr.slug , gr.unit_id AS unit , gr.request_type_id AS request_type , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id FROM USERS AS u WHERE u.user_id = gr.user_id) AS u ) AS author ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.email_address , hl.user_id AS _id FROM USERS AS hl WHERE hl.user_id = gr.handler_id) AS hl ) AS entry_handler ,

									(SELECT json_agg(row_to_json(c))

										FROM (SELECT text , slug , updated_on , user_id AS author , 

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name , u.user_id AS _id 

											FROM USERS AS u 

											WHERE u.user_id = c.user_id) AS u ) AS author ,

									(SELECT json_agg(row_to_json(r))

										FROM (SELECT text , comment_author_name , 

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name , u.user_id AS _id 

											FROM USERS AS u 

												WHERE u.user_id = ry.user_id) AS u ) AS author 

											FROM REPLY AS ry 

											WHERE ry.comment_id = c.general_request_comment_id) AS r ) AS replies

											FROM GENERAL_REQUEST_COMMENT AS c WHERE c.entry_id = gr.general_request_id) AS c ) AS timeline

									FROM GENERAL_REQUEST AS gr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentAdd$s' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT

									INTO GENERAL_REQUEST_COMMENT(text , slug , general_request_comment_no , entry_id , unit_id , request_type_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${opts.entry.unit}$$ , $$${opts.entry.request_type}$$ , $$${b.author}$$ , s.status_id

									FROM REQUEST_TYPE AS rt

									INNER JOIN STATUS AS s ON s.word = 'Active'

									WHERE rt.slug = $1 AND rt.request_type_id = ${opts.entry.request_type} AND rt.unit_id = ${opts.entry.unit} 

									RETURNING general_request_comment_id AS _id , slug , entry_id , unit_id

									`;
		return query;

	} ,

	'entryCommentReplyAdd$' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}))

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		b.comment_author_name = b.comment_author_name ? b.comment_author_name : 'Anonymous';

		let query = `INSERT

									INTO REPLY(text , comment_author_name , slug , reply_no , entry_id , comment_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${b.comment_author_name}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${opts.comment._id}$$ , $$${b.author}$$ , s.status_id

									FROM REQUEST_TYPE AS rt

									INNER JOIN STATUS AS s ON s.word = 'Active'

									WHERE rt.slug = $1 AND rt.request_type_id = ${opts.entry.request_type} AND rt.unit_id = ${opts.entry.unit} 

									RETURNING reply_id AS _id , slug

									`;
		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT gr.general_request_id AS _id , gr.slug , gr.user_id AS author , gr.unit_id AS unit , 

									gr.request_type_id AS request_type , gr.status_id , grs.word AS status , grs1.word AS status1

									FROM GENERAL_REQUEST AS gr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs1 ON grs1.general_request_status_id = ${b.status}

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let query2 = ``;

		query2 += b.request_username ? ` , request_username = $$${b.request_username}$$` : '';

		query2 += b.request_password ? ` , request_password = $$${b.request_password}$$` : ''; 

		let query = `UPDATE GENERAL_REQUEST AS gr

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$ ${query2}

									FROM GENERAL_REQUEST_STATUS AS grs 

									WHERE gr.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${opts.entry.status_id}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status} ) ,

																						'author' , (SELECT row_to_json(u) AS user 

																												FROM (SELECT email_address FROM USERS AS u

																												INNER JOIN GENERAL_REQUEST AS gr ON gr.user_id = u.user_id

																												WHERE gr.slug = $1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryTransfer' : (req , res , opts) => {

		let query = `SELECT 

										json_build_object(

											'Unit' , (SELECT json_agg(row_to_json(ut)) 

																	FROM (SELECT ut.unit_id AS _id , ut.name

																		FROM UNIT AS ut

																		INNER JOIN REQUEST_TYPE AS rt ON rt.request_type_id = ut.unit_id

																		) AS ut ) ,

											'Entry' , (SELECT row_to_json(gr) 

												FROM (SELECT gr.message , gr.slug , ut.name AS unit_name , ut.unit_id AS unit , grs.word AS status , rt.name AS request_type , rt.request_type_id ,

																(SELECT row_to_json(u) 

																	FROM (SELECT u.first_name || ' ' || u.last_name AS full_name , u.user_id AS _id 

																		FROM USERS AS u 

																		WHERE u.user_id = gr.user_id) AS u) AS author ,

																(SELECT row_to_json(hl) 

																	FROM (SELECT hl.first_name || ' ' || hl.last_name AS full_name , hl.user_id AS _id

																		FROM USERS AS hl 

																		WHERE hl.user_id = gr.handler_id) AS hl) AS entry_handler

													FROM GENERAL_REQUEST AS gr

													INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

													INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

													INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

													WHERE gr.slug = $1

													LIMIT 1) as gr)

									) AS result

								`;

		return query;

	} ,

	'entryTransfer$' : (req , res , opts) => {

		let query = `SELECT gr.general_request_id AS _id , gr.slug , gr.unit_id AS unit , gr.request_type_id AS request_type , gr.handler_id AS entry_handler , gr.user_id AS author ,

									grs.word AS status 

									FROM GENERAL_REQUEST AS gr

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									WHERE gr.slug = $1

									LIMIT 1

									`;

		return query;

	} ,

	'entryTransfer$s' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE GENERAL_REQUEST AS gr

									SET status_id = grs.general_request_status_id , unit_id = $$${b.unit}$$ , request_type_id = rt1.request_type_id

									FROM GENERAL_REQUEST_STATUS AS grs

									INNER JOIN REQUEST_TYPE AS rt1 ON rt1.unit_id = $$${b.unit}$$ 

									INNER JOIN UNIT AS ut ON ut.unit_id = $$${b.unit}$$

									WHERE gr.slug = $1 AND grs.word = 'Transferred'

									RETURNING gr.slug , gr.request_type_id AS request_type , gr.unit_id AS unit

								`;

		return query;

	} ,

	'entryCommentAdd' : (req , res , opts) => {

		let query = `SELECT gr.message , gr.slug , gr.unit_id AS unit , ut.name AS unit_name ,

									grs.word AS status , grs.general_request_status_id AS status_id ,

									(SELECT json_build_object('_id' , (SELECT u.user_id FROM USERS AS u WHERE u.user_id = gr.user_id) ) ) AS author

										FROM GENERAL_REQUEST AS gr

										INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

										INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

										INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

										WHERE gr.slug = $1

										LIMIT 1

								`;

		return query;

	} ,

	'entryCommentAdd$' : (req , res , opts) => {

		let query = `	SELECT gr.general_request_id AS _id , gr.slug , gr.status_id AS status_id , gr.handler_id AS entry_handler , gr.unit_id as unit , 

									rt.request_type_id as request_type , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = gr.user_id) ) ) AS author

										FROM GENERAL_REQUEST AS gr

										INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

										INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

										INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

										WHERE gr.slug = $1

								`;

		return query;

	} ,

	'entryAddReplytoComment' : (req , res , opts) => {

		let query = `	SELECT gr.general_request_id AS _id , gr.slug , gr.status_id AS status_id , gr.unit_id as unit , rt.request_type_id as request_type , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = gr.user_id) ) ) AS author

									FROM GENERAL_REQUEST AS gr

									INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentDetail' : (req , res , opts) => {

		let query = `	SELECT grc.general_request_comment_id AS _id , grc.text , grc.slug , grc.entry_id AS entry_id , 

									grc.status_id AS status_id , grc.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = grc.user_id) AS u ) AS author

									FROM GENERAL_REQUEST_COMMENT AS grc

									INNER JOIN STATUS AS s ON s.status_id = grc.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2

									INNER JOIN GENERAL_REQUEST AS gr ON gr.slug = $1

									WHERE grc.slug = $3 AND grc.entry_id = gr.general_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment2$' : (req , res , opts) => {

		let query = `SELECT grc.general_request_comment_id AS _id , grc.slug , grc.status_id AS status_id , s.word AS status ,

									(SELECT json_agg(row_to_json(r)) FROM (select slug FROM REPLY AS r WHERE r.comment_id = grc.general_request_comment_id LIMIT 2) AS r) AS replies

									FROM GENERAL_REQUEST_COMMENT AS grc

									INNER JOIN STATUS AS s ON s.status_id = grc.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2

									INNER JOIN GENERAL_REQUEST AS gr ON gr.slug = $1

									WHERE grc.slug = $3 AND grc.entry_id = gr.general_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment$' : (req , res , opts) => {

		let query = `	SELECT gr.general_request_id AS _id , gr.slug , gr.status_id AS status_id , gr.handler_id AS entry_handler , gr.unit_id as unit , 

									rt.request_type_id as request_type , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT u.user_id FROM USERS AS u WHERE u.user_id = gr.user_id) ) ) AS author

									FROM GENERAL_REQUEST AS gr

									INNER JOIN UNIT AS ut ON ut.unit_id = gr.unit_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT gr.slug , gr.general_request_id AS _id , gr.unit_id AS unit , gr.user_id AS author

									FROM GENERAL_REQUEST AS gr 

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug = $1

									LIMIT 1

									`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_REQUEST AS gr

									USING REQUEST_TYPE AS rt

									WHERE gr.slug = $1 AND rt.slug = $2 AND rt.request_type_id = gr.request_type_id

									RETURNING gr.message , gr.request_type_id as request_type , gr.slug`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM GENERAL_REQUEST AS gr

									USING REQUEST_TYPE AS rt

									WHERE general_request_no IN (${et}) AND rt.slug = $1 AND rt.request_type_id = gr.request_type_id

									RETURNING gr.slug`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT gr.slug

									FROM GENERAL_REQUEST AS gr

									INNER JOIN REQUEST_TYPE AS rt ON rt.slug = $1 AND rt.request_type_id = gr.request_type_id

									WHERE gr.slug IS NOT NULL

									LIMIT 1`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_REQUEST AS gr

									USING REQUEST_TYPE AS rt

									WHERE rt.slug = $1 AND rt.request_type_id = gr.request_type_id 
								
								`;

		return query;

	} ,

	'deleteDocs$' : (docs) => {

 		let $es = docs && docs.length ? docs : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM ATTACHMENT AS att

									WHERE key IN (${et})

									RETURNING key
								
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