let joi = require('joi');

let generalOne = require('../../field/general-one');

let fieldsX = ['name' , 'abbreviation' , 'description' , 'status'];

fieldsX.forEach((item) => { if (generalOne.general[item]) delete generalOne.general[item]; });

let entrySchema = joi.object().keys({

	...generalOne.general , 

	'text' : joi.string()

							.min(1)

							.max(500)

							.required()

							.label('Text') ,

	'status' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Status')

						});

module.exports = {

	'validator' : entrySchema
}