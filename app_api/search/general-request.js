let privilege = {

	'normal' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'super' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'least' : ['hod' , 'dean'] 

};

const { v4 : uuidv4 } = require('uuid');

let uuidValidator = require('../helper/uuid-validator');

module.exports = {

		'user' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (privilege.normal.indexOf(req.user.role) > -1) {

				query.condition.one = `AND gr.user_id = ${req.user._id}`; }

				return query;

		} ,

		'status' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.status) { let status = ('' + req.query.status).toLowerCase();

				query.condition.one = `AND grs.name = '${status}'`; 

				if (privilege.normal.indexOf(req.user.role) > -1) { query.condition.two = ` AND gr.user_id = ${req.user._id}`; }

				else if (req.user.role == 'staff') { query.condition.two = ` AND gr.unit_id = ${req.user.unit}`; }

			}

			return query;

		} ,

		'appNumber' : (req , res , opts) => {

			let query = {'join' : { 'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''} ,

			'condition' : {'one' : '' , 'two' : '' , 'three' : '' , 'four' : ''}};

			if (req.query && req.query.application_number) { let role = req.user.role , appNumber = req.query.application_number;

				if (uuidValidator.validate(appNumber)) { query.condition.one = ` AND gr.application_number = '${appNumber}'`; }

				else { query.condition.one = ` AND gr.application_number = '${uuidv4()}'`; }


				if (privilege.normal.indexOf(req.user.role) > -1) { query.condition.two = ` AND gr.user_id = ${req.user._id}`; }

				else if (req.user.role == 'staff') { query.condition.two = ` AND gr.unit_id = ${req.user.unit}`; } 

			}

			return query;
		} ,
}