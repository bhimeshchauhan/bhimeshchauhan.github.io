// schema.org builders for the pages that otherwise ship no structured data.
import { personId } from "../data/Seo";

const SITE = "https://bhimeshchauhan.com";
const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

// "Jan 2026" -> "2026-01"
const isoMonth = (s) => {
  const m = String(s).trim().match(/^([A-Za-z]{3})\w* (\d{4})$/);
  return m && MONTHS[m[1]] ? `${m[2]}-${MONTHS[m[1]]}` : undefined;
};

export const experienceSchema = (work) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bhimesh Chauhan: work history",
  itemListElement: work.map((w, i) => {
    const [from, to] = w.dated.split(/\s[–-]\s/);
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Role",
        roleName: w.designation,
        startDate: isoMonth(from),
        ...(isoMonth(to) ? { endDate: isoMonth(to) } : {}),
        member: { "@id": personId },
        memberOf: { "@type": "Organization", name: w.name, ...(w.companyLink ? { url: w.companyLink } : {}) }
      }
    };
  })
});

export const projectsSchema = (projects) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bhimesh Chauhan: projects",
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "CreativeWork", name: p.title, author: { "@id": personId } }
  }))
});

export const blogSchema = (posts) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Bhimesh Chauhan: Blog",
  url: `${SITE}/blog/`,
  author: { "@id": personId },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.tagLine,
    url: `${SITE}/blog/#post-${p.id}`,
    author: { "@id": personId }
  }))
});

export const profilePageSchema = ({ pathname, name, description }) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE}${pathname}`,
  name,
  description,
  mainEntity: { "@id": personId, "@type": "Person", name: "Bhimesh Chauhan", url: `${SITE}/` }
});
