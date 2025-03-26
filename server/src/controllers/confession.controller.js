import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Confession } from "../models/confession.model.js";
import { Comment } from "../models/comment.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getAllConfession = asyncHandler(async(req,res)=>{
 
    let data = await Confession.find({})
    // console.log("data", data);
    
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "event data fetched successfully" 
        )
    )
})

const getConfessionDetails = asyncHandler(async(req,res)=>{
    const {id} = req.body
    if(!id) throw new ApiError(401,"id is required")
    const confessionFound = await Confession.findById(id)
    if(!confessionFound) throw new ApiError (400,"invalid id")

   let newConfessionObject = confessionFound.toObject()

    return res.status(200) 
    .json(
        new ApiResponse(200,newConfessionObject,"details fetched succesfully")
    )
})

const addCommentOnConfession = asyncHandler(async(req, res) => {
    const { confessionId, description } = req.body;

    if (!confessionId || !description) throw new ApiError(400, "Confession ID and description are required");

    const confessionFound = await Confession.findById(confessionId);
    if (!confessionFound) throw new ApiError(400, "Invalid Confession ID");

    const createdComment = await Comment.create({
        description,
        byUser: req.user,  // Ensure user is passed correctly from JWT
        postedOn: "confession",
        confessionId: confessionId
    });

    confessionFound.comments.push(createdComment._id);
    await confessionFound.save();  // **Fix: Save confession after updating comments array**

    return res.status(200).json(new ApiResponse(200, createdComment, "Comment Added Successfully"));
});

const deleteCommentOnConfession = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    
    if(!_id) throw new ApiError(401,"invalid comment id")
    const response =  await Comment.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const getAllCommentsOnConfession = asyncHandler(async(req, res) => {
    const { confessionId } = req.body;
    if (!confessionId) throw new ApiError(401, "Invalid Confession ID");

    const comments = await Comment.find({ postedOn: 'confession', confessionId: confessionId }).populate('byUser', 'username image');

    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const incrementConfessionPlays = asyncHandler(async (req, res) => {
    const { confessionId } = req.body;

    if (!confessionId) throw new ApiError(400, "Confession ID is required");

    const confession = await Confession.findByIdAndUpdate(
        confessionId,
        { $inc: { plays: 1 } }, // Increment plays by 1
        { new: true } // Return updated document
    );

    if (!confession) throw new ApiError(404, "Confession not found");

    return res.status(200).json(new ApiResponse(200, confession, "Play count updated"));
});

export {
    getAllConfession,
    getConfessionDetails,
    addCommentOnConfession,
    deleteCommentOnConfession,
    getAllCommentsOnConfession,
    incrementConfessionPlays
}