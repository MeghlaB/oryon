import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function PaymentFailed() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Payment Failed
        </h1>
        <p className="mb-6 text-gray-600">
          Sorry, your payment was not successful. Please try again or use another payment method
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/checkout"
            className="px-5 py-2 text-white transition bg-red-600 shadow rounded-xl hover:bg-red-700"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="px-5 py-2 transition border border-gray-300 shadow rounded-xl hover:bg-gray-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
