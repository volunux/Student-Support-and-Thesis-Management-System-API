let joi = require('joi');

let $g$k = require('../../field/general-one');

let entrySchema = joi.object().keys({

	'message' : joi.string()

							.min(1)

							.max(1000)

							.required()

							.label('Message') ,

	'request_type' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Request Type') ,

	'unit' : joi.number()

							.min(1)

							.max(900000000)

							.required()

							.label('Unit')

						});

module.exports = {

	'validator' : entrySchema
}