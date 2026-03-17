import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPortalToken } from "../lib/session";

type RequirePortalAuthProps = {
  children: ReactElement;
};

export default function RequirePortalAuth({ children }: RequirePortalAuthProps) {
  const token = getPortalToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
