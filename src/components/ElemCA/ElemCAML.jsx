
import React, { useState, useRef } from "react";
import { Button, Typography, Slider, Input, Grid } from "@material-ui/core";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as catf from "./ElemCAtfjs";

import MarginedContainer from '../MarginedContainer';
import ElemCAp5 from './ElemCAp5'

export default function ElemCAML(props) {
  const ruleNum = props.ruleNum;
  const [hiddenLayerUnits, setHiddenLayerUnits] = useState(0);
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const modelP5Parent = useRef(null);
  const [canvas, setCanvas] = useState(null);

  const surface1 = { name: 'Model summary', tab: '1D CA' };
  const surface2 = { name: 'Hidden Layer Summary', tab: '1D CA' };
  const surface3 = { name: 'Hidden Layer Summary Post Training', tab: '1D CA'}

  const handleVisorButtonClick = event => {
    tfvis.visor().open();
  }

  const handleBlur = () => {
    if (hiddenLayerUnits < 0) {
      setHiddenLayerUnits(0);
    } else if (hiddenLayerUnits > 32) {
      setHiddenLayerUnits(32);
    }
  };

  const handleSliderChange = (event, newValue) => {
    setHiddenLayerUnits(newValue);
  };

  const handleInputChange = event => {
    setHiddenLayerUnits(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBuildButtonClick = (event) => {
    let m = catf.getModel(hiddenLayerUnits);
    tfvis.show.modelSummary(surface1, m);
    tfvis.show.layer(surface2, m.getLayer(undefined, 1));
    tfvis.visor().open();
    setModel(m);
  };

  const handleTrainModelButtonClick = event => {
    catf.train(model, ruleNum).then(() => {
      setIsTraining(false);
      tfvis.show.layer(surface3, model.getLayer(undefined, 1));
    });
    tfvis.visor().open();
    setIsTraining(true);
  }

  const handleStopTrainingButtonClick = event => {
    model.stopTraining = true;
    setIsTraining(false);
    tfvis.show.layer(surface2, model.getLayer(undefined, 1));
  }

  const handleVisualiseModelButtonClick = (event) => {
    let predRule = catf.doPrediction(model).reverse().reduce((total, t, i) => {
      return total += t * 2 ** i;
    }, 0);
    console.log(predRule);
    if (canvas) canvas.remove();
    setCanvas(ElemCAp5(modelP5Parent.current, predRule));
  }
  return (
    <>
      <MarginedContainer>
        <Button variant="contained" color="secondary" onClick={handleVisorButtonClick}>
          Show tensorflow board
        </Button>
      </MarginedContainer>
      <MarginedContainer>
        <Typography id="hidden-unit-slider" gutterBottom>
          Units in hidden layer
        </Typography>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Slider
              value={typeof hiddenLayerUnits === 'number' ? hiddenLayerUnits : 0}
              onChange={handleSliderChange}
              aria-labelledby="hidden-unit-slider"
              style={{ width: 64 }}
              min={0}
              max={32}
            />
          </Grid>
          <Grid item>
            <Input
              value={hiddenLayerUnits}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                min: 0,
                max: 32,
                type: 'number',
                'aria-labelledby': 'hidden-unit-slider',
              }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleBuildButtonClick}>
              Build Model
            </Button>
          </Grid>
        </Grid>
      </MarginedContainer>
      {
        model ? 
        <MarginedContainer>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleVisualiseModelButtonClick}>
                  Visualise
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
      <MarginedContainer ref={modelP5Parent}>
        <></>
      </MarginedContainer>
    </>
  );
}