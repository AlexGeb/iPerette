import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Login from './pages/Login';
import Home from './pages/Home';
import Enroll from './pages/Enroll';
import { Loader } from 'semantic-ui-react';

const PrivateRoute = ({
  loggingIn,
  authenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (loggingIn) {
        return <Loader active>Loading</Loader>;
      }
      return authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const privateRouteProps = this.props;
    return (
      <Router>
        <Switch>
          <Route exact name="login" path="/login" component={Login} />
          <PrivateRoute
            name="home"
            path="/home"
            component={Home}
            {...privateRouteProps}
          />
          <Route
            name="enroll"
            path="/enroll-account/:token"
            component={Enroll}
          />
          <Redirect to="/home" />
        </Switch>
      </Router>
    );
  }
}

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  return {
    loggingIn,
    authenticated: !loggingIn && !!Meteor.userId()
  };
})(App);
