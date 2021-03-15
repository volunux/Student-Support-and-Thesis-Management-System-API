let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'RequestMessageTemplate' ,

	'second' : 'Request Message Template' ,

	'third' : 'request-message-template' ,

	'fourth' : 'requestMessageTemplate' ,

	'fifth' : 'RequestMessageTemplate' ,

	'query' : 'request-message-template' ,

	'word' : 'Request Message Template' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let validator = require('../../validators/register')(opts);


router
			.route('/entries')

			.get(

				gctrl.entries);


router.route('/entry/:entry/exists')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				gctrl.entryExists);


router.route('/entry/create')

			.get(

				gctrl.entryAdd2)

			.post(

				validator.requestMessageTemplate$ ,

				gctrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(

				gctrl.entryDetail);


router.route('/entry/:entry/update')

			.get(

				gctrl.entryUpdate)

			.put(

				validator.requestMessageTemplate$ ,

				gctrl.entryUpdate$);


router.route('/entry/:entry/delete')

			.get(

				gctrl.entryDelete)

			.delete(

				gctrl.entryDelete$);


router.route('/delete/entry/many')

			.patch(

				gctrl.entryDeleteMany$);


router.route('/delete/entry/all')

			.get(

				gctrl.entryDeleteAll)

			.delete(

				gctrl.entryDeleteAll$);


module.exports = router;