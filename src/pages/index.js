import React from "react";
import Layout from "../components/layout";
import ChatComponent from "../components/chat";
import Hero from "../components/Home/Hero";
import { Contact, Explore, MarqueeBand, Stats, Work } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <MarqueeBand />
    <Stats />
    <Work />
    <Explore />
    <Contact />
    <ChatComponent />
  </Layout>
);

export default IndexPage;
