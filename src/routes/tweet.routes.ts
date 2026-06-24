import { Router } from "express";

import {
  getTweets,
  getTweet,
  postTweet,
  removeTweet,
} from "../controllers/tweet.controller";

const router = Router();

router.get("/", getTweets);

router.get("/:id", getTweet);

router.post("/", postTweet);

router.delete("/:id", removeTweet);

export default router;