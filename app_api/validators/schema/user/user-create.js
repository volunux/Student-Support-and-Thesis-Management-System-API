let joi = require('joi');

let user = require('../../field/user');

let entrySchema = joi.object().keys({

	...user.general , 

});

module.exports = {

	'validator' : entrySchema
}

