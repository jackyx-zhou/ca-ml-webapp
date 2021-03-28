import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Slider, Input, Grid } from "@material-ui/core";
import * as tf from '@tensorflow/tfjs';
import * as tfvis from "@tensorflow/tfjs-vis";
// import * as catf from "./ElemCAtfjs";

import MarginedContainer from '../MarginedContainer';
import GoLtfjs from "./GoLtfjs";
// import ElemCAp5 from './ElemCAp5'

export default function GoLML(props) {
  const [goltfjs, setGoltfjs] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const surface1 = { name: 'Model summary', tab: 'Game of Life' };
  const surface2 = { name: 'Hidden Layer Summary', tab: 'Game of Life' };
  const surface3 = { name: 'Hidden Layer Summary Post Training', tab: 'Game of Life'}

  useEffect(() => {
    setGoltfjs(new GoLtfjs());
  }, [])

  const handleVisorButtonClick = event => {
    tfvis.visor().open();
  }

  const handleShowDatasetClick = (event) => {
    console.log(goltfjs.trainXs);
  }

  const handleTrainModelButtonClick = event => {
    // catf.train(model, ruleNum).then(() => {
    //   setIsTraining(false);
    //   tfvis.show.layer(surface3, model.getLayer(undefined, 1));
    // });
    // tfvis.visor().open();
    // setIsTraining(true);
  }

  const handleStopTrainingButtonClick = event => {
    // model.stopTraining = true;
    // setIsTraining(false);
    // tfvis.show.layer(surface2, model.getLayer(undefined, 1));
  }

  return (
    <>
      <MarginedContainer>
        <Button variant="contained" color="secondary" onClick={handleVisorButtonClick}>
          Show tensorflow board
        </Button>
      </MarginedContainer>

      <MarginedContainer>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleShowDatasetClick}>
                Generate training data
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
      </MarginedContainer>
      <MarginedContainer>
        {canvas}
      </MarginedContainer>
    </>
  );
}