// src/utils/authHelpers.js
import axios from "axios";

// ============================
// Signup
// ============================
export const signup = async (user) => {
  try {
    const res = await axios.post("/api/auth/register", user);
    return res.data;
  } catch (err) {
    console.error("Signup failed:", err.response?.data?.error || err.message);
    return { error: err.response?.data?.error || "Signup failed" };
  }
};

// ============================
// Signin
// ============================
export const signin = async (user) => {
  try {
    const res = await axios.post("/api/auth/signin", user);
    return res.data;
  } catch (err) {
    console.error("Signin failed:", err.response?.data?.error || err.message);
    return { error: err.response?.data?.error || "Signin failed" };
  }
};

// ============================
// Authenticate & store token
// ============================
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

// ============================
// Is Authenticated?
// ============================
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("jwt");
  if (!stored) return false;

  try {
    const data = JSON.parse(stored);
    if (data.token && data.user) {
      return data; // { token, user }
    }
    return false;
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return false;
  }
};

// ============================
// Signout
// ============================
export const signout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
  }
  try {
    const res = await axios.get("/api/signout");
    console.log("Signout success:", res.data);
    return res.data;
  } catch (err) {
    console.error("Signout error:", err.response?.data?.error || err.message);
    return { error: err.response?.data?.error || "Signout failed" };
  }
};

// ============================
// Get token helper
// ============================
export const getToken = () => {
  if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt")).token;
  }
  return null;
};