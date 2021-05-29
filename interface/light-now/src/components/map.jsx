import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { MapContainer, TileLayer } from 'react-leaflet';

const useStyles = makeStyles({
  map: {
    width: '100%',
    height: '100vh'
  },
});

const PolesMap = () => {
  const classes = useStyles();

  const position = [45.958738, 24.768077]; //Romania center - POSITION; to be replaced with center of romania, eventually

  return (
    <Grid container xs={8}>
      <MapContainer
        className={classes.map} 
        center={position} 
        zoom={6} 
        dragging={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Grid> 
  );

};

export default PolesMap;
