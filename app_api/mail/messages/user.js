module.exports = {

	'create' : (req , res , next) => {

		let b = req.body;

				return { 'message' : `Your account at ${req.host} is created and ready for use. Your username is ${b.username}.

								Thank you for using our services.` ,

								'title' : `Account Creation` }
	} ,

	'create2' : (req , res , next) => {

		let b = req.body;

		return {
							'message' : `You are receiving this because you have been added as a user and a member of the system.

							Your email address is ${b.email_address} and password is ${b.password}

							Please kindly click on the following link , or copy and paste this into your browser to start using the system:

							http://${req.headers.host}/sign-in ` ,

							'title' : `Account Creation` }

	} ,

	'forgotPassword' : (req , res , next , token) => {

		let b = req.body;

		return {
							'message' : `<h1> <strong>Account Recovery</strong> </h1>
                
                <p> Hello , </p>
                
                <p> You are receiving this because you (or someone else) have requested the reset of the password for your account.
                
                    Please click on the following link, or paste this into your browser to complete the process: </p>
                
                <br/>

                <p> 

                <a style ='display:block;width:100%;padding=0% 2.9340879234504911474798498165083%;color:#a0a7a0;background-color:#290140' 
                  href ='http://${req.headers.host}/reset/${token}'> Recover Account Password </a> </p>

                <p> If you did not request this, please ignore this email and your password will remain unchanged.</p> ` ,

							'title' : `Password Reset Notification` }	} ,

	'successfulReset' : (req , res , next , user) => {

		let b = req.body;

		let u = user;

		return {
							'message' : `Hello , \n 

							This is a confirmation that the password for your account ${u.email_address} has just been successfully changed and now you can sign in to continue using the system.` ,

							'title' : `Account Recovery Status` }

	} ,

	'passwordUpdate' : (req , res , next) => {

		let b = req.body;

		return {
							'message' : `You are receiving this because you have updated your account and profile password.
							
							Please kindly click on the following link , or paste this into your browser to continue using the system:
							
							http://${req.headers.host}/login ` ,

							'title' : `Account Password Successfully Updated` }

	} ,

}