import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log(API_BASE_URL);

const getToken = () => localStorage.getItem("token");

const apiRequest = (url, method = "GET", dataOrAuth, authOrUndefined) => {
  // Logic to allow flexible params:
  // If 3rd param is boolean, then it's auth flag and data is undefined
  // Otherwise 3rd param is data, 4th param is auth

  let data = null;
  let auth = false;

  if (typeof dataOrAuth === "boolean") {
    auth = dataOrAuth;
  } else {
    data = dataOrAuth;
    auth = authOrUndefined || false;
  }
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return axios({
    url: API_BASE_URL + url,
    method,
    headers,
    withCredentials: true,
    // Only send data if method allows body
    ...(method !== "GET" && method !== "DELETE" ? { data } : {}),
  });
};
export const loginUser = (data) => apiRequest("/users/login", "POST", data);
export const registerUser = (data) => apiRequest("/users/register", "POST", data);
export const sendEmail = (data) => apiRequest("/users/send-otp", "POST",data)
export const verifyLogin = (data) => apiRequest("/users/login-otp", "POST",data)
export const createProfile = (data, auth=true) => apiRequest("/userProfile/create-profile", "POST",data, auth)
export const getProfile = ( auth=true) => apiRequest("/userProfile/create-profile", "GET", auth);
export const updateProfile = (data , auth = true ) => apiRequest("/userProfile/create-profile", "PATCH",data, auth);
export const deleteProfile = (auth = true) => apiRequest("/userProfile/create-profile", "DELETE", auth);

export const createCompanyProfile = (data, auth=true) => apiRequest("/companyProfile/company-profile", "POST",data, auth)
export const getCompanyProfile = ( auth=true) => apiRequest("/companyProfile/company-profile", "GET", auth);
export const updateCompanyProfile = (data , auth = true ) => apiRequest("/companyProfile/company-profile", "PATCH",data, auth);
export const deleteCompanyProfile = (auth = true) => apiRequest("/companyProfile/company-profile", "DELETE", auth);

export const applyJob = (jobId, auth = true) =>
  apiRequest("/applications/apply", "POST", { jobId }, auth);


export const getAllJobs = () => apiRequest("/postJobs/getAllJobs", "GET");
export const allApplication = (auth = true) => apiRequest("/applications/my-applications", "GET", auth);

