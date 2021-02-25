module.exports = {

   'passwordReset' : (req , token) => {

       return `<h1><strong>Account Recovery</strong></h1>
                
                <p> Hello , </p>
                <p> You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process: </p>
                <br/>

                <p> <a style ='display:block;width:100%;padding=0% 2.9340879234504911474798498165083%;color:#a0a7a0;background-color:#290140' 
                  href ='http://${req.headers.host}/reset/${token}'> Recover Account Password </a> </p>

                <p> If you did not request this, please ignore this email and your password will remain unchanged.</p> `;
   }        
}

	