let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'GeneralRequestStatus' ,

	'second' : 'General Request Status' ,

	'third' : 'general-request-status' ,

	'fourth' : 'generalRequestStatus' ,

	'fifth' : 'GeneralRequestStatus' ,

	'query' : 'general-request-status' ,

	'word' : 'General Request Status' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let validator = require('../../validators/register')(opts);


router
			.route('/entries')

			.get(gctrl.entries);


router.route('/entry/:entry/exists')

			.get(gctrl.entryExists);


router.route('/entry/create')

			.get(gctrl.entryAdd2)

			.post(

				validator.generalTwo$ ,

				gctrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(gctrl.entryDetail);


router.route('/entry/:entry/update')

			.get(gctrl.entryUpdate)

			.put(

				validator.generalTwo$ ,

				gctrl.entryUpdate$);


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