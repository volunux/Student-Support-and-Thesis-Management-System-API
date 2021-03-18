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

								LIMIT 1

								`;

		return query;

	} ,

	'entryWriteLetter' : (req , res , opts) => {

		let u = req.user;

		let query = `SELECT rf.slug , grs.word AS status , rf.status_id AS other_status_id , rf.stage_id AS stage ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name

											FROM USERS AS u 

											WHERE u.user_id = rf.user_id LIMIT 1) AS u ) AS author ,

									(SELECT row_to_json(lt)

										FROM (SELECT lt.refund_letter_id AS _id , lt.slug AS slug

											FROM REFUND_LETTER AS lt

											WHERE lt.entry_id = rf.refund_id) AS lt

											LIMIT 1) AS letter

									FROM REFUND AS rf

									INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = rf.status_id

									WHERE rf.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryLetter' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT rf.application_number , rf.slug , rf.user_id AS author , rf.department_id AS department , rf.faculty_id AS faculty , usig.location AS signature ,

									u.first_name || ' ' || u.last_name AS full_name ,

									(SELECT row_to_json(lt)

										FROM (SELECT lt.refund_letter_id AS _id , lt.slug , lt.main_body

											FROM REFUND_LETTER AS lt

											WHERE lt.entry_id = rf.refund_id LIMIT 1) AS lt ) AS letter

									FROM REFUND AS rf

									LEFT JOIN USER_SIGNATURE AS usig ON usig.user_id = rf.user_id

									INNER JOIN USERS AS u ON u.user_id = rf.user_id

									WHERE rf.slug = $1

									LIMIT 1

								`;

		return query;
	} ,

	'entryLetterSample' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT lt.main_body , lt.slug

									FROM REFUND_LETTER AS lt

									WHERE lt.slug = '1219821salkz'

									LIMIT 1

								`;

		return query;
	} ,

}