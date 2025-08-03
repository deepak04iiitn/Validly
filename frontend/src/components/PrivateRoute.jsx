import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to='/sign-in' />;
    }

    // Check if user is trying to access admin-only routes
    if (location.pathname === '/dashboard' && !currentUser.isUserAdmin) {
        return <Navigate to='/' />;
    }

    // Check if user is trying to access mentor-only routes
    if (location.pathname === '/mentordashboard' && !currentUser.isMentor) {
        return <Navigate to='/mentorship/mentor-apply' />;
    }

    return <Outlet />;
}