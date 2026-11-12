const React = require("react");
const inter = require("@fontsource/inter/files/inter-latin-400-normal.woff2");
const grotesk = require("@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2");

// Preload the two fonts used above the fold so the first paint does not swap.
exports.onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en" });
  setHeadComponents(
    [inter, grotesk].map((f) => {
      const href = typeof f === "string" ? f : f && f.default;
      return href ? React.createElement("link", { key: href, rel: "preload", as: "font", type: "font/woff2", href, crossOrigin: "anonymous" }) : null;
    }).filter(Boolean)
  );
};
