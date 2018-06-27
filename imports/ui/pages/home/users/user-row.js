import React, { Component } from 'react';
import {
  Table,
  Header,
  Button,
  Popup,
  Grid,
  Icon,
  Checkbox
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Bookings } from '../../../../api/bookings';

class UserRow extends Component {
  state = { isOpen: false, isSelected: false };
  onCheckboxChange = () => {
    this.setState({ isSelected: !this.state.isSelected });
    this.props.onSelected(this.props.user._id, this.state.isSelected);
  };

  getTheRow = () => {
    const { user, bookings } = this.props;
    const { isSelected } = this.state;
    return (
      <Table.Row>
        {/*
        <Table.Cell collapsing>
          <Checkbox checked={isSelected} onChange={this.onCheckboxChange} />
        </Table.Cell>
        */}
        <Table.Cell>
          {user.firstname} {user.lastname}{' '}
          {Meteor.userId() === user._id && '(moi)'}
        </Table.Cell>
        <Table.Cell>
          {user.emails[0].address}{' '}
          {user.emails[0].verified ? (
            <Icon color="green" name="check circle" />
          ) : (
            <Icon color="red" name="remove circle" />
          )}
        </Table.Cell>
        <Table.Cell>{bookings.length}</Table.Cell>
        <Table.Cell>{moment(user.createdAt).calendar()}</Table.Cell>
      </Table.Row>
    );
  };

  sendEnrollment = () => {
    Meteor.call('users.sendEnrollmentEmail', this.props.user._id, function(
      err
    ) {
      if (err) {
        console.log('error sending email'); //, err);
      }
    });
    this.setState({ isOpen: false });
  };
  deleteUser = () => {
    Meteor.call('users.delete', this.props.user._id);
    this.setState({ isOpen: false });
  };
  render() {
    const theRow = this.getTheRow();
    return (
      <Popup
        wide
        trigger={theRow}
        on={['click']}
        open={this.state.isOpen}
        onClose={() => {
          this.setState({ isOpen: false });
        }}
        onOpen={() => {
          this.setState({ isOpen: true });
        }}
      >
        <Grid divided columns="equal" celled="internally">
          <Grid.Row>
            <Grid.Column>
              <Button
                color="blue"
                content="Envoyer à nouveau un mail d'invitation"
                fluid
                onClick={this.sendEnrollment}
              />
            </Grid.Column>
            <Grid.Column>
              <Button
                color="red"
                content="Supprimer cet utilisateur"
                fluid
                onClick={this.deleteUser}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Popup>
    );
  }
}

export default withTracker(({ user }) => {
  Meteor.subscribe('bookings');
  return {
    bookings: Bookings.find({ booker: user._id }).fetch()
  };
})(UserRow);
