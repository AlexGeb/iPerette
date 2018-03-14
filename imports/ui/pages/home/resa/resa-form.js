import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Form, Message, Header } from 'semantic-ui-react';
import moment from 'moment';
import SelectDateRange from '../../../components/SelectDateRange';
import { Bookings } from '../../../../api/bookings';

class ReservationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nbOfGuest: '',
      to: undefined,
      from: undefined,
      emptyInputs: false,
      errorMsg: []
    };
  }
  areUnvalidDates = ({ from, to }) => {
    return this.props.bookings.some(b => {
      console.log(moment(b.start).isBetween(from, to, 'day', '()'));
      return (
        b.start.isBetween(from, to, 'day', '[]') ||
        b.end.isBetween(from, to, 'day', '[]')
      );
    });
  };

  handleRangeChange = ({ from, to }) => {
    this.setState({ from, to });
    const errorString =
      'Les dates sont déjà prises, référez-vous au calendrier';
    if (this.areUnvalidDates({ from, to })) {
      this.addErrorMsg(errorString);
    } else {
      this.removeErrorMsg(errorString);
    }
  };
  addErrorMsg(errorString) {
    const errorMsg = this.state.errorMsg;
    if (errorMsg.indexOf(errorString) < 0) {
      errorMsg.push(errorString);
    }
    this.setState({
      errorMsg
    });
  }
  removeErrorMsg(errorString) {
    const errorMsg = this.state.errorMsg;
    errorMsg.splice(errorMsg.indexOf(errorString), 1);
    this.setState({
      errorMsg
    });
  }
  handleNbOfGuestChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    const errorString =
      "Le nombre d'invités doit être un entier compris entre 1 et 20";
    if (!/^\+?[1-9]\d*$/.test(value) || Number(value) > 20) {
      this.addErrorMsg(errorString);
    } else {
      this.removeErrorMsg(errorString);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    let { from, to, nbOfGuest } = this.state;
    console.log('submitted : ', from, to);
    start = moment(from).toDate();
    end = moment(to).toDate();
    Meteor.call('bookings.insert', {
      start,
      end,
      nbOfGuest: Number(nbOfGuest)
    });
    this.setState({ emptyInputs: true, nbOfGuest: '' });
  };
  render() {
    const { nbOfGuest, errorMsg, to, from, emptyInputs } = this.state;
    const displayError = errorMsg.length > 0;
    const disabled = displayError || !nbOfGuest || !to || !from;
    return (
      <div>
        <Header as="h1">Nouvelle réservation</Header>
        <Form onSubmit={this.handleSubmit} error={displayError}>
          <Form.Field required>
            <label>Dates du séjour</label>
            <SelectDateRange
              handleRangeChange={this.handleRangeChange}
              emptyInputs={emptyInputs}
            />
          </Form.Field>
          <Form.Field inline>
            <Form.Input
              required
              label="Nombre d'invités"
              placeholder="entre 1 et 20"
              type="text"
              name="nbOfGuest"
              value={nbOfGuest}
              onChange={this.handleNbOfGuestChange}
            />
          </Form.Field>
          <Message error>
            <Message.Header>Attention</Message.Header>
            <Message.List items={errorMsg} />
          </Message>
          <Form.Button disabled={disabled} content="Réserver" />
        </Form>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('bookings');
  return {
    bookings: Bookings.find(
      {},
      {
        sort: { createdAt: -1 },
        fields: { start: 1, end: 1, name: 1 }
      }
    )
      .fetch()
      .map(b => {
        b.start = moment(b.start, 'DD/MM/YYYY');
        b.end = moment(b.end, 'DD/MM/YYYY');
        return b;
      })
  };
})(ReservationForm);
