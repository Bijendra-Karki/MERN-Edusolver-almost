import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';


// This component ensures all children are protected for a 'student'
const AdminRoute = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="admin">
            {children}
        </ProtectedRoute>
    );
};

export default AdminRoute;