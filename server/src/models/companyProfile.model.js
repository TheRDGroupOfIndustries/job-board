import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    githubUrl: { type: String },
  },

  professionalInfo: {
    currentTitle: { type: String },
    yearsOfExperience: { type: Number },
    summary: { type: String },
    skills: [{ type: String }],
    preferredJobTypes: [{ type: String }],
    preferredLocations: [{ type: String }],
    expectedSalary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String },
    },
  },

  education: [
    {
      institution: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      isCurrentlyStudying: { type: Boolean, default: false },
      grade: { type: String },
      description: { type: String },
     
    },
  ],

  experience: [
    {
      company: { type: String },
      title: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      isCurrentPosition: { type: Boolean, default: false },
      location: { type: String },
      description: { type: String },
     
    },
  ],
}, {
  timestamps: true,
});

export const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);