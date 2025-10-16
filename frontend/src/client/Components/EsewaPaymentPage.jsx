// EsewaPaymentPage.jsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getToken } from "../../components/utils/authHelper" // Assuming this path is correct

// Helper function to safely generate a UUID if one is missing from session storage (No longer needed on the frontend, but kept for context if SubjectInfo is lacking it)
// const generateUuid = () => `order-${Date.now()}-${Math.floor(Math.random() * 10000)}`; 

function EsewaPaymentPage() {
  const navigate = useNavigate();
  const token = getToken();

  // 1. State for SubjectInfo and Loading
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  }

  // Effect to load data and perform checks
useEffect(() => {
      const loadSubjectInfo = () => {
        let info = sessionStorage.getItem('currentSubjectPaymentDetails');
        if (info) {
          try {
            info = JSON.parse(info);
            
            // 🎯 Log the data you found
            console.log("SubjectInfo loaded from storage:", info);
            
            // Ensure price is a valid number > 0 AND check for required IDs
            if (info && info.price && Number.parseFloat(info.price) > 0 && info.subject_id) {
              setSubjectInfo(info);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse subject info from session storage:", e);
          }
        }
        
        // If data is invalid or missing, set info to null and stop loading
        setSubjectInfo(null);
        setIsLoading(false);
        showToast("Error", "Payment details missing or invalid. Please select a course again.", "destructive");
      };
      loadSubjectInfo();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🎯 Log data just before the validation check
        console.log("Attempting payment with subjectInfo:", subjectInfo);

        if (!subjectInfo || !subjectInfo.subject_id || !subjectInfo.price) {
            showToast("Error", "Missing necessary subject details for payment.", "destructive");
            return;
        }

    const payBtn = document.querySelector('#pay-btn');
    payBtn.disabled = true;
    setIsLoading(true);

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        // 🎯 FIX: Explicitly ensure the amount is a Number for the backend.
        const initiationData = {
            subjectId: subjectInfo.subject_id, // Ensure this property exists
            amount: Number(subjectInfo.price), // Convert string price to Number
        };

        // Send request to backend to initiate payment and get signature
        const { data: initiationResult } = await axios.post(`/api/payments/initiate`, initiationData, config);
        const { formData, signature } = initiationResult; 
        
        // ... (Rest of the form creation and submission logic remains the same)
        showToast("Redirecting...", "Taking you to eSewa secure payment gateway");

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form' 

        Object.keys(formData).forEach(key => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = formData[key]
            form.appendChild(input)
        })

        const signatureInput = document.createElement('input')
        signatureInput.type = 'hidden'
        signatureInput.name = 'signature'
        signatureInput.value = signature
        form.appendChild(signatureInput)

        document.body.appendChild(form)
        form.submit()
        
    } catch (err) {
        console.error("eSewa Initiation/Submission Error:", err.response?.data || err.message);
        payBtn.disabled = false
        setIsLoading(false);
        // Display the specific error message from the backend if available
        showToast("Payment Failed", err.response?.data?.message || "Something went wrong. Please try again.", "destructive");
    }
}
  // Conditional Rendering based on state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (!subjectInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">
          Error: Invalid or missing course payment details.
        </p>
      </div>
    );
  }


  // The main payment component render
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            {/* ... (SVG and text remains the same) */}
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
                {/* Display Course Name from SubjectInfo */}
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
                    value={subjectInfo.price} // Use fetched price
                    disabled
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium text-black bg-gray-50"
                    required
                  />
                </div>
                {/* Removed transaction_uuid display as it's generated just before redirect now */}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id='pay-btn'
                disabled={isLoading} // Disable button while loading or submitting
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
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
              {/* ... (Security Badge and Info Alert remain the same) */}
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

      {/* Toast Notification */}
      {/* ... (Toast logic remains the same) */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`min-w-[300px] rounded-xl shadow-2xl border p-4 ${toast.variant === "destructive" ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
              }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-5 h-5 flex-shrink-0 ${toast.variant === "destructive" ? "text-red-600" : "text-blue-600"
                  }`}
              >
                {toast.variant === "destructive" ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-sm ${toast.variant === "destructive" ? "text-red-900" : "text-gray-900"
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
  )
}

export default EsewaPaymentPage