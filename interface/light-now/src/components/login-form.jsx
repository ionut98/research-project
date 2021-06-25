import React, { useContext, useState } from 'react';
import axios from 'axios';

import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { Context } from '../context/context';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit">
      Light-Now
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const useStyles = makeStyles(theme => ({
  root: {
    height: '40vh',
    width: '100%'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#fff'
  },
}));

const usernameRegex = new RegExp('^[a-zA-Z][a-zA-Z0-9]{3,}$');
const passwordRegex = new RegExp('^[a-zA-Z0-9-.@$!]{6,}$');

const LoginForm = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const [credentials, setCredentials] = useState({
    username: {
      input: '',
      isValid: true,
    },
    password: {
      input: '',
      isValid: true,
    }
  });

  const [errorMessage, setErrorMessage] = useState('');

  const {
    setIsLogged,
  } = context;

  const isUsernameValid = username => {
    return usernameRegex.test(username) || username === '';
  }

  const isPasswordValid = password => {
    return passwordRegex.test(password) || password === '';
  };

  const isInputValid = (inputId, inputValue) => {
    if (inputId === 'username') {
      return isUsernameValid(inputValue);
    }

    return isPasswordValid(inputValue);
  }

  const handleCredentialsChange = ev => {
    setErrorMessage('');
    setCredentials({
      ...credentials,
      [ev.target.id]: {
        input: ev.target.value,
        isValid: isInputValid(ev.target.id, ev.target.value)
      }
    });
  };

  const validateCredentials = () => {
    return credentials.username.isValid && credentials.password.isValid;
  };
 
  const handleClick = async () => {
    if (credentials.username && credentials.password && validateCredentials()) {
      const result = await axios.post('http://localhost:30401/login', {
        username: credentials.username.input,
        password: credentials.password.input
      }).catch(error => {
        if (error.response.data) {
          const {
            msg
          } = error.response.data;
          setErrorMessage(msg);
        }  
      });

      if (result) {
        const {
          success,
          token
        } = result.data
  
        localStorage.setItem('token', token);
        setIsLogged(success);
      }
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User"
              name="user"
              onChange={handleCredentialsChange}
              autoComplete="user"
              autoFocus
              error={!credentials.username.isValid}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleCredentialsChange}
              error={!credentials.password.isValid}
            />
            { errorMessage !== '' &&
              <Box mt={2}>
                <Typography color="error" align="center">
                  { errorMessage }
                </Typography>
              </Box>
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleClick}
              disabled={credentials.username.input === '' || credentials.username.input === '' }
            >
              Sign In
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
