let joi = require('joi');

let generalOne = require('./general-one');

module.exports = {

	'general' : {

	'name' : generalOne.general.name ,

	'slug' : generalOne.general.slug ,

	'author' : generalOne.general.author ,

	'status' : generalOne.general.status ,

	'description' : joi.string()

							.min(10)

							.max(250)

							.optional()

							.label('Description') ,

	'word' : joi.string()

							.min(3)

							.max(20)

							.required()

							.label('Word') ,

	'other_name' : joi.string()

							.min(1)

							.max(20)

							.optional()

							.label('Other Name') ,

	'title' : joi.string()

							.min(1)

							.max(150)

							.optional()

							.label('Title') ,

		}

}