import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Briefcase, Globe, Link, Github, Mail, Home, Save, Trash, Building, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

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

const CompanyProfileForm = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      linkedinUrl: '',
      portfolioUrl: '',
      githubUrl: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
    professionalInfo: {
      currentTitle: '',
      yearsOfExperience: '',
      summary: '',
      skills: [],
      preferredJobTypes: [],
      preferredLocations: [],
      expectedSalary: {
        min: '',
        max: '',
        currency: '',
      },
    },
    education: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    }],
    experience: [{
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
    }],
  });

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.personalInfo.firstName) newErrors.firstName = 'First name is required';
    if (!formData.personalInfo.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.personalInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) newErrors.email = 'Invalid email format';
    if (formData.personalInfo.phone && !/^\+?\d{10,15}$/.test(formData.personalInfo.phone)) newErrors.phone = 'Invalid phone number';
    if (formData.personalInfo.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com/.test(formData.personalInfo.linkedinUrl)) newErrors.linkedinUrl = 'Invalid LinkedIn URL';
    if (formData.personalInfo.portfolioUrl && !/^https?:\/\/.+/.test(formData.personalInfo.portfolioUrl)) newErrors.portfolioUrl = 'Invalid Portfolio URL';
    if (formData.personalInfo.githubUrl && !/^https?:\/\/(www\.)?github\.com/.test(formData.personalInfo.githubUrl)) newErrors.githubUrl = 'Invalid GitHub URL';
    if (formData.professionalInfo.yearsOfExperience && isNaN(formData.professionalInfo.yearsOfExperience)) newErrors.yearsOfExperience = 'Years of experience must be a number';
    if (formData.professionalInfo.expectedSalary.min && isNaN(formData.professionalInfo.expectedSalary.min)) newErrors.expectedSalaryMin = 'Minimum salary must be a number';
    if (formData.professionalInfo.expectedSalary.max && isNaN(formData.professionalInfo.expectedSalary.max)) newErrors.expectedSalaryMax = 'Maximum salary must be a number';
    formData.education.forEach((edu, index) => {
      if (!edu.institution) newErrors[`education[${index}].institution`] = 'Institution is required';
      if (!edu.degree) newErrors[`education[${index}].degree`] = 'Degree is required';
    });
    formData.experience.forEach((exp, index) => {
      if (!exp.company) newErrors[`experience[${index}].company`] = 'Company is required';
      if (!exp.title) newErrors[`experience[${index}].title`] = 'Title is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || user?.role !== 'company') return;
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/v1/companyProfile/company-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data.data) {
          const data = response.data.data;
          setFormData({
            personalInfo: {
              firstName: data.personalInfo?.firstName || '',
              lastName: data.personalInfo?.lastName || '',
              email: data.personalInfo?.email || '',
              phone: data.personalInfo?.phone || '',
              linkedinUrl: data.personalInfo?.linkedinUrl || '',
              portfolioUrl: data.personalInfo?.portfolioUrl || '',
              githubUrl: data.personalInfo?.githubUrl || '',
              address: data.personalInfo?.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
              },
            },
            professionalInfo: {
              currentTitle: data.professionalInfo?.currentTitle || '',
              yearsOfExperience: data.professionalInfo?.yearsOfExperience || '',
              summary: data.professionalInfo?.summary || '',
              skills: data.professionalInfo?.skills || [],
              preferredJobTypes: data.professionalInfo?.preferredJobTypes || [],
              preferredLocations: data.professionalInfo?.preferredLocations || [],
              expectedSalary: {
                min: data.professionalInfo?.expectedSalary?.min || '',
                max: data.professionalInfo?.expectedSalary?.max || '',
                currency: data.professionalInfo?.expectedSalary?.currency || '',
              },
            },
            education: data.education?.length > 0 ? data.education.map(edu => ({
              institution: edu.institution || '',
              degree: edu.degree || '',
              fieldOfStudy: edu.fieldOfStudy || '',
              startDate: formatDateForInput(edu.startDate),
              endDate: formatDateForInput(edu.endDate),
              grade: edu.grade || '',
              description: edu.description || '',
            })) : [{
              institution: '',
              degree: '',
              fieldOfStudy: '',
              startDate: '',
              endDate: '',
              grade: '',
              description: '',
            }],
            experience: data.experience?.length > 0 ? data.experience.map(exp => ({
              company: exp.company || '',
              title: exp.title || '',
              startDate: formatDateForInput(exp.startDate),
              endDate: formatDateForInput(exp.endDate),
              location: exp.location || '',
              description: exp.description || '',
            })) : [{
              company: '',
              title: '',
              startDate: '',
              endDate: '',
              location: '',
              description: '',
            }],
          });
          if (data.personalInfo?.firstName && data.personalInfo?.lastName) {
            localStorage.setItem('companyName', `${data.personalInfo.firstName} ${data.personalInfo.lastName}`);
          }
          localStorage.setItem('companyTechStack', JSON.stringify(data.professionalInfo?.skills || []));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
        setFetchError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user]);

  const handleChange = (e, section, field, subfield) => {
    const { value } = e.target;
    if (subfield === 'address') {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          address: { ...prev.personalInfo.address, [field]: value },
        },
      }));
    } else if (subfield === 'expectedSalary') {
      setFormData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          expectedSalary: { ...prev.professionalInfo.expectedSalary, [field]: value },
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleArrayChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: e.target.value.split(',').map(s => s.trim()).filter(s => s),
      },
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: updatedEducation }));
    setErrors(prev => ({ ...prev, [`education[${index}].${field}`]: undefined }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
      }],
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
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
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
    setErrors(prev => ({ ...prev, [`experience[${index}].${field}`]: undefined }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
      }],
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`experience[${index}]`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleClear = () => {
    setFormData({
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        portfolioUrl: '',
        githubUrl: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      },
      professionalInfo: {
        currentTitle: '',
        yearsOfExperience: '',
        summary: '',
        skills: [],
        preferredJobTypes: [],
        preferredLocations: [],
        expectedSalary: {
          min: '',
          max: '',
          currency: '',
        },
      },
      education: [{
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
      }],
      experience: [{
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
      }],
    });
    setErrors({});
    toast.info('Form cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login');
      navigate('/auth/login');
      return;
    }
    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        linkedinUrl: formData.personalInfo.linkedinUrl,
        portfolioUrl: formData.personalInfo.portfolioUrl,
        githubUrl: formData.personalInfo.githubUrl,
        street: formData.personalInfo.address.street,
        city: formData.personalInfo.address.city,
        state: formData.personalInfo.address.state,
        zipCode: formData.personalInfo.address.zipCode,
        country: formData.personalInfo.address.country,
        currentTitle: formData.professionalInfo.currentTitle,
        yearsOfExperience: Number(formData.professionalInfo.yearsOfExperience) || 0,
        summary: formData.professionalInfo.summary,
        skills: formData.professionalInfo.skills,
        preferredJobTypes: formData.professionalInfo.preferredJobTypes,
        preferredLocations: formData.professionalInfo.preferredLocations,
        expectedSalaryMin: Number(formData.professionalInfo.expectedSalary.min) || 0,
        expectedSalaryMax: Number(formData.professionalInfo.expectedSalary.max) || 0,
        currency: formData.professionalInfo.expectedSalary.currency,
        education: formData.education.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
          endDate: edu.endDate ? new Date(edu.endDate).toISOString() : null,
          grade: edu.grade,
          description: edu.description,
        })),
        experience: formData.experience.map(exp => ({
          company: exp.company,
          title: exp.title,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
          endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
          location: exp.location,
          description: exp.description,
        })),
      };
      const method =  'POST';
      const response = await axios({
        method,
        url: 'http://localhost:8000/api/v1/companyProfile/company-profile',
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('companyProfile', JSON.stringify(payload));
        localStorage.setItem('companyName', `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`);
        localStorage.setItem('companyTechStack', JSON.stringify(formData.professionalInfo.skills));
        toast.success('Profile saved!');
        navigate('/company-dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>Error: {fetchError}</p>
        <button
          onClick={() => setFetchError('')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#eef2f7] to-[#f9f9fb] dark:from-gray-900 dark:to-gray-800 min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10">
          {localStorage.getItem('companyProfile') ? 'Edit Company Profile' : 'Create Company Profile'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Section icon={<Building />} title="Company Information">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleChange(e, 'personalInfo', 'firstName')}
                    required
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleChange(e, 'personalInfo', 'lastName')}
                    required
                    error={errors.lastName}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleChange(e, 'personalInfo', 'email')}
                    required
                    error={errors.email}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleChange(e, 'personalInfo', 'phone')}
                    error={errors.phone}
                  />
                </div>
              </Section>
              <Section icon={<Link />} title="Social Profiles">
                <Input
                  label="LinkedIn"
                  name="linkedinUrl"
                  value={formData.personalInfo.linkedinUrl}
                  onChange={(e) => handleChange(e, 'personalInfo', 'linkedinUrl')}
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors.linkedinUrl}
                />
                <Input
                  label="Portfolio/Website"
                  name="portfolioUrl"
                  value={formData.personalInfo.portfolioUrl}
                  onChange={(e) => handleChange(e, 'personalInfo', 'portfolioUrl')}
                  placeholder="https://yourwebsite.com"
                  error={errors.portfolioUrl}
                />
                <Input
                  label="GitHub"
                  name="githubUrl"
                  value={formData.personalInfo.githubUrl}
                  onChange={(e) => handleChange(e, 'personalInfo', 'githubUrl')}
                  placeholder="https://github.com/yourusername"
                  error={errors.githubUrl}
                />
              </Section>
              <Section icon={<Home />} title="Address">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    name="street"
                    value={formData.personalInfo.address.street}
                    onChange={(e) => handleChange(e, 'personalInfo', 'street', 'address')}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.personalInfo.address.city}
                    onChange={(e) => handleChange(e, 'personalInfo', 'city', 'address')}
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    value={formData.personalInfo.address.state}
                    onChange={(e) => handleChange(e, 'personalInfo', 'state', 'address')}
                  />
                  <Input
                    label="Zip/Postal Code"
                    name="zipCode"
                    value={formData.personalInfo.address.zipCode}
                    onChange={(e) => handleChange(e, 'personalInfo', 'zipCode', 'address')}
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.personalInfo.address.country}
                    onChange={(e) => handleChange(e, 'personalInfo', 'country', 'address')}
                  />
                </div>
              </Section>
              <Section icon={<Briefcase />} title="Professional Information">
                <Input
                  label="Current Title"
                  name="currentTitle"
                  value={formData.professionalInfo.currentTitle}
                  onChange={(e) => handleChange(e, 'professionalInfo', 'currentTitle')}
                />
                <Input
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.professionalInfo.yearsOfExperience}
                  onChange={(e) => handleChange(e, 'professionalInfo', 'yearsOfExperience')}
                  error={errors.yearsOfExperience}
                />
                <TextArea
                  label="Company Description"
                  name="summary"
                  value={formData.professionalInfo.summary}
                  onChange={(e) => handleChange(e, 'professionalInfo', 'summary')} // Fixed section from 'personalInfo' to 'professionalInfo'
                />
                <Input
                  label="Skills"
                  name="skills"
                  value={formData.professionalInfo.skills.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'skills')}
                  placeholder="e.g., React, Node.js, Python"
                />
                <Input
                  label="Preferred Job Types"
                  name="preferredJobTypes"
                  value={formData.professionalInfo.preferredJobTypes.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'preferredJobTypes')}
                  placeholder="e.g., Full-time, Remote"
                />
                <Input
                  label="Preferred Locations"
                  name="preferredLocations"
                  value={formData.professionalInfo.preferredLocations.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'preferredLocations')}
                  placeholder="e.g., Bangalore, Remote"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Expected Salary (Min)"
                    name="min"
                    type="number"
                    value={formData.professionalInfo.expectedSalary.min}
                    onChange={(e) => handleChange(e, 'professionalInfo', 'min', 'expectedSalary')}
                    error={errors.expectedSalaryMin}
                  />
                  <Input
                    label="Expected Salary (Max)"
                    name="max"
                    type="number"
                    value={formData.professionalInfo.expectedSalary.max}
                    onChange={(e) => handleChange(e, 'professionalInfo', 'max', 'expectedSalary')}
                    error={errors.expectedSalaryMax}
                  />
                  <Input
                    label="Currency"
                    name="currency"
                    value={formData.professionalInfo.expectedSalary.currency}
                    onChange={(e) => handleChange(e, 'professionalInfo', 'currency', 'expectedSalary')}
                    placeholder="e.g., INR, USD"
                  />
                </div>
              </Section>
              <Section icon={<GraduationCap />} title="Education">
                {formData.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        required
                        error={errors[`education[${index}].institution`]}
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        required
                        error={errors[`education[${index}].degree`]}
                      />
                      <Input
                        label="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                      />
                      <Input
                        label="Grade"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      />
                      <TextArea
                        label="Description"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                      />
                    </div>
                    {formData.education.length > 1 && (
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
              <Section icon={<Building />} title="Experience">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        required
                        error={errors[`experience[${index}].company`]}
                      />
                      <Input
                        label="Title"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        required
                        error={errors[`experience[${index}].title`]}
                      />
                      <Input
                        label="Location"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                      />
                      <TextArea
                        label="Description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      />
                    </div>
                    {formData.experience.length > 1 && (
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
              <div className="flex justify-center gap-6 mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <Save size={16} /> {loading ? 'Saving...' : 'Save & Continue'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-6 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition disabled:opacity-50"
                >
                  <Trash size={16} /> Clear
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-20 h-fit">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {formData.personalInfo.firstName && formData.personalInfo.lastName
                    ? `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`
                    : 'Company Name'}
                </h3>
                {formData.professionalInfo.currentTitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                    {formData.professionalInfo.currentTitle}
                  </p>
                )}
                {formData.professionalInfo.summary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.professionalInfo.summary}
                  </p>
                )}
                <div className="w-10 border-b-2 border-blue-600 dark:border-blue-400 mt-4 mb-4"></div>
                <div className="w-full text-left space-y-2 text-gray-700 dark:text-gray-200 text-sm">
                  {formData.personalInfo.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="text-blue-600 dark:text-blue-400" size={16} />
                      {formData.personalInfo.email}
                    </p>
                  )}
                  {formData.personalInfo.phone && (
                    <p className="flex items-center gap-2">
                      <Home className="text-blue-600 dark:text-blue-400" size={16} />
                      {formData.personalInfo.phone}
                    </p>
                  )}
                  {formData.personalInfo.address.city && (
                    <p className="flex items-center gap-2">
                      <Home className="text-blue-600 dark:text-blue-400" size={16} />
                      {formData.personalInfo.address.city}, {formData.personalInfo.address.country}
                    </p>
                  )}
                  {formData.personalInfo.linkedinUrl && (
                    <p className="flex items-center gap-2">
                      <Link className="text-blue-600 dark:text-blue-400" size={16} />
                      <a href={formData.personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </p>
                  )}
                  {formData.personalInfo.portfolioUrl && (
                    <p className="flex items-center gap-2">
                      <Globe className="text-blue-600 dark:text-blue-400" size={16} />
                      <a href={formData.personalInfo.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        Portfolio
                      </a>
                    </p>
                  )}
                  {formData.personalInfo.githubUrl && (
                    <p className="flex items-center gap-2">
                      <Github className="text-blue-600 dark:text-blue-400" size={16} />
                      <a href={formData.personalInfo.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </p>
                  )}
                  {formData.professionalInfo.preferredLocations.length > 0 && (
                    <p className="flex items-center gap-2">
                      <Home className="text-blue-600 dark:text-blue-400" size={16} />
                      {formData.professionalInfo.preferredLocations.join(', ')}
                    </p>
                  )}
                  {formData.education.length > 0 && formData.education[0].grade && (
                    <p className="flex items-center gap-2">
                      <GraduationCap className="text-blue-600 dark:text-blue-400" size={16} />
                      Grade: {formData.education[0].grade} ({formData.education[0].degree})
                    </p>
                  )}
                  {formData.experience.length > 0 && formData.experience[0].title && (
                    <p className="flex items-center gap-2">
                      <Briefcase className="text-blue-600 dark:text-blue-400" size={16} />
                      {formData.experience[0].title} at {formData.experience[0].company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfileForm;