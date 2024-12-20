import {
  faDownload,
  faFolder,
  faGraduationCap,
  faPaperPlane,
  faPlus,
  faSignOut,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from "react-spring";
import "./SidePanel_Main.css";
import Logo from "../../../Assets/img/logo.png";
import AboutUs from "../../../Assets/img/AboutUs.png";
import { Link } from "react-router-dom";

const SidePanel = ({ open }) => {
  const toggleAnimation = useSpring({
    from: { minWidth: "21%" },
    to: { minWidth: !open ? "8%" : "21%" },
    config: { duration: "300" },
  });
  const centerAnimation = useSpring({
    from: { justifyContent: "left" },
    to: { justifyContent: open ? "left" : "center" },
    config: { duration: "300" },
  });

  // console.log(open);
  return (
    <animated.div className="side-main" style={toggleAnimation}>
      <div className="image">
        <img src={Logo} alt="NA" />
      </div>
      <div className="big-logo">
        <img src={AboutUs} alt="NA" />
      </div>
      <div className="links">
        {open && <div className="name link rfont"> Name</div>}
        {open && <div className="main-nav link"> MAIN NAVIGATION</div>}
        <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faUser} />
          {open && (
            <p>
              <Link to="/dashboard" className="sidebarlink">
                Profile
              </Link>
            </p>
          )}
        </animated.div>
        <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faUpload} />
          {open && (
            <p>
              <Link to="/technothlon2023-upload" className="sidebarlink">
                Upload
              </Link>
            </p>
          )}
        </animated.div>
        <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faFolder} />
          {open && (
            <p>
              <Link
                to="/technothlon2023-registerations"
                className="sidebarlink"
              >
                Registerations
              </Link>
            </p>
          )}
        </animated.div>
        {/* <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faPaperPlane} />
          {open && (
            <p>
              <Link to="/technothlon2023-quicklinks" className="sidebarlink">
                Form Roll Numbers
              </Link>
            </p>
          )}
        </animated.div> */}
        <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faPlus} />
          {open && (
            <p>
              <Link to="/technothlon2023-updates" className="sidebarlink">
                Updates
              </Link>
            </p>
          )}
        </animated.div>
        <animated.div className="link rfont" style={centerAnimation}>
          <FontAwesomeIcon icon={faSignOut} />
          {open && <p> Sign Out</p>}
        </animated.div>
      </div>
    </animated.div>
  );
};

export default SidePanel;
