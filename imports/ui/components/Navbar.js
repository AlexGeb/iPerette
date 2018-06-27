import React, { Component } from 'react';
import { Menu, Header, Button, Icon } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
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
    if (!this.props.currentUser) {
      return <Redirect to="/login" />;
    }
    const { firstname, lastname } = this.props.currentUser;
    return (
      <Menu color="blue">
        <Menu.Item
          as={Link}
          name="calendrier"
          active={activeItem === 'calendrier'}
          onClick={this.handleItemClick}
          to={`${match.url}/calendrier`}
        >
          <Icon name="calendar outline" />
          Calendrier
        </Menu.Item>
        <Menu.Item
          as={Link}
          name="reservation"
          active={activeItem === 'reservation'}
          onClick={this.handleItemClick}
          to={`${match.url}/reservation`}
        >
          <Icon name="add to calendar" />
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
            <Icon name="users" />
            Utilisateurs
          </Menu.Item>
        )}
        <Menu.Menu position="right">
          <Menu.Item as={Link} to={`${match.url}/profil`}>
            <Header as="h4">
              {firstname} {lastname}
            </Header>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item>
            <Button onClick={onLogout} compact inverted color="red">
              Déconnexion
            </Button>
          </Menu.Item>
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
