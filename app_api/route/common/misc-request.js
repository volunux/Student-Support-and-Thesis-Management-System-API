let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let $refund = require('../../entry/refund');

let opts = {

	'first' : 'MiscRequest' ,

	'second' : 'Misc Request' ,

	'third' : 'misc-request' ,

	'fourth' : 'miscRequest' ,

	'fifth' : 'MiscRequest' ,

	'query' : 'misc-request' ,

	'word' : 'Misc Request' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'bursar'] ,

	'otherPrivilege2' : ['levelAdviser' , 'lecturer' , 'secretary'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'canUpdateStatus' : ['staff' , 'bursar' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'bucket' : 'photos_bucket'

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/misc-request')(opts);

let others = require('../../controller/others')(opts);


let validator = require('../../validators/register')(opts);


router.route('/status')

			.get(others.manageStatus);


router.route('/message-template')

			.get(others.manageMessageTemplate);


router.route('/message-template/entry/:entry/detail')

			.get(others.messageTemplateEntryDetail);


router
			.route('/entries')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entries);



router.route('/entry/create')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entryAdd)

			.post(

				validator.miscRequest$ ,

				ectrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entryDetail)

			.put(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				validator.miscRequestUpdate$ ,

				ectrl.entryUpdate$);



router.route('/entry/:entry/timeline')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entryTimeline);


router.route('/entry/:entry/status')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryStatus);


router.route('/entry/:entry/comment/')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entryAddComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddComment$);


router.route('/entry/:entry/comment/:comment/reply')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				ectrl.entryAddReplytoComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.otherPrivilege2 , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddReplytoComment$);


router.route('/entry/:entry/delete')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDelete)

			.delete(

			 	cUser.roleType(['superAdministrator']),

				ectrl.entryDelete$);


router.route('/delete/entry/many')

			.patch(

				cUser.roleType(['superAdministrator']) ,

				validator.deleteEntry$ ,

				gctrl.entryDeleteMany$);


router.route('/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll$);


module.exports = router;