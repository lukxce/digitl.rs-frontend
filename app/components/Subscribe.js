"use client";

import { useState } from "react";
import styles from "./Subscribe.module.css";

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Submit</title>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Subscribe({ onSubmit }) {
  const [email, setEmail] = useState("");
  // Honeypot: real users never see or fill this field, bots do.
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            email: trimmedEmail,
            company,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Subscribe request failed");
      }

      setEmail("");
      setSuccess(true);
      if (typeof onSubmit === "function") {
        onSubmit(trimmedEmail);
      }
    } catch {
      setError("Unable to subscribe right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <span className={styles.at} aria-hidden>
          @
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email"
          className={styles.input}
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
        <button
          type="submit"
          className={styles.submit}
          aria-label="Subscribe"
          disabled={isSubmitting}
        >
          <ArrowIcon className={styles.arrow} />
        </button>
      </form>
      {error ? <p className={styles.statusError}>{error}</p> : null}
      {success
        ? <p className={styles.statusSuccess}>Thanks for subscribing.</p>
        : null}
      <p className={styles.unsubscribe}>Unsubscribe at any time.</p>
    </>
  );
}
