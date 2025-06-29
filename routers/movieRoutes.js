import express, { Router } from "express";
import controller from '../moviesControllers/moviesControllers.js'

const router = express.Router()

//rotta index
router.get('/', controller.index)
//rotta show
router.get('/:id', controller.show)





export default router;