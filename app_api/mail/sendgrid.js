const mailer = require("@sendgrid/mail");

module.exports = {

  'send' : function(details) { 

    console.log(details);

    mailer.setApiKey(process.env.SENDGRID_API_KEY);

    const messageDetails = {
    
      to : details.user.email_address ,

      from : process.env.APP_DOMAIN_EMAIL_ADDRESS ,

      subject : details.title ,

      html : details.message
    
    };

try {

    mailer.send(messageDetails , function(err , entryResult) {

      if (err) { /*console.log(err);*/ } 

      else { console.log(entryResult); } });
 }

catch (err) { console.log(`Network failure has occured. Please check connection and try again.`) }

  }

}