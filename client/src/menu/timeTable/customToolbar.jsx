import { Button, Icon, IconButton } from "@mui/material";
import React from "react";
import { ChevronLeft } from "@mui/icons-material";
import { ChevronRight } from "@mui/icons-material";
import { Stack } from "@mui/system";

export default class CalendarToolbar extends React.Component {
  render() {
    return (
     
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center", alignItems: "center"}}>
          <Button
           
            onClick={() =>this.props.onNavigate('PREV')}
          >
           <ChevronLeft/>
          </Button>
          <span
            className="today-label"
            onClick={() => this.props.onNavigate('TODAY')}
          >
          </span>
          <h1>{this.props.label}</h1>
          <Button
           
            type="button"
            onClick={() => this.props.onNavigate('NEXT')}
          >
           
              <ChevronRight/>
        
          </Button>
        </Stack>
    
    );
  }
}