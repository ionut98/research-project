import React from 'react';
import { SvgIcon, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  st0: {
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeMiterlimit: 10
  }
});

const TemperatureIcon = () => {
  const classes = useStyles();

  return (
    <SvgIcon style={{ marginRight: 10 }}>
      <svg
        version="1.1"
        id="Icons"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 32 32"
        style={{ enableBackground: `new 0 0 32 32` }}
        xmlSpace="preserve"
      >
        <path className={classes.st0} d="M19,17.81V6c0-1.66-1.34-3-3-3s-3,1.34-3,3v11.81c-1.79,1.04-3,2.97-3,5.19c0,3.31,2.69,6,6,6s6-2.69,6-6
        C22,20.78,20.79,18.85,19,17.81z"/>
        <circle className={classes.st0} cx="16" cy="23" r="3" />
        <line className={classes.st0} x1="16" y1="13" x2="16" y2="20" />
      </svg>
    </SvgIcon>
  );
};

export default TemperatureIcon;
