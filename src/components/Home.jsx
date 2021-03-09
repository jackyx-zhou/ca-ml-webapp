
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h1>Cellular Automata</h1>
            <img alt="" src='https://miro.medium.com/max/1024/1*pNLSLasaYXb9wgBPpGXZSw.gif'/>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h1>Machine Learning</h1>
            <img alt="" style={{maxWidth:'100%'}} src="https://miro.medium.com/max/3000/1*n3TBO5i8hrYAujlhiHoE_w.gif"/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;