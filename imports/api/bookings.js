import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const Bookings = new Mongo.Collection('bookings');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookings', function bookingsPublication() {
    return Bookings.find();
  });
}

Meteor.methods({
  'bookings.insert'({ start, end }) {
    check(start, Date);
    check(end, Date);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.users.findOne(this.userId);
    Bookings.insert({
      start,
      end,
      createdAt: new Date(),
      booker: this.userId,
      color: user.color,
      emails: user.emails,
      name: `${user.firstname} ${user.lastname}`
    });
  }
});
