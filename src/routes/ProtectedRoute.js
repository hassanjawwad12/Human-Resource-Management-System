import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredFeature }) => {
    const { user } = useSelector((state) => state.loginReducer);

    if (!user.userFeatures || user.userFeatures.length === 0) {
        // If userFeatures is null, only allow access to Admin Module
        return requiredFeature === 'Admin Module' ? children : <Navigate to="/admin" />;
    }

    const hasPermission = user.userFeatures.some(
        (feature) => feature.featureGroupLabel === requiredFeature
    );

    return hasPermission ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;