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
// import T_2014_h from "../../Assets/pyqs/Technothlon_2014_Hauts.pdf";
import T_2014_j from "../../Assets/pyqs/Technothlon_2014_Juniors(en).pdf";
// import T_2015_h from "../../Assets/pyqs/Technothlon_2015_Hauts.pdf";
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


const data = [

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
    // englishHauts: T_2015_h,
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
    // englishHauts: T_2014_h,
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
            <h1>Solutions</h1>
            <p>Look through our repository of past question papers to help you prepare for Technothlon 2024</p>
      </div>
      <div className="con">
            <h3>Past Year Questions</h3>
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