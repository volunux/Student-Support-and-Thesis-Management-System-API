let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

const { v4 : uuidv4 } = require('uuid');

module.exports = {

	'entryExists' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , slug , true AS exists 

									FROM USERS AS u

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entries' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , u.slug , u.first_name || ' ' || u.last_name AS full_name , u.user_no AS num , u.email_address , dt.name AS department , ft.name AS faculty , ll.name AS level ,

									u.identity_number , rl.word AS role , us.word AS status

									FROM USERS AS u

									INNER JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id

									INNER JOIN FACULTY AS ft ON ft.faculty_id = u.faculty_id

									INNER JOIN ROLE AS rl ON rl.role_id = u.role_id

									INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									ORDER BY u.updated_on DESC

									LIMIT 11

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

		let hs = opts.$user.setPassword(b.password);

		let query = `INSERT INTO USERS (`;

		query += b.first_name ? `first_name , ` : '';

		query += b.last_name ? `last_name , ` : '';

		query += b.email_address ? `email_address , ` : '';

		query += b.username ? `username , ` : '';

		query += b.about ? `about , ` : '';

		query += b.matriculation_number ? `matriculation_number , ` : '';

		query += b.jamb_registration_number ? `jamb_registration_number , ` : '';

		query += b.identity_number ? `identity_number , ` : '';

		query += b.department ? `department_id , ` : '';

		query += b.faculty ? `faculty_id , ` : '';

		query += b.country ? `country_id , ` : '';

		query += b.level ? `level_id , ` : '';

		query += b.role ? `role_id , ` : '';

		query += b.unit ? `unit_id , ` : '';

		query += b.status ? `status_id , ` : '';

		query += `user_no , slug , hash , salt) `;

		query += ` VALUES (`;

		query += b.first_name ? `$$${b.first_name}$$ , ` : '';

		query += b.last_name ? `$$${b.last_name}$$ , ` : '';

		query += b.email_address ? `$$${b.email_address}$$ , ` : '';

		query += b.username ? `$$${b.username}$$ , ` : '';

		query += b.about ? `$$${b.about}$$ , ` : '';

		query += b.matriculation_number ? `$$${b.matriculation_number}$$ , ` : '';

		query += b.jamb_registration_number ? `$$${b.jamb_registration_number}$$ , ` : '';

		query += b.identity_number ? `$$${b.identity_number}$$ , ` : '';

		query += b.department ? `$$${b.department}$$ , ` : '';

		query += b.faculty ? `$$${b.faculty}$$ , ` : '';

		query += b.country ? `$$${b.country}$$ , ` : '';

		query += b.level ? `$$${b.level}$$ , ` : '';

		query += b.role ? `$$${b.role}$$ , ` : '';

		query += b.unit ? `$$${b.unit}$$ , ` : '';

		query += b.status ? `$$${b.status}$$ , ` : '';

		query += ` ${c} , $$${s}$$ , $$${hs.hash}$$ , $$${hs.salt}$$ ) `;

		return query;

	} ,

	'entryDetail' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.slug , u.first_name , u.last_name , u.email_address ,

									u.about , u.matriculation_number , u.identity_number , u.jamb_registration_number , dt.name AS department , ft.name AS faculty ,

									ct.name AS country , ll.name AS level , rl.word AS role , ut.name AS unit , us.word AS status 

									FROM USERS AS u

									INNER JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id

									INNER JOIN FACULTY AS ft ON ft.faculty_id = u.faculty_id

									INNER JOIN COUNTRY AS ct ON ct.country_id = u.country_id

									INNER JOIN LEVEL AS ll ON ll.level_id = u.level_id 

									INNER JOIN ROLE AS rl ON rl.role_id = u.role_id

									LEFT JOIN UNIT AS ut ON ut.unit_id = u.unit_id

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.word AS status , 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.word AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeactivate$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET status_id = us.user_status_id

									FROM USER_STATUS AS us

									WHERE u.slug = $1 AND us.word = 'Deactivated'

									RETURNING u.email_address , u.user_id AS _id

								`;

		return query;

	} ,

	'entryReactivate' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.word AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReactivate$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , us.name AS status 

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryReactivate$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET status_id = us.user_status_id

									FROM USER_STATUS AS us

									WHERE u.slug = $1 AND us.word = 'Active'

									RETURNING u.email_address , u.user_id AS _id

								`;

		return query;

	} ,

	'entryUpdate' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , u.slug , u.first_name , u.last_name ,

									u.about , u.matriculation_number , u.identity_number , u.jamb_registration_number , u.department_id AS department , u.faculty_id AS faculty ,

									u.country_id AS country , u.level_id AS level , u.role_id AS role , u.unit_id AS unit , u.status_id AS status , us.word AS status_name

									FROM USERS AS u

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryUpdate$' : (req , res , opts) => {

		let b = req.body;

		let query2 = ``;

		query2 += b.first_name ? ` first_name = $$${b.first_name}$$` : '';

		query2 += b.last_name ? ` , last_name = $$${b.last_name}$$` : ''; 

		query2 += b.country ? ` , country_id = $$${b.country}$$` : ''; 

		query2 += b.level ? ` , level_id = $$${b.level}$$` : '';

		query2 += b.role ? ` , role_id = $$${b.role}$$` : ''; 

		query2 += b.unit ? ` , unit_id = $$${b.unit}$$` : '';

		query2 += b.status ? ` , status_id = $$${b.status}$$` : ''; 

		query2 += b.department ? ` , department_id = $$${b.department}$$` : ''; 

		query2 += b.faculty ? ` , faculty_id = $$${b.faculty}$$` : '';

		query2 += b.matriculation_number ? ` , matriculation_number = $$${b.matriculation_number}$$` : ''; 

		query2 += b.jamb_registration_number ? ` , jamb_registration_number = $$${b.jamb_registration_number}$$` : '';

		query2 += b.identity_number ? ` , identity_number = $$${b.identity_number}$$` : ''; 

		let query = `UPDATE USERS AS u

									SET ${query2}

									WHERE u.slug = $1

									RETURNING first_name , last_name , username , email_address , slug

								`;

		return query;

	} ,

	'entryDelete' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , u.slug , u.first_name , u.last_name , u.email_address , u.identity_number , dt.name AS department , rl.name AS role , us.word AS status_name

									FROM USERS AS u

									LEFT JOIN DEPARTMENT AS dt ON dt.department_id = u.department_id

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									INNER JOIN ROLE AS rl ON rl.role_id = u.role_id

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryDelete$' : (req , res , opts) => {

		let query = `DELETE

									FROM USERS AS u

									WHERE u.slug = $1

									RETURNING u.email_address , u.username

								`;

		return query;

	} ,

	'entryDeleteMany$' : (req , res , opts) => {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM USERS AS u

									WHERE user_no IN (${et})

									RETURNING u.slug

								`;

		return query;

	} ,

	'entryDeleteAll' : (req , res , opts) => {

		let query = `SELECT u.slug

									FROM USERS AS u

									WHERE u.slug IS NOT NULL

									LIMIT 1

								`;

		return query;

	} ,

	'entryDeleteAll$' : (req , res , opts) => {

		let query = `DELETE FROM USERS
								
								`;

		return query;

	} ,

	'userStatus$' : (req , res , opts) => {

		let query = `SELECT user_status_id AS _id , word

									FROM USER_STATUS`;

		return query;
	
	} ,

	'role$' : (req , res , opts) => {

		let query = `SELECT role_id AS _id , word

									FROM ROLE`;

		return query;
	
	} ,

	'unit$' : (req , res , opts) => {

		let query = `SELECT unit_id AS _id , name

									FROM UNIT`;

		return query;
	
	} ,

	'country$' : (req , res , opts) => {

		let query = `SELECT country_id AS _id , name

									FROM COUNTRY`;

		return query;
	
	} ,

	'department$' : (req , res , opts) => {

		let query = `SELECT department_id AS _id , name

									FROM DEPARTMENT`;

		return query;
	
	} ,

	'faculty$' : (req , res , opts) => {

		let query = `SELECT faculty_id AS _id , name

									FROM FACULTY`;

		return query;
	
	} ,

	'level$' : (req , res , opts) => {

		let query = `SELECT level_id AS _id , name

									FROM LEVEL`;

		return query;
	
	} ,

	'verifyEmail' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.email_address = $$${b.email_address}$$

									LIMIT 1

								`;

		return query;

	} ,

	'verifyUsername' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.username = $$${b.username}$$

									LIMIT 1

								`;

		return query;

	} 

}