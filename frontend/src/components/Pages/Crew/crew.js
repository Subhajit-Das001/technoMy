import React from "react";
import "./crew.css"; // Link to your CSS file
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import India from "@react-map/india";
// TopoJSON URL for India's map
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

// Dummy data for the map
const stateData = {
  "Andhra Pradesh": 286,
  "Tamil Nadu": 222,
  "Uttar Pradesh": 166,
  "Maharashtra": 131,
  "Rajasthan": 114,
  "West Bengal": 129,
  "Others": 20,
};

// Dummy data for profiles
// const crewData = [
//   { name: "John Doe", role: "Team Lead", image: "https://via.placeholder.com/100" },
//   { name: "Jane Smith", role: "Designer", image: "https://via.placeholder.com/100" },
//   { name: "Alice Brown", role: "Developer", image: "https://via.placeholder.com/100" },
//   { name: "Bob White", role: "Manager", image: "https://via.placeholder.com/100" },
//   { name: "Charlie Green", role: "Marketing", image: "https://via.placeholder.com/100" },
//   { name: "Daisy Blue", role: "Content Creator", image: "https://via.placeholder.com/100" },
//   { name: "Evan Black", role: "Support", image: "https://via.placeholder.com/100" },
// ];

const Crew = () => {
  return (
    // <div className="dashboard-container">
    //   <h1 className="dashboard-title">Dashboard</h1>

    //   <div className="content-container">
    //     {/* Map Section */}
    //     <div className="map-container">
    //       <ComposableMap projection="geoMercator" className="india-map">
    //         <Geographies geography={geoUrl}>
    //           {({ geographies }) =>
    //             geographies.map((geo) => {
    //               const stateName = geo.properties.st_nm;
    //               const value = stateData[stateName] || 0;
    //               return (
    //                 <Geography
    //                   key={geo.rsmKey}
    //                   geography={geo}
    //                   style={{
    //                     default: { fill: `rgba(0, 0, 255, ${value / 300})`, stroke: "#FFF" },
    //                     hover: { fill: "lightblue", stroke: "#000" },
    //                   }}
    //                 />
    //               );
    //             })
    //           }
    //         </Geographies>
    //       </ComposableMap>
    //     </div>
        <div>
            <India/>
        </div>
  )
        {/* Crew Section */}
        {/* <div className="crew-container">
          {crewData.map((member, index) => (
            <div key={index} className="crew-card">
              <img src={member.image} alt={member.name} className="crew-image" />
              <h3 className="crew-name">{member.name}</h3>
              <p className="crew-role">{member.role}</p>
            </div>
          ))}
        </div> */}
    //   </div>
    // </div>
  
};

export default Crew;
