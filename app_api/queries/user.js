let crypto = require('crypto-random-string');

let queryBuilder = require('../utility/query-builder');

module.exports = {

	'entryExists' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , slug , true AS exists 

									FROM USERS AS u

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name , u.username , u.email_address ,

									u.about , u.matriculation_number , u.identity_number , u.jamb_registration_number , dt.name AS department , ft.name AS faculty ,

									ct.name AS country , ll.name AS level , rl.name AS role , ut.name AS unit , us.word AS status , up.location AS profile_photo , usig.location AS signature

									FROM USERS AS u

									LEFT JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id

									LEFT JOIN FACULTY AS ft ON ft.faculty_id = u.faculty_id

									LEFT JOIN COUNTRY AS ct ON ct.country_id = u.country_id

									LEFT JOIN LEVEL AS ll ON ll.level_id = u.level_id 

									LEFT JOIN ROLE AS rl ON rl.role_id = u.role_id

									LEFT JOIN USER_PHOTO AS up ON up.user_id = u.user_id

									LEFT JOIN USER_SIGNATURE AS usig ON usig.user_id = u.user_id

									LEFT JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									LEFT JOIN UNIT AS ut ON ut.unit_id = u.unit_id

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.email_address , u.identity_number , us.word AS status

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.word AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET status_id = us.user_status_id

									FROM USER_STATUS AS us

									WHERE u.user_id = $1 AND us.word = 'Deactivated'

									RETURNING u.user_id AS _id , u.email_address , us.word AS status

								`;

		return query;

	} ,

	'entryReactivate' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.email_address , u.identity_number , us.word AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReactivate$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.word AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReactivate$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET status_id = us.user_status_id

									FROM USER_STATUS AS us

									WHERE u.user_id = $1 AND us.word = 'Active'

									RETURNING u.user_id AS _id , u.email_address , us.word AS status

								`;

		return query;

	} ,

	'entryUpdatePassword$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.email_address , u.hash , u.salt 

									FROM USERS AS u

									WHERE u.user_id = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdatePassword$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET hash = $$${opts.pass.hash}$$ , salt = $$${opts.pass.salt}$$

									WHERE u.user_id = $1

									RETURNING u.email_address , u.user_id AS _id

								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT 

										json_build_object(

											'Level' , (SELECT json_agg(row_to_json(ll)) 

																		FROM (SELECT level_id AS _id , name

																			FROM LEVEL) AS ll ) ,

											'Country' , (SELECT json_agg(row_to_json(ct)) 

																		FROM (SELECT country_id AS _id , name 

																			FROM COUNTRY) AS ct ) ,

											'Faculty' , (SELECT json_agg(row_to_json(ft)) 

																		FROM (SELECT faculty_id AS _id , name 

																			FROM FACULTY) AS ft ) ,

											'Department' , (SELECT json_agg(row_to_json(dt)) 

																		FROM (SELECT department_id AS _id , name 

																			FROM DEPARTMENT) AS dt ) ,

											'User' , (SELECT row_to_json(u) 

																		FROM (SELECT u.first_name , u.last_name , u.about , u.country_id AS country , u.level_id AS level , u.department_id AS department , u.faculty_id AS faculty ,

																					u.matriculation_number , u.jamb_registration_number , u.identity_number

																			FROM USERS AS u

																			WHERE u.user_id = $1

																			LIMIT 1) AS u)

											) AS result

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;
		
		let query1 = ``;

		query1 += b.matriculation_number ? ` , matriculation_number = ${b.matriculation_number} ` : '';

		query1 += b.jamb_registration_number ? ` , jamb_registration_number = ${b.jamb_registration_number} ` : '';

		query1 += b.identity_number ? ` , identity_number = ${b.identity_number}` : '';

		let query = `UPDATE USERS

									SET first_name = $$${b.first_name}$$ , last_name = $$${b.last_name}$$ , faculty_id = $$${b.faculty}$$ , department_id = $$${b.department}$$ , country_id = $$${b.country}$$ ,

									level_id = $$${b.level}$$ , about = $$${b.about}$$ ${query1}

									WHERE user_id = $1

									RETURNING user_id AS _id , first_name , last_name , about

								`;

		return query;

	} ,

	'entryUpdatePhoto$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = queryBuilder.userPhoto(req , res , {'c' : c , 's' : s , '_id' : opts._id});

		let query3 = queryBuilder.update$(b , 'userPhoto');

		query += `ON CONFLICT (user_id)

									DO

											UPDATE SET ${query3}

							WHERE USER_PHOTO.user_id = $1

							RETURNING user_id , slug , location

							`;

			return query;

	} ,

	'entryDeletePhoto$' : (req , res , opts) => {

		let query = `DELETE

									FROM USER_PHOTO AS up

									WHERE up.user_id = $1

									RETURNING key`;

		return query;

	} ,

	'entryUpdateSignature$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = queryBuilder.userSignature(req , res , {'c' : c , 's' : s , '_id' : opts._id});

		let query3 = queryBuilder.update$(b , 'userSignature');

		query += `ON CONFLICT (user_id)

									DO

											UPDATE SET ${query3}

							WHERE USER_SIGNATURE.user_id = $1

							RETURNING user_id , slug , location

							`;

			return query;

	} ,

	'entryDeleteSignature$' : (req , res , opts) => {

		let query = `DELETE

									FROM USER_SIGNATURE AS us

									WHERE us.user_id = $1

									RETURNING key`;

		return query;

	} ,




}