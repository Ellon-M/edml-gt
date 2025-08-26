"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-white overflow-visible">
      <div className="max-w-6xl mx-auto text-center mb-12 overflow-visible">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-[#800000]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Find the perfect tier for you. Whether you want to list with us, or
          want us to manage your property.
        </motion.p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            className="bg-gray-50 rounded-2xl shadow-xl p-8 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <span className="flex flex-row justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{tier.name}</h3>
              {tier.badge && (
                <div className="">
                  <span className="text-[11px] font-bold text-white bg-[#800000] px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}
            </span>
            <p className="mt-2 text-sm text-gray-600 flex-1">{tier.subtitle}</p>
            <ul className="mt-4 text-left list-disc list-inside text-gray-700 space-y-2">
              {tier.features.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
            <div className="mt-6">
              <span className="text-3xl font-extrabold text-[#800000]">
                ${tier.price}
              </span>
              <span className="text-gray-600">/mo</span>
            </div>
            <button className="cursor-pointer mt-8 w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#800000] to-[#a00000] shadow-md hover:from-[#900000] hover:to-[#b00000] transition">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Tier Data
const tiers = [
  {
    name: "Basic",
    subtitle: "Perfect for first-time hosts",
    features: [
      "Up to 10 active listings",
      "Standard support",
      "List up to 3 OTAs",
      "Weekly Payouts",
    ],
    price: "5",
    badge: "One-time fee $30",
  },
  {
    name: "Standard",
    subtitle: "Ideal for enthusiastic hosts",
    features: [
      "Up to 50 active listings",
      "Priority support",
      "List up to 5 OTAs",
      "Weekly Payouts",
    ],
    price: "39",
  },
  {
    name: "Premium",
    subtitle: "Great for multiple properties",
    features: [
      "Unlimited listings",
      "List to unlimited OTAs",
      "Paid-out anytime",
      "Custom reporting",
    ],
    price: "59",
  },
  {
    name: "Advanced",
    subtitle: "For large-scale operators",
    features: [
      "White-glove setup",
      "PMS integration",
      "List to unlimited OTAs",
      "Payouts Anytime",
      "Advanced analytics",
    ],
    price: "129",
  },
];
