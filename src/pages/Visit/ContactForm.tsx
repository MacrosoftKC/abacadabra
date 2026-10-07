import { useId, useState, type FormEvent } from "react";
import { CONTACT } from "../../site.config";
import { CRUST, INK, PAPER } from "../../theme";

const FIELD =
  "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 transition-colors focus:border-crust focus:bg-white/15 focus:outline-none";

const TOPICS = ["A general question", "Catering & big orders", "Feedback on a visit"] as const;
type Topic = (typeof TOPICS)[number];

/**
 * Writes the note into the visitor's own email app through a mailto: link,
 * so the form works without a backend. To post it to an API instead, replace
 * the body of submit().
 */
export default function ContactForm() {
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [handedOff, setHandedOff] = useState(false);
  const ids = { topic: useId(), name: useId(), email: useId(), message: useId() };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `${topic} · ${name.trim()}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  };

  const startOver = () => {
    setMessage("");
    setHandedOff(false);
  };

  return (
    <div className="rounded-[28px] p-8 shadow-xl sm:p-10" style={{ backgroundColor: INK, color: PAPER }}>
      <h3 className="serif-accent text-4xl" style={{ color: CRUST }}>
        Send us a note
      </h3>

      {handedOff ? (
        <div role="status" className="mt-6 flex flex-col gap-4">
          <p className="text-base font-semibold">
            Your email app should have opened with your note ready to send.
          </p>
          <p className="text-sm opacity-80">
            Nothing happened? Write to us at{" "}
            <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-2">
              {CONTACT.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={startOver}
            className="self-start text-sm font-semibold underline underline-offset-2"
          >
            Write another note
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label htmlFor={ids.topic} className="sr-only">
            What's it about?
          </label>
          <select
            id={ids.topic}
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
            className={`${FIELD} [&>option]:text-ink`}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.name} className="sr-only">
                Your name
              </label>
              <input
                id={ids.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                maxLength={100}
                required
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor={ids.email} className="sr-only">
                Email
              </label>
              <input
                id={ids.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                maxLength={255}
                required
                className={FIELD}
              />
            </div>
          </div>

          <label htmlFor={ids.message} className="sr-only">
            Message
          </label>
          <textarea
            id={ids.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            maxLength={5000}
            required
            rows={5}
            className={`${FIELD} resize-y`}
          />

          <button
            type="submit"
            className="mt-2 rounded-full px-7 py-4 font-display text-sm font-semibold tracking-[0.2em] uppercase shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            style={{ backgroundColor: CRUST, color: INK }}
          >
            Write the email
          </button>
          <p className="text-center text-xs opacity-60">
            Opens your email app. Or write to us at{" "}
            <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-2">
              {CONTACT.email}
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
