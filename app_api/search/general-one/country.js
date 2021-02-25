let privilege = {

	'super' : ['moderator' , 'administrator' , 'superAdministrator']

};

module.exports = {

		'status' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let status = ('' + req.query.status).toLowerCase();

				query.condition.one = `WHERE gs.name = '${status}'`;
			
			}

			return query;

		} ,

		'name' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.name) { let name = req.query.name;

				query.condition.one = `WHERE ct.name LIKE '%${name}%'`; }

			return query;
	
		} ,

		'abbreviation' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.abbreviation) { let abbreviation = ('' + req.query.abbreviation).toUpperCase().split(' ').join('');

				query.condition.one = `WHERE ct.abbreviation LIKE '%${abbreviation}%'`; }

			return query;
	
		} ,

}