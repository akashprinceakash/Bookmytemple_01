import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function RequirePhoneNumber({ children }: Props) {
  const location = useLocation();

  if (!location.state?.phoneNumber) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}