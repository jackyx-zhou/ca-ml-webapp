import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import MarginedContainer from '../MarginedContainer';
import GoLp5 from './GoLp5'

export default function GoLGridController(props) {
    const golP5Parent = useRef(null);
    const [golp5, setGolp5] = useState(null);

    useEffect(() => {
        setGolp5(g => g ? g : new GoLp5(golP5Parent.current));
    }, [])

    const handleResetButtonClick = event => {
        golp5.reset();
    }

    return (
        <>
            <MarginedContainer ref={golP5Parent} />
            <MarginedContainer>
                <Button variant="contained" color="primary" onClick={handleResetButtonClick}>
                    Reset
                </Button>
            </MarginedContainer>
        </>
    )
}