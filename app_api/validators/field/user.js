let joi = require('joi');

module.exports = {

	'general' : {

	'first_name' : joi.string()

							.min(1)

							.max(20)

							.required()

							.label('First Name') ,

	'last_name' : joi.string()

							.min(1)

							.max(20)

							.required()

							.label('Last Name') ,

	'username' : joi.string()

							.min(1)

							.max(20)

							.required()

							.label('Username') ,

	'email_address' : joi.string()

							.min(1)

							.max(50)

							.required()

							.label('Email Address') ,

	'password' : joi.string()

							.min(8)

							.max(30)

							.required()

							.label('Password') ,

	'about' : joi.string()

							.min(1)

							.max(300)

							.required()

							.label('About') ,

	'department' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Department') , 

	'faculty' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Faculty') ,

	'country' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Country') ,

	'level' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Level') 

}	}

