import React from 'react'
import { Link } from 'react-router-dom'

const PaymentFailure = () => {
  return (
    <>
     <div className="container text-center my-5">
                <h2>Payment Failed</h2>
                <p>Unfortunately,your payment could not be processed.Please try again</p>
                <Link to='/confirm' className='btn btn-danger mt-4'>
                    Try Again
                </Link>
            </div>
    </>
  )
}

export default PaymentFailure