module.exports = {

	'entryforgotPassword$' : (req , res , opts) => {

		let b = req.body;

		let query = `SELECT u.user_id AS _id , u.email_address , u.reset_password_token , reset_password_expires 

									FROM USERS AS u

									WHERE u.email_address = $1

								`;

		return query;

	} ,

	'entryforgotPassword$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET reset_password_token = $1 , reset_password_expires = ${(Date.now() + 3600000)}

									FROM USER_STATUS AS us

									RETURNING u.email_address , u.user_id AS _id

								`;

		return query;

	} ,

	'resetPassword' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id 

									FROM USERS AS u

									WHERE u.reset_password_token = $1 AND u.reset_password_expires > ${Date.now()}

								`;

		return query;

	} ,

	'resetPassword$' : (req , res , opts) => {

		let query = `SELECT u.user_id AS _id

									FROM USERS AS u

									WHERE u.reset_password_token = $1 AND u.reset_password_expires > ${Date.now()}

								`;

		return query;

	} ,

	'resetPassword$s' : (req , res , opts) => {

		let query = `UPDATE USERS AS u

									SET reset_password_token = null , reset_password_expires = null , hash = $$${opts.pass.hash}$$ , salt = $$${opts.pass.salt}

									RETURNING u.email_address , u.user_id AS _id

								`;

		return query;

	} ,

}