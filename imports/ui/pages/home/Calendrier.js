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
  renderStyles = () => {
    let styles = ``;
    let customClasses = {};
    this.props.bookings.forEach(b => {
      const className = `booking-${b._id}`;
      styles += `table.calendar td.${className} {
        background:${b.color};
      } 
      `;
      customClasses[className] = { start: b.start, end: b.end };
    });
    return { styles, customClasses };
  };
  onDayClicked = (day, classes, dayElementClicked) => {
    if (classes && classes.indexOf('booking') !== -1) {
      console.log('entered on booking element', day.format('DD/MM'));
      const clickedBooking = this.getBookingFromDate(day);
      this.setState({
        dayElementClicked,
        openPortal: true,
        clickedBooking,
        day
      });
      dayElementClicked.onmouseleave = () => {
        if (day.isSame(this.state.day)) {
          console.log('leaving booking element', day.format('DD/MM'));
          this.handleClose();
        }
      };
    }
  };

  handleClose = () => this.setState({ openPortal: false });

  getBookingFromDate = date => {
    return this.props.bookings.find(b =>
      date.isBetween(b.start, b.end, 'day', '[]')
    );
  };

  render() {
    const {
      year,
      selectedDay,
      openPortal,
      dayElementClicked,
      clickedBooking
    } = this.state;
    const { styles, customClasses } = this.renderStyles();
    let portalStyles = {};
    if (dayElementClicked) {
      const { top, left, height } = dayElementClicked.getBoundingClientRect();
      portalStyles = {
        top: top + height,
        left,
        position: 'absolute',
        zIndex: 1000
      };
    }
    const events = [
      {
        start: moment('20180607', 'YYYYMMDD'),
        end: moment('20180617', 'YYYYMMDD'),
        classe: 'event1'
      },
      {
        start: moment('20180625', 'YYYYMMDD'),
        end: moment('20180707', 'YYYYMMDD'),
        classe: 'event2'
      }
    ];
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
          onPickDate={this.onDayClicked}
          onHoveredDate={this.onDayClicked}
        />
        {clickedBooking && (
          <Portal open={openPortal} onClose={this.handleClose}>
            <Segment style={portalStyles}>
              <Header>{clickedBooking.name}</Header>
              <p>
                Du {clickedBooking.start.format('DD/MM/YYYY')} au{' '}
                {clickedBooking.end.format('DD/MM/YYYY')} ({pluralize(
                  'jour',
                  clickedBooking.end.diff(clickedBooking.start, 'days') + 1,
                  true
                )})
              </p>
            </Segment>
          </Portal>
        )}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('bookings');
  return {
    bookings: Bookings.find(
      {},
      { fields: { start: 1, end: 1, booker: 1, name: 1, color: 1 } }
    )
      .fetch()
      .map(b => {
        b.start = moment(b.start, 'DD/MM/YYYY');
        b.end = moment(b.end, 'DD/MM/YYYY');
        return b;
      })
  };
})(Calendrier);
