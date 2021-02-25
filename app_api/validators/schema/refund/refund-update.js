let joi = require('joi');

let generalOne = require('../../field/general-one');


let entrySchema = joi.object().keys({

	'text' : joi.string()

							.min(1)

							.max(500)

							.required()

							.label('Text') ,

	'stage' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Stage') ,

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