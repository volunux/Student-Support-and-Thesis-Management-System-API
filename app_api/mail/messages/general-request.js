module.exports = {

	'review' : (req , res , next) => {

			return { 'message' : `Your application is currently under review. You will get a feedback or response within 3 working days and you can resend the request if you didn't get any response.
						
							Thank you for using our services.` ,

							'title' : `Application and Request Under Review` }
	} ,

	'rejected' : (req , res , next) => {

				return {'message' : `Your application or request has been rejected and is unsuccessful.

							You can resend the request again if you wish to so that your request will be reviewed once again to see if it can be approved and resolved. Thank you for using our services.` ,

							'title' : `Application and Request Status` }
	} ,

	'fulfilled' : (req , res , next) => {

				return {'message' : `Your application has been fulfilled and is successful. Thank you for using our services.` ,

								'title' : `Application and Request Status` }
	}

}