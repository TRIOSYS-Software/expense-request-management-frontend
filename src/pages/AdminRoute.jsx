import { Navigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

const AdminRoute = ({ children }) => {
  const { auth } = useApp();

  if (!auth || auth.role !== 1) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
