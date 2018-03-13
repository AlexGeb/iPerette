import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Segment, Message, Grid, Header } from 'semantic-ui-react';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Meteor } from 'meteor/meteor';

class ReservationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: moment(),
      end: moment()
    };
  }
  handleStartDateChange = start => {
    this.setState({
      start
    });
  };
  handleEndDateChange = end => {
    this.setState({
      end
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    let { start, end } = this.state;
    start = start.toDate();
    end = end.toDate();
    Meteor.call('bookings.insert', { start, end });
  };
  render() {
    return (
      <div>
        <Header as="h1">Nouvelle réservation</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Date de début</label>
            <DatePicker
              selected={this.state.start}
              onChange={this.handleStartDateChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Date de fin</label>
            <DatePicker
              selected={this.state.end}
              onChange={this.handleEndDateChange}
            />
          </Form.Field>
          <Form.Button content="Submit" />
        </Form>
      </div>
    );
  }
}

export default ReservationForm;
