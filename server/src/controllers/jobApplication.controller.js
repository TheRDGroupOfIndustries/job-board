import { JobApplication } from "../models/jobApplication.model.js";
import { PostJobs } from "../models/postJobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (req.user.role !== "jobseeker") {
    throw new ApiError(403, "Only jobseekers can apply to jobs");
  }
  const job = await PostJobs.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  const alreadyApplied = await JobApplication.findOne({
    user: req.user._id,
    job: jobId,
  });

  if (alreadyApplied) {
    throw new ApiError(400, "Already applied to this job");
  }
  const application = await JobApplication.create({
    user: req.user._id,
    job: jobId,
  });
  res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"));
});

export const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ user: req.user._id })
    .populate("job", "jobTitle companyName Location")
    .select("job status appliedAt");

  if (!applications || applications.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No applications found"));
  }
  res.status(200).json(new ApiResponse(200, applications, "User applications fetched successfully"));
});

// export const getCompanyApplications = asyncHandler(async (req, res) => {
//   const user = req.user; 
//   if (user.role !== 'company') {
//     throw new ApiError(403, 'Only companies can view applications');
//   }

//   const applications = await JobApplication.find({ jobId: { $in: await PostJobs.find({ createdBy: user._id }).distinct('_id') } })
//     .populate('jobId', 'title') 
//     .populate('applicantId', 'firstName lastName email');

//   if (!applications || applications.length === 0) {
//     throw new ApiError(404, 'No applications found for your jobs');
//   }

//   res.status(200).json(new ApiResponse(200, applications, 'Applications fetched successfully'));
// });

export const getCompanyApplications = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== 'company') {
    throw new ApiError(403, 'Only companies can view applications');
  }

  const jobs = await PostJobs.find({ createdBy: user._id });
  const jobIds = jobs.map(job => job._id);
  
  const applications = await JobApplication.find({ job: { $in: jobIds } })
    .populate('user', 'firstName lastName email')
    .populate('job', 'jobTitle');

  return res.status(200).json(
    new ApiResponse(
      200, 
      applications || [], 
      applications.length ? 'Applications fetched successfully' : 'No applications found'
    )
  );
});
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId, status } = req.body;

  if (req.user.role !== "company") {
    throw new ApiError(403, "Only companies can update application status");
  }

  const application = await JobApplication.findById(applicationId).populate("job");
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this application");
  }

  if (!["Applied", "Under Review", "Shortlisted", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  application.status = status;
  await application.save();

  res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
});