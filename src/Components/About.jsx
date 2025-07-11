

import React from "react";


import image from "../images/motion-background.jpg";

const imageAltText = "purple and blue abstract background";


const description =
  "I'm a web designer studying at Ajay kumar garg engineering college. I enjoy creating unique and simplistic user interfaces in creative ways.";

const skillsList = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Mongo DB",
  "Graphic design",
];


const detailOrQuote =
  "I am passionate about solving problems in new creative ways to drive innovation. By leveraging my UI/UX experience I continually look for new and better ways to make tech accessible by all.";

const About = () => {
  return (
    <section className="padding" id="about">
      <img className="background" src={image} alt={imageAltText} />
      <div className="about">
        <h2>About Myself</h2>
        <p className="large">{description}</p>
        <hr />
        <ul
          
        >
          {skillsList.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <hr />
        <p className="detail">{detailOrQuote}</p>
      </div>
    </section>
  );
};

export default About;