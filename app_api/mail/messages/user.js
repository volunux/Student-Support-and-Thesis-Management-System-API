module.exports = {

	'create' : (req , res , next) => {

		let b = req.body;

				return { 'message' : `Your account at ${req.host} is created and ready for use. Your username is ${b.username} and password is ${b.password}.
							
							Thank you for using our services.` ,

							'title' : `Account Creation` }
	} ,

}