import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Public from "./Public";
import Private from "./Private";
import PrivateRoute from "./PrivateRoute";
import Courses from "./Courses";
import Auth from "./Auth/Auth";
import AuthContext from "./AuthContext";
import Callback from "./Callback";
import Admin from "./Admin";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(props.history),
      tokenRenewalComplete: false
    };
  }

  componentDidMount = () => {
    this.state.auth.renewToken(() => {
      this.setState({ tokenRenewalComplete: true });
    });
  };

  render() {
    const { auth, tokenRenewalComplete } = this.state;

    if (!tokenRenewalComplete) return "Loading...";
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={auth} {...props} />}
          />
          <Route
            path="/public"
            exact
            render={props => <Public auth={auth} {...props} />}
          />
          <PrivateRoute path="/private" exact component={Private} />
          <Route
            path="/callback"
            exact
            render={props => <Callback auth={auth} {...props} />}
          />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            scopes={["read:courses"]}
          />
          <PrivateRoute path="/admin" component={Admin} />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
