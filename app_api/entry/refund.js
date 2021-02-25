let $rpd = require('../helper/responder');

module.exports = {

	'stage' : (req , res , next) => {	let stage = req.body.stage , role = req.user.role;

			if (stage != 2 && stage != 3 && stage != 4 && stage != 5 && stage != 6) {

					return $rpd.handler(res , 400 , {'message' : `You need to provide a valid stage before request can be processed.`});	}

			if (stage == 2 && (role != 'staff' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == 3 && (role != 'bursar' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == 4 && (role != 'student' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == 5 && (role != 'hod' && role != 'dean' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == 6 && (role != 'bursar' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == 6 && !req.body.status) {

					return $rpd.handler(res , 403 , {'message' : `You need to provide a valid status before request can be processed.`});	}

					return next();

			} ,

		'setDepartment' : (req , res , next) => {

			if (req.user) req.body.department = req.user.department;

				return next();
		} ,

		'setFaculty' : (req , res , next) => {

			if (req.user)	req.body.faculty = req.user.faculty;

				return next();
		} ,

}