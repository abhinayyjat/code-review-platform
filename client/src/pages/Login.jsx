import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Login() {
  var token = useAuthStore(function (s) {
    return s.token;
  });
  var navigate = useNavigate();

  // Already logged in — skip login page
  useEffect(
    function () {
      if (token) navigate("/dashboard", { replace: true });
    },
    [token, navigate],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0f",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>🔍 CodeReview AI</h1>
      <p style={{ color: "#6b7280", marginBottom: 40, fontSize: 16 }}>
        AI-powered code reviews, instantly
      </p>
      <a
        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/github`}
        style={{
          background: "#238636",
          color: "#fff",
          padding: "14px 32px",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        🐙 Sign in with GitHub
      </a>
    </div>
  );
}
