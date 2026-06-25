import { Request, Response, NextFunction } from "express";

import {
  getAllTweets,
  getTweetById,
  createTweet,
  deleteTweet,
} from "../services/tweet.service";

export function getTweets(
  req: Request,
  res: Response
) {
  const tweets = getAllTweets();

  res.json(tweets);
}

export function getTweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  const id = Number(req.params.id);

  const tweet = getTweetById(id);

  if (!tweet) {
    return res.status(404).json({
      error: "Tweet not found",
    });
  }

  res.json(tweet);
} catch (error) {
  next(error);
}
}

export function postTweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {     
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  const tweet = createTweet(
    text,
    "alice"
  );

  res.status(201).json(tweet);
} catch (error) {
  next(error);
}
}

export function removeTweet(
  req: Request,
  res: Response,
  next: NextFunction  
) {
  try { 
  const success = deleteTweet(
    Number(req.params.id)
  );

  if (!success) {
    return res.status(404).json({
      error: "Tweet not found",
    });
  }

  res.json({
    success: true,
  });
} catch (error) {
  next(error);
}
}