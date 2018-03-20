import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { addUser } from '../startup/utils';
import './users';

if (Meteor.isServer) {
  describe('Meteor.users', () => {
    describe('users.insert', () => {
      let userId;
      beforeEach(function() {
        Meteor.users.remove({});
        userId = addUser(
          {
            email: 'admin@mail.fr',
            firstname: 'Admin',
            lastname: 'Admin',
            password: 'password'
          },
          { role: 'admin' }
        );
      });

      it('can insert a user', function() {
        const beforeInvocCount = Meteor.users.find().count();
        const insertedUser = Meteor.server.method_handlers['users.insert'];
        const invocation = { userId };
        const user = {
          email: 'john.doe@mail.fr',
          firstname: 'John',
          lastname: 'Doe',
          password: 'password'
        };
        insertedUser.apply(invocation, [user]);
        assert.equal(Meteor.users.find().count(), beforeInvocCount + 1);
      });
    });
  });
}
