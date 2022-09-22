import React from "react";
import ReactDOM from "react-dom";
import LogOffence from "./menu/logOffence/logOffence";
import Welcome from "./menu/welcome/welcome";

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';




import App from "./website"
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
import Sessions from "./menu/sessions/sessions";
import MySessions from "./menu/mySessions/mySessions";
import CheckList from "./menu/checkList/checkList";
import AddCheckList from "./menu/checkList/addCheckList";
import CheckTable from "./menu/checkTable/checkTable";
import SessionPledges from "./menu/mySessions/sessionPledges";
import EmbeddedSession from "./menu/mySessions/embedSession";


const ProtectedRoute = ({
    redirectPath = '/',
    children,
  }) => {
    if (!sessionStorage.getItem("auth")) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children;
  };


ReactDOM.render(

    <Router>
        <Routes>
            <Route path="/" element={<App page={<Welcome />} />}><Route path="/:Login" element={<ModalLogin />} /></Route>

            <Route path="/" element={<App page={<Welcome />} />} />
           
         


                <Route path="/LogOffence" element={<ProtectedRoute><App page={<LogOffence />} /></ProtectedRoute>} />
                <Route path="/PossibleOffences" element={<ProtectedRoute><App page={<ClickTable page="possible" />} /></ProtectedRoute>} />
                <Route path="/SubmittedOffences" element={<ProtectedRoute><App page={<Submitted page="submitted" />} /> </ProtectedRoute>} />
                <Route path="/Ticket" element={<ProtectedRoute><App page={<Ticket />} /> </ProtectedRoute>} />
                <Route path="/Pledge" element={<ProtectedRoute><App page={<Pledge />} /> </ProtectedRoute>} />
                <Route path="/ClickedPledge" element={<ProtectedRoute><App page={<CreateClickedPledge />} /> </ProtectedRoute>} />
                <Route path="/OIMenu" element={<ProtectedRoute><App page={<OI />} /> </ProtectedRoute>} />
                <Route path="/CreateTest" element={<ProtectedRoute><App page={<CreateTest />} /> </ProtectedRoute>} />
                <Route path="/DoTest" element={<ProtectedRoute><App page={<DoTest />} /> </ProtectedRoute>} />
                <Route path="/MyOffences" element={<ProtectedRoute><App page={<MyOffence />} /> </ProtectedRoute>} />
                <Route path="/MyTickets" element={<ProtectedRoute><App page={<MyTickets />} /> </ProtectedRoute>} />
                <Route path="/MySessions" element={<ProtectedRoute><App page={<MySessions />} /> </ProtectedRoute>} />
                <Route path="/Sessions" element={<ProtectedRoute><App page={<Sessions />} /> </ProtectedRoute>} />
                <Route path="/CheckList" element={<ProtectedRoute><App page={<CheckList />} /> </ProtectedRoute>} />
                <Route path="/AddCheckList" element={<ProtectedRoute><App page={<AddCheckList />} /></ProtectedRoute>} />
                <Route path="/CheckedSessions" element={<ProtectedRoute><App page={<CheckTable />} /></ProtectedRoute>} />
                <Route path="/SessionPledges" element={<ProtectedRoute><App page={<SessionPledges />} /></ProtectedRoute>} />
                <Route path ="/EmbeddedSession:id" element={<EmbeddedSession/>}   />

           
           
        </Routes>
    </Router>
    , document.getElementById("root")
);



