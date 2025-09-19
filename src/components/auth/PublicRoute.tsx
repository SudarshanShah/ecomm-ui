import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
