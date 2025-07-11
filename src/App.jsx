import React from "react";

import About from "./Components/About";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Portfolio from "./Components/Portfolio";

import "./index.css";

const siteProps = {
  name: "Aditya Singh",
  title: "Web Designer & Content Creator",
  email: "aditya2210005@akgec.ac.in",
  gitHub: "adithakur954",
  instagram: "btwitsadithakur",
  linkedIn: "/aditya-singh-064015254",
  
};

const primaryColor = "#4E567E";
const secondaryColor = "#D2F1E4";

const App = () => {
  return (
    <div id="main">
      <Header />
      <Home name={siteProps.name} title={siteProps.title} />
      <About />
      <Portfolio />
      <Footer {...siteProps} primaryColor={primaryColor} secondaryColor={secondaryColor} />
    </div>
  );
};

export default App;