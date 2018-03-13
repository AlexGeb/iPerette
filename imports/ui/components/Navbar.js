import React, { Component } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

class Navbar extends Component {
  constructor(props) {
    super(props);
    const { pathname } = this.props.location;
    const activeItem =
      pathname.indexOf('reservation') < 0 ? 'calendrier' : 'reservation';
    this.state = {
      isOpen: false,
      activeItem
    };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const { match, onLogout } = this.props;
    const { firstname, lastname } = this.props.currentUser;
    return (
      <Menu>
        <Menu.Item
          as={Link}
          name="calendrier"
          active={activeItem === 'calendrier'}
          onClick={this.handleItemClick}
          to={`${match.url}/calendrier`}
        >
          Calendrier
        </Menu.Item>
        <Menu.Item
          as={Link}
          name="reservation"
          active={activeItem === 'reservation'}
          onClick={this.handleItemClick}
          to={`${match.url}/reservation`}
        >
          Réservation
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Header as="h4">
              {firstname} {lastname}
            </Header>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item onClick={onLogout}>Déconnexion</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('users');
  return {
    currentUser: Meteor.user()
  };
})(Navbar);
