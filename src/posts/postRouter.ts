import express from 'express'
import postController from './postController'

const postRouter=express.Router()

/**
 * @swagger
 * /Posts:
 *   get:
 *     summary: Returns all Posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: the list of Posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 */
postRouter.get("/", postController.getPosts)

export default postRouter