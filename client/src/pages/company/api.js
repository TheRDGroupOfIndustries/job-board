import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem('token');

const apiRequest = (url, method = 'GET', data = null, auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return axios({
    url: `${API_BASE_URL}${url}`,
    method,
    headers,
    withCredentials: true,
    ...(data && method !== 'GET' && method !== 'DELETE' ? { data } : {}),
  });
};


export const createCompanyJob = (data) => apiRequest('/postJobs/postJob', 'POST', data, true);
export const updateCompanyJob = (jobId, data) => apiRequest(`/postJobs/getAllJobs/${jobId}`, 'PUT', data, true);
export const fetchCompanyJobs = (page = 1, limit = 10) => apiRequest(`/postJobs/getAllJobs?page=${page}&limit=${limit}`, 'GET', null, true);
export const deleteCompanyJob = (jobId) => apiRequest(`/postJobs/getAllJobs/${jobId}`, 'DELETE', null, true);

export const getCompanyJobs = (auth = true) => apiRequest('/postJobs/getAllJob', 'GET', auth);
export const deleteJobById = (id, auth = true) => apiRequest(`/postJobs/JobDelete/${id}`, 'DELETE', auth);


export const fetchCompanyApplications = () => apiRequest('/applications/company-applications', 'GET', null, true);
export const updateApplicationStatus = (applicationId, status) => apiRequest('/applications/update-status', 'POST', { applicationId, status }, true);