
import React, { useState } from "react";
import { Button, Typography, Slider, Input, Grid } from "@material-ui/core";
import * as tfvis from "@tensorflow/tfjs-vis"
import * as catf from "./ElemCAtfjs";

import TwoColumnsGrid from './TwoColumnsGrid';
import MarginedContainer from './MarginedContainer';
import ElemCARuleController from './ElemCARuleController';

export default function ElemCA() {
  const [ruleNum, setRuleNum] = useState(0);
  const [hiddenLayerUnits, setHiddenLayerUnits] = useState(0);

  const handleVisorButtonClick = event => {
    console.log(event.currentTarget);
    const visor = tfvis.visor();
    tfvis.visor().el.style.position = "absolute";
    tfvis.visor().el.style.zIndex = 2000;
    if (visor) {
      tfvis.visor().open();
    }
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

  const handleInputChange = (event) => {
    setHiddenLayerUnits(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBuildButtonClick = (event) => {
    let model = catf.getModel(hiddenLayerUnits);
    console.log(catf.doPrediction(model));
  };

  const left = (
    <>
      <ElemCARuleController ruleNum={ruleNum} setRuleNum={setRuleNum} />
    </>
  )
  const right = (
    <>
      <MarginedContainer>
        <Button variant="contained" color="secondary" onClick={handleVisorButtonClick}>
          Show training progress
        </Button>
      </MarginedContainer>
      <MarginedContainer>
        <Typography id="hidden-unit-slider" gutterBottom>
          Units in hidden layer
        </Typography>
        <Grid container spacing={3} justify="center">
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
        </Grid>
      </MarginedContainer>
      <MarginedContainer>
        <Button variant="contained" color="primary" onClick={handleBuildButtonClick}>
          Build Model
        </Button>
      </MarginedContainer>
    </>
  )
  return <TwoColumnsGrid left={left} right={right} />;
}