import React, { useContext } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Context } from '../context/context';

import PoleControl from './pole-control';
import InterventionCard from './intervention-card';

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
  },
  interventionsContainer: {
    height: 220,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    'ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    overflowY: 'scroll'
  },
  title: {
    paddingLeft: 5,
    paddingTop: 5,
  }
});

const SideBarMenu = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    selectedPole,
    interventions
  } = context;

  return (
    <Grid item container xs={2} className={classes.container}>
      <Grid container xs={12} className={classes.interventionsContainer}>
        <Typography className={classes.title}>
          Interventions
        </Typography>
        {
          interventions.map(intervention => <InterventionCard intervention={intervention} />)
        }
      </Grid>
      {
        selectedPole && <PoleControl />
      }
    </Grid>
  );

};

export default SideBarMenu;
