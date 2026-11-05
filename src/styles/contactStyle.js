import styled from 'styled-components'

export const ContactWrapper = styled.div`
  margin: 2rem auto;
  max-width: 760px;
  position: relative;
  width: 100%;
  background: var(--card);
  border-radius: 28px;
  border: 1px solid var(--line);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  @media (max-width: 700px) {
    margin: 1rem auto;
  }
`;

export const ContactContainer = styled.div`
  background: transparent;
  width: 100%;
  padding: clamp(1.25rem, 4vw, 2.5rem);
`;

export const ContactHeader = styled.h1`
  color: var(--ink);
  font-family: "Space Grotesk", "Signika", sans-serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 0.5rem;
`
export const ContactDetails = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-around;
  h3{
    font-size: 30px;
    color: #7fa1e8;
    font-weight: 300;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`
export const ContactBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 300;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`

export const FormContainer = styled.div`
  margin: 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const InputBox = styled.div`
  position: relative;
  margin: 2rem 0;
  border-bottom: 1px solid var(--line);
  transition: border-color 0.25s ease;
  &:focus-within {
    border-color: var(--accent);
  }
`;

export const Icon = styled.span`
  position: absolute;
  top: 20%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 1.5em;
  color: #fff;
`;

export const Input = styled.input`
  width: 100%;
  height: 2.75em;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1em;
  color: #fff;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 5em;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1em;
  color: #fff;
`;

export const Label = styled.label`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
  ${TextArea} ~ & {
    top: 80%;
  }

  ${Input}:focus ~ &,
  ${Input}:valid ~ &,
  ${Input}:not(:placeholder-shown) ~ &{
    top: -5px;
  }
  ${TextArea}:focus ~ &,
  ${TextArea}:valid ~ & {
    top: -15px;
  }
`;

export const FormButton = styled.button`
  width:100%;
  height:40px;
  background-color: var(--accent);
  border:none;
  border-radius:40px;
  cursor:pointer;
  font-weight: 700;
  margin-top: 2rem;
  height: 52px;
  color: #0b0d12;
  transition: filter 0.2s ease, transform 0.2s ease;
  &:hover { filter: brightness(1.08); transform: translateY(-2px); }
`
