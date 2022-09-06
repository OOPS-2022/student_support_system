import React from "react";
import "./navbar.css";
import Header from './header/header';

import ModalLogin from "../shared/components/modal/modalLogin";
import ActivityCenter from "../activityCenter/activityCenter";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NavBar(){
    let navigate = useNavigate();
    const logOut =() => {
        sessionStorage.clear();
        navigate("/");
        window.location.reload();
        
        
        
    }

    return(
        <>       
            <div className="wrapper">
                <Header  name = "WITS STUDENT SUPPORT CENTRE" />  
                {!(sessionStorage.getItem("logged_id" ))  && (<ModalLogin/>)}
                {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  && (<ActivityCenter/>)}
                {(sessionStorage.getItem("logged_id" ))  && (<Button style={{color:"white", paddingLeft: "60%"}} onClick ={logOut}>Log out</Button>)}
                
            </div>
    </>
    );


    }

export default NavBar;


