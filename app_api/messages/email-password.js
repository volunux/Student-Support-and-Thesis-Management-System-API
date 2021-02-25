module.exports = {

	'review' : (req , res , next) => {

				return { 'message' : `Your application is currently under review. You will get a feedback or response within 3 working days and you can resend the request if you didn't get any response.
							
							Thank you for using our services.` ,

							'title' : `Email Password Application and Request Under Review` }
	} ,

	'rejected' : (req , res , next) => {

				return { 'message' : `Your application for an Email Password to the School E-Portal has been rejected and is unsuccessful.

							You can resend the request again if you wish to so that your request will be reviewed once again to see if it can be approved and resolved.
							
							Thank you for using our services.` ,

							'title' : `Application and Request Rejected` }
	} ,

	'fulfilled' : (req , res , next) => {

				return { 'message' : `Your application has been successfully approved. Your Email Password to the School E-Portal is as follows;

							Password: ${req.body.requestPassword}
							
							Thank you for using our services.` ,

							'title' : `Email Password Successfully Created` }
	}

}