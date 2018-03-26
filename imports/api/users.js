import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Bookings } from './bookings';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Meteor.users.find(
      {},
      {
        fields: {
          lastname: 1,
          firstname: 1,
          emails: 1,
          createdAt: 1,
          color: 1,
          fullname: 1
        }
      }
    );
  });
}
checkIfIsAdmin = currentUserId => {
  const isAdmin = Roles.userIsInRole(
    currentUserId,
    ['admin'],
    Roles.GLOBAL_GROUP
  );
  if (!isAdmin) {
    throw new Meteor.Error('not-authorized');
  }
};
Meteor.methods({
  'users.insert'({ firstname, lastname, email, password }) {
    check(firstname, String);
    check(lastname, String);
    check(email, String);
    checkIfIsAdmin(this.userId);
    if (!password) {
      password = 'àé§2803138°9°°32HS';
    }
    check(password, String);
    userId = Accounts.createUser({ email, password });
    Meteor.users.update(userId, {
      $set: {
        firstname,
        lastname
      }
    });
    Roles.addUsersToRoles(userId, 'user', Roles.GLOBAL_GROUP);
  },
  'users.sendEnrollmentEmail'(userId) {
    check(userId, String);
    checkIfIsAdmin(this.userId);
    try {
      Accounts.sendEnrollmentEmail(userId);
      return;
    } catch (e) {
      console.log('error trying to send enrollment email'); //, e);
      return e;
    }
  },
  'users.delete'(userId) {
    check(userId, String);
    checkIfIsAdmin(this.userId);
    Meteor.users.remove(userId);
    Bookings.remove({ booker: userId });
  }
});
