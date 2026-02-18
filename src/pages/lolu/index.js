import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import LoluNav from "../../components/Lolu/nav";
import "../../styles/lolu.css";
import HTMLFlipBook from "react-pageflip";
import page0 from "../../assets/images/lolu/0_copy.png";
import page1 from "../../assets/images/lolu/1.png";
import page2 from "../../assets/images/lolu/2.png";
import page3 from "../../assets/images/lolu/3.png";
import page4 from "../../assets/images/lolu/4.png";
import page5 from "../../assets/images/lolu/5.png";
import page6 from "../../assets/images/lolu/6.png";
import page7 from "../../assets/images/lolu/7.png";
import page8 from "../../assets/images/lolu/8.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LoluPage = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(createHeart, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const heartArr = document.querySelectorAll(".fa-heart");
    if (heartArr.length > 200) {
      heartArr[0].remove();
    }
  }, [hearts]);

  function createHeart() {
    const newHeart = {
      left: Math.random() * 100 + "vw",
      top: -50, // Add top position
      animationDuration: Math.random() * 3 + 2 + "s",
    };
    setHearts((prevHearts) => [...prevHearts, newHeart]);
  }

  function calculateOpacity(topPosition) {
    const screenHeight = window.innerHeight;
    const maxOpacity = 1;
    const minOpacity = 0.3;
    const opacityRange = maxOpacity - minOpacity;

    // Normalize top position to range [0, 1]
    const normalizedPosition = topPosition / screenHeight;

    // Apply exponential decay to opacity based on normalized position
    return maxOpacity - Math.pow(normalizedPosition, 2) * opacityRange;
  }

  function calculateColor(topPosition) {
    const screenHeight = window.innerHeight;

    // Calculate RGB components based on the position and random offset
    const red = 255; // Maximize red for pinkish hues
    const green = 200 + Math.floor(Math.random() * 56); // Vary green between 200 and 255 for different shades of pink
    const blue = 200 + Math.floor(Math.random() * 56); // Vary blue between 200 and 255 for different shades of pink

    // Clamp values to ensure they are within the valid range (0-255)
    const clampedRed = Math.max(0, Math.min(red, 255));
    const clampedGreen = Math.max(0, Math.min(green, 255));

    // Construct the RGB color string
    return `rgb(${clampedRed},${clampedGreen},${blue})`;
  }

  return (
    <div className="wrapper">
      <FontAwesomeIcon icon={faHeart} size="1x" />
      {hearts.map((heart, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faHeart}
          className="fa-heart"
          style={{
            color: calculateColor(heart.top), // Pass top position
            fontSize: "25px",
            position: "absolute",
            left: heart.left,
            transition: "top 3s linear", // Apply CSS transition for smooth animation
            animation: `heartMove linear infinite`,
            animationDuration: heart.animationDuration,
            top: heart.top + "px", // Offset by heart size
            zIndex: 0,
            opacity: calculateOpacity(heart.top), // Pass top position
          }}
        />
      ))}
      <LoluNav />
      <HTMLFlipBook
        width={400}
        height={600}
        showCover={true}
        mobileScrollSupport={true}
      >
        <div className="demoPage">
          <img src={page0} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page1} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page2} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page3} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page4} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page5} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page6} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page7} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
        <div className="demoPage">
          <img src={page8} alt="Photo memory page from Bhimesh Chauhan's Lolu album" />
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default LoluPage;
