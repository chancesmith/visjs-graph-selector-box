import React from "react";
import ReactDOM from "react-dom";
import ForceGraph from "./ForceGraph";

import "./styles.css";

function App() {
  return ( <
    div className = "App" >
    <
    ForceGraph / >
    <
    /div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render( < App / > , rootElement);