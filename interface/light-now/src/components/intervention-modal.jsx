import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  makeStyles,
  Button,
  Typography,
  MenuItem,
  InputAdornment
} from '@material-ui/core';

import {
  AccountTree,
  Build,
  MyLocation,
  Timer,
} from '@material-ui/icons';

import { Context } from '../context/context';

const useStyles = makeStyles({
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  dialog: {
    width: 250
  }
});

const InterventionModal = () => {

  const classes = useStyles();
  const context = useContext(Context);
  const [intervention, setIntervention] = useState({
    timer: 60,
    level: 'pcu',
    target: ''
  });

  const {
    interventionModalOpen,
    setInterventionModalOpen,
    interventions,
    setInterventions,
    poles
  } = context;

  const handleAddIntervention = () => {
    setInterventions([
      intervention,
      ...interventions,
    ]);
    setInterventionModalOpen(false);
  };

  const handleChangeInterventionLevel = ev => {
    setIntervention({
      ...intervention,
      level: ev.target.value
    })
  };

  const handleChangeInterventionTarget = ev => {
    setIntervention({
      ...intervention,
      target: ev.target.value
    })
  };

  const handleChangeInterventionTimer = ev => {
    setIntervention({
      ...intervention,
      timer: ev.target.value
    })
  };

  useEffect(() => {
    if (!interventionModalOpen) {
      setTimeout(() => setIntervention({
        timer: 60,
        level: 'pcu',
        target: ''
      }), 500);
    }
  }, [interventionModalOpen])

  const handleCloseDialog = () => {
    setInterventionModalOpen(false);
  };

  const pcus = [{ streetId: 'Eroilor' }, { streetId: 'Universitatii' }, { streetId: 'Ariesului' }];

  return (
    <Dialog open={interventionModalOpen} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography className={classes.title}>
          <Build className={classes.icon} />
          New Intervention
        </Typography>
      </DialogTitle>
      <DialogContent  className={classes.dialog} >
        <Grid container spacing={1} className={classes.centered}>
          {/* timer */}
          <Grid item xs={6}>
            <Typography className={classes.centered}>
              <Timer className={classes.icon} />
              Timer
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={intervention.timer}
              type={'number'}
              InputProps={{
                  endAdornment: (<InputAdornment position="end">seconds</InputAdornment>)
                }}
              inputProps={{
                min: 10,
                max: 300
              }}
              onChange={handleChangeInterventionTimer}
            />
          </Grid>
          {/* level select */}
          <Grid item xs={6}>
            <Typography  className={classes.centered}>
              <AccountTree className={classes.icon} />
              Level
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              value={intervention.level}
              onChange={handleChangeInterventionLevel}
              fullWidth
            >
              <MenuItem value={'pcu'}>
                {'PCU'}
              </MenuItem>
              <MenuItem value={'pole'}>
                {'Pole'}
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <Typography  className={classes.centered}>
              <MyLocation className={classes.icon} />
              Target
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              value={intervention.target}
              onChange={handleChangeInterventionTarget}
              fullWidth
            >
              {
                (intervention.level === 'pcu' ? pcus : poles).map((el, index) => <MenuItem key={index} value={el.streetId}>{el.streetId}</MenuItem>)
              }
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button fullWidth variant={'outlined'} color={'primary'} onClick={handleAddIntervention}>Add</Button>
      </DialogActions>
    </Dialog>
  );
  
};

export default InterventionModal;
