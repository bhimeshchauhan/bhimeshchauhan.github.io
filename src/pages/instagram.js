import React from "react";import { Helmet } from 'react-helmet';

import Layout from "../components/layout";
import InstagramGrid from "../components/InstagramGrid/InstagramGrid";

const InstagramPage = () => {
  return (
    <Layout>
      <Helmet title="Instagram | Bhimesh Chauhan" />
      <InstagramGrid />
    </Layout>
  );
};

export default InstagramPage; 