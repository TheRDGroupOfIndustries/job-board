import { PostJobs } from "../models/postJobs.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const postJobs = asyncHandler(async (req, res) => {
  const { jobTitle, companyName, location, jobType, saleryRange, experienceLevel, contactEmail, applicationDeadline, jobDescription, companyDescription, requirements, skills, benefits } = req.body;

  if (!jobTitle || !companyName || !location || !jobType || !saleryRange || !experienceLevel || !contactEmail || !applicationDeadline || !jobDescription || !companyDescription || !requirements || !skills || !benefits) {
    throw new ApiError(400, "All fields are required.");
  }


  if (req.user.role !== "company") {
    throw new ApiError(403, "Only companies can post jobs");
  }


  const subscription = await Subscription.findOne({ userId: req.user._id });
  const jobCount = await PostJobs.countDocuments({ createdBy: req.user._id });

  const jobPostLimit = subscription && subscription.status === 'active' && subscription.endDate > new Date()
    ? subscription.jobPostLimit
    : 5;

  if (jobCount >= jobPostLimit) {
    throw new ApiError(403, "Job post limit reached. Please purchase a subscription to post more jobs.");
  }

  const postJob = await PostJobs.create({
    jobTitle,
    companyName,
    location,
    jobType,
    saleryRange,
    experienceLevel,
    contactEmail,
    applicationDeadline,
    jobDescription,
    companyDescription,
    requirements,
    skills,
    benefits,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, postJob, "Job posted successfully"));
});

const getAllPostedJobs = asyncHandler(async (req, res) => {

  try {
    const jobs = await PostJobs.find().populate("createdBy", "email");
    if (!jobs || jobs.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No jobs found"));
    }
    res.status(200).json(new ApiResponse(200, jobs, "All posted jobs fetched successfully"));

  } catch (error) {
    console.log(error);

  }

});

// export const getAllPostedJobs = asyncHandler(async (req, res) => {
//   if (!req.user) {
//     throw new ApiError(401, 'User not authenticated');
//   }

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
//   const jobs = await PostJobs.find(query)
//     .populate('createdBy', 'email companyName')
//     .skip(skip)
//     .limit(limit);
//   const total = await PostJobs.countDocuments(query);

//   if (!jobs.length) {
//     return res.status(200).json(new ApiResponse(200, { jobs: [], total, page, totalPages: Math.ceil(total / limit) }, 'No jobs found'));
//   }

//   res.status(200).json(new ApiResponse(200, { jobs, total, page, totalPages: Math.ceil(total / limit) }, 'Jobs fetched successfully'));
// });
const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await PostJobs.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const updates = req.body;
  const updatedJob = await PostJobs.findByIdAndUpdate(jobId, updates, { new: true, runValidators: true });
  res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

const deleteJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await PostJobs.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this job");
  }

  await job.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Job deleted successfully"));
});

export const getCompanyPostedJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== "company") {
    throw new ApiError(403, "Only company can access their jobs");
  }

  const jobs = await PostJobs.find({ createdBy: req.user._id });

  res.status(200).json(
    new ApiResponse(200, jobs, "Company posted jobs fetched successfully")
  );
});


export { postJobs,updateJob, deleteJob,getAllPostedJobs };