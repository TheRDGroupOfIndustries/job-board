import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmailOtp from "../pages/auth/VerifyEmailOtp";
import Layout from "../layout/Layout";
import HeroSection from "../pages/common/home/HeroSection";
import Category from "../pages/common/home/Category";
import USerDB from "../pages/users/USerDB";
import UserProfile from "../pages/users/UserProfile";
import JobDetail from "../pages/users/JobDetail";
import JobCardGrid from "../pages/common/home/JobCardGrid"
import ProtectedRoute from "../routes/ProtectedRoute";
import Advice from "../pages/common/home/Advice";
import SavedJobs from "../pages/users/SavedJobs";
import AllApplications from "../pages/users/AllApplications";
import SettingProfile from "../pages/users/SettingProfile";
import AllJobs from "../pages/users/AllJobs";
import JobForm from "../pages/company/JobForm";
import CompanyProfileForm from "../pages/company/CompanyProfileForm";
import CompanyApplications from "../pages/company/JobApplication";
import FilteredJobsByTitle from "../pages/common/home/FilteredJobsByTitle";
import ApplicationDetail from "../pages/users/ApplicationDetail";
import CompanyProfileSetting from "../pages/company/CompanyProfileSetting";
import CompanyRec from "../pages/company/CompanyRec";
import MyJobs from "../pages/company/MyJobs";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />     
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-email-otp" element={<VerifyEmailOtp />} />
       <Route path="/getJobs" element={<JobCardGrid />} />
       <Route path="/category" element={<Category/>}/>
       <Route path="/advice" element={<Advice/>}/>
       <Route path="/jobs" element={<FilteredJobsByTitle/>}/>


      <Route
        path="/company-dashboard"
        element={
          <ProtectedRoute>
         <CompanyRec/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobseeker-dashboard"
        element={
          <ProtectedRoute>
            <USerDB />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobseeker-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <SettingProfile/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-posts"
        element={
          <ProtectedRoute>
          <AllJobs/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app-posts"
        element={
          <ProtectedRoute>
            <AllApplications />
          </ProtectedRoute>
        }
      />

      <Route path="/jobs/:id" element={<JobDetail />} />

      <Route path="/apps/:id" element={<ApplicationDetail/>} />


      <Route
        path="/"
        element={
          <Layout>
            <HeroSection />
            <Category />
            <JobCardGrid/>           
            <Advice />            
          </Layout>
        }
      />
       
      
      <Route
        path="/post-job"
        element={
          <ProtectedRoute>
            <JobForm />
          </ProtectedRoute>
        }
      />
     
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <CompanyApplications />
          </ProtectedRoute>
        }
      />
       <Route
        path="/company-jobs"
        element={
          <ProtectedRoute>
            <MyJobs/>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/company-profile"
        element={
          <ProtectedRoute>
            <CompanyProfileForm/>
          </ProtectedRoute>
        }
      />
       <Route
        path="/company-setting"
        element={
          <ProtectedRoute>
            <CompanyProfileSetting/>
          </ProtectedRoute>
        }
      />
    
    </Routes>
  );
}

export default AppRoutes;