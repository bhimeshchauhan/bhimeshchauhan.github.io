import styled from 'styled-components'
import blob from '../assets/images/blob.svg'

export const ContactWrapper = styled.div`
  margin: 10% auto;
  position: relative;
  width: 100%;
  height: 30em;
  background-image: url(${blob});
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  border: 2px solid rgba(255,255,255,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 700px) {
    margin: 15% auto;
  }
`;

export const ContactContainer = styled.div`
  background: transparent;
  backdrop-filter: blur(8px);
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  padding: 2.5%;
`;

export const ContactHeader = styled.h1`
  text-align: CENTER;
  color: #eeeeee;
  margin-bottom: 5%;
  font-weight: 300;
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
  margin: 30px 0;
  border-bottom: 1px solid #fff;
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
  height: 2em;
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
  background-color: #7fa1e8;
  border:none;
  border-radius:40px;
  cursor:pointer;
  margin-top: 3em;
  color: #fff;
`
