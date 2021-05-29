import React from 'react';
import PolesMap from './components/map';
import { Grid } from '@material-ui/core';
import SideBarMenu from './components/side-bar-menu';
import RightSideStats from './components/right-side-stats';

function App() {
  return (
    <Grid container>
      <SideBarMenu />
      <PolesMap />
      <RightSideStats />
    </Grid>
  );
}

export default App;
