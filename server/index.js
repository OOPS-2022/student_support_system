const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sdDataBase"
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));

//------------------------------------------------------------login
app.post("/apiLogin/getInfo",(req, res) => {
    const setlgEmail = req.body.setlgEmail;
    console.log( setlgEmail);
    const sqlLgget = "Select user_id, password, role from users where email = ?";
    db.query(sqlLgget,[setlgEmail],(err, result) => {
        console.log(result);
        res.send(result);
    });
});
//-------------------------------------------------------------end login

//-------------------------------------------------------------viewedit offence list
app.post("/adjustlist/select", (req, res)=> {
    const offencename = "Plagiarism";
    const sqlSelect = "SELECT offence_name FROM offence_list WHERE offence_name = ?";
    db.query(sqlSelect,[offencename],(err,result) =>{
        console.log(result);
    });
});
     
app.post("/adjustlist/insert", (req, res)=>{
    const offencename = req.body.offencename;
    const severity = req.body.severity;
    
    const sqlSelect = "SELECT offence_name FROM offence_list WHERE offence_name = ?";
    db.query(sqlSelect,[offencename],(err,result) => {
        console.log(err);
        res.send(result);
        let offlength = result.length;
        console.log(offlength);
        if  (offlength> 0){
            alert('Offense already added');
        } 
        else{
            const sqlinsert = "INSERT INTO offence_list(offence_name,severity) VALUES(?,?)";
            db.query(sqlinsert,[offencename,severity],[err,request ]);
            alert('New offence added');
        }
    });
});

app.post("/adjustlist/update",(req, res) =>{
    const severity = req.body.severity;
    const uOffencename = req.body.offencename;

    const sqlSelect = "SELECT FROM offence_list WHERE offence_name = ?";
    
    db.query(sqlSelect,[uOffencename],(err,result) => {
        let offlength = result.length;
        if  (offlength> 0){
            alert("Offence not found");
        }
        else{
            const sqlupdate= "UPDATE offence_list SET severity = ? WHERE offence_name = ?";
            db.query(sqlupdate,[severity,uOffencename],(err,result));
            alert("Offence updated");
        }
    });
    

});

app.post("/adjustlist/delete", (req, res) => {
    const dOffencename = req.body.offencename;
    const sqldelete= "DELETE FROM offence_list WHERE offence_name = ?";
    db.query(sqldelete,[dOffencename],(err,result));
    alert("Offence deleted")
});

//-------------------------------------------------------------end viewedit offence list

app.listen(3001,()=>{
    console.log("running on port 3001");
})