import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Bug,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { categories } from "../components/ToolDirectory";
import { SUPPORT_EMAIL, sendForm } from "../constants/links";

const TOPICS = [
  { id: "bug", label: "Something isn't working", icon: Bug },
  { id: "question", label: "How do I...?", icon: HelpCircle },
  { id: "feature", label: "Suggest a tool or feature", icon: Lightbulb },
  { id: "other", label: "Something else", icon: MessageSquare },
];

const PLACEHOLDERS = {
  bug: 'What did you do, and what happened? E.g. "I dropped a 12 MB PDF into Compress PDF and it said the file was damaged."',
  question: "What are you trying to do?",
  feature: "What tool or option would help you, and what would you use it for?",
  other: "How can we help?",
};

// "pdf-compressor" <-> "/pdf-compressor": tool pages link here with ?tool=...
const TOOLS = [
  ...categories.flatMap((category) =>
    category.tools.map((tool) => ({ id: tool.to.slice(1), label: tool.title })),
  ),
  { id: "chrome-extension", label: "Chrome extension" },
  { id: "website", label: "The website in general" },
];

const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const technicalDetails = () =>
  [
    `App: ${window.location.protocol === "chrome-extension:" ? "Chrome extension" : "website"}`,
    `Browser: ${navigator.userAgent}`,
    `Screen: ${window.innerWidth}×${window.innerHeight} (${window.devicePixelRatio}x)`,
    `Language: ${navigator.language}`,
    `Sent: ${new Date().toISOString()}`,
  ].join("\n");

