import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/auth.route.js';
import  postJobsRoutes  from './routes/postJobs.route.js';
import userProfileRoutes from './routes/userProfile.route.js';
import companyProfileRoutes from './routes/companyProfile.route.js';
import adminProfileRoutes from './routes/adminProfile.route.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import jobApplicationRoutes from "./routes/jobApplication.routes.js";


app.use("/api/v1/users",userRoutes)
app.use("/api/v1/postJobs",postJobsRoutes)
app.use("/api/v1/userProfile",userProfileRoutes)
app.use("/api/v1/companyProfile",companyProfileRoutes)
app.use("/api/v1/adminProfile",adminProfileRoutes)
app.use("/api/v1/subscription",subscriptionRoutes)
app.use("/api/v1/applications", jobApplicationRoutes);


export { app };