import React from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSpring, animated } from "react-spring";

const Accordion = (prop) => {
  const [isActive, setIsactive] = useState(false);
  const [isHigh, setIshigh] = useState(false);

  const toggleHandler = (e) => {
    setIsactive(!isActive);
    setIshigh(!isHigh);
  };
  const openAnimation = useSpring({
    from: { maxHeight: "0vh" },
    to: { maxHeight: isActive ? "30vh" : "0vh" },
    config: { duration: "400" },
  });
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
    },
    config: { duration: "300" },
  });
  const y = prop.y;
  return (
    <div className="card">
      <div className="entry">
        <div className="show" onClick={toggleHandler}>
          {<h4 style={{ color: !isHigh ? "black" : "blue" }}>{y.year}</h4>}
          <animated.i style={iconAnimation}>
            <FontAwesomeIcon icon={faChevronDown} />
          </animated.i>
        </div>

        <animated.div className="toggle" style={openAnimation}>
          <div className="trow">
            <div id="lft">
              <b>English</b>:
            </div>
            <div id="ctr">
              <a target="blank" href={y.englishHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.englishJunior}>
                Juniors
              </a>
            </div>
          </div>

          {(y.hindiHauts || y.hindiJunior) && (
            <div className="trow">
              <div id="lft">
                <b>Hindi</b>:
              </div>
              <div id="ctr">
                {y.hindiHauts && (
                  <a target="blank" href={y.hindiHauts}>
                    Hauts
                  </a>
                )}
              </div>
              <div id="rht">
                {y.hindiJunior && (
                  <a target="blank" href={y.hindiJunior}>
                    Juniors
                  </a>
                )}
              </div>
            </div>
          )}

{(y.answerHauts || y.answerJunior) && (

<div className="trow">
            <div id="lft">
              <b>Solutions:</b>
            </div>

            <div id="ctr">
              <a target="blank" href={y.answerHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.answerJunior}>
                Juniors
              </a>
            </div> 
           </div> 
)}

{(y.answerkeyHauts || y.answerkeyJunior) && (

<div className="trow">
            <div id="lft">
              <b>Answer Key:</b>
            </div>

            <div id="ctr">
              <a target="blank" href={y.answerkeyHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.answerkeyJunior}>
                Juniors
              </a>
            </div> 
           </div> 
)}


          {/* <div className="trow">
            <div id="lft">
              <b>Hindi</b>:
            </div>
            <div id="ctr">
              <a target="blank" href={y.hindiHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.hindiJunior}>
                Juniors
              </a>
            </div>
          </div> */}
          {/* <div className="trow"> */}
            {/* <div id="lft">
              <b>Answer Key:</b>
            </div> */}

            {/* <div id="ctr">
              <a target="blank" href={y.answerHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.answerJunior}>
                Juniors
              </a>
            </div>
          </div>


          <div className="trow">
            <div id="lft">
              <b>Solutions:</b>
            </div>

            <div id="ctr">
              <a target="blank" href={y.solHauts}>
                Hauts
              </a>
            </div>
            <div id="rht">
              <a target="blank" href={y.solJunior}>
                Juniors
              </a>
            </div> */}
          {/* </div> */}


        </animated.div>
      </div>
      {/* <div className="sp"></div> */}
    </div>
  );
};

export default Accordion;