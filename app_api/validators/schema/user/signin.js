let joi = require('joi');

let user = require('../../field/user');

let entrySchema = joi.object().keys({

	'email_address' : user.general.email_address ,

	'password' : user.general.password

 });

module.exports = {

	'validator' : entrySchema
}

