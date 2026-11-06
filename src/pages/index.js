import React from "react";
import Layout from "../components/layout";
import Hero from "../components/Home/Hero";
import FitFinder from "../components/FitFinder";
import { Contact, Quote, Stats, Work } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <Stats />
    <FitFinder />
    <Work />
    <Quote />
    <Contact />
  </Layout>
);

export default IndexPage;
