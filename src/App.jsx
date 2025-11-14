import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./store/slices/authSlice";
import { initializeSocket } from "./utils/socket";
import { addNotification } from "./store/slices/notificationsSlice";

// Layout
import Layout from "./components/Layout/Layout";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Leads from "./pages/Leads/Leads";
import LeadDetail from "./pages/Leads/LeadDetail";
import CreateLead from "./pages/Leads/CreateLead";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load user on mount
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // Initialize WebSocket connection
    if (isAuthenticated && token) {
      const socket = initializeSocket(token);

      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("notification", (notification) => {
        dispatch(
          addNotification({
            id: Date.now(),
            ...notification,
            read: false,
          })
        );
      });

      socket.on("leadUpdated", (data) => {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "lead",
            message: `Lead ${data.leadName} has been updated`,
            read: false,
          })
        );
      });

      socket.on("activityCreated", (data) => {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "activity",
            message: `New activity added to ${data.leadName}`,
            read: false,
          })
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, token, dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/new" element={<CreateLead />} />
        <Route path="leads/:id" element={<LeadDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
