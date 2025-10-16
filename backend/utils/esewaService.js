import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// --- Configuration ---
// Ensure these variables are set in your .env file
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBmTpK2pENR1Jc'; // Use your actual secret key
const ESEWA_VERIFICATION_URL = process.env.ESEWA_VERIFICATION_URL || 'https://uat.esewa.com.np/api/epay/transaction/status/'; // Use UAT or production URL
const ESEWA_PRODUCT_CODE = 'EPAYTEST'; // Use your actual service code (usually 'EPAYTEST' for UAT)

/**
 * Generates the HMAC-SHA256 signature required by eSewa for API calls.
 * @param {string} dataToSign - The concatenated string of payment parameters.
 * @returns {string} The Base64 encoded signature.
 */
export const generateSignature = (dataToSign) => {
    // Uses the crypto library to generate HMAC SHA256 signature
    const signature = crypto
        .createHmac('sha256', ESEWA_SECRET_KEY)
        .update(dataToSign)
        .digest('base64');
    return signature;
};


/**
 * 1. Creates the necessary data structure and signature for eSewa redirection.
 * This data is typically submitted via a hidden form from the frontend.
 * @param {object} options
 * @param {number} options.amount - The total amount to be charged.
 * @param {string} options.orderId - Your unique Payment ID (the MongoDB _id).
 * @param {string} options.successUrl - The backend URL eSewa redirects to on success.
 * @param {string} options.failureUrl - The frontend URL eSewa redirects to on failure.
 * @returns {object} The payload object ready for frontend submission.
 */
export const generateEsewaPayload = ({ amount, orderId, successUrl, failureUrl }) => {
    const total_amount = amount;
    const tax_amount = 0; // Assuming tax is already included in the total amount
    const service_charge = 0;
    const delivery_charge = 0;
    const product_code = ESEWA_PRODUCT_CODE;
    const transaction_uuid = orderId; // Use the unique payment ID

    // Data concatenation order is CRITICAL for the signature
    const dataToSign = 
        `total_amount=${total_amount},` +
        `transaction_uuid=${transaction_uuid},` +
        `product_code=${product_code}`;
    
    const signature = generateSignature(dataToSign);

    return {
        amount: total_amount - tax_amount - service_charge - delivery_charge,
        tax_amount: tax_amount,
        total_amount: total_amount,
        service_charge: service_charge,
        delivery_charge: delivery_charge,
        product_code: product_code,
        // Unique identifier for the transaction
        transaction_uuid: transaction_uuid,
        // Redirect URLs
        success_url: successUrl,
        failure_url: failureUrl,
        // The secure hash
        signature: signature,
        // Optional: you can include the user ID here if needed, but it's often safer to rely on your DB record
    };
};


/**
 * 2. Verifies the payment with the eSewa server after the user is redirected back.
 * @param {string} eSewaResponseData - The Base64 encoded data from the URL query parameter (req.query.data).
 * @returns {object} A result object containing verification status and transaction details.
 */
export const verifyEsewaPayment = async (eSewaResponseData) => {
    let decodedData;
    
    try {
        // eSewa sends a Base64 encoded JSON string
        const buffer = Buffer.from(eSewaResponseData, 'base64');
        decodedData = JSON.parse(buffer.toString('utf8'));
    } catch (e) {
        console.error('Failed to decode eSewa response data:', e);
        return { isVerified: false, error: 'Invalid response data format' };
    }

    const { transaction_code: refId, status, total_amount: amount, transaction_uuid: orderId } = decodedData;

    if (status !== 'COMPLETE') {
        return { isVerified: false, error: `Transaction status is ${status}` };
    }

    // --- SECONDARY SERVER-TO-SERVER VERIFICATION ---
    // This step is critical to prevent fraud. We query eSewa's API directly.
    try {
        const response = await axios.get(ESEWA_VERIFICATION_URL, {
            params: {
                // The transaction code received from eSewa redirect
                transaction_code: refId, 
                // The unique ID we sent in the initial request
                product_code: ESEWA_PRODUCT_CODE 
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // eSewa's verification response structure may vary. 
        // We typically expect a 200 OK status and check the returned JSON body.
        
        // Example check based on typical eSewa API response (adjust as needed)
        if (response.data && response.data.status === 'COMPLETE') {
            return {
                isVerified: true,
                refId: refId,
                orderId: orderId,
                amount: amount,
            };
        } else {
            console.warn('eSewa API verification failed:', response.data);
            return { isVerified: false, error: 'eSewa API verification failed' };
        }

    } catch (error) {
        console.error('Error during server-to-server verification with eSewa:', error.message);
        return { isVerified: false, error: 'Internal verification failure' };
    }
};