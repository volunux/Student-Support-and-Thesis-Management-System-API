let express = require('express');

let router = express.Router();

let ectrl = require('../../controller/object');


let AtthRepo = require(`../../queries/attachment`).AttachmentRepository;

let queryAtth$ = new AtthRepo();

let UserPhotoRepo = require(`../../queries/user-photo`).UserPhotoRepository;

let queryUserPhoto$ = new UserPhotoRepo();

let UserSignatureRepo = require(`../../queries/user-signature`).UserSignatureRepository;

let queryUserSignature$ = new UserSignatureRepo();


router.route('/sign/photo/:filename')

			.post(ectrl.signPhoto({'bucket' : 'photos_bucket' , 'query$' : queryAtth$}));


router.route('/photo/:entry')
		
			.delete(ectrl.photoDelete({'bucket' : 'photos_bucket' , 'query$' : queryAtth$}));


router.route('/sign/user-photo/:filename')

			.post(ectrl.signPhoto({'bucket' : 'users_bucket' , 'query$' : queryUserPhoto$}));


router.route('/user-photo/:entry')
		
			.delete(ectrl.photoDelete({'bucket' : 'users_bucket' , 'query$' : queryUserPhoto$}));


router.route('/sign/user-signature/:filename')

			.post(ectrl.signPhoto({'bucket' : 'users_bucket' , 'query$' : queryUserSignature$}));


router.route('/user-signature/:entry')
		
			.delete(ectrl.photoDelete({'bucket' : 'users_bucket' , 'query$' : queryUserSignature$}));


module.exports = router;