import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBriefcase,
  FaSave,
  FaTrash,
  FaEnvelope,
  FaPhoneAlt,
  FaFilePdf,
  FaGraduationCap,
  FaBuilding,
  FaEdit,
  FaLink,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import { deleteCompanyProfile, getCompanyProfile,  updateCompanyProfile, } from "../../API";

const Input = ({ label, hint, error, readOnly, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
      {label}
    </label>
    {hint && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>
    )}
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 ${
        readOnly
          ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          : "bg-white dark:bg-gray-800"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, hint, error, readOnly, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
      {label}
    </label>
    {hint && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>
    )}
    <textarea
      {...props}
      readOnly={readOnly}
      rows={4}
      className={`w-full border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 ${
        readOnly
          ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          : "bg-white dark:bg-gray-800"
      }`}
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

const CompanyProfileSetting = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
 const [profile, setProfile] = useState({
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    githubUrl: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  },
  professionalInfo: {
    currentTitle: "",
    yearsOfExperience: "",
    summary: "",
    skills: [],
    preferredJobTypes: [],
    preferredLocations: [],
    expectedSalary: {
      min: "",
      max: "",
      currency: "",
    },
  },
  education: [
    {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrentlyStudying: false,
      grade: "",
      description: "",
    },
  ],
  experience: [
    {
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      isCurrenttitle: false,
      location: "",
      description: "",
    },
  ],
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load profile from localStorage
  const loadProfileFromLocalStorage = () => {
    const savedProfile = localStorage.getItem("userProfile");
   if (savedProfile) {
  try {
    const parsedProfile = JSON.parse(savedProfile);

    setProfile((prev) => ({
      ...prev,
      ...parsedProfile,
      personalInfo: {
        ...prev.personalInfo,
        ...parsedProfile.personalInfo,
        address: {
          ...prev.personalInfo.address,
          ...parsedProfile.personalInfo?.address,
        },
      },
      professionalInfo: {
        ...prev.professionalInfo,
        ...parsedProfile.professionalInfo,
        yearsOfExperience: parsedProfile.professionalInfo?.yearsOfExperience || "",
        expectedSalary: {
          min: parsedProfile.professionalInfo?.expectedSalary?.min || "",
          max: parsedProfile.professionalInfo?.expectedSalary?.max || "",
          currency: parsedProfile.professionalInfo?.expectedSalary?.currency || "",
        },
      },
      education: parsedProfile.education?.map((edu) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "",
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "",
        isCurrentlyStudying: !!edu.isCurrentlyStudying,
      })) || [],
      experience: parsedProfile.experience?.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
        isCurrenttitle: !!exp.isCurrenttitle,
      })) || [],
    }));
  } catch (err) {
    console.error("Error parsing localStorage profile:", err);
  }
}

  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Please log in to view your profile.");
        navigate("/auth/login");
        return;
      }
      setLoading(true);
      try {
        // Load from localStorage first
        loadProfileFromLocalStorage();

        const res = await getCompanyProfile();
        if (res.data.data) {
          const fetchedProfile = {
            ...res.data.data,
            professionalInfo: {
              ...res.data.data.professionalInfo,
              yearsOfExperience: res.data.data.professionalInfo.yearsOfExperience || "",
              expectedSalary: {
                min: res.data.data.professionalInfo.expectedSalary.min || "",
                max: res.data.data.professionalInfo.expectedSalary.max || "",
                currency: res.data.data.professionalInfo.expectedSalary.currency || "",
              },
            },
            education: res.data.data.education.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "",
              endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "",
              isCurrentlyStudying: Boolean(edu.isCurrentlyStudying),
            })),
            experience: res.data.data.experience.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
              endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
              isCurrenttitle: Boolean(exp.isCurrenttitle),
            })),
           
          };
          setProfile(fetchedProfile);
          localStorage.setItem("companyProfile", JSON.stringify(fetchedProfile));
        } else {
          toast.info("No profile found. You can create one from the profile page.");
          navigate("/company-profile");
        }
      } catch (err) {
        let errorMessage = "Failed to fetch profile. Please try again.";
        if (err.response) {
          errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
          if (err.response.status === 401) {
            errorMessage = "Unauthorized. Please log in again.";
            navigate("/auth/login");
          } else if (err.response.status === 404) {
            errorMessage = "No profile found. You can create one from the profile page.";
            navigate("/company-profile");
          }
        }
        setFetchError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "Profcompanyile") {
        loadProfileFromLocalStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
    if (profile.professionalInfo.yearsOfExperience && isNaN(profile.professionalInfo.yearsOfExperience)) newErrors.yearsOfExperience = "Years of experience must be a number";
    else if (profile.professionalInfo.yearsOfExperience < 0) newErrors.yearsOfExperience = "Years of experience cannot be negative";
    if (profile.professionalInfo.expectedSalary.min && isNaN(profile.professionalInfo.expectedSalary.min)) newErrors.expectedSalaryMin = "Minimum salary must be a number";
    else if (profile.professionalInfo.expectedSalary.min < 0) newErrors.expectedSalaryMin = "Minimum salary cannot be negative";
    if (profile.professionalInfo.expectedSalary.max && isNaN(profile.professionalInfo.expectedSalary.max)) newErrors.expectedSalaryMax = "Maximum salary must be a number";
    else if (profile.professionalInfo.expectedSalary.max < profile.professionalInfo.expectedSalary.min) newErrors.expectedSalaryMax = "Maximum salary must be greater than or equal to minimum";
    if (profile.professionalInfo.jobAlertFrequency && !["daily", "weekly", "monthly"].includes(profile.professionalInfo.jobAlertFrequency.toLowerCase())) newErrors.jobAlertFrequency = "Invalid job alert frequency (use: daily, weekly, monthly)";
    profile.education.forEach((edu, index) => {
      if (!edu.institution) newErrors[`education[${index}].institution`] = "Institution is required";
      if (!edu.degree) newErrors[`education[${index}].degree`] = "Degree is required";
      if (edu.grade && isNaN(edu.grade)) newErrors[`education[${index}].grade`] = "grade must be a number";
    });
    profile.experience.forEach((exp, index) => {
      if (!exp.company) newErrors[`experience[${index}].company`] = "Company is required";
      if (!exp.title) newErrors[`experience[${index}].title`] = "title is required";
    });
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, section, field, subfield) => {
    const { value } = e.target;
    setProfile((prev) => {
      if (section === "personalInfo" && subfield === "address") {
        return {
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            address: { ...prev.personalInfo.address, [field]: value },
          },
        };
      } else if (section === "personalInfo") {
        return {
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value },
        };
      } else if (section === "professionalInfo" && subfield === "expectedSalary") {
        return {
          ...prev,
          professionalInfo: {
            ...prev.professionalInfo,
            expectedSalary: {
              ...prev.professionalInfo.expectedSalary,
              [field]: value,
            },
          },
        };
      } else if (section === "professionalInfo") {
        return {
          ...prev,
          professionalInfo: {
            ...prev.professionalInfo,
            [field]: field === "yearsOfExperience" ? value : value,
          },
        };
      } 
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const values = value.split(",").map((s) => s.trim()).filter((s) => s);
    setProfile((prev) => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: values,
      },
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: field === "isCurrentlyStudying" ? value : value,
    };
    setProfile((prev) => ({ ...prev, education: updatedEducation }));
    setErrors((prev) => ({
      ...prev,
      [`education[${index}].${field}`]: undefined,
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          grade: "",
          startDate: "",
          endDate: "",
          isCurrentlyStudying: false,
          description: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`education[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profile.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: field === "isCurrenttitle" ? value : value,
    };
    setProfile((prev) => ({ ...prev, experience: updatedExperience }));
    setErrors((prev) => ({
      ...prev,
      [`experience[${index}].${field}`]: undefined,
    }));
  };

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          isCurrenttitle: false,
          description: "",
          location: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`experience[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to update your profile.");
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
        yearsOfExperience: Number(profile.professionalInfo.yearsOfExperience) || 0,
        summary: profile.professionalInfo.summary,
        skills: profile.professionalInfo.skills,
        preferredJobTypes: profile.professionalInfo.preferredJobTypes,
        preferredLocations: profile.professionalInfo.preferredLocations,
        expectedSalaryMin: Number(profile.professionalInfo.expectedSalary.min) || 0,
        expectedSalaryMax: Number(profile.professionalInfo.expectedSalary.max) || 0,
        currency: profile.professionalInfo.expectedSalary.currency,
        education: profile.education.map((edu) => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
          endDate: edu.isCurrentlyStudying ? null : edu.endDate ? new Date(edu.endDate).toISOString() : null,
          isCurrentlyStudying: Boolean(edu.isCurrentlyStudying),
        })),
        experience: profile.experience.map((exp) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
          endDate: exp.isCurrenttitle ? null : exp.endDate ? new Date(exp.endDate).toISOString() : null,
          isCurrenttitle: Boolean(exp.isCurrenttitle),
        })),
    
      };

      const res = await updateCompanyProfile(payload);
      if (res.status === 200 || res.status === 201) {
        // Update state with server response
        const updatedProfile = {
          ...res.data.data,
          professionalInfo: {
            ...res.data.data.professionalInfo,
            yearsOfExperience: res.data.data.professionalInfo.yearsOfExperience || "",
            expectedSalary: {
              min: res.data.data.professionalInfo.expectedSalary.min || "",
              max: res.data.data.professionalInfo.expectedSalary.max || "",
              currency: res.data.data.professionalInfo.expectedSalary.currency || "",
            },
          },
          education: res.data.data.education.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "",
            endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "",
            isCurrentlyStudying: Boolean(edu.isCurrentlyStudying),
          })),
          experience: res.data.data.experience.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
            isCurrenttitle: Boolean(exp.isCurrenttitle),
          })),
          
        };
        setProfile(updatedProfile);
        localStorage.setItem("companyProfile", JSON.stringify(updatedProfile));
        if (updatedProfile.personalInfo.firstName && updatedProfile.personalInfo.lastName) {
          localStorage.setItem("userCompanyFullName", `${updatedProfile.personalInfo.firstName} ${updatedProfile.personalInfo.lastName}`);
        }
        if (updatedProfile.professionalInfo.skills.length > 0) {
          localStorage.setItem("userCompanySkills", JSON.stringify(updatedProfile.professionalInfo.skills.map(skill => skill.toLowerCase())));
        }
        if (updatedProfile.professionalInfo.currentTitle) {
          localStorage.setItem("userCompanyField", updatedProfile.professionalInfo.currentTitle.toLowerCase());
        }
        toast.success("Profile updated successfully!");
        navigate("/company-dashboard")
        setIsEditing(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      setFetchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!token) {
      toast.error("Please log in to clear your profile.");
      navigate("/auth/login");
      return;
    }
    setLoading(true);
    setFetchError("");
    try {
      const res = await deleteCompanyProfile();
      if (res.status === 200) {
        const clearedProfile = {
          personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            linkedinUrl: "",
            githubUrl: "",
            portfolioUrl: "",
            address: { street: "", city: "", state: "", zipCode: "", country: "" },
          },
          professionalInfo: {
            currentTitle: "",
            yearsOfExperience: "",
            summary: "",
            skills: [],
            preferredJobTypes: [],
            preferredLocations: [],
            expectedSalary: { min: "", max: "", currency: "" },
            jobAlertFrequency: "",
          },
          education: [
            {
              institution: "",
              degree: "",
              fieldOfStudy: "",
              grade: "",
              startDate: "",
              endDate: "",
              isCurrentlyStudying: false,
              description: "",
            },
          ],
          experience: [
            {
              company: "",
              title: "",
              startDate: "",
              endDate: "",
              isCurrenttitle: false,
              description: "",
              location: "",
            },
          ],
        };
        setProfile(clearedProfile);
        setErrors({});
        localStorage.removeItem("companyProfile");
        localStorage.removeItem("userCompanySkills");
        localStorage.removeItem("userCompanyField");
        localStorage.removeItem("userCompanyFullName");
        toast.success("Profile cleared successfully!");
        navigate("/jobseeker-profile");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to clear profile.";
      setFetchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      loadProfileFromLocalStorage(); 
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-600 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#e6eaee] to-[#f4f4f6] bg-gray-100 min-h-screen py-10 px-4 md:px-10">
        {fetchError && (
          <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {fetchError}
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Profile Settings
              </h1>
              <button
                type="button"
                onClick={toggleEdit}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              >
                <FaEdit /> {isEditing ? "View Profile" : "Edit Profile"}
              </button>
            </div>
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
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => handleChange(e, "personalInfo", "lastName")}
                    required
                    error={errors.lastName}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleChange(e, "personalInfo", "email")}
                    required
                    error={errors.email}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleChange(e, "personalInfo", "phone")}
                    error={errors.phone}
                    readOnly={!isEditing}
                  />
                </div>
              </Section>
              <Section icon={<FaLink />} title="Social Profiles">
                <Input
                  label="LinkedIn"
                  name="linkedinUrl"
                  value={profile.personalInfo.linkedinUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "linkedinUrl")}
                  error={errors.linkedinUrl}
                  readOnly={!isEditing}
                />
                <Input
                  label="GitHub"
                  name="githubUrl"
                  value={profile.personalInfo.githubUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "githubUrl")}
                  error={errors.githubUrl}
                  readOnly={!isEditing}
                />
                <Input
                  label="Portfolio"
                  name="portfolioUrl"
                  value={profile.personalInfo.portfolioUrl}
                  onChange={(e) => handleChange(e, "personalInfo", "portfolioUrl")}
                  error={errors.portfolioUrl}
                  readOnly={!isEditing}
                />
              </Section>
              <Section icon={<FaMapMarkerAlt />} title="Address">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    name="street"
                    value={profile.personalInfo.address.street}
                    onChange={(e) => handleChange(e, "personalInfo", "street", "address")}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={profile.personalInfo.address.city}
                    onChange={(e) => handleChange(e, "personalInfo", "city", "address")}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={profile.personalInfo.address.state}
                    onChange={(e) => handleChange(e, "personalInfo", "state", "address")}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    value={profile.personalInfo.address.zipCode}
                    onChange={(e) => handleChange(e, "personalInfo", "zipCode", "address")}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={profile.personalInfo.address.country}
                    onChange={(e) => handleChange(e, "personalInfo", "country", "address")}
                    readOnly={!isEditing}
                  />
                </div>
              </Section>
              <Section icon={<FaBriefcase />} title="Professional Details">
                <Input
                  label="Current Title"
                  name="currentTitle"
                  value={profile.professionalInfo.currentTitle}
                  onChange={(e) => handleChange(e, "professionalInfo", "currentTitle")}
                  readOnly={!isEditing}
                />
                <Input
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  value={profile.professionalInfo.yearsOfExperience}
                  onChange={(e) => handleChange(e, "professionalInfo", "yearsOfExperience")}
                  min="0"
                  error={errors.yearsOfExperience}
                  placeholder="e.g., 0 for Fresher"
                  readOnly={!isEditing}
                />
                <TextArea
                  label="Summary"
                  name="summary"
                  value={profile.professionalInfo.summary}
                  onChange={(e) => handleChange(e, "professionalInfo", "summary")}
                  readOnly={!isEditing}
                />
                <TextArea
                  label="Skills"
                  hint="e.g., React, Node.js"
                  value={profile.professionalInfo.skills.join(", ")}
                  onChange={(e) => handleArrayChange(e, "skills")}
                  readOnly={!isEditing}
                />
                <TextArea
                  label="Preferred Job Types"
                  hint="e.g., Full Time, Remote"
                  value={profile.professionalInfo.preferredJobTypes.join(", ")}
                  onChange={(e) => handleArrayChange(e, "preferredJobTypes")}
                  readOnly={!isEditing}
                />
                <TextArea
                  label="Preferred Locations"
                  hint="e.g., Delhi, Remote"
                  value={profile.professionalInfo.preferredLocations.join(", ")}
                  onChange={(e) => handleArrayChange(e, "preferredLocations")}
                  readOnly={!isEditing}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Expected Salary Min"
                    name="min"
                    type="number"
                    value={profile.professionalInfo.expectedSalary.min}
                    onChange={(e) => handleChange(e, "professionalInfo", "min", "expectedSalary")}
                    min="0"
                    error={errors.expectedSalaryMin}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Expected Salary Max"
                    name="max"
                    type="number"
                    value={profile.professionalInfo.expectedSalary.max}
                    onChange={(e) => handleChange(e, "professionalInfo", "max", "expectedSalary")}
                    min="0"
                    error={errors.expectedSalaryMax}
                    readOnly={!isEditing}
                  />
                  <Input
                    label="Currency"
                    name="currency"
                    value={profile.professionalInfo.expectedSalary.currency}
                    onChange={(e) => handleChange(e, "professionalInfo", "currency", "expectedSalary")}
                    readOnly={!isEditing}
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
                        readOnly={!isEditing}
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        required
                        error={errors[`education[${index}].degree`]}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="grade"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                        error={errors[`education[${index}].grade`]}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                        disabled={edu.isCurrentlyStudying}
                        readOnly={!isEditing}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.isCurrentlyStudying}
                          onChange={(e) => handleEducationChange(index, "isCurrentlyStudying", e.target.checked)}
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                          disabled={!isEditing}
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-200">Currently Studying</label>
                      </div>
                      <TextArea
                        label="Description"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                    {isEditing && profile.education.length > 1 && (
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
                {isEditing && (
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Add Education
                  </button>
                )}
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
                        readOnly={!isEditing}
                      />
                      <Input
                        label="title"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                        required
                        error={errors[`experience[${index}].title`]}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="Location"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        readOnly={!isEditing}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        disabled={exp.isCurrenttitle}
                        readOnly={!isEditing}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.isCurrenttitle}
                          onChange={(e) => handleExperienceChange(index, "isCurrenttitle", e.target.checked)}
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                          disabled={!isEditing}
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-200">Current title</label>
                      </div>
                      <TextArea
                        label="Description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                    {isEditing && profile.experience.length > 1 && (
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
                {isEditing && (
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Add Experience
                  </button>
                )}
              </Section>
            
              {isEditing && (
                <div className="flex justify-center gap-6 mt-10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    <FaSave /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-6 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition disabled:opacity-50"
                  >
                    <FaTrash /> Clear Profile
                  </button>
                </div>
              )}
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-20 h-fit">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {profile.personalInfo.firstName && profile.personalInfo.lastName
                  ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`
                  : "Your Name"}
              </h3>
              {profile.professionalInfo.currentTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                  {profile.professionalInfo.currentTitle}
                </p>
              )}
              <div className="w-10 border-b-2 border-blue-600 dark:border-blue-400 mt-4 mb-4"></div>
              <div className="w-full text-left space-y-2 text-gray-700 dark:text-gray-200 text-sm">
                {profile.personalInfo.email && (
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600 dark:text-blue-400" /> {profile.personalInfo.email}
                  </p>
                )}
                {profile.personalInfo.phone && (
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-blue-600 dark:text-blue-400" /> {profile.personalInfo.phone}
                  </p>
                )}
                {profile.personalInfo.address.city && (
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />{" "}
                    {profile.personalInfo.address.city}, {profile.personalInfo.address.country}
                  </p>
                )}
           
                {profile.professionalInfo.skills.length > 0 && (
                  <p className="flex items-center gap-2">
                    <FaBriefcase className="text-blue-600 dark:text-blue-400" /> Skills: {profile.professionalInfo.skills.join(", ")}
                  </p>
                )}
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfileSetting;