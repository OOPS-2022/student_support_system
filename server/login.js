function Login(database){
  const express = require("express");
  const router=express.Router();
  // console.log("hi")
  router.post("/", (req, res) => {
    if(Object.keys(req.body).length < 2){
      res.send(null);
    }else{
      const setlgEmail = req.body.setlgEmail;
      // res.sendStatus(200);
      const setlgPassword = req.body.setlgPassword;
      // // console.log(setlgEmail)
      database.Login(setlgEmail, setlgPassword, function(err, result){
        res.send(result);
      });


    }
  });


  return router;
}

module.exports= Login;
