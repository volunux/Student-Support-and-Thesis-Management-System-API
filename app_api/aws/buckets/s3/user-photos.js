const aws = require('aws-sdk');

module.exports = function postPhotos() {

				return new aws.S3({
													    'secretAccessKey': process.env.users_photo_secretkey ,

													    'accessKeyId': process.env.users_photo_accesskey ,

													    'region' : process.env.users_region ,

													    'Bucket' : process.env.users_bucket ,

															'httpOptions' : {

																	'timeout' : 86400000 ,

																	'connectTimeout' : 12000
															}
});

}