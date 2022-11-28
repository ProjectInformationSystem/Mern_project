const ErrorHander =  require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");


// Register a User
exports.registerUser = catchAsyncErrors( async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is as a sample id",
            url:"profilePicUrl"
        }
    });

    sendToken(user,200,res);
})

// Login User

exports.loginUser = catchAsyncErrors (async (req,res,next)=>{
    

    const {email,password} = req.body;

    // Checking if user has given both email and password

    if(!email || !password){
        return next(new ErrorHander("Please Enter Email and Password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid Email or password",401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid Email or passowrd",401));
    }
    sendToken(user,200,res);
});