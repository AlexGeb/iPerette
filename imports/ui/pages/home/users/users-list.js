import React, { Component } from 'react';
import { Table, Header, Button, Confirm } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import UserRow from './user-row';

class UsersList extends Component {
  renderRows = () => {
    return this.props.users.map(u => <UserRow key={u._id} user={u} />);
  };
  render() {
    return (
      <div>
        <Header as="h1" content="Gestion des utilisateurs" />
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nom</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Réservations</Table.HeaderCell>
              <Table.HeaderCell>Création</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderRows()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('users');
  return {
    users: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch()
  };
})(UsersList);
