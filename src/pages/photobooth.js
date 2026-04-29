import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import AuthGate from "../components/Photobooth/AuthGate";
import EventManager from "../components/Photobooth/EventManager";
import { useOwnerSession } from "../components/Photobooth/useOwnerSession";

const PhotoboothPage = () => {
  const { user, loading, signIn, signOut } = useOwnerSession();

  return (
    <Layout>
      <Helmet title="Photo Booth | Bhimesh Chauhan" />
      {!loading && !user ? (
        <AuthGate signIn={signIn} loading={loading} />
      ) : !loading && user ? (
        <EventManager user={user} signOut={signOut} />
      ) : null}
    </Layout>
  );
};

export default PhotoboothPage;
