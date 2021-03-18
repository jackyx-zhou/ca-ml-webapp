import React from "react";
import { Typography } from '@material-ui/core';
import MainTextBox from './MainTextBox';
import TwoColumnsGrid from './TwoColumnsGrid';

export default function Home() {
  const left = (
    <>
      <Typography variant='h4' gutterBottom>Cellular Automata</Typography>
      <MainTextBox>
        A cellular automaton is a collection of cells of a finite number of states (such as on
        and off) on a grid of specified shape that evolves through a number of discrete time steps
        according to a set of rules <em>based on the states of neighboring cells</em>.
        The rules are then applied iteratively for as many time steps as desired.<br /><br/>

        The concept was originally discovered in the 1940s by Stanislaw Ulam and John von Neumann.
        It was not until the 1970s and Conway's Game of Life, a two-dimensional cellular automaton,
        that interest in the subject expanded beyond academia.
        In the 1980s, Stephen Wolfram engaged in a systematic study of one-dimensional cellular automata,
        or what he calls elementary cellular automata;
        his research assistant Matthew Cook showed that one of these rules is Turing-complete.
        Wolfram published A New Kind of Science in 2002,
        claiming that cellular automata have applications in many fields of science.
      </MainTextBox>

      <img alt="" style={{ maxWidth: '100%' }} src='https://miro.medium.com/max/1024/1*pNLSLasaYXb9wgBPpGXZSw.gif' />
    </>
  )
  const right = (
    <>
      <Typography variant='h4' gutterBottom>Machine Learning</Typography>
      <MainTextBox>
        Machine learning is an application of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. <br/>
        <strong>
          <br />
          In this project, my main aim is to try and see if cellular automata of different scale (elementary/2-dimensional) and of different complexities (single/multi-channel) can be simulated and learned by various artificial neural networks architectures, thus exploring the relationships between these two kinds of self-evolving computational models.<br/>
          <br/>
        </strong>
        The project has been heavily inspired by the paper <a href="https://distill.pub/2020/growing-ca/">Growing Neural Cellular Automata</a> by researchers at Google and Allen Discovery Center. My ultimate aim is to try and create a simple texture synthesizer that can be trained and run with low hardware requirements using the model outlined in the Google paper.
      </MainTextBox>
      <img alt="" style={{ maxWidth: '80%' }} src="https://miro.medium.com/max/3000/1*n3TBO5i8hrYAujlhiHoE_w.gif" />
    </>
  )
  return <TwoColumnsGrid left={left} right={right} />;
}