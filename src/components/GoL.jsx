import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import TwoColumnsGrid from './TwoColumnsGrid';
import MainTextBox from './MainTextBox';
import GoLGridController from './GoL/GoLGridController';
import GoLML from './GoL/GoLML';

export default function GoL() {
  const [golp5, setGolp5] = useState(null);
  const [isp5Running, setisp5Running] = useState(false);

  const left = (
    <>
      <Typography variant='h4' gutterBottom>Conway's Game of Life</Typography>
      <MainTextBox>
        <a href='https://mathworld.wolfram.com/GameofLife.html'>Conway's Game of Life</a> is a two-dimensional cellular automaton, invented by John H. Conway and popularized in Martin Gardner's Scientific American column starting in October 1970.<br/>
        <b><em>RULES</em></b><br/>
        For a space that is populated:<br/>
        1. Each cell with one or no neighbors dies, as if by solitude.<br/>
        2. Each cell with four or more neighbors dies, as if by overpopulation.<br/>
        3. Each cell with two or three neighbors survives.<br/>
        For a space that is empty or unpopulated:<br/>
        Each cell with three neighbors becomes populated.<br/>
        <br/>
        Below is a simple demo you can play around with by clicking on each cell on the grid to populate or empty it. You can click run to let the game plays out till a stable state is reached, or you can click step to let it run one step at a time. Try making some of the listed patterns below and see how it evolves!
      </MainTextBox>
      <GoLGridController 
        golp5={golp5}
        setGolp5={setGolp5}
        isp5Running={isp5Running}
        setisp5Running={setisp5Running}
      />
      <img alt="" style={{ maxWidth: '60%' }} src='https://img.itch.zone/aW1nLzIxNTk1NTYucG5n/original/nS1Wxk.png' />
    </>
  )

  const right = (
    <>
      <Typography variant='h4' gutterBottom>Convolutional Neural Network</Typography>
      <MainTextBox>
        <a href='https://towardsdatascience.com/a-comprehensive-guide-to-convolutional-neural-networks-the-eli5-way-3bd2b1164a53'>Convolutional neural network</a>  applies a series of local convolutions via a trainable “kernel” to an input multichannel image. The same kernel is applied to all pixels in the image, and each convolutional layer consolidates information within a fixed local radius of each pixel in the input image depending on the kernel size.<br/>
        The primary analogy between cellular automata and traditional convolutional neural networks arises from (1) the locality of the dynamics, and (2) simultaneous temporal updating of all spatial points.
        The single-neighborhood rule operator in CA can, in this way, be implemented as a convolutional operator as part of a CNN, allowing it to be applied synchronously to all pixel neighborhoods in an input image.<br/>
        <br/>
        Below is an example implementation of an in-browser convolutional neural network. You can train it and then use it to predict the next step of the grid on the other panel.
      </MainTextBox>
      <img src={process.env.PUBLIC_URL + '/convolution.png'} style={{ maxWidth: '100%' }} alt="convolution diagram"/>
      <GoLML
        golp5={golp5}
        setisp5Running={setisp5Running}
      />
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}