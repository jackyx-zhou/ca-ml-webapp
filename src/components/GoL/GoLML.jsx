import React, { useState, useEffect, useRef } from "react";
import { Button, Grid } from "@material-ui/core";
import * as tfvis from "@tensorflow/tfjs-vis";

import MarginedContainer from '../MarginedContainer';
import GoLtfjs from "./GoLtfjs";
import GoLp5 from "./GoLp5";

export default function GoLML(props) {
  const golp5 = props.golp5;
  const setisp5Running = props.setisp5Running;

  const [goltfjs, setGoltfjs] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [golMLp5, setgolMLp5] = useState(null);
  const golMLp5Parent = useRef(null);

  const surface1 = { name: 'Model summary', tab: 'Game of Life' };
  const surface2 = { name: 'Hidden Layer Summary', tab: 'Game of Life' };
  // const surface3 = { name: 'Hidden Layer Summary Post Training', tab: 'Game of Life'}

  useEffect(() => {
    const gol = new GoLtfjs();
    setGoltfjs(gol);
    tfvis.show.modelSummary(surface1, gol.model);
  }, [])

  const handleVisorButtonClick = event => {
    tfvis.visor().open();
  }

  const handleShowDatasetClick = (event) => {
    console.log(goltfjs.trainXs);
  }

  const handleTrainModelButtonClick = event => {
    goltfjs.train();
    tfvis.visor().open();
    setIsTraining(true);
  }

  const handleStopTrainingButtonClick = event => {
    goltfjs.model.stopTraining = true;
    setIsTraining(false);
    tfvis.show.layer(surface2, goltfjs.model.getLayer(undefined, 2));
  }

  const handlePredictButtonClick = event => {
    golp5.isTraining = false;
    setisp5Running(false);
    let predImage = goltfjs.doPrediction(golp5.gol.grid);
    predImage = predImage.arraySync()
    if (golMLp5) golMLp5.p5.remove()
    setgolMLp5(new GoLp5(golMLp5Parent.current, predImage));
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
        <Button variant="contained" color="primary" onClick={handlePredictButtonClick}>
          Predict Next Step
        </Button>
      </MarginedContainer>
      <MarginedContainer ref={golMLp5Parent} />
    </>
  );
}