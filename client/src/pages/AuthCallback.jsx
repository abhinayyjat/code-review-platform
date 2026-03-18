import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";

export default function AuthCallback() {
  var navigate = useNavigate();
  var setAuth = useAuthStore(function (s) {
    return s.setAuth;
  });

  useEffect(function () {
    var params = new URLSearchParams(window.location.search);
    var token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Temporarily set token so api.js can attach it for the /me call
    api
      .get("/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(function (res) {
        setAuth(res.data, token);
        navigate("/dashboard", { replace: true });
      })
      .catch(function () {
        localStorage.removeItem("crp_token");
        navigate("/login", { replace: true });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0f",
        color: "#fff",
      }}
    >
      Signing you in...
    </div>
  );
}
