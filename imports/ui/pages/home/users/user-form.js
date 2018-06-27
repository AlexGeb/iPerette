import React, { Component } from 'react';
import { Header, Form, Button, Container, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

class UserForm extends Component {
  state = {
    firstname: '',
    lastname: '',
    email: ''
  };
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
    const emailValid = !!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const disabled = !emailValid || !firstname || !lastname || !email;
    return (
      <Container>
        <Header as="h1">Ajouter un nouvel utilisateur</Header>
        <Form onSubmit={this.handleSubmit} error={!!email && !emailValid}>
          <Message error content="Email non valide" />
          <Form.Group widths="equal">
            <Form.Input
              fluid
              required
              label="Prénom"
              placeholder="prénom"
              name="firstname"
              value={firstname}
              onChange={this.handleChange}
            />
            <Form.Input
              fluid
              required
              label="Nom"
              placeholder="nom de famille"
              name="lastname"
              value={lastname}
              onChange={this.handleChange}
            />
            <Form.Input
              fluid
              required
              label="Email"
              placeholder="adresse-mail@mail.fr"
              name="email"
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Button disabled={disabled} content="Enregistrer" />
        </Form>
      </Container>
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
