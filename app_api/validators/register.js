let generalOne = require('./schema/general-one/general-one');
let department = require('./schema/general-one/department');
let requestType = require('./schema/general-one/request-type');
let paymentSession = require('./schema/general-one/payment-session');

let generalTwo = require('./schema/general-two/general-two');

let generalRequest = require('./schema/general-request/general-request');
let grUpdate = require('./schema/general-request/update');
let grTransfer = require('./schema/general-request/transfer');

let refund = require('./schema/refund/refund');
let refundUpdateLetter = require('./schema/refund/letter');
let refundUpdate = require('./schema/refund/refund-update');
let refundStage = require('./schema/refund/refund-stage');

let comment = require('./schema/comment');

let payment = require('./schema/payment/payment');

let userSignUp = require('./schema/user/signup');
let userCreate = require('./schema/user/user-create');
let userSignIn = require('./schema/user/signin');
let userProfileUpdate = require('./schema/user/profile-update');
let userPhoto = require('./schema/user/photo');
let userPassword = require('./schema/user/password');
let deleteEntry = require('./schema/delete-entry');
let requestMessageTemplate = require('./schema/request-message-template');



let joiOptions = { 'convert' : true , 'abortEarly' : false , 'allowUnknown' : true };

let valiationMsgBuilder = require('./builder');

let $rpd = require('../helper/responder');

module.exports = (opts) => {

	return {

	'general$' : (req , res , next) => {

		let $err = generalOne.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'generalTwo$' : (req , res , next) => {

		let $err = generalTwo.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'department$' : (req , res , next) => {

		let $err = department.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'refundStage$' : (req , res , next) => {

		let $err = refundStage.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'paymentSession$' : (req , res , next) => {

		let $err = paymentSession.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'requestType$' : (req , res , next) => {

		let $err = requestType.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'role$' : (req , res , next) => {

		let $err = $e$grs$s.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'role');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'generalRequest$' : (req , res , next) => {

		let $err = generalRequest.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'generalRequest');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'grUpdate$' : (req , res , next) => {

		let $err = grUpdate.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'grUpdate');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'refund$' : (req , res , next) => {

		let $err = refund.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'refund');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'refundUpdate$' : (req , res , next) => {

		if (req.body && (req.body.stage == '4' || req.body.stage == 4)) {

		let $err = refundUpdateLetter.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'refundUpdateLetter');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); } 

		}

		else {

		let $err = refundUpdate.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'refundUpdate');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); } }

	} ,

	'payment$' : (req , res , next) => {

		let $err = payment.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'payment');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to save or update ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'adminUserCreate$' : (req , res , next) => {

		let $err = userCreate.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'user');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'userSignUp$' : (req , res , next) => {

		let $err = userSignUp.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'user');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'userSignIn$' : (req , res , next) => {

		let $err = userSignIn.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'user');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'userProfileUpdate$' : (req , res , next) => {

		let $err = userProfileUpdate.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'user');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'userPhoto$' : (req , res , next) => {

		let $err = userPhoto.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'photo');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'userPassword$' : (req , res , next) => {

		let $err = userPassword.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'user');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'comment$' : (req , res , next) => {

		let $err = comment.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'transfer$' : (req , res , next) => {

		let $err = grTransfer.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'general');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'deleteEntry$' : (req , res , next) => {

		let $err = deleteEntry.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'deleteEntry');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

	'requestMessageTemplate$' : (req , res , next) => {

		let $err = requestMessageTemplate.validator.validate(req.body , joiOptions);

		let msgList = valiationMsgBuilder.build(req , res , $err , 'requestMessageTemplate');

		if (msgList.length > 0) { return $rpd.handler(res , 400 , {'message' : `Unable to process ${opts.second} entry. Please try again.` , 'details' : msgList}); }

		else { return next(); }

	} ,

}

}