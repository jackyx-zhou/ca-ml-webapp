import React from "react";
import { Box, Typography } from '@material-ui/core';

export default function MainTextBox(props) {
    return (
        <Typography component={'span'} variant='body1' paragraph>
            <Box fontWeight="fontWeightMedium" textAlign="left" px="5%" py="1%">
                {props.children}
            </Box>
        </Typography>
    );
}