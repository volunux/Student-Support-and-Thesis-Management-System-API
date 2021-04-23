const privilege = {

	'normal' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'super' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'other' : ['hod' , 'dean' , 'bursar'] ,

	'least' : ['hod' , 'dean']

};

module.exports = {

		'user' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

				return query;

		} ,

		'email_address' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.email_address) { let emailAddress = req.query.email_address;

				 query.condition.one = `WHERE u.email_address = '${emailAddress}'`; 

			}

 				return query;
		} ,

		'identity_number' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.identity_number) { let identityNum = req.query.identity_number;

				 query.condition.one = `WHERE u.identity_number = '${identityNum}'`; 

			}

 				return query;
		} ,

		'status' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let status = ('' + req.query.status).toLowerCase();

				query.condition.one = `WHERE us.name = $$${status}$$`;

			}

 				return query;
		} ,

		'role' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.role) { let role = req.query.role.trim();

					query.condition.one = `WHERE rl.word LIKE '%${role}%'`; }

 				return query;
			 
			 }

}