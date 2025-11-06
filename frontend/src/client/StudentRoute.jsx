import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';


// This component ensures all children are protected for a 'student'
const StudentRoute = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="student">
            {children}
        </ProtectedRoute>
    );
};

export default StudentRoute;