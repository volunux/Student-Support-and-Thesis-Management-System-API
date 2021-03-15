let $rpd = require('../helper/responder');
let privilege = require('../helper/privilege');
let cUser = require('../helper/confirm-user');
let vAuth = require('../helper/authenticate');
let encryptor = require('../helper/encryptor');
let entryPublisher = require('../helper/entry-publisher');
let createError = require('http-errors');



let index = require('./index');
let authentication = require('./authentication');
let authenticate = require('./authenticate');


/** General One Routes **/

let country = require('./general-one/country');
let level = require('./general-one/level');
let unit = require('./general-one/unit');
let faculty = require('./general-one/faculty');
let department = require('./general-one/department');
let refundStage = require('./general-one/refund-stage');
let requestType = require('./general-one/request-type');
let paymentType = require('./general-one/payment-type');
let paymentSession = require('./general-one/payment-session');
let requestMessageTemplate = require('./general-one/request-message-template');

/** General One Routes **/

/** General Two Routes **/

let generalStatus = require('./general-two/general-status');
let userStatus = require('./general-two/user-status');
let generalRequestStatus = require('./general-two/general-request-status');
let paymentStatus = require('./general-two/payment-status');
let userRole = require('./general-two/user-role');

/** General Two Routes **/

/** General Three Routes **/

let generalRequestComment = require('./general-three/general-request-comment');
let refundComment = require('./general-three/refund-comment');
let refundSignature = require('./general-three/refund-signature');
let reply = require('./general-three/reply');
let requestCredential = require('./general-three/request-credential');

/** General Three Routes **/

/** General Four Routes **/

let object = require('./others/object');
let s3 = require('./others/s3');
let attachment = require('./general-four/attachment');
let userPhoto = require('./general-four/user-photo');
let userSignature = require('./general-four/user-signature');


/** General Four Routes **/

/** Common Routes **/

let statistic = require('./statistic');
let admin = require('./common/admin');
let user = require('./common/user');
let payment = require('./common/payment');
let generalRequest = require('./common/general-request');
let refund = require('./common/refund');

/** Common Routes **/


module.exports = (app) => {

		app.use('/api' , index);
		app.use('/api' , authentication);
		app.use('/api/confirm' , authenticate);

		app.use('/api' , vAuth.auth , entryPublisher.user);



/** General One Routes **/

		app.use('/api/country' , cUser.roleType([...privilege.sPrivilege]) , country );
		app.use('/api/level' , cUser.roleType([...privilege.sPrivilege]) , level );
		app.use('/api/unit' , cUser.roleType([...privilege.sPrivilege]) , unit);
		app.use('/api/faculty' , cUser.roleType([...privilege.sPrivilege]) , faculty);
		app.use('/api/refund-stage' , cUser.roleType([...privilege.sPrivilege]) , refundStage );
		app.use('/api/department' , cUser.roleType([...privilege.sPrivilege]) , department);
		app.use('/api/request-type' , cUser.roleType([...privilege.sPrivilege]) , requestType);
		app.use('/api/payment-type' , cUser.roleType([...privilege.sPrivilege]) , paymentType);
		app.use('/api/payment-session' , cUser.roleType([...privilege.sPrivilege]) , paymentSession);

/** General One Routes **/

/** General Two Routes **/

		app.use('/api/status' , cUser.roleType([...privilege.sPrivilege]) , generalStatus );
		app.use('/api/user-status' , cUser.roleType([...privilege.sPrivilege]) , userStatus );
		app.use('/api/general-request-status' , cUser.roleType([...privilege.sPrivilege]) , generalRequestStatus );
		app.use('/api/payment-status' , cUser.roleType([...privilege.sPrivilege]) , paymentStatus );
		app.use('/api/user-role' , cUser.roleType([...privilege.sPrivilege]) , userRole );

/** General Two Routes **/

/** General Three Routes **/

		app.use('/api/general-request-comment' , cUser.roleType([...privilege.sPrivilege]) , generalRequestComment);
		app.use('/api/refund-comment' , cUser.roleType([...privilege.sPrivilege]) , refundComment);
		app.use('/api/refund-signature' , cUser.roleType([...privilege.sPrivilege]) , refundSignature);
		app.use('/api/reply' , cUser.roleType([...privilege.sPrivilege]) , reply);
		app.use('/api/request-credential' , cUser.roleType([...privilege.sPrivilege]) , requestCredential);

/** General Three Routes **/

/** General Four Routes **/

		app.use('/api/o' , object);
		app.use('/api/s3' , s3);
		app.use('/api/user-upload' , attachment);
		app.use('/api/user-photo' , userPhoto);
		app.use('/api/user-signature' , userSignature);

/** General Four Routes **/

/** Common Routes **/

		app.use('/api/admin' , cUser.roleType(privilege.sPrivilege.slice(1)) , admin);
		app.use('/api/statistic' , cUser.roleType(privilege.sPrivilege.slice(1)) , statistic);
		app.use('/api/user' , /*cUser.isUserPending ,*/ cUser.roleType([...privilege.all]) , user);
		app.use('/api/general-payment' , payment);
		app.use('/api/general-request' , generalRequest);
		app.use('/api/refund' , refund);
		app.use('/api/request-message-template' , requestMessageTemplate );

/** Common Routes **/


		app.use('/api' , (req , res , next) => { next(createError(404)); });

		app.use('/api' , (err , req , res , next) => { console.log(err);

				$rpd.handler(res , 404 , {'message' : 'An error has occured. The API url doesn\'t exist'});
		});
}