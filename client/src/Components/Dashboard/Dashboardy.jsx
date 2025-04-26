import React from "react";
import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import Dashboard2 from "./Dashboard2";
// Dummy components for demo

const Dashboardy = () => {
  const { id } = useParams();

  return id === "67449e0a668ba5ffa0ac4036" || id === undefined ? (
    <Dashboard />
  ) : (
    <Dashboard2 />
  );
};

export default Dashboardy;
