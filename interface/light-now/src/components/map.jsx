import React, { useState } from 'react';
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
    height: '93vh'
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
  const [polesPositions, setPolesPositions] = React.useState([
    // eroilor
    [45.43971842927667, 28.049074465226806],
    [45.43977112516494, 28.049460424988602],
    [45.43982382100397, 28.049889269168368],
    [45.43986898882683, 28.050382439975085],
    [45.439921684574465, 28.050897052990763],
    [45.43996685231898, 28.05130445496152],
    [45.44002707592208, 28.051786904663746],
    [45.44006471564139, 28.052515939769357],
    [45.44014752293547, 28.052955505053603],
    [45.44021527426751, 28.05343795475579],
    [45.44024538594451, 28.053984731085006],
    [45.4402905534299, 28.054606555145646],
    [45.440365832491835, 28.05508900484788],
    [45.440493806666666, 28.05565722338602],
    [45.44056155758289, 28.056214720819714],
    // universitatii
    [45.438378431581036, 28.055215538916418],
    [45.43858921984464, 28.054593031532654],
    [45.43902585017138, 28.054582298646718],
    [45.43930438844223, 28.052714776495357],
    [45.439274276263006, 28.053541208711774],
    [45.439266748215715, 28.05436764092816],
    [45.439221579910736, 28.055237004688298],
    [45.439183939628975, 28.05608490267656],
    [45.43913877125772, 28.05693280066482],
    [45.439176411569626, 28.057651904021924],
    // ariesului
    [45.43860427611904, 28.05032136723278],
    [45.43862686052312, 28.05080434709952],
    [45.43868708555649, 28.051405388711434],
    [45.438762366757786, 28.052092293410]
  ]);

  const position = [45.439963, 28.052339]; //Galati center

  const addNewPolePosition = position => {
    setPolesPositions([...polesPositions, position]);
  };

  React.useEffect(() => {
    console.log(polesPositions);
  }, [polesPositions]);

  return (
    <Grid container item xs={8}>
      <MapContainer
        className={classes.map} 
        center={position} 
        zoom={17}
        dragging={true}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {
          polesPositions.map((pole, index) => (
            <Marker key={index} position={pole} icon={lampOnIcon}>
              <Popup>
                <Grid container className={classes.popup}>
                  <Grid item xs={12} className={classes.popupStreetName}>
                    {/* StreetName + Index */}
                    <Typography variant={'h6'}>
                      NUME_STRADA {index + 1}
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
                        {`${20}%`}
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
                        {`${25}%`}
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
                        {`${20}°C`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container xs={12} className={classes.sensorParamRow}>
                    <Grid item xs={10}>
                      <Typography className={classes.sensorParamName}>
                        {/* <Opacity className={classes.sensorParamIcon}/>
                         */}
                        Humidity:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography className={classes.sensorParamValue}>
                        {`${740}mmHg`}
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
