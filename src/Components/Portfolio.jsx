import React from "react";


import image from "../images/design-desk.jpeg"

const imageAltText = "desktop with books and laptop";


const projectList = [
  {
    title: "Guess the Number 🎉",
    description:
      "This begining javaScript project to guess the number between 1 to 10.",
    url: "https://guessthenumberbyadi.netlify.app/",
  },
  {
    title: "Currency Converter",
    description:
      "In this project  we have to convert the currency from one to another using API .",
    url: "https://currencyconvertorbyadi.netlify.app/",
  },
  {
    title: "to do list ",
    description:
      "This is basic javascript project for  to-do-list. this project is to create a note for notice daily routine",
    url: "https://todolistbyadi.netlify.app/",
  },
  {
    title: "Suduko",
    description:
      "This is world famous  game of suduko. Made using javaScript.",
    url: "https://sudukobyadi.netlify.app/",
  },
];

const Portfolio = () => {
  return (
    <section className="padding" id="portfolio">
      <h2 style={{ textAlign: "center" }}>Portfolio</h2>
      <div className="portfolio">
        <div className="img">
          <img
            src={image}
            style={{ height: "90%", width: "100%", objectFit: "cover" }}
            alt={imageAltText}
          />
        </div>
        <div className="container">
          {projectList.map((project) => (
            <div className="box" key={project.title}>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <h3 style={{ flexBasis: "40px" }}>{project.title}</h3>
              </a>
              <p className="small">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;