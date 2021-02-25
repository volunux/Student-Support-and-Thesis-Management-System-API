let messages = {

			'entries' : {

								'any' : { 'required' : 'should be provided and cannot be empty.' } ,

								'array' : {'includes' : 'should only contain strings or numbers'} ,

								'string' : {	'min' : 'cannot be less than 1 character in length.' ,

															'max' : 'cannot be greater than 200 characters in length.' ,

															'empty' : 'should be provided and cannot be empty' ,

															'pattern' : 'does not match required pattern' ,

															'base' : 'should only be of type String.'	}	} ,

}

module.exports = {

	'messages' : messages

}