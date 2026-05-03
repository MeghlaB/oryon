import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const PaymentSucces = () => {
    const {tranId}=useParams()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <CheckCircle2 className="text-green-500 mx-auto mb-4" size={60} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your mobile banking payment has been completed successfully.
        </p>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-500">Transaction ID:{tranId}</p>
          <p className="font-semibold text-gray-800">TXN123456789</p>
        </div>
        <button className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSucces;