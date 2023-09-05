import React from "react";
import { GiCommercialAirplane } from "react-icons/gi";
import { IconContext } from "react-icons/lib/esm";

export default function About() {
  return (
    <div className="flex flex-col place-content-center mx-40 my-20 text-left font-semibold leading-7 text-gray-900">
      <h1>Hi, I'm James Rohrs</h1>

      <br />

      <p>
        I am a student at UW-Madison majoring in Computer Science with a
        certificate in Data Science and I am excited to continue learning about
        the many fields in the Computer and Data Science world
      </p>

      <p>
        During my freetime this past summer, I learned about HTML,
        CSS/Tailwind/Bootstrap, React, Next.js routing and Firebase in order to
        create a User Authentication feature and Navbar in this in-progress
        Stock App
      </p>

      <br />

      <div className="flex justify-between h-60 space-x-10">
        <a
          href="https://github.com/jrohrs12/airline-flight-system"
          className="border-4 border-indigo-500/100 w-1/3 p-4 rounded text-left proj-cards"
        >
          <p>Airline Flight Optimization</p>
          <p>Role: Algorithm Enginner</p>
          <GiCommercialAirplane size={80} />
        </a>
        <div className="border-4 border-indigo-500/100 w-1/3 p-4 rounded proj-cards">
          Project 2
        </div>
        <div className="border-4 border-indigo-500/100 w-1/3 p-4 rounded proj-cards">
          Project 3
        </div>
      </div>
    </div>
  );
}
