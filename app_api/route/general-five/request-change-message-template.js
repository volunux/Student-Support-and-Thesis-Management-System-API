let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'RequestChangeMessageTemplate' ,

	'second' : 'Request Change Message Template' ,

	'third' : 'request-change-message-template' ,

	'fourth' : 'requestChangeMessageTemplate' ,

	'fifth' : 'RequestChangeMessageTemplate' ,

	'query' : 'request-change-message-template' ,

	'word' : 'Request Change Message Template' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let ectrl = require('../../controller/request-change-template')(opts);

let validator = require('../../validators/register')(opts);


router
			.route('/entries')

			.get(

				ectrl.entries);


router.route('/entry/:entry/exists')

			.get(

				ectrl.entryExists);


router.route('/entry/create')

			.get(

				ectrl.entryAdd)

			.post(

				validator.messageTemplate$ ,

				ectrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(

				ectrl.entryDetail);


router.route('/entry/:entry/update')

			.get(

				ectrl.entryUpdate)

			.put(

				validator.messageTemplate$ ,

				ectrl.entryUpdate$);


router.route('/entry/:entry/delete')

			.get(

				ectrl.entryDelete)

			.delete(

				ectrl.entryDelete$);


router.route('/delete/entry/many')

			.patch(

				ectrl.entryDeleteMany$);


router.route('/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll$);


module.exports = router;