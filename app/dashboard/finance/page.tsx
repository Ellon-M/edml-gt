// app/dashboard/finance/settings/page.tsx
"use client";

import React from 'react';
import Layout from '../../../components/AdminLayout';
import FinanceBankDetails from '../../../components/FinanceBankDetails';
import useRequireRole from "@/hooks/useRequireRole";

const FinanceSettings = () => {
  useRequireRole("PARTNER");
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FinanceBankDetails />
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="text-lg font-semibold mb-3">Payments by edmorlistings.com</div>
            <div className="text-sm text-gray-600">View how you receive your payouts and change payout method.</div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-lg font-semibold">General finance</div>
            <div className="mt-3">
              <div className="text-sm text-gray-600">Invoice details, VAT settings and more.</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FinanceSettings;
