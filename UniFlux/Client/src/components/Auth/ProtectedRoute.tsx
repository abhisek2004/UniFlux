import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useApp();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
