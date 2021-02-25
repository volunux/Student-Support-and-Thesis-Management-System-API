let express = require('express');

let router = express.Router();

let opts = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'user' ,

	'word' : 'User' ,

	'ut' : 'User Type' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let ectrl = require('../controller/authentication')(opts);

let validator = require('../validators/register')(opts);



router.route('/signup')

			.get(ectrl.signUp)

			.post(

				validator.userSignUp$ ,

				ectrl.signUp$);


router.route('/signin')

			.post(

				validator.userSignIn$ ,

				ectrl.signIn$);


router.route('/signout')

			.get(ectrl.signOut);



module.exports = router;