// src/hooks/useForm.js

import { useState } from "react";

export const useForm = (initialState, validate) => {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(data);
    }
  };

  return {
    data,
    errors,
    handleChange,
    handleSubmit,
    setData,
    setErrors,
  };
};

export const validateSignUp = (data) => {
  const errors = {};
  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!data.email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }
  if (!/^\d+$/.test(data.phone)) {
    errors.phone = "Phone number must contain only numbers";
  } else if (data.phone.length < 10) {
    errors.phone = "Phone number must be at least 10 characters long";
  }
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

export const validateSignIn = (data) => {
  const errors = {};
  if (!data.username) {
    errors.username = "Username is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }
  return errors;
};