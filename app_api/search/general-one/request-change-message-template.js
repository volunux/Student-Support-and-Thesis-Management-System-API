let privilege = {

	'super' : ['moderator' , 'administrator' , 'superAdministrator']

};

module.exports = {

		'status' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let status = ('' + req.query.status).toLowerCase();

				query.condition.one = `AND gs.name = '${status}'`;
			
			}

			return query;

		} ,

		'title' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.title) { let title = req.query.title;

				query.condition.one = `AND rcmt.title LIKE '%${title}%'`; }

			return query;
	
		} ,
}