let joi = require('joi');

let generalOne = require('../field/general-one');

let entrySchema = joi.object().keys({ 

	'author' : generalOne.general.author ,

	'entries' : joi.array()

							.required()

							.items(joi.number() , joi.string())

							.label('Entries')

						});

module.exports = {

	'validator' : entrySchema
}