import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser, FaMapMarkerAlt, FaBriefcase, FaSave,
  FaTrash, FaEnvelope, FaPhoneAlt, FaFilePdf, FaGraduationCap, FaBuilding
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import USerNav from "./USerNav";
import { createProfile } from "../../API";

const Input = ({ label, hint, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>}
    <input
      {...props}
      className={`w-full border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 ${props.disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, hint, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>}
    <textarea
      {...props}
      rows={4}
      className={`w-full border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 ${props.disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Section = ({ icon, title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
    <h2 className="flex items-center text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    {children}
  </div>
);

const UserProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: "", lastName: "", email: "", phone: "",
      linkedinUrl: "", githubUrl: "", portfolioUrl: "",
      address: { street: "", city: "", state: "", zipCode: "", country: "" }
    },
    professionalInfo: {
      currentTitle: "", yearsOfExperience: 0, summary: "",
      skills: [], preferredJobTypes: [], preferredLocations: [],
      expectedSalary: { min: 0, max: 0, currency: "" },
      jobAlertFrequency: ""
    },
    education: [{ institution: "", degree: "", fieldOfStudy: "", gpa: "", startDate: "", endDate: "", isCurrentlyStudying: false, description: "" }],
    experience: [{ company: "", position: "", startDate: "", endDate: "", isCurrentPosition: false, description: "", location: "" }],
    resume: { fileName: "", fileUrl: "", uploadedAt: "", fileSize: 0 },
    coverLetter: { content: "", lastUpdated: "" }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!profile.personalInfo.firstName) newErrors.firstName = "First name is required";
    if (!profile.personalInfo.lastName) newErrors.lastName = "Last name is required";
    if (!profile.personalInfo.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.personalInfo.email)) newErrors.email = "Invalid email format";
    if (profile.personalInfo.phone && !/^\+?\d{10,15}$/.test(profile.personalInfo.phone)) newErrors.phone = "Invalid phone number";
    if (profile.personalInfo.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com/.test(profile.personalInfo.linkedinUrl)) newErrors.linkedinUrl = "Invalid LinkedIn URL";
    if (profile.personalInfo.githubUrl && !/^https?:\/\/(www\.)?github\.com/.test(profile.personalInfo.githubUrl)) newErrors.githubUrl = "Invalid GitHub URL";
    if (profile.personalInfo.portfolioUrl && !/^https?:\/\/.+/.test(profile.personalInfo.portfolioUrl)) newErrors.portfolioUrl = "Invalid Portfolio URL";
    if (profile.professionalInfo.yearsOfExperience < 0) newErrors.yearsOfExperience = "Years of experience cannot be negative";
    if (profile.professionalInfo.expectedSalary.min < 0) newErrors.expectedSalaryMin = "Minimum salary cannot be negative";
    if (profile.professionalInfo.expectedSalary.max < profile.professionalInfo.expectedSalary.min) newErrors.expectedSalaryMax = "Maximum salary must be greater than or equal to minimum";
    profile.education.forEach((edu, index) => {
      if (!edu.institution) newErrors[`education[${index}].institution`] = "Institution is required";
      if (!edu.degree) newErrors[`education[${index}].degree`] = "Degree is required";
    });
    profile.experience.forEach((exp, index) => {
      if (!exp.company) newErrors[`experience[${index}].company`] = "Company is required";
      if (!exp.position) newErrors[`experience[${index}].position`] = "Position is required";
    });
    if (profile.resume.fileUrl && !/^https?:\/\/.+/.test(profile.resume.fileUrl)) newErrors.resumeFileUrl = "Invalid resume URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, section, field, subfield) => {
    const { value } = e.target;
    if (section === "personalInfo" && subfield === "address") {
      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          address: { ...prev.personalInfo.address, [field]: value }
        }
      }));
    } else if (section === "personalInfo") {
      setProfile(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value }
      }));
    } else if (section === "professionalInfo") {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          [field]: field === "yearsOfExperience" || field === "min" || field === "max" ? Number(value) || 0 : value
        }
      }));
    } else if (section === "expectedSalary") {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          expectedSalary: { ...prev.professionalInfo.expectedSalary, [field]: Number(value) || 0 }
        }
      }));
    } else if (section === "resume") {
      setProfile(prev => ({
        ...prev,
        resume: { ...prev.resume, [field]: field === "fileSize" ? Number(value) || 0 : value }
      }));
    } else if (section === "coverLetter") {
      setProfile(prev => ({
        ...prev,
        coverLetter: { ...prev.coverLetter, [field]: value }
      }));
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

const handleArrayChange = (e, field) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s)
      }
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };


  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: field === "isCurrentlyStudying" ? value : value };
    setProfile(prev => ({ ...prev, education: updatedEducation }));
    setErrors(prev => ({ ...prev, [`education[${index}].${field}`]: undefined }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", fieldOfStudy: "", gpa: "", startDate: "", endDate: "", isCurrentlyStudying: false, description: "" }]
    }));
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`education[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profile.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: field === "isCurrentPosition" ? value : value };
    setProfile(prev => ({ ...prev, experience: updatedExperience }));
    setErrors(prev => ({ ...prev, [`experience[${index}].${field}`]: undefined }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", startDate: "", endDate: "", isCurrentPosition: false, description: "", location: "" }]
    }));
  };

  const removeExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`experience[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to create a profile.");
      navigate("/auth/login");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    setLoading(true);
    setFetchError("");

    try {
      // Save to localStorage
      if (profile.professionalInfo.skills.length > 0) {
        const lowerCaseSkills = profile.professionalInfo.skills.map(skill => skill.toLowerCase());
        localStorage.setItem("userSkills", JSON.stringify(lowerCaseSkills));
        toast.success("Skills saved for job filtering.");
      }

      if (profile.professionalInfo.currentTitle) {
        localStorage.setItem("userField", profile.professionalInfo.currentTitle.toLowerCase());
        toast.success("Current title saved for job field.");
      }

      if (profile.personalInfo.firstName && profile.personalInfo.lastName) {
        const fullName = `${profile.personalInfo.firstName.trim()} ${profile.personalInfo.lastName.trim()}`;
        localStorage.setItem("userFullName", fullName);
      }

      localStorage.setItem("userProfile", JSON.stringify({
        ...profile,
        professionalInfo: {
          ...profile.professionalInfo,
          yearsOfExperience: Number(profile.professionalInfo.yearsOfExperience),
          expectedSalary: {
            ...profile.professionalInfo.expectedSalary,
            min: Number(profile.professionalInfo.expectedSalary.min),
            max: Number(profile.professionalInfo.expectedSalary.max)
          }
        },
        resume: {
          ...profile.resume,
          fileSize: Number(profile.resume.fileSize)
        }
      }));

      // Prepare payload for backend
      const payload = {
        firstName: profile.personalInfo.firstName,
        lastName: profile.personalInfo.lastName,
        email: profile.personalInfo.email,
        phone: profile.personalInfo.phone,
        linkedinUrl: profile.personalInfo.linkedinUrl,
        githubUrl: profile.personalInfo.githubUrl,
        portfolioUrl: profile.personalInfo.portfolioUrl,
        street: profile.personalInfo.address.street,
        city: profile.personalInfo.address.city,
        state: profile.personalInfo.address.state,
        zipCode: profile.personalInfo.address.zipCode,
        country: profile.personalInfo.address.country,
        currentTitle: profile.professionalInfo.currentTitle,
        yearsOfExperience: Number(profile.professionalInfo.yearsOfExperience),
        summary: profile.professionalInfo.summary,
        skills: profile.professionalInfo.skills,
        preferredJobTypes: profile.professionalInfo.preferredJobTypes,
        preferredLocations: profile.professionalInfo.preferredLocations,
        expectedSalaryMin: Number(profile.professionalInfo.expectedSalary.min),
        expectedSalaryMax: Number(profile.professionalInfo.expectedSalary.max),
        currency: profile.professionalInfo.expectedSalary.currency,
        jobAlertFrequency: profile.professionalInfo.jobAlertFrequency,
        education: profile.education,
        experience: profile.experience,
        resumeFileName: profile.resume.fileName,
        resumeFileUrl: profile.resume.fileUrl,
        resumeUploadedAt: profile.resume.uploadedAt,
        resumeFileSize: Number(profile.resume.fileSize),
        coverLetterContent: profile.coverLetter.content,
        coverLetterLastUpdated: profile.coverLetter.lastUpdated || new Date().toISOString()
      };

      const res = await createProfile(payload)

      if (res.status === 200 || res.status === 201) {
        toast.success("Profile saved successfully!");
        navigate("/jobseeker-dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save profile. Please try again.";
      setFetchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!token) {
//     toast.error("Please log in to create a profile.");
//     navigate("/auth/login");
//     return;
//   }

//   if (!validateForm()) {
//     toast.error("Please fix the errors in the form before submitting.");
//     return;
//   }

//   setLoading(true);
//   setFetchError("");

//   try {
//     // Save to localStorage
//     if (profile.professionalInfo.skills.length > 0) {
//       const lowerCaseSkills = profile.professionalInfo.skills.map(skill => skill.toLowerCase());
//       localStorage.setItem("userSkills", JSON.stringify(lowerCaseSkills));
//       toast.success("Skills saved for job filtering.");
//     }

//     if (profile.professionalInfo.currentTitle) {
//       localStorage.setItem("userField", profile.professionalInfo.currentTitle.toLowerCase());
//       toast.success("Current title saved for job field.");
//     }

//     if (profile.personalInfo.firstName && profile.personalInfo.lastName) {
//       const fullName = `${profile.personalInfo.firstName.trim()} ${profile.personalInfo.lastName.trim()}`;
//       localStorage.setItem("userFullName", fullName);
//     }

//     localStorage.setItem("userProfile", JSON.stringify({
//       ...profile,
//       professionalInfo: {
//         ...profile.professionalInfo,
//         yearsOfExperience: Number(profile.professionalInfo.yearsOfExperience),
//         expectedSalary: {
//           ...profile.professionalInfo.expectedSalary,
//           min: Number(profile.professionalInfo.expectedSalary.min),
//           max: Number(profile.professionalInfo.expectedSalary.max)
//         }
//       },
//       resume: {
//         ...profile.resume,
//         fileSize: Number(profile.resume.fileSize)
//       }
//     }));

//     // Prepare payload for backend
//     const payload = {
//       firstName: profile.personalInfo.firstName,
//       lastName: profile.personalInfo.lastName,
//       email: profile.personalInfo.email,
//       phone: profile.personalInfo.phone,
//       linkedinUrl: profile.personalInfo.linkedinUrl,
//       githubUrl: profile.personalInfo.githubUrl,
//       portfolioUrl: profile.personalInfo.portfolioUrl,
//       street: profile.personalInfo.address.street,
//       city: profile.personalInfo.address.city,
//       state: profile.personalInfo.address.state,
//       zipCode: profile.personalInfo.address.zipCode,
//       country: profile.personalInfo.address.country,
//       currentTitle: profile.professionalInfo.currentTitle,
//       yearsOfExperience: Number(profile.professionalInfo.yearsOfExperience),
//       summary: profile.professionalInfo.summary,
//       skills: profile.professionalInfo.skills,
//       preferredJobTypes: profile.professionalInfo.preferredJobTypes,
//       preferredLocations: profile.professionalInfo.preferredLocations,
//       expectedSalaryMin: Number(profile.professionalInfo.expectedSalary.min),
//       expectedSalaryMax: Number(profile.professionalInfo.expectedSalary.max),
//       currency: profile.professionalInfo.expectedSalary.currency,
//       jobAlertFrequency: profile.professionalInfo.jobAlertFrequency,
//       education: profile.education,
//       experience: profile.experience,
//       resumeFileName: profile.resume.fileName,
//       resumeFileUrl: profile.resume.fileUrl,
//       resumeUploadedAt: profile.resume.uploadedAt,
//       resumeFileSize: Number(profile.resume.fileSize),
//       coverLetterContent: profile.coverLetter.content,
//       coverLetterLastUpdated: profile.coverLetter.lastUpdated || new Date().toISOString()
//     };

//     const res = await createProfile(payload, true); // Ensure auth is true
//     if (res.status === 200 || res.status === 201) {
//       toast.success("Profile saved successfully!");
//       navigate("/jobseeker-dashboard");
//     }
//   } catch (err) {
//     const errorMessage = err.response?.data?.message || "Failed to save profile. Please try again.";
//     setFetchError(errorMessage);
//     toast.error(errorMessage);
//     if (err.response?.status === 401) {
//       // Token might be invalid or expired
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/auth/login");
//     }
//   } finally {
//     setLoading(false);
//   }
// };
  const handleClear = () => {
    setProfile({
      personalInfo: {
        firstName: "", lastName: "", email: "", phone: "",
        linkedinUrl: "", githubUrl: "", portfolioUrl: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "" }
      },
      professionalInfo: {
        currentTitle: "", yearsOfExperience: 0, summary: "",
        skills: [], preferredJobTypes: [], preferredLocations: [],
        expectedSalary: { min: 0, max: 0, currency: "" },
        jobAlertFrequency: ""
      },
      education: [{ institution: "", degree: "", fieldOfStudy: "", gpa: "", startDate: "", endDate: "", isCurrentlyStudying: false, description: "" }],
      experience: [{ company: "", position: "", startDate: "", endDate: "", isCurrentPosition: false, description: "", location: "" }],
      resume: { fileName: "", fileUrl: "", uploadedAt: "", fileSize: 0 },
      coverLetter: { content: "", lastUpdated: "" }
    });
    setErrors({});
    setFetchError("");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userSkills");
    localStorage.removeItem("userField");
    localStorage.removeItem("userFullName");
    toast.success("Profile cleared successfully.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <USerNav />
      <div className="bg-gradient-to-br from-[#eef2f7] to-[#f9f9fb] min-h-screen py-10 px-4 md:px-10">
        {fetchError && (
          <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {fetchError}
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10">
              {localStorage.getItem("userProfile") ? "Edit Your Job Profile" : "Create Your Job Profile"}
            </h1>
            <form onSubmit={handleSubmit}>
              <Section icon={<FaUser />} title="Personal Information">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => handleChange(e, "personalInfo", "firstName")}
                    required
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => handleChange(e, "personalInfo", "lastName")}
                    required
                    error={errors.lastName}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleChange(e, "personalInfo", "email")}
                    required
                    error={errors.email}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleChange(e, "personalInfo", "phone")}
                    error={errors.phone}
                  />
                </div>
              </Section>
              <Section icon={<FaUser />} title="Social Profiles">
                <Input
                  label="LinkedIn"
                  name="linkedinUrl"
                  value={profile.personalInfo.linkedinUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "linkedinUrl")}
                  error={errors.linkedinUrl}
                />
                <Input
                  label="GitHub"
                  name="githubUrl"
                  value={profile.personalInfo.githubUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "githubUrl")}
                  error={errors.githubUrl}
                />
                <Input
                  label="Portfolio"
                  name="portfolioUrl"
                  value={profile.personalInfo.portfolioUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "portfolioUrl")}
                  error={errors.portfolioUrl}
                />
              </Section>
              <Section icon={<FaMapMarkerAlt />} title="Address">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    name="street"
                    value={profile.personalInfo.address.street}
                    onChange={(e) => handleChange(e, "personalInfo", "street", "address")}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={profile.personalInfo.address.city}
                    onChange={(e) => handleChange(e, "personalInfo", "city", "address")}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={profile.personalInfo.address.state}
                    onChange={(e) => handleChange(e, "personalInfo", "state", "address")}
                  />
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    value={profile.personalInfo.address.zipCode}
                    onChange={(e) => handleChange(e, "personalInfo", "zipCode", "address")}
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={profile.personalInfo.address.country}
                    onChange={(e) => handleChange(e, "personalInfo", "country", "address")}
                  />
                </div>
              </Section>
              <Section icon={<FaBriefcase />} title="Professional Details">
                <Input
                  label="Current Title"
                  name="currentTitle"
                  value={profile.professionalInfo.currentTitle}
                  onChange={(e) => handleChange(e, "professionalInfo", "currentTitle")}
                />
                <Input
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  value={profile.professionalInfo.yearsOfExperience}
                  onChange={(e) => handleChange(e, "professionalInfo", "yearsOfExperience")}
                  min="0"
                  error={errors.yearsOfExperience}
                  placeholder="Enter a number (e.g., 0 for Fresher)"
                />
                <TextArea
                  label="Summary"
                  name="summary"
                  value={profile.professionalInfo.summary}
                  onChange={(e) => handleChange(e, "professionalInfo", "summary")}
                />
               <TextArea
  label="Skills"
  hint="e.g., React, Node.js"
  value={profile.professionalInfo.skills.join(", ")}
  onChange={(e) => handleArrayChange(e, "skills")}
