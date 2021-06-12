import React, { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  makeStyles,
  Grid,
  Button,
  Typography,
  TextField,
  Slider,
  InputAdornment,
  MenuItem,
  Divider,
} from '@material-ui/core';
import { WbIncandescent, LocationOn } from '@material-ui/icons';
import { Context } from '../context/context';

const useStyles = makeStyles(theme => ({
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  root: {
    margin: 5,
    marginTop: 20,
    height: 340,
    border: '2px solid',
    borderColor: theme.palette.primary.main
  },
  title: {
    marginBottom: 10,
    backgroundColor: theme.palette.primary.main,
    color: '#fff'
  },
  slider: {
    marginTop: 5,
    marginBottom: 5,
  },
  lightIcon: {
    marginRight: 5
  },
  select: {
    marginTop: 10
  }
}));

const PoleControl = () => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    selectedPole: {
      streetId,
      lightIntensity,
      minLightIntensity,
      maxLightIntensity
    }
  } = context;

  const [configObject, setConfigObject] = useState({
    lightIntensity,
    minLightIntensity,
    maxLightIntensity,
    configLevel: 'Pole'
  });
  
  const handleChangeConfigLevel = ev => {
    console.log(ev.target.value);
  };

  return (
      <Card className={classes.root}>
        <CardContent>
          <Grid container>
            <Grid item xs={12} className={classes.title}>
              <Typography variant={'h6'} className={classes.centered}>
                <LocationOn className={classes.lightIcon}/>
                {streetId}
              </Typography>
            </Grid>
            <Grid item xs={9} className={classes.centered}>
              <Typography className={classes.centered}>
                <WbIncandescent className={classes.lightIcon}/>
                Light Intensity
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={configObject.lightIntensity}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">%</InputAdornment>),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={classes.slider}>
              <Slider
                defaultValue={configObject.lightIntensity}
                step={5}
                marks
                min={configObject.minLightIntensity}
                max={configObject.maxLightIntensity}
              />
            </Grid>
            <Grid item xs={7} className={classes.centered}>
              <Typography>
                Min Value
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                value={configObject.minLightIntensity}
                type={'number'}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">%</InputAdornment>)
                }}
                inputProps={{
                  min: 0,
                  max: configObject.maxLightIntensity
                }}
              fullWidth
              />
            </Grid>
            <Grid item xs={7} className={classes.centered}>
              <Typography>
                Max Value
              </Typography>
            </Grid>
            <Grid item xs={5} className={classes.centered}>
              <TextField
                value={configObject.maxLightIntensity}
                type={'number'}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">%</InputAdornment>)
                }}
                inputProps={{
                  min: configObject.minLightIntensity,
                  max: 100
                }}
              />
            </Grid>
            <Divider orientation={'horizontal'} variant={'fullWidth'}/>
            <Grid item xs={7} className={`${classes.centered} ${classes.select}`}>
              <Typography>
                Select level
              </Typography>
            </Grid>
            <Grid item xs={5} className={`${classes.centered} ${classes.select}`}>
              <TextField
                select
                value={configObject.configLevel}
                onChange={handleChangeConfigLevel}
                fullWidth
              >
                <MenuItem value={'Poles Command Unit'}>
                  {'PCU'}
                </MenuItem>
                <MenuItem value={'Pole'}>
                  {'Pole'}
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button fullWidth color={'primary'} variant={'outlined'}>UPDATE</Button>
        </CardActions>
      </Card>
  );
};

export default PoleControl;
