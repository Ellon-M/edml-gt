"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Mail, Phone, Search, ChevronDown, Check, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FAQ = {
  q: string;
  a: string;
  id: string;
};

// Small utility for accessible id
const id = (s: string) => s.replace(/\s+/g, "-").toLowerCase();

function ContactCard() {
  return (
    <div className="bg-gradient-to-br from-white to-[#fff7f7] border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact us</h3>
      <p className="text-sm text-gray-600 mb-4">
        We’re here to help — available 7 days a week. Reach out and we’ll reply
        as soon as possible with friendly, human support.
      </p>

      <div className="flex flex-col gap-3">
        <a
          href="mailto:support@edmorgroup.com"
          className="inline-flex items-center gap-3 rounded-lg px-4 py-3 bg-white border hover:shadow-sm"
        >
          <span className="p-2 bg-[#800000] text-white rounded-md">
            <Mail className="w-4 h-4" />
          </span>
          <div className="text-sm">
            <div className="font-medium">support@edmorgroup.com</div>
            <div className="text-xs text-gray-500">Email us anytime</div>
          </div>
        </a>

        <a
          href="tel:+254794646449"
          className="inline-flex items-center gap-3 rounded-lg px-4 py-3 bg-white border hover:shadow-sm"
        >
          <span className="p-2 bg-[#800000] text-white rounded-md">
            <Phone className="w-4 h-4" />
          </span>
          <div className="text-sm">
            <div className="font-medium">+254 (794) 646-449</div>
            <div className="text-xs text-gray-500">
              Available 8:00 — 18:00 (UTC)
            </div>
          </div>
        </a>

        <div className="inline-flex items-center gap-3 rounded-lg px-4 py-3 bg-white border">
          <span className="p-2 bg-[#800000] text-white rounded-md">
            <Clock className="w-4 h-4" />
          </span>
          <div className="text-sm">
            <div className="font-medium">Response time</div>
            <div className="text-xs text-gray-500">
              Typical reply within 2 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const e: any = {};
    if (!name.trim()) e.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Please provide a valid email.";
    if (message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    // demo: emulate network
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 900);
  }

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-md">
      <h4 className="text-lg font-semibold mb-1">Send us a message</h4>
      <p className="text-sm text-gray-500 mb-4">
        Have a question not covered below? Drop us a line and we’ll get back
        within a day.
      </p>

      {sent ? (
        <div className="p-4 rounded-md bg-green-50 border border-green-100 text-green-700 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>Thanks — your message was sent. We’ll reply shortly.</div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                errors.name ? "ring-1 ring-red-300" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <div className="text-xs text-red-600 mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                errors.email ? "ring-1 ring-red-300" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <div className="text-xs text-red-600 mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                errors.message ? "ring-1 ring-red-300" : "border-gray-200"
              }`}
            />
            {errors.message && (
              <div className="text-xs text-red-600 mt-1">{errors.message}</div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={sending}
              type="submit"
              className="bg-[#800000] text-white px-4 py-2 rounded-md font-medium hover:bg-[#6b0000] disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send message"}
            </button>
            <div className="text-sm text-gray-800">
              Or email:{" "}
              <a
                href="mailto:support@edmorgroup.com"
                className="text-[#800000] underline"
              >
                support@edmorgroup.com
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function FAQItem({
  item,
  open,
  onToggle,
}: {
  item: FAQ;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState<string>("0px");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      // set to scrollHeight to animate open
      setMaxH(`${el.scrollHeight}px`);
    } else {
      // collapse
      setMaxH("0px");
    }
  }, [open]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${item.id}-panel`}
        id={`${item.id}-header`}
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 text-left"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#800000] text-white flex-shrink-0">
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{item.q}</div>
          <div className="text-sm text-gray-500 mt-1">
            Click to {open ? "collapse" : "view"} the answer
          </div>
        </div>
      </button>

      <div
        id={`${item.id}-panel`}
        role="region"
        aria-labelledby={`${item.id}-header`}
        ref={contentRef}
        style={{ maxHeight: maxH, transition: "max-height 300ms ease" }}
        className="px-4 overflow-hidden"
      >
        <div className="text-sm text-gray-700">{item.a}</div>
      </div>
    </div>
  );
}

function FAQList({ items }: { items: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div>
      <div className="mb-4">
        <label className="sr-only">Search FAQs</label>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help topics, e.g. 'cancellation'"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#800000]/30"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((it) => (
          <FAQItem
            key={it.id}
            item={it}
            open={openId === it.id}
            onToggle={() => setOpenId((cur) => (cur === it.id ? null : it.id))}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          No results found. Try different keywords or contact support.
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const faqs: FAQ[] = [
    {
      id: id("cancellations"),
      q: "What is your cancellation policy?",
      a: "You can cancel up to 48 hours before check-in for a full refund. For last-minute cancellations fees may apply; please check your booking confirmation for details.",
    },
    {
      id: id("check-in"),
      q: "How do I check in?",
      a: "Most properties offer self-check-in or meet-and-greet. You’ll receive check-in instructions from the host 24 hours before arrival. If you need earlier access, contact the host directly.",
    },
    {
      id: id("pets"),
      q: "Are pets allowed?",
      a: "Pet policies vary by property — some allow small pets with a cleaning fee, others do not. Please check the individual listing's amenities or contact the host.",
    },
    {
      id: id("payment"),
      q: "What payment methods do you accept?",
      a: "We accept major credit cards and many local payment methods. The accepted payment options appear at checkout and on your booking confirmation.",
    },
    {
      id: id("refunds"),
      q: "How do I request a refund?",
      a: "If you qualify for a refund, open your booking and select 'Request refund' or contact support with your booking details. We’ll investigate and respond quickly.",
    },
    {
      id: id("cleaning"),
      q: "Is cleaning included?",
      a: "Standard stays include a cleaning service. For long-term bookings, cleaning schedules may vary — check the listing or speak with the host for details.",
    },
    {
      id: id("safety"),
      q: "How do you ensure property safety?",
      a: "Hosts are required to follow local safety regulations. Many listings include smoke alarms, secure locks and CCTV in common areas. If you have concerns, contact support immediately.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 px-4 pb-12">
        <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Left: intro + contact card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">Help center</h1>
              <p className="mt-2 text-gray-600">
                We’re glad you’re here. Below you’ll find quick answers to
                common questions and multiple ways to contact us. If you can’t
                find what you need, we’ll help personally — just send a message.
              </p>

              <div className="mt-6 space-y-4">
                <ContactCard />
              </div>
            </div>
          </div>

          {/* Right: FAQ list (spans 2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Frequently asked questions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Not sure where to begin? Search or browse the topics below.
              </p>

              <div className="mt-4">
                <FAQList items={faqs} />
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Still stuck?{" "}
                <a
                  href="mailto:support@yourcompany.com"
                  className="text-[#800000] underline"
                >
                  Email support
                </a>{" "}
                or use the contact form to get in touch.
              </div>
            </div>
          </div>

          {/* Full-width contact form below both columns */}
          <div className="lg:col-span-2">
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
