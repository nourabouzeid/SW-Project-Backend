import swaggerJsDoc from "swagger-jsdoc"
/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - PostId
 *         - AccountId
 *       properties:
 *         PostId:
 *           type: int
 *           description: Id of the Post
 *         AccountId:
 *           type: int
 *           descripton: Id of the Account that posted the post
 *       example:
 *         PostId: 1
 *         AccountId: 3
 * @swagger
 *  tags:
 *    name: Posts
 */
const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media App API",
      version: "1.0.0",
      description: "Documentation for our social media app API",
    },
  },
  apis: [
    `${__dirname}/routes/*.js`,
    `${__dirname}/routes/*.ts`,
    `${__dirname}/swagger.js`,
    `${__dirname}/swagger.ts`,
  ],
})

export default swaggerSpec