let express = require('express');

let router = express.Router();

let cUser = require('../helper/confirm-user');

let opts = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'user' ,

	'word' : 'User' ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator']

};


let ectrl = require('../controller/authenticate')(opts);


router.route('/confirm-admin')

			.get( 

				cUser.confirmAdmin([...opts.superPrivilege]));


router.route('/emailaddress/:entry')

			.get( 

				ectrl.verifyEmail);


router.route('/username/:entry')

			.get(

				ectrl.verifyUsername);


router.route('/user/:entry/profile')

			.get(

				ectrl.entryExists);


module.exports = router;