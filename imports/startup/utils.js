import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export const addUser = ({ email, firstname, lastname, password }, { role }) => {
  const user = Accounts.findUserByEmail(email);
  let userId;
  if (user) {
    userId = user._id;
  } else {
    userId = Accounts.createUser({ email, password });
  }
  const fullname = `${firstname} ${lastname}`;
  Meteor.users.update(userId, {
    $set: {
      firstname,
      lastname,
      fullname
    }
  });
  Roles.addUsersToRoles(userId, role, Roles.GLOBAL_GROUP);
  return userId;
};
