module.exports = {

		'user' : (req , res , next) => { let qualifiedFields = ['email_address' , 'first_name' , 'last_name' , 'department' , 'faculty' , 'level' , 'identity_number' , 'role' , 'status'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'generalRequest' : (req , res , next) => { let $filters = ['page' , 'application_number' , 'status'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'refund' : (req , res , next) => { let $filters = ['page' , 'application_number' , 'department' , 'faculty' ,  'status' , 'stage'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'payment' : (req , res , next) => { let $filters = ['page' , 'paymentReference' , 'department' , 'status'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'general' : (req , res , next) => { let $filters = ['page' , 'name' , 'abbreviation' , 'created_on'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'general2' : (req , res , next) => { let $filters = ['page' , 'name' , 'abbreviation' , 'created_on'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,


}