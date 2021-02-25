let commons = require('./general');
let generalRequest = require('./general-request');
let refundUpdate = require('./refund-update');
let payment = require('./payment');
let user = require('./user');
let photo = require('./photo');
let deleteEntry = require('./delete-entry');

module.exports = {

	'general' : { ...commons.messages ,

	} ,

	'role' : { ...commons.messages ,

		'description' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 1 character in length.' ,

														'max' : 'cannot be greater than 100 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

														'base' : 'should only be of type String.'	}	} ,
	} ,

	'generalRequest' : { ...commons.messages , ...generalRequest.messages } ,

	'generalRequestUpdate' : { ...commons.messages } ,

	'refund' : { ...commons.messages } ,

	'refundUpdate' : { ...commons.messages , ...refundUpdate.messages } ,

	'refundUpdateLetter' : { ...commons.messages , ...refundUpdate.messages , 

		'main_body' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 100 character in length.' ,

														'max' : 'cannot be greater than 8000 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

														'base' : 'should only be of type String.'	}	} } ,

	'payment' : { ...payment.messages } ,

	'user' : { ...user.messages } ,

	'photo' : { ...photo.messages } ,

	'deleteEntry' : { ...commons.messages , ...deleteEntry.messages } ,

}