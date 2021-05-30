import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';

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

  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <img src={logo} alt="logo" className={classes.logo}/>
        <Button color="inherit" className={classes.loginButton}>Login</Button>
      </Toolbar>
    </AppBar>
  );

};

export default TopBar;
