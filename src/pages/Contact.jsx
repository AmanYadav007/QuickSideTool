import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
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
      <Layout>
        <div className="container section max-w-2xl">
          <section className="text-center mb-10">
            <h1 className="h1">Tell us what you need</h1>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
              Found a bug, want a new tool, or need help with a workflow? Send a short note and we'll use it to improve QuickSideTool.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="card p-6">
            <h2 className="h3 mb-6">Send a message</h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">Thanks. We received your message.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">Please try again, or email support@quicksidetool.com.</p>
              </div>
            )}

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="input resize-none"
                placeholder="Write your message here"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              <a href="mailto:support@quicksidetool.com" className="text-blue-600 hover:underline">support@quicksidetool.com</a>
            </p>
            <p className="mt-2 text-sm text-gray-400">We reply within 2 business days.</p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Contact;