/>
                <TextArea
                  label="Preferred Job Types"
                  hint="e.g., Full Time, Remote"
                  value={profile.professionalInfo.preferredJobTypes.join(", ")}
                  onChange={(e) => handleArrayChange(e, "preferredJobTypes")}
                />
                <TextArea
                  label="Preferred Locations"
                  hint="e.g., Delhi, Remote"
                  value={profile.professionalInfo.preferredLocations.join(", ")}
                  onChange={(e) => handleArrayChange(e, "preferredLocations")}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Expected Salary Min"
                    name="min"
                    type="number"
                    value={profile.professionalInfo.expectedSalary.min}
                    onChange={(e) => handleChange(e, "expectedSalary", "min")}
                    min="0"
                    error={errors.expectedSalaryMin}
                  />
                  <Input
                    label="Expected Salary Max"
                    name="max"
                    type="number"
                    value={profile.professionalInfo.expectedSalary.max}
                    onChange={(e) => handleChange(e, "expectedSalary", "max")}
                    min="0"
                    error={errors.expectedSalaryMax}
                  />
                  <Input
                    label="Currency"
                    name="currency"
                    value={profile.professionalInfo.expectedSalary.currency}
                    onChange={(e) => handleChange(e, "professionalInfo", "currency")}
                  />
                  <Input
                    label="Job Alert Frequency"
                    name="jobAlertFrequency"
                    value={profile.professionalInfo.jobAlertFrequency}
                    onChange={(e) => handleChange(e, "professionalInfo", "jobAlertFrequency")}
                  />
                </div>
              </Section>
              <Section icon={<FaGraduationCap />} title="Education">
                {profile.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        required
                        error={errors[`education[${index}].institution`]}
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        required
                        error={errors[`education[${index}].degree`]}
                      />
                      <Input
                        label="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                      />
                      <Input
                        label="GPA"
                        value={edu.gpa}
                        onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                        disabled={edu.isCurrentlyStudying}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.isCurrentlyStudying}
                          onChange={(e) => handleEducationChange(index, "isCurrentlyStudying", e.target.checked)}
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-200">Currently Studying</label>
                      </div>
                      <TextArea
                        label="Description"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                      />
                    </div>
                    {profile.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 dark:text-red-400 text-sm mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Add Education
                </button>
              </Section>
              <Section icon={<FaBuilding />} title="Experience">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        required
                        error={errors[`experience[${index}].company`]}
                      />
                      <Input
                        label="Position"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        required
                        error={errors[`experience[${index}].position`]}
                      />
                      <Input
                        label="Location"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        disabled={exp.isCurrentPosition}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.isCurrentPosition}
                          onChange={(e) => handleExperienceChange(index, "isCurrentPosition", e.target.checked)}
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-200">Current Position</label>
                      </div>
                      <TextArea
                        label="Description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      />
                    </div>
                    {profile.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 dark:text-red-400 text-sm mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Add Experience
                </button>
              </Section>
              <Section icon={<FaFilePdf />} title="Resume">
                <Input
                  label="Resume URL"
                  name="fileUrl"
                  value={profile.resume.fileUrl}
                  onChange={(e) => handleChange(e, "resume", "fileUrl")}
                  placeholder="e.g., http://example.com/resume.pdf"
                  error={errors.resumeFileUrl}
                />
                <Input
                  label="Resume File Name"
                  name="fileName"
                  value={profile.resume.fileName}
                  onChange={(e) => handleChange(e, "resume", "fileName")}
                  placeholder="e.g., resume.pdf"
                />
                <Input
                  label="File Size (bytes)"
                  name="fileSize"
                  type="number"
                  value={profile.resume.fileSize}
                  onChange={(e) => handleChange(e, "resume", "fileSize")}
                  min="0"
                />
                <Input
                  label="Uploaded At"
                  name="uploadedAt"
                  type="datetime-local"
                  value={profile.resume.uploadedAt}
                  onChange={(e) => handleChange(e, "resume", "uploadedAt")}
                />
                {profile.resume.fileUrl && (
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                    Resume: <a href={profile.resume.fileUrl} target="_blank" rel="noopener noreferrer">{profile.resume.fileName}</a> ({(profile.resume.fileSize / 1024).toFixed(1)} KB)
                  </p>
                )}
              </Section>
              <Section icon={<FaUser />} title="Cover Letter">
                <TextArea
                  label="Message"
                  name="content"
                  value={profile.coverLetter.content}
                  onChange={(e) => handleChange(e, "coverLetter", "content")}
                  onBlur={() => setProfile(prev => ({
                    ...prev,
                    coverLetter: { ...prev.coverLetter, lastUpdated: new Date().toISOString() }
                  }))}
                />
              </Section>
              <div className="flex justify-center gap-6 mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <FaSave /> {loading ? "Saving..." : "Save & Continue"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-6 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition disabled:opacity-50"
                >
                  <FaTrash /> Clear
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-20 h-fit">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile.personalInfo.firstName} {profile.personalInfo.lastName}</h3>
              {profile.professionalInfo.currentTitle && <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">{profile.professionalInfo.currentTitle}</p>}
              <div className="w-10 border-b-2 border-blue-600 dark:border-blue-400 mt-4 mb-4"></div>
              <div className="w-full text-left space-y-2 text-gray-700 dark:text-gray-200 text-sm">
                {profile.personalInfo.email && <p className="flex items-center gap-2"><FaEnvelope className="text-blue-600 dark:text-blue-400" /> {profile.personalInfo.email}</p>}
                {profile.personalInfo.phone && <p className="flex items-center gap-2"><FaPhoneAlt className="text-blue-600 dark:text-blue-400" /> {profile.personalInfo.phone}</p>}
                {profile.personalInfo.address.city && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" /> {profile.personalInfo.address.city}, {profile.personalInfo.address.country}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;