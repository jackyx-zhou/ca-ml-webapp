import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, TextField } from '@material-ui/core';
import ElemCARuleButton from './ElemCARuleButton';

const useStyles = makeStyles({
    buttonWrapper: {
        maxWidth: '100%',
        marginBottom: 20,
    }
})

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

export default function ElemCARuleController() {
    const [ruleNum, setRuleNum] = useState(0);
    const [error, setError] = useState(false);
    const [toggles, setToggles] = useState([...Array(8).fill(false)])

    const classes = useStyles();

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

    const handleButtonClick = event => {
        const t = event.currentTarget;
        console.log(t);
        const newToggles = [...toggles];
        newToggles[parseInt(t.getAttribute('index'))] = !t.getAttribute('toggle');
        
        setToggles(newToggles);
        setRuleNum(togglesToNum(newToggles));
    }

    return (
        <>
        <Container className={classes.buttonWrapper}>
            {buttonIds.map((id, index) => (
                <ElemCARuleButton id={id}
                    key={index}
                    index={index}
                    onPic={'caButtons/' + id + 'on.png'}
                    offPic={'caButtons/' + id + 'off.png'}
                    toggle={toggles[index] ? 1 : undefined}
                    onClick={handleButtonClick}>
                </ElemCARuleButton>
            ))}
        </Container>
        <TextField
            error={error}
            id="rule-num-inpput"
            label="Rule Number"
            type="number"
            value={ruleNum}
            variant="outlined"
            onChange={handleRuleNumChange}
            helperText={error ? "Only number between 0 and 255 allowed!" : ""}
        />
        </>
    )
}