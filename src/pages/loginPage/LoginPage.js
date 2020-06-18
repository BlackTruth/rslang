/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import {
  Button, Form, Grid, Image,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import responseFromServer from '../../utils/responseFromServer';
import VectorMan from '../../assets/image/vector_man.png';
import { SchoolURL, coockieLifeCyrcle } from '../../default';
import { setCookie } from '../../utils/cookie';

import './LoginPage.scss';

const errorState = {
  email: {
    isChanged: false,
    isEmpty: false,
    isValid: false,
  },
  password: {
    isChanged: false,
    isEmpty: false,
    isValid: false,
  },
};

const userData = {
  email: '',
  password: '',
};

const notification = {
  msg: '',
  status: null,
};

const LoginForm = () => {
  const [isValid] = useState(errorState);
  const [isDisabled, setButtonBehaviour] = useState(true);
  const [data, setUserData] = useState(userData);
  const [userNotification, setUserNotification] = useState(notification);
  const [redirectToHome, setRedirect] = useState(false);

  useEffect(() => {
    const { email, password } = isValid;
    if (!email.isChanged && !password.isChanged) {
      if (data.email !== '' && data.password !== '') {
        setButtonBehaviour(false);
      }
    }
  }, [data.email, data.password, isValid]);

  const setEmail = (e) => {
    const userEmail = {
      ...data,
      email: e.target.value,
    };
    setUserData(userEmail);
  };

  const setPassword = (e) => {
    const userPassword = {
      ...data,
      password: e.target.value,
    };
    setUserData(userPassword);
  };

  const onSubmit = () => {
    const getUser = async () => {
      try {
        const getUserNotification = {
          msg: 'User get successfully',
          status: true,
        };
        const response = await responseFromServer(`${SchoolURL}/signin`, getUserNotification, 'POST', data);
        setUserNotification(response.notification);
        if (response.notification.status) {
          setCookie('auth', JSON.stringify(response.data), coockieLifeCyrcle);
          setRedirect(true);
        }
        setUserNotification(response.notification);
      } catch (error) {
        const userAuthMsg = {
          msg: 'Incorrect e-mail or password',
          status: false,
        };
        setUserNotification(userAuthMsg);
        throw new Error('invalid request');
      }
    };
    getUser();
  };
  return (
    <Grid className="login-wrapper">
      {redirectToHome ? <Redirect to="/" /> : null}
      { userNotification.status !== null ? (
        <div className={userNotification.status ? 'user-notification success' : 'user-notification error'}>
          {' '}
          {userNotification?.msg}
        </div>
      ) : null}
      <Grid.Column className="login-column">
        <div className="login-header">
          <Image src={VectorMan} />
          RS Lang
        </div>
        <Form method="POST" className="login-form large" onSubmit={onSubmit}>
          <div className="label">
            <span> Log-in to your account</span>
          </div>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={setEmail}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
            onChange={setPassword}
          />
          <div className="field">
            <div className="checkbox-wrapper">
              <input type="checkbox" id="login-checkbox" name="login-checkbox" />
              <label htmlFor="login-checkbox">
                <span />
                Rememeber me
              </label>
            </div>
            <div>
              <a href="/forgot">Forgot password?</a>
            </div>
          </div>

          <Button className="login-button" disabled={isDisabled}>
            Sign in
          </Button>
          <div className="field">
            <span className="login-signup">New here?</span>
            <a href="/signup" className="login-signup"> Sign up</a>
          </div>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
