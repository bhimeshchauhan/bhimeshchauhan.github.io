import styled from 'styled-components'

export const UserWrapper = styled.div`
  margin: 2% auto;
  /* animation: fade-in 500ms ease 200ms 1 forwards;
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(1.2);
    }
    20% {
      opacity: 0.2;
      transform: scale(1.16);
    }
    40% {
      opacity: 0.4;
      transform: scale(1.12);
    }
    60% {
      opacity: 0.6;
      transform: scale(1.08);
    }
    80% {
      opacity: 0.8;
      transform: scale(1.04);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  } */
  @media (max-width: 1170px) {
    margin: 15% auto;
  }
`;
export const UserTitle = styled.h1`
  font-size: 4.2em;
  font-weight: bold;
  color: #E2F2F7;
  span{
    color: #7fa1e8;
  }
  @media (max-width: 1170px) {
    font-size: 3em;
  }
`;
export const UserDescription = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
  margin-bottom: 5%;
  p{
    color: #E2F2F7;
    max-width: 90%;
    font-weight: 300;
    font-size: 26px;
    line-height: 1.3;
    margin-bottom: 15%;
  }
  img{
    margin-top: -15%;
    max-width: 50%;
  }
  @media (max-width: 1000px) and (min-width: 701px) {
    flex-direction: column-reverse;
    div {
      display: flex;
    }
    img{
      margin-top: 0%;
      max-width: 50%;
    }
    p{
      max-width: 100%;
      font-size: 19px;
      margin-bottom: 0;
    }
  }
  @media (max-width: 700px) {
    flex-direction: column-reverse;
    div {
      display: block;
    }
    img{
      margin-top: -5%;
      max-width: 100%;
    }
    p{
      max-width: 100%;
      font-size: 19px;
    }
  }
`;
export const DownloadButton = styled.a`
  width: 298px;
  height: 71px;
  background-color: rgba(48, 57, 131, 0.7);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: CENTER;
  text-decoration: none;
  color: #E2F2F7;
  cursor: pointer;
  :hover{
    color: #7fa1e8;
  }
  @media (max-width: 1170px) {
    width: 100%;
  }
`
export const UserTopic = styled.div`
  display: flex;
  justify-content: center;
  /* margin-top: -5%; */
  padding: 1% 0%;
  @media (max-width: 1170px) {
    flex-direction: column;
  }
`
