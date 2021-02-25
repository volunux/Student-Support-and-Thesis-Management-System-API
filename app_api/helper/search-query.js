let config = require('./response') , async = require('async') , mongoose = require('mongoose') , User = mongoose.model('User');

let removeSearchFields = (req , query) => { for (var field in query) { if (field != 'page') {	delete req['query'][field];	}		}	 };

module.exports = {

		'GRUser' : (req , res , next , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (opts.normalPrivilege.indexOf(req.user.role) > -1) {

				query.one = `AND user_id = ${req.user._id}`; }

				return query;

		} ,

		'GRStatus' : (req , res , next , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

				if (opts.normalPrivilege.indexOf(req.user.role) > -1 && req.query.status) { let status = ('' + req.query.status).toLowerCase();

					query.join.one = `INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id`;

					query.condition.two = ` AND grs.name = ${req.query.status}`;

					query.condition.three ` AND gr.user_id = ${req.user._id}`;	}
				
				else if (req.query.status) {

					query.join.one = ` INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id`;

					query.condition.two = ` AND grs.name = ${req.query.status}`; }

				else if (req.user.role == 'staff') {

					query.join.one = `INNER JOIN GENERAL_REQUEST_STATUS AS grs ON grs.general_request_status_id = gr.status_id`;

					query.condition.two = ` AND grs.name = ${req.query.status}`; 

					query.condition.four = ` AND gr.unit_id = ${req.user.unit}`; }

			return query;

		} ,

		'searchByAppNumber' : (req , res , next , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

				if (opts.normalPrivilege.indexOf(req.user.role) > -1 && req.query.application_number) {

					query.condition.two = ` AND gr.application_number = ${req.query.application_number}`;

					query.condition.three ` AND gr.user_id = ${req.user._id}`; }
				
				else if (opts.superPrivilege.indexOf(req.user.role) > -1 && req.query.application_number) { 

					query.condition.two = ` AND gr.application_number = ${req.query.application_number}`;

					delete req.body.queryByUnit;	}

				else if (req.user.role) {

					query.condition.two = ` AND gr.application_number = ${req.query.application_number}`;

					query.condition.four = ` AND gr.unit_id = ${req.user.unit}`; }
		} ,

		'searchRefundByAppNumber' : (req , res , next) => {

				if (req.user.role == 'dean' && req.query.applicationNumber) { req.body.searchQueryType = { 'applicationNumber' : req.query.applicationNumber , 'faculty' : req.user.faculty }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'hod' && req.query.applicationNumber) { req.body.searchQueryType = { 'applicationNumber' : req.query.applicationNumber , 'department' : req.user.department	};	

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'student' && req.query.applicationNumber) { req.body.searchQueryType = { 'applicationNumber' : req.query.applicationNumber , 'author' : req.user._id }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.query.applicationNumber) { req.body.searchQueryType = {'applicationNumber' : req.query.applicationNumber }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

 				return next();
		} ,

		'searchRefundByStatus' : (req , res , next) => {

				if (req.user.role == 'dean' && req.query.status) { req.body.searchQueryType = { 'faculty' : req.user.faculty , 'status' : req.query.status }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'hod' && req.query.status) { req.body.searchQueryType = { 'department' : req.user.department , 'status' : req.query.status };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'student' && req.query.status) { req.body.searchQueryType = { 'author' : req.user._id	, 'status' : req.query.status }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.query.applicationNumber) { req.body.searchQueryType = {'status' : req.query.status }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

 				return next();
		} ,

		'searchRefundByFaculty' : (req , res , next) => {

				if (req.user.role == 'dean' && req.query.faculty) { req.body.searchQueryType = { 'faculty' : req.user.faculty }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'hod' && req.query.faculty) { req.body.searchQueryType = { 'faculty' : req.user.faculty};	

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'student' && req.query.faculty) { req.body.searchQueryType = { 'author' : req.user._id	, 'faculty' : req.query.faculty }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.query.applicationNumber) { req.body.searchQueryType = {'faculty' : req.query.faculty }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

 				return next();
		} ,

		'searchRefundByDepartment' : (req , res , next) => {

				if (req.user.role == 'dean' && req.query.department) { req.body.searchQueryType = { 'faculty' : req.user.faculty }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'hod' && req.query.department) { req.body.searchQueryType = { 'department' : req.user.department};	

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'student' && req.query.department) { req.body.searchQueryType = { 'author' : req.user._id	, 'department' : req.query.department }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.query.applicationNumber) { req.body.searchQueryType = {'department' : req.query.department }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

 				return next();
		} ,

		'searchRefundByStage' : (req , res , next) => {

				if (req.user.role == 'dean' && req.query.stage) { req.body.searchQueryType = { 'faculty' : req.user.faculty , 'stage' : req.query.stage}; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'hod' && req.query.stage) { req.body.searchQueryType = { 'department' : req.user.department , 'stage' : req.query.stage};	

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.user.role == 'student' && req.query.stage) { req.body.searchQueryType = { 'author' : req.user._id , 'stage' : req.query.stage }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

				else if (req.query.applicationNumber) { req.body.searchQueryType = { 'stage' : req.query.stage }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByRole;	}

 				return next();
		} ,

		'searchPaymentByType' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) <= 1 && (req.query.paymentType || req.query.department)) && queryType == 'Department') {

				req.body.searchQueryType = {'paymentType' : 'department' , 'department' : req.user.department };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && (req.query.paymentType || req.query.department)) {

				req.body.searchQueryType = {'paymentType' : 'department' };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && (req.query.paymentType || req.query.department || req.query.faculty)) {

				req.body.searchQueryType = {'paymentType' : 'department' , 'faculty' : req.user.faculty };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && (req.query.paymentType || req.query.faculty)) {

				req.body.searchQueryType = {'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && (req.query.paymentType || req.query.faculty)) {

				req.body.searchQueryType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Department' && (req.query.paymentType || req.query.department)) {

				req.body.searchQueryType = { 'author' : req.user._id , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Faculty' && (req.query.paymentType || req.query.faculty)) {

				req.body.searchQueryType = { 'author' : req.user._id , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchDeptPaymentByReference' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.paymentReference) && queryType == 'Department') {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.paymentReference) && queryType == 'Department') {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'department' : req.user.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'author' : req.user._id , 'paymentReference' : req.query.paymentReference , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'department' : req.user.department , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchFactPaymentByReference' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.paymentReference) && queryType == 'Faculty') {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.paymentReference) && queryType == 'Faculty') {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'department' : req.user.department , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'author' : req.user._id , 'paymentReference' : req.query.paymentReference , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'department' : req.user.department , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchPaymentByReference' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) <= 1 && req.query.paymentReference) && queryType == 'Department') {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'department' : req.user.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = {'paymentReference' : req.query.paymentReference , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Department' && req.query.paymentReference) {

				req.body.searchQueryType = {'author' : req.user._id , 'paymentReference' : req.query.paymentReference , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Faculty' && req.query.paymentReference) {

				req.body.searchQueryType = { 'author' : req.user._id , 'paymentReference' : req.query.paymentReference ,'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchDeptPaymentByDepartment' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.department) && queryType == 'Department') {

				req.body.searchQueryType = {'department' : req.query.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.department) && queryType == 'Department') {

				req.body.searchQueryType = {'department' : req.user.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'faculty' : req.user.faculty , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Department' && req.query.department) {

				req.body.searchQueryType = {'author' : req.user._id , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Department' && req.query.department) {

				req.body.searchQueryType = {'department' : req.user.department , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Department' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'faculty' : req.user.faculty , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchFactPaymentByDepartment' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.department) && queryType == 'Faculty') {

				req.body.searchQueryType = {'department' : req.query.department , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.department) && queryType == 'Faculty') {

				req.body.searchQueryType = {'department' : req.user.department , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Faculty' && req.query.department) {

				req.body.searchQueryType = {'author' : req.user._id , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Faculty' && req.query.department) {

				req.body.searchQueryType = {'department' : req.user.department , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Faculty' && req.query.department) {

				req.body.searchQueryType = {'department' : req.query.department , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchDeptPaymentByStatus' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.status) && queryType == 'Department') {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.status) && queryType == 'Department') {

				req.body.searchQueryType = {'status' : req.query.status , 'department' : req.user.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'author' : req.user._id , 'status' : req.query.status , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'department' : req.user.department , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchFactPaymentByStatus' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) < 1 && req.query.status) && queryType == 'Faculty') {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			if ((otherPrivilege.indexOf(req.user.role) > 0 && otherPrivilege.indexOf(req.user.role) < 2 && req.query.status) && queryType == 'Faculty') {

				req.body.searchQueryType = {'status' : req.query.status , 'department' : req.user.department , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'author' : req.user._id , 'status' : req.query.status , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'department' : req.user.department , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

		'searchPaymentByStatus' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {	return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) <= 1 && req.query.status) && queryType == 'Department') {

				req.body.searchQueryType = {'status' : req.query.status , 'department' : req.user.department , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'department' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = {'status' : req.query.status , 'faculty' : req.user.faculty , 'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);

					delete req.body.queryByType;	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Department' && req.query.status) {

				req.body.searchQueryType = {'author' : req.user._id , 'status' : req.query.status , 'paymentType' : 'department' }; 

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			else if (normalPrivilege.indexOf(req.user.role) > -1 && queryType == 'Faculty' && req.query.status) {

				req.body.searchQueryType = { 'author' : req.user._id , 'status' : req.query.status ,'paymentType' : 'faculty' };	

					removeSearchFields(req , req.query);	

					delete req.body.queryByType;	}

			return next();

		} } ,

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
		} ,

		'userSearch' : (req , res , next) => { let qualifiedFields = ['emailAddress' , 'firstName' , 'lastName' , 'department' , 'faculty' , 'level' , 'identityNumber' , 'role' , 'status'];

			req.body.finalQuery = {};

				if (req.query && req.query.firstName && req.query.lastName) { req.body.finalQuery = {'firstName' : req.query.firstName , 'lastName' : req.query.lastName}	

						removeSearchFields(req , req.query);	}

			for (var i in req.query) {

					if (qualifiedFields.indexOf(i) > -1 && req.query[i]) {

							req.body.finalQuery[i] = req.query[i];

							break;	}	} 

			for (var j in req.query) {

					if (qualifiedFields.indexOf(j) < 0) {	removeSearchFields(req , req.query);

						req.body.finalQuery = {};

						break;	}	} 

					return next();
		} ,

		'userSearch2' : (req , res , next) => { let qualifiedFields = ['emailAddress' , 'firstName' , 'lastName' , 'department' , 'faculty' , 'level' , 'identityNumber' , 'role' , 'status'];

			req.body.finalQuery = {};

				if (req.query && req.query.firstName && req.query.lastName) { req.body.finalQuery = {'firstName' : req.query.firstName , 'lastName' : req.query.lastName , 'status' : 'pending'};

						removeSearchFields(req , req.query);	}

			for (var i in req.query) {

					if (qualifiedFields.indexOf(i) > -1 && req.query[i]) {

							req.body.finalQuery[i] = req.query[i];

							break;	}	} 

			for (var j in req.query) {

					if (qualifiedFields.indexOf(j) < 0) {	removeSearchFields(req , req.query);

						req.body.finalQuery = {'status' : 'pending'};

						break;	}	} 

						req.body.finalQuery['status'] = 'pending';

					return next();
		} ,

		'finalRequestQuery' : (req , res , next) => {

				req.body.finalQuery = {...req.body.queryByUnit , ...req.query , ...req.body.searchQueryType};

					return next();
		} ,

		'finalRequestSearchQueryFilter' : (req , res , next) => { let $filters = ['page' , 'applicationNumber' , 'status' , 'requestType'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'finalRefundSearchQueryFilter' : (req , res , next) => { let $filters = ['page' , 'applicationNumber' , 'department' , 'faculty' ,  'status' , 'stage'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'finalRefundQuery' : (req , res , next) => {

				req.body.finalQuery = {...req.body.queryByRole , ...req.query , ...req.body.searchQueryType};

					return next();
		} ,


		'finalPaymentSearchQueryFilter' : (req , res , next) => { let $filters = ['page' , 'paymentReference' , 'department' , 'status'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'finalPaymentQuery' : (req , res , next) => {

				req.body.finalQuery = {...req.body.queryByType , ...req.query , ...req.body.searchQueryType};

					return next();
		} ,

		'finalSearchQueryFilter1' : (req , res , next) => { let $filters = ['page' , '_id' , 'shortCode' , 'createdAt'];

			let searchInvalid = false;

			if (Object.keys(req.query).length > 0) {

			for (let entry in req.query) {

				if ($filters.indexOf(entry) < 0) { req.query = {};

					searchInvalid = true;

					break;	}	}	}

					if (searchInvalid) { return config.response(res , 404 , {'message' : `This is an invalid search query and no entries will be available.`});	}

					else { return next();	}
		} ,

		'finalSearchQueryFilter2' : (req , res , next) => { let $filters = ['page' , '_id' , 'createdAt'];

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