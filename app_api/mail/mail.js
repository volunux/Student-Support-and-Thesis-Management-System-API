let fs = require('fs') , mailer = require('nodemailer') , mailMessages = require('./mail-messages');

module.exports = {

	'entryReview' : (req , res , next , user , title , message , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password }	,

		'tls' : { 'rejectUnauthorized' : false }

});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : title ,

		'text' : message };

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

} ,

	'entryFulfilled' : (req , res , next , user , title , message , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password }	,

		'tls' : { 'rejectUnauthorized' : false }

});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : title ,

		'text' : message };

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

} ,

	'entryRejected' : (req , res , next , user , title , message , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password }	,

		'tls' : { 'rejectUnauthorized' : false }

});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : title ,

		'text' : message };

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

} ,


	'forgotPassword' : (req , res , next , token , user , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password
		}	,

		'tls' : {

				'rejectUnauthorized' : false
		}
});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : 'Password Reset Notification' ,

		'html' : mailMessages.passwordReset(req , token) };

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

},

	'successfulReset' : (req , res , next , user , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password
		}	,

		'tls' : {

				'rejectUnauthorized' : false
		}
});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : 'Password Reset Success' ,

		'text' : `Hello , \n 

							This is a confirmation that the password for your account ${user.email_address} has just been successfully changed and now you can sign in to continue using the system.` 	};

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

},

	'userAdd' : (req , res , next , user) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password }	,

		'tls' : { 'rejectUnauthorized' : false }

	});

	const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : 'Account Created Successfully' ,

		'text' : `You are receiving this because you have been added as a user and a member of the system.

							Your email address is ${user.email_address} and password is ${user.password}

							Please kindly click on the following link , or copy and paste this into your browser to start using the system:

							http://${req.headers.host}/login ` };

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

} ,

	'passwordUpdate' : (req , res , next , user , done) => {

let transporter = mailer.createTransport({

		'service' : 'gmail' ,

		'host' : 'smtp.gmail.com',

		'port' : 465 ,

		'auth' : {

				'user' : process.env.email_address ,

				'pass' : process.env.password }	,

		'tls' : { 'rejectUnauthorized' : false }

});

const mailOptions = {

		'from' : process.env.email_address ,

		'to' : user != null && user.email_address ? user.email_address : 'david@gmail.com',

		'subject' : 'Account Password Successfully Updated' ,

		'text' : `You are receiving this because you have updated your account and profile password.
							
							Please kindly click on the following link , or paste this into your browser to continue using the system:
							
							http://${req.headers.host}/login ` 		};

try {

transporter.sendMail(mailOptions , (err , entryResult) => {

		if (err) { console.log(err); }

		if (entryResult) { console.log(entryResult); }	});	}

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

} ,

}