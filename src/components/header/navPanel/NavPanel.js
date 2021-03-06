/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon, Menu, Transition } from 'semantic-ui-react';
import { getCookie } from '../../../utils/cookie';

import Logo from '../../../assets/image/icon/reload.png';

import './navPanel.scss';

const getActiveElement = (pathname) => {
  const activeEl = pathname.split('/')[1];
  return activeEl === '' ? 'home' : activeEl;
};

const NavPanel = ({ getLocation }) => {
  const [activeItem, setActiveItem] = useState({ link: getActiveElement(getLocation?.pathname) });
  const [menuSize, setMenuSize] = useState({ size: 'min' });
  const [isVisible, setVisible] = useState(false);
  const handleItemClick = (e) => {
    const activeLink = e.currentTarget.getAttribute('name');
    setActiveItem({ link: activeLink });
  };

  const isMenuFullSize = () => menuSize.size === 'max';

  const changeMenuSize = (e) => {
    e.preventDefault();
    const size = menuSize.size === 'max' ? 'min' : 'max';
    setMenuSize({ size });
    setVisible(!isVisible);
  };

  const isUserAuth = () => {
    const auth = getCookie('auth');
    if (auth) {
      return (JSON.parse(auth))?.message === 'Authenticated';
    }
    return false;
  };

  useEffect(() => {
    const logoClickHandler = () => {
      const isMobileDevice = window.innerWidth <= 767;

      if (isMobileDevice) {
        document.querySelector('.vertical.menu').classList.toggle('opened');
      }
    };

    document.querySelector('.logo-wrapper').addEventListener('click', logoClickHandler);

    return () => document.querySelector('.logo-wrapper').removeEventListener('click', logoClickHandler);
  }, []);

  return (
    <div className="vertical menu">
      <Menu className={`app-menu  ${menuSize.size}`} icon="labeled" vertical>
        <div className="logo-wrapper">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="app-link">
          <Link
            className={activeItem.link === 'home' ? 'item active' : 'item'}
            name="home"
            to="/"
            onClick={handleItemClick}
          >
            <Icon name="home" />
            {isMenuFullSize() ? (
              <Transition
                visible={isVisible}
                animation="scale"
                duration={3500}
              >
                <p>Home</p>
              </Transition>
            ) : null}
          </Link>
          <Link
            className={activeItem.link === 'dictionary' ? 'item active' : 'item'}
            name="dictionary"
            to="/dictionary"
            onClick={handleItemClick}
          >
            <Icon name="graduation cap" />
            {isMenuFullSize() ? <p>Learn</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'statistic' ? 'item active' : 'item'}
            name="statistic"
            to="/statistic"
            onClick={handleItemClick}
          >
            <Icon name="area chart" />
            {isMenuFullSize() ? <p>Chart</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'about' ? 'item active' : 'item'}
            name="about"
            to="/about"
            onClick={handleItemClick}
          >
            <Icon name="users" />
            {isMenuFullSize() ? <p>About</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'settings' ? 'item active' : 'item'}
            name="settings"
            to="/settings"
            onClick={handleItemClick}
          >
            <Icon name="cogs" />
            {isMenuFullSize() ? <p>Settings</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'promo' ? 'item active' : 'item'}
            name="promo"
            to="/promo"
            onClick={handleItemClick}
          >
            <Icon name="caret square right outline" />
            {isMenuFullSize() ? <p>Promo</p> : null}
          </Link>
          <Link
            className={activeItem.link === 'games' ? 'item active' : 'item'}
            name="games"
            to="/games"
            onClick={handleItemClick}
          >
            <Icon name="game" />
            {isMenuFullSize() ? <p>Games</p> : null}
          </Link>

        </div>

        <div className="app-menu__resize">
          <Link
            className={activeItem.link === 'size' ? 'item active' : 'item'}
            name="size"
            onClick={changeMenuSize}
            to="/"
          >
            <Icon name={isMenuFullSize() ? 'angle double left' : 'angle double right'} />
            {isMenuFullSize() ? <p>Less</p> : null}
          </Link>
        </div>
        <div className="login">
          <Link
            className={activeItem.link === 'login' ? 'item active' : 'item'}
            onClick={handleItemClick}
            name={isUserAuth() ? 'logout' : 'login'}
            to={isUserAuth() ? '/logout' : '/signin'}
          >
            <Icon name={isUserAuth() ? 'sign out' : 'sign in'} />
          </Link>
        </div>
      </Menu>

    </div>
  );
};

NavPanel.propTypes = {
  getLocation: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

NavPanel.defaultProps = {
  getLocation: {
    pathname: '',
  },
};

export default NavPanel;
