import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import bulbImage from '../images/bulb.png'
import nameImage from '../images/name.png'
import sloganImage from '../images/slogan.png'

const useStyles = makeStyles({
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  alignBottom: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  leftSection: {
    marginTop: '4%',
    paddingRight: 30
  }
});

const LoginPage = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item container xs={7} className={classes.leftSection}>
        <Grid item xs={6} className={classes.centeredRight}>
          <img src={bulbImage} />
        </Grid>
        <Grid item xs={6} container>
          <Grid item xs={12} className={classes.alignBottom}>
            <img src={nameImage} height={'100vh'}/>
          </Grid>
          <Grid item xs={12}>
            <img src={sloganImage} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {/* <LoginForm /> */}
      </Grid>
    </Grid>
  )

};

export default LoginPage;
