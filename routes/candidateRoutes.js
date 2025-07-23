const express = require("express");
const router = express.Router();
const Candidate = require("./../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const User = require("../models/user");



const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role == "admin"){
            return true;
        }
    }catch(err){
        return false;

    }
}

// Post route to add a candidate

router.post("/",jwtAuthMiddleware, async(req,res)=>{
    try{

        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not admin role"});
        


        const data = req.body; // Assuming the request body contains the candidate data

        // creates the new user document using the mongoose model
        const newCandidate = new Candidate(data);

        // save the new user to the database
        const response = await newCandidate.save();
        console.log("User data saved");

        res.status(200).json({response: response});


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});

    }
})

router.put("/:candidateID",jwtAuthMiddleware, async (req, res) => {
    try{
       if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not admin role"});
        
       const candidateID = req.params.candidateID; // Extract the id from the url parameter
       const updatedCandidatedData = req.body;  // Updated data for the person

       const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidatedData, {
        new: true, // Return the updated document
        runValidators: true, // run mongoose validators
       })
     if(!response){
        return res.status(404).json({error: "Candidate not found"});
     }
     console.log("Candidate data found");
     res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});

    }
})

router.delete("/:candidateID",jwtAuthMiddleware, async (req, res) => {
    try{
       if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not admin role"});
        
       const candidateID = req.params.candidateID; // Extract the id from the url parameter

       const response = await Candidate.findByIdAndDelete(candidateID);
     if(!response){
        return res.status(404).json({error: "Candidate not found"});
     }
     console.log("Candidate deleted");
     res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});

    }
})

// Lets start voting
router.post("/vote/:candidateID", jwtAuthMiddleware, async(req, res)=>{
    // no admin can vote
    // user can only vote once

    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message: "Candidate not found"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});

        }
        if(user.isVoted){
            return res.status(400).json({message: "You have already voted"});
        }
        if(user.role == "admin")
            { return res.status(400).json({message: "Admin cannot give vote"});
        }
        // Update the candidate document to record the vote

        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();
        res.status(200).json({message: "Vote recorded successfully"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})


// Vote count

router.get("/vote/count", async (req, res) => {
    try{
        // Find all the candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: "desc"});
        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});

    }
}
);

router.get("/candidates", async (req, res) => {
    try{
        const candidates = await Candidate.find();
         const candidatename = candidates.map((data)=>{
            return {
                party: data.party,
                age: data.age,
                name: data.name
            }
        });
        res.status(200).json({candidatename});



    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})


module.exports = router;






















