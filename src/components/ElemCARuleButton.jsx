import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    image: {
        position: 'relative',
        flexDirection: 'column',
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
}));

export default function ElemCARuleButton(props) {
    const onPic = props.onPic;
    const offPic = props.offPic;
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