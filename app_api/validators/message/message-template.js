let messages = {

		'body' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 30 character in length.' ,

														'max' : 'cannot be greater than 3000 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

													'base' : 'should only be of type String.'	}	} ,

			'type' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

		'title' : {

							'any' : { 'required' : 'should be provided and cannot be empty.' } ,

							'string' : {	'min' : 'cannot be less than 3 character in length.' ,

														'max' : 'cannot be greater than 150 characters in length.' ,

														'empty' : 'should be provided and cannot be empty' ,

														'pattern' : 'does not match required pattern' ,

														'base' : 'should only be of type String.'	}	}

}

module.exports = {

	'messages' : messages

}