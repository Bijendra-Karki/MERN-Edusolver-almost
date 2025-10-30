"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("Verifying Payment...");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const verifyPayment = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const encodedData = params.get("data");

      if (!encodedData) throw new Error("Missing payment data in URL");

      // Call backend verification via POST
      const res = await axios.post(
        "/api/payments/verify",
        { data: encodedData },
        { timeout: 10000 }
      );

      if (res.data.verified) {
        setStatus("Payment Verified ✅");
        const { refId, amount, orderId } = res.data;

        setDetails({
          transactionId: refId,
          amount: amount,
          uuid: orderId,
          status: "COMPLETED",
        });

        // Clear sessionStorage if used
        sessionStorage.removeItem("currentSubjectPaymentDetails");
      } else {
        throw new Error(res.data.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setStatus("Payment Verification Failed ❌");
      setError(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
        {error ? (
          <>
            <svg
              className="w-16 h-16 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h1 className="text-3xl font-bold text-red-700 mb-2">{status}</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to failure page...</p>
          </>
        ) : !details ? (
          <>
            <svg
              className="w-16 h-16 mx-auto text-blue-500 mb-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="4" />
              <path strokeLinecap="round" strokeWidth="4" d="M12 6v6l3 3" />
            </svg>
            <h1 className="text-2xl font-semibold text-gray-700">{status}</h1>
            <p className="text-gray-500 mt-2">Please wait...</p>
          </>
        ) : (
          <>
            <svg
              className="w-16 h-16 mx-auto text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{status}</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your enrollment has been successfully verified.
            </p>
            <div className="text-left bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Transaction ID:</strong> {details.transactionId}
              </p>
              <p className="text-sm text-green-800">
                <strong>Amount:</strong> Rs. {details.amount}
              </p>
              <p className="text-sm text-green-800">
                <strong>Reference (UUID):</strong> {details.uuid}
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to My Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
