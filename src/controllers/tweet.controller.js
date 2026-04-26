import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  // get content from frontend
  const { content } = req.body;

  // validate
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  // get current user using id
  const userId = await User.findById(req.user?._id).select("_id");

  if (!userId) {
    throw new ApiError(400, "User not found, please login first");
  }

  // create tweet
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating tweet");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  console.log(userId);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User not found");
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        "owner.email": 0,
        "owner.watchHistory": 0,
        "owner.password": 0,
        "owner.createdAt": 0,
        "owner.updatedAt": 0,
        "owner.refreshToken": 0,
      },
    },
    {
      $project: {
        content: 1,
        "owner.username": 1,
        "owner.fullName": 1,
        "owner.avatar": 1,
        "owner.coverImage": 1,
      },
    },
  ]);

  console.log(tweets);

  if (!tweets) {
    throw new ApiError(400, "No tweets found under this user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  const { tweetId } = req.params;

  console.log(tweetId);

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required to update the tweet");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweet id is invalid");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    {
      _id: tweetId,
      owner: req.user?._id,
    },
    {
      content,
    },
    {
      new: true,
    }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Something went wrong while updating the tweet");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweet id is invalid");
  }

  const deletedTweet = await Tweet.deleteOne({
    _id: tweetId,
    owner: req.user?._id,
  });

  console.log(deletedTweet);

  if (deletedTweet.deletedCount < 1) {
    throw new ApiError(
      400,
      "Tweet not found or you are not authorized to delete it"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(204, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
