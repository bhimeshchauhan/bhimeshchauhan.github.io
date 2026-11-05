import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";

const NotFoundPage = () => (
  <Layout seo={{ title: "Page not found", description: "Page not found.", noindex: true }}>
    <section style={{ color: "#e2f2f7", maxWidth: 640, margin: "10% auto", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>That page doesn't exist. Try one of these instead:</p>
      <p>
        <Link to="/">Home</Link> · <Link to="/case-studies/">Case studies</Link> ·{" "}
        <Link to="/contact/">Contact</Link>
      </p>
    </section>
  </Layout>
);

export default NotFoundPage;
