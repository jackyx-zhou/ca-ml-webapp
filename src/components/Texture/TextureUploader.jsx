import { Button } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import MarginedContainer from "../MarginedContainer";

export default function TextureUploader(props) {
    const textureImage = props.textureImage;
    const setTextureImage = props.setTextureImage;
    const uploadedImage = props.uploadedImage;

    const handleFileUpload = event => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            setTextureImage(file);
            const reader = new FileReader();
            const {current} = uploadedImage;
            current.file = file;
            reader.onload = (e) => {
                current.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <MarginedContainer>
            <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileUpload}
                style={{display: 'None'}}
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </label>
            </MarginedContainer>
            <img alt="" style={{ maxWidth: '100%' }} ref={uploadedImage} src={process.env.PUBLIC_URL + '/example_pattern.jpg'}/>
        </>
    )
}