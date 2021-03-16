import React, { useState, useRef } from 'react';
import { TextField, Button } from '@material-ui/core';
import MarginedContainer from '../MarginedContainer';
import ElemCARuleCell from './ElemCARuleCell';
import ElemCAp5 from './ElemCAp5'

const buttonIds = [...Array(8).keys()].reverse().map(x => {
    return x.toString(2).padStart(3, '0');
})

const numToToggles = (num) => {
    const numList = num.toString(2).padStart(8, '0').split('');
    return numList.map(x => !!parseInt(x));
}

const togglesToNum = (toggles) => {
    const t = [...toggles]
    return t.reverse().reduce((total, t, i) => {
        return total += t * 2 ** i;
    }, 0);
}

export default function ElemCARuleController(props) {
    const ruleNum = props.ruleNum;
    const setRuleNum = props.setRuleNum;
    const [error, setError] = useState(false);
    const [toggles, setToggles] = useState([...Array(8).fill(false)])
    const elemP5Parent = useRef(null);
    const [canvas, setCanvas] = useState(null);

    const handleRuleNumChange = event => {
        let input = event.target.value
        
        if (isNaN(input)) {
            setError(true);
        } else {
            input = parseInt(input)
            if (input < 0 || input > 255) setError(true);
            else {
                setError(false);
                setRuleNum(input);
                setToggles(numToToggles(input));
            }
        }
    }

    const handleCellClick = event => {
        const t = event.currentTarget;
        const newToggles = [...toggles];
        newToggles[parseInt(t.getAttribute('index'))] = !t.getAttribute('toggle');

        setToggles(newToggles);
        setRuleNum(togglesToNum(newToggles));
    }

    const handleRenderButtonClick = event => {
        if (canvas) canvas.remove();
        setCanvas(ElemCAp5(elemP5Parent.current, ruleNum));
    }

    return (
        <>
            <MarginedContainer>
                {buttonIds.map((id, index) => (
                    <ElemCARuleCell id={id}
                        key={index}
                        index={index}
                        toggle={toggles[index] ? 1 : undefined}
                        onClick={handleCellClick}>
                    </ElemCARuleCell>
                ))}
            </MarginedContainer>

            <MarginedContainer>
                <TextField
                    error={error}
                    id="rule-num-inpput"
                    label="Rule Number"
                    type="number"
                    value={ruleNum}
                    variant="outlined"
                    onChange={handleRuleNumChange}
                    helperText={error ? "Only number between 0 and 255 allowed!" : 
                                        "Suggestion: 30, 135, 193"}
                />
            </MarginedContainer>
            <MarginedContainer>
                <Button variant="contained" color="primary" onClick={handleRenderButtonClick}>
                    Visualise
                </Button>
            </MarginedContainer>
            <MarginedContainer ref={elemP5Parent}>
                <></>
            </MarginedContainer> 
        </>
    )
}