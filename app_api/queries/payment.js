let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/payment');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'managePayment' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT pt.name , pt.abbreviation , pt.payment_type_no AS num , pt.slug

									FROM PAYMENT_TYPE AS pt

									ORDER BY pt.updated_on DESC

									`;

		return query;
	} ,

	'entryPayment' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT pt.name , pt.abbreviation , pt.description , pt.payment_type_no AS num , pt.slug

									FROM PAYMENT_TYPE AS pt

									WHERE pt.slug = $1

									LIMIT 1

									`;

		return query;
	} ,

	'entryExists' : (req , res , opts) => {

		let query = `SELECT gp.general_payment_id AS _id , pt.name , true AS exists 

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $2 AND pt.payment_type_id = gp.payment_type_id

									WHERE gp.slug = $1

									LIMIT 1

									`;

		return query;

	} ,

	'entryCheckStatus' : (req , res , opts) => {

		let query = `SELECT gp.general_payment_id AS _id , gp.slug AS general_payment , pt.slug AS payment_type , pt.name AS payment_type_name , ps.word AS status 

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = gp.payment_type_id

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									WHERE gp.payment_reference = $1

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

			if (q.payment_reference) { $sq = sQuery.reference(req , res , {}); }

			else if (q.status) { $sq = sQuery.status(req , res , {}); }

			else if (q.faculty) { $sq = sQuery.faculty(req , res , {}); }

			else if (q.department) { $sq = sQuery.department(req , res , {}); }

		}

		let query = `SELECT gp.payment_reference , gp.created_on AS paid_on , gp.email_address , gp.full_name , gp.phone_number , gp.payment_no AS num , gp.slug , pses.amount AS amount , pses.name AS payment_session , 

									ps.word AS status , pt.name AS payment_type , dt.name AS department , ft.name AS faculty , gp.user_id

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $1

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = gp.payment_session_id

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									INNER JOIN FACULTY AS ft ON ft.faculty_id = gp.faculty_id

									INNER JOIN DEPARTMENT AS dt ON dt.department_id = gp.department_id

									${Object.values($sq.join).join(' ')}

									WHERE gp.payment_type_id = pt.payment_type_id ${Object.values($sq.condition).join(' ')}

									ORDER BY gp.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;
	} ,

	'entryAdd' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS payment_type , pt.name AS payment_type_name ,

									(SELECT json_agg(row_to_json(ps))

										FROM (SELECT ps.payment_session_id AS _id , ps.name , ps.slug

											FROM PAYMENT_SESSION AS ps 

											WHERE ps.payment_type_id = pt.payment_type_id ) AS ps ) AS payment_session

									FROM PAYMENT_TYPE AS pt

									WHERE pt.slug = $1

									LIMIT 1

								`;

		return query;
	} ,

	'checkPaymentTypeAndSession' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS payment_type , ps.payment_session_id AS payment_session

									FROM PAYMENT_TYPE AS pt

									INNER JOIN PAYMENT_SESSION AS ps ON ps.payment_session_id = $2 AND ps.payment_type_id = pt.payment_type_id

									WHERE pt.payment_type_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'checkPayment' : (req , res , opts) => {

		let query = `SELECT gp.general_payment_id AS _id , gp.slug , pt.slug AS payment_type_slug , ps.name AS status

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = $2

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = $1

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									WHERE gp.payment_type_id = $1 AND gp.user_id = $3 AND ps.name = 'success'

									LIMIT 1

								`;

		return query;

	} ,

	'proceedEntryCreate' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS payment_type , pt.name , pt.description , pt.abbreviation , ps.amount , ps.payment_session_id AS payment_session

									FROM PAYMENT_SESSION AS ps

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = $1

									WHERE ps.payment_session_id = $2

									LIMIT 1

								`;

		return query;
	} ,

	'proceedEntryCreate$' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS _id , pt.name , pt.description , pt.abbreviation , pses.amount , pses.name AS payment_session

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = $2

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = $1

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									WHERE gp.user_id = $3 AND ps.name = 'success'

									LIMIT 1

								`;

		return query;
	} ,

	'proceedEntryCreate$2' : (req , res , opts) => {

		let query = `SELECT pt.payment_type_id AS _id

									FROM PAYMENT_SESSION AS pses

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = $1

									WHERE pses.payment_session_id = $2

									LIMIT 1

								`;

		return query;
	} ,

	'proceedEntryCreate$3' : (req , res , opts) => {

		let b = req.body;

		let u = req.user;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO 

									GENERAL_PAYMENT(payment_reference , payment_no , slug , user_id , payment_type_id , payment_session_id , status_id , department_id , faculty_id , 

									phone_number , full_name , email_address)

									SELECT $$${opts.entry.data.reference}$$ , ${c} , $$${s}$$ , ${b.author} , $$${b.payment_type}$$ , $$${b.payment_session}$$ , 

									ps.payment_status_id , $$${u.department}$$ , $$${u.faculty}$$ ,

									$$${b.metadata.phone_number}$$ , $$${b.metadata.full_name}$$ , $$${b.metadata.email_address}$$

									FROM PAYMENT_TYPE AS pt

									INNER JOIN PAYMENT_STATUS AS ps ON ps.word = 'Pending'

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = $2 

									WHERE pt.payment_type_id = $1

									RETURNING general_payment_id AS _id , payment_no , slug ,

										(SELECT name FROM PAYMENT_TYPE WHERE payment_type_id = $1 LIMIT 1) AS payment_type`;

		return query;

	} ,


	'entryAdd1$' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT payment_id AS _id , p.payment_reference , pt.description , p.full_name , p.created_on AS paid_on , p.slug , 

									p.phone_number , p.email_address , d.name AS department , f.name AS faculty ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , matriculation_number , identity_number , l.name AS level

											FROM USERS AS u 

											INNER JOIN LEVEL AS l ON l.level_id = u.level_id

											WHERE u.user_id = p.user_id) AS u ) AS author ,

									ps.word AS status , pt.name AS payment_type

									FROM GENERAL_PAYMENT AS p

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $1 AND pt.payment_type_id = gp.payment_type_id

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = p.status_id

									INNER JOIN DEPARTMENT AS d ON d.department_id = p.department_id

									INNER JOIN FACULTY AS d ON f.faculty_id = p.faculty_id

									WHERE p.payment_reference = ${b.payment_reference}

									LIMIT 1
								
								`;

		return query;
	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}))

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase()

		let query = `INSERT INTO 

									GENERAL_PAYMENT(payment_reference , payment_no , slug , user_id , payment_type_id , status_id , department_id , faculty_id , phone_number , full_name , email_address)

									SELECT $$${b.payment_reference}$$ , ${c} , $$${s}$$ , ${b.author} , $$${b.payment_type}$$ , ps.payment_status_id , $$${b.department}$$ , $$${b.faculty}$$ , $$${b.amount}$$ ,

									$$${b.phone_number}$$ , $$${b.full_name}$$ , $$${b.email_address}$$

									FROM PAYMENT_TYPE AS pt

									INNER JOIN PAYMENT_STATUS AS ps ON ps.word = 'Success'

									WHERE pt.slug = $1 AND pt.payment_type_id = ${b.payment_type} 

									RETURNING payment_id AS _id , payment_no , slug , 

										(SELECT name FROM PAYMENT_TYPE WHERE payment_type_id = ${b.payment_type} LIMIT 1) AS payment_type`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT gp.general_payment_id AS _id , gp.payment_reference , gp.payment_type_id , gp.payment_session_id , pt.description , gp.full_name , gp.created_on AS paid_on , gp.slug , 

									gp.phone_number , gp.email_address , dt.name AS department_name , ft.name AS faculty_name , dt.department_id AS department , dt.faculty_id AS faculty ,

									(SELECT row_to_json(users)

										FROM (SELECT u.user_id AS _id , matriculation_number , identity_number , ll.name AS level

											FROM USERS AS u

											INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id

											WHERE u.user_id = gp.user_id) AS users ) AS author ,

									ps.word AS status , pt.name AS payment_type , pses.amount AS amount , pses.name AS payment_session

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.payment_type_id = gp.payment_type_id AND pt.slug = $2

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = gp.payment_session_id

									INNER JOIN DEPARTMENT AS dt ON dt.department_id = gp.department_id

									INNER JOIN FACULTY AS ft ON ft.faculty_id = gp.faculty_id

									WHERE gp.slug = $1
									
									LIMIT 1
								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT p.payment_id AS _id , p.slug , p.user_id AS author , p.payment_type_id AS payment_type , p.status_id , ps.word AS status , grs1.word AS status1

									FROM GENERAL_PAYMENT AS p

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = p.status_id

									INNER JOIN PAYMENT_STATUS AS grs1 ON grs1.payment_status_id = ${b.status}

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $2 AND pt.payment_type_id = p.payment_type_id

									WHERE p.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE PAYMENT AS p

									SET status_id = $$${b.status}$$ , handler_id = $$${b.author}$$

									FROM PAYMENT_STATUS AS ps 

									WHERE p.slug = $$${opts.entry.slug}$$ AND ps.payment_status_id = $$${opts.entry.status_id}$$

									RETURNING (

									SELECT json_build_object('status' , (SELECT word FROM PAYMENT_STATUS AS ps WHERE ps.payment_status_id = ${b.status} ) ,

																						'author' , (SELECT row_to_json(u) AS user FROM (SELECT email_address FROM USERS AS u WHERE u.user_id = 1) AS u ) )
									
									) AS result

								`;

		return query;

	} ,

	'entryUpdateStatusSuccess$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE GENERAL_PAYMENT AS gp

									SET status_id = ps.payment_status_id

									FROM PAYMENT_STATUS AS ps , PAYMENT_TYPE AS pt

									WHERE gp.payment_reference = $1 AND ps.name = 'success' AND gp.payment_type_id = pt.payment_type_id

									RETURNING gp.slug , gp.payment_reference , gp.general_payment_id AS _id , gp.email_address , pt.name AS payment_type

								`;

		return query;

	} ,

	'entryUpdateStatusFailed$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE GENERAL_PAYMENT AS gp

									SET status_id = ps.payment_status_id

									FROM PAYMENT_STATUS AS ps , PAYMENT_TYPE AS pt

									WHERE gp.payment_reference = $1 AND ps.name = 'failed' AND gp.payment_type_id = pt.payment_type_id

									RETURNING gp.slug , gp.payment_reference , gp.general_payment_id AS _id , gp.email_address , pt.name AS payment_type

								`;

		return query;

	} ,

	'entryRefundCheck' : (req , res , opts) => {

		let query = `SELECT gp.general_payment_id AS _id , gp.payment_reference , gp.payment_type_id AS payment_type , gp.slug ,

									gp.department_id AS department , gp.faculty_id AS faculty , pses.amount , ps.word AS status

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = gp.status_id

									INNER JOIN PAYMENT_SESSION AS pses ON pses.payment_session_id = gp.payment_session_id

									WHERE gp.slug = $1 AND ps.word = 'Success'

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdateRefund$' : (req , res , opts) => {

		let b = req.body;

		let query = `UPDATE GENERAL_PAYMENT AS gp

									SET status_id = ps.payment_status_id

									FROM PAYMENT_STATUS AS ps

									WHERE gp.payment_reference = $1 AND ps.word = 'Refunded'

									RETURNING gp.slug , gp.general_payment_id AS _id

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT gp.slug , gp.general_payment_id AS _id

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $2 AND pt.payment_type_id = gp.payment_type_id

									WHERE gp.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_PAYMENT AS gp

									USING PAYMENT_TYPE AS pt

									WHERE gp.slug = $1 AND pt.slug = $2 AND pt.payment_type_id = gp.payment_type_id

									RETURNING gp.payment_reference , gp.payment_type_id AS payment_type , gp.slug

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM GENERAL_PAYMENT AS gp

									USING PAYMENT_TYPE AS pt

									WHERE payment_no IN (${et}) AND pt.slug = $1 AND pt.payment_type_id = gp.payment_type_id

									RETURNING gp.slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT gp.slug

									FROM GENERAL_PAYMENT AS gp

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $1 AND pt.payment_type_id = gp.payment_type_id

									WHERE gp.slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE

									FROM GENERAL_PAYMENT AS gp

									USING PAYMENT_TYPE AS pt

									WHERE pt.slug = $1 AND pt.payment_type_id = gp.payment_type_id
								
								`;

		return query;

	} ,

	'isPaymentRefunded' : (req , res , next) => {

		let query = `SELECT payment_id AS _id , p.slug , ps.word AS status , d.name AS department , f.name AS faculty

									FROM GENERAL_PAYMENT AS p

									INNER JOIN PAYMENT_TYPE AS pt ON pt.slug = $2 AND pt.payment_type_id = p.payment_type_id

									INNER JOIN PAYMENT_STATUS AS ps ON ps.payment_status_id = p.status_id

									INNER JOIN DEPARTMENT AS d ON d.department_id = p.department_id

									INNER JOIN FACULTY AS d ON f.faculty_id = p.faculty_id

									WHERE p.slug = $1

								`;

		return query;


	}

}