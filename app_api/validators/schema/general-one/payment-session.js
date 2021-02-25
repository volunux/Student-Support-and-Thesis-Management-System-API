let joi = require('joi');

let generalOne = require('../../field/general-one');

let fieldsX = ['abbreviation' , 'description'];

fieldsX.forEach((item) => { if (generalOne.general[item]) delete generalOne.general[item]; });

let entrySchema = joi.object().keys({ 

...generalOne.general });

module.exports = {

	'validator' : entrySchema
}