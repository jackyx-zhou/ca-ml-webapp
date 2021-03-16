import React from "react";
import TwoColumnsGrid from './TwoColumnsGrid'

export default function Home() {
  const left = (
    <>
      <h1>Cellular Automata</h1>
      <img alt="" style={{ maxWidth: '100%' }} src='https://miro.medium.com/max/1024/1*pNLSLasaYXb9wgBPpGXZSw.gif' />
    </>
  )
  const right = (
    <>
      <h1>Machine Learning</h1>
      <img alt="" style={{ maxWidth: '100%' }} src="https://miro.medium.com/max/3000/1*n3TBO5i8hrYAujlhiHoE_w.gif" />
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}