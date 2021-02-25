let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({

	...generalOne.general , 

	'unit' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Unit') });

module.exports = {

	'validator' : entrySchema
}

