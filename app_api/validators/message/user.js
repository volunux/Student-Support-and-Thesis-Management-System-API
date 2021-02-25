let messages = {

			'first_name' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 20 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'last_name' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 20 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'username' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 20 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'password' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 8 character in length.' ,

																	'max' : 'cannot be greater than 30 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'new_password' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 30 characters in length.' ,

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

			'about' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : { 'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 300 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

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

			'level' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'country' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'role' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'unit' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	}	,

			'status' : {

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