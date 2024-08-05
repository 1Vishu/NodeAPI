const Candidate = require("../models/candidate");
const apiResponse = require("../helpers/apiResponse");
const User = require("../models/userModel");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user && user.role === "admin";
  } catch (err) {
    return false;
  }
};

//Post Route to add a candidate
exports.candidatesignUp = async (req, res) => {
  try {
    //Check User s empty are not
    if (!(await checkAdminRole(req.EncodedData.id))) {
      return apiResponse.unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }
    //Create a new User document using the Mongoose model
    const newCandidate = new Candidate(req.body);

    //Save the new userto thr database
    const response = await newCandidate.save();
    return apiResponse.successResponseWithData(
      res,
      "Candidate Created Sucessfully",
      response
    );
  } catch (err) {
    console.log("error is", err);
    return apiResponse.ErrorResponse(res, "Internal Server error.");
  }
};

//Update Password
exports.updateCandidate = async (req, res) => {
  try {
    //Check User s empty are not
    if (!(await checkAdminRole(req.EncodedData.id))) {
      return apiResponse.unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }
    console.log("Candidate Id is", req.params.candidateId);
    const candidateId = req.params.candidateID; //Extract the id from the URL parameter
    // console.log("Candidate Id is",candidateId);
    const response = await Candidate.findByIdAndUpdate(candidateId, req.body, {
      new: true, //Return the update document
      runValidators: true, //Run Mongoose validation
    });
    console.log("response is", response);
    if (!response) {
      return apiResponse.notFoundResponse(res, "Candidate Not Found");
    }
    return apiResponse.successResponseWithData(
      res,
      "Candidate Updated Sucessfully",
      response
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server error.");
  }
};

//Delete Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    //Check Users empty are not
    if (!(await checkAdminRole(req.EncodedData.id))) {
      return apiResponse.unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }
    const candidateId = req.params.candidateID; //Extract the id from the URL parameter
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return apiResponse.notFoundResponse(res, "Candidate Not Found");
    }
    return apiResponse.successResponseWithData(
      res,
      "Candidate deleted Sucessfully",
      response
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server error.");
  }
};

exports.voteCandidate = async (req, res) => {
  //No admin can vote
  // user an only vote once
  const candidateId = req.params.candidateID;
  const userId = req.EncodedData.id;
  console.log("candidate ID is", candidateId);
  console.log("user ID is", userId);

  try {
    // Find the Candidate document with the specified candidateId
    const candidate = await Candidate.findById(candidateId);
    console.log("candidate candidate", candidate);

    if (!candidate) {
      return apiResponse.notFoundResponse(res, "Candidate Not Found");
    }
    const user = await User.findById(userId);
    console.log("user.role ", user.role);
    if (!user) {
      return apiResponse.notFoundResponse(res, "User Not Found");
    }
    if (user.isVoted) {
      return apiResponse.notFoundResponse(res, "You have already voted");
    }
    if (user.role == "admin") {
      return apiResponse.notFoundResponse(res, "Admin is not allowed to vote");
    }

    //Update the candidate ocument to record the vote
    candidate.votes.push({user:userId});
    //candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    //Update the user document
    user.isVoted = true;
    await user.save();

    return apiResponse.successResponse(res, "Vote recorded Sucessfully");
  } catch (err) {
    console.log("error is", err);
    return apiResponse.ErrorResponse(res, "Internal Server error.");
  }
};

exports.voteCount = async (req, res) => {
  try {
    //Find all candidates and sort them by votecount in descending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    //Map the candidates to only return their name and voteCount
    const voterecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return apiResponse.successResponseWithData(res, "", voterecord);
  } catch (err) {
    return apiResponse.ErrorResponse(res, "Internal Server error.");
  }
};
