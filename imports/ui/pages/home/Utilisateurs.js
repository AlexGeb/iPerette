import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

class Utilisateurs extends Component {
  render() {
    return (
      <div>
        <Header as="h1" content="Gestion des utilisateurs" />
        {this.props.users.map((u, i) => (
          <h4 key={i}>
            {u.firstname} {u.lastname}
          </h4>
        ))}
      </div>
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
    users: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch()
  };
})(Utilisateurs);
