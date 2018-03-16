import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Email } from 'meteor/email';
import '../imports/api/bookings.js';
import '../imports/api/users.js';
import '../imports/startup/server';

Accounts.onCreateUser((options, user) => {
  const letters = 'ABCDE'.split('');
  let color = '#';
  for (var i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  user.color = color;
  return user;
});

Meteor.startup(() => {
  // code to run on server at startup
  const user1 = {
    email: 'alex.behaghel@gmail.com',
    firstname: 'Alexandre',
    lastname: 'Behaghel',
    password: 'password'
  };
  const user2 = {
    email: 'john.doe@mail.fr',
    firstname: 'John',
    lastname: 'Doe',
    password: 'password'
  };
  const alexId = addUser(user1, { role: 'admin' });
  addUser(user2, { role: 'user' });

  //Accounts.sendEnrollmentEmail(alexId);
});

const addUser = ({ email, firstname, lastname, password }, { role }) => {
  const user = Accounts.findUserByEmail(email);
  let userId;
  if (user) {
    userId = user._id;
  } else {
    userId = Accounts.createUser({ email, password });
  }
  Meteor.users.update(userId, {
    $set: {
      firstname,
      lastname
    }
  });
  Roles.addUsersToRoles(userId, role, Roles.GLOBAL_GROUP);
  return userId;
};
