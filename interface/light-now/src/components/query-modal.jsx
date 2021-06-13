import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  makeStyles,
  Button,
  Typography,
  MenuItem,
  InputAdornment
} from '@material-ui/core';

import {
  AllInbox,
  GroupWork,
  Settings,
  Timer,
  OfflineBolt,
  PlaylistPlay
} from '@material-ui/icons';

import { Context } from '../context/context';

const useStyles = makeStyles({
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  dialog: {
    width: 250
  }
});

const queryTypes = ['traffic-jam', 'biggest-consumption'];

const QueryModal = () => {

  const classes = useStyles();
  const context = useContext(Context);
  const [query, setQuery] = useState({
    queryType: 'traffic-jam',
    queryId: -1,
    processingType: 'native',
    timeFrame: 1000,
    nrOfTuples: -1
  });

  const [selectedMicroBatchCriteria, setSelectedMicroBatchCriteria] = useState('timeFrame');

  const {
    queries,
    setQueries,
    setQueryModalOpen,
    queryModalOpen
  } = context;

  const handleAddQuery = () => {
    setQueries([
      {
        ...query,
        queryId: queries.length + 1
      },
      ...queries,
    ]);
    setQueryModalOpen(false);
  };

  useEffect(() => {
    if (!queryModalOpen) {
      setTimeout(() => setQuery({
        queryType: 'traffic-jam',
        queryId: -1,
        processingType: 'native',
        timeFrame: 1000,
        nrOfTuples: -1
      }), 500);
    }
  }, [queryModalOpen])

  const handleCloseDialog = () => {
    setQueryModalOpen(false);
  };

  const handleChangeQueryType = ev => {
    setQuery({
      ...query,
      queryType: ev.target.value
    });
  };
  
  const handleChangeQueryProcessingType = ev => {
    setQuery({
      ...query,
      processingType: ev.target.value,
      nrOfTuples: ev.target.value === 'micro-batch' ? 10 : -1
    });
  };

  const handleChangeQueryTimeframe = ev => {
    setQuery({
      ...query,
      timeFrame: ev.target.value,
      nrOfTuples: -1
    });
  };

  const handleChangeQueryNrOfTuples = ev => {
    setQuery({
      ...query,
      timeFrame: -1,
      nrOfTuples: ev.target.value
    });
  };

  const handleChangeMicroBatchCriteria = ev => {
    setSelectedMicroBatchCriteria(ev.target.value);
  };

  return (
    <Dialog open={queryModalOpen} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography className={classes.title}>
          <OfflineBolt className={classes.icon} />
          New Query
        </Typography>
      </DialogTitle>
      <DialogContent  className={classes.dialog} >
        <Grid container spacing={1} className={classes.centered}>
          <Grid item xs={6}>
            <Typography className={classes.centered}>
              <Settings className={classes.icon} />
              Query Type
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              value={query.queryType}
              onChange={handleChangeQueryType}
              fullWidth
            >
              {
                queryTypes.map((q, index) => <MenuItem key={index} value={q}>{q}</MenuItem>)
              }
            </TextField>
          </Grid>
          {/* level select */}
          <Grid item xs={6}>
            <Typography  className={classes.centered}>
              <AllInbox className={classes.icon} />
              Proc. Type
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              value={query.processingType}
              onChange={handleChangeQueryProcessingType}
              fullWidth
            >
              <MenuItem value={'native'}>
                {'Native'}
              </MenuItem>
              <MenuItem value={'micro-batch'}>
                {'Micro-batch'}
              </MenuItem>
            </TextField>
          </Grid>
          {
            query.processingType === 'micro-batch' &&
            <>
              <Grid item xs={6}>
                <Typography className={classes.centered}>
                  <PlaylistPlay className={classes.icon} />
                  Criteria
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  value={selectedMicroBatchCriteria}
                  onChange={handleChangeMicroBatchCriteria}
                  fullWidth
                >
                  <MenuItem value={'timeFrame'}>
                    {'Timeframe'}
                  </MenuItem>
                  <MenuItem value={'nrOfTuples'}>
                    {'Nr Of Tuples'}
                  </MenuItem>
                </TextField>
              </Grid>
            </>
          }
          { (query.processingType === 'micro-batch' && selectedMicroBatchCriteria === 'nrOfTuples') &&
            <>
              <Grid item xs={6}>
                <Typography className={classes.centered}>
                  <GroupWork className={classes.icon} />
                  Nr of Tuples
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={query.nrOfTuples}
                  type={'number'}
                  InputProps={{
                    endAdornment: (<InputAdornment position="end">tuples</InputAdornment>)
                  }}
                  inputProps={{
                    min: 0,
                  }}
                  onChange={handleChangeQueryNrOfTuples}
                />
              </Grid>
            </>
          }
          {
            (query.processingType === 'native' || (query.processingType === 'micro-batch' && selectedMicroBatchCriteria === 'timeFrame')) &&
            <>
              <Grid item xs={6}>
                <Typography className={classes.centered}>
                  <Timer className={classes.icon} />
                  Timeframe
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={query.timeFrame}
                  type={'number'}
                  InputProps={{
                    endAdornment: (<InputAdornment position="end">ms</InputAdornment>)
                  }}
                  inputProps={{
                    min: 0,
                  }}
                  onChange={handleChangeQueryTimeframe}
                />
              </Grid>
            </>
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button fullWidth variant={'outlined'} color={'primary'} onClick={handleAddQuery}>Add</Button>
      </DialogActions>
    </Dialog>
  );
  
};

export default QueryModal;
