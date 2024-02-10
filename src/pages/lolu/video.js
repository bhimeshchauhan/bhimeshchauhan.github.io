import React from "react";
import "../../styles/lolu.css";
import LoluNav from "../../components/Lolu/nav";
import ReactPlayer from "react-player";
import dance from "../../assets/images/lolu/dance.mp4";

const LoluVideoPage = () => {
  return (
    <div className="wrapper">
      <LoluNav />
      <ReactPlayer
        width={800}
        height={600}
        url={dance}
        playing={true}
        controls={true}
      />
    </div>
  );
};

export default LoluVideoPage;
