import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from "react-spring";
import AboutUs from "../../../Assets/img/AboutUs.png";
import { useState } from "react";
import "./SidePanel_Main.css";
import UpdatesContent from "../Updates/updatescontent";
import Profile from "../Profile/Profile";
import Upload from "../Profile/Upload";
import Registeration from "../Profile/Registeration";

const Main = ({ open, toggleHandler }) => {
  const currentRoute = window.location.pathname;

  const toggleAnimationMain = useSpring({
    from: { minWidth: "79%" },
    to: { minWidth: open ? "79%" : "92%" },
    config: { duration: "300" },
  });

  const renderContent = () => {
    if (currentRoute === "/technothlon2023-updates") {
      return <UpdatesContent />;
    } else if (currentRoute === "/dashboard") {
      return <Profile />;
    } else if (currentRoute === "/technothlon2023-upload") {
      return <Upload />;
    } else if (currentRoute === "/technothlon2023-registerations") {
      return <Registeration />;
    } else {
      return (
        <div>
          {/* Default content for other routes */}
          etctdxnglfeicuwkgcmxfu
        </div>
      );
    }
  };

  return (
    <animated.div className="main" style={toggleAnimationMain}>
      <div className="bar">
        <animated.i onClick={toggleHandler}>
          <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
        </animated.i>
        <div className="cred">
          <img src={AboutUs} alt="NA" />
          <div className="roll">JE1807102001</div>
        </div>
      </div>
      <div className="content-wrapper">{renderContent()}</div>
    </animated.div>
  );
};

export default Main;
