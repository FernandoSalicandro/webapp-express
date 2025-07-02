import express, { Router } from "express";
import controller from '../moviesControllers/moviesControllers.js'
import { upload } from "../middleware/Upload.js";

const router = express.Router()

//rotta index
router.get('/', controller.index)
//rotta show
router.get('/:slug', controller.show)

//rotta store movie
router.post('/',upload.single('image'), controller.store)

//store review
router.post('/:movieId/reviews', controller.storeReview)





export default router;