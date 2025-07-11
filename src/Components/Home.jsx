

import React from "react";
import PropTypes from "prop-types";


import image1 from "../images/IMG_20240102_122946.jpg";
import image2 from "../images/phone.jpg";


const Home = ({ name, title }) => {
  return (
    <section id="home" className="min-height">
      <img className="background1" src={image1} alt="" />
      <img className="background2" src={image2} alt="" />
      <div className="namee">
        <h1>{name}</h1>
        <h2>{title}</h2>
      </div>
      
    </section>
  );
};

Home.defaultProps = {
  name: "",
  title: "",
};

Home.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Home;