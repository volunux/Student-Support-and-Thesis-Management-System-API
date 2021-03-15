module.exports = {

	'requestStatus$' : (req , res , opts) => {

		let query = `SELECT general_request_status_id AS _id , other_name AS name

									FROM GENERAL_REQUEST_STATUS

								`;

		return query;
	
	} ,

	'messageTemplate$' : (req , res , opts) => {

		let query = `SELECT request_message_template_id AS _id , title

									FROM REQUEST_MESSAGE_TEMPLATE

								`;

		return query;
	
	} ,

	'messageTemplateEntryDetail' : (req , res , opts) => {

		let query = `SELECT body

									FROM REQUEST_MESSAGE_TEMPLATE

									WHERE request_message_template_id = $1

								`;

		return query;
	
	} ,


}