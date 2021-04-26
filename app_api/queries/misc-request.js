let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-request');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'manageRequest' : (req , res , opts) => {} ,

	'entryRequest' : (req , res , opts) => {} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT mr.misc_request_id AS _id , true AS exists 

								FROM MISC_REQUEST AS mr

								WHERE mr.slug = $1

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

			if (q.status) { $sq = sQuery.status(req , res , {}); }

		}

		let query = `SELECT mr.title , mr.updated_on , mr.misc_request_no AS num , mr.slug , 

									grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u

											WHERE u.user_id = mr.user_id) AS u ) AS author

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id 

									${Object.values($sq.join).join(' ')}

									${Object.values($sq.condition).join(' ')}

									ORDER BY mr.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT true AS permitted

								`;

		return query;
	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO 

									MISC_REQUEST(message , misc_request_no , slug , title , user_id , status_id)

									SELECT $$${b.message}$$ , $$${c}$$ , $$${s}$$ , $$${b.title}$$ , $$${b.author}$$ , grs.general_request_status_id

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE grs.word = 'Pending'

									RETURNING misc_request_id AS _id , misc_request_no AS num , slug

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

		let query = `SELECT mr.misc_request_id AS _id , mr.message , mr.title , mr.updated_on , mr.slug , 

									mr.misc_request_no AS num ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = mr.user_id) AS u ) AS author ,

									(SELECT json_agg(row_to_json(upl))

										FROM (SELECT location

											FROM ATTACHMENT AS atth 

											WHERE entry_id = mr.misc_request_id) AS upl ) AS documents ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.user_id AS _id , hl.first_name || ' ' || hl.last_name AS full_name 

											FROM USERS AS hl

											WHERE hl.user_id = mr.handler_id) AS hl ) AS entry_handler ,

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

											FROM MISC_REQUEST_REPLY AS ry 

											WHERE ry.comment_id = c.misc_request_comment_id) AS ry ) AS replies

											FROM MISC_REQUEST_COMMENT AS c WHERE c.entry_id = mr.misc_request_id) AS c ) AS timeline ,

									grs.word AS status

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReview' : (req , res , opts) => {} ,

	'entryReview$' : (req , res , opts) => {} ,

	'entryTimeline' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT mr.misc_request_id AS _id , mr.title , mr.message , mr.slug , grs.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.email_address , u.user_id AS _id FROM USERS AS u WHERE u.user_id = mr.user_id) AS u ) AS author ,

									(SELECT row_to_json(hl)

										FROM (SELECT hl.email_address , hl.user_id AS _id FROM USERS AS hl WHERE hl.user_id = mr.handler_id) AS hl ) AS entry_handler ,

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

											FROM MISC_REQUEST_REPLY AS ry 

											WHERE ry.comment_id = c.misc_request_comment_id) AS ry ) AS replies

											FROM MISC_REQUEST_COMMENT AS c WHERE c.entry_id = mr.misc_request_id) AS c ) AS timeline

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentAdd$s' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT

									INTO MISC_REQUEST_COMMENT(text , slug , misc_request_comment_no , entry_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING misc_request_comment_id AS _id , slug , entry_id

									`;
		return query;

	} ,

	'entryCommentReplyAdd$s' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}))

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		b.comment_author_name = b.comment_author_name ? b.comment_author_name : 'Anonymous';

		let query = `INSERT

									INTO MISC_REQUEST_REPLY(text , comment_author_name , slug , reply_no , entry_id , comment_id , user_id , status_id)

									SELECT $$${b.text}$$ , $$${b.comment_author_name}$$ , $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${opts.comment._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active' 

									RETURNING reply_id AS _id , slug

									`;
		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT mr.misc_request_id AS _id , mr.slug , mr.user_id AS author , mr.status_id , grs.word AS status , grs1.word AS status1

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs1 ON grs1.general_request_status_id = $$${b.status}$$

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE MISC_REQUEST AS mr

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$

									FROM GENERAL_REQUEST_STATUS AS grs 

									WHERE mr.slug = $$${opts.entry.slug}$$ AND grs.general_request_status_id = $$${opts.entry.status_id}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = $$${b.status}$$ ) ,

																						'author' , (SELECT row_to_json(u) AS user 

																												FROM (SELECT email_address FROM USERS AS u

																												INNER JOIN MISC_REQUEST AS mr ON mr.user_id = u.user_id

																												WHERE mr.slug = $1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryTransfer' : (req , res , opts) => {} ,

	'entryTransfer$' : (req , res , opts) => {} ,

	'entryTransfer$s' : (req , res , opts) => {} ,

	'entryCommentAdd' : (req , res , opts) => {

		let query = `SELECT mr.message , mr.slug , grs.word AS status , grs.general_request_status_id AS status_id ,

									(SELECT json_build_object('_id' , (SELECT u.user_id FROM USERS AS u WHERE u.user_id = mr.user_id) ) ) AS author

										FROM MISC_REQUEST AS mr

										INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

										WHERE mr.slug = $1

										LIMIT 1

								`;

		return query;

	} ,

	'entryCommentAdd$' : (req , res , opts) => {

		let query = `	SELECT mr.misc_request_id AS _id , mr.slug , mr.status_id AS status_id , mr.handler_id AS entry_handler , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = mr.user_id) ) ) AS author

										FROM MISC_REQUEST AS mr

										INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

										WHERE mr.slug = $1

								`;

		return query;

	} ,

	'entryAddReplytoComment' : (req , res , opts) => {

		let query = `	SELECT mr.misc_request_id AS _id , mr.slug , mr.status_id AS status_id , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = mr.user_id) ) ) AS author

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentDetail' : (req , res , opts) => {

		let query = `	SELECT mrc.misc_request_comment_id AS _id , mrc.text , mrc.slug , mrc.entry_id AS entry_id , 

									mrc.status_id AS status_id , mrc.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = mrc.user_id) AS u ) AS author

									FROM MISC_REQUEST_COMMENT AS mrc

									INNER JOIN STATUS AS s ON s.status_id = mrc.status_id

									INNER JOIN MISC_REQUEST AS mr ON mr.slug = $1

									WHERE mrc.slug = $2 AND mrc.entry_id = mr.misc_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment1$' : (req , res , opts) => {

		let query = `	SELECT mr.misc_request_id AS _id , mr.slug , mr.status_id AS status_id , mr.handler_id AS entry_handler ,

									grs.word AS status , (SELECT json_build_object('_id' , (SELECT user_id FROM USERS WHERE user_id = mr.user_id) ) ) AS author

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryCommentDetailReplyAdd' : (req , res , opts) => {

		let query = `SELECT mrc.misc_request_comment_id AS _id , mrc.slug , mrc.status_id AS status_id , s.word AS status ,

									(SELECT json_agg(row_to_json(r)) FROM (SELECT slug FROM MISC_REQUEST_REPLY AS r WHERE r.comment_id = mrc.misc_request_comment_id LIMIT 2) AS r) AS replies

									FROM MISC_REQUEST_COMMENT AS mrc

									INNER JOIN STATUS AS s ON s.status_id = mrc.status_id

									INNER JOIN MISC_REQUEST AS mr ON mr.slug = $1

									WHERE mrc.slug = $2 AND mrc.entry_id = mr.misc_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment2$' : (req , res , opts) => {

		let query = `SELECT mrc.misc_request_comment_id AS _id , mrc.slug , mrc.status_id AS status_id , s.word AS status ,

									(SELECT json_agg(row_to_json(r)) FROM (select slug FROM MISC_REQUEST_REPLY AS r WHERE r.comment_id = mrc.misc_request_comment_id LIMIT 2) AS r) AS replies

									FROM MISC_REQUEST_COMMENT AS mrc

									INNER JOIN STATUS AS s ON s.status_id = mrc.status_id

									INNER JOIN MISC_REQUEST AS mr ON mr.slug = $1

									WHERE mrc.slug = $2 AND mrc.entry_id = mr.misc_request_id

									LIMIT 1

								`;

		return query;

	} ,

	'entryAddReplytoComment$' : (req , res , opts) => {

		let query = `	SELECT mr.misc_request_id AS _id , mr.slug , mr.status_id AS status_id , mr.handler_id AS entry_handler , grs.word AS status ,

									(SELECT json_build_object('_id' , (SELECT u.user_id FROM USERS AS u WHERE u.user_id = mr.user_id) ) ) AS author

									FROM MISC_REQUEST AS mr

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = mr.status_id

									WHERE mr.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT mr.slug , mr.misc_request_id AS _id , mr.user_id AS author

									FROM MISC_REQUEST AS mr 

									WHERE mr.slug = $1

									LIMIT 1

									`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM MISC_REQUEST AS mr

									WHERE mr.slug = $1

									RETURNING mr.message , mr.slug`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM MISC_REQUEST AS mr

									WHERE misc_request_no IN (${et})

									RETURNING mr.slug`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT mr.slug

									FROM MISC_REQUEST AS mr

									WHERE mr.slug IS NOT NULL

									LIMIT 1`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM MISC_REQUEST AS mr

									WHERE rt.slug = $1
								
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