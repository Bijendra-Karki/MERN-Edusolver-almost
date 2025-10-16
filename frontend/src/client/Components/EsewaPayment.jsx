import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { isAuthenticated } from "../../components/utils/authHelper";

const EsewaPayment = () => {
  const { token, user } = isAuthenticated();

  // Get order info from session storage
  const orderInfo = JSON.parse(
    sessionStorage.getItem("currentSubjectPaymentDetails")
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay-btn").disabled = true;

    if (!orderInfo || !orderInfo.subject_id || !orderInfo.price) {
      toast.error("Payment info missing. Please try again.");
      document.querySelector("#pay-btn").disabled = false;
      return;
    }

    try {
      // 1️⃣ Create payment record in backend
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const paymentResponse = await axios.post(
        "http://localhost:5173/api/payments/create",
        {
          subject_id: orderInfo.subject_id,
          amount: orderInfo.price,
          method: "eSewa",
        },
        config
      );

      const paymentData = paymentResponse.data;
      console.log("Payment record created:", paymentData);

      // 2️⃣ Prepare eSewa form data
      const transaction_uuid = `order-${Math.floor(Math.random() * 1000000)}`;
      const formData = {
        amount: orderInfo.price,
        tax_amount: 0,
        total_amount: orderInfo.price,
        transaction_uuid,
        product_code: "EPAYTEST",
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: "http://localhost:5173/payment-success",
        failure_url: "http://localhost:5173/payment-failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      // 3️⃣ Get signature from backend
      const { data: signatureData } = await axios.post(
        "http://localhost:5173/api/payments/sign",
        formData,
        config
      );

      const { signature } = signatureData;

      // 4️⃣ Submit form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });

      const signatureInput = document.createElement("input");
      signatureInput.type = "hidden";
      signatureInput.name = "signature";
      signatureInput.value = signature;
      form.appendChild(signatureInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Error in payment flow:", err);
      toast.error("Something went wrong. Please try again.");
      document.querySelector("#pay-btn").disabled = false;
    }
  };

  return (
    <>
      <Helmet>
        <title>eSewa Payment</title>
      </Helmet>
      <ToastContainer theme="colored" />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-5 p-3 my-4">
            <form onSubmit={submitHandler}>
              <h2 className="mb-3">eSewa Payment</h2>
              <div className="mb-2">
                <label>Total Amount</label>
                <p className="form-control">Rs. {orderInfo?.price}</p>
              </div>
              <div className="mb-2">
                <button className="btn btn-warning form-control" id="pay-btn">
                  Pay with eSewa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EsewaPayment;
