import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  Calendar as Cal,
  CalendarControls,
  Day
} from '../../components/calendar';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import './calendrier.css';
import { Bookings } from '../../../api/bookings';
import { Portal, Segment, Header } from 'semantic-ui-react';
import pluralize from 'pluralize';

class Calendrier extends Component {
  constructor() {
    super();
    const today = moment();
    this.state = {
      year: today.year(),
      selectedDay: today
    };
  }
  onNextYear = () => {
    const { year } = this.state;
    this.setState({ year: year + 1 });
  };
  onPrevYear = () => {
    const { year } = this.state;
    this.setState({ year: year - 1 });
  };
  goToToday = () => {
    const today = moment();
    this.setState({
      selectedDay: today,
      year: today.year()
    });
  };

  render() {
    const { year, selectedDay } = this.state;
    const { styles, customClasses } = this.props;
    return (
      <div id="calendar">
        <style>{styles}</style>
        <CalendarControls
          year={year}
          onPrevYear={this.onPrevYear}
          onNextYear={this.onNextYear}
          showTodayButton={true}
          goToToday={this.goToToday}
        />
        <Cal
          year={year}
          forceFullWeeks={false}
          firstDayOfWeek={0}
          selectedDay={selectedDay}
          showWeekSeparators={true}
          customClasses={customClasses}
          selectRange={false}
          onPickRange={(date1, date2) => {
            console.log('picked range', date1, date2);
          }}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('bookings');
  let styles = ``;
  let customClasses = {};
  Bookings.find({}, { fields: { start: 1, end: 1, booker: 1 } }).forEach(b => {
    const className = `booking-${b._id}`;
    styles += `table.calendar td.${className} {
      background:${b.getBooker().color};
    }`;
    customClasses[className] = {
      start: moment(b.start, 'DD/MM/YYYY'),
      end: moment(b.end, 'DD/MM/YYYY')
    };
  });

  return {
    styles,
    customClasses
  };
})(Calendrier);
