import React, { Component } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

class Navbar extends Component {
  constructor(props) {
    super(props);
    const { pathname } = this.props.location;
    const possiblePath = ['reservation', 'calendrier', 'utilisateurs'];
    const activeItem = possiblePath.find(p => pathname.includes(p));
    this.state = {
      isOpen: false,
      activeItem
    };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const { match, onLogout, isAdmin } = this.props;
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
        {isAdmin && (
          <Menu.Item
            as={Link}
            name="utilisateurs"
            active={activeItem === 'utilisateurs'}
            onClick={this.handleItemClick}
            to={`${match.url}/utilisateurs`}
          >
            Utilisateurs
          </Menu.Item>
        )}
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
  const isAdmin = Roles.userIsInRole(
    Meteor.userId(),
    ['admin'],
    Roles.GLOBAL_GROUP
  );
  return {
    isAdmin,
    currentUser: Meteor.user()
  };
})(Navbar);
