import React from 'react';
import PolesMap from './map';
import { Grid } from '@material-ui/core';
import SideBarMenu from './side-bar-menu';
import RightSideStats from './right-side-stats';
import TopBar from './top-bar-menu';
import InterventionModal from './intervention-modal';
import QueryModal from './query-modal';

const MainPage = () => {
  
  return (
    <>
      <TopBar />
      <Grid container>
        <SideBarMenu />
        <PolesMap />
        <RightSideStats />
        <InterventionModal />
        <QueryModal />
      </Grid>
    </>
  );

};

export default MainPage;
