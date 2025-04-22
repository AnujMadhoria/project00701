import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Story } from "../models/story.model.js";
import { Confession } from "../models/confession.model.js";
import { Problem } from "../models/problem.model.js";
// import { Song } from "../models/song.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        // console.log("2", accessToken);
        
        const refreshToken = user.generateRefreshToken();
        // console.log("3", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error(error);  // Log the error to get more insight
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body
    
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log(req.files);
    
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    const user = await User.create({
        fullName,
        image: coverImage? coverImage : "",
        username,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
  
    if (!(username || email)) {
      throw new ApiError(400, "Username or email is required");
    }
  
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    // ✅ Fixed cookie options for cross-origin requests
    const options = {
      httpOnly: true,
      secure: true,         // Must be true when SameSite is 'None'
      sameSite: "None",     // Required for cross-origin cookies
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  });

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    // Destructure optional fields
    const { fullName, email, bio, gender } = req.body;
  
    // Check if at least one field is provided for update
    if (!fullName && !email && !bio && !gender) {
      throw new ApiError(400, "At least one field is required to update");
    }
  
    // Build the update object with only provided fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (gender) updateData.gender = gender;
  
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateData },
      { new: true }
    ).select("-password");
  
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated successfully"));
  });
  
  const updateUserImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;
  
    if (!imageLocalPath) {
      throw new ApiError(400, "image file is missing");
    }
   
    // --- Delete old image if it exists ---
    // Fetch the current user details
    const currentUser = await User.findById(req.user?._id);
    if (currentUser && currentUser.image && currentUser.image.public_id) {
      try {
        // Delete old image from Cloudinary using its public_id
        await cloudinary.uploader.destroy(currentUser.image.public_id);
        console.log("Old image deleted successfully");
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Optionally, you can continue even if deletion fails.
      }
    }
    // console.log(imageLocalPath);
    
  
    // Upload new image to Cloudinary
    const image = await uploadOnCloudinary(imageLocalPath);
    console.log("New image:", image);
  
    if (!image) {
      throw new ApiError(400, "Error while uploading");
    }
  
    // Update the user record with the new image data
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { image: image.secure_url } },
      { new: true }
    ).select("-password");
  
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Image updated successfully"));
  });


const addStory = asyncHandler(async(req,res)=>{
    
    const {caption, tags} = req.body
   
    if(!caption || !tags) throw new ApiError(401,"All feilds required")
    console.log(req.file)
    
    let audioPath=""
// console.log(req.files);

    if(req.file){
        
            // console.log("inside files loop");
            const path = req.file?.path
            
            // console.log("paths is ",path);
            const res = await uploadOnCloudinary(path)
            // console.log(res);
            audioPath=res
            console.log(audioPath);
        // }
    }
    else{
        throw new ApiError(401,"Audio is required")
    }


    const createdStory = await Story.create({
        caption, 
        tags,
        audio:audioPath,
        plays:0,
        createdBy:req.user
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdStory,
        "Posted Successfully"
       )
    )
})
const addConfession = asyncHandler(async (req, res) => {
    // console.log("File received:", req.file); // Debugging step
    // console.log("Body received:", req.body);
    const { title, summary, tags } = req.body;

    if (!title || !summary || !tags) throw new ApiError(401, "All fields are required");

    let audioPath = "";

    if (!req.file) {
        throw new ApiError(401, "Audio is required");
    }

    try {
        // Upload audio to Cloudinary
        const path = req.file.path;
        // console.log("path", path);
        
        const uploadRes = await uploadOnCloudinary(path);
        // console.log("uploadRes", uploadRes);
        
        audioPath = uploadRes?.secure_url || ""; // Ensure you get the correct Cloudinary URL
        if (!audioPath) {
            throw new ApiError(500, "Failed to upload audio");
        }
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "Cloudinary upload failed");
    }

    // Convert tags to an array if it's a string (comma-separated input from frontend)
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

    // Create the confession post
    const createdConfession = await Confession.create({
        title,
        summary,
        audio: audioPath,
        plays: 0,
        createdBy: req.user,
        tags: tagsArray
    });

    return res.status(200).json(
        new ApiResponse(200, createdConfession, "Posted Successfully")
    );
});

const addProblem = asyncHandler(async(req,res)=>{
    const {title, summary, tags} = req.body
   
    if(!title || !summary || !tags) throw new ApiError(401,"All feilds required")
    // console.log(req.files)

    const createdProblem = await Problem.create({
        title, 
        summary,
        createdBy:req.user,
        tags
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdProblem,
        "Posted Successfully"
       )
    )
})

const addSong = asyncHandler(async(req,res)=>{
    const {caption, tags} = req.body
   
    if(!caption || !tags) throw new ApiError(401,"All feilds required")
    // console.log(req.files)
    
    let audioPath=""
    // console.log(req.files);
    
        if(req.file){
            
                // console.log("inside files loop");
                const path = req.file?.path
                
                // console.log("paths is ",path);
                const res = await uploadOnCloudinary(path)
                // console.log(res);
                audioPath=res
                console.log(audioPath);
            // }
        }
        else{
            throw new ApiError(401,"Audio is required")
        }

    const createdSong = await Song.create({
        caption,
        audio:audioPath,
        plays:0,
        createdBy:req.user,
        tags
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdSong,
        "Posted Successfully"
       )
    )
})

const getUserStory = asyncHandler(async(req,res)=>{
    const data = await Story.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserConfession = asyncHandler(async(req,res)=>{
    const data = await Confession.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserProblem = asyncHandler(async(req,res)=>{
    const data = await Problem.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserSong = asyncHandler(async(req,res)=>{
    const data = await Song.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const removeStory = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Story.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeConfession = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Confession.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeProblem = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Problem.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeSong = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Song.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    // Perform search based on username or fullName
    const users = await User.find({
        $or: [
            { username: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } }
        ]
    }).select("fullName username image");

    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export {
    registerUser,
    loginUser, 
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserImage,
    addStory,
    addConfession,
    addProblem,
    addSong,
    getUserStory,
    getUserConfession,
    getUserProblem,
    getUserSong,
    removeStory,
    removeConfession,
    removeProblem,
    removeSong,
    searchUsers
}