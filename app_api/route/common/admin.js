let express = require('express');

let router = express.Router();

let cUser = require('../../helper/confirm-user');

let qType = require('../../helper/query-type');

let $user = require('../../helper/user');

let opts = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'user' ,

	'word' : 'User' ,

	'ut' : 'User Type' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

let gctrl = require('../../controller/general-one')(opts);

let ectrl = require('../../controller/admin')(opts);



let paramProcessor = require('../../utility/parameter-processors');

let validator = require('../../validators/register')(opts);



router.route('/confirm-admin')

			.get(cUser.confirmAdmin([...opts.superPrivilege]));


router.route('/user/:entry/profile')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				ectrl.entryExists);


router.route('/user/entries')

			.get( 

				cUser.roleType([...opts.superPrivilege]) ,

				ectrl.entries);


router
			.route('/user/entry/:entry/detail')

			.get(

				cUser.roleType([...opts.superPrivilege]) , 

				ectrl.entryDetail);



router
			.route('/user/entry/:entry/update')

			.get(

				cUser.roleType([...opts.superPrivilege]) , 

				ectrl.entryUpdate)

			.put(

				cUser.roleType([...opts.superPrivilege]) , 

				qType.removeFields($user.adminUserUpdate()) ,

				ectrl.entryUpdate$);


router
			.route('/user/entry/:entry/delete')

			.get( 

				cUser.roleType('superAdministrator') ,

				ectrl.entryDelete)

			.delete(

				cUser.roleType('superAdministrator') , 

				ectrl.entryDelete$);


router.route('/user/entry/create')

			.get(

				cUser.roleType([...opts.superPrivilege]) , 

				ectrl.entryAdd)

			.post(

				validator.adminUserCreate$ ,

				$user.checkUsernameAndEmail ,

				cUser.roleType([...opts.superPrivilege]) ,

				ectrl.entryAdd$);


router
			.route('/user/:entry/deactivate')

			.get(ectrl.entryDeactivate)

			.put(ectrl.entryDeactivate$);


router
			.route('/user/:entry/reactivate')

			.get(ectrl.entryReactivate)

			.put(ectrl.entryReactivate$);



router.route('/user/delete/entry/many')

			.patch(ectrl.entryDeleteMany$);


router.route('/user/delete/entry/all')

			.get(ectrl.entryDeleteAll)

			.delete(ectrl.entryDeleteAll$);


module.exports = router;