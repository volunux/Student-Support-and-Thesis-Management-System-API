var express = require('express');

let router = express.Router(); 

let cUser = require('../../helper/confirm-user');

let UPhotoRepo = require(`../../queries/user-photo`).UserPhotoRepository;

let query$ = new UPhotoRepo();

let opts = {

	'first' : 'UserPhoto' ,

	'second' : 'User Photo' ,

	'third' : 'user-photo' ,

	'fourth' : 'userPhoto' ,

	'fifth' : 'UserPhoto' ,

	'query' : 'user-photo' ,

	'word' : 'User Photo' ,

	'query$' : query$ ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'bucket' : 'users_bucket'

};

let ectrl = require('../../controller/upload')(opts);

	
router.route('/entry/create')

			.post(ectrl.entryAdd$);

router.route('/entries')

			.get(

			cUser.roleType([...opts.superPrivilege]) ,

			ectrl.entries);


router
			.route('/delete/entry/many')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				cUser.isOkAdmin)

			.patch(

				cUser.roleType([...opts.superPrivilege]) , 

				ectrl.entryDeleteMany$);

router
			.route('/delete/entry/all/')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

				ectrl.entryDeleteAll$);


module.exports = router;