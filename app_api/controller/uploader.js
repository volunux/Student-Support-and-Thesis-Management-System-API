let $uploader = require('../helper/uploader');

let s3$ = require('../../app_server/config/buckets/s3/photoS3')

let aws = require('aws-sdk');

aws.config.update(s3$);

let { v4: uuidv4 } = require('uuid');

let s3 = new aws.S3();


module.exports = {

	'signedUrl' : (req , res , next) => {
		
		let params = {

			'Bucket' : process.env.photos_bucket ,

			'Fields' : {
	
				'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

				'acl' : 'public-read-write' ,

				'Content-Type' : req.body.contentType ,

				'success_action_status' : '201' ,

				'Expires' : '86400000' } ,

			'Conditions' : [

				{'bucket' : process.env.photos_bucket} ,

				{'acl' : 'public-read-write'} ,

				{'success_action_status' : '201'} ,

				['starts-with' , '$Content-Type' , ''] ,

				["content-length-range" , '0' , '1048576'] ] ,

			'Expires' : '86400000' }

				s3.createPresignedPost(params , (err , data) => {

					if (err) { console.log(err)	}

						else { res.status(200).json({data}); }	});
	} ,

	'signPhoto' : (req , res , next) => {

		let params = {

			'Bucket' : process.env.photos_bucket ,

			'Fields' : {

				'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

				'acl' : 'public-read-write' ,

				'Content-Type' : req.body.contentType ,

				'success_action_status' : '201' ,

				'Expires' : '86400000' } ,

				'Conditions' : [

					{'bucket' : process.env.photos_bucket} ,

					{'acl' : 'public-read-write'} ,

					{'success_action_status' : '201'} ,

					['starts-with' , '$Content-Type' , ''] ,

					["content-length-range" , '0' , '1048576'] ] ,

					'Expires' : '86400000' ,

					'ServerSideEncryption' : 'AES256' }

				s3.createPresignedPost(params , (err , data) => {

					if (err) { console.log(err)	} 

					else { res.status(200).json({data}); } });
	} 

}	