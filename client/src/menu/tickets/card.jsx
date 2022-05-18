import React from "react";
import { MenuItem, TextField, Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from "@mui/material";
import { Document,Page } from "react-pdf";



export default function SpecialCard(props){

return (
        <Card >
        <CardActionArea >
                <Document file={props.file}>
            <Page height={300} pageNumber={1}/>
            </Document>
        </CardActionArea>
        <CardActions>
            <Button size="small" color="primary">
            OPEN
            </Button>
        </CardActions>
        </Card> 
)

}
