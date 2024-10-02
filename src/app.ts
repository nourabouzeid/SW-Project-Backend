import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerSpec from "./swagger";
import swaggerUi from 'swagger-ui-express'
import postRouter from "./posts/postRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use("/Posts", postRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});