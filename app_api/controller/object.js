let $uploader = require('../helper/uploader') , key = '' , params = '';

let s3$ = require('../aws/buckets/s3/photoS3');

let aws = require('aws-sdk');

aws.config.update(s3$);

let { v4: uuidv4 } = require('uuid');

let s3 = new aws.S3();

let oCtrl = require('../helper/object');

let $rpd = require('../helper/responder');


module.exports = {

	'photoDelete' : (opts) => {

	 	return (req , res , next) => {

		if (req.params && req.params.entry) { 

			let $e = req.params.entry;

			oCtrl.objectDeleteClient(req , res , next , {'key' : $e , ...opts} ); }

		else { return $rpd.handler(res , 404 , {'message' : `No Attachment id provided. Please provide a valid Attachment id.`});	} }

	} ,

	'signedUrl' : (opts) => {

		(req , res , next) => {

			let params = {

					'Bucket' : process.env[opts.bucket] ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.body.contentType ,

												'success_action_status' : '201' ,

												'Expires' : '86400000' } ,

					'Conditions' : [
														{'bucket' : process.env[opts.bucket] } ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] ,

														["content-length-range" , '0' , '1048576'] ] ,

					'Expires' : '86400000'

				}

				s3.createPresignedPost(params , (err , data) => {
							
					if (err) { console.log(err); }
					
						else { res.status(200).json({data});	}	});
	} } ,

	'signPhoto' : (opts) => {

		return (req , res , next) => {

			params = {

					'Bucket' : process.env[opts.bucket] ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.body.contentType ,

												'success_action_status' : '201' ,

												'Expires' : '86400000' ,
					} ,

					'Conditions' : [
														{'bucket' : process.env[opts.bucket] } ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] ,

														["content-length-range" , '0' , '1048576'] ,
														
					] ,

					'Expires' : '86400000' ,

					'ServerSideEncryption' : 'AES256'
				
				}

				s3.createPresignedPost(params , (err , data) => {
							
					if (err) { console.log(err); } 

					else { res.status(200).json({data}); } });
	} }

}	