const jwt = require('jsonwebtoken');

module.exports = {
    async authenticate(req,res,next) {
        try {

            let token = req.headers["authorization"];
            // console.log('token -----------: ', token);

            if (token) {
                let isUserVerified = jwt.verify(token, "mynameisgauravsongarathesoftwaredeveloper");
                // console.log('isUserVerified: ', isUserVerified);
                if (isUserVerified) {
                    req.user = isUserVerified
                    next()
                }
            } else {
                // console.log("Please Login First");
                res.json({
                    statusCode: 404,
                    message: "Please Login First!!"
                })
            }
            
        } catch (error) {
            console.log("Error while authenticate: ", error.message);
            res.json({
                statusCode: 404,
                message: "Please Login First!!"
            })
        }
    }
}