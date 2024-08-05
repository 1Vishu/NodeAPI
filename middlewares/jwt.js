const jwt = require('jsonwebtoken');
const apiResponse = require('../helpers/apiResponse');

const jwtAuthMiddleware = (req, res, next) => {

	// First heck request headers has authorization or apiResponse.notFoundResponse
	const authorization = req.headers.authorization
	if(!authorization) return apiResponse.ErrorResponse(res,"Authorization Failed");
	//Extract the jwt token from the request headers
	const token = req.headers.authorization.split(' ')[1];
	if (!token) return apiResponse.unauthorizedResponse(req, "Unauthorized");

	try {
		//Verify the JWT Token
		const decode = jwt.verify(token, process.env.JWT_SECRET);

		//Attach user information to the request object
		req.EncodedData = decode;
		next();
	} catch (err) {
		console.error(err);
	     apiResponse.ErrorResponse(res, "Invalid token");
	}
} 

// Function to generate JWT token

const createToken = (userData) =>{
	return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn: 300000});
}

module.exports = {jwtAuthMiddleware, createToken}