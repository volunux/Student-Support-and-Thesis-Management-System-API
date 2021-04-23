let joi = require('joi');

module.exports = {

	'general' : {

	'name' : joi.string()

							.min(1)

							.max(150)

							.required()

							.label('Name') ,

	'title' : joi.string()

							.min(1)

							.max(150)

							.optional()

							.label('Title') ,

	'abbreviation' : joi.string()

							.min(2)

							.max(8)

							.required()

							.label('Abbeviation') ,

	'description' : joi.string()

							.min(10)

							.max(250)

							.optional()

							.label('Description') ,

	'slug' : joi.string()

							.min(1)

							.max(30)

							.optional()

							.label('Permalink') ,

	'author' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Author') ,

	'status' : joi.number()

							.min(1)

							.max(900000000)

							.optional()

							.label('Status') ,

		}

}