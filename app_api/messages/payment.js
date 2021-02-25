module.exports = {

	'review' : (req , res , next) => {

				return { 'message' : `Your application is currently under review. You will get a feedback or response within 3 working days and you can resend the request if you didn't get any response.
							
							Thank you for using our services.` ,

							'title' : `Internet Credential Application and Request Under Review` }
	} ,

	'rejected' : (req , res , next , paymentType , paymentRef) => {

				return { 'message' : `Your ${paymentType} payment with reference ${paymentRef.paymentReference} has failed and is not successful.
							
							Thank you for using our services.` ,

							'title' : `Application and Request Rejected` }
	} ,

	'fulfilled' : (req , res , next , paymentType , paymentRef) => {

				return { 'message' : `Your ${paymentType} payment with reference ${paymentRef.paymentReference} is paid and successful.
							
							Thank you for using our services.` ,

							'title' : `Internet Credential Successfully Created` }
	}

}