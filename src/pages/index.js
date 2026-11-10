import React from "react";
import Layout from "../components/layout";
import Hero from "../components/Home/Hero";
import { Contact, Quote, Stats, Work, Writing } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <Stats />
    <Work />
    <Writing />
    <Quote />
    <Contact />
  </Layout>
);

export default IndexPage;
