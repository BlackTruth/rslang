/* eslint-disable import/no-unresolved */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import History from '../utils/history';
import Home from './route/Home';
import NotFound from './route/NotFound';
import LoginPage from './route/LoginPage';
import Dictionary from './route/Dictionary';
import Statistic from './route/Statistic';
import Promo from './route/Promo';
import About from './route/about';
/* import AuthRoute from './authRoute'; */

import Header from './header/Header';

import './app.scss';

const App = () => (
  <Router history={History}>
    <Header />
    <Switch>
      <Route path="/signin" component={LoginPage} />
      <Route path="/dictionary" component={Dictionary} />
      <Route path="/statistic" component={Statistic} />
      <Route path="/promo" component={Promo} />
      <Route path="/about" component={About} />
      <Route exact path="/" component={Home} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
