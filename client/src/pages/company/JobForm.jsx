/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Briefcase, Award, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { createCompanyJob, updateCompanyJob, fetchCompanyJobs } from './api';
import LoadingSpinner from '../../components/Loading';

const JobForm = ({ onClose, onSubmit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    saleryRange: '',
    experienceLevel: 'Mid-level',
    contactEmail: '',
    applicationDeadline: '',
    jobDescription: '',
    companyDescription: '',
    requirements: [''],
    skills: [''],
    benefits: [''],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await fetchCompanyJobs();
      const job = response.data.data.find((j) => j._id === id);
      if (!job) {
        throw new Error('Job not found');
      }
      setFormData({
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        location: job.location,
        jobType: job.jobType,
        saleryRange: job.saleryRange || '',
        experienceLevel: job.experienceLevel,
        contactEmail: job.contactEmail,
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        jobDescription: job.jobDescription,
        companyDescription: job.companyDescription,
        requirements: job.requirements.length > 0 ? job.requirements : [''],
        skills: job.skills.length > 0 ? job.skills : [''],
        benefits: job.benefits.length > 0 ? job.benefits : [''],
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleArrayInput = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.saleryRange.trim()) newErrors.saleryRange = 'Salary range is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
    if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (!formData.companyDescription.trim()) newErrors.companyDescription = 'Company description is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.applicationDeadline && formData.applicationDeadline <= today) {
      newErrors.applicationDeadline = 'Application deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim()),
        skills: formData.skills.filter((skill) => skill.trim()),
        benefits: formData.benefits.filter((benefit) => benefit.trim()),
      };

      if (isEdit) {
        await updateCompanyJob(id, submitData);
        toast.success('Job updated successfully!');
      } else if (onSubmit) {
        await onSubmit(e, submitData);
      } else {
        await createCompanyJob(submitData);
        toast.success('Job posted successfully!');
      }
      if (onClose) onClose();
      if (!isEdit) navigate('/company-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit job');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="text-blue-500" />
              Job Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                  placeholder="Senior Software Engineer"
                />
                {errors.jobTitle && <p className="text-red-600 text-sm mt-1">{errors.jobTitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="Tech Solutions Inc."
                />
                {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="New York, NY"
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type <span className="text-red-500">*</span></label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Level <span className="text-red-500">*</span></label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                >
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior-level">Senior-level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="jobs@company.com"
                />
                {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Salary Range <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="saleryRange"
                  value={formData.saleryRange}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.saleryRange ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="$80,000 - $120,000"
                />
                {errors.saleryRange && <p className="text-red-600 text-sm mt-1">{errors.saleryRange}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Deadline <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                />
                {errors.applicationDeadline && <p className="text-red-600 text-sm mt-1">{errors.applicationDeadline}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Award className="text-blue-500" />
              Job Details
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description <span className="text-red-500">*</span></label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-2 border ${errors.jobDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="Describe the role..."
                />
                {errors.jobDescription && <p className="text-red-600 text-sm mt-1">{errors.jobDescription}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Description <span className="text-red-500">*</span></label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border ${errors.companyDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                  placeholder="Tell candidates about your company..."
                />
                {errors.companyDescription && <p className="text-red-600 text-sm mt-1">{errors.companyDescription}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Requirements</label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                      placeholder="Requirement"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="flex items-center gap-2 text-blue-600 text-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayInput('skills', index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                      placeholder="Skill"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skills')}
                  className="flex items-center gap-2 text-blue-600 text-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Benefits</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayInput('benefits', index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                      placeholder="Benefit"
                    />
                    {formData.benefits.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="flex items-center gap-2 text-blue-600 text-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Benefit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            < button
              type="button"
              onClick={() => onClose ? onClose() : navigate('/company-dashboard')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;