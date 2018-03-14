import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import ReservationForm from './resa/resa-form';
import ReservationList from './resa/resa-list';

class Reservation extends Component {
  render() {
    return (
      <Grid stackable columns={2} relaxed divided>
        <Grid.Column width={6}>
          <ReservationForm />
        </Grid.Column>
        <Grid.Column width={10}>
          <ReservationList />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Reservation;
