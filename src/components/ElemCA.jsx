
import React from "react";
import { Typography } from "@material-ui/core";
import TwoColumnsGrid from './TwoColumnsGrid';
import ElemCARuleController from './ElemCARuleController';


export default function Elem() {
  const left = (
    <>
      <ElemCARuleController />
    </>
  )
  const right = (
    <>
      <Typography variant="h3">Placeholder</Typography>
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}