import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'LaPerette';
Accounts.emailTemplates.from = 'LaPerette <admin@laperette.com>';
Accounts.urls.enrollAccount = token => {
  return Meteor.absoluteUrl(`enroll-account/${token}`);
};
