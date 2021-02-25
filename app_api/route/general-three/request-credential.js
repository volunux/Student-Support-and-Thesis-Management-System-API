let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'RequestCredential' ,

	'second' : 'Request Credential' ,

	'third' : 'request-credential' ,

	'fourth' : 'requestCredential' ,

	'fifth' : 'RequestCredential' ,

	'query' : 'request-credential' ,

	'word' : 'Request Credential' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/request-credential')(opts);


router
			.route('/entries')

			.get(gctrl.entries);


router.route('/entry/:entry/exists')

			.get(gctrl.entryExists);


router.route('/entry/create')

			.post(

				ectrl.createCredential);



router.route('/delete/entry/many')

			.patch(gctrl.entryDeleteMany$);



router.route('/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) ,

				gctrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) ,

				gctrl.entryDeleteAll$);


module.exports = router;