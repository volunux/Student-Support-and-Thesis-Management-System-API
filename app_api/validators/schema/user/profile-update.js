let joi = require('joi');

let user = require('../../field/user');

let entrySchema = joi.object().keys({

	'first_name' : user.general.first_name ,

	'last_name' : user.general.last_name ,

	'country' : user.general.country ,

	'level' : user.general.level ,

	'about' : user.general.about

 });

module.exports = {

	'validator' : entrySchema
}

