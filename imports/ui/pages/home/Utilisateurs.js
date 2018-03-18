import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import UserForm from './users/user-form';
import UsersList from './users/users-list';

class Utilisateurs extends Component {
  render() {
    return (
      <Grid stackable columns={2} relaxed divided>
        <Grid.Column mobile={16} tablet={16} computer={6}>
          <UserForm />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={10}>
          <UsersList />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Utilisateurs;
