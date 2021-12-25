import React from "react";
import styled from "styled-components";

const Box = styled.div`
  //  max-width: 450px;

  width: 100%;
  min-height: 470px;
  border-radius: 8px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-out;
  background-color: #17191b;
  margin: 0 4% 4%;
  :hover {
    box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
  }
  @media (max-width: 700px) {
    width: 100%;
    min-height: auto;
    max-width: initial;
  }
  @media (min-width: 768px) and (max-width: 1030px) {
    width: 100%;
    min-height: auto;
    box-sizing: border-box;
    max-width: 100%;
    margin: 0 0 4%;
  }
`;
const BoxIcon = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1%;
  box-sizing: border-box;
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: rgba(127, 161, 232, 0.3);
  img {
    width: 5%;
    margin-right: 3%;
    margin-bottom: 0;
  }
  h3 {
    margin: 0;
    flex: 1;
    color: #fff;
    font-size: 1.2rem;
    margin-left: 3%;
    @media only screen and (max-width: 480px) {
      margin-left: 0;
    }
  }
  @media only screen and (max-width: 480px) {
    img {
      width: 25%;
      margin: 3%;
    }
  }
`;
const BoxDescription = styled.div`
  padding: 5%;
  flex-direction: column;
  display: FLEX;
  height: calc(100% - 120px);
  p {
    color: #fff;
  }
  a {
    color: #7fa1e8;
    font-size: 20px;
    font-weight: bold;
    display: block;
    margin: 0 0 10px;
    text-decoration: none;
  }
  .videoItem {
    display: flex;
    overflow-x: scroll !important;
    /* width */
    ::-webkit-scrollbar {
      height: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey;
      border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(127, 178, 232);
      border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(127, 178, 232, 0.5);
    }

    img {
      max-width: 50%;
      margin: 1%;
    }
  }
  iframe {
    min-height: 50em;
    @media only screen and (max-width: 480px) {
      /* smartphones, Android phones, landscape iPhone */
      min-height: unset;
      height: 20em;
    }
    width: 100%;
  }
`;

const VideoBox = ({ info }) => (
  <Box className="videoBox">
    <BoxIcon>
      <img src={info.icon} alt="bhimesh video icon" />
      <h3>{info.title}</h3>
    </BoxIcon>
    <BoxDescription>
      {info.iframe ? (
        <div dangerouslySetInnerHTML={{ __html: info.iframe }} />
      ) : (
        <div className="videoItem">
          {info.media.map((item) => (
            <img src={item} alt="project icon"></img>
          ))}
        </div>
      )}
    </BoxDescription>
  </Box>
);

export default VideoBox;
