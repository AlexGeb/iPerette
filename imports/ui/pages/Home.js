import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Container, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import Navbar from '../components/Navbar';
import Calendrier from './home/Calendrier';
import Reservation from './home/Reservation';
import Profil from './home/Profil';
import Loading from '../components/Loading';

const LoadableUtilisateurs = Loadable({
  loader: () => import('./home/Utilisateurs'),
  loading: Loading
});

const AdminRoute = ({ isAdmin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return isAdmin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/home',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { redirectToLogin: false };
  }
  logout = () => {
    Meteor.logout(err => {
      this.setState({ redirectToLogin: true });
    });
  };
  render() {
    if (this.state.redirectToLogin) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: '/home' }
          }}
        />
      );
    }
    const { match, location, currentUser, bookings } = this.props;
    return (
      <div>
        <Navbar match={match} location={location} onLogout={this.logout} />
        <Container>
          <Switch>
            <Route path={`${match.url}/calendrier`} component={Calendrier} />
            <Route path={`${match.url}/reservation`} component={Reservation} />
            <Route path={`${match.url}/profil`} component={Profil} />
            <AdminRoute
              isAdmin={this.props.isAdmin}
              path={`${match.url}/utilisateurs`}
              component={LoadableUtilisateurs}
            />
            <Redirect to={`${match.url}/calendrier`} />
          </Switch>
        </Container>
      </div>
    );
  }
}
export default withTracker(() => {
  const isAdmin = Roles.userIsInRole(
    Meteor.userId(),
    ['admin'],
    Roles.GLOBAL_GROUP
  );
  return {
    isAdmin
  };
})(Home);
