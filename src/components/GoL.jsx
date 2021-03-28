import React from 'react';
import TwoColumnsGrid from './TwoColumnsGrid';
import GoLGridController from './GoL/GoLGridController';
import GoLML from './GoL/GoLML';

export default function GoL() {
  const left = (
    <>
      <GoLGridController />
    </>
  )

  const right = (
    <>
      <GoLML />
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}