import React from "react";
import "../../styles/lolu.css";
import LoluNav from "../../components/Lolu/nav";
import _ from "lodash";
import p1 from "../../assets/images/lolu/p_1.jpg";
import p2 from "../../assets/images/lolu/p_2.jpg";
import p3 from "../../assets/images/lolu/p_3.jpg";
import p4 from "../../assets/images/lolu/p_4.jpg";
import p5 from "../../assets/images/lolu/p_5.jpg";
import p6 from "../../assets/images/lolu/p_6.jpg";
import p7 from "../../assets/images/lolu/p_7.jpg";
import p8 from "../../assets/images/lolu/p_8.jpg";
import p9 from "../../assets/images/lolu/p_9.jpg";
import p10 from "../../assets/images/lolu/p_10.jpg";
import p11 from "../../assets/images/lolu/p_11.jpg";
import p12 from "../../assets/images/lolu/p_12.jpg";
import p13 from "../../assets/images/lolu/p_13.jpg";
import p14 from "../../assets/images/lolu/p_14.jpg";
import p15 from "../../assets/images/lolu/p_15.jpg";
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import styled from "styled-components";
import ConfettiExplosion from "react-confetti-explosion";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  margin-bottom: 2%;
`;

const LoluGamePage = () => {
  const images = [
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
    p9,
    p10,
    p11,
    p12,
    p13,
    p14,
    p15,
  ];
  const [isExploding, setIsExploding] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(
    _.random(0, images.length - 1)
  );

  const explosionProp = {
    force: 0.8,
    duration: 3000,
    particleCount: 400,
    width: 4000,
  };

  return (
    <div className="wrapper">
      {isExploding && (
        <ConfettiExplosion
          {...explosionProp}
          onComplete={() => {
            setIsExploding(false);
            setImageIndex(_.random(0, images.length - 1));
          }}
        />
      )}
      <LoluNav />
      <Container>
        <JigsawPuzzle
          imageSrc={images[imageIndex]}
          rows={3}
          columns={3}
          onSolved={() => setIsExploding(true)}
        />
      </Container>
    </div>
  );
};

export default LoluGamePage;
