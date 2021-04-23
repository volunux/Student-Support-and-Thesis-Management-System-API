let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({

	'text' : joi.string()

							.min(1)

							.max(500)

							.required()

							.label('Text') ,

	'author' : generalOne.general.author ,

	'status' : joi.number()

							.min(1)

							.max(900000000)

							.optional()

							.label('Status') 

});

module.exports = {

	'validator' : entrySchema
}