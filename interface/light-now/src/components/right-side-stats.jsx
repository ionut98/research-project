import React, { useContext } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';

import { Context } from '../context/context';
import FaultAlertCard from './fault-alert-card';
import StatsCard from './stats-card';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#eee',
    height: '100vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    width: '100%'
  },
  alertsContainer: {
    height: '50vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    border: '2px solid #fff',
  },
  queryResultsContainer: {
    height: '50vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    border: '2px solid #fff',
  },
  title: {
    paddingLeft: 5,
    paddingtop: 5,
    height: 30,
    width: '100%',
    marginTop: 5,
    backgroundColor: '#c62828',
    color: '#fff'
  },
  statsTitle: {
    backgroundColor: '#2e7d32',
  }
});

const RightSideStats = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    alerts,
    queryResults
  } = context;

  return (
    <Grid item container xs={3} className={classes.container}>
      {
        queryResults.length ?
          <Grid item container xs={12} className={classes.queryResultsContainer}>
            <Typography className={`${classes.title} ${classes.statsTitle}`}>
              Query Results
            </Typography>
            {
              queryResults.map((queryResult, index) => <StatsCard key={index} data={queryResult} />)
            }
          </Grid>
          : null
      }
      {
        alerts.length ?
          <Grid item container xs={12} className={classes.alertsContainer}>
            <Typography className={classes.title}>
              Fault Alerts
            </Typography>
            {
              alerts.map((alert, index) => <FaultAlertCard key={index} alert={alert} />)
            }
          </Grid>
          : null
      }
    </Grid>
  );

};

export default RightSideStats;
