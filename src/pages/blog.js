import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Blog from "../data/blog";
import { blogSchema } from "../utils/schema";
import Layout from "../components/layout";

const display = `"Space Grotesk", "Inter", sans-serif`;
const Wrap = styled.section`
  margin-top: 2rem;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 0.75rem; }
  .lede { color: var(--muted); font-size: 1.15rem; margin: 0 0 3rem; max-width: 36rem; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { border-top: 1px solid var(--line); margin: 0; }
  li:last-child { border-bottom: 1px solid var(--line); }
  a { color: var(--ink); display: grid; gap: 0.25rem 2rem; grid-template-columns: 11rem 1fr; padding: 1.4rem 0; text-decoration: none; }
  a:hover h2 { color: var(--accent); }
  time { color: var(--muted); font-size: 0.9rem; padding-top: 0.3rem; }
  h2 { font-family: ${display}; font-size: clamp(1.25rem, 2.4vw, 1.6rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; margin: 0; transition: color 0.2s; }
  p { color: var(--muted); grid-column: 2; margin: 0.35rem 0 0; }
  @media (max-width: 700px) { a { grid-template-columns: 1fr; } p { grid-column: 1; } }
`;

const BlogLayout = () => (
  <Layout seo={{ title: "Blog", description: "Notes from Bhimesh Chauhan on engineering, AI systems, and building products.", structuredData: blogSchema(Blog) }}>
    <Wrap>
      <h1>Blog</h1>
      <p className="lede">Notes on engineering, AI systems and building products.</p>
      <ul>
        {Blog.map((p) => (
          <li key={p.id}>
            <Link to={`/blog/${p.slug}/`}>
              <time>{p.dated.split(" - ")[0]}</time>
              <h2>{p.title}</h2>
              <p>{p.tagLine}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Wrap>
  </Layout>
);

export default BlogLayout;
