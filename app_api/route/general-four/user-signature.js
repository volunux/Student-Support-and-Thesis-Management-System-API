var express = require('express');

let router = express.Router(); 

let cUser = require('../../helper/confirm-user');

let USignatureRepo = require(`../../queries/user-signature`).UserSignatureRepository;

let query$ = new USignatureRepo();

let opts = {

	'first' : 'UserSignature' ,

	'second' : 'User Signature' ,

	'third' : 'user-signature' ,

	'fourth' : 'userSignature' ,

	'fifth' : 'UserSignature' ,

	'query' : 'user-signature' ,

	'word' : 'User Signature' ,

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