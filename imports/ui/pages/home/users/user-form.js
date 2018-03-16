import React, { Component } from 'react';
import { Header, Form, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

class UserForm extends Component {
  state = { firstname: '', lastname: '', email: '' };
  handleSubmit = () => {
    const { firstname, lastname, email } = this.state;
    Meteor.call('users.insert', { firstname, lastname, email });
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { firstname, lastname, email } = this.state;
    return (
      <div>
        <Header as="h1">Ajouter un nouvel utilisateur</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline>
            <Form.Input
              label="Prénom"
              placeholder="prénom"
              name="firstname"
              value={firstname}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Nom"
              placeholder="nom de famille"
              name="lastname"
              value={lastname}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Input
            label="Email"
            placeholder="adresse-mail@gogol.cool"
            name="email"
            type="email"
            value={email}
            onChange={this.handleChange}
          />
          <Button content="Enregistrer" />
        </Form>
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
    users: Meteor.users.find({}, { fields: { emails: 1 } }).fetch()
  };
})(UserForm);
