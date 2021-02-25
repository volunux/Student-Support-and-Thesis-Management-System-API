let $rpd = require('./responder');

module.exports = {

		'entryPublisher' : (req , res , next) => {	req.body.author = req.user._id;
	
			return next(); } ,

		'isOkay' : (req , res , next) => {

			return $rpd.handler(res , 200 , {'message' : `Operation is permitted to all users.`});

		} ,

		'queryByRole' : (req , res , next) => {

				if (req.user.role == 'dean') { req.body.queryByRole = { 'faculty' : req.user.faculty }; }

				else if (req.user.role == 'hod') { req.body.queryByRole = { 'department' : req.user.department	};}

				else if (req.user.role == 'student') { req.body.queryByRole = { 'author' : req.user._id	}; }

				else { req.body.queryByRole = {}; }

 				return next();
		} ,

		'queryByRoleRefunded' : (req , res , next) => {

				if (req.user.role == 'dean') { req.body.queryByRole = { 'faculty' : req.user.faculty , 'refunded' : true }; }

				else if (req.user.role == 'hod') { req.body.queryByRole = { 'department' : req.user.department , 'refunded' : true };}

				else if (req.user.role == 'student') { req.body.queryByRole = { 'author' : req.user._id , 'refunded' : true }; }

				else { req.body.queryByRole = {}; }

 				return next();
		} ,

		'queryByUnit' : (unit , units , normalPrivilege , superPrivilege , modelName) => { return (req , res , next) => {

				if (normalPrivilege.indexOf(req.user.role) > -1) { req.body.queryByUnit = { 'author' : req.user._id	, 'unit' : unit }; }
				
				else if (superPrivilege.indexOf(req.user.role) > -1) { req.body.queryByUnit = { 'unit' : unit };	}

				else if (units.indexOf(req.user.unit) > -1) { req.body.queryByUnit = { 'unit' : unit };	}

				else if (!units.indexOf(req.user.unit) > -1) {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	} 


				return next();	}

		} ,

		'searchQueryType' : (requestType , unit) => { return (req , res , next) => {

			if (req.query && req.query.requestType) {	req.query.requestType = requestType;	}	

				return next();	} 

		} ,

		'queryByType' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {

				return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) <= 1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' };	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' };	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' , 'faculty' : req.user.faculty };	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) &&  queryType == 'Faculty') {

				req.body.queryByType = {'paymentType' : 'faculty' };	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty') {

				req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty };	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Department') {

				req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'department' }; }

			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Faculty') {

				req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'faculty' };	}

			else if ((normalPrivilege.indexOf(req.user.role) > 0) && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Department') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'department' , };	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Department') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'department' };	}

			else if ((normalPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'faculty' };	}

			else if ((otherPrivilege.indexOf(req.user.role) < 2 && superPrivilege.indexOf(req.user.role) < 0) && queryType == 'Faculty') {

				return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		}

			return next();

		} } ,

		'queryPaymentByUnit' : (queryType) => {

				return (req , res , next) => {

			if (req.user.role == 'hod' && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'department' : req.user.department};	}

			if (req.user.role == 'dean' && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'faculty' : req.user.faculty};	}

			if (req.user.role == 'hod' && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'department' : req.user.department };	}

			if (req.user.role == 'dean' && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty };	}

			return next();	} 

		} ,

		'removeFields' : (...fields) => {

			return (req , res , next) => {

				for (let field of fields) {

					if (req['body'][field]) {

						delete req['body'][field];	}	}

				return next(); } 
		} ,

		'removeEmptyFilters' : (req , res , next) => {

			for (let searchEntry in req.body) {

				if (!req.body[searchEntry]) {

					delete req.body[searchEntry];	}	}

				return next();	
		} ,

		'setAccountRole' : (req , res , next) => {

				req.body.role = 'student';

				return next();				
		} ,

		'setNewAccountRoleAndStatus' : (req , res , next) => {

				req.body.role = 'student';

				req.body.status = 'pending';

				return next();				
		} ,

		'queryByTypeRefund' : (queryType , roles) => { return (req , res , next) => {

			if (req.user.role == 'departmentPresident' && queryType == 'Department') {	req.body.queryByType = { 'paymentType' : 'department' , 'department' : req.user.department , 'refunded' : true  }; }

			else if (req.user.role == 'facultyPresident' && queryType == 'Faculty') {	req.body.queryByType = { 'paymentType' : 'faculty' , 'faculty' : req.user.faculty , 'refunded' : true  }; }

			else if ((roles.indexOf(req.user.role) > -1) && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'refunded' : true };	}

			else if ((roles.indexOf(req.user.role) > -1) && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'refunded' : true  };	}
			
			else if (req.user.role == 'student' && queryType == 'Department') {	req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'department' , 'refunded' : true  }; }

			else if (req.user.role == 'student' && queryType == 'Faculty') { req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'faculty' , 'refunded' : true };	}

			return next();	} 

		} ,

		'queryPaymentByUnitRefund' : (queryType) => { return (req , res , next) => {

			if (req.user.role == 'hod' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'department' , 'department' : req.user.department , 'refunded' : true };	}

			if (req.user.role == 'dean' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'department' ,  'faculty' : req.user.faculty , 'refunded' : true };	}

			if (req.user.role == 'hod' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'faculty' , 'department' : req.user.department , 'refunded' : true };	}

			if (req.user.role == 'dean' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty , 'refunded' : true };	}

			return next();	} 

		} ,

}