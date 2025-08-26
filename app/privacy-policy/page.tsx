"use client";

import Head from 'next/head';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Edmor Listings</title>
      </Head>
      <Navbar />
      <main className="max-w-4xl mx-auto bg-white p-8 mt-30 mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to <span className="font-medium">Edmor Listings</span>. We
            are committed to protecting your privacy and ensuring that your
            personal information is handled safely and responsibly. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number,
              mailing address, and payment information when you register, book,
              or manage a property.
            </li>
            <li>
              <strong>Usage Data:</strong> Browser type, IP address, pages
              visited, referring/exit pages, and timestamps.
            </li>
            <li>
              <strong>Cookies & Tracking:</strong> Cookies, web beacons, and
              similar technologies to personalize and enhance your experience.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and send related information.</li>
            <li>Communicate about promotions, updates, and support.</li>
            <li>Monitor and analyze trends, usage, and activities.</li>
            <li>Detect, prevent, and address technical issues and fraud.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Disclosure of Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may share your information with trusted third parties, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Service providers and partners who assist in our operations.</li>
            <li>
              Booking platforms (e.g., Airbnb, Booking.com) when you opt-in to
              multi-channel sync.
            </li>
            <li>Legal authorities when required by law or to protect rights.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to track activity and hold
            certain information. You can instruct your browser to refuse all
            cookies or indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your
            data. However, no online transmission is 100% secure; we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not intended for children under 16. We do not
            knowingly collect personal data from children under this age.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Your Privacy Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            Depending on your jurisdiction, you may have rights to access,
            correct, delete, or restrict the processing of your personal
            information. To exercise these rights, contact us using the details
            below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy periodically. The "Last Updated"
            date at the top will reflect when changes were made.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Email: <a href="mailto:support@edmorlistings.com" className="text-blue-600 underline">support@edmorlistings.com</a></li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 7th Floor, ABC Towers, Waiyaki Way, Nairobi, Kenya</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
