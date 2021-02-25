let messages = {

			'request_type' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} 

}

module.exports = {

	'messages' : messages

}