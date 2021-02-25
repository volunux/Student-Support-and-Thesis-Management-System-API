module.exports = {

	'review' : (req , res , next) => {

			return { 'message' : `Your application is currently under review. You will get a feedback or response within 3 working days and you can resend the request if you didn't get any response.
						
						Thank you for using our services.` ,

						'title' : `Refund Application and Request Under Review` }
	} ,

	'rejected' : (req , res , next) => {

			return { 'message' : `Your application for a Refund of Fee Payment has been rejected and is unsuccessful.

						You can resend the request again if you wish to so that your request will be reviewed once again to see if it can be approved and resolved.
						
						Thank you for using our services.` ,

						'title' : `Application and Request Rejected` }
	} ,

	'fulfilled' : (req , res , next) => {

			return { 'message' : `Your application has been successful and your payment that was debited twice mistakenly will be refunded to your bank account in time. Yes, you are free because it has been resolved.
						
						Thank you for using our services.` ,

						'title' : `Refund Request Successfully Resolved` }
	}

}