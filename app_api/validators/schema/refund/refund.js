let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({ 

	'message' : joi.string()

							.min(1)

							.max(1000)

							.required()

							.label('Message') ,

	'author' : generalOne.general.author 

						});

module.exports = {

	'validator' : entrySchema
}