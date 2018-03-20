/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Bookings } from './bookings';
import { assert } from 'chai';
import { addUser } from '../startup/utils';

const john = {
  email: 'john.doe@mail.fr',
  firstname: 'John',
  lastname: 'Doe',
  password: 'password'
};
const peter = {
  email: 'peter.fox@mail.fr',
  firstname: 'Peter',
  lastname: 'Fox',
  password: 'password'
};
const admin = {
  email: 'admin@mail.fr',
  firstname: 'Admin',
  lastname: 'Admin',
  password: 'password'
};

if (Meteor.isServer) {
  describe('Bookings', () => {
    let johnId;
    let peterId;
    beforeEach(function() {
      Bookings.remove({});
      Meteor.users.remove({});
      johnId = addUser(john, { role: 'user' });
      peterId = addUser(peter, { role: 'user' });
    });
    describe('bookings.insert', () => {
      console.log(johnId, peterId);
      it('can insert a booking', () => {
        const insertedBooking =
          Meteor.server.method_handlers['bookings.insert'];
        const invocation = { johnId };
        const book = { start: new Date(), end: new Date(), nbOfGuest: 5 };
        insertedBooking.apply(invocation, [book]);
        assert.equal(Bookings.find().count(), 1);
      });
    });
    describe('bookings.cancel', () => {
      let bookingId;
      beforeEach(() => {
        const insertedBooking =
          Meteor.server.method_handlers['bookings.insert'];
        const invocation = { johnId };
        const book = { start: new Date(), end: new Date(), nbOfGuest: 5 };
        bookingId = insertedBooking.apply(invocation, [book]);
      });
      it('can delete own booking', () => {
        const cancelledBooking =
          Meteor.server.method_handlers['bookings.cancel'];
        const invocation = { johnId };
        const removed = cancelledBooking.apply(invocation, [bookingId]);
        assert.equal(Bookings.find().count(), 0);
        assert.equal(removed, 1);
      });
      it('cannot delete other booking', () => {
        const cancelledBooking =
          Meteor.server.method_handlers['bookings.cancel'];
        const invocation = { peterId };
        const removed = cancelledBooking.apply(invocation, [bookingId]);
        assert.equal(Bookings.find().count(), 0);
        assert.equal(removed, 1);
      });
    });
  });
}
