let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let qType = require('../../helper/query-type');

let opts = {

	'first' : 'Payment' ,

	'second' : 'Payment' ,

	'third' : 'payment' ,

	'fourth' : 'generalRequest' ,

	'fifth' : 'Payment' ,

	'query' : 'payment' ,

	'word' : 'Payment' ,

	'pt' : 'Payment Type' ,

	'normalPrivilege' : ['departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'staff'] ,

	'otherPrivilege2' : ['staff' , 'hod' , 'dean' ] ,

	'leastPrivilege' : ['staff' , 'hod' , 'dean'] ,

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/payment')(opts);

let $p$g = require('../../controller/payment-gate')(opts);



let paramProcessor = require('../../utility/parameter-processors');

let validator = require('../../validators/register')(opts);


router.route('/manage')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'student' , 'staff' , ...opts.superPrivilege , ...opts.otherPrivilege]) ,

				ectrl.managePayment);


router.route('/manage/t/:payment')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'student' , 'staff' , ...opts.superPrivilege]) ,

				ectrl.entryPayment);


router
			.route('/t/:payment/entries')

			.get(ectrl.entries);


router.route('/t/:payment/entry/:entry/exists')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'student' , 'staff' , ...opts.superPrivilege]) ,

				ectrl.entryExists);


router.route('/transaction-status')

			.get(

				cUser.roleType(['staff' , ...opts.superPrivilege , ...opts.otherPrivilege]) ,

				cUser.isOkAdmin)

			.post(

				cUser.roleType(['staff' , ...opts.superPrivilege , ...opts.otherPrivilege]) ,

				ectrl.entryCheckStatus);


router.route('/t/:payment/entry/:entry/detail')

			.get(

				cUser.roleType(['student' , ...opts.normalPrivilege , ...opts.otherPrivilege , ...opts.superPrivilege]) , 

				ectrl.entryDetail);


router.route('/t/:payment/entry/create')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'student']) ,

				ectrl.entryAdd)

			.post(

				cUser.roleType([...opts.normalPrivilege , 'student']) ,

				ectrl.checkPayment);

router
			.route('/initialize-transaction')
			
			.post(

				cUser.roleType([...opts.normalPrivilege , 'student']) ,

				$p$g.initializeTransaction);

router

			.route('/verify-transaction')

			.get(

				cUser.roleType([...opts.normalPrivilege , 'student']) ,

				$p$g.verifyTransaction);

/*router

			.route('/refund-transaction')

			.post(

				cUser.roleType(['superAdministrator']) ,

				$p$g.refundTransaction);*/

router

			.route('/entry/:entry/refund-transaction')

			.put(

				cUser.roleType(['departmentPresident' , 'facultyPresident']) ,

				$p$g.refundTransaction);


router.route('/t/:payment/entry/:entry/delete')

			.get(

				cUser.roleType(['staff' , ...opts.superPrivilege]) , 

				ectrl.entryDelete)

			.delete(

				cUser.roleType(['staff' , ...opts.superPrivilege]) , 

				ectrl.entryDelete$);


router.route('/t/:payment/delete/entry/many')

			.patch(

				cUser.roleType(['staff' , ...opts.superPrivilege]) , 

				ectrl.entryDeleteMany$);


router.route('/t/:payment/delete/entry/all')

			.get(

				cUser.roleType(['superAdministrator']) , 

				ectrl.entryDeleteAll)

			.delete(

				cUser.roleType(['superAdministrator']) , 

				ectrl.entryDeleteAll$);


module.exports = router;