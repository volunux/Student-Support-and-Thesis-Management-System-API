class AuthenticateRepository {

	entryExists(req , res , opts) {

		let query = `SELECT u.user AS _id , slug , true AS exists 

								FROM USERS AS u

								WHERE u.user_id = $1

								`;

		return query;

	}

	verifyEmail(req , res , opts) {

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.email_address = $1

								`;

		return query;

	}

	verifyUsername(req , res , opts) {

		let query = `SELECT u.user_id AS _id , true AS exists 

									FROM USERS AS u

									WHERE u.username = $1

								`;

		return query;

	} 

}

module.exports = {

	AuthenticateRepository : AuthenticateRepository

}