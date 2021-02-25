let express = require('express');

let router = express.Router();

let ectrl = require('../../controller/s3')({});


router.route('/signature')

      .get(ectrl.hash);


module.exports = router;