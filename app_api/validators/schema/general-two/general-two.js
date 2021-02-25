let joi = require('joi');

let generalTwo = require('../../field/general-two');

let entrySchema = joi.object().keys({

	...generalTwo.general

});

module.exports = {

	'validator' : entrySchema
}

