let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({ 

	'title' : joi.string()

							.min(1)

							.max(200)

							.required()

							.label('Title') ,

	'body' : joi.string()

							.min(1)

							.max(1000)

							.required()

							.label('Body') ,

	'status' : joi.number()

							.min(1)

							.max(9000000)

							.optional()

							.label('Status') ,

	'entry_type' : joi.number()

							.min(1)

							.max(9000000)

							.required()

							.label('Type') ,


	'author' : generalOne.general.author 

});

module.exports = {

	'validator' : entrySchema
}

