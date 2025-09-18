import React, { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
// import { isAuthenticated } from '../../components/auth/AuthContainer'; // Corrected import
// import { APP_URL } from '../config';

function EsewaPaymentPage() {
  const userInfo = isAuthenticated(); // Corrected function call
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

  // Redirect if user is not authenticated or order info is missing
  useEffect(() => {
    if (!userInfo || !orderInfo) {
      // You can add a redirect here, for example:
      // window.location.href = '/'; 
      toast.error('Authentication or order information missing.');
    }
  }, [userInfo, orderInfo]);

  const handleEsewaPayment = () => {
    if (!orderInfo || !orderInfo.totalPrice) {
      toast.error('Order information not found.');
      return;
    }

    // You will need to implement the actual eSewa payment logic here.
    // This typically involves constructing a form and submitting it to the eSewa gateway.
    // The details will depend on the specific eSewa API you are using.
    // This is just a placeholder.
    console.log('Initiating eSewa payment for amount:', orderInfo.totalPrice);
    toast.info('eSewa payment gateway is not implemented in this demo.');
  };

  // if (!userInfo || !orderInfo) {
  //   return (
  //     <div className="container text-center py-5">
  //       <p className="text-danger">Redirecting...</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Helmet>
        <title>eSewa Payment</title>
      </Helmet>
      <ToastContainer theme='colored' />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-5 p-3 my-4">
            <form onSubmit={(e) => { e.preventDefault(); handleEsewaPayment(); }}>
              <h2 className='mb-3'>eSewa Payment</h2>
              <div className="mb-2">
                <label htmlFor="amount">Total Amount</label>
                <p className='form-control'>Rs.{orderInfo?.totalPrice}</p>
              </div>
              <div className="mb-2">
                <button type="submit" className='btn btn-warning form-control' id='pay-btn'>
                  Pay with eSewa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EsewaPaymentPage;