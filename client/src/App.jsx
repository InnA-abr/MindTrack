import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavigationWrapper from "./components/NavigationWrapper/NavigationWrapper";

const App = () => (
  <AuthProvider>
    <Router>
      <NavigationWrapper />
    </Router>
  </AuthProvider>
);

export default App;