const Support = () => {
  const [params] = useSearchParams();
  const initialTool = TOOLS.some((tool) => tool.id === params.get("tool"))
    ? params.get("tool")
    : "";
  const initialTopic = TOPICS.some((topic) => topic.id === params.get("topic"))
    ? params.get("topic")
    : "bug";

  const [topic, setTopic] = useState(initialTopic);
  const [tool, setTool] = useState(initialTool);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [trap, setTrap] = useState(""); // hidden field only bots fill in
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");
  const [showErrors, setShowErrors] = useState(false);

  const details = useMemo(technicalDetails, []);
  const errors = {
    message:
      message.trim().length < 10
        ? "Please describe it in a sentence or two."
        : "",
    email: !EMAIL_PATTERN.test(email.trim())
      ? "We need a valid email to reply to you."
      : "",
  };
  const valid = !errors.message && !errors.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!valid) {
      setShowErrors(true);
      return;
    }
    setStatus("sending");
    if (trap) {
      setStatus("sent"); // quietly drop spam
      return;
    }
    const topicLabel = TOPICS.find((t) => t.id === topic)?.label;
    const toolLabel =
      TOOLS.find((t) => t.id === tool)?.label || "Not specified";
    try {
      await sendForm({
        form: "support",
        topic: topicLabel,
        tool: toolLabel,
        name: name.trim(),
        email: email.trim(),
        // Everything is also in `message`, so it's readable whatever columns
        // the sheet keeps
        message: [
          `[Support] ${topicLabel} | Tool: ${toolLabel}`,
          "",
          message.trim(),
          ...(includeDetails ? ["", "---", details] : []),
        ].join("\n"),
        details: includeDetails ? details : "",
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setMessage("");
    setShowErrors(false);
    setStatus("idle");
  };

  const fieldError = (key) =>
    showErrors && errors[key] ? (
      <p id={`${key}-error`} className="mt-1 text-sm text-[var(--color-error)]">
        {errors[key]}
      </p>
    ) : null;

  return (
    <>
      <SEO
        title="Support - Get Help with QuickSideTool"
        description="Report a problem with a tool, ask a question or suggest a feature. We read every message and reply by email."
        url="/support"
      />
      <Layout>
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <section className="text-center">
              <h1 className="h2">Support</h1>
              <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-muted)]">
                Tell us what went wrong or what you need. We read every message
                and reply by email, usually within 2 business days.
              </p>
            </section>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                to="/help"
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <HelpCircle
                  className="h-5 w-5 shrink-0 text-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">
                    Common questions
                  </span>
                  <span className="block text-sm text-[var(--color-text-muted)]">
                    Quick answers for every tool
                  </span>
                </span>
              </Link>
              <Link
                to="/privacy-policy"
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <ShieldCheck
                  className="h-5 w-5 shrink-0 text-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">
                    Your files and privacy
                  </span>
                  <span className="block text-sm text-[var(--color-text-muted)]">
                    What runs on your device
                  </span>
                </span>
              </Link>
            </div>

            {status === "sent" ? (
              <div className="card mt-8 p-8 text-center" role="status">
                <CheckCircle className="mx-auto h-12 w-12 text-[var(--color-success)]" />
                <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">
                  Thanks, we've got it
                </h2>
                <p className="mt-2 text-[var(--color-text-muted)]">
                  We'll reply to{" "}
                  <span className="font-medium text-[var(--color-text)]">
                    {email.trim()}
                  </span>{" "}
                  within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-secondary mt-6"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="card mt-8 p-6 md:p-8"
              >
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Send us a message
                </h2>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium text-[var(--color-text)]">
                    What do you need help with?
                  </legend>
                  <div
                    role="radiogroup"
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    {TOPICS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={topic === id}
                        onClick={() => setTopic(id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                          topic === id
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-text)]"
                            : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
                        }`}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5">
                  <label
                    htmlFor="support-tool"
                    className="mb-1 block text-sm font-medium text-[var(--color-text)]"
                  >
                    Which tool?{" "}
                    <span className="font-normal text-[var(--color-text-light)]">
                      (optional)
                    </span>
                  </label>
                  <select
                    id="support-tool"
                    value={tool}
                    onChange={(e) => setTool(e.target.value)}
                    className="input"
                  >
                    <option value="">Choose a tool</option>
                    {TOOLS.map(({ id, label }) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="support-message"
                    className="mb-1 block text-sm font-medium text-[var(--color-text)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value.slice(0, MAX_MESSAGE))
                    }
                    rows={6}
                    placeholder={PLACEHOLDERS[topic]}
                    aria-invalid={showErrors && !!errors.message}
                    aria-describedby={
                      showErrors && errors.message ? "message-error" : undefined
                    }
                    className="input resize-y"
                  />
                  <div className="flex justify-between">
                    {fieldError("message") || <span />}
                    {message.length > MAX_MESSAGE - 500 && (
                      <span className="mt-1 text-xs text-[var(--color-text-light)]">
                        {MAX_MESSAGE - message.length} characters left
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="support-email"
                      className="mb-1 block text-sm font-medium text-[var(--color-text)]"
                    >
                      Your email
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={showErrors && !!errors.email}
                      aria-describedby={
                        showErrors && errors.email
                          ? "email-error"
                          : "email-hint"
                      }
                      className="input"
                    />
                    {fieldError("email") || (
                      <p
                        id="email-hint"
                        className="mt-1 text-xs text-[var(--color-text-light)]"
                      >
                        Only used to reply to you.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="support-name"
                      className="mb-1 block text-sm font-medium text-[var(--color-text)]"
                    >
                      Name{" "}
                      <span className="font-normal text-[var(--color-text-light)]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="support-name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                {/* Spam trap: hidden from people, filled in by bots */}
                <div
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="support-website">Website</label>
                  <input
                    id="support-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                  />
                </div>

                <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3">
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text)]">
                    <input
                      type="checkbox"
                      checked={includeDetails}
                      onChange={(e) => setIncludeDetails(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span>
                      Include technical details (browser, screen size) to help
                      us fix it faster
                      <details className="mt-1 text-xs text-[var(--color-text-light)]">
                        <summary className="cursor-pointer">
                          See what's included
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap break-all font-mono">
                          {details}
                        </pre>
                      </details>
                    </span>
                  </label>
                </div>

                {status === "error" && (
                  <div
                    className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-bg)] p-4"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-error)]" />
                    <p className="text-sm text-[var(--color-error)]">
                      Couldn't send your message. Please try again in a minute
                      {SUPPORT_EMAIL ? `, or email ${SUPPORT_EMAIL}` : ""}. Your
                      message is still here.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary mt-6 w-full"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send message
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-[var(--color-text-light)]">
                  Don't include passwords or attach private documents.
                </p>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              Not about a tool?{" "}
              <Link to="/contact" className="link font-semibold">
                Contact us
              </Link>{" "}
              for feedback and everything else.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Support;
