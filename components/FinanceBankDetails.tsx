// components/FinanceBankDetails.tsx
"use client";

import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useSession } from "next-auth/react";
import { MessageCircleWarning } from 'lucide-react';

type BankPayload = {
  bankName: string;
  bankBranchCode?: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankCurrency?: string;
};

export default function FinanceBankDetails() {
  const { data: session } = useSession();
  const user = session?.user;

  // initialize from session (may be undefined)
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [form, setForm] = useState<BankPayload>({
    bankName: (user?.bankName as string) ?? "",
    bankBranchCode: (user?.bankBranchCode as string) ?? "",
    bankAccountNumber: (user?.bankAccountNumber as string) ?? "",
    bankAccountName: (user?.bankAccountName as string) ?? (user?.name ?? ""),
    bankCurrency: (user?.bankCurrency as string) ?? "KES",
  });

  // if session changes, refresh form values
  useEffect(() => {
    setForm({
      bankName: (user?.bankName as string) ?? "",
      bankBranchCode: (user?.bankBranchCode as string) ?? "",
      bankAccountNumber: (user?.bankAccountNumber as string) ?? "",
      bankAccountName: (user?.bankAccountName as string) ?? (user?.name ?? ""),
      bankCurrency: (user?.bankCurrency as string) ?? "KES",
    });
  }, [user?.bankAccountNumber, user?.bankName, user?.bankBranchCode, user?.bankAccountName, user?.bankCurrency, user?.name]);

  const hasBank = !!user?.bankAccountNumber && !!user?.bankName;

  async function submit(e?: React.FormEvent) {
    e?.preventDefault?.();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/finance/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        const message = json?.error ?? "Failed to save bank details";
        setStatusMsg(message);
        setLoading(false);
        return;
      }

      // success: show updated values; session will still be stale until next re-issue,
      // but we can show the returned user data:
      setStatusMsg("Bank details saved");
      setEditing(false);
      // optimistic UI: update local form/state from returned user
      const updatedUser = json.user;
      setForm((f) => ({
        ...f,
        bankName: updatedUser?.bankName ?? f.bankName,
        bankBranchCode: updatedUser?.bankBranchCode ?? f.bankBranchCode,
        bankAccountNumber: updatedUser?.bankAccountNumber ?? f.bankAccountNumber,
        bankAccountName: updatedUser?.bankAccountName ?? f.bankAccountName,
        bankCurrency: updatedUser?.bankCurrency ?? f.bankCurrency,
      }));
    } catch (err) {
      console.error(err);
      setStatusMsg("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Bank details">
      {hasBank && !editing ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500">Bank</div>
              <div className="font-medium mt-1">{user?.bankBranchCode ?? ""} • {user?.bankName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Account number</div>
              <div className="font-medium mt-1">{user?.bankAccountNumber}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Account holder</div>
              <div className="font-medium mt-1">{user?.bankAccountName ?? user?.name}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Currency</div>
              <div className="font-medium mt-1">{user?.bankCurrency ?? "KES"}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setEditing(true)} className="px-4 py-2 rounded border">Edit bank details</button>
            <button style={{ backgroundColor: 'var(--color-primary)', color: 'white' }} className="px-4 py-2 rounded">Set as default</button>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Bank name</label>
                <input value={form.bankName} onChange={(e)=>setForm({...form, bankName: e.target.value})} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Enter your bank name" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Branch code</label>
                <input value={form.bankBranchCode} onChange={(e)=>setForm({...form, bankBranchCode: e.target.value})} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Enter your bank branch code" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Account number</label>
                <input value={form.bankAccountNumber} onChange={(e)=>setForm({...form, bankAccountNumber: e.target.value})} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Enter your bank account no" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Account holder name</label>
                <input value={form.bankAccountName} onChange={(e)=>setForm({...form, bankAccountName: e.target.value})} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Full name" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Currency</label>
                <select value={form.bankCurrency} onChange={(e)=>setForm({...form, bankCurrency: e.target.value})} className="mt-1 block w-full rounded-md border px-3 py-2">
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {statusMsg ? <div className="mt-3 text-sm text-red-600">{statusMsg}</div> : null}

            <div className="mt-6 flex gap-3">
              <button disabled={loading} type="submit" className="px-4 py-2 rounded border">
                {loading ? "Saving…" : "Save bank details"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setStatusMsg(null); }} className="px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {!hasBank && !editing && (
        <div className="mt-4 text-sm text-red-500 font-semibold">
          <span className="flex flex-row gap-1"><MessageCircleWarning size={16} /> You have not set up bank details yet — add them so you can receive payouts.</span>
          <div className="mt-3 text-gray-600 font-normal">
            <button onClick={() => setEditing(true)} className="px-3 py-2 rounded border">Add bank details</button>
          </div>
        </div>
      )}
    </Card>
  );
}
