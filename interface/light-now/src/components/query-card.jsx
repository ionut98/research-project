import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  makeStyles,
  Grid,
  Button,
  Typography,
  Tooltip
} from '@material-ui/core';
import { AllInbox, GroupWork, OfflineBolt, Stop, Timer } from '@material-ui/icons';
import { Context } from '../context/context';

const useStyles = makeStyles(theme => ({
  centered: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  root: {
    margin: 5,
    height: 100,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    width: '100%',
    padding: 0
  },
  icon: {
    marginRight: 5
  }
}));

const QueryCard = ({ query }) => {
  const classes = useStyles();
  const context = useContext(Context);

  const {
    setQueries,
    queries
  } = context;

  const handleStop = () => {
    setQueries(
      queries.filter(q => q.queryId !== query.queryId)
    );
  };

  const truncate = name => name.length > 10 ? name.substring(0, 10) + '...' : name;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item container xs={9}>
            <Grid item xs={12} className={classes.title}>
              <Tooltip title={`${query.queryType} ${query.queryId}`}>
                <Typography className={classes.centered}>
                  <OfflineBolt className={classes.icon} />
                  {truncate(`${query.queryType} ${query.queryId}`)}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} className={classes.title}>
              <Typography className={classes.centered}>
                <AllInbox className={classes.icon} />
                {query.processingType}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.title}>
              <Typography className={classes.centered}>
                {
                  query.timeFrame !== -1 ?
                    <>
                      <Timer className={classes.icon} />
                      {query.timeFrame} ms
                    </>
                    : <>
                      <GroupWork className={classes.icon} />
                      {query.nrOfTuples} tuples
                    </>
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={3} className={classes.centered}>
            <Button
              fullWidth
              variant={'text'}
              onClick={handleStop}
              color={'primary'}
            >
              <Stop />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

};

export default QueryCard;
