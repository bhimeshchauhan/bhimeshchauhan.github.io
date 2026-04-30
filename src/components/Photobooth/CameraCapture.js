import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGuestUpload } from "./useGuestUpload";
import { useEventChannel } from "./useEventChannel";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  min-height: 100vh;
  background: #0d0d0f;
  color: #fff;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: rgba(255,255,255,0.7);
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  overflow: hidden;
  background: #1a1a1e;
  aspect-ratio: 3 / 4;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FlashOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  opacity: ${({ visible }) => (visible ? 0.6 : 0)};
  transition: opacity 0.1s;
  pointer-events: none;
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.94); }
`;

const ShutterBtn = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: rgba(255,255,255,0.15);
  cursor: pointer;
  transition: background 0.15s;
  &:active { animation: ${pulse} 0.2s ease; }
  &:hover:not(:disabled) { background: rgba(255,255,255,0.3); }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const Strip = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
  max-width: 480px;
  padding-bottom: 4px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.15);
`;

const NamePrompt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 380px;
  text-align: center;
`;

const NameInput = styled.input`
  width: 100%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  padding: 12px 16px;
  outline: none;
  box-sizing: border-box;
  &::placeholder { color: rgba(255,255,255,0.35); }
  &:focus { border-color: rgba(255,255,255,0.5); }
`;

const MessageInput = styled.textarea`
  width: 100%;
  max-width: 480px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  padding: 12px 16px;
  outline: none;
  resize: none;
  rows: 3;
  box-sizing: border-box;
  font-family: inherit;
  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus { border-color: rgba(255,215,0,0.4); }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const PrimaryBtn = styled.button`
  background: #7fa1e8;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const GhostBtn = styled.button`
  background: transparent;
  color: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.4); }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const Divider = styled.div`
  width: 100%;
  max-width: 480px;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 4px 0;
`;

const ErrorMsg = styled.p`
  color: #f87171;
  font-size: 0.9rem;
  text-align: center;
`;

const SentMsg = styled.p`
  color: #86efac;
  font-size: 0.88rem;
  text-align: center;
  margin: 0;
`;

const GUEST_NAME_KEY = "photobooth.guestName";

const CameraCapture = ({ eventId, displayToken }) => {
  const [phase, setPhase] = useState("name");
  const [guestName, setGuestName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [message, setMessage] = useState("");
  const [flash, setFlash] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [msgSent, setMsgSent] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { uploadPhoto, uploading, error: uploadError } = useGuestUpload({ displayToken, guestName });
  const { broadcastPhoto, broadcastMessage } = useEventChannel({ eventId, enabled: phase === "camera" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(GUEST_NAME_KEY);
    if (saved) { setGuestName(saved); setPhase("camera"); }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("Camera unavailable. Use the file picker instead.");
    }
  }, []);

  useEffect(() => {
    if (phase === "camera") startCamera();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [phase, startCamera]);

  const confirmName = () => {
    const name = nameInput.trim();
    setGuestName(name);
    if (typeof window !== "undefined") localStorage.setItem(GUEST_NAME_KEY, name);
    setPhase("camera");
  };

  const capture = useCallback(async () => {
    if (!videoRef.current || uploading) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const bitmap = await createImageBitmap(videoRef.current);
    const result = await uploadPhoto(bitmap);

    if (result) {
      setThumbnails((prev) => [result.publicUrl, ...prev].slice(0, 5));
      await broadcastPhoto({
        photoId: result.photoId,
        publicUrl: result.publicUrl,
        guestName: result.guestName,
        message: message.trim() || null,
        createdAt: new Date().toISOString(),
      });
      setMessage("");
    }
  }, [uploading, uploadPhoto, broadcastPhoto, message]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bitmap = await createImageBitmap(file);
    const result = await uploadPhoto(bitmap);
    if (result) {
      setThumbnails((prev) => [result.publicUrl, ...prev].slice(0, 5));
      await broadcastPhoto({
        photoId: result.photoId,
        publicUrl: result.publicUrl,
        guestName: result.guestName,
        message: message.trim() || null,
        createdAt: new Date().toISOString(),
      });
      setMessage("");
    }
  }, [uploadPhoto, broadcastPhoto, message]);

  const sendMessageOnly = useCallback(async () => {
    const text = message.trim();
    if (!text) return;
    await broadcastMessage({
      messageId: crypto.randomUUID(),
      guestName: guestName || "A guest",
      message: text,
      createdAt: new Date().toISOString(),
    });
    setMessage("");
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 3000);
  }, [message, guestName, broadcastMessage]);

  if (phase === "ended") {
    return (
      <Wrapper>
        <Title>Event has ended</Title>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Thanks for your photos!</p>
      </Wrapper>
    );
  }

  if (phase === "name") {
    return (
      <Wrapper>
        <Title>Photo Booth</Title>
        <NamePrompt>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Add your name so it shows up on the display (optional).
          </p>
          <NameInput
            placeholder="Your name (optional)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmName()}
            autoFocus
          />
          <PrimaryBtn onClick={confirmName}>
            {nameInput.trim() ? "Continue" : "Skip"}
          </PrimaryBtn>
        </NamePrompt>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>{guestName ? `Hey ${guestName}!` : "Photo Booth"}</Title>

      <VideoBox>
        {cameraError ? (
          <div style={{ padding: 24, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
            {cameraError}
            <br /><br />
            <label style={{ cursor: "pointer", color: "#7fa1e8", textDecoration: "underline" }}>
              Pick a photo
              <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
            </label>
          </div>
        ) : (
          <>
            <Video ref={videoRef} autoPlay playsInline muted />
            <FlashOverlay visible={flash} />
          </>
        )}
      </VideoBox>

      {!cameraError && (
        <ShutterBtn onClick={capture} disabled={uploading} aria-label="Take photo" />
      )}

      {uploadError && <ErrorMsg>{uploadError}</ErrorMsg>}

      {thumbnails.length > 0 && (
        <Strip>
          {thumbnails.map((url, i) => <Thumb key={i} src={url} alt="" />)}
        </Strip>
      )}

      <Divider />

      <MessageInput
        placeholder="Leave a message for Elvie… (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />

      <BtnRow>
        <GhostBtn onClick={sendMessageOnly} disabled={!message.trim()}>
          Send message only
        </GhostBtn>
      </BtnRow>

      {msgSent && <SentMsg>Message sent to the display!</SentMsg>}
    </Wrapper>
  );
};

export default CameraCapture;
