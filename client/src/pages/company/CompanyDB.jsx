import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Eye, Edit, Trash2, Users, TrendingUp, Calendar, Building2, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { toast } from 'react-toastify';
import JobForm from './JobForm';
import { fetchCompanyJobs, deleteCompanyJob, fetchCompanyApplications, updateApplicationStatus, createCompanyJob } from './api';

const CompanyDB = () => {
  const { token, isAuthenticated,  } = useAuth();

  
  const userFullName = localStorage.getItem("userCompanyFullName");
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
   totalJobs:0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiringRate: 0,
    recentApplications: [],
    topPerformingJobs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !isAuthenticated) return;
      try {
        setLoading(true);
        setError('');

        const [jobsResponse, appsResponse] = await Promise.all([
          fetchCompanyJobs(currentPage, itemsPerPage),
          fetchCompanyApplications(),
        ]);

        const jobsData = jobsResponse.data.data || { jobs: [], total: 0, page: 1, totalPages: 1 };
        const applications = appsResponse.data.data || [];

        const jobs = jobsData.jobs || [];
        setTotalPages(jobsData.totalPages || 1);
        const totalJobs = jobs.length;
        console.log(totalJobs)
        // const activeJobs = jobs.filter((job) => job.active).length;
        const totalApplications = applications.length;
        const interviewsScheduled = applications.filter((app) => app.status === 'Shortlisted').length;
        const hiringRate = totalApplications
          ? ((applications.filter((app) => app.status === 'Applied').length / totalApplications) * 100).toFixed(1)
          : 0;
        const recentApplications = applications.slice(0, 3);
        const topPerformingJobs = jobs
          .sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0))
          .slice(0, 3);

        setJobs(jobs);
        setApplications(applications);
        setStats({
          totalJobs,
          totalApplications,
          interviewsScheduled,
          hiringRate,
          recentApplications,
          topPerformingJobs,
        });
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, isAuthenticated, currentPage]);

 
const handleJobSubmit = async (e, formData) => {
  e.preventDefault();
  try {
    setLoading(true);
    await createCompanyJob(formData);
    toast.success('Job posted successfully!');
    setShowJobForm(false);

    const jobsResponse = await fetchCompanyJobs(currentPage, itemsPerPage);
    // Add safety checks and default values
    const jobsData = jobsResponse?.data?.data || {};
    const newJobs = jobsData?.jobs || [];

    setJobs(newJobs);
    setTotalPages(jobsData?.totalPages || 1);
    
    setStats((prev) => ({
      ...prev,
      // activeJobs: newJobs.filter((job) => job.active).length,
      totalJobs:newJobs.length,
      topPerformingJobs: newJobs
        .sort((a, b) => ((b.applications?.length || 0) - (a.applications?.length || 0)))
        .slice(0, 3),
    }));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to post job';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      setLoading(true);
      await deleteCompanyJob(jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setStats((prev) => ({
        ...prev,
        activeJobs: prev.activeJobs - (jobs.find((j) => j._id === jobId)?.active ? 1 : 0),
        topPerformingJobs: prev.topPerformingJobs.filter((j) => j._id !== jobId),
      }));
      toast.success('Job deleted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete job';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setLoading(true);
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      setStats((prev) => ({
        ...prev,
        interviewsScheduled: applications.filter((a) => a.status === 'Shortlisted').length + (newStatus === 'Shortlisted' ? 1 : 0),
        hiringRate: applications.length
          ? ((applications.filter((a) => a.status === 'Applied').length + (newStatus === 'Applied' ? 1 : 0)) / applications.length) * 100
          : 0,
      }));
      toast.success('Application status updated!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !token) {
    return <div className="text-center mt-20 text-lg text-red-600">Please log in to access the dashboard.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => setError('')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Company Dashboard</h1>
                <p className="text-gray-600">Welcome  {userFullName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
           
            { title: 'Total Applications', value: stats.totalApplications, icon: Users, bg: 'bg-green-100', color: 'text-green-600' },
            { title: 'Interviews Scheduled', value: stats.interviewsScheduled, icon: Calendar, bg: 'bg-purple-100', color: 'text-purple-600' },
            { title: 'Hiring Rate', value: `${stats.hiringRate}%`, icon: TrendingUp, bg: 'bg-yellow-100', color: 'text-yellow-600' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
           
                { id: 'applications', label: 'Applications', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {stats.recentApplications?.length > 0 ? (
                        stats.recentApplications.map((app) => (
                          <div key={app._id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                               {userFullName?.charAt(0) || 'A'}

                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {app.user?.firstName} {app.user?.lastName || 'Applicant'}
                              </p>
                              <p className="text-xs text-gray-600 truncate">Applied for {app.job?.jobTitle || 'a position'}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{app.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No recent applications</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
                    <div className="space-y-3">
                      {stats.topPerformingJobs?.length > 0 ? (
                        stats.topPerformingJobs.map((job) => (
                          <div key={job._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{job.jobTitle}</p>
                              <p className="text-xs text-gray-600 truncate">{job.companyDescription || 'No description'}</p>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-sm font-semibold text-green-600">
                                {job.applications?.length || 0} applications
                              </p>
                              <p className="text-xs text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No top performing jobs yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Job Postings</h3>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Job
                  </button>
                </div>
                <div className="space-y-4">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <div key={job._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-base font-semibold text-gray-900 truncate">{job.jobTitle}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.active ? 'active' : 'closed')}`}>
                                {job.active ? 'Active' : 'Closed'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                              <span>{job.companyName || 'Not specified'}</span>
                              <span>{job.location}</span>
                              <span>{job.jobType}</span>
                              {job.saleryRange && <span className="font-semibold text-green-600">{job.saleryRange}</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                              <span className="text-xs text-gray-600">{job.applications?.length || 0} applications</span>
                              <span className="text-xs text-gray-600">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <p className="text-gray-500">No jobs posted yet</p>
                      <button
                        onClick={() => setShowJobForm(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </button>
                    </div>
                  )}
                </div>
                {jobs.length > 0 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        currentPage <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {userFullName?.charAt(0) || 'A'}

                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-base font-semibold text-gray-900 truncate">
                                {app.user?.firstName} {app.user?.lastName || 'Applicant'}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">Applied for {app.job?.jobTitle || 'a position'}</p>
                              <p className="text-xs text-gray-500 truncate">
                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 truncate">{app.experience || 'Not specified'}</p>
                              <div className="flex items-center justify-end space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{app.rating?.toFixed(1) || '0.0'}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {app.skills?.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs truncate">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <select
                              value={app.status || 'Applied'}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <p className="text-gray-500">No applications received yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Post New Job</h2>
                  <button
                    onClick={() => setShowJobForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <JobForm onClose={() => setShowJobForm(false)} onSubmit={handleJobSubmit} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDB;