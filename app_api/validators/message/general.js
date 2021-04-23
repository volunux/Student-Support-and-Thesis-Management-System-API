let messages = {

			'name' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 150 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'title' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 150 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'abbreviation' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 2 characters in length.' ,

																	'max' : 'cannot be greater than 8 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'word' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 3 character in length.' ,

																	'max' : 'cannot be greater than 20 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'other_name' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 3 character in length.' ,

																	'max' : 'cannot be greater than 20 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'description' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 10 characters in length.' ,

																	'max' : 'cannot be greater than 250 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'slug' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 30 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'faculty' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

			'unit' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'number' : {	'min' : 'cannot be less than number 1.' ,

																	'max' : 'cannot be greater than number 900000000.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type Number.'	}	} ,

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

			'text' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 500 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

			'message' : {

										'any' : { 'required' : 'should be provided and cannot be empty.' } ,

										'string' : {	'min' : 'cannot be less than 1 character in length.' ,

																	'max' : 'cannot be greater than 1000 characters in length.' ,

																	'empty' : 'should be provided and cannot be empty' ,

																	'pattern' : 'does not match required pattern' ,

																	'base' : 'should only be of type String.'	}	} ,

}

module.exports = {

	'messages' : messages

}