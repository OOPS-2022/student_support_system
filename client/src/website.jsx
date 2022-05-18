import React from "react";
import Grid from '@mui/material/Grid';
import NavBar from "./navBar/navBar";
import Menu from "./menu/menu"




function App(props){

return(
 <>
    
 <Grid container spacing={1}>
     <Grid item xs={12}>
         <NavBar/>
     </Grid>
     <Grid item xl={2}>
         <Menu/>
     </Grid>
     <Grid  item xl={10}>
         {props.page}
     </Grid>
 </Grid>
 
 </>
);
}

export default App;