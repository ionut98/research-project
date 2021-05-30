import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'leaflet/dist/leaflet.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#51A4FB',
    },
    secondary: {
      main: '#5cc4cf',
    },
    polesStatesColors: {
      ready: '#5cc4cf',
      evPresent: '#e6a835',
      charging: '#3e4095',
    },
  },
});


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
  , document.getElementById('root')
);
