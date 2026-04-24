import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  const healthData = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  };

  res.status(200).json(new ApiResponse(200, healthData, "Health check passed"));
});

export { healthcheck };
