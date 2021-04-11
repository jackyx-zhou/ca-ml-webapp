import React, { useEffect, useRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import MarginedContainer from '../MarginedContainer';
import GoLp5 from './GoLp5'

export default function GoLGridController(props) {
    const golp5 = props.golp5;
    const setGolp5 = props.setGolp5;
    const isp5Running = props.isp5Running;
    const setisp5Running = props.setisp5Running;
    const golP5Parent = useRef(null);

    useEffect(() => {
        setGolp5(g => g ? g : new GoLp5(golP5Parent.current));
    }, [])

    const handleResetButtonClick = event => {
        golp5.reset();
    }

    const handleInitialiseButtonClick = event => {
        golp5.gol.randomInitialise();
    }

    const handlePauseButtonClick = event => {
        golp5.isRunning = !golp5.isRunning;
        setisp5Running(golp5.isRunning);
    }

    const handleStepButtonClick = event => {
        if (isp5Running) {
            golp5.isRunning = false;
            setisp5Running(golp5.isRunning);
        }
        golp5.gol.computeNext();
    }

    return (
        <>
            <MarginedContainer ref={golP5Parent} />
            <MarginedContainer>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleResetButtonClick}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleInitialiseButtonClick}>
                            Random
                        </Button>
                    </Grid>           
                </Grid>
            </MarginedContainer>
            <MarginedContainer>                
                {
                    golp5 ? 
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                        <Button variant="contained" color="primary" onClick={handlePauseButtonClick}>
                            {isp5Running? "Pause" : "Run" }
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button variant="contained" color="primary" onClick={handleStepButtonClick}>
                            Step
                        </Button>
                        </Grid>           
                    </Grid> : null
                }
            </MarginedContainer>
        </>
    )
}