import React from "react";
import styled from "styled-components";
import FitInput from "./FitInput";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  max-width: 100%;
  padding: 0.95rem;
  > p { color: #d9d7d0; font-family: "Inter", sans-serif; font-size: 0.9rem; line-height: 1.45; margin: 0 0 0.6rem; }
`;

// In-chat entry point: the same input as the page section; the chat runs the analysis and shows it as messages.
const FitCard = ({ onSubmit, busy }) => (
  <Card>
    <p><strong>Match Bhimesh to a role.</strong> Paste a job description or upload a file.</p>
    <FitInput onSubmit={onSubmit} busy={busy} />
  </Card>
);

export default FitCard;
