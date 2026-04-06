"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  supportContact,
  supportFallbackAnswer,
  supportFaqs,
  type SupportFaq,
} from "@/data/support-faq";

type ChatMessage = {
  answerLinkHref?: string;
  answerLinkLabel?: string;
  id: string;
  role: "assistant" | "user";
  text: string;
};

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="support-chat-launcher-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2.75L13.92 8.08L19.25 10L13.92 11.92L12 17.25L10.08 11.92L4.75 10L10.08 8.08L12 2.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M18.25 15.75L18.91 17.59L20.75 18.25L18.91 18.91L18.25 20.75L17.59 18.91L15.75 18.25L17.59 17.59L18.25 15.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" className="support-chat-send-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 20L20 12L4 4L7.1 11.15L7.45 12L7.1 12.85L4 20Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M7.4 12H13.9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "assistant-intro",
    role: "assistant",
    text:
      "Hi, I'm the Kapten Batik AI support assistant. I can answer the same quick questions from the live store, or route you to customer care if you need a person.",
  },
];

const LINKED_ANSWERS: Partial<Record<SupportFaq["id"], { href: string; label: string }>> = {
  "shipping-details": {
    href: supportContact.shippingHref,
    label: "Open shipping details",
  },
  "boutique-location": {
    href: supportContact.boutiqueLocationsHref,
    label: "View boutique locations",
  },
  "contact-customer-service": {
    href: supportContact.whatsappHref,
    label: "Chat on WhatsApp",
  },
  "return-policy": {
    href: supportContact.returnsHref,
    label: "Read return policy",
  },
  promotions: {
    href: supportContact.saleHref,
    label: "Browse current promotions",
  },
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function resolveFaq(query: string) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return null;
  }

  let bestMatch: SupportFaq | null = null;
  let bestScore = 0;

  for (const faq of supportFaqs) {
    const candidates = [faq.question, ...faq.keywords];
    let score = 0;

    for (const candidate of candidates) {
      const normalizedCandidate = normalizeText(candidate);
      if (normalizedQuery === normalizedCandidate) {
        score += 12;
      } else if (normalizedQuery.includes(normalizedCandidate)) {
        score += 6;
      } else if (normalizedCandidate.includes(normalizedQuery)) {
        score += 5;
      } else {
        const candidateWords = normalizedCandidate.split(" ");
        for (const word of candidateWords) {
          if (word.length > 2 && normalizedQuery.includes(word)) {
            score += 1;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore >= 3 ? bestMatch : null;
}

export function SupportChat() {
  const [isOpen, setOpen] = useState(false);
  const [isFaqVisible, setFaqVisible] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const questionList = useMemo(() => supportFaqs, []);
  const visibleQuestions = useMemo(() => questionList.slice(0, 4), [questionList]);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messageListRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      setFaqVisible(true);
    }
  }, [isOpen]);

  const pushAnswer = (faq: SupportFaq, sourceQuestion?: string) => {
    const linkMeta = LINKED_ANSWERS[faq.id];

    setMessages((current) => [
      ...current,
      ...(sourceQuestion
        ? [
            {
              id: `user-${current.length + 1}`,
              role: "user" as const,
              text: sourceQuestion,
            },
          ]
        : []),
      {
        id: `assistant-${current.length + 2}`,
        role: "assistant",
        text: faq.answer,
        answerLinkHref: linkMeta?.href,
        answerLinkLabel: linkMeta?.label,
      },
    ]);
  };

  const handleQuickQuestion = (faq: SupportFaq) => {
    setOpen(true);
    setFaqVisible(false);
    pushAnswer(faq, faq.question);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    const match = resolveFaq(trimmedDraft);
    setDraft("");
    setFaqVisible(false);

    if (match) {
      pushAnswer(match, trimmedDraft);
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${current.length + 1}`,
        role: "user",
        text: trimmedDraft,
      },
      {
        id: `assistant-${current.length + 2}`,
        role: "assistant",
        text: supportFallbackAnswer,
        answerLinkHref: supportContact.whatsappHref,
        answerLinkLabel: "Talk to customer care",
      },
    ]);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setDraft("");
    setFaqVisible(true);
  };

  return (
    <div className={`support-chat-shell ${isOpen ? "is-open" : ""}`}>
      <div className="support-chat-card" aria-label="Kapten Batik AI support">
        <div className="support-chat-header">
          <div>
            <p className="support-chat-eyebrow">Support</p>
            <h2>Chat with us</h2>
            <p className="support-chat-subtitle">
              Shipping, returns, boutique details, and customer care.
            </p>
          </div>

          <div className="support-chat-actions">
            {messages.length > INITIAL_MESSAGES.length ? (
              <button className="support-chat-reset" onClick={handleReset} type="button">
                Reset
              </button>
            ) : null}
            <button
              aria-label={isOpen ? "Collapse support chat" : "Expand support chat"}
              className="support-chat-close"
              onClick={() => setOpen((current) => !current)}
              type="button"
            >
              {isOpen ? "Close" : "Open"}
            </button>
          </div>
        </div>

        <div className="support-chat-content">
          <div className="support-chat-messages" ref={messageListRef}>
            {messages.map((message) => (
              <article
                className={`support-chat-message is-${message.role}`}
                key={message.id}
              >
                <p className="support-chat-message-label">
                  {message.role === "assistant" ? "Kapten Batik AI" : "You"}
                </p>
                <p>{message.text}</p>
                {message.answerLinkHref && message.answerLinkLabel ? (
                  <a
                    className="support-chat-link"
                    href={message.answerLinkHref}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {message.answerLinkLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <div className={`support-chat-faqs ${isFaqVisible ? "" : "is-collapsed"}`}>
            <div className="support-chat-faqs-header">
              <h3>Quick topics</h3>
              <button
                className="support-chat-faq-toggle"
                onClick={() => setFaqVisible((current) => !current)}
                type="button"
              >
                {isFaqVisible ? "Hide" : "Show"}
              </button>
            </div>

            {isFaqVisible ? (
              <div className="support-chat-faq-grid">
                {visibleQuestions.map((faq) => (
                  <button
                    className="support-chat-faq"
                    key={faq.id}
                    onClick={() => handleQuickQuestion(faq)}
                    type="button"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form className="support-chat-form" onSubmit={handleSubmit}>
            <div className="support-chat-input-row">
              <input
                aria-label="Ask a question"
                id="support-chat-input"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about delivery, returns, stores, or support"
                type="text"
                value={draft}
              />
              <button className="support-chat-submit" type="submit">
                <SendIcon />
                Send
              </button>
            </div>
          </form>

          <div className="support-chat-footer">
            <a href={supportContact.whatsappHref} rel="noreferrer" target="_blank">
              WhatsApp customer care
            </a>
            <span>{supportContact.customerServiceHours}</span>
          </div>
        </div>
      </div>

      <button
        aria-expanded={isOpen}
        aria-label="Open AI support chat"
        className="support-chat-launcher"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <SparkIcon />
        <span>Need help?</span>
      </button>
    </div>
  );
}
