import "./App.css";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import './css/common.scss';
import HomeContainer from './containers/HomeContainer'

function App() {
  return (
    <div className="App">
      <HomeContainer></HomeContainer>
    </div>
  );
}

export default App;
