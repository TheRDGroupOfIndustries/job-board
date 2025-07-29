import { CompanyProfile } from "../models/companyProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCompanyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can create a profile");
  }

  const existingProfile = await CompanyProfile.findOne({ userId: user._id });
  if (existingProfile) {
    throw new ApiError(409, "Profile already exists for this company");
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
    education,
    experience,
  } = req.body;

  if (!firstName || !lastName || !email) {
    throw new ApiError(400, "FirstName, lastName, and email are required");
  }
  if (!education || !Array.isArray(education)) {
    throw new ApiError(400, "Education must be an array");
  }
  if (!experience || !Array.isArray(experience)) {
    throw new ApiError(400, "Experience must be an array");
  }

  const profile = await CompanyProfile.create({
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
      }
    },
    education: education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate || null,
      endDate: edu.endDate || null,
      grade: edu.grade || "",
      description: edu.description || ""
    })),
    experience: experience.map(exp => ({
      company: exp.company,
      title: exp.title,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      location: exp.location || "",
      description: exp.description || ""
    }))
  });

  res.status(201).json(
    new ApiResponse(201, profile, "Company profile created successfully")
  );
});


const updateCompanyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can update their profile");
  }

  const profile = await CompanyProfile.findOne({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Company profile not found");
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
    education,
    experience,
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
  if (skills !== undefined) profile.professionalInfo.skills = skills;
  if (preferredJobTypes !== undefined) profile.professionalInfo.preferredJobTypes = preferredJobTypes;
  if (preferredLocations !== undefined) profile.professionalInfo.preferredLocations = preferredLocations;
  if (expectedSalaryMin !== undefined) profile.professionalInfo.expectedSalary.min = expectedSalaryMin;
  if (expectedSalaryMax !== undefined) profile.professionalInfo.expectedSalary.max = expectedSalaryMax;
  if (currency !== undefined) profile.professionalInfo.expectedSalary.currency = currency;

  if (education !== undefined) {
    if (!Array.isArray(education)) throw new ApiError(400, "Education must be an array");
    profile.education = education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate || null,
      endDate: edu.endDate || null,
      grade: edu.grade || "",
      description: edu.description || ""
    }));
  }

  if (experience !== undefined) {
    if (!Array.isArray(experience)) throw new ApiError(400, "Experience must be an array");
    profile.experience = experience.map(exp => ({
      company: exp.company,
      title: exp.title,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      location: exp.location || "",
      description: exp.description || ""
    }));
  }

  await profile.save();
  res.status(200).json(new ApiResponse(200, profile, "Company profile updated successfully"));
});

const getCompanyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can view their profile");
  }

  const profile = await CompanyProfile.findOne({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Company profile not found");
  }

  res.status(200).json(new ApiResponse(200, profile, "Company profile fetched successfully"));
});
const deleteCompanyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "company") {
    throw new ApiError(403, "Only companies can delete their profile");
  }

  const profile = await CompanyProfile.findOneAndDelete({ userId: user._id });
  if (!profile) {
    throw new ApiError(404, "Company profile not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Company profile deleted successfully"));
});

export { createCompanyProfile, updateCompanyProfile, deleteCompanyProfile,getCompanyProfile };