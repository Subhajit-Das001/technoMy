import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar=()=>{


    return(
        <div>
        <nav className="">
     <ul className="regnav">
        <Link>Home</Link>
        <Link>About us</Link>
        <Link>Contact us</Link>
        <Link>Login</Link>
     </ul>
     </nav>
        </div>
    )
};
export default Navbar;