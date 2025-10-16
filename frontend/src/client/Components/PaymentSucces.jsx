import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectId = params.get('subjectId');
    const paymentId = params.get('paymentId');
    const refId = params.get('refId');

    if (subjectId && paymentId && refId) {
      // Success: Set details and clear session
      setDetails({ subjectId, paymentId, refId });
      setStatus('Payment Successful!');

      sessionStorage.removeItem('currentSubjectPaymentDetails');

      // Optional: Auto-redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate('/my-courses');
      }, 5000);

      return () => clearTimeout(timer); // cleanup
    } else {
      // Verification failed
      setStatus('Verification Failed or Data Missing.');
      const timer = setTimeout(() => {
        navigate('/payment-failure');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{status}</h1>

        {details ? (
          <>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your enrollment has been successfully processed.
            </p>
            <div className="text-left bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800"><strong>Course ID:</strong> {details.subjectId}</p>
              <p className="text-sm text-green-800"><strong>Transaction ID (eSewa):</strong> {details.refId}</p>
              <p className="text-sm text-green-800"><strong>Payment Record ID:</strong> {details.paymentId}</p>
            </div>
            <button
              onClick={() => navigate('/my-courses')}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to My Courses
            </button>
            <p className="text-sm text-gray-500 mt-2">You will be redirected automatically in 5 seconds...</p>
          </>
        ) : (
          <p className="text-red-500 mt-4">
            Please wait while we redirect you to the failure page...
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
