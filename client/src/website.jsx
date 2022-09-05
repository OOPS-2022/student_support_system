import React from "react";
import Grid from '@mui/material/Grid';
import NavBar from "./navBar/navBar";
import Menu from "./menu/menu";
import Image from "./navBar/image/image";
import logo from "./wits_logo.png";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { Add } from "@mui/icons-material";




const actions = [
    { icon: <Add />, name: 'Copy' },
    { icon: <Add />, name: 'Save' },
    { icon: <Add />, name: 'Print' },
    { icon: <Add />, name: 'Share' },
  ];

function App(props){

return(
 <>
    
 <Grid container spacing={1}>
    
    <Grid item xs ={12}>
         <NavBar/>
     </Grid>
     <Grid item xl={2}>
         <Menu/>
     </Grid>
     <Grid  item xl={10}>
         {props.page}
     </Grid>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'sticky', bottom: "2%", left: "95%" }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon = {<Add/>}
            tooltipTitle={action.name}
            tooltipOpen
          />
        ))}
      </SpeedDial>
     
 </Grid>

 
 
 </>
);
}

export default App;