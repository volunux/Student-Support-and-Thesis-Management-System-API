let messages = {

		'body' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 100 character in length.' ,

														'max' : 'cannot be greater than 1000 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

														'base' : 'should only be of type String.'	}	} ,

		'title' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 10 character in length.' ,

														'max' : 'cannot be greater than 200 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

														'base' : 'should only be of type String.'	}	}

}

module.exports = {

	'messages' : messages

}