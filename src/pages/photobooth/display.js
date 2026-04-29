import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { getSupabaseClient } from "../../components/Photobooth/photoboothProtocol";
import LiveWall from "../../components/Photobooth/LiveWall";

const Page = styled.div`
  min-height: 100vh;
  background: #0d0d0f;
  color: #fff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const EventTitle = styled.h1`
  margin: 0;
  font-size: 1.2rem;
  color: #f7fbff;
`;

const LiveBadge = styled.span`
  background: #ef4444;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  color: rgba(255,255,255,0.5);
  font-size: 1.1rem;
`;

const DisplayPage = () => {
  const [token, setToken] = useState(null);
  const [event, setEvent] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const eid = params.get("eid");
    if (!eid) { setState("error"); return; }
    setToken(eid);

    const client = getSupabaseClient();
    if (!client) { setState("error"); return; }

    client.rpc("get_event_by_token", { p_token: eid }).then(({ data, error }) => {
      if (error || !data || data.length === 0) { setState("error"); return; }
      setEvent(data[0]);
      setState("ready");
    });
  }, []);

  return (
    <>
      <Helmet title="Live Photo Wall" />
      <Page>
        {state === "loading" && <Center>Loading…</Center>}
        {state === "error" && <Center>Event not found.</Center>}
        {state === "ready" && event && (
          <>
            <TopBar>
              <EventTitle>{event.title}</EventTitle>
              {event.active && <LiveBadge>● Live</LiveBadge>}
            </TopBar>
            <LiveWall eventId={event.id} displayToken={token} />
          </>
        )}
      </Page>
    </>
  );
};

export default DisplayPage;
