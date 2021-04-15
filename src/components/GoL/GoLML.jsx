import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography, Slider, Input } from "@material-ui/core";
import * as tfvis from "@tensorflow/tfjs-vis";

import MarginedContainer from '../MarginedContainer';
import GoLtfjs from "./GoLtfjs";
import GoLp5 from "./GoLp5";

export default function GoLML(props) {
  const golp5 = props.golp5;
  const setisp5Running = props.setisp5Running;

  const [convLayerFilters, setConvLayerFilters] = useState(10);
  const [denseLayerUnits, setDenseLayerUnits] = useState(20);
  const [goltfjs, setGoltfjs] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [golMLp5, setgolMLp5] = useState(null);
  const golMLp5Parent = useRef(null);

  const surface1 = { name: 'Model summary', tab: 'Game of Life' };
  const surface2 = { name: 'Hidden Layer Summary', tab: 'Game of Life' };
  const surface3 = { name: 'Hidden Layer Summary Post Training', tab: 'Game of Life'}

  const handleVisorButtonClick = event => {
    tfvis.visor().open();
  }

  const handleConvSliderChange = (event, newValue) => {
    setConvLayerFilters(newValue);
  }

  const handleConvBlur = () => {
    if (convLayerFilters < 1) {
      setConvLayerFilters(10);
    } else if (convLayerFilters > 32) {
      setConvLayerFilters(10);
    }
  }
  
  const handleConvInputChange = event => {
    setConvLayerFilters(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleDenseBlur = () => {
    if (denseLayerUnits < 0) {
      setDenseLayerUnits(20);
    } else if (denseLayerUnits > 32) {
      setDenseLayerUnits(20);
    }
  };

  const handleDenseSliderChange = (event, newValue) => {
    setDenseLayerUnits(newValue);
  };

  const handleDenseInputChange = event => {
    setDenseLayerUnits(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBuildButtonClick = event => {
    const gol = new GoLtfjs(convLayerFilters, denseLayerUnits);
    setGoltfjs(gol);
    tfvis.show.modelSummary(surface1, gol.model);
    tfvis.show.layer(surface2, gol.model.getLayer(undefined, 2));
    tfvis.visor().open();
  }

  const handleTrainModelButtonClick = event => {
    goltfjs.train().then(() => {
      setIsTraining(false);
      tfvis.show.layer(surface3, goltfjs.model.getLayer(undefined, 2));
    });
    tfvis.visor().open();
    setIsTraining(true);
  }

  const handleStopTrainingButtonClick = event => {
    goltfjs.model.stopTraining = true;
    setIsTraining(false);
    tfvis.show.layer(surface3, goltfjs.model.getLayer(undefined, 2));
  }

  const handlePredictButtonClick = event => {
    golp5.isRunning = false;
    setisp5Running(false);
    
    let predImage = goltfjs.doPrediction(golp5.gol.grid);
    predImage = predImage.arraySync()
    golp5.gol.computeNext();
    const referenceGrid = golp5.gol.grid;
    if (golMLp5) golMLp5.p5.remove()
    setgolMLp5(new GoLp5(golMLp5Parent.current, predImage, referenceGrid));
  }

  return (
    <>
      <MarginedContainer>
        <Button variant="contained" color="secondary" onClick={handleVisorButtonClick}>
          Show tensorflow board
        </Button>
      </MarginedContainer>
      <MarginedContainer>
        <Typography variant="h6" gutterBottom>
          <b>Model Configuration</b>
        </Typography>
        <Grid container justify="center" alignItems="center">
          <Grid container item direction="column" justify="center" alignItems="center">
            <Grid container item justify="center" alignItems="center" spacing={3}>
              <Typography id="conv-filter-slider" gutterBottom>
                Number of Convolution Filters:
              </Typography>
              <Grid item>
                <Slider
                  value={typeof convLayerFilters === 'number' ? convLayerFilters : 10}
                  onChange={handleConvSliderChange}
                  aria-labelledby="conv-filter-slider"
                  style={{ width: 100 }}
                  min={1}
                  max={32}
                />
              </Grid>
              <Grid item>
                <Input
                  value={convLayerFilters}
                  margin="dense"
                  onChange={handleConvInputChange}
                  onBlur={handleConvBlur}
                  inputProps={{
                    min: 1,
                    max: 32,
                    type: 'number',
                    'aria-labelledby': 'conv-filter-slider',
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item justify="center" alignItems="center" spacing={3}>
              <Typography id="dense-unit-slider" gutterBottom>
                Number of Dense Layer Units :
              </Typography>
              <Grid item>
                <Slider
                  value={typeof denseLayerUnits === 'number' ? denseLayerUnits : 0}
                  onChange={handleDenseSliderChange}
                  aria-labelledby="dense-unit-slider"
                  style={{ width: 100 }}
                  min={0}
                  max={32}
                />
              </Grid>
              <Grid item>
                <Input
                  value={denseLayerUnits}
                  margin="dense"
                  onChange={handleDenseInputChange}
                  onBlur={handleDenseBlur}
                  inputProps={{
                    min: 0,
                    max: 32,
                    type: 'number',
                    'aria-labelledby': 'dense-unit-slider',
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleBuildButtonClick}>
                Build Model
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MarginedContainer>
      {
        goltfjs ?
        <MarginedContainer>
          <Grid container spacing={2} justify="center">
            <Grid item>
            <Button variant="contained" color="primary" onClick={handlePredictButtonClick}>
              Predict Next Step
            </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" 
                      onClick={handleTrainModelButtonClick}
                      disabled={isTraining}>
                Train Model
              </Button>
            </Grid>
            {
              isTraining ? 
              <Grid item>
                <Button variant="contained" color="secondary"
                  onClick={handleStopTrainingButtonClick}>
                  Stop training
                </Button>
              </Grid> : null
            }
          </Grid>
        </MarginedContainer> : null
      }
      <MarginedContainer ref={golMLp5Parent} />
      {golMLp5 ? 
        <>
          <span style={{color: 'green'}}><b>GREEN</b></span> cells indicate correct predictions<br/>
          <span style={{color: 'red'}}><b>RED</b></span> cells indicate wrong predictions.<br/>
        </> : null
      }
    </>
  );
}