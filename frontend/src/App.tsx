import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import RoutesComponent from "./routes/routes";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-200">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <RoutesComponent />
    </Router>
  );
};

export default App;
