import React from "react";
import Layout from "../components/layout";
import ChatComponent from "../components/chat";
import Hero from "../components/Home/Hero";
import { Contact, Quote, Stats, Work } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <Stats />
    <Work />
    <Quote />
    <Contact />
    <ChatComponent />
  </Layout>
);

export default IndexPage;
