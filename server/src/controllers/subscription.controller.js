import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSubscription = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can purchase subscriptions");
  }

  const existingSubscription = await Subscription.findOne({ userId: user._id });
  if (existingSubscription && existingSubscription.status === 'active') {
    throw new ApiError(409, "You already have an active subscription");
  }

 
  const { paymentId } = req.body; 
  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }


  const isPaymentValid = true; 

  if (!isPaymentValid) {
    throw new ApiError(400, "Payment verification failed");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 30);

  const subscription = await Subscription.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      status: 'active',
      startDate,
      endDate,
      jobPostLimit: 50, 
      paymentStatus: 'completed',
      paymentId
    },
    { upsert: true, new: true }
  );

  res.status(201).json(new ApiResponse(201, subscription, "Subscription created successfully"));
});

const getSubscription = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can view subscriptions");
  }

  const subscription = await Subscription.findOne({ userId: user._id });
  if (!subscription) {
    throw new ApiError(404, "No subscription found for this user");
  }

  res.status(200).json(new ApiResponse(200, subscription, "Subscription fetched successfully"));
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can cancel subscriptions");
  }

  const subscription = await Subscription.findOne({ userId: user._id });
  if (!subscription) {
    throw new ApiError(404, "No subscription found for this user");
  }

  if (subscription.status !== 'active') {
    throw new ApiError(400, "No active subscription to cancel");
  }

  subscription.status = 'inactive';
  subscription.jobPostLimit = 5; 
  await subscription.save();

  res.status(200).json(new ApiResponse(200, subscription, "Subscription cancelled successfully"));
});

export { createSubscription, getSubscription, cancelSubscription };