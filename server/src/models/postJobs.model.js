import mongoose from "mongoose";

const postJobsSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
    },
    companyName: {
        type: String,
        required: [true, "Company name is required"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    jobType: {
        type: String,
        required: [true, "Job type is required"],
        enum: ["Full-time", "Part-time", "Contract", "Remote"]
    },
    saleryRange: {
        type: String,
        required: [true, "Salary range is required"],
    },
    experienceLevel: {
        type: String,
        required: [true, "Experience level is required"],
        enum: ["Mid-level", "Senior-level", "Executive"]
    },
    contactEmail: {
        type: String,
        required: [true, "Contact email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    applicationDeadline: {
        type: Date,
        required: [true, "Application deadline is required"],
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    companyDescription: {
        type: String,
        required: [true, "Company description is required"],
    },
    requirements: {
        type:[String],
        required: [true, "Requirements are required"],
        default: []
    },
    skills: {
        type: [String],
        required: [true, "Skills are required"],
        default: []
    },
    benefits: {
        type: [String],
        required: [true, "Benefits are required"],
        default: []
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

export const PostJobs = mongoose.model("PostJobs", postJobsSchema);