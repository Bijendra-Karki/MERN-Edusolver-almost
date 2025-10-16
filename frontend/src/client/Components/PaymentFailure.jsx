import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, ChevronLeft } from 'lucide-react';

// --- Utility: Message Mapping ---
const FAILURE_MESSAGES = {
    // Backend redirect codes from our paymentController.js
    TransactionCancelled: 'The payment was cancelled by you on the eSewa gateway.',
    PaymentVerificationFailed: 'The payment was unsuccessful or failed the final security verification check.',
    PaymentNotFound: 'The payment record was not found in our system. Please check your eSewa statement and contact support.',
    InternalServerError: 'A server error occurred while processing the payment result. Please contact support.',

    // Fallback messages for safety
    InvalidResponse: 'The response from the payment gateway was invalid. Please contact support.',
    Unknown: 'An unexpected error occurred during the payment process.',
};

// --- Custom Hook: URL Data Extraction ---
const useFailureData = (search) => {
    const params = new URLSearchParams(search);

    return {
        msg: params.get('msg'),
        uuid: params.get('uuid'), // Internal transaction ID
        esewaStatus: params.get('esewa_status'), // eSewa's status code (if available)
    };
}


const PaymentFailure = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { msg, uuid, esewaStatus } = useFailureData(location.search);
    const failureMessage = FAILURE_MESSAGES[msg] || FAILURE_MESSAGES.Unknown;

    // 🛑 CRITICAL FIX: Session Cleanup
    useEffect(() => {
        // This ensures that the user starts fresh if they attempt the payment again,
        // preventing the accumulation bug from past iterations.
        sessionStorage.removeItem('currentSubjectPaymentDetails');
        sessionStorage.removeItem('orderInfo'); // Clear any other payment-related keys
    }, []);

    const handleTryAgain = () => {
        // Navigate to the course selection page to start the process fresh.
        navigate('/courses', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-red-500 text-center">

                <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>

                <p className="text-red-700 mb-6 font-medium">
                    {failureMessage}
                </p>

                {(uuid || esewaStatus) && (
                    <div className="text-left bg-red-50 p-4 rounded-lg border border-red-200 mb-6 space-y-1">
                        <h3 className="text-md font-semibold text-red-700 border-b border-red-300 pb-1 mb-2">Diagnostic Information:</h3>
                        {uuid && (
                            <p className="text-sm text-red-800 flex justify-between">
                                <span className="font-medium text-gray-700">Internal Ref ID:</span>
                                <strong className="truncate ml-4">{uuid}</strong>
                            </p>
                        )}
                        {esewaStatus && (
                            <p className="text-sm text-red-800 flex justify-between">
                                <span className="font-medium text-gray-700">eSewa Status Code:</span>
                                <strong className="ml-4">{esewaStatus}</strong>
                            </p>
                        )}
                        <p className="text-xs pt-2 text-gray-500">
                            Please provide these details if you contact support.
                        </p>
                    </div>
                )}

                <button
                    onClick={handleTryAgain}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Return to Course / Try Again
                </button>
            </div>
        </div>
    );
}

export default PaymentFailure;