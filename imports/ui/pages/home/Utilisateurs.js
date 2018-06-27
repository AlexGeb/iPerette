import React from 'react';
import { Grid } from 'semantic-ui-react';
import UserForm from './users/user-form';
import UsersList from './users/users-list';

export default () => (
  <Grid stackable columns={1} relaxed>
    <Grid.Row>
      <UserForm />
    </Grid.Row>
    <Grid.Row>
      <UsersList />
    </Grid.Row>
  </Grid>
);
