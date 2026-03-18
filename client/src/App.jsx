import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
// import { Dashboard } from "./pages/Dashboard";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ReviewPage from "./pages/ReviewPage";
import HistoryPage from "./pages/HistoryPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
