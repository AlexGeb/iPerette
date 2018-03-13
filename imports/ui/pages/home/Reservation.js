import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import ReservationForm from './resa/resa-form';
import ReservationList from './resa/resa-list';

class Reservation extends Component {
  render() {
    return (
      <Grid columns={2} relaxed divided>
        <Grid.Column>
          <ReservationForm />
        </Grid.Column>
        <Grid.Column>
          <ReservationList />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Reservation;
