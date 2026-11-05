import React from "react";
import { Helmet } from "react-helmet";
import bhimeshHeader from "../assets/images/bhimesh_header.png";
import favicon from "../assets/images/bhimesh-favicon.svg";
import { aboutWebsite, personSchema, siteMeta } from "../data/Seo";

const siteUrl = "https://bhimeshchauhan.github.io";

const absoluteUrl = (value) => {
  if (!value) return siteUrl;
  if (value.startsWith("http")) return value;
  return `${siteUrl}${value.startsWith("/") ? "" : "/"}${value}`;
};

const Seo = ({
  title = siteMeta.title,
  description = siteMeta.description,
  pathname = "/",
  type = "website",
  structuredData,
  noindex = false
}) => {
  const isHome = pathname === "/";
  const pageTitle = isHome ? siteMeta.title : `${title} | Bhimesh Chauhan`;
  const canonicalUrl = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(bhimeshHeader);
  const schemas = [];

  if (isHome) schemas.push(personSchema, aboutWebsite);
  if (structuredData) schemas.push(structuredData);

  return (
    <Helmet
      title={pageTitle}
      meta={[
        { name: "description", content: description },
        ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
        { name: "author", content: siteMeta.author },
        { name: "copyright", content: siteMeta.copyright },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: type },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { property: "og:image:alt", content: "Bhimesh Chauhan, Lead AI Platform Engineer" },
        { property: "og:site_name", content: "Bhimesh Chauhan" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
        { name: "twitter:image:alt", content: "Bhimesh Chauhan, Lead AI Platform Engineer" }
      ]}
      link={[
        { rel: "canonical", href: canonicalUrl },
        { rel: "alternate", type: "text/plain", title: "LLM-readable profile (llms.txt)", href: `${siteUrl}/llms.txt` },
        { rel: "alternate", type: "application/rss+xml", title: "Bhimesh Chauhan: Blog", href: `${siteUrl}/feed.xml` },
        { rel: "shortcut icon", type: "image/svg+xml", href: favicon }
      ]}
    >
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
