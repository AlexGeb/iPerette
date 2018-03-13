import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Navbar from '../components/Navbar';
import { Container } from 'semantic-ui-react';
import Calendrier from './home/Calendrier';
import Reservation from './home/Reservation';
import { Bookings } from '../../api/bookings';

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
            <Route
              path={`${match.url}/calendrier`}
              render={() => <Calendrier />}
            />
            <Route
              path={`${match.url}/reservation`}
              render={() => <Reservation />}
            />
            <Redirect to={`${match.url}/calendrier`} />
          </Switch>
        </Container>
      </div>
    );
  }
}
export default Home;
