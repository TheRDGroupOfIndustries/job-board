import { UserProfile } from "../models/userProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "jobseeker") {
    throw new ApiError(403, "Only jobseekers can create a profile");
  }

  const existingProfile = await UserProfile.findOne({ userId: user._id });
  if (existingProfile) {
    throw new ApiError(409, "Profile already exists for this user");
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    portfolioUrl,
    githubUrl,
    street,
    city,
    state,
    zipCode,
    country,
    currentTitle,
    yearsOfExperience,
    summary,
    skills,
    preferredJobTypes,
    preferredLocations,
    expectedSalaryMin,
    expectedSalaryMax,
    currency,
    jobAlertFrequency,
    education,
    experience,
    resumeFileName,
    resumeFileUrl,
    resumeUploadedAt,
    resumeFileSize,
    coverLetterContent,
    coverLetterLastUpdated
  } = req.body;

  if (!firstName || !lastName || !email) {
    throw new ApiError(400, "FirstName, lastName, and email are required");
  }
  if (!education || !Array.isArray(education) || education.some(edu => !edu.institution || !edu.degree)) {
    throw new ApiError(400, "Education must be an array with institution and degree for each entry");
  }
  if (!experience || !Array.isArray(experience) || experience.some(exp => !exp.company || !exp.position)) {
    throw new ApiError(400, "Experience must be an array with company and position for each entry");
  }


  const profile = await UserProfile.create({
    userId: user._id,
    personalInfo: {
      firstName,
      lastName,
      email,
      phone: phone || "",
      linkedinUrl: linkedinUrl || "",
      portfolioUrl: portfolioUrl || "",
      githubUrl: githubUrl || "",
      address: {
        street: street || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        country: country || ""
      }
    },
    professionalInfo: {
      currentTitle: currentTitle || "",
      yearsOfExperience: yearsOfExperience || 0,
      summary: summary || "",
      skills: skills || [],
      preferredJobTypes: preferredJobTypes || [],
      preferredLocations: preferredLocations || [],
      expectedSalary: {
        min: expectedSalaryMin || 0,
        max: expectedSalaryMax || 0,
        currency: currency || ""
      },
      jobAlertFrequency: jobAlertFrequency || ""
    },
    education: education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || "",
      gpa: edu.gpa || "",
      startDate: edu.startDate || null,
      endDate: edu.endDate || null,
      isCurrentlyStudying: edu.isCurrentlyStudying || false,
      description: edu.description || ""
    })),
    experience: experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      isCurrentPosition: exp.isCurrentPosition || false,
      description: exp.description || "",
      location: exp.location || ""
    })),
    resume: {
      fileName: resumeFileName || "",
      fileUrl: resumeFileUrl || "",
      uploadedAt: resumeUploadedAt || new Date(),
      fileSize: resumeFileSize || 0
    },
    coverLetter: {
      content: coverLetterContent || "",
      lastUpdated: coverLetterLastUpdated || new Date()
    }
  });

 
  res.status(201).json(
    new ApiResponse(201, {
      userId: profile.userId,
      personalInfo: profile.personalInfo,
      professionalInfo: profile.professionalInfo,
      education: profile.education,
      experience: profile.experience,
      resume: profile.resume,
      coverLetter: profile.coverLetter,
      _id: profile._id,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      __v: profile.__v
    }, "Profile created successfully")
  );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "jobseeker") {
    throw new ApiError(403, "Only jobseekers can update their profile");
  }

  const profile = await UserProfile.findOne({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Jobseeker profile not found");
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    portfolioUrl,
    githubUrl,
    street,
    city,
    state,
    zipCode,
    country,
    currentTitle,
    yearsOfExperience,
    summary,
    skills,
    preferredJobTypes,
    preferredLocations,
    expectedSalaryMin,
    expectedSalaryMax,
    currency,
    jobAlertFrequency,
    education,
    experience,
    resumeFileName,
    resumeFileUrl,
    resumeUploadedAt,
    resumeFileSize,
    coverLetterContent,
    coverLetterLastUpdated
  } = req.body;


  if (firstName !== undefined) profile.personalInfo.firstName = firstName;
  if (lastName !== undefined) profile.personalInfo.lastName = lastName;
  if (email !== undefined) profile.personalInfo.email = email;
  if (phone !== undefined) profile.personalInfo.phone = phone;
  if (linkedinUrl !== undefined) profile.personalInfo.linkedinUrl = linkedinUrl;
  if (portfolioUrl !== undefined) profile.personalInfo.portfolioUrl = portfolioUrl;
  if (githubUrl !== undefined) profile.personalInfo.githubUrl = githubUrl;
  
 
  if (street !== undefined) profile.personalInfo.address.street = street;
  if (city !== undefined) profile.personalInfo.address.city = city;
  if (state !== undefined) profile.personalInfo.address.state = state;
  if (zipCode !== undefined) profile.personalInfo.address.zipCode = zipCode;
  if (country !== undefined) profile.personalInfo.address.country = country;


  if (currentTitle !== undefined) profile.professionalInfo.currentTitle = currentTitle;
  if (yearsOfExperience !== undefined) profile.professionalInfo.yearsOfExperience = yearsOfExperience;
  if (summary !== undefined) profile.professionalInfo.summary = summary;
  if (skills !== undefined) {
    if (!Array.isArray(skills)) throw new ApiError(400, "Skills must be an array");
    profile.professionalInfo.skills = skills;
  }
  if (preferredJobTypes !== undefined) {
    if (!Array.isArray(preferredJobTypes)) throw new ApiError(400, "Preferred job types must be an array");
    profile.professionalInfo.preferredJobTypes = preferredJobTypes;
  }
  if (preferredLocations !== undefined) {
    if (!Array.isArray(preferredLocations)) throw new ApiError(400, "Preferred locations must be an array");
    profile.professionalInfo.preferredLocations = preferredLocations;
  }
  if (expectedSalaryMin !== undefined) profile.professionalInfo.expectedSalary.min = expectedSalaryMin;
  if (expectedSalaryMax !== undefined) profile.professionalInfo.expectedSalary.max = expectedSalaryMax;
  if (currency !== undefined) profile.professionalInfo.expectedSalary.currency = currency;
  if (jobAlertFrequency !== undefined) profile.professionalInfo.jobAlertFrequency = jobAlertFrequency;

 
  if (education !== undefined) {
    if (!Array.isArray(education)) throw new ApiError(400, "Education must be an array");
    if (education.some(edu => !edu.institution || !edu.degree)) {
      throw new ApiError(400, "Each education entry must include institution and degree");
    }
    profile.education = education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || "",
      gpa: edu.gpa || "",
      startDate: edu.startDate || null,
      endDate: edu.endDate || null,
      isCurrentlyStudying: edu.isCurrentlyStudying || false,
      description: edu.description || ""
    }));
  }


  if (experience !== undefined) {
    if (!Array.isArray(experience)) throw new ApiError(400, "Experience must be an array");
    if (experience.some(exp => !exp.company || !exp.position)) {
      throw new ApiError(400, "Each experience entry must include company and position");
    }
    profile.experience = experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      isCurrentPosition: exp.isCurrentPosition || false,
      description: exp.description || "",
      location: exp.location || ""
    }));
  }


  if (resumeFileName !== undefined) profile.resume.fileName = resumeFileName;
  if (resumeFileUrl !== undefined) profile.resume.fileUrl = resumeFileUrl;
  if (resumeUploadedAt !== undefined) profile.resume.uploadedAt = resumeUploadedAt;
  if (resumeFileSize !== undefined) profile.resume.fileSize = resumeFileSize;


  if (coverLetterContent !== undefined) profile.coverLetter.content = coverLetterContent;
  if (coverLetterLastUpdated !== undefined) profile.coverLetter.lastUpdated = coverLetterLastUpdated;

  await profile.save();
  res.status(200).json(new ApiResponse(200, profile, "Profile updated successfully"));
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "jobseeker") {
    throw new ApiError(403, "Only jobseekers can access their profile");
  }

  const profile = await UserProfile.findOne({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Jobseeker profile not found");
  }

  res.status(200).json(
    new ApiResponse(200, {
      userId: profile.userId,
      personalInfo: profile.personalInfo,
      professionalInfo: profile.professionalInfo,
      education: profile.education,
      experience: profile.experience,
      resume: profile.resume,
      coverLetter: profile.coverLetter,
      _id: profile._id,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      __v: profile.__v
    }, "Profile retrieved successfully")
  );
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "jobseeker") {
    throw new ApiError(403, "Only jobseekers can delete their profile");
  }

  const profile = await UserProfile.findOneAndDelete({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Jobseeker profile not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Profile deleted successfully"));
});

export { createUserProfile, updateUserProfile, deleteUserProfile, getUserProfile };