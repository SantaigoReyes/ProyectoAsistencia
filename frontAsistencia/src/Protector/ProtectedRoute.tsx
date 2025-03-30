import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = localStorage.getItem("role");
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  if (!role || !allowed.includes(role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
