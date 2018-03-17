import React from 'react';
import { Form, Segment, Message, Grid, Header } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

class Enroll extends React.Component {
  constructor(props) {
    super(props);
    this.token = this.props.match.params.token;
    Meteor.logout();
    this.state = {
      password: ''
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    Accounts.resetPassword(this.token, this.state.password, err => {
      if (err) {
        console.log('error'); //, err.reason);
      } else {
        console.log('ok enroll');
      }
      this.props.history.push('/login');
    });
  };

  handleChange = event => {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: target.value
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { password } = this.state;
    return (
      <div className="login-form">
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          {' '}
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Activez votre compte en définissant un nouveau mot de passe
            </Header>
            <Form size="large" noValidate onSubmit={this.handleSubmit}>
              <Segment raised>
                <Form.Input
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="mot de passe"
                  value={password}
                  onChange={this.handleChange}
                  autoComplete="current-password"
                />
                <Form.Button content="Submit" />
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Enroll;
