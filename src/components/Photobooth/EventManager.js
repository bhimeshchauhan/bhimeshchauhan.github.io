import React, { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import { getSupabaseClient } from "./photoboothProtocol";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: #f7fbff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.span`
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
`;

const SignOutBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.7);
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StartBtn = styled.button`
  background: #7fa1e8;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const EndBtn = styled(StartBtn)`
  background: rgba(255, 80, 80, 0.7);
`;

const QrRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const QrBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  flex-shrink: 0;
`;

const UrlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 200px;
`;

const UrlBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.5);
`;

const UrlRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const UrlText = styled.code`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.8);
  background: rgba(0,0,0,0.3);
  border-radius: 6px;
  padding: 6px 10px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CopyBtn = styled.button`
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: rgba(255,255,255,0.18); }
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#4ade80" : "#f87171")};
  margin-right: 8px;
`;

const EventManager = ({ user, signOut }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    loadActiveEvent();
  }, [user]);

  const loadActiveEvent = async () => {
    setLoading(true);
    const client = getSupabaseClient();
    if (!client || !user) { setLoading(false); return; }

    const { data } = await client
      .from("events")
      .select("*")
      .eq("owner_id", user.id)
      .eq("active", true)
      .maybeSingle();

    setEvent(data ?? null);
    setLoading(false);
  };

  const startEvent = async () => {
    setWorking(true);
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("events")
      .insert({ owner_id: user.id })
      .select()
      .single();

    if (!error) setEvent(data);
    setWorking(false);
  };

  const endEvent = async () => {
    if (!event) return;
    setWorking(true);
    const client = getSupabaseClient();
    await client
      .from("events")
      .update({ active: false, ended_at: new Date().toISOString() })
      .eq("id", event.id);
    setEvent(null);
    setWorking(false);
  };

  const copy = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  }, []);

  const captureUrl = event
    ? `${origin}/photobooth/capture/?eid=${event.display_token}`
    : "";
  const displayUrl = event
    ? `${origin}/photobooth/display/?eid=${event.display_token}`
    : "";

  return (
    <Wrapper>
      <Header>
        <UserInfo>{user.email}</UserInfo>
        <SignOutBtn onClick={signOut}>Sign out</SignOutBtn>
      </Header>

      <Card>
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Loading…</p>
        ) : event ? (
          <>
            <div>
              <StatusDot active />
              <strong>Event active</strong>
            </div>

            <QrRow>
              <QrBox>
                <QRCodeSVG value={captureUrl} size={140} />
              </QrBox>
              <UrlGroup>
                <UrlBlock>
                  <Label>Guest camera link (share this / show QR)</Label>
                  <UrlRow>
                    <UrlText title={captureUrl}>{captureUrl}</UrlText>
                    <CopyBtn onClick={() => copy(captureUrl, "capture")}>
                      {copied === "capture" ? "Copied!" : "Copy"}
                    </CopyBtn>
                  </UrlRow>
                </UrlBlock>
                <UrlBlock>
                  <Label>Live display (cast to screen)</Label>
                  <UrlRow>
                    <UrlText title={displayUrl}>{displayUrl}</UrlText>
                    <CopyBtn onClick={() => copy(displayUrl, "display")}>
                      {copied === "display" ? "Copied!" : "Copy"}
                    </CopyBtn>
                  </UrlRow>
                </UrlBlock>
              </UrlGroup>
            </QrRow>

            <EndBtn onClick={endEvent} disabled={working}>
              {working ? "Ending…" : "End event"}
            </EndBtn>
          </>
        ) : (
          <>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
              Start an event to get a QR code guests can scan to upload photos.
              Photos are saved to your Google Drive automatically.
            </p>
            <StartBtn onClick={startEvent} disabled={working}>
              {working ? "Starting…" : "Start event"}
            </StartBtn>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default EventManager;
