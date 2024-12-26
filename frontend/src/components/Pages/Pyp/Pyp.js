import React from 'react';
import Accordion from "./Accordion";
import './Pyp.css';
import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";
import T_2009_h from "../../Assets/pyqs/Technothlon_2009_Hauts.pdf";
import T_2009_j from "../../Assets/pyqs/Technothlon_2009_Juniors.pdf";
import T_2010_h from "../../Assets/pyqs/Technothlon_2010_Hauts.pdf";
import T_2010_j from "../../Assets/pyqs/Technothlon_2010_Juniors.pdf";
// import T_2011_h from "../../Assets/pyqs/Technothlon_2011_Hauts.pdf";
import T_2011_j from "../../Assets/pyqs/Technothlon_2011_Juniors.pdf";
// import T_2012_h from "../../Assets/pyqs/Technothlon_2012_Hauts.pdf";
import T_2012_j from "../../Assets/pyqs/Technothlon_2012_Juniors.pdf";
// import T_2013_h from "../../Assets/pyqs/Technothlon_2013_Hauts.pdf";
import T_2013_j from "../../Assets/pyqs/Technothlon_2013_Juniors.pdf";
import T_2014_he from "../../Assets/pyqs/2014HE.pdf";
import T_2014_j from "../../Assets/pyqs/Technothlon_2014_Juniors(en).pdf";
import T_2015_he from "../../Assets/pyqs/2015HE.pdf";
import T_2015_j from "../../Assets/pyqs/Technothlon_2015_JUNIOR(en).pdf";
import T_2016_h from "../../Assets/pyqs/Technothlon_2016_HE.pdf";
import T_2016_j from "../../Assets/pyqs/Technothlon_2016_JE.pdf";
import T_2017_h from "../../Assets/pyqs/Technothlon_2017_HE.pdf";
import T_2017_j from "../../Assets/pyqs/Technothlon_2017_JE.pdf";

import T_2018_he from "../../Assets/pyqs/T18/HAUTS-ENGLISH.pdf";
import T_2018_hh from "../../Assets/pyqs/T18/HAUTS-HINDI.pdf";
import T_2018_je from "../../Assets/pyqs/T18/JUNIORS-ENGLISH.pdf";
import T_2018_jh from "../../Assets/pyqs/T18/JUNIORS-ENGLISH.pdf";

import T_2019_he from "../../Assets/pyqs/T19/2019hauts.pdf";
import T_2019_hs from "../../Assets/pyqs/T19/2019hautssolutions.pdf";
import T_2019_je from "../../Assets/pyqs/T19/2019juniors.pdf";
import T_2019_js from "../../Assets/pyqs/T19/2019JuniorSolutions.pdf";

import T_2020_he from "../../Assets/pyqs/T20/Hauts English 20.pdf";
import T_2020_je from "../../Assets/pyqs/T20/Juniors English 20.pdf";



import T_2021_he from "../../Assets/pyqs/T21/Hauts English 21.pdf";
import T_2021_je from "../../Assets/pyqs/T21/Juniors English 2021.pdf";
import T_2021_hh from "../../Assets/pyqs/T21/Hauts Hindi 21.pdf";
import T_2021_jh from "../../Assets/pyqs/T21/Juniors Hindi 21.pdf";
import T_2021_ha from "../../Assets/pyqs/T21/Hauts Key 21.pdf";
import T_2021_ja from "../../Assets/pyqs/T21/Juniors Key 21.pdf";

import T_2022_he from "../../Assets/pyqs/T22/Hauts english 22.pdf";
import T_2022_je from "../../Assets/pyqs/T22/Juniors 22 English.pdf";
import T_2022_hh from "../../Assets/pyqs/T22/Hauts Hindi 22.pdf";
import T_2022_jh from "../../Assets/pyqs/T22/Juniors Hindi 22.pdf";
import T_2022_ha from "../../Assets/pyqs/T22/Hauts key 22.pdf";
import T_2022_ja from "../../Assets/pyqs/T22/Juniors Key 22.pdf";


import T_2023_he from "../../Assets/pyqs/T23/Hauts English 23.pdf";
import T_2023_je from "../../Assets/pyqs/T23/Juniors English 23.pdf";
import T_2023_hh from "../../Assets/pyqs/T23/Hauts Hindi 23.pdf";
import T_2023_jh from "../../Assets/pyqs/T23/Juniors Hindi 23.pdf";
import T_2023_ha from "../../Assets/pyqs/T23/Hauts Key 23.pdf";
import T_2023_ja from "../../Assets/pyqs/T23/Juniors Key 23.pdf";

