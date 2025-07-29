import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    linkedinUrl: String,
    portfolioUrl: String,
    githubUrl: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  professionalInfo: {
    currentTitle: String,
    yearsOfExperience: Number,
    summary: String,
    skills: [String],
    preferredJobTypes: [String],
    preferredLocations: [String],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: String
    },
    jobAlertFrequency: String
  },
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: String,
    gpa: String,
    startDate: Date,
    endDate: Date,
    isCurrentlyStudying:
    {
      type: Boolean,
      default: false

    },
    description: String
  }],
  experience: [{
    company:
    {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: Date,
    endDate: Date,
    isCurrentPosition:
    {
      type: Boolean,
      default: false

    },
    description: String,
    location: String
  }],

},
  {
    timestamps: true
  });

export const AdminProfile = mongoose.model('AdminProfile', adminProfileSchema);