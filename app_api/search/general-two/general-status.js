let privilege = {

	'super' : ['moderator' , 'administrator' , 'superAdministrator']

};

module.exports = {

		'name' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.name) { let name = req.query.name;

				query.condition.one = `WHERE gs.name LIKE '%${name}%'`; }

			return query;
	
		} ,

}