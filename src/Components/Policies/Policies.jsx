import React from "react";
import {
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaHeadset,
    FaLock,
    FaAward,
    FaCoins,
    FaGift
} from "react-icons/fa";

const PolicyComponent = () => {
    const policies = [
        {
            icon: <FaTruck className="text-3xl text-blue-600" />,
            title: "Free Shipping",
            description: "Free shipping on orders over ৳ 20000",
            details: "Enjoy free delivery on all orders above 20,000 BDT. For orders below this amount, a flat rate of ৳ 150 applies."
        },
        {
            icon: <FaUndo className="text-3xl text-green-600" />,
            title: "Easy Returns",
            description: "30-day money-back guarantee",
            details: "Not satisfied with your purchase? Return it within 30 days for a full refund or exchange. Terms and conditions apply."
        },
        {
            icon: <FaShieldAlt className="text-3xl text-purple-600" />,
            title: "2-Year Warranty",
            description: "Comprehensive product protection",
            details: "All our products come with a standard 2-year warranty covering manufacturing defects and hardware issues."
        },
        {
            icon: <FaHeadset className="text-3xl text-orange-600" />,
            title: "24/7 Support",
            description: "Expert customer service",
            details: "Our support team is available round the clock to assist you with any queries or issues you might have."
        },
        {
            icon: <FaLock className="text-3xl text-red-600" />,
            title: "Secure Payment",
            description: "100% secure transactions",
            details: "We use industry-standard encryption to protect your payment information. Multiple payment options available."
        },
        {
            icon: <FaAward className="text-3xl text-yellow-600" />,
            title: "Authentic Products",
            description: "Genuine products guaranteed",
            details: "We source all our products directly from authorized distributors and manufacturers to ensure authenticity."
        },
        {
            icon: <FaCoins className="text-3xl text-amber-700" />,
            title: "Best Price",
            description: "Price match guarantee",
            details: "Found a lower price elsewhere? Contact us and we'll match it for identical products from authorized sellers."
        },
        {
            icon: <FaGift className="text-3xl text-pink-600" />,
            title: "Special Offers",
            description: "Regular discounts & promotions",
            details: "Subscribe to our newsletter to receive exclusive offers, early access to sales, and special member discounts."
        }
    ];

    return (
        <div className="pt-8 mt-20 bg-gray-50">
            <div className="container px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Why Shop With Us?
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        At ORYON, we're committed to providing the best shopping experience with policies that put you first.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {policies.map((policy, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-6 text-center transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
                        >
                            <div className="p-3 mb-4 bg-gray-100 rounded-full">
                                {policy.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                {policy.title}
                            </h3>
                            <p className="mb-3 font-medium text-blue-600">
                                {policy.description}
                            </p>
                            <p className="text-sm text-gray-600">
                                {policy.details}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-8 mt-12 text-center text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl">
                    <h3 className="mb-4 text-2xl font-bold">Still Have Questions?</h3>
                    <p className="max-w-2xl mx-auto mb-6">
                        Our customer support team is here to help you with any questions about our policies, products, or services.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button className="px-6 py-3 font-semibold text-blue-700 transition-colors bg-white rounded-lg hover:bg-gray-100">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-blue-700">
                            View Full Policy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyComponent;