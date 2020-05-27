import React from "react";
import ReactDOM from "react-dom";
import particles from "particlesjs";

import "./background.css";

const Background = () => {
  React.useEffect(() => {
    particles.init({
      selector: ".background",
      color: ["#DA0463", "#404B69", "#DBEDF3"],
      connectParticles: true,
    });

    window.particles = particles;
  }, []);

  const canvas = <canvas className="background"></canvas>;

  return ReactDOM.createPortal(canvas, document.body);
};

export default Background;
