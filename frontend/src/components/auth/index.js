// ============================
// Signup
// ============================
export const signup = (user) => {
  return fetch("/api/register", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => ({ error: "Signup failed", details: err }));
};

// ============================
// Signin
// ============================
export const signin = (user) => {
  return fetch("/api/signin", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => ({ error: "Signin failed", details: err }));
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
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

// ============================
// Signout
// ============================
export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt"); // remove token from localStorage
    next();
  }

  // Optional: call backend to clear cookie/session
  return fetch("/api/signout", {
    method: "GET",
  })
    .then((res) => {
      console.log("Signout success");
      return res.json();
    })
    .catch((err) => console.log("Signout error:", err));
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
