let joi = require('joi');

let user = require('../../field/user');

let entrySchema = joi.object().keys({

	'password' : user.general.password ,

	'new_password' : joi.string()

							.min(1)

							.max(30)

							.required()

							.label('New Password') 
 });

module.exports = {

	'validator' : entrySchema
}

