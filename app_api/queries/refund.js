let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/refund');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'entryExists' : (req , res , opts) => {

		let query = `SELECT rf.refund_id AS _id , slug , true AS exists 

								FROM REFUND AS rf

								WHERE rf.slug = $1

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

			else if (q.faculty) { $sq = sQuery.faculty(req , res , {}); }

			else if (q.department) { $sq = sQuery.department(req , res , {}); }

			else if (q.stage) { $sq = sQuery.stage(req , res , {}); }
		}

		let query = `SELECT rf.application_number , rf.updated_on , rf.refund_no AS num , rf.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , l.name AS level

											FROM USERS AS u

											INNER JOIN LEVEL AS l ON l.level_id = u.level_id

											WHERE u.user_id = rf.user_id) AS u ) AS author ,

									(SELECT row_to_json(st)

										FROM (SELECT rfs.refund_stage_id AS _id

											FROM REFUND_STAGE AS rfs 

											WHERE rfs.refund_stage_id = rf.stage_id) AS st ) AS stage

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY rf.updated_on DESC

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

		let u = {'department' : 1 , 'faculty' : 1};

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO

									REFUND (message , refund_no , slug , application_number , user_id , department_id , faculty_id , status_id)

									SELECT $$${b.message}$$ , ${c} , $$${s}$$ , $$${uuidv4()}$$ , ${b.author} , ${u.department} , ${u.faculty} , grs.general_request_status_id

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE grs.word = 'Pending'

									RETURNING refund_id AS _id , refund_no , slug

									`;

		return query;

	} ,

	'entryAddDocument$' : (req , res , opts) => {

		let query1 = queryBuilder.documentRF$(req , res , {'entry' : opts.entry , 'c' : crypto})

		return query1;

	} ,

	'entryDetail' : (req , res , opts) => {

		let u = req.user;

		let query = `SELECT rf.refund_id AS _id , rf.message , rf.application_number , rf.updated_on , rf.slug , grs.word AS status , rf.status_id AS other_status_id ,

									rf.refund_no AS num , rf.department_id AS department , rf.faculty_id AS faculty ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , ll.name AS level , dt.name AS department , ft.name AS faculty

											FROM USERS AS u 

											INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id

											INNER JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id

											INNER JOIN FACULTY AS ft ON ft.faculty_id = u.faculty_id

											WHERE u.user_id = rf.user_id) AS u ) AS author ,

									(SELECT json_agg(row_to_json(upl))

										FROM (SELECT location

											FROM ATTACHMENT AS atth 

											WHERE entry_id = rf.refund_id) AS upl ) AS documents ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.user_id AS _id , hl.first_name || ' ' || hl.last_name AS full_name 

											FROM USERS AS hl

											WHERE hl.user_id = rf.handler_id) AS hl ) AS entry_handler ,

									(SELECT row_to_json(rfs)

										FROM (SELECT rfs.refund_stage_id AS _id , rfs.name 

											FROM REFUND_STAGE AS rfs 

											WHERE rfs.refund_stage_id = rf.stage_id) AS rfs ) AS stage ,

									(SELECT json_agg(row_to_json(sig))

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , u.email_address

											FROM REFUND_SIGNATURE AS sig 

											INNER JOIN USERS AS u ON u.user_id = sig.user_id

											WHERE sig.entry_id = rf.refund_id) AS sig ) AS signature ,

									(SELECT row_to_json(lt)

										FROM (SELECT lt.refund_letter_id AS _id , lt.slug AS slug

											FROM REFUND_LETTER AS lt

											WHERE lt.entry_id = rf.refund_id) AS lt

											LIMIT 1) AS letter

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryReview' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rf.refund_id AS _id , rf.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id

											FROM USERS AS u

											WHERE u.user_id = rf.user_id) AS u ) AS author

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryReview$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = ${b.author} , stage_id = rfs.refund_stage_id

									FROM GENERAL_REQUEST_STATUS AS grs

									INNER JOIN REFUND_STAGE AS rfs ON rfs.refund_stage_id = 1

									WHERE rf.slug = $1 AND grs.word = 'Review'

									RETURNING rf.slug , grs.word AS status

								`;

		return query;

	} ,

	'entryTimeline' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rf.refund_id AS _id , rf.application_number , rf.message , rf.slug , rf.department_id AS department , rf.faculty_id AS faculty , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id FROM USERS AS u WHERE u.user_id = rf.user_id) AS u ) AS author ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.email_address , hl.user_id AS _id FROM USERS AS hl WHERE hl.user_id = rf.handler_id) AS hl ) AS entry_handler ,

									(SELECT json_agg(row_to_json(rc))

										FROM (SELECT text , updated_on , slug , user_id AS author 

											FROM REFUND_COMMENT AS rc

											WHERE rc.entry_id = rf.refund_id) AS rc ) AS timeline

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryCommentAdd$s' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		let query = `INSERT

									INTO REFUND_COMMENT(text , slug , refund_comment_no , entry_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING refund_comment_id AS _id , slug , entry_id

									`;

		return query;

	} ,

	'entryCommentReplyAdd$s' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		b.comment_author_name = b.comment_author_name ? b.comment_author_name : 'Anonymous';

		let query = `INSERT

									INTO REPLY(text , comment_author_name , slug , reply_no , entry_id , comment_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${b.comment_author_name}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${opts.comment._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING reply_id AS _id , slug

									`;
		return query;

	} ,

	'entryUpdate2$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$ , stage_id = $$${b.stage}$$

									FROM GENERAL_REQUEST_STATUS AS grs

									INNER JOIN REFUND_STAGE AS rs ON rs.refund_stage_id = $$${b.stage}$$

									WHERE rf.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${b.status}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status} ) ,

																						'author' , (SELECT row_to_json(u) AS user FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = 1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryUpdate21$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$ , stage_id = $$${b.stage}$$

									FROM GENERAL_REQUEST_STATUS AS grs

									INNER JOIN REFUND_STAGE AS rs ON rs.refund_stage_id = $$${b.stage}$$

									WHERE rf.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${b.status}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status} ) ,

																						'author' , (SELECT row_to_json(u) AS user FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = 1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryUpdateLetterAdd$' : (req , res , opts) => {

		let b = req.body;

		let u = req.user;

		let query = `UPDATE REFUND AS rf

									SET status_id = $$${b.status}$$ , stage_id = $$${b.stage}$$ , letter_id = $$${opts.letter._id}$$

									FROM GENERAL_REQUEST_STATUS AS grs

									INNER JOIN REFUND_STAGE AS rs ON rs.refund_stage_id = $$${b.stage}$$

									WHERE rf.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${b.status}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status} LIMIT 1 ) ,

																						'author' , (SELECT row_to_json(u) AS user FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = 1 LIMIT 1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,


	'entryCommentAdd' : (req , res , opts) => {

		let query = `SELECT rf.message , rf.slug , grs.word AS status , grs.general_request_status_id AS status_id , rf.department_id AS department , rf.faculty_id AS faculty ,

									dt.name AS department_name , ft.name AS faculty_name ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = rf.user_id LIMIT 1) ) ) AS author

									FROM REFUND AS rf

									INNER JOIN DEPARTMENT AS dt ON dt.department_id = rf.department_id

									INNER JOIN FACULTY AS ft ON ft.faculty_id = rf.faculty_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryCommentAdd$' : (req , res , opts) => {

		let query = `	SELECT rf.refund_id AS _id , rf.slug , rf.status_id AS status_id , rf.handler_id AS entry_handler , rf.department_id AS department , rf.faculty_id AS faculty ,

									grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = rf.user_id) ) ) AS author

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryAddReplytoComment' : (req , res , opts) => {

		let query = `	SELECT rf.refund_id AS _id , rf.slug , rf.status_id AS status_id , grs.word AS status , rf.department_id AS department , rf.faculty_id AS faculty ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = rf.user_id) ) ) AS author

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryCommentDetail' : (req , res , opts) => {

		let query = `	SELECT rfc.refund_comment_id AS _id , rfc.text , rfc.slug , rfc.entry_id AS entry_id , 

									rfc.status_id AS status_id , rfc.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = rfc.user_id) AS u ) AS author

									FROM REFUND_COMMENT AS rfc

									INNER JOIN STATUS AS s ON s.status_id = rfc.status_id

									INNER JOIN REFUND AS rf ON rf.slug = $1

									WHERE rfc.slug = $2 AND rfc.entry_id = rf.refund_id

								`;

		return query;

	} ,

	'entryCommentDetailReplyAdd' : (req , res , opts) => {

		let query = `SELECT rfc.refund_comment_id AS _id , rfc.slug , rfc.status_id AS status_id , s.word AS status ,

									(SELECT json_agg(row_to_json(r)) FROM (SELECT slug FROM REPLY AS r WHERE r.comment_id = rfc.refund_comment_id LIMIT 2) AS r) AS replies

									FROM REFUND_COMMENT AS rfc

									INNER JOIN STATUS AS s ON s.status_id = rfc.status_id

									INNER JOIN REFUND AS rf ON rf.slug = $1

									WHERE rfc.slug = $2 AND rfc.entry_id = rf.refund_id

								`;

		return query;

	} ,

	'entryAddReplytoComment1$' : (req , res , opts) => {

		let query = `	SELECT rf.refund_id AS _id , rf.slug , rf.status_id AS status_id , rf.handler_id AS entry_handler , rf.department_id AS department , rf.faculty_id AS faculty ,

									grs.word AS status , (SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = rf.user_id) ) ) AS author

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT rf.slug , rf.refund_id AS _id

									FROM REFUND AS rf 

									WHERE rf.slug = $1`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM REFUND AS rf

									WHERE rf.slug = $1

									RETURNING rf.message , rf.slug`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM REFUND AS rf

									WHERE refund_no IN (${et})

									RETURNING rf.slug`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT rf.slug

									FROM REFUND AS rf

									WHERE rf.slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE FROM REFUND

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