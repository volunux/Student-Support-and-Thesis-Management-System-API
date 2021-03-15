let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let queryType = require('../../helper/query-type');

let opts = {

	'first' : 'GeneralRequest' ,

	'second' : 'General Request' ,

	'third' : 'general-request' ,

	'fourth' : 'generalRequest' ,

	'fifth' : 'GeneralRequest' ,

	'query' : 'general-request' ,

	'word' : 'General Request' ,

	'rt' : 'Request Type' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'entryDetail' : {

		'roles' : ['student' , 'departmentPresident' , 'facultyPresident' , 'staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

		'leastPrivilege' : ['staff']

	} ,

	'entryDetail$' : {

		'roles' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

		'leastPrivilege' : ['staff']

	} ,

	'bucket' : 'photos_bucket'

};

let ectrl = require('../../controller/general-request')(opts);

let others = require('../../controller/others')(opts);

let validator = require('../../validators/register')(opts);


router.route('/manage')

			.get(ectrl.manageRequest);


router.route('/status')

			.get(others.manageStatus);


router.route('/message-template')

			.get(others.manageMessageTemplate);


router.route('/message-template/entry/:entry/detail')

			.get(others.messageTemplateEntryDetail);


router.route('/manage/t/:request')

			.get(ectrl.entryRequest);


router
			.route('/t/:request/entries')

			.get(
				
				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) ,

				ectrl.entries);


router.route('/t/:request/entry/:entry/exists')

			.get(

					ectrl.entryExists);


router.route('/t/:request/entry/create')

			.get(

				cUser.roleType(opts.normalPrivilege) ,

				ectrl.entryAdd)

			.post(

				cUser.roleType(opts.normalPrivilege) ,

				validator.generalRequest$ ,

				ectrl.entryAdd$);


router.route('/t/:request/entry/:entry/detail')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) , 

				ectrl.entryDetail)

			.put(

 				cUser.roleType(['staff' , ...opts.superPrivilege]) , 

				validator.grUpdate$ ,

				ectrl.entryUpdate$);


router.route('/t/:request/entry/:entry/review')

			.put(

				cUser.roleType(['staff' , ...opts.superPrivilege]) ,

				ectrl.entryReview$);


router.route('/t/:request/entry/:entry/timeline')

			.get(

 					cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) , 

					ectrl.entryTimeline);


router.route('/t/:request/entry/:entry/transfer')

			.get(

				cUser.roleType(['staff' , ...opts.superPrivilege]) ,

				ectrl.entryTransfer)

			.put(

				cUser.roleType(['staff' , ...opts.superPrivilege]) ,

				validator.transfer$ ,

				ectrl.entryTransfer$);


router.route('/t/:request/entry/:entry/comment/')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) ,

				ectrl.entryAddComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddComment$);


router.route('/t/:request/entry/:entry/comment/:comment/reply')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) ,

				ectrl.entryAddReplytoComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , 'staff' , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddReplytoComment$)


router.route('/t/:request/entry/:entry/delete')

			.get(

				cUser.roleType([...opts.superPrivilege , 'staff']) ,

				ectrl.entryDelete)

			.delete(

				cUser.roleType([...opts.superPrivilege , 'staff']) ,

				ectrl.entryDelete$);


router.route('/t/:request/delete/entry/many')

			.patch(

				cUser.roleType([...opts.superPrivilege , 'staff']) ,

				validator.deleteEntry$ ,

				ectrl.entryDeleteMany$);


router.route('/t/:request/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll$);


module.exports = router;