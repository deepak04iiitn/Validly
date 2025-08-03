import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from './redux/user/userSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Ideas from './pages/Ideas';
import ForgotPassword from './pages/ForgotPassword';
import Collaborate from './pages/Collaborate';
import Hiring from './pages/Hiring';
import Promote from './pages/Promote';
import JobDetails from './pages/JobDetails';
import Mentorship from './pages/Mentorship';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import MentorApply from './pages/MentorApply';
import MentorDashboard from './pages/MentorDashboard';
import MentorProfile from './pages/MentorProfile';

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiry = localStorage.getItem('tokenExpiry');
        if (token && expiry) {
            const timeLeft = Number(expiry) - Date.now();
            if (timeLeft > 0) {
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    dispatch(signoutSuccess());
                }, timeLeft);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                dispatch(signoutSuccess());
            }
        } else {
            dispatch(signoutSuccess());
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/sign-in' element={<SignIn />} />
                        <Route path='/sign-up' element={<SignUp />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/ideas' element={<Ideas />} />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/collaborate' element={<Collaborate />} />
                        <Route path='/hiring' element={<Hiring />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                        <Route path='/promote' element={<Promote />} />
                        <Route path='/mentorship' element={<Mentorship />} />
                        <Route path='/mentorship/mentor-apply' element={<MentorApply />} />
                        <Route path='/mentor-profile/:mentorId' element={<MentorProfile />} />
                        <Route element={<PrivateRoute />}>
                            <Route path='/dashboard' element={<Dashboard />} />
                            <Route path='/mentordashboard' element={<MentorDashboard />} />
                        </Route>
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}