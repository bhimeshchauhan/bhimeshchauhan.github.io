import React from "react";
import Layout from "../components/layout";
import InstagramGrid from "../components/InstagramGrid/InstagramGrid";

const InstagramPage = () => {
  return (
    <Layout seo={{ title: "Instagram", description: "Instagram grid.", noindex: true }}>
      <InstagramGrid />
    </Layout>
  );
};

export default InstagramPage; 