import React from "react";
import ReactDOM from "react-dom";
import LogOffence from "./menu/logOffence/logOffence";
import Welcome from "./menu/welcome/welcome";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from "./website"
import Login from "./shared/components/modal/login"
import ClickTable from "./menu/possible/possible";
import { getTableRowUtilityClass, Modal } from "@mui/material";
import CustomTable from "./menu/table/table";
import ModalLogin from "./shared/components/modal/modalLogin";
import Axios from 'axios';

import Submitted from "./menu/submitted/submitted";
import Ticket from "./menu/tickets/tickets";
import Pledge from "./menu/pledges/pledges";
import CreateClickedPledge from "./menu/pledges/clicked";
import OI from "./menu/oimenu/oi";
import CreateTest from "./menu/createTest/createTest";
import DoTest from "./menu/doTest/doTest";
import MyOffence from "./menu/myOffences/myOffences";
import MyTickets from "./menu/myTickets/myTickets";






ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App page={<Welcome />} />}><Route path="/:Login" element={<ModalLogin />} /></Route>
            <Route path="/LogOffence" element={<App page={<LogOffence />} />} />
            <Route path="/PossibleOffences" element={<App page={<ClickTable page = "possible" />} />} />
            <Route path="/SubmittedOffences" element={<App page={<Submitted page = "submitted" />} />} />
            <Route path ="/Display" />
            <Route path ="/Ticket" element={<App page={<Ticket/>} />}  />
            <Route path ="/Pledge" element={<App page={<Pledge/>} />}  />
            <Route path ="/ClickedPledge" element={<App page={<CreateClickedPledge/>} />}  />
            <Route path ="/OIMenu" element={<App page={<OI/>} />}  />
            <Route path ="/CreateTest" element={<App page={<CreateTest/>} />}  />
            <Route path ="/DoTest" element={<App page={<DoTest/>} />}  />
            <Route path ="/MyOffences" element={<App page={<MyOffence/>} />}  />
            <Route path ="/MyTickets" element={<App page={<MyTickets/>} />}  />
        </Routes>
    </Router>
    , document.getElementById("root")
);



