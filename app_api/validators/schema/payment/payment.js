let joi = require('joi');

let generalOne = require('../../field/general-one');

let fieldsX = ['name' , 'abbreviation' , 'description'];

fieldsX.forEach((item) => { if (generalOne.general[item]) delete generalOne.general[item]; });

let entrySchema = joi.object().keys({...generalOne.general , 

	'full_name' : joi.string()

							.min(1)

							.max(40)

							.required()

							.label('Full Name') ,

	'email_address' : joi.string()

							.min(1)

							.max(50)

							.required()

							.label('Email Address') ,

	'payment_reference' : joi.string()

							.min(1)

							.max(40)

							.required()

							.label('Payment Reference') ,

	'phone_number' : joi.string()

							.min(1)

							.max(22)

							.required()

							.label('Phone Number') ,

	'amount' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Amount') ,

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

	'payment_type' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Payment Type')

						});

module.exports = {

	'validator' : entrySchema
}