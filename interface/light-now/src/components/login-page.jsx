import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

import bulbImage from '../images/bulb.png'
import nameImage from '../images/name.png'
import sloganImage from '../images/slogan.png'
import LoginForm from './login-form';

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
    paddingRight: 30,
  },
  loginForm: {
    display: 'flex',
    marginTop: '5%',
    justifyContent: 'center',
    paddingLeft: '15%',
    paddingRight: '4%'
  }
});

const LoginPage = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item container xs={7} className={classes.leftSection}>
        <Grid item xs={6} className={classes.centeredRight}>
          <Zoom delay={1500}>
            <img src={bulbImage} />
          </Zoom>
        </Grid>
        <Grid item xs={6} container>
          <Grid item xs={12} className={classes.alignBottom}>
            <Fade big>
              <img src={nameImage} height={'100vh'}/>
            </Fade>
          </Grid>
          <Grid item xs={12}>
            <Fade big delay={1000}>
              <img src={sloganImage} />
            </Fade>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={5} className={classes.loginForm}>
        <Fade top delay={2000}>
          <LoginForm />
        </Fade>
      </Grid>
    </Grid>
  )

};

export default LoginPage;
