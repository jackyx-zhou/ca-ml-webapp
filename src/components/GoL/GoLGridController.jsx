import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import MarginedContainer from '../MarginedContainer';
import GoLp5 from './GoLp5'

export default function GoLGridController(props) {
    const golP5Parent = useRef(null);
    const [golp5, setGolp5] = useState(null);
    const [isp5Running, setisp5Running] = useState(true);

    useEffect(() => {
        setGolp5(g => g ? g : new GoLp5(golP5Parent.current));
    }, [])

    const handleResetButtonClick = event => {
        golp5.reset();
    }

    const handlePauseButtonClick = event => {
        golp5.isRunning = !golp5.isRunning;
        setisp5Running(golp5.isRunning);
    }

    return (
        <>
            <MarginedContainer ref={golP5Parent} />
            <MarginedContainer>
                <Button variant="contained" color="primary" onClick={handleResetButtonClick}>
                    Reset
                </Button>
                {
                    golp5 ? 
                    <Button variant="contained" color="primary" onClick={handlePauseButtonClick}>
                        {isp5Running? "Pause" : "Run" }
                    </Button> : null
                }
            </MarginedContainer>
        </>
    )
}