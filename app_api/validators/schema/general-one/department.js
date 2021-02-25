let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({

	...generalOne.general , 

	'faculty' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Faculty') });

module.exports = {

	'validator' : entrySchema
}

