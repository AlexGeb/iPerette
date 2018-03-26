import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import { Popup, Header } from 'semantic-ui-react';
import { Bookings } from '../../../api/bookings';
import moment from 'moment';
import pluralize from 'pluralize';

const propTypes = {
  classes: PropTypes.string,
  booking: PropTypes.object,
  day: momentObj
};

const defaultProps = {
  classes: '',
  day: null,
  booking: null
};

class Day extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, day, booking } = this.props;
    const theCell = (
      <td className={classes}>
        <span className="day-number">{day === null ? '' : day.date()}</span>
      </td>
    );

    if (booking) {
      return (
        <Popup trigger={theCell} on={['click', 'hover']} wide>
          <Header>{booking.user.fullname}</Header>
          <p>
            Du {booking.start} au {booking.end} ({pluralize(
              'jour',
              booking.numOfDays,
              true
            )})
          </p>
        </Popup>
      );
    }

    return theCell;
  }
}

Day.propTypes = propTypes;
Day.defaultProps = defaultProps;

export default withTracker(ownProps => {
  if (ownProps) {
    const { classes } = ownProps;
    if (classes && classes.indexOf('booking') !== -1) {
      const idLength = 17,
        start = ownProps.classes.indexOf('booking-') + 8;
      const booking_id = classes.substring(start, start + idLength);
      Meteor.subscribe('bookings');
      const booking = Bookings.findOne(
        { _id: booking_id },
        { fields: { start: 1, end: 1, booker: 1 } }
      );
      if (booking) {
        booking.numOfDays =
          moment(booking.end, 'DD/MM/YYYY').diff(
            moment(booking.start, 'DD/MM/YYYY'),
            'days'
          ) + 1;
        booking.user = booking.getBooker();
        return {
          booking
        };
      }
    }
  }
  return {};
})(Day);
