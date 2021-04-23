let crypto = require('crypto-random-string');

module.exports = {

	'entryExists' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id , slug , true AS exists 

									FROM USERS AS u

									WHERE u.slug = $1

									LIMIT 1

								`;

		return query;

	} ,

	'entryAdd$' : (req , res , opts) => {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO USERS (`;

		query += b.first_name ? `first_name , ` : '';

		query += b.last_name ? `last_name , ` : '';

		query += b.email_address ? `email_address , ` : '';

		query += b.username ? `username , ` : '';

		query += `user_no , slug , hash , salt , faculty_id , department_id ,

							role_id , unit_id , country_id , level_id , status_id) `;

		query += ` VALUES (`;

		query += b.first_name ? `$$${b.first_name}$$ , ` : '';

		query += b.last_name ? `$$${b.last_name}$$ , ` : '';

		query += b.email_address ? `$$${b.email_address}$$ , ` : '';

		query += b.username ? `$$${b.username}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${opts.sec.hash}$$ , $$${opts.sec.salt}$$ , 

							(SELECT faculty_id AS _id FROM FACULTY AS ft WHERE ft.faculty_id = 1 LIMIT 1) ,

							(SELECT department_id AS _id FROM DEPARTMENT AS dt WHERE dt.department_id = 1 LIMIT 1) ,

							(SELECT role_id AS _id FROM ROLE AS rl WHERE rl.word = 'Student' LIMIT 1) ,

							(SELECT unit_id AS _id FROM UNIT AS ut where ut.name = 'Others' LIMIT 1) ,

							(SELECT country_id AS _id FROM COUNTRY AS ct where ct.country_id = 1 LIMIT 1) ,

							(SELECT level_id AS _id FROM LEVEL AS ll where ll.level_id = 1 LIMIT 1) ,

							(SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

							RETURNING user_id AS _id , email_address , username , 'student' AS role , department_id AS department , faculty_id AS faculty , unit_id AS unit , 'pending' AS status`;


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

	'country$' : (req , res , opts) => {

		let query = `SELECT country_id AS _id , name

									FROM COUNTRY

									LIMIT 1`;

		return query;
	
	} ,

	'role$' : (req , res , opts) => {

		let query = `SELECT role_id AS _id , name

									FROM ROLE`;

		return query;
	
	} ,

	'verifyEmail' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.email_address = $1

									LIMIT 1

								`;

		return query;

	} ,

	'verifyUsername' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.username = $1

									LIMIT 1

								`;

		return query;

	} ,

	'verifyEmail2' : () => {

		let query = `SELECT u.user_id AS _id , u.email_address , u.username , u.department_id AS department , u.faculty_id AS faculty , u.unit_id AS unit ,

									u.salt , u.hash , rl.name AS role , us.name AS status 

									FROM USERS AS u

									INNER JOIN ROLE AS rl ON rl.role_id = u.role_id

									INNER JOIN USER_STATUS AS us ON us.user_status_id = u.status_id

									WHERE u.email_address = $1

									LIMIT 1

								`;

		return query;

	} ,

}