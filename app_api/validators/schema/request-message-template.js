let joi = require('joi');

let generalOne = require('../field/general-one');

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

	'slug' : generalOne.general.slug ,

	'author' : generalOne.general.author 

});

module.exports = {

	'validator' : entrySchema
}

