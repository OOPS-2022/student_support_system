import React from "react";
import "./navbar.css";
import Header from './header/header';
import Login from "../shared/components/modal/login";
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
                <Header name = "WITS Student Support Centre" />  
                {!(sessionStorage.getItem("logged_id" ))  && (<ModalLogin/>)}
                {(sessionStorage.getItem("logged_id" ))  && (<Button onClick ={logOut}>Log out</Button>)}
                {(sessionStorage.getItem("user_role") != "admin"  &&   (sessionStorage.getItem("logged_id" )))  && (<ActivityCenter/>)}
            </div>
    </>
    );


    }

export default NavBar;


