import { Request, Response } from "express"
import errorHandler from "../middlewares/errorHandler"
import postService from "./postService"

class PostController {
    public async getPosts(req: Request, res: Response) {
      try {
        const posts = await postService.getPosts()
        res.status(200).json(posts)
      } catch (error: unknown) {
        const { status, message } = errorHandler.handleError(error)
        res.status(status).send(message)
      }
    }
}

export default new PostController()