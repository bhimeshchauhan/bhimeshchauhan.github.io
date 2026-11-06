import React from "react";
import Layout from "../components/layout";
import Hero from "../components/Home/Hero";
import { Contact, Quote, Stats, Work } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <Stats />
    <Work />
    <Quote />
    <Contact />
  </Layout>
);

export default IndexPage;
