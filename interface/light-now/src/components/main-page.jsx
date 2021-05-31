import React from 'react';
import PolesMap from './map';
import { Grid } from '@material-ui/core';
import SideBarMenu from './side-bar-menu';
import RightSideStats from './right-side-stats';
import TopBar from './top-bar-menu';

const MainPage = () => {
  
  return (
    <>
      <TopBar />
      <Grid container>
        <SideBarMenu />
        <PolesMap />
        <RightSideStats />
      </Grid>
    </>
  );

};

export default MainPage;
