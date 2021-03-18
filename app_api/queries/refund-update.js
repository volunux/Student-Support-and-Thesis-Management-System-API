let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rf.refund_id AS _id , rf.updated_on , rf.slug , rf.letter_id AS letter , grs.word AS status , grs1.word AS status1 , ${b.status} AS proposed_status ,

									rf.refund_no AS num , rf.department_id AS department , rf.faculty_id AS faculty ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.email_address

											FROM USERS AS u 

											WHERE u.user_id = rf.user_id LIMIT 1) AS u ) AS author ,

									(SELECT row_to_json(h)

										FROM (SELECT h.user_id AS _id 

											FROM USERS AS h

											WHERE h.user_id = rf.handler_id LIMIT 1) AS h ) AS entry_handler ,

									(SELECT row_to_json(stage)

										FROM (SELECT rfs.refund_stage_id AS _id , rfs.name AS name 

											FROM REFUND_STAGE AS rfs 

											WHERE rfs.refund_stage_id = rf.stage_id LIMIT 1) AS stage ) AS stage ,

									(SELECT json_agg(row_to_json(sig))

										FROM (SELECT sig.refund_signature_id AS _id , u.first_name || ' ' || u.last_name AS full_name

											FROM REFUND_SIGNATURE AS sig 

											INNER JOIN USERS AS u ON u.user_id = sig.user_id

											WHERE entry_id = rf.refund_id) AS sig ) AS signature

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									INNER JOIN GENERAL_REQUEST_STATUS AS grs1 ON grs1.general_request_status_id = ${b.status}

									WHERE rf.slug = $1

								`;

		return query;

	} ,

	'entryUpdate2x$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 1

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Rejected'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,

	'entryUpdate2s$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 2

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Review'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,

	'entryUpdate3x$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 2

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Rejected'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,

	'entryUpdate3s$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 3

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Review'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,


	'entryUpdate4s$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , letter_id = $$${opts.letter._id}$$ , stage_id = 4

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Review'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,

	'entryUpdate5s$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET stage_id = 5

									WHERE rf.slug = $1

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,
	'entrySignatureAdd$' : (req , res , opts) => {

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}))

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let b = req.body;

		let query = `INSERT

									INTO REFUND_SIGNATURE(slug , refund_signature_no , entry_id , user_id , status_id)

									SELECT $$${s}$$ , $$${c}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING refund_signature_id AS _id , slug , entry_id

									`;

		return query;

	} ,

	'entryUpdate6x$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 5

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Rejected'

									RETURNING (SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u)

								`;

		return query;

	} ,

	'entryUpdate6s$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE REFUND AS rf

									SET status_id = grs.general_request_status_id , handler_id = $$${b.author}$$ , stage_id = 6

									FROM GENERAL_REQUEST_STATUS AS grs

									WHERE rf.slug = $1 AND grs.word = 'Fulfilled'

									RETURNING

									(SELECT row_to_json(u) AS author FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = rf.user_id) AS u) ,

									(SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status}) AS status

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

	'entryLetterAdd$' : (req , res , opts) => {

		let b = req.body;

		console.log('Hello World');

		console.log(b);

		console.log('Hello World');

		let u = {'department' : 1 , 'faculty' : 1};

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO 

									REFUND_LETTER(main_body , refund_letter_no , slug , entry_id , user_id , status_id)

									SELECT $$${b.main_body}$$ , ${c} , $$${s}$$ , $$${opts.entry._id}$$ , ${b.author} , s.status_id

									FROM STATUS AS s

									WHERE s.word = 'Active'

									RETURNING refund_letter_id AS _id , refund_letter_no , slug

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

									SELECT json_build_object('status' , (SELECT word FROM GENERAL_REQUEST_STATUS AS grs WHERE grs.general_request_status_id = ${b.status} ) ,

																						'author' , (SELECT row_to_json(u) AS user FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = 1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,


}