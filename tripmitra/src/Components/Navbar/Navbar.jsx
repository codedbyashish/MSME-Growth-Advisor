import React from "react";
import logo from "../../Assets/logo.png";
import { CircleUserRound } from "lucide-react";
import styles from "./Navbar.module.css";
import {Link,NavLink} from 'react-router-dom'

function Navbar() {
  const Navitem = ["Home", "Features", "Destination", "About"];
  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
          <div className={styles.name}>TripMitra</div>
        </div>

        <div className={styles.middle}>
          <Navlink className={
            ({isActive})=>{
              {isActive ?"text-blue-500":"text-black"}

            }
          }>
            {Navitem.map((content, index) => (
              <p key={index}>{content}</p>
            ))}
          </Navlink>
        </div>

        <div className={styles.topRight}>
          <button className={styles.trip}>Plan a Trip</button>
          <CircleUserRound />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