const data = [

  {
    year: "Technothlon 2023",
    englishHauts: T_2023_he,
    hindiHauts: T_2023_hh,
    englishJunior: T_2023_je,
    hindiJunior: T_2023_jh,
    answerkeyHauts: T_2023_ha,
    answerkeyJunior: T_2023_ja,
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },


  {
    year: "Technothlon 2022",
    englishHauts: T_2022_he,
    hindiHauts: T_2022_hh,
    englishJunior: T_2022_je,
    hindiJunior: T_2022_jh,
    answerkeyHauts: T_2022_ha,
    answerkeyJunior: T_2022_ja,
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2021",
    englishHauts: T_2021_he,
    hindiHauts: T_2021_hh,
    englishJunior: T_2021_je,
    hindiJunior: T_2021_jh,
    answerkeyHauts: T_2021_ha,
    answerkeyJunior: T_2021_ja,
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2020",
    englishHauts: T_2020_he,
    // hindiHauts: "",
    englishJunior: T_2020_je,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },


    {
      year: "Technothlon 2019",
      englishHauts: T_2019_he,
      // hindiHauts: T_2018_hh,
      englishJunior: T_2019_je,
      // hindiJunior: T_2018_jh,
      answerHauts: T_2019_hs,
      answerJunior: T_2019_js,
      // solHauts: "",
      // solJunior: "",
    },
    

    {
    year: "Technothlon 2018",
    englishHauts: T_2018_he,
    hindiHauts: T_2018_hh,
    englishJunior: T_2018_je,
    hindiJunior: T_2018_jh,
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },

  {
    year: "Technothlon 2017",
    englishHauts: T_2017_h,
    // hindiHauts: "",
    englishJunior: T_2017_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
 
  {
    year: "Technothlon 2016",
    englishHauts: T_2016_h,
    // hindiHauts: "",
    englishJunior: T_2016_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2015",
    englishHauts: T_2015_he,
    // hindiHauts: "",
    englishJunior: T_2015_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2014",
    englishHauts: T_2014_he,
    // hindiHauts: "",
    englishJunior: T_2014_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2013",
    // englishHauts: T_2013_h,
    // hindiHauts: "",
    englishJunior: T_2013_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2012",
    // englishHauts: T_2012_h,
    // hindiHauts: "",
    englishJunior: T_2012_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2011",
    // englishHauts: T_2011_h,
    // hindiHauts: "",
    englishJunior: T_2011_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2010",
    englishHauts: T_2010_h,
    // hindiHauts: "",
    englishJunior: T_2010_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
  {
    year: "Technothlon 2009",
    englishHauts: T_2009_h,
    // hindiHauts: "",
    englishJunior: T_2009_j,
    // hindiJunior: "",
    // answerHauts: "",
    // answerJunior: "",
    // solHauts: "",
    // solJunior: "",
  },
 


  // {
  //   year: "Technothlon 2020",
  //   englishHauts: "",
  //   hindiHauts: "",
  //   englishJunior: "",
  //   hindiJunior: "",
  //   answerHauts: "",
  //   answerJunior: "",
  //   solHauts: "",
  //   solJunior: "",
  // },
  // {
  //   year: "Technothlon 2021",
  //   englishHauts: "",
  //   hindiHauts: "",
  //   englishJunior: "",
  //   hindiJunior: "",
  //   answerHauts: "",
  //   answerJunior: "",
  //   solHauts: "",
  //   solJunior: "",
  // },
  // {
  //   year: "Technothlon 2022",
  //   englishHauts: "",
  //   hindiHauts: "",
  //   englishJunior: "",
  //   hindiJunior: "",
  //   answerHauts: "",
  //   answerJunior: "",
  //   solHauts: "",
  //   solJunior: "",
  // },
  // {
  //   year: "Technothlon 2023",
  //   englishHauts: "",
  //   hindiHauts: "",
  //   englishJunior: "",
  //   hindiJunior: "",
  //   answerHauts: "",
  //   answerJunior: "",
  //   solHauts: "",
  //   solJunior: "",
  // },
];

function Pyp() {
  return (
    <div className="App">
       <div className="header">
            <Header/>
        </div>
      
      <div className="green">
            <h1>Previous Year Questions</h1>
            <p>See for yourself the unique question papers of Technothlon!
              <br />  Go through our repository of past Technothlon papers to get a hang of the questions and get ready to face Technothlon 2025!
              </p>
      </div>
      <div className="con">
            {/* <h3>Learn from the Best – Dive into PYQs</h3> */}
      </div>
      {data.map((y) => (
        <Accordion y={y} />
      ))}
      <div className="gap"></div>
      <div className="footer">
            <Footer/>

        </div>
    </div>
  );
}

export default Pyp;