import express from "express";
const mainRouter = express.Router();

import userRouter from "./user.router.js";
import postRouter from "./post.router.js";



mainRouter.use(userRouter);
mainRouter.use(postRouter);




mainRouter.get("/", (req, res) => {
    res.send("Welcome to Synapse!");
});



export default mainRouter;