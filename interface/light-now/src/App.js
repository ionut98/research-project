import React from 'react';
import PolesMap from './components/map';
import { Grid } from '@material-ui/core';
import SideBarMenu from './components/side-bar-menu';
import RightSideStats from './components/right-side-stats';
import TopBar from './components/top-bar-menu';
import LoginPage from './components/login-page';

function App() {
  return (
    <>
      {/* <TopBar />
      <Grid container>
        <SideBarMenu />
        <PolesMap />
        <RightSideStats />
      </Grid> */}
      <LoginPage />
    </>
  );
}

export default App;
