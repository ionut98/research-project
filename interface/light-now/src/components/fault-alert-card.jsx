import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  makeStyles,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { Clear, Warning } from '@material-ui/icons';
import { Context } from '../context/context';

const useStyles = makeStyles(theme => ({
  containerCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  root: {
    margin: 5,
    height: 80,
    border: '2px solid',
    backgroundColor: 'red',
    width: '100%',
    padding: 0,
    color: '#fff'
  },
  icon: {
    marginRight: 5
  },
  deleteIcon: {
    color: '#fff'
  }
}));

const FaultAlertCard = ({ alert }) => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    alerts,
    setAlerts
  } = context;

  const handleClose = () => {
    setAlerts(
      alerts.filter(al => al.target !== alert.target)
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container className={classes.containerCentered}>
          <Grid item xs={9}>
            <Typography className={classes.centered}>
              <Warning className={classes.icon}/>
              {alert.target}
            </Typography>
          </Grid>
          <Grid item xs={3} className={classes.centered}>
            <Button
              fullWidth
              className={classes.deleteIcon}
              variant={'text'}
              onClick={handleClose}
            >
              <Clear />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

};

export default FaultAlertCard;
