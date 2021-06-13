import React, { useContext } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Context } from '../context/context';

import PoleControl from './pole-control';
import InterventionCard from './intervention-card';
import QueryCard from './query-card';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#eee',
    height: '100vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    display: 'flex'
  },
  interventionsContainer: {
    marginTop: 5,
    height: '40vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    border: '2px solid #fff',
    marginBottom: 0
  },
  queriesContainer: {
    marginTop: 5,
    height: '40vh',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll',
    border: '2px solid #fff',
    marginBottom: 0
  },
  title: {
    paddingLeft: 5,
    paddingTop: 5,
    backgroundColor: theme.palette.primary.main,
    height: 30,
    width: '100%',
    color: '#fff',
    marginBottom: 0
  },
  interventionTitle: {
    backgroundColor: '#ff8f00',
  }
}));

const SideBarMenu = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    selectedPole,
    interventions,
    queries,
  } = context;

  return (
    <Grid item container xs={2} className={classes.container}>
      {
        selectedPole && <PoleControl />
      }
      <Grid item container xs={12} className={classes.interventionsContainer}>
        <Typography className={`${classes.title} ${classes.interventionTitle}`}>
          Interventions
        </Typography>
        {
          interventions.map((intervention, index) => <InterventionCard key={index} intervention={intervention} />)
        }
      </Grid>
      <Grid item container xs={12} className={classes.queriesContainer}>
        <Typography className={classes.title}>
          Queries
        </Typography>
        {
          queries.map((query, index) => <QueryCard key={index} query={query} />)
        }
      </Grid>
    </Grid>
  );

};

export default SideBarMenu;
