const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Signup

router.post("/signup", async(req,res)=>{
    try{
        const data = req.body; // Assuming the request body contains the user data

        // creates the new user document using the mongoose model
        const newUser = new User(data);

        // save the new user to the database
        const response = await newUser.save();
        console.log("User data saved");

        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({response: response, token: token});


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});

    }
})

// Login Route

router.post("/login", async(req, res)=> {
    try{
        // Extract cnic card and password from request body
        const {cnicCardNumber, password} = req.body;

        // find the user by cnic card number
        const user = await User.findOne({cnicCardNumber: cnicCardNumber});

        // if user does not exist or password doesnot match, return error 
        if (!user || (await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
        }

        // generate token

        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // return token as response
        res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

router.get("/profile", jwtAuthMiddleware, async(req,res) => {
    try{
        const userData = req.user;  
        console.log("User Data: ", userData);
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})

router.put("/profile/password",jwtAuthMiddleware, async (req, res)=> {
    try{
        const userId = req.user; // Extract the id from the token
        const {currentPassword, newPassword} = req.body; // Extract current and new password from request body

        // Find the user by userId
        const user = await User.findById(userId);
        if (!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: "Invalid username or password"});
        }
        user.password = newPassword;
        await user.save();

        console.log("Password Updated");
        res.status(200).json({message: "Password Updated"});


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})



module.exports = router;






















