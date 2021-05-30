import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#ddd',
    height: '93vh',
  },
});

const SideBarMenu = () => {
  const classes = useStyles();

  return (
    <Grid item container xs={2} className={classes.container}>
    </Grid>
  );

};

export default SideBarMenu;
