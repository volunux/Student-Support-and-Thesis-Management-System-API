let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({ 

	'unit' : joi.string()

							.min(1)

							.max(900000000)

							.required()

							.label('Unit') ,

	'author' : generalOne.general.author });

module.exports = {

	'validator' : entrySchema
}

