import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    const isAdmin = Roles.userIsInRole(
      this.userId,
      ['admin'],
      Roles.GLOBAL_GROUP
    );
    const query = isAdmin ? {} : { _id: this.userId };
    return Meteor.users.find(query, {
      fields: { lastname: 1, firstname: 1, emails: 1 }
    });
  });
}
