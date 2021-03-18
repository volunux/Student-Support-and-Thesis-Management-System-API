let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'RequestPassword' ,

	'second' : 'Request Password' ,

	'third' : 'request-password' ,

	'fourth' : 'requestPassword' ,

	'fifth' : 'RequestPassword' ,

	'query' : 'request-password' ,

	'word' : 'Request Password' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/request-password')(opts);


router
			.route('/entries')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				gctrl.entries);


router.route('/entry/:entry/exists')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				gctrl.entryExists);


router.route('/entry/create')

			.post(

				ectrl.createPassword);


router.route('/delete/entry/many')

			.patch(

				cUser.roleType([...opts.superPrivilege]) ,

				gctrl.entryDeleteMany$);



router.route('/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) ,

				gctrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) ,

				gctrl.entryDeleteAll$);


module.exports = router;