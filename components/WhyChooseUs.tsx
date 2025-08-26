"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeDollarSign, Globe, Zap } from "lucide-react";
import { JSX } from "react";

export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Heading & Description */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#800000]">
            Why List with Us?
          </h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            We make property listing effortless, secure, and profitable. Whether you're a homeowner or an investor, we help you reach thousands of potential clients—**fast**.
          </p>
        </motion.div>

        {/* Right Side - Feature Cards */}
        <motion.div
          className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Secure & Verified"
            description="We ensure your listings are protected, and only verified buyers and renters can reach out."
          />
          <FeatureCard
            icon={<BadgeDollarSign size={32} />}
            title="No Hidden Fees"
            description="Transparent pricing—no unexpected costs. Get the best value for your listings."
          />
          <FeatureCard
            icon={<Globe size={32} />}
            title="Wide Audience Reach"
            description="Your property gets exposure to thousands of active buyers and renters worldwide."
          />
          <FeatureCard
            icon={<Zap size={32} />}
            title="Fast & Hassle-Free"
            description="Easy listing process, quick approvals, and an intuitive dashboard to manage your properties."
          />
        </motion.div>
      </div>
    </section>
  );
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, description }: { icon: JSX.Element; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center text-center"
    >
      <div className="text-[#800000]">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
}
