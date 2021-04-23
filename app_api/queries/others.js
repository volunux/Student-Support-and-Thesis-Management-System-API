module.exports = {

	'requestStatus$' : (req , res , opts) => {

		let query = `SELECT general_request_status_id AS _id , other_name AS name

									FROM GENERAL_REQUEST_STATUS

								`;

		return query;
	
	} ,

	'messageTemplate$' : (req , res , opts) => {

		let query = `SELECT rcmt_id AS _id , title

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE AS rcmt

									WHERE rcmt.user_id = $1

								`;

		return query;
	
	} ,

	'messageTemplateEntryDetail' : (req , res , opts) => {

		let query = `SELECT body

									FROM REQUEST_CHANGE_MESSAGE_TEMPLATE

									WHERE rcmt_id = $1

								`;

		return query;
	
	} ,


}