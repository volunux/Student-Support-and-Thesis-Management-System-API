module.exports = {

	'rejected' : (req , res , next , entry) => {

				return { 'message' : `Your ${entry.payment_type} payment with reference ${entry.payment_reference} is not successful.
							
							Thank you for using our services.` ,

							'title' : `${entry.payment_type} Fee Payment` }
	} ,

	'fulfilled' : (req , res , next , entry) => {

				return { 'message' : `Your ${entry.payment_type} payment with reference ${entry.payment_reference} is successful.
							
							Thank you for using our services.` ,

							'title' : `${entry.payment_type} Fee Payment` }
	} ,

	'refunded' : (req , res , next , entry) => {

				return { 'message' : `Your ${entry.payment_type} payment with reference ${entry.payment_reference} has been refunded and reversed.
							
							Thank you for using our services.` ,

							'title' : `${entry.payment_type} Fee Payment` }
	}

}