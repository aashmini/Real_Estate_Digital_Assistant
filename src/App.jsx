import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import BrokerDashboard from "./pages/BrokerDashboard";
import UserVisits from "./pages/UserVisits";
import PropertyDetails from "./pages/PropertyDetails";
import MeetingsPage from "./pages/meetings/MeetingsPage";
import DecksPage from "./pages/decks/DecksPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import BookmarksPage from "./pages/BookmarksPage";
import EditProfilePage from "./pages/EditProfilePage";
import 'antd/dist/reset.css';  // For Ant Design v5+ styling
function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Property Details (Public) */}
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              role === "user" ? (
                <UserDashboard />
              ) : (
                <Navigate to="/broker-dashboard" replace />
              )
            ) : (
              <Navigate to="/auth?role=user" replace />
            )
          }
        />

        <Route
          path="/my-visits"
          element={
            currentUser && role === "user" ? (
              <UserVisits />
            ) : (
              <Navigate to="/auth?role=user" replace />
            )
          }
        />

        {/* Broker Routes */}
        <Route
          path="/broker-dashboard"
          element={
            currentUser && role === "broker" ? (
              <BrokerDashboard />
            ) : (
              <Navigate to="/auth?role=broker" replace />
            )
          }
        />

        <Route
          path="/meetings"
          element={
            currentUser && role === "broker" ? (
              <MeetingsPage />
            ) : (
              <Navigate to="/auth?role=broker" replace />
            )
          }
        />

        <Route
          path="/decks"
          element={
            currentUser && role === "broker" ? (
              <DecksPage />
            ) : (
              <Navigate to="/auth?role=broker" replace />
            )
          }
        />

        <Route
          path="/analytics"
          element={
            currentUser && role === "broker" ? (
              <AnalyticsPage />
            ) : (
              <Navigate to="/auth?role=broker" replace />
            )
          }
        />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
