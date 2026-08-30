import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby6IncKBU68LN7ZxWkBIEQJV_S_m18G1CSgPi1o4jUZ093FUSHTF-QS87BAOyepP1Vu/exec";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
      setFormData({ name: "", email: "", message: "" });
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
        description="Contact QuickSideTool for support, feedback, and questions."
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 md:px-8 md:pt-14">
          <section className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400 dark:text-blue-300">
              Contact
            </p>
            <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-900 md:text-4xl">
              Tell us what you need
            </h1>
            <p className="mt-4 text-gray-300 dark:text-gray-500 max-w-2xl mx-auto">
              Found a bug, want a new tool, or need help with a workflow? Send
              a short note and we'll use it to improve QuickSideTool.
            </p>
          </section>

          <section className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-900/30 dark:bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Send a message</h2>

              {submitStatus === "success" && (
                <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="ml-6 text-green-300">Thanks. We received your message.</p>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-6 text-red-300">Please try again, or email support@quicksidetool.com.</p>
                </div>
              )}

              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-border border-gray-500/20 px-3 py-2 text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900/20 dark:bg-gray-900/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-border border-gray-500/20 px-3 py-2 text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900/20 dark:bg-gray-900/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-border border-gray-500/20 px-3 py-2 text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900/20 dark:bg-gray-900/20 resize-none"
                  placeholder="Write your message here"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-border bg-blue-600 py-2 px-4 text-white font-medium text-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </section>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <a href="mailto:support@quicksidetool.com" className="text-blue-600 hover:underline">
                support@quicksidetool.com
              </a>
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              We reply within 2 business days.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Contact;
