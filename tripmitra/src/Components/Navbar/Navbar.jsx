import React from "react";
import logo from "../../Assets/logo.png";
import { CircleUserRound } from "lucide-react";
import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const Navitem = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Destination", path: "/destination" },
    { name: "About", path: "/about" },
  ];

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
          <div className={styles.name}>TripMitra</div>
        </div>

        <div className={styles.middle}>
          {Navitem.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <p>{item.name}</p>
            </NavLink>
          ))}
        </div>

        <div className={styles.topRight}>
          <button className={styles.trip}>Plan a Trip</button>
          <CircleUserRound className={styles.userIcon}/>
        </div>
      </div>
    </div>
  );
}

export default Navbar;