import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Layout from "../components/layout";
import posts from "../data/blog";
import { Block, Body } from "../components/blog/Prose";

const display = `"Space Grotesk", "Inter", sans-serif`;
const Wrap = styled.article`
  margin: 2rem auto 0;
  max-width: 42rem;
  .back { color: var(--muted); display: inline-block; margin-bottom: 2rem; text-decoration: none; }
  .back:hover { color: var(--accent); }
  .meta { color: var(--muted); font-size: 0.85rem; letter-spacing: 0.1em; margin: 0 0 1rem; text-transform: uppercase; }
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 1rem; overflow-wrap: break-word; }
  .tag { color: var(--muted); font-size: 1.2rem; line-height: 1.5; margin: 0 0 2.5rem; }
  nav.more { border-top: 1px solid var(--line); display: flex; gap: 1.5rem; justify-content: space-between; margin-top: 4rem; padding-top: 1.5rem; }
  nav.more a { color: var(--ink); max-width: 48%; text-decoration: none; }
  nav.more a small { color: var(--muted); display: block; margin-bottom: 0.25rem; }
  nav.more a:hover { color: var(--accent); }
`;

const BlogPost = ({ pageContext }) => {
  const i = posts.findIndex((p) => p.slug === pageContext.slug);
  const post = posts[i];
  if (!post) return null;
  const newer = posts[i - 1];
  const older = posts[i + 1];
  const date = post.dated.split(" - ")[0];
  const pathname = `/blog/${post.slug}/`;
  return (
    <Layout
      seo={{
        title: post.title,
        description: post.tagLine,
        pathname,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.tagLine,
          datePublished: new Date(date.replace(/(\d+)(st|nd|rd|th)/, "$1")).toISOString().slice(0, 10),
          mainEntityOfPage: `https://bhimeshchauhan.github.io${pathname}`,
          author: { "@type": "Person", name: "Bhimesh Chauhan", url: "https://bhimeshchauhan.github.io/" }
        }
      }}
    >
      <Wrap>
        <Link className="back" to="/blog/">← All posts</Link>
        <p className="meta">{post.dated}</p>
        <h1>{post.title}</h1>
        <p className="tag">{post.tagLine}</p>
        <Body>
          {post.description.map((block, k) => (
            <Block key={k} block={block} alt={post.title} />
          ))}
        </Body>
        <nav className="more" aria-label="More posts">
          {older ? <Link to={`/blog/${older.slug}/`}><small>Older</small>{older.title}</Link> : <span />}
          {newer ? <Link to={`/blog/${newer.slug}/`} style={{ textAlign: "right" }}><small>Newer</small>{newer.title}</Link> : <span />}
        </nav>
      </Wrap>
    </Layout>
  );
};

export default BlogPost;
