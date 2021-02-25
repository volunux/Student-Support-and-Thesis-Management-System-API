let joi = require('joi');

let entrySchema = joi.object().keys({ 

	'location' : joi.string()

							.min(1)

							.max(200)

							.required()

							.label('Location') ,

	'key' : joi.string()

							.min(1)

							.max(200)

							.required()

							.label('Key') 

});

module.exports = {

	'validator' : entrySchema
}

