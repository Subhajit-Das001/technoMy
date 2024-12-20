import SidePanel from "../SidePanel_Main/SidePanel";
import Main from "../SidePanel_Main/Main";
import { useState } from "react";

function Tecnothlon23Updates() {
  const [open, setOpen] = useState(true);

  const toggleHandler = () => {
    setOpen(!open);
  };

  return (
    <div className="App-user">
      <SidePanel toggleHandler={toggleHandler} open={open} />
      <Main toggleHandler={toggleHandler} open={open} />
    </div>
  );
}

export default Tecnothlon23Updates;