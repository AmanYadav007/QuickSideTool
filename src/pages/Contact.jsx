import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { SUPPORT_EMAIL, sendForm } from "../constants/links";

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
      await sendForm({ form: "contact", ...formData });
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
            <p className="mt-4 text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
              Feedback, partnerships or anything else: send a short note. Problem with a tool?{" "}
              <Link to="/support" className="link font-semibold">Get support</Link> instead so we can fix it faster.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="card p-6">
            <h2 className="h3 mb-6">Send a message</h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 rounded-lg bg-[var(--color-success-bg)] border border-[var(--color-primary-light)] flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <p className="text-[var(--color-success)]">Thanks. We received your message.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 rounded-lg bg-[var(--color-error-bg)] border border-[var(--color-error)] flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
                <p className="text-[var(--color-error)]">
                  Couldn't send your message. Please try again in a moment{SUPPORT_EMAIL ? `, or email ${SUPPORT_EMAIL}` : ""}.
                </p>
              </div>
            )}

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
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
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Message</label>
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
            {SUPPORT_EMAIL && (
              <p className="text-[var(--color-text-muted)]">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--color-primary)] hover:underline">{SUPPORT_EMAIL}</a>
              </p>
            )}
            <p className="mt-2 text-sm text-[var(--color-text-light)]">We reply within 2 business days.</p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Contact;