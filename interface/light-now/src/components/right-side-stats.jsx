import React, { useContext } from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import { Context } from '../context/context';
import FaultAlertCard from './fault-alert-card';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#ddd',
    height: '100vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
  },
  alertsContainer: {
    height: 190,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll'
  }
});

const RightSideStats = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    alerts,
  } = context;

  return (
    <Grid item container xs={2} className={classes.container}>
      <Grid container xs={12} className={classes.alertsContainer}>
        {
          alerts.map(alert => <FaultAlertCard alert={alert} />)
        }
      </Grid>
    </Grid>
  );

};

export default RightSideStats;
