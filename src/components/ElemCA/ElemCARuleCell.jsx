import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    image: {
        position: 'relative',
        flexDirection: 'column',
        '&:hover': {
            zIndex: 1,
        },
    },
}));

export default function ElemCARuleCell(props) {
    const onPic = process.env.PUBLIC_URL + '/caButtons/' + props.id + 'on.png';
    const offPic = process.env.PUBLIC_URL + '/caButtons/' + props.id + 'off.png';
    const cellToggle = props.toggle;

    const classes = useStyles();
    return (
        <ButtonBase
            focusRipple
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            id={props.id}
            index={props.index}
            toggle={props.toggle ? 1 : undefined}
            onClick={props.onClick}
        >
            <img src={cellToggle ? onPic : offPic} alt={props.id + " state"}/>
            <br/>
            <Typography variant="button"> {cellToggle ? 1 : 0} </Typography>
        </ButtonBase>
    )
} 