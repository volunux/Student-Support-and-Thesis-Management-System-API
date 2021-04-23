let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'AccountChangeMessageTemplateType' ,

	'second' : 'Account Change Message Template Type' ,

	'third' : 'account-change-message-template-type' ,

	'fourth' : 'accountChangeMessageTemplateType' ,

	'fifth' : 'AccountChangeMessageTemplateType' ,

	'query' : 'account-change-message-template-type' ,

	'word' : 'Account Change Message Template Type' ,

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

				validator.messageTemplateType$ ,

				gctrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(

				gctrl.entryDetail);


router.route('/entry/:entry/update')

			.get(

				gctrl.entryUpdate)

			.put(

				validator.messageTemplateType$ ,

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