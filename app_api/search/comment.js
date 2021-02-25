const privilege = {

	'normal' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'super' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'other' : ['hod' , 'dean' , 'staff'] ,

	'other2' : ['staff' , 'hod' , 'dean' ] ,

	'least' : ['staff' , 'hod' , 'dean'] ,

};

module.exports = {

		'user' : (req , res , next , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (opts.normalPrivilege.indexOf(req.user.role) > -1) { query.one = ` AND user_id = ${req.user._id}`; }

			if (req.user.role == 'hod') { query.one = ` AND department_id = ${req.user.department}`; }

			if (req.user.role == 'dean') { query.one = ` AND faculty_id = ${req.user.faculty}`; }

				return query;

		} ,

		'reference' : (req , res , next) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.payment_reference) { let role = req.user.role , reference = req.query.payment_reference;

				query.condition.one = ` AND p.payment_reference = ${reference}`;


				if (role == 'dean') { query.condition.two = ` AND p.faculty_id = ${req.user.faculty}`; }

				else if (role == 'hod') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

				else if (role == 'student') { query.condition.two = ` AND p.user_id = ${req.user._id}`; }	

			}

 				return query;
		} ,

		'status' : (req , res , next) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let role = req.user.role , status = ('' + req.query.status).toLowerCase();

				query.join.one = `INNER JOIN PAYMENT_STATUS AS grs ON ps.payment_status_id = p.status_id`;

				query.condition.one = ` AND ps.name = ${status}`;


				if (role == 'dean' || role == 'facultyPresident') { query.condition.two = ` AND p.faculty_id = ${req.user.faculty}`; }

				else if (role == 'hod' || role == 'departmentPresident') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

				else if (role == 'student') { query.condition.two = ` AND p.user_id = ${req.user._id}`; }	

			}

 				return query;
		} ,

		'faculty' : (req , res , next) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.faculty) { let role = req.user.role , faculty = req.query.faculty;



				if (role == 'dean' || role == 'hod') { query.condition.one = ` AND p.faculty_id = ${req.user.faculty}`; }

				else if (role == 'student') { query.condition.two = ` AND p.user_id = ${req.user._id}`; }

				else if (role == 'departmentPresident') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

				else { 

					query.join.one = `INNER JOIN FACULTY AS ft ON ft.faculty_id = p.faculty_id`;

					query.condition.one = ` AND ft.name LKE ${faculty}%`; }

			}

 				return query;
		} ,

		'department' : (req , res , next) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.department) { let role = req.user.role , dept = req.query.department;


				if (role == 'hod') { query.condition.one = ` AND p.department_id = ${req.user.department}`; }

				else if (role == 'dean') {

					query.join.one = `INNER JOIN DEPARTMENT AS dt ON dt.department_id = p.department_id`;

					query.condition.one = ` AND p.faculty_id = ${req.user.faculty}`; 

					query.condition.two = ` AND dt.name LKE ${dept}%`;; }

				else if (role == 'student') { query.condition.one = ` AND p.user_id = ${req.user._id}`; }

				else if (role == 'departmentPresident') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

				else {

					query.join.one = `INNER JOIN DEPARTMENT AS dt ON dt.department_id = p.department_id`;

					query.condition.one = ` AND dt.name LKE ${dept}%`; }

			}

 				return query;
		} ,


		'reference' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

		if (req.query && req.query.payment_reference) { let role = req.user.role , reference = req.query.payment_reference;

			query.condition.one = ` AND p.payment_reference = ${reference}`;

			if (role == 'hod') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

			if (role == 'dean') { query.condition.two = ` AND p.faculty_id = ${req.user.faculty}`; }
			
			else if (role == 'student') { query.condition.two = ` AND p.user_id = ${req.user._id}`; }

			else if (role == 'departmentPresident') { query.condition.two = ` AND p.department_id = ${req.user.department}`; }

			else if (role == 'facultyPresident') { query.condition.two = ` AND p.faculty_id = ${req.user.faculty}`; } 

 			}

			return query;

		 } ,

		'commentSearch' : (req , res , next) => { req.body.finalQuery = {};

			if (req.query && req.query.unit && req.query.status) { let unit = req.query.unit , status = req.query.status;

					removeSearchFields(req , req.query);

					req.body.finalQuery.unit = unit;

					req.body.finalQuery.status = status;	}

			if (req.query && req.query.status) { let status = req.query.status;

					removeSearchFields(req , req.query);

					req.body.finalQuery.status = status;	}

			if (req.query && req.query.unit) { let unit = req.query.unit;

					removeSearchFields(req , req.query);

					req.body.finalQuery.unit = unit;	}

			if (req.query && req.query.stage) { let stage = req.query.stage;

					removeSearchFields(req , req.query);

					req.body.finalQuery.stage = stage;	}

			if (req.query && req.query.slug) { let slug = req.query.slug;

					removeSearchFields(req , req.query);

					req.body.finalQuery.slug = slug;	}

			if (req.query && !req.query.unit && !req.query.status && !req.query.stage && !req.query.slug) {

						removeSearchFields(req , req.query);	}

					return next();
		} ,

		'replySearch' : (req , res , next) => { req.body.finalQuery = {};

			if (req.query && req.query.slug) { let slug = req.query.slug;

					removeSearchFields(req , req.query);

					req.body.finalQuery.slug = slug;	}

			if (req.query && req.query.entrySlug) { let entrySlug = req.query.entrySlug;

					removeSearchFields(req , req.query);

					req.body.finalQuery.entrySlug = entrySlug;	}

			if (req.query && !req.query.entrySlug && !req.query.slug) {

						removeSearchFields(req , req.query);	}

					return next();
		} 

}