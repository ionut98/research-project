import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';

import { Context } from '../context/context';

import logo from '../images/logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    height: '7vh',
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    height: '7vh',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loginButton: {
    position: 'absolute',
    right: 0,
    top: '1vh',
    right: '1vh',
    color: '#fff'
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    setIsLogged
  } = context;

  const handleLogout = () => setIsLogged(false);

  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <img src={logo} alt="logo" className={classes.logo}/>
        <Button color="inherit" className={classes.loginButton} onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );

};

export default TopBar;
