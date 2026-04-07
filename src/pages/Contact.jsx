import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Mail,
  MessageSquare,
  Send,
  Star,
  Bug,
} from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby6IncKBU68LN7ZxWkBIEQJV_S_m18G1CSgPi1o4jUZ093FUSHTF-QS87BAOyepP1Vu/exec";

const submissionTypes = [
  { value: "contact", label: "General", icon: MessageSquare },
  { value: "feature-request", label: "Feature", icon: Lightbulb },
  { value: "bug-report", label: "Bug", icon: Bug },
  { value: "feedback", label: "Feedback", icon: Star },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "contact",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.result !== "success") throw new Error(result.error || "Unknown error");
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", type: "contact" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <>
      <SEO
        title="Contact QuickSideTool"
        description="Contact QuickSideTool for support, feedback, feature requests, and bug reports."
        keywords="contact QuickSideTool, support, feedback, feature request, bug report"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Contact
            </p>
            <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
              Tell us what you need.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Found a bug, want a new tool, or need help with a workflow? Send
              a short note and we’ll use it to improve QuickSideTool.
            </p>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-white/10 bg-white/[0.05] p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white">Send a message</h2>

              {submitStatus === "success" && (
                <StatusBox
                  type="success"
                  title="Message sent"
                  text="Thanks. We received your message."
                />
              )}
              {submitStatus === "error" && (
                <StatusBox
                  type="error"
                  title="Could not send"
                  text="Please try again, or email support@quicksidetool.com."
                />
              )}

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {submissionTypes.map((type) => {
                  const Icon = type.icon;
                  const active = formData.type === type.value;
                  return (
                    <label
                      key={type.value}
                      className={`cursor-pointer rounded-lg border p-3 text-center transition ${
                        active
                          ? "border-amber-200 bg-amber-300 text-slate-950"
                          : "border-white/10 bg-white/5 text-white hover:border-amber-200 hover:bg-amber-200/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={active}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Icon className="mx-auto mb-2 h-5 w-5" />
                      <span className="text-sm font-semibold">{type.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mt-4">
                <TextField label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-slate-300">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Write your message here"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>

            <aside className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6">
              <h2 className="text-xl font-bold text-white">Other ways</h2>
              <div className="mt-5 space-y-4">
                <InfoRow icon={Mail} title="Email" text="support@quicksidetool.com" />
                <InfoRow icon={MessageSquare} title="Community" text="Discord support and feedback" />
                <InfoRow icon={Lightbulb} title="Ideas" text="New tools, UX improvements, and workflow requests" />
              </div>
            </aside>
          </section>
        </div>
      </Layout>
    </>
  );
};

const TextField = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-slate-300">{label}</span>
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  </label>
);

const StatusBox = ({ type, title, text }) => {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  return (
    <div className={`mt-5 rounded-lg border p-4 ${isSuccess ? "border-emerald-400/30 bg-emerald-400/10" : "border-red-400/30 bg-red-400/10"}`}>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 ${isSuccess ? "text-emerald-200" : "text-red-200"}`} />
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, title, text }) => (
  <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
    <Icon className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{text}</p>
    </div>
  </div>
);

export default Contact;
