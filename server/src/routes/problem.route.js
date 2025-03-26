import { Router } from "express";
import { 
    getAllProblem,
    getProblemDetails,
    addCommentOnProblem,
    deleteCommentOnProblem,
    getAllCommentsOnProblem
} from "../controllers/problem.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProblem } from "../controllers/problem.controller.js";


const router = Router()

//secured routes
router.route("/get-all-problem").post(verifyJWT, getAllProblem)
router.route("/get-problem-details").post(verifyJWT, getProblemDetails)
router.route("/add-comment-on-problem").post(verifyJWT, addCommentOnProblem)
router.route("/delete-comment-on-problem").post(verifyJWT, deleteCommentOnProblem)
router.route("/get-all-comments-on-problem").post(verifyJWT, getAllCommentsOnProblem)
router.route("/new-problem").post(verifyJWT, addProblem);


export default router