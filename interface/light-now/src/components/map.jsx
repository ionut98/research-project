import React, { useContext, useState } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Brightness7, WbIncandescent, Opacity } from '@material-ui/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import PropTypes from 'prop-types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import TemperatureIcon from '../icons/temperature';
import LampOffIcon from '../icons/lamp-off.svg';
import LampOnIcon from '../icons/lamp-on.svg';
import { Context } from '../context/context';

let defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

const lampOffIcon = L.icon({
  iconUrl: LampOffIcon,
  iconSize: [25, 71],
  iconAnchor: [35, 60],
  popupAnchor: [-30, -64],
});

const lampOnIcon = L.icon({
  iconUrl: LampOnIcon,
  iconSize: [25, 71],
  iconAnchor: [35, 60],
  popupAnchor: [-30, -64],
});

L.Marker.prototype.options.icon = defaultIcon;

const useStyles = makeStyles({
  map: {
    width: '100%',
    height: '100vh'
  },
  popup: {
    width: '100%',
    textAlign: 'left'
  },
  popupStreetName: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sensorParamName: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    width: '100%'
  },
  sensorParamValue: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: 0,
  },
  sensorParamIcon: {
    marginRight: 10
  },
  sensorParamRow: {
    padding: 0,
    margin: 0,
  }
});

const AddPole = ({ handlePlaceMarker }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      handlePlaceMarker(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

AddPole.propTypes = {
  handlePlaceMarker: PropTypes.func,
};

const PolesMap = () => {
  const classes = useStyles();
  const context = useContext(Context);
  const {
    selectedPole,
    setSelectedPole,
    poles
  } = context;

  const position = [45.439963, 28.052339]; //Galati center

  // const addNewPolePosition = position => {
  //   setPolesPositions([...polesPositions, position]);
  // };

  // React.useEffect(() => {
  //   console.log(poles);
  // }, [polesPositions]);

  return (
    <Grid container item xs={8}>
      <MapContainer
        className={classes.map} 
        center={position} 
        zoom={16}
        maxZoom={16}
        dragging={true}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {
          poles.length && poles.map((pole, index) => (
            <Marker key={index} position={pole.position} icon={lampOffIcon}>
              <Popup onOpen={() => setSelectedPole(pole)} onClose={() => setSelectedPole(null)}>
                <Grid container className={classes.popup}>
                  <Grid item xs={12} className={classes.popupStreetName}>
                    {/* StreetName + Index */}
                    <Typography variant={'h6'}>
                      {pole.streetId}
                    </Typography>
                  </Grid>
                  
                  <Grid item container xs={12} className={classes.sensorParamRow}>
                    <Grid item xs={10}>
                      <Typography className={classes.sensorParamName}>
                        <Brightness7 className={classes.sensorParamIcon}/>
                        Sunlight:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography className={classes.sensorParamValue}>
                        {pole.sunLight + '%'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container xs={12} className={classes.sensorParamRow}>
                    <Grid item xs={10}>
                      <Typography className={classes.sensorParamName}>
                        <WbIncandescent className={classes.sensorParamIcon}/>
                        Light Intensity:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography className={classes.sensorParamValue}>
                        {pole.lightIntensity + '%'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container xs={12} className={classes.sensorParamRow}>
                    <Grid item xs={10}>
                      <Typography className={classes.sensorParamName}>
                        <TemperatureIcon />
                        Temperature:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography className={classes.sensorParamValue}>
                        {pole.temperature + '°C'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container xs={12} className={classes.sensorParamRow}>
                    <Grid item xs={10}>
                      <Typography className={classes.sensorParamName}>
                        <Opacity className={classes.sensorParamIcon}/>
                        Humidity:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography className={classes.sensorParamValue}>
                        {pole.humidity + 'mmHg'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Popup>
            </Marker> 
          ))
        }
      </MapContainer>
    </Grid> 
  );

};

export default PolesMap;
