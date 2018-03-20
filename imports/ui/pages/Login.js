import React from 'react';
import { Form, Segment, Message, Grid, Header, Icon } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      displayLoginError: false,
      isLoading: false,
      errorMsg: null
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    Meteor.loginWithPassword(email, password, err => {
      this.setState({ isLoading: false });
      if (err) {
        this.setState({ displayLoginError: true, errorMsg: err.reason });
      } else {
        this.props.history.push('/');
      }
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const {
      displayLoginError,
      errorMsg,
      email,
      password,
      isLoading
    } = this.state;
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
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="blue" textAlign="center">
              <Icon name="user" /> Connexion
            </Header>
            <Form
              size="large"
              noValidate
              onSubmit={this.handleSubmit}
              error={displayLoginError}
              loading={isLoading}
            >
              <Segment raised>
                <Form.Input
                  iconPosition="left"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="adresse-mail@gogol.cool"
                  value={email}
                  onChange={this.handleChange}
                  autoComplete="email"
                  icon={<Icon name="at" />}
                />
                <Form.Input
                  iconPosition="left"
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="mot de passe"
                  value={password}
                  onChange={this.handleChange}
                  autoComplete="current-password"
                  icon={<Icon name="key" />}
                />
                <Form.Button content="Submit" />
                <Message error header="Erreur" content={errorMsg} />
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
