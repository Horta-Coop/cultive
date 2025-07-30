import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuth = 'Luca';
  return <div>{isAuth == 'Luca' && <h1> {isAuth} </h1>}</div>;
};

export default Navbar;
