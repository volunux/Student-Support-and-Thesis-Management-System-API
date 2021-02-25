let joi = require('joi');

let generalOne = require('../../field/general-one');

let entrySchema = joi.object().keys({

	...generalOne.general

});

module.exports = {

	'validator' : entrySchema
}

