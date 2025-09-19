// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) {
  const { token, groups } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const hasAccess = groups?.some(role => allowedRoles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  return children;
}
