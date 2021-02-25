let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'GeneralRequestComment' ,

	'second' : 'General Request Comment' ,

	'third' : 'general-request-comment' ,

	'fourth' : 'generalRequestComment' ,

	'fifth' : 'GeneralRequestComment' ,

	'query' : 'general-request-comment' ,

	'word' : 'General Request Comment' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let paramProcessor = require('../../utility/parameter-processors');



router
			.route('/entries')

			.get(gctrl.entries);


router.route('/entry/:entry/exists')

			.get(gctrl.entryExists);


router.route('/entry/:entry/detail')

			.get(gctrl.entryDetail);


router.route('/entry/:entry/delete')

			.get(gctrl.entryDelete)

			.delete(gctrl.entryDelete$);


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