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

				query.condition.one = `WHERE grs.name = '${status}'`;

			}

			return query;

		} ,

		'appNumber' : (req , res , opts) => {} ,
}