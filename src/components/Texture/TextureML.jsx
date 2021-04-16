import React, { useEffect, useRef, useState } from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

import MarginedContainer from "../MarginedContainer";
import Texturetfjs from"./Texturetfjs";

export default function TextureML(props) {
    const uploadedImage = props.uploadedImage;
    const [targetImage, setTargetImage] = useState(null);
    const [texturetfjs, setTexturetfjs] = useState(null);
    
    const [isTraining, setIsTraining] = useState(false);
    const [epochNum, setEpochNum] = useState(null);
    const [loss, setLoss] = useState(null);

    const [trainingWorker, setTrainingWorker] = useState(null);
    // const [loggingWorker, setLoggingWorker] = useState(null);

    const canvas = useRef(null);

    const surface1 = { name: 'Model summary', tab: 'Texture Synth' };
    const handleRenderButtonClick = event => {
        if (uploadedImage.current.src) {
            // console.log(uploadedImage)
            let image = tf.browser.fromPixels(uploadedImage.current)
                            .resizeBilinear([64, 64]).toFloat()
                            .div(tf.scalar(255));
            setTargetImage(image);
            console.log(image);
            tf.browser.toPixels(image, canvas.current)

            const textureSynth = new Texturetfjs(image);
            setTexturetfjs(textureSynth);
            tfvis.show.modelSummary(surface1, textureSynth.model);
        }
    }

    const handleVisorButtonClick = event => {
        tfvis.visor().open();
    }

    const handleTrainButtonClick = event => {
        setIsTraining(true);
        texturetfjs.isTraining = true;
        setTrainingWorker(texturetfjs.train(canvas, setEpochNum, setLoss));
        // setLoggingWorker(setTimeout(() => {
        //     setEpochNum(texturetfjs.epochs)
        //     setLoss(texturetfjs.loss_log[texturetfjs.epochs])
        // }, 0))
    }

    const handleStopTrainingButtonClick = event => {
        texturetfjs.isTraining = false;
        setIsTraining(false);
        window.clearInterval(trainingWorker);
        setTrainingWorker(null);
        // window.clearInterval(loggingWorker);
        texturetfjs.visualiseResult(canvas);
    }

    return (
        <>
        <MarginedContainer>
        <Button variant="contained" color="secondary" onClick={handleVisorButtonClick}>
          Show tensorflow board
        </Button>
      </MarginedContainer>
        
        <MarginedContainer>
            <Button variant="contained" color="primary" onClick={handleRenderButtonClick}>
                Preprocess Image
            </Button>
        </MarginedContainer>

        {targetImage ?
            <MarginedContainer>
                <Grid container item justify="center" alignItems="center" spacing={3}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleTrainButtonClick}>
                            Train Model
                        </Button>
                    </Grid>
                    {
                        trainingWorker?
                        <Grid item>
                            <Button variant="contained" color="secondary"
                            onClick={handleStopTrainingButtonClick}>
                                Stop training
                            </Button>
                        </Grid> : null
                    }
                </Grid>
            </MarginedContainer> : null
        }
        <canvas ref={canvas}/>
        {
            epochNum ? 
            <Typography>
                Epoch: {epochNum}           Loss:{loss}
            </Typography> : null
        }
        </>
    );
}