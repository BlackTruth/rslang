// eslint-disable-next-line linebreak-style
import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import History from '../../utils/history';
import Home from '../Home';
import NotFound from '../NotFound';
import LoginPage from '../loginPage/LoginPage';
import Logout from '../logoutPage/Logout';
import SignupPage from '../signupPage/SignupPage';
import Dictionary from '../Dictionary';
import Statistic from '../statistics/Statistic';
import Promo from '../promoPage/Promo';
import About from '../About';
import Settings from '../Settings';
import GamesPage from '../gamesPage/GamesPage';
import Header from '../../components/header/Header';
import GreetingWrapper from '../../components/greetingWrapper/GreetingWrapper';
import WordController from '../../utils/spacedRepetition/WordConrtoller';

import './App.scss';

const App = () => {
  const wordController = new WordController();
  wordController.init();
  return (
    <Router history={History}>
      <div className="app-wrapper">
        <Header />
        <div className="app-main">
          <GreetingWrapper />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/logout" component={Logout} />
            <Route path="/dictionary" component={Dictionary} />
            <Route path="/statistic" component={Statistic} />
            <Route path="/settings" component={Settings} />
            <Route path="/promo" component={Promo} />
            <Route path="/about" component={About} />
            <Route path="/games" component={GamesPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
