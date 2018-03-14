import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Table, Header, Button, Confirm } from 'semantic-ui-react';
import { Bookings } from '../../../../api/bookings';
import moment from 'moment';
import './resa-list.css';

class ReservationList extends Component {
  state = { open: false, bookingId: null };

  formatDate(dateString) {
    return moment(dateString).format('DD/MM/YYYY');
  }
  handleAnnulation = bookingId => this.setState({ open: true, bookingId });
  handleConfirm = () => {
    Meteor.call('bookings.cancel', this.state.bookingId);
    this.setState({ open: false });
  };
  handleCancel = () => this.setState({ open: false });

  renderRows = () => {
    const { isAdmin } = this.props;
    return this.props.bookings.map(b => {
      return (
        <Table.Row key={b._id}>
          <Table.Cell>{this.formatDate(b.start)}</Table.Cell>
          <Table.Cell>{this.formatDate(b.end)}</Table.Cell>
          <Table.Cell>{b.nbOfGuest}</Table.Cell>
          <Table.Cell>{moment(b.createdAt).calendar()}</Table.Cell>
          {isAdmin && <Table.Cell>{b.name}</Table.Cell>}
          <Table.Cell>
            <Button color="red" onClick={() => this.handleAnnulation(b._id)}>
              Annuler
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
  };
  render() {
    const { isAdmin } = this.props;
    return (
      <div>
        <Header as="h1">
          {isAdmin ? 'Gestion des réservations' : 'Mes réservations'}
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Début</Table.HeaderCell>
              <Table.HeaderCell>Fin</Table.HeaderCell>
              <Table.HeaderCell>Nombre d'invités</Table.HeaderCell>
              <Table.HeaderCell>Date de création</Table.HeaderCell>
              {isAdmin && <Table.HeaderCell>Owner</Table.HeaderCell>}
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderRows()}</Table.Body>
          <Confirm
            className="confirm-modal"
            open={this.state.open}
            cancelButton="Finalement, non."
            confirmButton="J'annule la résa"
            content="Attention, cette action est irréversible"
            header="Annulation de la réservation"
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
          />
        </Table>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('bookings');
  const isAdmin = Roles.userIsInRole(
    Meteor.userId(),
    ['admin'],
    Roles.GLOBAL_GROUP
  );
  const query = isAdmin ? {} : { booker: Meteor.userId() };
  return {
    isAdmin,
    bookings: Bookings.find(query, { sort: { createdAt: -1 } })
      .fetch()
      .map(b => {
        b.start = moment(b.start, 'DD/MM/YYYY');
        b.end = moment(b.end, 'DD/MM/YYYY');
        return b;
      })
  };
})(ReservationList);
