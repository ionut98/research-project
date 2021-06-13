import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';

import { Context } from '../context/context';

import logo from '../images/logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    height: 50,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loginButton: {
    position: 'absolute',
    top: '1vh',
    right: '1vh',
    color: '#fff'
  },
  scheduleButton: {
    position: 'absolute',
    right: 85,
    top: '1vh',
    color: '#fff',
    borderRight: '1px solid #fff',
    borderRadius: 0
  },
  queryButton: {
    position: 'absolute',
    right: 210,
    top: '1vh',
    color: '#fff',
    borderRight: '1px solid #fff',
    borderRadius: 0,
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    setIsLogged,
    setInterventionModalOpen,
    setQueryModalOpen,
  } = context;

  const handleLogout = () => setIsLogged(false);
  const handleIntervention = () => setInterventionModalOpen(true);
  const handleQuery = () => setQueryModalOpen(true);

  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <img src={logo} alt="logo" className={classes.logo}/>
        <Button color="inherit" className={classes.queryButton} onClick={handleQuery}>Query</Button>
        <Button color="inherit" className={classes.scheduleButton} onClick={handleIntervention}>Intervention</Button>
        <Button color="inherit" className={classes.loginButton} onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );

};

export default TopBar;
