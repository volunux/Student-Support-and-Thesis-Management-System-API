module.exports = {

	'getHash' : (config) => {

  // Check default region.
  config.region = config.region || 'us-east-1';
  config.region = config.region == 's3' ? 'us-east-1' : config.region;

  var bucket = config.bucket , region = config.region , keyStart = config.keyStart , acl = config.acl;

  // These can be found on your Account page, under Security Credentials > Access Keys.
  var accessKeyId = config.accessKey , secret = config.secretKey;

  var date = new Date().toISOString() , dateString = date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2); // Ymd format.

  var credential = [accessKeyId, dateString, region, 's3/aws4_request'].join('/') , xAmzDate = dateString + 'T000000Z';

  var policy = {
    // 5 minutes into the future
    expiration: new Date((new Date).getTime() + (5 * 60 * 1000)).toISOString(),
    conditions: [
      {'bucket' : bucket},
      {'acl' : acl },
      {'success_action_status' : '201'},
      {'x-requested-with' : 'xhr'},
      {'x-amz-algorithm' : 'AWS4-HMAC-SHA256'},
      {'x-amz-credential' : credential},
      {'x-amz-date' : xAmzDate},
      ['starts-with', '$key', keyStart],
      ['starts-with', '$Content-Type', ''] // accept all files
    ],
  }
  var policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');


  function hmac(key, string) {
    var hmac = require('crypto').createHmac('sha256', key);
    hmac.end(string);
    return hmac.read();
  }

  var dateKey = hmac('AWS4' + secret, dateString) , dateRegionKey = hmac(dateKey, region) , dateRegionServiceKey = hmac(dateRegionKey, 's3') , 

  signingKey = hmac(dateRegionServiceKey, 'aws4_request') , signature = hmac(signingKey, policyBase64).toString('hex');

  return {

    'bucket' : bucket , 'region' : region != 'us-east-1' ? region : 's3', 'keyStart' : keyStart ,

    'params' : { 'acl' : acl , 'policy' : policyBase64 , 'x-amz-algorithm': 'AWS4-HMAC-SHA256' , 'x-amz-credential': credential , 'x-amz-date': xAmzDate , 'x-amz-signature': signature }
  }

}

}