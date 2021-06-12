import React, { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  makeStyles,
  Grid,
  Button,
  Typography,
  Tooltip
} from '@material-ui/core';
import { Delete, MyLocation, Timer } from '@material-ui/icons';
import { Context } from '../context/context';
import Countdown from 'react-countdown';

const useStyles = makeStyles(theme => ({
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  root: {
    margin: 5,
    height: 80,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    width: '100%',
    padding: 0
  },
  icon: {
    marginRight: 5
  },
  deleteIcon: {
    color: 'red'
  }
}));

const InterventionCard = ({ intervention }) => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    setInterventions,
    interventions
  } = context;

  const handleDelete = () => {
    setInterventions(
      interventions.filter(interv => interv.target !== intervention.target)
    );
  };

  const handleTimerCompleted = () => {
    setInterventions(
      interventions.filter(interv => interv.target !== intervention.target)
    );
  };

  const truncate = name => name.length > 10 ? name.substring(0, 10) + '...' : name;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item container xs={9}>
            <Grid item xs={12} className={classes.title}>
              <Tooltip title={`${intervention.target}`}>
                <Typography className={classes.centered}>
                  <MyLocation className={classes.icon} />
                    {truncate(intervention.target)}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} className={classes.title}>
              <Typography className={classes.centered}>
                <Timer className={classes.icon}/>
                {/* {intervention.timer} */}
                <Countdown
                  date={Date.now() + (intervention.timer * 1000)}
                  onComplete={handleTimerCompleted}
                  renderer={props => <span>{props.minutes}:{props.seconds}</span>}
                />
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={3} className={classes.centered}>
            <Button
              fullWidth
              className={classes.deleteIcon}
              variant={'text'}
              onClick={handleDelete}
            >
              <Delete />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InterventionCard;
