const User = require('../models/userModel');
const apiResponse = require('../helpers/apiResponse');
const { createToken } = require('../middlewares/jwt');

exports.signup = async (req, res) => {
    try {
        //Create a new User document using the Mongoose model
        const userData = new User(req.body);

        //Save the new userto thr database
        const response = await userData.save();
        const payload = {
            id: response.id
        }

        //Create JWT token using Auto generted MogoDb Unique Id of create user
        const token = createToken(payload);
        return apiResponse.successResponseWithDataToken(res, "User Created Sucessfully", response, token);

    } catch (err) {
        return apiResponse.ErrorResponse(res, "Internal Server error.");
    }
};

//login Method
exports.login = async (req, res) => {
    try {

        // Extract aadharCradNumber and password from request body
        const { aadharCradNumber, password } = req.body;

        // Find the user by aadharCradNumber
        const userExist = await User.findOne({ aadharCradNumber: aadharCradNumber });
        console.log("userExist userExist", userExist);
        console.log("password password", password);

        if (!userExist || userExist.password != password) {
            return apiResponse.ErrorResponse(res, "Invalid username or password.");
        }

        //generate token
        const payload = {
            id: userExist.id
        }
        const token = createToken(payload);

        //Return token as response
        return apiResponse.successResponseWithData(res, "Success", { token: token });

    } catch (err) {
        return apiResponse.ErrorResponse(res, "Internal Server error.");
    }
};

//profile  Method
exports.profile = async (req, res) => {
    try {
        const userData = req.EncodedData;   // "EncodedData" key from jwt middelware
        const userId = userData.id;

          
        const user = await User.findById(userId);
        return apiResponse.successResponseWithData(res, "Success", user);
    } catch (err) {
        return apiResponse.ErrorResponse(res, "Internal Server error.");
    }
};

//Update Password
exports.update = async (req, res) => {
    try {
        const userData = req.EncodedData;   // "EncodedData" key from jwt middelware
        const userId = userData.id;
        const { currentPassword, newPassword } = req.body;

           // Find the user by userId
           const userExist = await User.findById(userId);
           //if (!userExist || userExist.currentPassword != currentPassword) {
           if (!(await userExist.comparePassword(currentPassword))) {
            return apiResponse.ErrorResponse(res, "Invalid username or password.");
        }

        //Update the user's password
        userExist.password = newPassword;
        return apiResponse.successResponse(res, "Passsword Update Sucessfully");

    } catch (error) {
        return apiResponse.ErrorResponse(res, "Internal Server error.");
    }
}