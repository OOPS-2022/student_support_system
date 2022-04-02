const express=require("express");
const app=express();

app.get('/', (req,res)=>{
    res.send('Hello wordl');
});

app.listen(3002, () =>{
    console.log('running on port 3001');
});