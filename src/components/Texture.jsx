import React, { useState, useRef } from "react";
import { Typography } from "@material-ui/core";
import MainTextBox from './MainTextBox';
import TwoColumnsGrid from "./TwoColumnsGrid";
import TextureUploader from "./Texture/TextureUploader"
import TextureML from "./Texture/TextureML"

export default function Texture() {
  const [textureImage, setTextureImage] = useState(null);
  const uploadedImage = useRef(null);
  const left = (
    <>
      <Typography variant='h4' gutterBottom>Cellular Automata in Nature</Typography>
      <MainTextBox>
        <a href='https://link.springer.com/article/10.1007/BF02459572'>Partial Diffrential Equation</a> was suggested as a useful tool for modeling simple physical processes of reaction and diffusion by British mathematician Alan Turing. These simple reaction-diffusion processes regulated by cell-to-cell communication mechanisms like bioelectric signallings or chemical graidents, in turns, produce the beautiful patterns we see on animal skins, plants etc.<br/>
        <br/>
        You can upload a image file which ideally contains a pattern like the example giraffe pattern we have provided. Once you can see the image successfully uploaded with a preview showing, or if you prefer to just use the exmaple image we provided, you can go ahead and click "preprocess image" on the other panel for the machine learning model.
      </MainTextBox>
      <TextureUploader 
        textureImage={textureImage} 
        setTextureImage={setTextureImage}
        uploadedImage = {uploadedImage}
      />
    </>
  )

  const right = (
    <>
      <Typography variant='h4' gutterBottom>Texture Synthesis</Typography>
      <MainTextBox>
        <a href='https://distill.pub/2020/growing-ca/'>Neural Cellular Automata</a> is an cutting edge research field in machine learning that combines cellular automata and recurrent neural networks to simulate the natural dynamical systems with self-organising properties. Proposed by researchers at Google and Allen Discovery Center at Tufts University, the model can simulate the natural process of pattern formation and shows suprising "self-healing" properties.<br/>
        <br/>
        Below is an example implementation of an in-browser neural cellular automata networks. Due to the limitations of the javascript serverless architecture and Tensorflow.js, there are still some performance issues and training results have been sub-optimal.
      </MainTextBox>
      <TextureML 
        uploadedImage = {uploadedImage}
      />
    </>
  )
  return <TwoColumnsGrid left={left} right={right}/>;
}