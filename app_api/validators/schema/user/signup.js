let joi = require('joi');

let user = require('../../field/user');

let entrySchema = joi.object().keys({

	...user.general , 

	'country' : joi.number()

							.min(1)

							.max(900000000)

							.optional()

							.label('Country') ,

	'level' : joi.number()

							.min(1)

							.max(900000000)

							.optional()

							.label('Level') 

});

module.exports = {

	'validator' : entrySchema
}

