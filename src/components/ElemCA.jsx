import React, { useState } from "react";
import { Typography } from "@material-ui/core";

import TwoColumnsGrid from './TwoColumnsGrid';
// import MarginedContainer from './MarginedContainer';
import ElemCARuleController from './ElemCA/ElemCARuleController';
import ElemCAML from './ElemCA/ElemCAML';
import MainTextBox from "./MainTextBox";

export default function ElemCA() {
  const [ruleNum, setRuleNum] = useState(0);

  const left = (
    <>
      <Typography variant='h4' gutterBottom>Elementary CA</Typography>
      <MainTextBox>
        <a href='https://www.cantorsparadise.com/elementary-cellular-automaton-e27e3d1008d9'>Wolfram's elementary cellular automata</a> are one-dimensional, constructed with two possible values for each cell (0 or 1),
        and rules that depend only on itself and the nearest neighbor values.<br/>
        Below is a simple demo you can play around with different rule set by either clicking on individual rule cells or input the rule number directly. The top row in the grid is initialised with only the middle cell "on", and every row below is 1 timestep after evolving from its row above. 
      </MainTextBox>
      <ElemCARuleController ruleNum={ruleNum} setRuleNum={setRuleNum} />
    </>
  )
  const right = (
    <>
      <Typography variant='h4' gutterBottom>Multi-layer Perceptron</Typography>
      <MainTextBox>
        In this simple demo, we use a simple multilayer perceptron model to learn the CA update rule. Notice this problem is a non-linearly separable problem like the XOR problem, so if there's no hidden layer (hidden layer units slider set to 0), the single output perceptron would not be able to converge to a solution.<br/>
        You can play around and build models, change hyperparameters, and train the model to learn the CA rule you have specified on the CA side. Compare the visualisation result before and after the training is complete.
      </MainTextBox>
      <img alt="mlp model" style={{ maxWidth: '80%' }} src='https://ars.els-cdn.com/content/image/1-s2.0-S2405656118301020-gr1.jpg'></img>
      <ElemCAML ruleNum={ruleNum}/>
    </>
  )
  return <TwoColumnsGrid left={left} right={right} />;
}