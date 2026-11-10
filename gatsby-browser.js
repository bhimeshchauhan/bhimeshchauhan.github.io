import { track } from "./src/utils/track";
import { BOOKING_URL } from "./src/utils/connect";

// Which outbound/contact clicks count as conversions. Event names only: no personal data is sent.
const EVENTS = [
  [(h) => /\/resume\.pdf(\?|$)/.test(h), "resume_download"],
  [(h) => h.startsWith("mailto:"), "email_click"],
  [(h) => /linkedin\.com\/in\//.test(h), "linkedin_click"],
  [(h) => /github\.com\/bhimeshchauhan(\/?$|\?)/.test(h), "github_click"],
  [(h) => /wa\.me\//.test(h), "whatsapp_click"],
  [(h) => (BOOKING_URL && h.startsWith(BOOKING_URL)) || /(calendly\.com|cal\.com)\//.test(h), "booking_click"],
];

export const onClientEntry = () => {
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hit = EVENTS.find(([test]) => test(href));
      if (hit) track(hit[1], { page: window.location.pathname });
    },
    true
  );
  // The Role-fit box and the assistant announce a job-description analysis with this browser event.
  window.addEventListener("assistant-fit", () => track("role_fit_used", { page: window.location.pathname }));
};
