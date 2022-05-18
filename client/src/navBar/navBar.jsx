import React from "react";
import "./navbar.css";
import Header from './header/header';
import Login from "../shared/components/modal/login";
import ModalLogin from "../shared/components/modal/modalLogin";


function NavBar(){
    return(
        <>       
            <div className="wrapper">
                <Header name = "WITS Student Support Centre" />  
                <ModalLogin/>
            </div>
    </>
    );


    }

export default NavBar;


