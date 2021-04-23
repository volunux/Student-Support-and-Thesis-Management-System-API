let messages = {

			'full_name' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 40 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'email_address' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : { 'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 50 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'payment_reference' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 40 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'phone_number' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 22 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'amount' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

			'slug' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 30 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'author' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

			'status' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

			'num' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'department' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'faculty' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'payment_type' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,


			'entry_type' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,
}

module.exports = {

	'messages' : messages

}