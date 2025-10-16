"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../components/utils/authHelper"; // Assuming this path is correct

// --- Helper Components/Functions (Extracted for Clarity) ---

/**
 * Creates and submits the hidden form to the eSewa gateway.
 * @param {object} formData - eSewa required data (amount, product_code, etc.).
 * @param {string} signature - The HMAC signature from the backend.
 */
const submitEsewaForm = (formData, signature) => {
  const ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // Use the correct URL

  const form = document.createElement("form");
  form.method = "POST";
  form.action = ESEWA_URL;

  // Add all formData fields
  Object.keys(formData).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });
  

  // Add the signature field
  const signatureInput = document.createElement("input");
  signatureInput.type = "hidden";
  signatureInput.name = "signature";
  signatureInput.value = signature;
  form.appendChild(signatureInput);
  document.body.appendChild(form);
  form.submit();
};

// --- Main Component ---

function EsewaPaymentPage() {
  const navigate = useNavigate();
  const token = getToken();

  // 1. State for Data, Loading, and UI Feedback
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Unified Toast Handler
  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    // Clear toast after 4 seconds
    setTimeout(() => setToast(null), 4000);
  };

  // 2. Effect for Data Loading and Validation
  useEffect(() => {
    try {
      const infoString = sessionStorage.getItem("currentSubjectPaymentDetails");
      if (!infoString) {
        throw new Error("Missing session storage data.");
      }
      
      const info = JSON.parse(infoString);

      // Validate required fields: subject_id and a positive price
      const price = Number.parseFloat(info.price);
      if (
        !info.subject_id ||
        isNaN(price) ||
        price <= 0
      ) {
        throw new Error("Invalid or incomplete payment details.");
      }

      setSubjectInfo({ ...info, price: price.toFixed(2) }); // Ensure price is clean and formatted
    } catch (e) {
      console.error("Payment details error:", e.message);
      showToast("Error", "Payment details missing or invalid. Please select a course again.", "destructive");
      setSubjectInfo(null); // Explicitly set to null to trigger error UI
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means run once on mount

  // 3. Payment Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final checks before initiating
    if (!subjectInfo) {
      showToast("Error", "Cannot proceed. Missing subject details.", "destructive");
      return;
    }
    
    // Use the dedicated 'isSubmitting' state to manage button/UI disable
    setIsSubmitting(true);
    showToast("Initiating...", "Creating payment record and getting eSewa credentials.");

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
     

      const initiationData = {
        subjectId: subjectInfo.subject_id,
        amount: Number(subjectInfo.price), // Already cleaned in useEffect, but Number() is safe

      };
     

      // 1. Initiate Payment on the Backend
      const { data: initiationResult } = await axios.post(
        `/api/payments/initiate`,
        initiationData,
        config
      );
      
      const { formData, signature } = initiationResult;

      // 2. Redirect to eSewa (using the extracted helper function)
      showToast("Redirecting...", "Taking you to eSewa secure payment gateway");
      submitEsewaForm(formData, signature);
      
      // Note: We don't set isSubmitting(false) here because the user is redirected away immediately.

    } catch (err) {
      console.error("eSewa Initiation Error:", err.response?.data || err.message);
      setIsSubmitting(false); // Enable the button again on failure
      // Display the specific error message from the backend if available
      showToast(
        "Payment Failed",
        err.response?.data?.message || "Something went wrong. Please try again.",
        "destructive"
      );
    }
  };

  // 4. Conditional Rendering (Early Exits)
  const isProcessing = isLoading || isSubmitting;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  if (!subjectInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">
          Error: Invalid or missing course payment details.
        </p>
        {/* Toast will show the user a friendly message */}
      </div>
    );
  }

  // 5. Main Render
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 flex items-center justify-center p-4">
      {/* ... (Rest of the presentational code remains the same) ... */}
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">eSewa Payment</h2>
                <p className="text-blue-100 text-sm">Course: {subjectInfo.title || "Subject Enrollment"}</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
                  Total Amount (Fixed)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
                  <input
                    id="amount"
                    type="number"
                    value={subjectInfo.price}
                    disabled
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium text-black bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id='pay-btn' // Kept for styling, but not used for JS DOM manipulation anymore
                disabled={isProcessing} // Use the combined state
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-3 text-white" viewBox="0 0 24 24">...</svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Pay Rs. {subjectInfo.price} with eSewa
                  </>
                )}
              </button>
              
              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secured by eSewa</span>
              </div>
            </form>

            {/* Info Alert */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-800">
                You will be redirected to eSewa's secure payment gateway to complete your transaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification (Assuming the provided Toast logic is complete) */}
      {/* ... (The existing toast rendering logic is fine) ... */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`min-w-[300px] rounded-xl shadow-2xl border p-4 ${
              toast.variant === "destructive" ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-5 h-5 flex-shrink-0 ${
                  toast.variant === "destructive" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {toast.variant === "destructive" ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-sm ${
                    toast.variant === "destructive" ? "text-red-900" : "text-gray-900"
                  }`}
                >
                  {toast.title}
                </h3>
                <p className={`text-sm mt-1 ${toast.variant === "destructive" ? "text-red-700" : "text-gray-600"}`}>
                  {toast.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EsewaPaymentPage;