import React, { useState } from 'react';
import TwoColumnsGrid from './TwoColumnsGrid';
import GoLGridController from './GoL/GoLGridController';
import GoLML from './GoL/GoLML';

export default function GoL() {
  const [golp5, setGolp5] = useState(null);
  const [isp5Running, setisp5Running] = useState(false);

  const left = (
    <>
      <GoLGridController 
        golp5={golp5}
        setGolp5={setGolp5}
        isp5Running={isp5Running}
        setisp5Running={setisp5Running}
      />
    </>
  )

  const right = (
    <>
      <GoLML
        golp5={golp5}
        setisp5Running={setisp5Running}
      />
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}