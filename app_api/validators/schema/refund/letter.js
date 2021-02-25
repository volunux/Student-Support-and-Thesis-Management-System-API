let joi = require('joi');

let generalOne = require('../../field/general-one');


let entrySchema = joi.object().keys({

	'main_body' : joi.string()

							.min(1)

							.max(8000)

							.required()

							.label('Main Body of Letter') ,

	'stage' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Stage') ,

	'author' : generalOne.general.author ,

						});

module.exports = {

	'validator' : entrySchema
}