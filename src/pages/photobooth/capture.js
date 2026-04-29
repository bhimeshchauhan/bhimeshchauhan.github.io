import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getSupabaseClient } from "../../components/Photobooth/photoboothProtocol";
import CameraCapture from "../../components/Photobooth/CameraCapture";
import styled from "styled-components";

const FullPage = styled.div`
  min-height: 100vh;
  background: #0d0d0f;
  color: #fff;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: rgba(255,255,255,0.5);
  font-size: 1.1rem;
`;

const CapturePage = () => {
  const [token, setToken] = useState(null);
  const [event, setEvent] = useState(null);
  const [state, setState] = useState("loading"); // loading | active | inactive | error

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
      const ev = data[0];
      setEvent(ev);
      setState(ev.active ? "active" : "inactive");
    });
  }, []);

  return (
    <>
      <Helmet title="Photo Booth | Take a Photo" />
      <FullPage>
        {state === "loading" && <Center>Loading…</Center>}
        {state === "error" && <Center>Invalid or expired event link.</Center>}
        {state === "inactive" && <Center>This event has ended. Thanks for your photos!</Center>}
        {state === "active" && event && (
          <CameraCapture eventId={event.id} displayToken={token} />
        )}
      </FullPage>
    </>
  );
};

export default CapturePage;
