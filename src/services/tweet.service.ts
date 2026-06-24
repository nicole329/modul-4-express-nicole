type Tweet = {
  id: number;
  text: string;
  author: string;
};

const tweets: Tweet[] = [
  {
    id: 1,
    text: "Hallo Twitter",
    author: "alice",
  },
  {
    id: 2,
    text: "Mein zweiter Tweet",
    author: "bob",
  },
];

export function getAllTweets() {
  return tweets;
}

export function getTweetById(id: number) {
  return tweets.find((tweet) => tweet.id === id);
}

export function createTweet(
  text: string,
  author: string
) {
  const tweet: Tweet = {
    id: tweets.length + 1,
    text,
    author,
  };

  tweets.push(tweet);

  return tweet;
}

export function deleteTweet(id: number) {
  const index = tweets.findIndex(
    (tweet) => tweet.id === id
  );

  if (index === -1) {
    return false;
  }

  tweets.splice(index, 1);

  return true;
}
