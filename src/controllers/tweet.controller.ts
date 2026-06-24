import { Request, Response } from "express";

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
  res: Response
) {
  const id = Number(req.params.id);

  const tweet = getTweetById(id);

  if (!tweet) {
    return res.status(404).json({
      error: "Tweet not found",
    });
  }

  res.json(tweet);
}

export function postTweet(
  req: Request,
  res: Response
) {
  const tweet = createTweet(
    req.body.text,
    "alice"
  );

  res.status(201).json(tweet);
}

export function removeTweet(
  req: Request,
  res: Response
) {
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
}