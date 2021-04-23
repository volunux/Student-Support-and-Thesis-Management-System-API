let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({ 

	'title' : joi.string()

							.min(1)

							.max(150)

							.required()

							.label('Title') ,

	'description' : joi.string()

							.min(1)

							.max(250)

							.required()

							.label('Description') ,

	'author' : generalOne.general.author });

module.exports = {

	'validator' : entrySchema
}

