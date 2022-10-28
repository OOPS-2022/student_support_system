import { Button, Icon, IconButton } from "@mui/material";
import React from "react";
import { ChevronLeft } from "@mui/icons-material";
import { ChevronRight } from "@mui/icons-material";
import { Stack } from "@mui/system";

export default class CustomHeader extends React.Component {
  render() {
    return (
    <div>
     <h3>{this.props.label}</h3>
     </div>
    );
  }
}