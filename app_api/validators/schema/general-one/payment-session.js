let joi = require('joi');

let generalOne = require('../../field/general-one');

let fieldsX = ['abbreviation' , 'description'];

fieldsX.forEach((item) => { if (generalOne.general[item]) delete generalOne.general[item]; });

let entrySchema = joi.object().keys({ 

...generalOne.general ,

	'amount' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Amount') ,

	'entry_type' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Payment Type') });

module.exports = {

	'validator' : entrySchema
}