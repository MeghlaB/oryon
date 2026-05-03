import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthProvider";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

const {user}=useContext(AuthContext)

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://gadgetzone-server.onrender.com/orders?email=${user?.email}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <p className="text-xl mb-2">No orders found</p>
        <p>Looks like you haven't placed any orders yet.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-600">#</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Product</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Quantity</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Price</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Total</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6">{order.product.title}</td>
                <td className="py-4 px-6">{order.quantity}</td>
                <td className="py-4 px-6">{order.product.price} ৳</td>
                <td className="py-4 px-6">{order.totalPrice} ৳</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
