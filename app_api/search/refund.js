const privilege = {

	'normal' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'super' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'other' : ['hod' , 'dean' , 'bursar'] ,

	'least' : ['hod' , 'dean']

};

const { v4 : uuidv4 } = require('uuid');

let uuidValidator = require('../helper/uuid-validator');

module.exports = {

		'user' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			let role = req.user.role;

			if (privilege.normal.indexOf(role) > -1) { query.condition.one = `WHERE rf.user_id = $$${req.user._id}$$`; }

			if (role == 'hod') { query.condition.one = `WHERE rf.department_id = $$${req.user.department}$$`; }

			if (role == 'dean') { query.condition.one = `WHERE rf.faculty_id = $$${req.user.faculty}$$`; }

				return query;

		} ,

		'appNumber' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.application_number) { let role = req.user.role , appNumber = req.query.application_number;

				if (uuidValidator.validate(appNumber)) { query.condition.one = ` WHERE rf.application_number = '${appNumber}'`; }

				else { query.condition.one = ` WHERE rf.application_number = '${uuidv4()}'`; }


				if (role == 'dean') { query.condition.two = `AND rf.faculty_id = $$${req.user.faculty}$$`; }

				else if (role == 'hod') { query.condition.two = `AND rf.department_id = $$${req.user.department}$$`; }

				else if (role == 'student') { query.condition.two = `AND rf.user_id = $$${req.user._id}$$`; }	

			}

 				return query;
		} ,

		'status' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let role = req.user.role , status = ('' + req.query.status).toLowerCase();

				query.condition.one = `WHERE grs.name = $$${status}$$`;


				if (role == 'dean') { query.condition.two = ` AND rf.faculty_id = $$${req.user.faculty}$$`; }

				else if (role == 'hod') { query.condition.two = ` AND rf.department_id = $$${req.user.department}$$`; }

				else if (role == 'student') { query.condition.two = ` AND rf.user_id = $$${req.user._id}$$`; }

			}

 				return query;
		} ,

		'faculty' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.faculty) { let role = req.user.role , faculty = req.query.faculty;

				if (role == 'dean' || role == 'hod') { query.condition.one = ` WHERE rf.faculty_id = $$${req.user.faculty}$$`; }

				else if (role == 'student') { query.condition.one = ` WHERE rf.user_id = $$${req.user._id}$$`; }

				else { 

					query.join.one = `INNER JOIN FACULTY AS ft ON ft.faculty_id = rf.faculty_id`;

					query.condition.one = `WHERE ft.name LIKE '%${faculty}%'`; }

			}

 				return query;
		} ,

		'department' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.department) { let role = req.user.role , dept = req.query.department;


				if (role == 'hod') { query.condition.one = `WHERE rf.department_id = $$${req.user.department}$$`; }

				else if (role == 'dean') {

					query.join.one = `INNER JOIN DEPARTMENT AS dt ON dt.department_id = rf.department_id`;

					query.condition.one = ` WHERE rf.faculty_id = $$${req.user.faculty}$$`; 

					query.condition.two = ` AND dt.name LIKE '%${dept}%'`; }

				else if (role == 'student') { query.condition.one = ` WHERE rf.user_id = $$${req.user._id}$$`; }

				else {

					query.join.one = `INNER JOIN DEPARTMENT AS dt ON dt.department_id = rf.department_id`;

					query.condition.one = ` WHERE dt.name LIKE '%${dept}%'`; }

			}

 				return query;
		} ,

		'stage' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.stage) { let role = req.user.role , stage = req.query.stage;

			 	query.condition.one = `WHERE rf.stage_id = $$${stage}$$`;


				if (role == 'dean') { query.condition.two = ` AND rf.faculty_id = $$${req.user.faculty}$$`; }

				else if (role == 'hod') { query.condition.two = ` AND rf.department_id = $$${req.user.department}$$`; }

				else if (role == 'student') { query.condition.two = ` AND rf.user_id = $$${req.user._id}$$`; }

			}

 				return query;
		} ,


}