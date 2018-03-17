import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment';

export const Bookings = new Mongo.Collection('bookings');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookings', function bookingsPublication() {
    return Bookings.find();
  });
}
bookingOverlaped = ({ from, to }) => {
  let booking = undefined;
  Bookings.find({}, { fields: { start: 1, end: 1, name: 1 } })
    .fetch()
    .some(b => {
      const unvalid =
        moment(b.start, 'DD/MM/YYYY').isBetween(from, to, 'day', '[]') ||
        moment(b.end, 'DD/MM/YYYY').isBetween(from, to, 'day', '[]');
      if (unvalid) {
        booking = b;
      }
      return unvalid;
    });
  return booking;
};
Meteor.methods({
  'bookings.insert'({ start, end, nbOfGuest }) {
    check(start, Date);
    check(end, Date);
    check(nbOfGuest, Number);
    // Make sure the user is logged in before inserting a booking
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const from = moment(start);
    const to = moment(end);
    const booking = bookingOverlaped({ from, to });
    if (booking) {
      throw new Meteor.Error(
        'dates-already-taken',
        'dates déjà prises par ' + booking.name
      );
    } else {
    }
    const user = Meteor.users.findOne(this.userId);
    Bookings.insert({
      start: from.format('DD/MM/YYYY'),
      end: to.format('DD/MM/YYYY'),
      nbOfGuest,
      createdAt: moment().format(),
      booker: this.userId,
      color: user.color,
      emails: user.emails,
      name: `${user.firstname} ${user.lastname}`
    });
  },
  'bookings.cancel'(bookingId) {
    check(bookingId, String);
    const booking = Bookings.findOne(bookingId);
    const isAdmin = Roles.userIsInRole(
      this.userId,
      ['admin'],
      Roles.GLOBAL_GROUP
    );
    if (!isAdmin && booking.booker !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Bookings.remove(bookingId);
  }
});
