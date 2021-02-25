let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let $refund = require('../../entry/refund');

let opts = {

	'first' : 'Refund' ,

	'second' : 'Refund' ,

	'third' : 'refund' ,

	'fourth' : 'refund' ,

	'fifth' : 'Refund' ,

	'query' : 'refund' ,

	'word' : 'Refund' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'bursar'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'canUpdateStatus' : ['staff' , 'bursar' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'bucket' : 'photos_bucket'

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/refund')(opts);

let ectrl$u = require('../../controller/refund-update')(opts);

let ectrl$l = require('../../controller/refund-letter')(opts);


let validator = require('../../validators/register')(opts);


router.route('/status')

			.get(ectrl.manageStatus);



router
			.route('/entries')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl.entries);



router.route('/entry/create')

			.get(

				cUser.roleType(opts.normalPrivilege) ,

				ectrl.entryAdd)

			.post(

				validator.refund$ ,

				$refund.setDepartment ,

				$refund.setFaculty , 

				ectrl.entryAdd$);


router.route('/entry/:entry/detail')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl.entryDetail)

			.put(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				$refund.stage ,

				validator.refundUpdate$ ,

				ectrl$u.entryUpdate$);



router.route('/entry/:entry/write/letter')

			.get(

				cUser.roleType([...opts.normalPrivilege]) ,

				ectrl$l.entryWriteLetter);



router.route('/entry/:entry/review')

			.put(

				cUser.roleType([...opts.superPrivilege]) ,

				ectrl.entryReview$);



router.route('/entry/:entry/timeline')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl.entryTimeline);



router.route('/entry/:entry/letter')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl$l.entryLetter);



router.route('/entry/:entry/comment/')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl.entryAddComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddComment$);


router.route('/entry/:entry/comment/:comment/reply')

			.get(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				ectrl.entryAddReplytoComment)

			.post(

				cUser.roleType([...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) ,

				validator.comment$ ,

				ectrl.entryAddReplytoComment$);


router.route('/entry/:entry/delete')

			.get(

				cUser.roleType([...opts.superPrivilege , 'staff']) ,

				ectrl.entryDelete)

			.delete(

			 	cUser.roleType([...opts.superPrivilege , 'staff']),

				ectrl.entryDelete$);


router.route('/delete/entry/many')

			.patch(

				cUser.roleType([...opts.superPrivilege , 'staff']) ,

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