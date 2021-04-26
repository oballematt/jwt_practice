import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom"
import './App.css';
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from "./components/Register"

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/login"
            render={props =>
              !isAuthenticated ? (
                <Login {...props} /> ) : (
                <Redirect to="/dashboard" />
              )
            }
          />
          <Route exact path="/register"
            render={props =>
              !isAuthenticated ? (
                <Register {...props} /> ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route exact path="/dashboard"
            render={props =>
              !isAuthenticated ? (
                <Dashboard {...props} /> ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
