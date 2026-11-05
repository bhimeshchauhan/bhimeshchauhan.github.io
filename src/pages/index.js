import React from "react";
import Layout from "../components/layout";
import ChatComponent from "../components/chat";
import Hero from "../components/Home/Hero";
import { About, Contact, Explore, MarqueeBand, Stack, Stats, Work } from "../components/Home/Sections";

const IndexPage = () => (
  <Layout>
    <Hero />
    <MarqueeBand />
    <Stats />
    <About />
    <Work />
    <Stack />
    <Explore />
    <Contact />
    <ChatComponent />
  </Layout>
);

export default IndexPage;
